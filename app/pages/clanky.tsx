import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Články - Pionýrská skupina Pacov',
  description: 'Články a novinky z činnosti Pionýrské skupiny Pacov.',
};

export default function ClankyPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Články</h1>

      <div className="prose max-w-none">
        <p className="text-lg text-gray-700 mb-8">
          Zde najdete nejnovější články, reportáže a novinky z činnosti naší pionýrské skupiny.
        </p>

        <div className="space-y-8">
          <article className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Přípravy na zimní tábor 2024
                  </h2>
                  <p className="text-sm text-gray-500">Publikováno 15. listopadu 2024</p>
                </div>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Tábory
                </span>
              </div>
              <p className="text-gray-700 mb-4">
                Blíží se termín našeho tradičního zimního tábora. Letos se koná od 27. prosince 2024
                do 2. ledna 2025 na Hájence Bělá. Program je plný her, sportovních aktivit
                a táborového dobrodružství.
              </p>
              <a
                href="#"
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Číst více →
              </a>
            </div>
          </article>

          <article className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Úspěšný letní tábor 2024
                  </h2>
                  <p className="text-sm text-gray-500">Publikováno 15. srpna 2024</p>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  Reportáž
                </span>
              </div>
              <p className="text-gray-700 mb-4">
                Letní tábor 2024 na Hájence Bělá se vydařil na výbornou. Účastnilo se ho 28 dětí
                a měli jsme krásné počasí po celou dobu. Děti si užily spoustu her,
                výletů a táborových aktivit.
              </p>
              <a
                href="#"
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Číst více →
              </a>
            </div>
          </article>

          <article className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Rekonstrukce hájenky dokončena
                  </h2>
                  <p className="text-sm text-gray-500">Publikováno 1. května 2024</p>
                </div>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  Novinky
                </span>
              </div>
              <p className="text-gray-700 mb-4">
                Dokončili jsme rozsáhlou rekonstrukci naší hájenky. Nové sociální zařízení,
                opravené střechy a celkově modernizované zázemí nám poskytne ještě lepší
                podmínky pro naše aktivity.
              </p>
              <a
                href="#"
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Číst více →
              </a>
            </div>
          </article>

          <article className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Oslava 10. výročí skupiny
                  </h2>
                  <p className="text-sm text-gray-500">Publikováno 1. ledna 2024</p>
                </div>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                  Výročí
                </span>
              </div>
              <p className="text-gray-700 mb-4">
                Letos slavíme 10 let od založení Pionýrské skupiny Pacov. Během této doby
                jsme uspořádali desítky táborů, výletů a akcí pro stovky dětí z Pacova a okolí.
                Děkujeme všem vedoucím a rodičům za podporu!
              </p>
              <a
                href="#"
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Číst více →
              </a>
            </div>
          </article>
        </div>

        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Chcete být informováni?</h2>
          <p className="text-gray-700 mb-4">
            Sledujte naše aktivity na sociálních sítích nebo nás kontaktujte přímo:
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://www.facebook.com/profile.php?id=61573658450126"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-center"
            >
              Facebook
            </a>
            <a
              href="https://www.instagram.com/ldtbela"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition-colors text-center"
            >
              Instagram
            </a>
            <a
              href="mailto:mareseznam@seznam.cz"
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors text-center"
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}