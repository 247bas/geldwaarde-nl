'use client';

export function MobileMenu() {
  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden">
        <button
          type="button"
          className="text-gray-700 hover:text-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 p-2"
          onClick={() => {
            const menu = document.getElementById('mobile-menu');
            const isHidden = menu?.classList.contains('hidden');
            if (isHidden) {
              menu?.classList.remove('hidden');
            } else {
              menu?.classList.add('hidden');
            }
          }}
        >
          <span className="sr-only">Open main menu</span>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <div className="lg:hidden hidden bg-white border-t shadow-xl absolute top-16 left-0 right-0 z-50" id="mobile-menu">
        <div className="px-4 pt-4 pb-4 space-y-2">
          <a
            href="/gouden-munten"
            className="block px-4 py-3 text-lg font-medium text-gray-800 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition border-b border-gray-100"
          >
            🥇 Gouden Munten
          </a>
          <a
            href="/zilveren-munten"
            className="block px-4 py-3 text-lg font-medium text-gray-800 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition border-b border-gray-100"
          >
            🥈 Zilveren Munten
          </a>
          <a
            href="/collectie"
            className="block px-4 py-3 text-lg font-medium text-gray-800 hover:text-green-600 hover:bg-green-50 rounded-lg transition border-b border-gray-100"
          >
            📁 Mijn Collectie
          </a>
          <a
            href="/prijzen"
            className="block px-4 py-3 text-lg font-medium text-gray-800 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
          >
            💰 Actuele Prijzen
          </a>
        </div>
      </div>
    </>
  );
}