import { NextRequest, NextResponse } from 'next/server';
import { getPrices } from '@/lib/prices';

/**
 * Manual price update endpoint with admin authentication
 * POST /api/prices/update
 * Requires ADMIN_KEY in headers for security
 * Forces refresh regardless of rate limits (use sparingly!)
 */
export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const adminKey = request.headers.get('x-admin-key') || request.headers.get('authorization')?.replace('Bearer ', '');
    const expectedAdminKey = process.env.ADMIN_KEY;

    if (!expectedAdminKey) {
      return NextResponse.json(
        { error: 'Admin functionality not configured' },
        { status: 503 }
      );
    }

    if (!adminKey || adminKey !== expectedAdminKey) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid admin key' },
        { status: 401 }
      );
    }

    // Force refresh prices (bypasses rate limiting)
    console.log('Admin-requested price update...');
    const pricesData = await getPrices(true); // forceRefresh = true

    return NextResponse.json({
      message: 'Prices updated successfully',
      gold: pricesData.gold,
      silver: pricesData.silver,
      cached: pricesData.cached || false,
      lastUpdated: new Date(pricesData.lastUpdated).toISOString(),
      dataDate: pricesData.dataDate,
      source: pricesData.source,
      isStale: pricesData.isStale || false,
      rateLimited: pricesData.rateLimited || false,
      lastApiCall: pricesData.lastApiCall ? new Date(pricesData.lastApiCall).toISOString() : undefined,
      currency: 'EUR',
      unit: 'gram',
    });

  } catch (error) {
    console.error('Error in admin price update:', error);

    return NextResponse.json({
      error: 'Failed to update prices',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Only allow POST method
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST with admin key.' },
    { status: 405 }
  );
}