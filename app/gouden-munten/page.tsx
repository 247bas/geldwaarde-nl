import { Metadata } from 'next';
import { Coins, TrendingUp, Calculator } from 'lucide-react';
import { getPrices } from '@/lib/prices';
import { SingleMetalPrice } from '@/components/SingleMetalPrice';
import coinsDatabase from '@/coins-database.json';

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

// Functie om alle bereiken voor een gouden munt te berekenen
function calculateGoldCoinRanges(coin: any, goldPrice: number) {
  if (!coin.variants || coin.variants.length === 0) {
    return {
      weight: coin.overviewData?.weight?.toFixed(3) || '-',
      goldContent: coin.overviewData?.metalContent?.toFixed(1) || '-',
      pureGold: coin.overviewData?.weight && coin.overviewData?.metalContent ? 
        ((coin.overviewData.weight * coin.overviewData.metalContent) / 100).toFixed(3) : '-',
      goldValue: coin.overviewData?.weight && coin.overviewData?.metalContent ? 
        (((coin.overviewData.weight * coin.overviewData.metalContent) / 100) * goldPrice).toFixed(2) : '-'
    };
  }
  
  // Verzamel alle waardes uit variants
  const weights = coin.variants.map((v: any) => v.weight).filter((w: any) => w != null);
  const goldContents = coin.variants.map((v: any) => v.goldPercentage).filter((g: any) => g != null);
  const pureGolds = coin.variants.map((v: any) => 
    v.weight && v.goldPercentage ? (v.weight * v.goldPercentage) / 100 : null
  ).filter((p: any) => p != null);
  const goldValues = pureGolds.map((p: number) => p * goldPrice);
  
  return {
    weight: calculateRange(weights, (val) => val.toFixed(3)),
    goldContent: calculateRange(goldContents, (val) => val.toFixed(1)),
    pureGold: calculateRange(pureGolds, (val) => val.toFixed(3)),
    goldValue: calculateRange(goldValues, (val) => val.toFixed(2))
  };
}

export const metadata: Metadata = {
  title: 'Nederlandse Gouden Munten - Waarde Berekenen | Geldwaarde.nl',
  description: 'Overzicht van alle Nederlandse gouden munten. Gouden tientjes, vijfjes en dukaten. Bereken de actuele goudwaarde van uw munten.',
  keywords: 'gouden munten, nederlandse gouden munten, gouden tientje, gouden vijfje, goudprijs, oude gouden munten',
  openGraph: {
    title: 'Nederlandse Gouden Munten - Actuele Waarde',
    description: 'Complete gids voor Nederlandse gouden munten met actuele waardebepaling.',
    url: 'https://geldwaarde.nl/gouden-munten',
    siteName: 'Geldwaarde.nl',
    locale: 'nl_NL',
    type: 'website',
  },
};

// Filter gouden munten uit database
const goldCoinsData = Object.entries(coinsDatabase.coins)
  .filter(([_, coin]: [string, any]) => coin.metalType === 'GOLD')
  .map(([slug, coin]: [string, any]) => ({
    slug,
    name: coin.name,
    years: coin.overviewData?.years || 'Diverse jaren',
    weight: coin.overviewData?.weight || coin.variants?.[0]?.weight || 0,
    goldContent: coin.overviewData?.metalContent || coin.variants?.[0]?.goldPercentage || 0,
    description: coin.overviewData?.description || `${coin.name} uit de Nederlandse muntgeschiedenis`
  }))
  .sort((a, b) => {
    // Sorteer op gewenste volgorde
    const order = ['gouden-tientje', 'gouden-vijfje', 'gouden-gulden', 'gouden-twintig-gulden', 'gouden-dukaat', 'gouden-dubbele-dukaat'];
    const aIndex = order.indexOf(a.slug);
    const bIndex = order.indexOf(b.slug);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.name.localeCompare(b.name);
  });

// Legacy data for reference
const legacyGoldenCoinsData = [
  {
    'slug': 'gouden-gulden',
    'name': 'Gouden Gulden',
    'years': '2001',
    'weight': 13.2,
    'goldContent': 99.99,
    'description': 'Ter ere van het afscheid van de gulden'
  }
];

// Functie om actuele waarde te berekenen
function calculateGoldValue(weight: number, goldContent: number, goldPrice: number): string {
  const pureGold = weight * (goldContent / 100);
  const value = pureGold * goldPrice;
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
}

// Functie om verzamelaarswaarde range te berekenen uit database
function getCollectorValueRange(coinSlug: string): { min: number; max: number } | null {
  const coinData = coinsDatabase.coins[coinSlug as keyof typeof coinsDatabase.coins];
  if (!coinData || !coinData.variants) return null;
  
  const allRanges = coinData.variants
    .map(variant => variant.collectorsValueRange)
    .filter(range => range !== undefined);
  
  if (allRanges.length === 0) return null;
  
  const minValue = Math.min(...allRanges.map(range => range.min));
  const maxValue = Math.max(...allRanges.map(range => range.max));
  
  return { min: minValue, max: maxValue };
}

