import { Metadata } from 'next';
import { Users, Target, TrendingUp, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Over Ons - Geldwaarde.nl',
  description: 'Leer meer over Geldwaarde.nl, uw betrouwbare bron voor het waarderen van Nederlandse historische munten op basis van actuele edelmetaalprijzen.',
  keywords: 'over ons, geldwaarde, nederlandse munten, muntwaarde, edelmetaal prijzen',
  openGraph: {
    title: 'Over Ons - Geldwaarde.nl',
    description: 'Betrouwbare informatie over Nederlandse historische munten.',
    url: 'https://geldwaarde.nl/over',
    siteName: 'Geldwaarde.nl',
    locale: 'nl_NL',
    type: 'website',
  },
};

export default function OverOnsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/30 to-blue-50/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li><a href="/" className="text-gray-600 hover:text-blue-600">Home</a></li>
            <li className="text-gray-400">/</li>
            <li className="text-blue-600 font-medium">Over Ons</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Over Geldwaarde.nl</h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Uw betrouwbare partner voor het bepalen van de actuele waarde van Nederlandse historische munten.
          </p>
        </div>

        {/* Onze Missie */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Target className="mr-3 text-blue-500" />
            Onze Missie
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Geldwaarde.nl is ontstaan uit de passie voor Nederlandse numismatiek en de behoefte aan accurate, 
            up-to-date informatie over de waarde van historische munten. Wij geloven dat iedereen toegang moet 
            hebben tot betrouwbare informatie over de actuele waarde van hun munten.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Door gebruik te maken van live edelmetaalprijzen en uitgebreide historische data, bieden wij 
            gebruikers de mogelijkheid om snel en nauwkeurig de intrinsieke waarde van hun Nederlandse 
            gulden munten te bepalen.
          </p>
        </div>

        {/* Wat Wij Doen */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="mr-3 text-blue-500" />
            Wat Wij Doen
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Live Prijsberekening</h3>
              <p className="text-gray-700 text-sm">
                Onze calculator gebruikt realtime goud- en zilverprijzen om de actuele intrinsieke 
                waarde van uw munten te bepalen.
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Uitgebreide Database</h3>
              <p className="text-gray-700 text-sm">
                Complete informatie over Nederlandse munten van 1814 tot heden, inclusief gewicht, 
                afmetingen en edelmetaalgehalte.
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Historische Context</h3>
              <p className="text-gray-700 text-sm">
                Achtergrond informatie over de verschillende muntperiodes en hun historische betekenis 
                binnen de Nederlandse geschiedenis.
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Gebruiksvriendelijk</h3>
              <p className="text-gray-700 text-sm">
                Eenvoudig te gebruiken interface die zowel beginners als ervaren verzamelaars 
                snel de gewenste informatie geeft.
              </p>
            </div>
          </div>
        </div>

        {/* Onze Waarden */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Shield className="mr-3 text-blue-500" />
            Onze Waarden
          </h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-gray-900">Betrouwbaarheid</h3>
                <p className="text-gray-700 text-sm">
                  Alle informatie is zorgvuldig gecontroleerd en gebaseerd op officiële bronnen 
                  en numismatische literatuur.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-gray-900">Transparantie</h3>
                <p className="text-gray-700 text-sm">
                  Wij tonen duidelijk hoe waardes worden berekend en waarschuwen dat prijzen 
                  indicatief zijn voor professionele taxatie.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-gray-900">Toegankelijkheid</h3>
                <p className="text-gray-700 text-sm">
                  Gratis toegang tot alle basis functionaliteiten, omdat iedereen recht heeft 
                  op betrouwbare muntinformatie.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Users className="mr-3 text-blue-500" />
            Ons Team
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Geldwaarde.nl wordt onderhouden door een team van numismatiek enthousiastelingen en 
            technologie specialisten. Onze kennis komt voort uit jarenlange ervaring in het 
            verzamelen van Nederlandse munten en het ontwikkelen van betrouwbare waarderingstools.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
          <h3 className="text-lg font-semibold text-amber-800 mb-3">Belangrijke Mededeling</h3>
          <p className="text-amber-700 text-sm">
            De waardes die op deze website worden getoond zijn gebaseerd op de intrinsieke 
            edelmetaalwaarde en dienen als indicatie. Voor accurate taxaties van verzamelaarswaarde, 
            zeldzaamheid en staat adviseren wij altijd het raadplegen van een professionele munthandelaar 
            of taxateur.
          </p>
        </div>
      </div>
    </div>
  );
}