import { Calculator, TrendingUp, Search, Coins } from 'lucide-react';
import { getPrices } from '@/lib/prices';
import { CalculatorClient } from '@/components/CalculatorClient';
import { LivePricesServer } from '@/components/LivePricesServer';
import coinsDatabase from '@/coins-database.json';

// Genereer coin data uit database met specifieke volgorde
const silverCoinOrder = [
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

const goldCoinOrder = [
  'gouden-tientje',
  'gouden-vijfje', 
  'gouden-gulden',
  'gouden-twintig-gulden',
  'gouden-dukaat',
  'gouden-dubbele-dukaat'
];

const coinsFromDatabase = Object.entries(coinsDatabase.coins)
  .map(([slug, coin]: [string, any]) => ({
    id: slug,
    name: coin.name,
    slug: slug,
    metalType: coin.metalType as 'GOLD' | 'SILVER'
  }))
  .sort((a, b) => {
    // Sorteer volgens gewenste volgorde
    if (a.metalType === 'SILVER' && b.metalType === 'SILVER') {
      const aIndex = silverCoinOrder.indexOf(a.slug);
      const bIndex = silverCoinOrder.indexOf(b.slug);
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
    }
    
    if (a.metalType === 'GOLD' && b.metalType === 'GOLD') {
      const aIndex = goldCoinOrder.indexOf(a.slug);
      const bIndex = goldCoinOrder.indexOf(b.slug);
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
    }
    
    // Gold coins come first
    if (a.metalType === 'GOLD' && b.metalType === 'SILVER') return -1;
    if (a.metalType === 'SILVER' && b.metalType === 'GOLD') return 1;
    
    return a.name.localeCompare(b.name);
  });

// Genereer variants uit database
const variantsFromDatabase: Record<string, any[]> = {};

// Converteer database variants naar calculator formaat
Object.entries(coinsDatabase.coins).forEach(([slug, coin]: [string, any]) => {
  if (coin.variants && coin.variants.length > 0) {
    variantsFromDatabase[slug] = coin.variants.map((variant: any) => ({
      id: variant.id,
      years: variant.years,
      name: variant.name,
      weight: variant.weight,
      goldPercentage: variant.goldPercentage,
      silverPercentage: variant.silverPercentage
    }));
  }
});


export default async function HomePage() {
  // Server-side data fetching
  const pricesData = await getPrices();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-yellow-50 to-yellow-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Bereken de Waarde van Uw Nederlandse Munten
            </h1>
            <p className="text-xl text-gray-700 mb-4 max-w-3xl mx-auto">
              Ontdek direct de waarde van uw gouden en zilveren munten op basis van dagelijks bijgewerkte edelmetaalprijzen.
            </p>
            <div className="text-sm text-amber-600 bg-amber-50 rounded-lg px-4 py-2 inline-block mb-8">
              📅 Prijzen zijn van de vorige dag - dit garandeert betrouwbare data
            </div>
            
            {/* Live Prices */}
            <div className="mb-12">
              <LivePricesServer 
                pricesData={pricesData}
                showDetails={false}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Section - Client Component */}
      <section className="py-16 -mt-20">
        <CalculatorClient 
          coins={coinsFromDatabase}
          variants={variantsFromDatabase}
          prices={pricesData}
        />
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Waarom Geldwaarde.nl?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Betrouwbare Prijzen</h3>
              <p className="text-gray-600">
                Dagelijks bijgewerkte goud- en zilverprijzen (1-dag vertraagd) voor stabiele waardebepalingen.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Uitgebreide Database</h3>
              <p className="text-gray-600">
                Alle Nederlandse historische munten met technische specificaties en varianten.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coins className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Collectie Beheer</h3>
              <p className="text-gray-600">
                Bouw uw eigen collectie en volg de totale waarde van uw munten.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Coins Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Populaire Nederlandse Munten
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Gouden Tientje */}
            <a
              href="/gouden-munten/gouden-tientje"
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                <img 
                  src="/images/coins/gouden-tientje-willem3-voorkant-1875.jpg" 
                  alt="Gouden Tientje voorkant"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold text-center text-gray-900">Gouden Tientje</h3>
              <p className="text-sm text-center text-gray-500 mt-2">Gouden munt</p>
            </a>

            {/* Gouden Vijfje */}
            <a
              href="/gouden-munten/gouden-vijfje"
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                <img 
                  src="/images/coins/gouden-vijfje-wilhelmina-voorkant.jpg" 
                  alt="Gouden Vijfje voorkant"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold text-center text-gray-900">Gouden Vijfje</h3>
              <p className="text-sm text-center text-gray-500 mt-2">Gouden munt</p>
            </a>

            {/* Zilveren Gulden */}
            <a
              href="/zilveren-munten/zilveren-gulden"
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center">
                <span className="text-white font-bold text-xs">ZG</span>
              </div>
              <h3 className="text-lg font-semibold text-center text-gray-900">Zilveren Gulden</h3>
              <p className="text-sm text-center text-gray-500 mt-2">Zilveren munt</p>
            </a>

            {/* Zilveren Rijksdaalder */}
            <a
              href="/zilveren-munten/zilveren-rijksdaalder"
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center">
                <span className="text-white font-bold text-xs">ZR</span>
              </div>
              <h3 className="text-lg font-semibold text-center text-gray-900">Zilveren Rijksdaalder</h3>
              <p className="text-sm text-center text-gray-500 mt-2">Zilveren munt</p>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}