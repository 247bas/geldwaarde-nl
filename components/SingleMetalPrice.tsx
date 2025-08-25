interface PriceData {
  gold: number;
  silver: number;
  cached?: boolean;
  dataDate?: string;
  source?: string;
  isStale?: boolean;
}

interface SingleMetalPriceProps {
  pricesData?: PriceData;
  metalType?: 'gold' | 'silver';
  price?: number;
  metal?: 'gold' | 'silver';
  showDetails?: boolean;
  className?: string;
}

export function SingleMetalPrice({ 
  pricesData, 
  metalType, 
  price: directPrice, 
  metal, 
  showDetails = true,
  className = ''
}: SingleMetalPriceProps) {
  // Support both old and new API
  const effectiveMetalType = metalType || metal || 'gold';
  const effectivePricesData = pricesData || { gold: 0, silver: 0 };
  const formatPrice = (price: number, decimals: number = 2) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(price);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Onbekend';
    try {
      return new Date(dateString).toLocaleDateString('nl-NL');
    } catch {
      return dateString;
    }
  };

  const price = directPrice || (effectiveMetalType === 'gold' ? effectivePricesData.gold : effectivePricesData.silver);
  const decimals = effectiveMetalType === 'silver' ? 3 : 2;
  const color = effectiveMetalType === 'gold' ? 'text-yellow-600' : 'text-gray-600';
  const bgColor = effectiveMetalType === 'gold' ? 'bg-yellow-500' : 'bg-gray-400';
  const metalName = effectiveMetalType === 'gold' ? 'Goud' : 'Zilver';

  // If only price is provided, return simple price display
  if (directPrice && !pricesData && !showDetails) {
    return (
      <span className={`${color} font-bold ${className}`}>
        {formatPrice(price, decimals)}
      </span>
    );
  }

  return (
    <div className="space-y-3">
      {/* Single Metal Price Display */}
      <div className="flex justify-center">
        <div className="bg-white rounded-lg shadow-md px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-4 h-4 ${bgColor} rounded-full`}></div>
            <span className="text-lg font-medium text-gray-700">{metalName}prijs</span>
          </div>
          <p className={`text-4xl font-bold ${color}`}>
            {formatPrice(price, decimals)}
          </p>
          <p className="text-sm text-gray-500 mt-1">per gram</p>
        </div>
      </div>

      {/* Detailed Information */}
      {showDetails && pricesData && (
        <div className="bg-gray-50 rounded-lg p-4 text-sm max-w-2xl mx-auto">
          <div className="text-center space-y-2">
            <div className="text-gray-700">
              {pricesData.dataDate ? (
                <span>Prijsdata van: {formatDate(pricesData.dataDate)}</span>
              ) : (
                <span>Dagelijks bijgewerkte prijzen</span>
              )}
            </div>

            {/* Data bron en status */}
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <div>
                {pricesData.source && (
                  <span>Bron: {pricesData.source}</span>
                )}
                {pricesData.isStale && (
                  <span className="text-amber-600 ml-2">🔄 Laatst bekende data</span>
                )}
              </div>
              <div>
                Dagelijks bijgewerkt
              </div>
            </div>

            {pricesData.dataDate && (
              <div className="text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded">
                ℹ️ Prijzen zijn 1-dag vertraagd voor stabiliteit en betrouwbaarheid
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}