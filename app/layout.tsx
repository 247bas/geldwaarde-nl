import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MobileMenu } from "@/components/MobileMenu";
// import { ClientProviders } from "@/components/ClientProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Geldwaarde.nl - Bereken de Waarde van Nederlandse Munten",
  description: "Bereken direct de actuele waarde van uw Nederlandse gouden en zilveren munten. Gouden tientjes, zilveren guldens, rijksdaalders en meer.",
  keywords: "gouden tientje, zilveren gulden, muntwaarde, goudprijs, zilverprijs, nederlandse munten, oude munten waarde",
  authors: [{ name: "Geldwaarde.nl" }],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  openGraph: {
    title: "Geldwaarde.nl - Nederlandse Muntwaarde Calculator",
    description: "Bereken direct de waarde van uw Nederlandse gouden en zilveren munten met actuele edelmetaalprijzen.",
    url: "https://geldwaarde.nl",
    siteName: "Geldwaarde.nl",
    locale: "nl_NL",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "verification-token",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className={`${inter.className} antialiased bg-gray-50`}>
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <a href="/" className="flex items-center">
                  <span className="text-2xl font-bold text-yellow-600">€</span>
                  <span className="ml-2 text-xl font-semibold text-gray-900">Geldwaarde.nl</span>
                </a>
              </div>
              <nav className="hidden lg:flex items-center space-x-8">
                <a href="/gouden-munten" className="text-gray-700 hover:text-yellow-600 transition">
                  Gouden Munten
                </a>
                <a href="/zilveren-munten" className="text-gray-700 hover:text-gray-900 transition">
                  Zilveren Munten
                </a>
                <a href="/collectie" className="text-gray-700 hover:text-gray-900 transition">
                  Mijn Collectie
                </a>
                <a href="/prijzen" className="text-gray-700 hover:text-gray-900 transition">
                  Actuele Prijzen
                </a>
              </nav>

              <MobileMenu />
            </div>
          </div>
        </nav>
        
        <main className="min-h-screen">
          {children}
        </main>
        
        <footer className="bg-gray-800 text-white mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Geldwaarde.nl</h3>
                <p className="text-gray-400 text-sm">
                  Bereken de actuele waarde van Nederlandse historische munten op basis van de huidige edelmetaalprijzen.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Gouden Munten</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="/gouden-munten/gouden-tientje" className="text-gray-400 hover:text-white">Gouden Tientje</a></li>
                  <li><a href="/gouden-munten/gouden-vijfje" className="text-gray-400 hover:text-white">Gouden Vijfje</a></li>
                  <li><a href="/gouden-munten/gouden-gulden" className="text-gray-400 hover:text-white">Gouden Gulden</a></li>
                  <li><a href="/gouden-munten/gouden-twintig-gulden" className="text-gray-400 hover:text-white">Gouden Twintig Gulden</a></li>
                  <li><a href="/gouden-munten/gouden-dukaat" className="text-gray-400 hover:text-white">Gouden Dukaat</a></li>
                  <li><a href="/gouden-munten/gouden-dubbele-dukaat" className="text-gray-400 hover:text-white">Gouden Dubbele Dukaat</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Zilveren Munten</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="/zilveren-munten/zilveren-tientje" className="text-gray-400 hover:text-white">Zilveren Tientje</a></li>
                  <li><a href="/zilveren-munten/zilveren-rijksdaalder" className="text-gray-400 hover:text-white">Zilveren Rijksdaalder</a></li>
                  <li><a href="/zilveren-munten/zilveren-gulden" className="text-gray-400 hover:text-white">Zilveren Gulden</a></li>
                  <li><a href="/zilveren-munten/zilveren-vijftig-gulden" className="text-gray-400 hover:text-white">Zilveren Vijftig Gulden</a></li>
                  <li><a href="/zilveren-munten/zilveren-drie-gulden" className="text-gray-400 hover:text-white">Zilveren Drie Gulden</a></li>
                  <li><a href="/zilveren-munten/zilveren-halve-gulden" className="text-gray-400 hover:text-white">Zilveren Halve Gulden</a></li>
                  <li><a href="/zilveren-munten/zilveren-dukaat" className="text-gray-400 hover:text-white">Zilveren Dukaat</a></li>
                  <li><a href="/zilveren-munten/zilveren-kwartje" className="text-gray-400 hover:text-white">Zilveren Kwartje</a></li>
                  <li><a href="/zilveren-munten/zilveren-tien-cent" className="text-gray-400 hover:text-white">Zilveren Tien Cent</a></li>
                  <li><a href="/zilveren-munten/zilveren-vijf-cent" className="text-gray-400 hover:text-white">Zilveren Vijf Cent</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Informatie</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="/over" className="text-gray-400 hover:text-white">Over Ons</a></li>
                  <li><a href="/contact" className="text-gray-400 hover:text-white">Contact</a></li>
                  <li><a href="/privacy" className="text-gray-400 hover:text-white">Privacy</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
              <p>&copy; 2025 Geldwaarde.nl. Alle rechten voorbehouden.</p>
              <p className="mt-2">Prijzen zijn indicatief. Raadpleeg een professional voor accurate taxaties.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
