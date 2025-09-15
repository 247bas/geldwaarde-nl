import { NextResponse } from 'next/server';
import { getPrices } from '@/lib/prices';

export async function GET() {
  try {
    // Gebruik de shared cache via getPrices() met strict rate limiting
    const pricesData = await getPrices();

    // Sanitize response - only expose necessary information
    const response: any = {
      gold: pricesData.gold,
      silver: pricesData.silver,
      cached: pricesData.cached || false,
      lastUpdated: new Date(pricesData.lastUpdated).toISOString(),
      dataDate: pricesData.dataDate,
      source: pricesData.source,
      isStale: pricesData.isStale || false,
      currency: 'EUR',
      unit: 'gram',
    };

    // Only include rate limiting info in development
    if (process.env.NODE_ENV !== 'production') {
      response.rateLimited = pricesData.rateLimited || false;
      response.lastApiCall = pricesData.lastApiCall ? new Date(pricesData.lastApiCall).toISOString() : undefined;
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error in prices API:', error);

    return NextResponse.json({
      gold: 91.63,
      silver: 1.044,
      cached: true,
      error: 'Failed to fetch prices from shared cache',
      lastUpdated: new Date().toISOString(),
      dataDate: new Date().toISOString().split('T')[0],
      source: 'fallback estimate',
      isStale: true,
      rateLimited: false,
      currency: 'EUR',
      unit: 'gram',
    });
  }
}