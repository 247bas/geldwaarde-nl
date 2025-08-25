import { Metadata } from 'next';
import { Coins, TrendingUp, Calculator } from 'lucide-react';
import { getPrices } from '@/lib/prices';
import { SingleMetalPrice } from '@/components/SingleMetalPrice';
import coinsDatabase from '@/coins-database.json';

export const metadata: Metadata = {
  title: 'Nederlandse Zilveren Munten - Waarde Berekenen | Geldwaarde.nl',
  description: 'Complete overzicht van Nederlandse zilveren munten. Gulden, rijksdaalder, tientje, kwartje en meer. Bereken de actuele zilverwaarde van uw munten.',
  keywords: 'zilveren munten, nederlandse zilveren munten, zilveren gulden, rijksdaalder, zilverprijs, oude zilveren munten',
  openGraph: {
    title: 'Nederlandse Zilveren Munten - Actuele Waarde',
    description: 'Complete gids voor Nederlandse zilveren munten met actuele waardebepaling.',
    url: 'https://geldwaarde.nl/zilveren-munten',
    siteName: 'Geldwaarde.nl',
    locale: 'nl_NL',
    type: 'website',
  },
};

// Functie om jaar bereik te berekenen uit variants
function calculateYearRange(coin: any): string {
  if (!coin.variants || coin.variants.length === 0) {
    return coin.overviewData?.years || 'Diverse jaren';
  }
  
  let allYears: number[] = [];
  
  coin.variants.forEach((variant: any) => {
    if (variant.years) {
      // Parse verschillende jaar formaten (bijv. "1818", "1819-1837", "1840, 1841-1849")
      const yearString = variant.years.toString();
      const yearMatches = yearString.match(/\d{4}/g);
      
      if (yearMatches) {
        yearMatches.forEach((yearStr: string) => {
          const year = parseInt(yearStr);
          if (year >= 1800 && year <= 2030) { // Redelijke jaar range
            allYears.push(year);
          }
        });
      }
      
      // Parse bereiken zoals "1819-1837"
      const rangeMatches = yearString.match(/(\d{4})-(\d{4})/g);
      if (rangeMatches) {
        rangeMatches.forEach((range: string) => {
          const [startYear, endYear] = range.split('-').map(y => parseInt(y));
          if (startYear >= 1800 && endYear <= 2030) {
            for (let year = startYear; year <= endYear; year++) {
              allYears.push(year);
            }
          }
        });
      }
    }
  });
  
  if (allYears.length === 0) {
    return coin.overviewData?.years || 'Diverse jaren';
  }
  
  // Verwijder duplicaten en sorteer
  allYears = [...new Set(allYears)].sort();
  
  const minYear = Math.min(...allYears);
  const maxYear = Math.max(...allYears);
  
  return minYear === maxYear ? minYear.toString() : `${minYear}-${maxYear}`;
}

// Functie om bereik te berekenen voor numerieke waardes
function calculateRange(values: number[], formatter?: (val: number) => string): string {
  if (values.length === 0) return '-';
  if (values.length === 1) return formatter ? formatter(values[0]) : values[0].toString();
  
  const min = Math.min(...values);
  const max = Math.max(...values);
  
  if (min === max) {
    return formatter ? formatter(min) : min.toString();
  }
  
  const formattedMin = formatter ? formatter(min) : min.toString();
  const formattedMax = formatter ? formatter(max) : max.toString();
  
  return `${formattedMin} - ${formattedMax}`;
}

// Functie om alle bereiken voor een munt te berekenen
function calculateCoinRanges(coin: any, silverPrice: number) {
  if (!coin.variants || coin.variants.length === 0) {
    return {
      weight: coin.overviewData?.weight?.toFixed(3) || '-',
      silverContent: coin.overviewData?.metalContent?.toFixed(1) || '-',
      pureSilver: coin.overviewData?.weight && coin.overviewData?.metalContent ? 
        ((coin.overviewData.weight * coin.overviewData.metalContent) / 100).toFixed(3) : '-',
      silverValue: coin.overviewData?.weight && coin.overviewData?.metalContent ? 
        (((coin.overviewData.weight * coin.overviewData.metalContent) / 100) * silverPrice).toFixed(2) : '-'
    };
  }
  
  // Verzamel alle waardes uit variants
  const weights = coin.variants.map((v: any) => v.weight).filter((w: any) => w != null);
  const silverContents = coin.variants.map((v: any) => v.silverPercentage).filter((s: any) => s != null);
  const pureSilvers = coin.variants.map((v: any) => 
    v.weight && v.silverPercentage ? (v.weight * v.silverPercentage) / 100 : null
  ).filter((p: any) => p != null);
  const silverValues = pureSilvers.map((p: number) => p * silverPrice);
  
  return {
    weight: calculateRange(weights, (val) => val.toFixed(3)),
    silverContent: calculateRange(silverContents, (val) => val.toFixed(1)),
    pureSilver: calculateRange(pureSilvers, (val) => val.toFixed(3)),
    silverValue: calculateRange(silverValues, (val) => val.toFixed(2))
  };
}