export default async function GoldenCoinsPage() {
  // Server-side data fetching
  const pricesData = await getPrices();
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/30 to-orange-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li><a href="/" className="text-gray-600 hover:text-amber-600">Home</a></li>
            <li className="text-gray-400">/</li>
            <li className="text-amber-600 font-medium">Gouden Munten</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nederlandse Gouden Munten
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Ontdek de waarde van Nederlandse gouden munten. Van het iconische gouden tientje tot het zeldzame gouden vijfje. 
            Alle munten met actuele goudprijzen en historische informatie.
          </p>
        </div>

        {/* Live Goudprijs */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Actuele Goudprijs</h2>
              <p className="text-amber-100">Live prijs per gram puur goud</p>
            </div>
            <SingleMetalPrice 
              price={pricesData.gold} 
              metal="gold"
              className="text-3xl font-bold"
            />
          </div>
        </div>

        {/* Munten Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {goldCoinsData.map((coin) => {
            // Zoek de originele munt data op uit de database om ranges te berekenen
            const originalCoin = Object.values(coinsDatabase.coins).find((c: any) => c.slug === coin.slug);
            const ranges = originalCoin ? calculateGoldCoinRanges(originalCoin, pricesData.gold) : null;
            
            return (
              <a
                key={coin.slug}
                href={`/gouden-munten/${coin.slug}`}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 overflow-hidden group"
              >
                <div className="bg-gradient-to-r from-amber-400 to-orange-400 h-2"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
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
                      <span className="text-gray-600">Goudgehalte:</span>
                      <span className="font-medium">{ranges?.goldContent || coin.goldContent}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Puur goud:</span>
                      <span className="font-medium">{ranges?.pureGold || ((coin.weight * coin.goldContent) / 100).toFixed(3)} gram</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Goudwaarde:</span>
                      <span className="text-xl font-bold text-amber-600">€ {ranges?.goldValue || (((coin.weight * coin.goldContent) / 100) * pricesData.gold).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <span className="inline-flex items-center text-amber-600 font-medium group-hover:gap-2 transition-all">
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
            <Coins className="mr-3 text-amber-500" />
            Over Nederlandse Gouden Munten
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              Nederlandse gouden munten vormden de ruggengraat van ons monetaire systeem van de 19e eeuw tot de jaren '30. 
              Deze munten hadden niet alleen een monetaire functie maar dienden ook als spaarmiddel en statussymbool. 
              Het goudgehalte was internationaal gestandaardiseerd op 90% (900/1000).
            </p>
            <p className="mt-4">
              Het gouden tientje en vijfje zijn de meest bekende Nederlandse gouden munten. Tijdens de Eerste Wereldoorlog 
              en de economische crisis van de jaren '30 stopte de productie van gouden circulatiemunten. De Gouden Gulden 
              van 2001 was een speciale uitgave ter ere van het afscheid van de gulden.
            </p>
            <p className="mt-4">
              Moderne verzamelobjecten zoals de Gouden Dukaat worden nog steeds geslagen en hebben een hoog goudgehalte 
              van 98,3%. Deze munten combineren intrinsieke waarde met historische en culturele betekenis en zijn populair 
              bij zowel investeerders als verzamelaars.
            </p>
          </div>
        </div>

        {/* Tips Sectie */}
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="mr-3 text-amber-600" />
            Tips voor het Waarderen van Gouden Munten
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-amber-600 mr-2">•</span>
              <span>Gouden munten hebben altijd minimaal de waarde van hun goudgehalte</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-600 mr-2">•</span>
              <span>Historische munten in goede staat kunnen een aanzienlijke premie hebben boven de goudwaarde</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-600 mr-2">•</span>
              <span>Let op zeldzame jaren en varianten die de waarde kunnen verhogen</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-600 mr-2">•</span>
              <span>Reinig gouden munten nooit met schurende middelen, dit vermindert de waarde</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-600 mr-2">•</span>
              <span>Bewaar munten in beschermende houders om krassen te voorkomen</span>
            </li>
          </ul>
        </div>

        {/* Call-to-Action */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Direct de Waarde Berekenen?</h2>
          <p className="text-lg mb-6 text-amber-100">
            Gebruik onze calculator om snel de actuele waarde van uw gouden munten te bepalen
          </p>
          <a
            href="/"
            className="inline-block bg-white text-amber-600 px-8 py-3 rounded-lg font-semibold hover:bg-amber-50 transition-colors"
          >
            <Calculator className="inline-block mr-2" />
            Naar de Calculator
          </a>
        </div>
      </div>
    </div>
  );
}