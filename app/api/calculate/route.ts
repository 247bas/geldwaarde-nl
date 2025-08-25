import { NextResponse } from 'next/server';
import { getPrices } from '@/lib/prices';

interface CalculationRequest {
  coinId: string;
  variantId: string;
  quantity?: number;
  customPrices?: {
    gold?: number;
    silver?: number;
  };
}

interface CoinVariant {
  id: string;
  weightGrams: number;
  goldPercentage?: number;
  silverPercentage?: number;
  variantName: string;
  yearFrom: number;
  yearTo?: number;
}

interface Coin {
  id: string;
  name: string;
  metalType: 'GOLD' | 'SILVER';
  variants: CoinVariant[];
}

// Mock data - dezelfde als in coins API
const mockCoins: Coin[] = [
  {
    id: '1',
    name: 'Gouden Tientje',
    metalType: 'GOLD',
    variants: [
      { id: '1-1', yearFrom: 1875, yearTo: 1889, variantName: 'Willem III', weightGrams: 6.72, goldPercentage: 90.0 },
      { id: '1-2', yearFrom: 1897, variantName: 'Wilhelmina (jong)', weightGrams: 6.72, goldPercentage: 90.0 },
      { id: '1-3', yearFrom: 1911, yearTo: 1933, variantName: 'Wilhelmina (oud)', weightGrams: 6.72, goldPercentage: 90.0 }
    ]
  },
  {
    id: '2',
    name: 'Gouden Vijfje',
    metalType: 'GOLD',
    variants: [
      { id: '2-1', yearFrom: 1912, yearTo: 1933, variantName: 'Wilhelmina', weightGrams: 3.36, goldPercentage: 90.0 }
    ]
  },
  {
    id: '3',
    name: 'Zilveren Gulden',
    metalType: 'SILVER',
    variants: [
      { id: '3-1', yearFrom: 1818, yearTo: 1837, variantName: 'Willem I', weightGrams: 10.76, silverPercentage: 89.3 },
      { id: '3-2', yearFrom: 1840, yearTo: 1849, variantName: 'Willem II', weightGrams: 10.0, silverPercentage: 94.5 },
      { id: '3-3', yearFrom: 1850, yearTo: 1890, variantName: 'Willem III', weightGrams: 10.0, silverPercentage: 94.5 },
      { id: '3-4', yearFrom: 1892, yearTo: 1919, variantName: 'Wilhelmina (jong)', weightGrams: 10.0, silverPercentage: 94.5 },
      { id: '3-5', yearFrom: 1922, yearTo: 1945, variantName: 'Wilhelmina (oud)', weightGrams: 6.5, silverPercentage: 72.0 },
      { id: '3-6', yearFrom: 1954, yearTo: 1967, variantName: 'Juliana', weightGrams: 6.5, silverPercentage: 72.0 }
    ]
  },
  {
    id: '4',
    name: 'Zilveren Rijksdaalder',
    metalType: 'SILVER',
    variants: [
      { id: '4-1', yearFrom: 1840, yearTo: 1849, variantName: 'Willem II', weightGrams: 25.0, silverPercentage: 94.5 },
      { id: '4-2', yearFrom: 1850, yearTo: 1874, variantName: 'Willem III', weightGrams: 25.0, silverPercentage: 94.5 }
    ]
  },
  {
    id: '5',
    name: 'Zilveren Tientje',
    metalType: 'SILVER',
    variants: [
      { id: '5-1', yearFrom: 1973, variantName: 'Juliana 25 jaar', weightGrams: 25.0, silverPercentage: 72.0 },
      { id: '5-2', yearFrom: 1970, variantName: 'Bevrijding', weightGrams: 25.0, silverPercentage: 72.0 },
      { id: '5-3', yearFrom: 1994, yearTo: 2001, variantName: 'Beatrix serie', weightGrams: 15.0, silverPercentage: 92.5 }
    ]
  },
  {
    id: '6',
    name: 'Zilveren Vijftig Gulden',
    metalType: 'SILVER',
    variants: [
      { id: '6-1', yearFrom: 1982, yearTo: 1998, variantName: 'Diverse herdenkingen', weightGrams: 25.0, silverPercentage: 92.5 }
    ]
  },
  {
    id: '7',
    name: 'Zilveren Kwartje',
    metalType: 'SILVER',
    variants: [
      { id: '7-1', yearFrom: 1850, yearTo: 1890, variantName: 'Willem III', weightGrams: 3.18, silverPercentage: 64.0 },
      { id: '7-2', yearFrom: 1892, yearTo: 1919, variantName: 'Wilhelmina (jong)', weightGrams: 3.18, silverPercentage: 64.0 },
      { id: '7-3', yearFrom: 1926, yearTo: 1941, variantName: 'Wilhelmina (oud)', weightGrams: 3.18, silverPercentage: 64.0 }
    ]
  }
];