// Filter zilveren munten uit database
const silverCoinsData = Object.entries(coinsDatabase.coins)
  .filter(([_, coin]: [string, any]) => coin.metalType === 'SILVER')
  .map(([slug, coin]: [string, any]) => ({
    slug,
    name: coin.name,
    years: calculateYearRange(coin),
    weight: coin.overviewData?.weight || coin.variants?.[0]?.weight || 0,
    silverContent: coin.overviewData?.metalContent || coin.variants?.[0]?.silverPercentage || 0,
    description: coin.overviewData?.description || `${coin.name} uit de Nederlandse muntgeschiedenis`
  }))
  .sort((a, b) => {
    // Sorteer volgens gewenste volgorde
    const order = [
      'zilveren-tientje',
      'zilveren-rijksdaalder', 
      'zilveren-gulden',
      'zilveren-vijftig-gulden',
      'zilveren-drie-gulden',
      'zilveren-halve-gulden',
      'zilveren-dukaat',
      'zilveren-kwartje',
      'zilveren-tien-cent',
      'zilveren-vijf-cent'
    ];
    const aIndex = order.indexOf(a.slug);
    const bIndex = order.indexOf(b.slug);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.name.localeCompare(b.name);
  });

export default async function ZilverenMuntenPage() {
  const prices = await getPrices();
  const silverPrice = prices.silver;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/30 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li><a href="/" className="text-gray-600 hover:text-blue-600">Home</a></li>
            <li className="text-gray-400">/</li>
            <li className="text-blue-600 font-medium">Zilveren Munten</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nederlandse Zilveren Munten
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Complete overzicht van alle Nederlandse zilveren munten. Van kleine denominaties zoals de 5 cent tot imposante munten als de rijksdaalder. 
            Bereken direct de actuele waarde op basis van de live zilverprijs.
          </p>
        </div>

        {/* Live Zilverprijs */}
        <div className="bg-gradient-to-r from-gray-500 to-blue-500 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Actuele Zilverprijs</h2>
              <p className="text-blue-100">Live prijs per gram puur zilver</p>
            </div>
            <SingleMetalPrice 
              price={silverPrice} 
              metal="silver"
              className="text-3xl font-bold"
            />
          </div>
        </div>

        {/* Munten Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {silverCoinsData.map((coin) => {
            // Zoek de originele munt data op uit de database om ranges te berekenen
            const originalCoin = Object.values(coinsDatabase.coins).find((c: any) => c.slug === coin.slug);
            const ranges = originalCoin ? calculateCoinRanges(originalCoin, silverPrice) : null;
            
            return (
              <a
                key={coin.slug}
                href={`/zilveren-munten/${coin.slug}`}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 overflow-hidden group"
              >
                <div className="bg-gradient-to-r from-gray-400 to-blue-400 h-2"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {coin.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{coin.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Jaren:</span>
                      <span className="font-medium">{coin.years}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gewicht:</span>
                      <span className="font-medium">{ranges?.weight || coin.weight} gram</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Zilvergehalte:</span>
                      <span className="font-medium">{ranges?.silverContent || coin.silverContent.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Puur zilver:</span>
                      <span className="font-medium">{ranges?.pureSilver || ((coin.weight * coin.silverContent) / 100).toFixed(3)} gram</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Zilverwaarde:</span>
                      <span className="text-xl font-bold text-blue-600">€ {ranges?.silverValue || (((coin.weight * coin.silverContent) / 100) * silverPrice).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <span className="inline-flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
                      Meer informatie 
                      <svg className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Informatie Sectie */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Coins className="mr-3 text-blue-500" />
            Over Nederlandse Zilveren Munten
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              Nederlandse zilveren munten vormen een belangrijk deel van onze numismatische geschiedenis. 
              Van de kleine zilveren centen tot de imposante rijksdaalders, elk muntstuk vertelt een verhaal 
              over de economische en politieke ontwikkelingen van Nederland.
            </p>
            <p className="mt-4">
              Het zilvergehalte van Nederlandse munten varieert sterk, van ongeveer 56% voor sommige 
              kleinere denominaties tot meer dan 94% voor munten zoals de rijksdaalder. De zilveren gulden, 
              een van de meest verzamelde munten, heeft bijvoorbeeld een zilvergehalte van 72%.
            </p>
            <p className="mt-4">
              Moderne herdenkingsmunten zoals het zilveren tientje (10 gulden) en de zilveren vijftig gulden 
              hebben vaak een hoger zilvergehalte en zijn populair bij verzamelaars. Deze munten combineren 
              intrinsieke waarde met historische en culturele betekenis.
            </p>
          </div>
        </div>

        {/* Tips Sectie */}
        <div className="bg-gradient-to-r from-blue-100 to-gray-100 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="mr-3 text-blue-600" />
            Tips voor het Waarderen van Zilveren Munten
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Zilveren munten hebben altijd minimaal de waarde van hun zilvergehalte</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Oudere munten in goede staat kunnen een aanzienlijke premie hebben boven de zilverwaarde</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Let op zeldzame jaren en muntmeesters tekens die de waarde kunnen verhogen</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Reinig zilveren munten nooit met schurende middelen, dit vermindert de waarde</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Bewaar munten in zuurvrije houders om aanslag te voorkomen</span>
            </li>
          </ul>
        </div>

        {/* Call-to-Action */}
        <div className="bg-gradient-to-r from-gray-500 to-blue-500 rounded-2xl shadow-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Direct de Waarde Berekenen?</h2>
          <p className="text-lg mb-6 text-blue-100">
            Gebruik onze calculator om snel de actuele waarde van uw zilveren munten te bepalen
          </p>
          <a
            href="/"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            <Calculator className="inline-block mr-2" />
            Naar de Calculator
          </a>
        </div>
      </div>
    </div>
  );
}