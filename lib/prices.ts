import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface PriceData {
  gold: number;
  silver: number;
  lastUpdated: number;
  dataDate: string;
  source: string;
  lastApiCall?: number; // Timestamp van laatste API call (voor rate limiting)
}

// 24 uur cache voor alle environments (API limit: max 1 call per dag)
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 uur voor alle environments

// Minimum tijd tussen API calls (strict 24-hour limiting)
const MIN_API_INTERVAL = 24 * 60 * 60 * 1000; // 24 uur

const CACHE_FILE = join(process.cwd(), 'price-cache.json');

// In-memory cache voor server
let priceCache: PriceData | null = null;

// Laad cache uit bestand (optioneel - werkt niet op Vercel)
function loadCacheFromFile(): PriceData | null {
  try {
    // Check if we're in a serverless environment (Vercel)
    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
      console.log('Serverless environment detected - skipping file cache');
      return null;
    }

    if (existsSync(CACHE_FILE)) {
      const fileContent = readFileSync(CACHE_FILE, 'utf-8');
      const cachedData = JSON.parse(fileContent);
      if (process.env.NODE_ENV !== 'production') {
        console.log('Loaded prices from cache file:', cachedData);
      }
      return cachedData;
    }
  } catch (error) {
    console.log('File cache not available (expected in serverless):', error instanceof Error ? error.message : 'Unknown error');
  }
  return null;
}

// Bewaar cache naar bestand (optioneel - werkt niet op Vercel)
function saveCacheToFile(data: PriceData) {
  try {
    // Check if we're in a serverless environment (Vercel)
    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
      console.log('Serverless environment - skipping file cache save');
      return;
    }

    writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
    if (process.env.NODE_ENV !== 'production') {
      console.log('Saved prices to cache file:', data);
    }
  } catch (error) {
    console.log('Could not save to file cache (expected in serverless):', error instanceof Error ? error.message : 'Unknown error');
  }
}

// Fetch fresh data from MetalPrice API
async function fetchMetalPriceApiData(): Promise<PriceData> {
  const apiKey = process.env.METALPRICE_API_KEY;
  
  if (!apiKey) {
    console.log('No METALPRICE_API_KEY found');
    throw new Error('API key not configured');
  }

  console.log('Fetching prices from metalpriceapi.com...');
  
  // Voor development/testing - simuleer API response
  if (apiKey === 'test-key-voor-ontwikkeling') {
    console.log('Using test data for development');
    const testData = {
      success: true,
      timestamp: Math.floor(Date.now() / 1000),
      rates: {
        XAU: 2234.567, // EUR per troy ounce goud (voorbeeld)
        XAG: 26.789    // EUR per troy ounce zilver (voorbeeld)
      }
    };
    
    const goldPricePerGram = testData.rates.XAU / 31.1035;
    const silverPricePerGram = testData.rates.XAG / 31.1035;
    
    const dataTimestamp = testData.timestamp * 1000;
    const dataDate = new Date(dataTimestamp - 24 * 60 * 60 * 1000); // Gisteren
    
    return {
      gold: parseFloat(goldPricePerGram.toFixed(2)),
      silver: parseFloat(silverPricePerGram.toFixed(3)),
      dataDate: dataDate.toISOString().split('T')[0],
      source: 'metalpriceapi.com (test data)',
      lastUpdated: Date.now()
    };
  }
  
  const response = await fetch(
    `https://api.metalpriceapi.com/v1/latest?api_key=${apiKey}&base=EUR&currencies=EUR,XAU,XAG`,
    {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Geldwaarde.nl/1.0'
      },
      // Timeout na 15 seconden
      signal: AbortSignal.timeout(15000)
    }
  );
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  if (process.env.NODE_ENV !== 'production') {
    console.log('MetalPrice API response:', data);
  }
  
  if (data.success && data.rates) {
    // Gebruik de juiste velden: EURXAU en EURXAG
    const goldPricePerGram = data.rates.EURXAU / 31.1035;
    const silverPricePerGram = data.rates.EURXAG / 31.1035;
    
    // Bereken datum van de data (gisteren bij gratis account)
    const dataTimestamp = data.timestamp * 1000;
    const dataDate = new Date(dataTimestamp);
    
    return {
      gold: parseFloat(goldPricePerGram.toFixed(2)),
      silver: parseFloat(silverPricePerGram.toFixed(3)),
      dataDate: dataDate.toISOString().split('T')[0],
      source: 'metalpriceapi.com',
      lastUpdated: Date.now()
    };
  } else {
    console.error('MetalPrice API response error:', data);
    throw new Error(data.error?.message || 'Invalid API response');
  }
}

