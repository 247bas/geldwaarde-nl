'use client';

import { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';

interface CoinData {
  id: string;
  name: string;
  slug: string;
  metalType: 'GOLD' | 'SILVER';
}

interface VariantData {
  id: string;
  years: string;
  name: string;
  weight: number;
  goldPercentage?: number;
  silverPercentage?: number;
}

interface PriceData {
  gold: number;
  silver: number;
  cached?: boolean;
  dataDate?: string;
  source?: string;
}

interface CalculatorClientProps {
  coins: CoinData[];
  variants: Record<string, VariantData[]>;
  prices: PriceData;
}

export function CalculatorClient({ coins, variants, prices }: CalculatorClientProps) {
  const [selectedCoin, setSelectedCoin] = useState('');
  const [selectedVariant, setSelectedVariant] = useState('');
  const [coinVariants, setCoinVariants] = useState<VariantData[]>([]);
  const [calculatedValue, setCalculatedValue] = useState<number | null>(null);
  const [calculationLoading, setCalculationLoading] = useState(false);

  // Synchroniseer met DOM state bij component mount (voor browser back button)
  useEffect(() => {
    const coinSelect = document.getElementById('coin') as HTMLSelectElement;
    const variantSelect = document.getElementById('variant') as HTMLSelectElement;
    
    if (coinSelect && coinSelect.value && coinSelect.value !== selectedCoin) {
      setSelectedCoin(coinSelect.value);
    }
    
    if (variantSelect && variantSelect.value && variantSelect.value !== selectedVariant) {
      setSelectedVariant(variantSelect.value);
    }
  }, []); // Alleen bij mount

  useEffect(() => {
    if (selectedCoin) {
      setCoinVariants(variants[selectedCoin] || []);
      setSelectedVariant('');
      setCalculatedValue(null);
    }
  }, [selectedCoin, variants]);

  // Automatische herberekening wanneer zowel munt als variant geselecteerd zijn
  useEffect(() => {
    if (selectedCoin && selectedVariant) {
      const coin = coins.find(c => c.id === selectedCoin);
      const variant = coinVariants.find(v => v.id === selectedVariant);
      
      if (coin && variant) {
        let value = 0;
        if (coin.metalType === 'GOLD' && variant.goldPercentage) {
          const pureGoldWeight = variant.weight * (variant.goldPercentage / 100);
          value = pureGoldWeight * prices.gold;
        } else if (coin.metalType === 'SILVER' && variant.silverPercentage) {
          const pureSilverWeight = variant.weight * (variant.silverPercentage / 100);
          value = pureSilverWeight * prices.silver;
        }
        setCalculatedValue(value);
      }
    }
  }, [selectedCoin, selectedVariant, coins, coinVariants, prices]);

  const calculateValue = () => {
    if (!selectedCoin || !selectedVariant) return;

    setCalculationLoading(true);
    
    try {
      const coin = coins.find(c => c.id === selectedCoin);
      const variant = coinVariants.find(v => v.id === selectedVariant);
      
      if (!coin || !variant) return;

      let value = 0;
      if (coin.metalType === 'GOLD' && variant.goldPercentage) {
        const pureGoldWeight = variant.weight * (variant.goldPercentage / 100);
        value = pureGoldWeight * prices.gold;
      } else if (coin.metalType === 'SILVER' && variant.silverPercentage) {
        const pureSilverWeight = variant.weight * (variant.silverPercentage / 100);
        value = pureSilverWeight * prices.silver;
      }

      setCalculatedValue(value);
    } finally {
      setCalculationLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="w-8 h-8 text-yellow-600" />
          <h2 className="text-2xl font-bold text-gray-900">Muntwaarde Calculator</h2>
        </div>
        
        <div className="space-y-6">
          {/* Coin Selection */}
          <div>
            <label htmlFor="coin" className="block text-sm font-medium text-gray-700 mb-2">
              Selecteer uw munt
            </label>
            <select
              id="coin"
              value={selectedCoin}
              onChange={(e) => setSelectedCoin(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="">-- Kies een munt --</option>
              <optgroup label="Gouden Munten">
                {coins.filter(c => c.metalType === 'GOLD').map(coin => (
                  <option key={coin.id} value={coin.id}>{coin.name}</option>
                ))}
              </optgroup>
              <optgroup label="Zilveren Munten">
                {coins.filter(c => c.metalType === 'SILVER').map(coin => (
                  <option key={coin.id} value={coin.id}>{coin.name}</option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Variant Selection */}
          {coinVariants.length > 0 && (
            <div>
              <label htmlFor="variant" className="block text-sm font-medium text-gray-700 mb-2">
                Selecteer periode / variant
              </label>
              <select
                id="variant"
                value={selectedVariant}
                onChange={(e) => setSelectedVariant(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="">-- Kies periode --</option>
                {coinVariants.map(variant => (
                  <option key={variant.id} value={variant.id}>
                    {variant.years} - {variant.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Calculate Button */}
          <button
            onClick={calculateValue}
            disabled={!selectedCoin || !selectedVariant || calculationLoading}
            className="w-full bg-yellow-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-yellow-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {calculationLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Berekenen...
              </>
            ) : (
              'Bereken Waarde'
            )}
          </button>

          {/* Result */}
          {calculatedValue !== null && (() => {
            const coin = coins.find(c => c.id === selectedCoin);
            const variant = coinVariants.find(v => v.id === selectedVariant);
            if (!coin || !variant) return null;

            const metalPercentage = coin.metalType === 'GOLD' ? variant.goldPercentage : variant.silverPercentage;
            const pureMetalWeight = variant.weight * ((metalPercentage || 0) / 100);
            const metalName = coin.metalType === 'GOLD' ? 'goud' : 'zilver';

            return (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                <p className="text-sm text-gray-600 mb-2">Intrinsieke metaalwaarde:</p>
                <p className="text-4xl font-bold text-green-600">
                  €{calculatedValue.toFixed(2)}
                </p>
                
                {/* Collectors Value */}
                {variant.collectorsValueRange && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Geschatte verzamelaarswaarde:</p>
                    <p className="text-2xl font-bold text-blue-600">
                      €{variant.collectorsValueRange.min.toFixed(0)} - €{variant.collectorsValueRange.max.toFixed(0)}
                    </p>
                    {calculatedValue < variant.collectorsValueRange.min && (
                      <p className="text-sm text-blue-500 mt-1">
                        🌟 Deze munt heeft een hogere verzamelaarswaarde dan de metaalwaarde!
                      </p>
                    )}
                  </div>
                )}

                {/* Detailed Information */}
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-gray-600">Totaal gewicht:</p>
                    <p className="font-semibold">{variant.weight} gram</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-gray-600">{metalName} percentage:</p>
                    <p className="font-semibold">{metalPercentage}%</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-gray-600">Puur {metalName} gewicht:</p>
                    <p className="font-semibold">{pureMetalWeight.toFixed(3)} gram</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-gray-600">Periode:</p>
                    <p className="font-semibold">{variant.years}</p>
                  </div>
                </div>

                {/* Link to specific coin page */}
                <div className="mt-4 text-center">
                  <a
                    href={`/${coin.metalType === 'GOLD' ? 'gouden-munten' : 'zilveren-munten'}/${coin.slug}`}
                    className="inline-block bg-yellow-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-700 transition"
                  >
                    Meer over {coin.name}
                  </a>
                </div>

                <p className="text-xs text-gray-500 mt-3">
                  * Dit is de pure metaalwaarde. Verzamelaarswaarde kan afwijken.
                </p>
              </div>
            );
          })()}
          
          {/* Price Info */}
          {prices.dataDate && (
            <div className="text-xs text-gray-500 text-center">
              Prijzen van {new Date(prices.dataDate).toLocaleDateString('nl-NL')} 
              {prices.source && ` (${prices.source})`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}