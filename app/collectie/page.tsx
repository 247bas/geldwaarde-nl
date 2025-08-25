import { Metadata } from 'next';
import { Coins, TrendingUp, Database, Settings, BarChart, Clock, Star, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mijn Muntcollectie Dashboard - Binnenkort Beschikbaar | Geldwaarde.nl',
  description: 'Beheer uw muntcollectie digitaal. Volg de waardeontwikkeling van uw gouden en zilveren munten met ons persoonlijke dashboard. Binnenkort beschikbaar.',
  keywords: 'muntcollectie, dashboard, waardeontwikkeling, portfolio, gouden munten, zilveren munten, collectie beheer',
  openGraph: {
    title: 'Mijn Muntcollectie Dashboard - Binnenkort',
    description: 'Digitaal dashboard voor uw muntcollectie. Volg waardeontwikkeling en beheer uw portfolio.',
    url: 'https://geldwaarde.nl/collectie',
    siteName: 'Geldwaarde.nl',
    locale: 'nl_NL',
    type: 'website',
  },
};

export default function CollectiePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="text-sm mb-6">
        <ol className="flex items-center space-x-2">
          <li><a href="/" className="text-gray-500 hover:text-gray-700">Home</a></li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-900 font-medium">Mijn Collectie</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="text-center mb-12">
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-8 mb-8">
          <div className="flex justify-center mb-6">
            <div className="bg-yellow-200 w-20 h-20 rounded-full flex items-center justify-center">
              <Database className="w-10 h-10 text-yellow-700" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mijn Muntcollectie Dashboard
          </h1>
          <p className="text-xl text-gray-700 mb-4 max-w-3xl mx-auto">
            Binnenkort kunt u hier uw complete muntcollectie digitaal beheren en de waardeontwikkeling van uw portfolio real-time volgen.
          </p>
          <div className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold inline-block">
            🔧 In Ontwikkeling
          </div>
        </div>
      </div>

      {/* Upcoming Features */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Aankomende Functionaliteiten
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Portfolio Management */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Coins className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Portfolio Beheer</h3>
            <p className="text-gray-600 mb-4">
              Voeg uw munten toe aan uw persoonlijke collectie met details over aantal, aankoopprijs en datum.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Munt toevoegen met foto's</li>
              <li>• Aankoop details bijhouden</li>
              <li>• Categorieën en tags</li>
              <li>• Notities per munt</li>
            </ul>
          </div>

          {/* Value Tracking */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Waardeontwikkeling</h3>
            <p className="text-gray-600 mb-4">
              Volg de actuele waarde van uw collectie en zie hoe uw investeringen presteren over tijd.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Real-time waardeberekening</li>
              <li>• Winst/verlies tracking</li>
              <li>• Performance grafieken</li>
              <li>• Vergelijking met metaalprijzen</li>
            </ul>
          </div>

          {/* Analytics Dashboard */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <BarChart className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Analytics Dashboard</h3>
            <p className="text-gray-600 mb-4">
              Uitgebreide statistieken over uw collectie met inzichten en trends.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Portfolio samenstelling</li>
              <li>• Diversificatie analyse</li>
              <li>• Rendement per categorie</li>
              <li>• Markt vergelijkingen</li>
            </ul>
          </div>

          {/* Alerts & Notifications */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Meldingen & Alerts</h3>
            <p className="text-gray-600 mb-4">
              Krijg meldingen bij belangrijke prijsveranderingen of portfolio mijlpalen.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Prijsalerts instellen</li>
              <li>• Dagelijkse/wekelijkse updates</li>
              <li>• Portfolio mijlpalen</li>
              <li>• Markt nieuws</li>
            </ul>
          </div>

          {/* Wishlist */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="bg-pink-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Verlanglijst</h3>
            <p className="text-gray-600 mb-4">
              Houd bij welke munten u nog wilt toevoegen aan uw collectie.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Gewenste munten markeren</li>
              <li>• Prijsalerts voor wensmunten</li>
              <li>• Budget planning</li>
              <li>• Aankoop prioriteiten</li>
            </ul>
          </div>

          {/* Security & Privacy */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Veiligheid & Privacy</h3>
            <p className="text-gray-600 mb-4">
              Uw collectiegegevens worden veilig opgeslagen en blijven volledig privé.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Lokale data opslag</li>
              <li>• Geen gedeelde informatie</li>
              <li>• Export mogelijkheden</li>
              <li>• Data back-ups</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Preview Mock-up */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Dashboard Preview
        </h2>
        
        <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
          <div className="text-center text-gray-500 mb-8">
            <Settings className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">Interface Mockup</p>
            <p className="text-sm">Het dashboard zal een overzichtelijke interface krijgen met:</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="bg-white rounded-lg p-4 border">
              <h4 className="font-semibold mb-2">📊 Portfolio Overzicht</h4>
              <div className="space-y-2 text-gray-600">
                <p>• Totale waarde: €X.XXX,XX</p>
                <p>• Aantal munten: XX stuks</p>
                <p>• Vandaag: +/- €XX,XX</p>
                <p>• Deze maand: +/- X.X%</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border">
              <h4 className="font-semibold mb-2">🥇 Top Munten</h4>
              <div className="space-y-2 text-gray-600">
                <p>1. Gouden Tientje (5x)</p>
                <p>2. Zilveren Gulden (12x)</p>
                <p>3. Gouden Vijfje (2x)</p>
                <p>+ Meer munten...</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border">
              <h4 className="font-semibold mb-2">📈 Performance</h4>
              <div className="space-y-2 text-gray-600">
                <p>• Best presterende munt</p>
                <p>• Slechtst presterende munt</p>
                <p>• Gemiddeld rendement</p>
                <p>• Portfolio diversificatie</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Blijf op de Hoogte
        </h2>
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          Wilt u een melding ontvangen zodra het collectie dashboard beschikbaar is? 
          We verwachten de lancering in de komende maanden.
        </p>
        <div className="flex justify-center mb-4">
          <div className="bg-yellow-200 px-6 py-3 rounded-lg text-gray-700">
            📧 Nieuwsbrief aanmelding komt binnenkort
          </div>
        </div>
        <p className="text-sm text-gray-600">
          In de tussentijd kunt u de <a href="/" className="text-yellow-700 hover:underline font-medium">muntcalculator</a> gebruiken 
          om de waarde van individuele munten te berekenen.
        </p>
      </div>

      {/* Temporary CTA */}
      <div className="mt-12 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Gebruik Nu Onze Calculator
        </h3>
        <p className="text-gray-600 mb-6">
          Terwijl we werken aan het collectie dashboard, kunt u alvast de waarde van uw munten berekenen.
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