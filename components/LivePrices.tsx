'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, RefreshCw, AlertCircle } from 'lucide-react';
// import { usePrices } from '@/contexts/PricesContext';

interface MetalPrices {
  gold: number;
  silver: number;
  cached: boolean;
  lastUpdated: string;
  dataDate?: string; // YYYY-MM-DD format van de prijsdata
  source?: string; // Bron van de data
  isStale?: boolean; // Of de data verouderd/fallback is
  error?: string;
}

interface LivePricesProps {
  showDetails?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
}

export function LivePrices({ 
  showDetails = false, 
  autoRefresh = true, 
  refreshInterval = 300000 // 5 minuten default
}: LivePricesProps) {
  const [prices, setPrices] = useState<MetalPrices | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const fetchPrices = async () => {
    try {
      setError(null);
      const response = await fetch('/api/prices');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: MetalPrices = await response.json();
      setPrices(data);
      setLastFetch(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prices');
    } finally {
      setLoading(false);
    }
  };

  const handleManualRefresh = () => {
    setLoading(true);
    fetchPrices();
  };

  useEffect(() => {
    // Initial fetch
    fetchPrices();

    // Setup auto-refresh
    if (autoRefresh) {
      const interval = setInterval(fetchPrices, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const formatPrice = (price: number, decimals: number = 2) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(price);
  };

  const formatLastUpdated = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('nl-NL', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    }).format(date);
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMinutes = Math.floor((now.getTime() - then.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'zojuist';
    if (diffMinutes < 60) return `${diffMinutes} min geleden`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} uur geleden`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} dag${diffDays > 1 ? 'en' : ''} geleden`;
  };

  if (loading && !prices) {
    return (
      <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-lg shadow animate-pulse">
        <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
        <div className="w-32 h-4 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error && !prices) {
    return (
      <div className="flex items-center gap-3 bg-red-50 border border-red-200 px-6 py-3 rounded-lg">
        <AlertCircle className="w-5 h-5 text-red-600" />
        <span className="text-red-700 text-sm">Fout bij laden prijzen: {error}</span>
        <button
          onClick={handleManualRefresh}
          className="ml-2 text-red-600 hover:text-red-800 transition"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (!prices) return null;

  return (
    <div className="space-y-3">
      {/* Compact Price Display */}
      <div className="flex gap-6 justify-center">
        <div className="bg-white rounded-lg shadow-md px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Goud</span>
            {prices.cached && (
              <span className="text-xs text-gray-400">(cached)</span>
            )}
          </div>
          <p className="text-2xl font-bold text-yellow-600">
            {formatPrice(prices.gold)}
          </p>
          <p className="text-xs text-gray-500">per gram</p>
        </div>

        <div className="bg-white rounded-lg shadow-md px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span className="text-sm text-gray-600">Zilver</span>
            {prices.cached && (
              <span className="text-xs text-gray-400">(cached)</span>
            )}
          </div>
          <p className="text-2xl font-bold text-gray-700">
            {formatPrice(prices.silver, 3)}
          </p>
          <p className="text-xs text-gray-500">per gram</p>
        </div>
      </div>

      {/* Detailed Information */}
      {showDetails && (
        <div className="bg-gray-50 rounded-lg p-4 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">
                {prices.dataDate ? (
                  <span>Prijsdata van: {new Date(prices.dataDate).toLocaleDateString('nl-NL')}</span>
                ) : (
                  <span>Laatst bijgewerkt: {formatLastUpdated(prices.lastUpdated)}</span>
                )}
              </span>
              {!prices.dataDate && (
                <span className="text-gray-500">
                  ({getTimeAgo(prices.lastUpdated)})
                </span>
              )}
            </div>
            
            <button
              onClick={handleManualRefresh}
              disabled={loading}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-800 transition disabled:opacity-50"
              title="Prijzen vernieuwen"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Vernieuwen</span>
            </button>
          </div>

          {/* Data bron en status */}
          <div className="mt-3 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              {prices.source && (
                <span>Bron: {prices.source}</span>
              )}
              {prices.isStale && (
                <span className="text-amber-600 ml-2">🔄 Laatst bekende data</span>
              )}
            </div>
            <div className="text-xs text-gray-500">
              Update: {refreshInterval >= 3600000 ? 'dagelijks' : `elke ${Math.floor(refreshInterval / 60000)} min`}
            </div>
          </div>

          {prices.error && (
            <div className="mt-2 text-amber-600 text-xs">
              Waarschuwing: {prices.error}
            </div>
          )}

          {prices.dataDate && (
            <div className="mt-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
              ℹ️ Prijzen zijn 1-dag vertraagd voor stabiliteit en betrouwbaarheid
            </div>
          )}
        </div>
      )}

      {/* Last Local Fetch Time */}
      {lastFetch && showDetails && (
        <div className="text-xs text-gray-400 text-center">
          Lokaal opgehaald: {lastFetch.toLocaleTimeString('nl-NL')}
        </div>
      )}
    </div>
  );
}