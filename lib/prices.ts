import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface PriceData {
  gold: number;
  silver: number;
  lastUpdated: number;
  dataDate: string;
  source: string;
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 uur voor alle environments

const CACHE_FILE = join(process.cwd(), 'price-cache.json');

// In-memory cache voor server
let priceCache: PriceData | null = null;

// Laad cache uit bestand
function loadCacheFromFile(): PriceData | null {
  try {
    if (existsSync(CACHE_FILE)) {
      const fileContent = readFileSync(CACHE_FILE, 'utf-8');
      const cachedData = JSON.parse(fileContent);
      console.log('Loaded prices from cache file:', cachedData);
      return cachedData;
    }
  } catch (error) {
    console.error('Error loading price cache:', error);
  }
  return null;
}

// Bewaar cache naar bestand
function saveCacheToFile(data: PriceData) {
  try {
    writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
    console.log('Saved prices to cache file:', data);
  } catch (error) {
    console.error('Error saving price cache:', error);
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
  console.log('MetalPrice API response:', data);
  
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
 */
export async function getPrices(): Promise<PriceData & { cached: boolean; isStale?: boolean }> {
  const now = Date.now();
  
  // Laad cache als niet in memory
  if (!priceCache) {
    priceCache = loadCacheFromFile();
  }
  
  // Check cache geldigheid
  if (priceCache && (now - priceCache.lastUpdated) < CACHE_DURATION) {
    console.log('Using cached prices - Age:', Math.floor((now - priceCache.lastUpdated) / 1000 / 60), 'minutes');
    return {
      ...priceCache,
      cached: true
    };
  }
  
  // Fetch nieuwe prijzen
  try {
    const freshData = await fetchMetalPriceApiData();
    priceCache = freshData;
    saveCacheToFile(freshData);
    
    console.log('Successfully fetched fresh prices:', freshData);
    return {
      ...freshData,
      cached: false
    };
  } catch (error) {
    console.error('Failed to fetch fresh prices:', error);
    
    // Fallback naar laatste bekende prijzen
    const fallbackData = getLastKnownPrices();
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