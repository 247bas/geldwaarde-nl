import { Metadata } from 'next';
import { TrendingUp, Clock, Globe, BarChart3 } from 'lucide-react';
import { getPrices } from '@/lib/prices';
import { LivePricesServer } from '@/components/LivePricesServer';

export const metadata: Metadata = {
  title: 'Actuele Goud- en Zilverprijzen Live | Geldwaarde.nl',
  description: 'Live goud- en zilverprijzen per gram in euro. Automatisch bijgewerkte edelmetaalprijzen voor Nederlandse munten waardeberekening.',
  keywords: 'goudprijs, zilverprijs, live prijzen, edelmetalen, actuele koers, goud zilver euro gram',
};

export default async function PrijzenPage() {
  // Server-side data fetching
  const pricesData = await getPrices();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="text-sm mb-6">
        <ol className="flex items-center space-x-2">
          <li><a href="/" className="text-gray-500 hover:text-gray-700">Home</a></li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-900 font-medium">Actuele Prijzen</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Goud- en Zilverprijzen (Dagelijks Bijgewerkt)
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Edelmetaalprijzen van de vorige dag, per gram in euro. Dagelijks bijgewerkt voor betrouwbare muntwaarde berekeningen.
        </p>
        <div className="mt-3 text-sm text-amber-600 bg-amber-50 rounded-lg px-4 py-2 inline-block">
          📅 Prijzen zijn 1 dag vertraagd voor stabiliteit en betrouwbaarheid
        </div>
      </div>

      {/* Live Prices Display */}
      <div className="mb-12">
        <LivePricesServer 
          pricesData={pricesData}
          showDetails={true}
        />
      </div>

      {/* Price Information Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Update Frequentie</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Onze prijzen worden dagelijks bijgewerkt van betrouwbare internationale bronnen met 1-dag vertraagde data.
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Update frequentie: 1x per dag</li>
            <li>• Data vertraging: 1 werkdag</li>
            <li>• Cache: 24 uur</li>
            <li>• Fallback: Laatst bekende prijzen</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold">Internationale Bronnen</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Prijzen afkomstig van gerenommeerde internationale edelmetalen exchanges en API's.
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• MetalPriceAPI.com (primair)</li>
            <li>• Spot market pricing (1-dag vertraagd)</li>
            <li>• Fallback naar historische data</li>
            <li>• EUR per troy ounce basis</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold">Prijs Basis</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Alle prijzen worden getoond per gram in euro voor eenvoudige muntwaarde berekeningen.
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Spot marktprijzen</li>
            <li>• Exclusief handelsmarge</li>
            <li>• Intrinsieke metaalwaarde</li>
            <li>• EUR per gram conversie</li>
          </ul>
        </div>
      </div>

      {/* Price Factors */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Factoren die Edelmetaalprijzen Beïnvloeden
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-600">Goudprijs Factoren</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 mt-1">•</span>
                <span><strong>Inflatie:</strong> Goud als inflatiebescherming</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 mt-1">•</span>
                <span><strong>USD Koers:</strong> Omgekeerd verband met dollar</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 mt-1">•</span>
                <span><strong>Rentes:</strong> Lage rentes → hogere goudprijs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 mt-1">•</span>
                <span><strong>Geopolitiek:</strong> Onzekerheid drijft vraag</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 mt-1">•</span>
                <span><strong>Centrale Banken:</strong> Goudreserves beleid</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-600">Zilverprijs Factoren</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-gray-600 mt-1">•</span>
                <span><strong>Industriële Vraag:</strong> Elektronica, zonnepanelen</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-600 mt-1">•</span>
                <span><strong>Goudprijs Ratio:</strong> Historisch 50-80:1 verhouding</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-600 mt-1">•</span>
                <span><strong>Mijnproductie:</strong> Aanbod uit zilvermijnen</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-600 mt-1">•</span>
                <span><strong>Technologie:</strong> Nieuwe toepassingen</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-600 mt-1">•</span>
                <span><strong>Recycling:</strong> Hergebruik uit industrie</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-6 h-6 text-amber-600 mt-1" />
          <div>
            <h3 className="font-semibold text-amber-800 mb-2">Belangrijke Disclaimer</h3>
            <p className="text-amber-700 text-sm leading-relaxed">
              De getoonde prijzen zijn spot marktprijzen van de vorige dag en vertegenwoordigen de intrinsieke metaalwaarde. 
              Werkelijke aan- en verkoopprijzen van munten kunnen afwijken door handelsmarge, premies, 
              verzamelwaarde en lokale marktomstandigheden. De 1-dag vertraging zorgt voor stabiele en betrouwbare prijzen. 
              Gebruik deze prijzen als indicatie en raadpleeg altijd een erkende handelaar voor actuele transactieprijzen.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Bereken de Waarde van Uw Munten
        </h2>
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          Gebruik onze calculator met deze actuele prijzen om direct de intrinsieke waarde van uw Nederlandse munten te berekenen.
        </p>
        <a
          href="/"
          className="inline-block bg-yellow-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-yellow-700 transition"
        >
          Naar de Calculator
        </a>
      </div>
    </div>
  );
}