// Functie om huidige metaalprijzen op te halen uit de shared cache
async function getCurrentPrices() {
  try {
    const pricesData = await getPrices();
    return {
      gold: pricesData.gold,
      silver: pricesData.silver
    };
  } catch (error) {
    console.error('Error fetching prices from shared cache:', error);
    // Fallback prijzen
    return {
      gold: 91.63,
      silver: 1.044
    };
  }
}

export async function POST(request: Request) {
  try {
    // Body size validatie (max 1KB)
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 1024) {
      return NextResponse.json(
        { error: 'Request body too large' },
        { status: 413 }
      );
    }

    const body: CalculationRequest = await request.json();
    
    // Validatie van required velden
    if (!body.coinId || !body.variantId) {
      return NextResponse.json(
        { error: 'Missing required fields: coinId and variantId' },
        { status: 400 }
      );
    }

    // Validatie van data types en ranges
    if (typeof body.coinId !== 'string' || typeof body.variantId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid data types for coinId or variantId' },
        { status: 400 }
      );
    }

    // Validatie van quantity
    if (body.quantity !== undefined) {
      if (typeof body.quantity !== 'number' || body.quantity < 1 || body.quantity > 10000) {
        return NextResponse.json(
          { error: 'Quantity must be a number between 1 and 10000' },
          { status: 400 }
        );
      }
    }

    // Validatie van custom prices
    if (body.customPrices) {
      if (body.customPrices.gold !== undefined) {
        if (typeof body.customPrices.gold !== 'number' || body.customPrices.gold < 0 || body.customPrices.gold > 1000) {
          return NextResponse.json(
            { error: 'Invalid gold price: must be between 0 and 1000' },
            { status: 400 }
          );
        }
      }
      if (body.customPrices.silver !== undefined) {
        if (typeof body.customPrices.silver !== 'number' || body.customPrices.silver < 0 || body.customPrices.silver > 100) {
          return NextResponse.json(
            { error: 'Invalid silver price: must be between 0 and 100' },
            { status: 400 }
          );
        }
      }
    }

    // Sanitize string inputs
    const coinId = body.coinId.trim().slice(0, 10); // Max 10 chars
    const variantId = body.variantId.trim().slice(0, 10); // Max 10 chars

    // Zoek de munt en variant met gesanitiseerde IDs
    const coin = mockCoins.find(c => c.id === coinId);
    if (!coin) {
      return NextResponse.json(
        { error: 'Coin not found' },
        { status: 404 }
      );
    }

    const variant = coin.variants.find(v => v.id === variantId);
    if (!variant) {
      return NextResponse.json(
        { error: 'Variant not found' },
        { status: 404 }
      );
    }

    // Haal actuele prijzen op (of gebruik custom prijzen)
    const prices = body.customPrices || await getCurrentPrices();
    const quantity = body.quantity || 1;

    // Bereken metaalwaarde
    let metalValue = 0;
    let metalType = '';
    let pureMetalWeight = 0;
    let metalPercentage = 0;

    if (coin.metalType === 'GOLD' && variant.goldPercentage) {
      metalType = 'goud';
      metalPercentage = variant.goldPercentage;
      pureMetalWeight = variant.weightGrams * (variant.goldPercentage / 100);
      metalValue = pureMetalWeight * prices.gold;
    } else if (coin.metalType === 'SILVER' && variant.silverPercentage) {
      metalType = 'zilver';
      metalPercentage = variant.silverPercentage;
      pureMetalWeight = variant.weightGrams * (variant.silverPercentage / 100);
      metalValue = pureMetalWeight * prices.silver;
    }

    const totalValue = metalValue * quantity;

    // Bereken geschatte verzamelwaarde (simpele heuristiek)
    let collectorsValueMultiplier = 1.0;
    
    // Factoren die verzamelwaarde beïnvloeden:
    // - Zeldzaamheid (vroege/late jaren)
    // - Gouden munten hebben meestal hogere premie
    // - Specifieke munttypen
    
    if (coin.metalType === 'GOLD') {
      collectorsValueMultiplier = 1.1; // 10% premie voor goud
    }
    
    // Willem I en vroege jaren premie
    if (variant.variantName.includes('Willem I') || variant.yearFrom < 1850) {
      collectorsValueMultiplier += 0.15;
    }
    
    // Zeldzame jaren (1897 Wilhelmina jong)
    if (variant.yearFrom === 1897) {
      collectorsValueMultiplier += 0.25;
    }

    const estimatedCollectorsValue = totalValue * collectorsValueMultiplier;

    return NextResponse.json({
      calculation: {
        coin: {
          id: coin.id,
          name: coin.name,
          metalType: coin.metalType
        },
        variant: {
          id: variant.id,
          name: variant.variantName,
          years: variant.yearTo ? `${variant.yearFrom}-${variant.yearTo}` : variant.yearFrom.toString(),
          weight: variant.weightGrams,
          metalPercentage
        },
        quantity,
        metalPrices: {
          gold: prices.gold,
          silver: prices.silver,
          currency: 'EUR',
          unit: 'gram'
        },
        values: {
          pureMetalWeight: parseFloat((pureMetalWeight * quantity).toFixed(3)),
          metalType,
          intrinsicValue: parseFloat(totalValue.toFixed(2)),
          estimatedCollectorsValue: parseFloat(estimatedCollectorsValue.toFixed(2)),
          premiumPercentage: parseFloat(((collectorsValueMultiplier - 1) * 100).toFixed(1))
        },
        calculatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error in calculation API:', error);
    return NextResponse.json(
      { error: 'Failed to calculate coin value' },
      { status: 500 }
    );
  }
}

// GET endpoint voor bulk berekeningen (collectie)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const coinIds = searchParams.get('coinIds')?.split(',') || [];
    
    if (coinIds.length === 0) {
      return NextResponse.json(
        { error: 'No coin IDs provided' },
        { status: 400 }
      );
    }

    const prices = await getCurrentPrices();
    const calculations = [];
    let totalValue = 0;

    for (const coinId of coinIds) {
      const coin = mockCoins.find(c => c.id === coinId);
      if (!coin) continue;

      // Voor bulk berekening nemen we de eerste variant
      const variant = coin.variants[0];
      
      let metalValue = 0;
      if (coin.metalType === 'GOLD' && variant.goldPercentage) {
        const pureWeight = variant.weightGrams * (variant.goldPercentage / 100);
        metalValue = pureWeight * prices.gold;
      } else if (coin.metalType === 'SILVER' && variant.silverPercentage) {
        const pureWeight = variant.weightGrams * (variant.silverPercentage / 100);
        metalValue = pureWeight * prices.silver;
      }

      calculations.push({
        coinId: coin.id,
        coinName: coin.name,
        value: parseFloat(metalValue.toFixed(2))
      });

      totalValue += metalValue;
    }

    return NextResponse.json({
      summary: {
        totalCoins: calculations.length,
        totalValue: parseFloat(totalValue.toFixed(2)),
        averageValue: parseFloat((totalValue / calculations.length).toFixed(2)),
        currency: 'EUR'
      },
      calculations,
      prices,
      calculatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in bulk calculation:', error);
    return NextResponse.json(
      { error: 'Failed to calculate collection value' },
      { status: 500 }
    );
  }
}