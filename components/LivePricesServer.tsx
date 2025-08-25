interface PriceData {
  gold: number;
  silver: number;
  cached?: boolean;
  dataDate?: string;
  source?: string;
  isStale?: boolean;
}

interface LivePricesServerProps {
  pricesData: PriceData;
  showDetails?: boolean;
}

export function LivePricesServer({ pricesData, showDetails = false }: LivePricesServerProps) {
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

  return (
    <div className="space-y-3">
      {/* Compact Price Display */}
      <div className="flex gap-6 justify-center">
        <div className="bg-white rounded-lg shadow-md px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Goud</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600">
            {formatPrice(pricesData.gold)}
          </p>
          <p className="text-xs text-gray-500">per gram</p>
        </div>

        <div className="bg-white rounded-lg shadow-md px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span className="text-sm text-gray-600">Zilver</span>
          </div>
          <p className="text-2xl font-bold text-gray-700">
            {formatPrice(pricesData.silver, 3)}
          </p>
          <p className="text-xs text-gray-500">per gram</p>
        </div>
      </div>

      {/* Detailed Information */}
      {showDetails && (
        <div className="bg-gray-50 rounded-lg p-4 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-gray-700">
                {pricesData.dataDate ? (
                  <span>Prijsdata van: {formatDate(pricesData.dataDate)}</span>
                ) : (
                  <span>Dagelijks bijgewerkte prijzen</span>
                )}
              </span>
            </div>
          </div>

          {/* Data bron en status */}
          <div className="mt-3 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              {pricesData.source && (
                <span>Bron: {pricesData.source}</span>
              )}
              {pricesData.isStale && (
                <span className="text-amber-600 ml-2">🔄 Laatst bekende data</span>
              )}
            </div>
            <div className="text-xs text-gray-500">
              Dagelijks bijgewerkt
            </div>
          </div>

          {pricesData.dataDate && (
            <div className="mt-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
              ℹ️ Prijzen zijn 1-dag vertraagd voor stabiliteit en betrouwbaarheid
            </div>
          )}
        </div>
      )}
    </div>
  );
}