// Fallback naar laatste bekende prijzen
function getLastKnownPrices(): PriceData {
  const cached = priceCache || loadCacheFromFile();
  
  if (cached) {
    console.log('Using last known prices from cache');
    return {
      ...cached,
      source: `${cached.source} (cached)`
    };
  }
  
  // Als er geen cache is, gebruik conservatieve fallback prijzen
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  return {
    gold: 91.63,
    silver: 1.044,
    dataDate: yesterday.toISOString().split('T')[0],
    source: 'fallback estimate',
    lastUpdated: Date.now()
  };
}

/**
 * Hoofdfunctie: Haal huidige edelmetaalprijzen op
 * Gebruikt server-side caching en fallback strategieën
 * STRICT 24-hour API limiting: maximum 1 API call per dag
 */
export async function getPrices(forceRefresh: boolean = false): Promise<PriceData & { cached: boolean; isStale?: boolean; rateLimited?: boolean }> {
  const now = Date.now();
  const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

  // Laad cache als niet in memory (alleen voor lokale environments)
  if (!priceCache && !isServerless) {
    priceCache = loadCacheFromFile();
  }

  // Check cache geldigheid (24 uur)
  if (priceCache && (now - priceCache.lastUpdated) < CACHE_DURATION && !forceRefresh) {
    const ageHours = Math.floor((now - priceCache.lastUpdated) / 1000 / 60 / 60);
    console.log(`Using ${isServerless ? 'in-memory' : 'cached'} prices - Age: ${ageHours} hours`);
    return {
      ...priceCache,
      cached: true
    };
  }

  // STRICT API RATE LIMITING: Check 24-hour interval since last API call
  if (priceCache?.lastApiCall && (now - priceCache.lastApiCall) < MIN_API_INTERVAL && !forceRefresh) {
    const hoursUntilNext = Math.ceil((MIN_API_INTERVAL - (now - priceCache.lastApiCall)) / 1000 / 60 / 60);
    console.log(`API rate limit: ${hoursUntilNext} hours until next API call allowed`);

    return {
      ...priceCache,
      cached: true,
      isStale: true,
      rateLimited: true
    };
  }

  // Alleen nu mogen we een API call maken
  try {
    console.log('Fetching fresh prices from API (within rate limit)...');
    const freshData = await fetchMetalPriceApiData();

    // Voeg API call timestamp toe voor rate limiting
    const dataWithApiCall = {
      ...freshData,
      lastApiCall: now
    };

    priceCache = dataWithApiCall;

    // Alleen opslaan naar bestand in lokale environments
    if (!isServerless) {
      saveCacheToFile(dataWithApiCall);
    }

    console.log('Successfully fetched fresh prices within rate limit');
    return {
      ...dataWithApiCall,
      cached: false
    };
  } catch (error) {
    console.error('Failed to fetch fresh prices:', error);

    // Fallback naar laatste bekende prijzen
    const fallbackData = getLastKnownPrices();
    console.log('Using fallback prices due to API error');
    return {
      ...fallbackData,
      cached: true,
      isStale: true
    };
  }
}

/**
 * Mockprijzen als absolute fallback
 */
export const mockPrices = {
  gold: 91.63,
  silver: 1.044
};