import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Info, Award, Calendar } from 'lucide-react';
import { getPrices } from '@/lib/prices';
import { SingleMetalPrice } from '@/components/SingleMetalPrice';
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const coin = silverCoins[slug];
  
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
      url: `https://geldwaarde.nl/zilveren-munten/${slug}`,
      siteName: 'Geldwaarde.nl',
      locale: 'nl_NL',
      type: 'website',
    }
  };
}

export default async function ZilverenMuntDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const coin = silverCoins[slug];
  
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

        {/* Varianten Tabel */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Calendar className="mr-3 text-blue-500" />
            Varianten van {coin.name}
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-50">
                  <th className="border border-blue-200 px-4 py-3 text-left font-semibold text-gray-900">Vorst</th>
                  <th className="border border-blue-200 px-4 py-3 text-left font-semibold text-gray-900">Regeerperiode</th>
                  <th className="border border-blue-200 px-4 py-3 text-left font-semibold text-gray-900">Muntjaren</th>
                  <th className="border border-blue-200 px-4 py-3 text-left font-semibold text-gray-900">Gewicht</th>
                  <th className="border border-blue-200 px-4 py-3 text-left font-semibold text-gray-900">Diameter</th>
                  <th className="border border-blue-200 px-4 py-3 text-left font-semibold text-gray-900">Zilvergehalte</th>
                  <th className="border border-blue-200 px-4 py-3 text-left font-semibold text-gray-900">Puur Zilver</th>
                  <th className="border border-blue-200 px-4 py-3 text-left font-semibold text-gray-900">Zilverwaarde</th>
                  <th className="border border-blue-200 px-4 py-3 text-left font-semibold text-gray-900">Verzamelaarswaarde</th>
                </tr>
              </thead>
              <tbody>
                {coin.variants?.map((variant: any, index: number) => {
                  const silverContent = (variant.weight * (variant.silverPercentage || 0)) / 100;
                  const metalValue = silverContent * silverPrice;
                  
                  return (
                    <tr key={variant.id} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-25'}>
                      <td className="border border-blue-200 px-4 py-3 font-medium text-gray-900">
                        {variant.name}
                      </td>
                      <td className="border border-blue-200 px-4 py-3 text-gray-700">
                        {variant.rulerPeriod || '-'}
                      </td>
                      <td className="border border-blue-200 px-4 py-3 text-gray-700">
                        {variant.years || '-'}
                      </td>
                      <td className="border border-blue-200 px-4 py-3 text-gray-700">
                        {variant.weight} gram
                      </td>
                      <td className="border border-blue-200 px-4 py-3 text-gray-700">
                        {variant.diameter ? `${variant.diameter} mm` : '-'}
                      </td>
                      <td className="border border-blue-200 px-4 py-3 text-gray-700">
                        {variant.silverPercentage.toFixed(1)}%
                      </td>
                      <td className="border border-blue-200 px-4 py-3 text-gray-700">
                        {silverContent.toFixed(3)} gram
                      </td>
                      <td className="border border-blue-200 px-4 py-3 font-semibold text-blue-600">
                        € {metalValue.toFixed(2)}
                      </td>
                      <td className="border border-blue-200 px-4 py-3 text-gray-600">
                        n.t.b.
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>💡 <strong>Tip:</strong> De huidige waarde is berekend op basis van de live zilverprijs van € {silverPrice.toFixed(3)} per gram.</p>
            <p>📈 Verzamelaarswaarde kan hoger liggen afhankelijk van zeldzaamheid en staat van de munt.</p>
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