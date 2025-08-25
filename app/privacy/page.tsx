import { Metadata } from 'next';
import { Shield, Eye, Cookie, Database } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Beleid - Geldwaarde.nl',
  description: 'Lees ons privacy beleid en ontdek hoe Geldwaarde.nl omgaat met uw persoonlijke gegevens en privacy.',
  keywords: 'privacy, gegevens, cookies, gdpr, privacybeleid',
  openGraph: {
    title: 'Privacy Beleid - Geldwaarde.nl',
    description: 'Transparant over hoe wij omgaan met uw privacy en gegevens.',
    url: 'https://geldwaarde.nl/privacy',
    siteName: 'Geldwaarde.nl',
    locale: 'nl_NL',
    type: 'website',
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/30 to-blue-50/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li><a href="/" className="text-gray-600 hover:text-blue-600">Home</a></li>
            <li className="text-gray-400">/</li>
            <li className="text-blue-600 font-medium">Privacy</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Beleid</h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Geldwaarde.nl respecteert uw privacy en is transparant over het gebruik van uw gegevens.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Laatst bijgewerkt: 25 januari 2025
          </p>
        </div>

        {/* Introductie */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Shield className="mr-3 text-blue-500" />
            Introductie
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Dit privacy beleid legt uit hoe Geldwaarde.nl ("wij", "ons", "onze") uw persoonlijke 
            informatie verzamelt, gebruikt en beschermt wanneer u onze website bezoekt en onze 
            diensten gebruikt.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Door gebruik te maken van onze website, stemt u in met de praktijken beschreven in 
            dit privacy beleid.
          </p>
        </div>

        {/* Welke gegevens verzamelen we */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Database className="mr-3 text-blue-500" />
            Welke Gegevens Verzamelen Wij
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Automatisch Verzamelde Informatie</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>IP-adres en locatie informatie</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Browser type en versie</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Pagina's die u bezoekt en hoe lang</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Verwijzende websites</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Apparaat informatie</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Vrijwillig Verstrekte Informatie</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>E-mailadres (alleen bij contact opname)</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Naam (alleen bij contact opname)</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Bericht inhoud bij contact formulieren</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Hoe we uw gegevens gebruiken */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Eye className="mr-3 text-blue-500" />
            Hoe Wij Uw Gegevens Gebruiken
          </h2>
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Website Functionaliteit</h3>
              <p className="text-gray-700 text-sm">
                Om de website te laten functioneren, prijzen bij te werken en technische problemen op te lossen.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Gebruikerservaring Verbetering</h3>
              <p className="text-gray-700 text-sm">
                Analyseren hoe de website wordt gebruikt om de gebruiksvriendelijkheid te verbeteren.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Communicatie</h3>
              <p className="text-gray-700 text-sm">
                Reageren op vragen en ondersteuningsverzoeken die via e-mail of contact formulieren worden verzonden.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Veiligheid</h3>
              <p className="text-gray-700 text-sm">
                Beschermen tegen misbruik, fraude en andere kwaadwillende activiteiten.
              </p>
            </div>
          </div>
        </div>

        {/* Cookies */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Cookie className="mr-3 text-blue-500" />
            Cookies
          </h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            Wij gebruiken cookies en vergelijkbare technologieën om onze website te laten functioneren 
            en uw ervaring te verbeteren.
          </p>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Essentiële Cookies</h3>
              <p className="text-gray-700 text-sm">
                Noodzakelijk voor het functioneren van de website. Deze kunnen niet worden uitgeschakeld.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Analytische Cookies</h3>
              <p className="text-gray-700 text-sm">
                Helpen ons begrijpen hoe bezoekers onze website gebruiken, zodat we verbeteringen kunnen aanbrengen.
              </p>
            </div>
          </div>
        </div>

        {/* Gegevens delen */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Delen van Gegevens
          </h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            Wij verkopen, verhuren of delen uw persoonlijke gegevens niet met derden, behalve in de 
            volgende situaties:
          </p>
          
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Wanneer dit wettelijk vereist is</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Voor technische dienstverleners (zoals hosting providers)</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Met uw expliciete toestemming</span>
            </li>
          </ul>
        </div>

        {/* Uw rechten */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Uw Rechten
          </h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            Onder de AVG heeft u de volgende rechten met betrekking tot uw persoonlijke gegevens:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Recht op Inzage</h3>
              <p className="text-gray-700 text-sm">
                Vragen welke gegevens wij van u hebben.
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Recht op Correctie</h3>
              <p className="text-gray-700 text-sm">
                Onjuiste gegevens laten corrigeren.
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Recht op Verwijdering</h3>
              <p className="text-gray-700 text-sm">
                Verzoeken om verwijdering van uw gegevens.
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Recht op Bezwaar</h3>
              <p className="text-gray-700 text-sm">
                Bezwaar maken tegen verwerking van uw gegevens.
              </p>
            </div>
          </div>
        </div>

        {/* Contact informatie */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Contact voor Privacy Zaken
          </h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            Voor vragen over dit privacy beleid of het uitoefenen van uw rechten, kunt u contact 
            met ons opnemen via:
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700">
              <strong>E-mail:</strong> <a href="mailto:privacy@geldwaarde.nl" className="text-blue-600 hover:text-blue-800">privacy@geldwaarde.nl</a>
            </p>
            <p className="text-gray-700 mt-2">
              <strong>Reactietijd:</strong> Wij reageren binnen 30 dagen op privacy gerelateerde verzoeken.
            </p>
          </div>
        </div>

        {/* Wijzigingen */}
        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
          <h3 className="text-lg font-semibold text-amber-800 mb-3">
            Wijzigingen in Dit Privacy Beleid
          </h3>
          <p className="text-amber-700 text-sm">
            Wij kunnen dit privacy beleid van tijd tot tijd bijwerken. Wijzigingen worden op deze 
            pagina gepubliceerd met een nieuwe datum. Wij adviseren regelmatig te controleren op 
            updates.
          </p>
        </div>
      </div>
    </div>
  );
}