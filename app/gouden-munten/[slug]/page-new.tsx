import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Calculator, Info, TrendingUp, Award, Calendar, Weight, Ruler } from 'lucide-react';
import { getPrices } from '@/lib/prices';
import { SingleMetalPrice } from '@/components/SingleMetalPrice';
import { CoinPhotos } from '@/components/CoinPhotos';
import coinsDatabase from '@/coins-database.json';

// Filter alleen gouden munten uit de database
const goldCoins = Object.fromEntries(
  Object.entries(coinsDatabase.coins).filter(([_, coin]: [string, any]) => coin.metalType === 'GOLD')
);

export async function generateStaticParams() {
  return Object.keys(goldCoins).map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const coin = goldCoins[params.slug];
  
  if (!coin) {
    return {
      title: 'Munt niet gevonden',
      description: 'Deze munt kon niet worden gevonden in onze database.'
    };
  }

  return {
    title: coin.seoContent?.metaTitle || `${coin.name} Waarde - Actuele Goudprijs | Geldwaarde.nl`,
    description: coin.seoContent?.metaDescription || `Bereken direct de waarde van uw ${coin.name}. Actuele goudprijs en uitgebreide informatie.`,
    keywords: `${coin.name}, ${coin.name} waarde, gouden munten, goudprijs, oude munten, Nederlandse munten`,
    openGraph: {
      title: coin.seoContent?.h1Title || coin.name,
      description: coin.seoContent?.metaDescription || `Actuele waarde en informatie over ${coin.name}`,
      url: `https://geldwaarde.nl/gouden-munten/${params.slug}`,
      siteName: 'Geldwaarde.nl',
      locale: 'nl_NL',
      type: 'website',
    }
  };
}

export default async function GoudenMuntDetailPage({ params }: { params: { slug: string } }) {
  const coin = goldCoins[params.slug];
  
  if (!coin) {
    notFound();
  }

  const prices = await getPrices();
  const goldPrice = prices.gold;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/30 to-orange-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li><a href="/" className="text-gray-600 hover:text-amber-600">Home</a></li>
            <li className="text-gray-400">/</li>
            <li><a href="/gouden-munten" className="text-gray-600 hover:text-amber-600">Gouden Munten</a></li>
            <li className="text-gray-400">/</li>
            <li className="text-amber-600 font-medium">{coin.name}</li>
          </ol>
        </nav>

        {/* Header met titel */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {coin.seoContent?.h1Title || `${coin.name}: Actuele Waarde en Informatie`}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            {coin.seoContent?.introText || `De ${coin.name} is een belangrijke Nederlandse gouden munt uit onze muntgeschiedenis.`}
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
              price={goldPrice} 
              metal="gold"
              className="text-3xl font-bold"
            />
          </div>
        </div>

        {/* Foto Galerij */}
        {coin.images && coin.variants && <CoinPhotos images={coin.images} coinName={coin.name} variants={coin.variants} />}

        {/* Waarde Calculator per Variant */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Calculator className="mr-3 text-amber-500" />
            Waarde Calculator
          </h2>
          
          <div className="space-y-6">
            {coin.variants?.map((variant: any) => {
              const goldContent = (variant.weight * (variant.goldPercentage || 0)) / 100;
              const metalValue = goldContent * goldPrice;
              
              return (
                <div key={variant.id} className="border-l-4 border-amber-500 pl-6 py-4 bg-amber-50/50 rounded-r-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {variant.name} {variant.rulerPeriod && `(${variant.rulerPeriod})`}
                      </h3>
                      <p className="text-gray-600 mt-1">Muntjaren: {variant.years || 'Onbekend'}</p>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <p>Gewicht: {variant.weight} gram</p>
                        <p>Goudgehalte: {variant.goldPercentage}%</p>
                        <p>Puur goud: {goldContent.toFixed(3)} gram</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Goudwaarde</p>
                      <p className="text-2xl font-bold text-amber-600">€ {metalValue.toFixed(2)}</p>
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
            <Info className="mr-3 text-amber-500" />
            Historische Informatie
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {coin.seoContent?.historicalInfo || `Deze ${coin.name} heeft een rijke geschiedenis binnen de Nederlandse numismatiek.`}
          </p>
        </div>

        {/* Technische Specificaties */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Weight className="mr-3 text-amber-500" />
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
            <Award className="mr-3 text-amber-500" />
            Tips voor Verzamelaars
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {coin.seoContent?.collectingTips || 'Tips voor het verzamelen van deze munten worden binnenkort toegevoegd.'}
          </p>
        </div>

        {/* Call-to-Action */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Heeft u {coin.name} munten?</h2>
          <p className="text-lg mb-6 text-amber-100">
            Gebruik onze calculator om direct de actuele waarde te berekenen
          </p>
          <a
            href="/"
            className="inline-block bg-white text-amber-600 px-8 py-3 rounded-lg font-semibold hover:bg-amber-50 transition-colors"
          >
            Naar de Calculator
          </a>
        </div>
      </div>
    </div>
  );
}