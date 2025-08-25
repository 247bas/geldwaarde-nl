import { Metadata } from 'next';
import { Mail, MessageSquare, Clock, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact - Geldwaarde.nl',
  description: 'Neem contact op met Geldwaarde.nl voor vragen over Nederlandse historische munten, technische ondersteuning of suggesties voor verbeteringen.',
  keywords: 'contact, vragen, ondersteuning, nederlandse munten, hulp',
  openGraph: {
    title: 'Contact - Geldwaarde.nl',
    description: 'Heeft u vragen over Nederlandse munten? Neem contact met ons op.',
    url: 'https://geldwaarde.nl/contact',
    siteName: 'Geldwaarde.nl',
    locale: 'nl_NL',
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/30 to-blue-50/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li><a href="/" className="text-gray-600 hover:text-blue-600">Home</a></li>
            <li className="text-gray-400">/</li>
            <li className="text-blue-600 font-medium">Contact</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact</h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Heeft u vragen over Nederlandse munten of onze website? Wij helpen u graag verder.
          </p>
        </div>

        {/* Contact Informatie */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Mail className="mr-3 text-blue-500" />
              Contact Informatie
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <MessageSquare className="mr-3 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">E-mail</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    Voor algemene vragen en ondersteuning:
                  </p>
                  <a href="mailto:info@geldwaarde.nl" className="text-blue-600 hover:text-blue-800 font-medium">
                    info@geldwaarde.nl
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="mr-3 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Reactietijd</h3>
                  <p className="text-gray-700 text-sm">
                    Wij streven ernaar om binnen 2 werkdagen te reageren op uw e-mail.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Veelgestelde Vragen
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Hoe nauwkeurig zijn de waardes?</h3>
                <p className="text-gray-700 text-sm">
                  Onze waardes zijn gebaseerd op actuele edelmetaalprijzen en geven de intrinsieke 
                  waarde weer. Voor verzamelaarswaarde adviseren wij professionele taxatie.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Waarom ontbreekt een bepaalde munt?</h3>
                <p className="text-gray-700 text-sm">
                  Onze database wordt continu uitgebreid. Mist u een munt? Laat het ons weten 
                  via e-mail en wij voegen deze toe aan onze wishlist.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Kan ik munten verkopen via deze website?</h3>
                <p className="text-gray-700 text-sm">
                  Nee, wij zijn geen munthandel. Deze website biedt alleen waardering informatie. 
                  Voor verkoop verwijzen wij u door naar erkende munthandelaren.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Waar we mee kunnen helpen */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Waar Wij Mee Kunnen Helpen
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Vragen over muntwaarden</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Technische problemen met de website</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Suggesties voor nieuwe functies</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Feedback over de website</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Correcties van muntgegevens</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Verzoeken voor nieuwe munten</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Algemene numismatieke vragen</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Partnerschappen en samenwerking</span>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
          <h3 className="text-lg font-semibold text-amber-800 mb-3 flex items-center">
            <AlertCircle className="mr-2" />
            Let Op
          </h3>
          <div className="space-y-2">
            <p className="text-amber-700 text-sm">
              • Wij bieden geen taxatiediensten aan en kunnen geen individuele munten beoordelen
            </p>
            <p className="text-amber-700 text-sm">
              • Voor professionele taxaties verwijzen wij u door naar erkende munthandelaren
            </p>
            <p className="text-amber-700 text-sm">
              • Wij kopen en verkopen geen munten via deze website
            </p>
            <p className="text-amber-700 text-sm">
              • Alle waardes zijn indicatief en gebaseerd op intrinsieke edelmetaalwaarde
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}