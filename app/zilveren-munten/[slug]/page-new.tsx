import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Calculator, Info, TrendingUp, Award, Calendar, Weight, Ruler } from 'lucide-react';
import { getPrices } from '@/lib/prices';
import { SingleMetalPrice } from '@/components/SingleMetalPrice';
import { CoinPhotos } from '@/components/CoinPhotos';
import coinsDatabase from '@/coins-database.json';

// Filter alleen zilveren munten uit de database
const silverCoins = Object.fromEntries(
  Object.entries(coinsDatabase.coins).filter(([_, coin]: [string, any]) => coin.metalType === 'SILVER')
);

export async function generateStaticParams() {
  return Object.keys(silverCoins).map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const coin = silverCoins[params.slug];
  
  if (!coin) {
    return {
      title: 'Munt niet gevonden',
      description: 'Deze munt kon niet worden gevonden in onze database.'
    };
  }

  return {
    title: coin.seoContent?.metaTitle || `${coin.name} Waarde - Actuele Zilverprijs | Geldwaarde.nl`,
    description: coin.seoContent?.metaDescription || `Bereken direct de waarde van uw ${coin.name}. Actuele zilverprijs en uitgebreide informatie.`,
    keywords: `${coin.name}, ${coin.name} waarde, zilveren munten, zilverprijs, oude munten, Nederlandse munten`,
    openGraph: {
      title: coin.seoContent?.h1Title || coin.name,
      description: coin.seoContent?.metaDescription || `Actuele waarde en informatie over ${coin.name}`,
      url: `https://geldwaarde.nl/zilveren-munten/${params.slug}`,
      siteName: 'Geldwaarde.nl',
      locale: 'nl_NL',
      type: 'website',
    }
  };
}

export default async function ZilverenMuntDetailPage({ params }: { params: { slug: string } }) {
  const coin = silverCoins[params.slug];
  
  if (!coin) {
    notFound();
  }

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
            <li><a href="/zilveren-munten" className="text-gray-600 hover:text-blue-600">Zilveren Munten</a></li>
            <li className="text-gray-400">/</li>
            <li className="text-blue-600 font-medium">{coin.name}</li>
          </ol>
        </nav>

        {/* Header met titel */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {coin.seoContent?.h1Title || `${coin.name}: Actuele Waarde en Informatie`}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            {coin.seoContent?.introText || `De ${coin.name} is een belangrijke Nederlandse zilveren munt uit onze muntgeschiedenis.`}
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

        {/* Foto Galerij */}
        {coin.images && <CoinPhotos images={coin.images} coinName={coin.name} />}

        {/* Waarde Calculator per Variant */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Calculator className="mr-3 text-blue-500" />
            Waarde Calculator
          </h2>
          
          <div className="space-y-6">
            {coin.variants?.map((variant: any) => {
              const silverContent = (variant.weight * (variant.silverPercentage || 0)) / 100;
              const metalValue = silverContent * silverPrice;
              
              return (
                <div key={variant.id} className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-50/50 rounded-r-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {variant.name} {variant.rulerPeriod && `(${variant.rulerPeriod})`}
                      </h3>
                      <p className="text-gray-600 mt-1">Muntjaren: {variant.years || 'Onbekend'}</p>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <p>Gewicht: {variant.weight} gram</p>
                        <p>Zilvergehalte: {variant.silverPercentage}%</p>
                        <p>Puur zilver: {silverContent.toFixed(3)} gram</p>
                        {variant.diameter && <p>Diameter: {variant.diameter} mm</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Zilverwaarde</p>
                      <p className="text-2xl font-bold text-blue-600">€ {metalValue.toFixed(2)}</p>
                      {variant.collectorsValueRange && (
                        <p className="text-sm text-gray-600 mt-2">
                          Verzamelaarswaarde: € {variant.collectorsValueRange.min} - € {variant.collectorsValueRange.max}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Historische Informatie */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Info className="mr-3 text-blue-500" />
            Historische Informatie
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {coin.seoContent?.historicalInfo || `Deze ${coin.name} heeft een rijke geschiedenis binnen de Nederlandse numismatiek.`}
          </p>
        </div>

        {/* Technische Specificaties */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Weight className="mr-3 text-blue-500" />
            Technische Specificaties
          </h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700">
              {coin.seoContent?.technicalInfo || 'Technische specificaties worden binnenkort toegevoegd.'}
            </p>
          </div>
        </div>

        {/* Verzameltips */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Award className="mr-3 text-blue-500" />
            Tips voor Verzamelaars
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {coin.seoContent?.collectingTips || 'Tips voor het verzamelen van deze munten worden binnenkort toegevoegd.'}
          </p>
        </div>

        {/* Call-to-Action */}
        <div className="bg-gradient-to-r from-gray-500 to-blue-500 rounded-2xl shadow-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Heeft u {coin.name} munten?</h2>
          <p className="text-lg mb-6 text-blue-100">
            Gebruik onze calculator om direct de actuele waarde te berekenen
          </p>
          <a
            href="/"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Naar de Calculator
          </a>
        </div>
      </div>
    </div>
  );
}