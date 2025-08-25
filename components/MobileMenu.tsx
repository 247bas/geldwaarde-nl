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
      <div className="lg:hidden hidden bg-white border-b shadow-lg" id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <a
            href="/gouden-munten"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-yellow-600 hover:bg-gray-50 rounded-md transition"
          >
            Gouden Munten
          </a>
          <a
            href="/zilveren-munten"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition"
          >
            Zilveren Munten
          </a>
          <a
            href="/collectie"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition"
          >
            Mijn Collectie
          </a>
          <a
            href="/prijzen"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition"
          >
            Actuele Prijzen
          </a>
        </div>
      </div>
    </>
  );
}