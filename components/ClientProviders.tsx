'use client';

import { PricesProvider } from '@/contexts/PricesContext';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <PricesProvider>
      {children}
    </PricesProvider>
  );
}