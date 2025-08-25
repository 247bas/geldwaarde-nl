'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface MetalPrices {
  gold: number;
  silver: number;
  cached: boolean;
  lastUpdated: string;
  dataDate?: string;
  source?: string;
  isStale?: boolean;
  error?: string;
}

interface PricesContextType {
  prices: MetalPrices | null;
  loading: boolean;
  error: string | null;
  refreshPrices: () => Promise<void>;
}

const PricesContext = createContext<PricesContextType | undefined>(undefined);

export function PricesProvider({ children }: { children: ReactNode }) {
  const [prices, setPrices] = useState<MetalPrices | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = async () => {
    try {
      setError(null);
      const response = await fetch('/api/prices');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: MetalPrices = await response.json();
      setPrices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prices');
    } finally {
      setLoading(false);
    }
  };

  const refreshPrices = async () => {
    setLoading(true);
    await fetchPrices();
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  return (
    <PricesContext.Provider value={{ prices, loading, error, refreshPrices }}>
      {children}
    </PricesContext.Provider>
  );
}

export function usePrices() {
  const context = useContext(PricesContext);
  if (context === undefined) {
    throw new Error('usePrices must be used within a PricesProvider');
  }
  return context;
}