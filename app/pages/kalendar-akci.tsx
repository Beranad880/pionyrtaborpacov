import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kalendář akcí - Pionýrská skupina Pacov',
  description: 'Přehled nadcházejících akcí a událostí Pionýrské skupiny Pacov.',
};

export default function KalendarAkciPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Kalendář akcí</h1>

      <div className="prose max-w-none">
        <p className="text-lg text-gray-700 mb-8">
          Zde najdete přehled všech nadcházejících akcí, táborů a aktivit naší pionýrské skupiny.
        </p>

        <div className="space-y-6">
          <div className="bg-white border-l-4 border-red-500 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Zimní tábor</h3>
                <p className="text-gray-600 mb-2">
                  <strong>Datum:</strong> 27. 12. 2024 - 2. 1. 2025
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Místo:</strong> Hájenka Bělá
                </p>
                <p className="text-gray-700">
                  Týdenní zimní tábor plný her, sportovních aktivit a táborového dobrodružství.
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  Přihlašování otevřeno
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border-l-4 border-blue-500 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Víkendová výprava</h3>
                <p className="text-gray-600 mb-2">
                  <strong>Datum:</strong> 15. - 16. 3. 2025
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Místo:</strong> Okolí Pacova
                </p>
                <p className="text-gray-700">
                  Poznávací výprava po místních památkách a přírodních zajímavostech.
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                  Brzy
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border-l-4 border-green-500 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Letní tábor</h3>
                <p className="text-gray-600 mb-2">
                  <strong>Datum:</strong> Červenec 2025 (přesný termín bude upřesněn)
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Místo:</strong> Hájenka Bělá
                </p>
                <p className="text-gray-700">
                  Hlavní událost roku - dvoutýdenní letní tábor plný her, výprav a zábavy.
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  V přípravě
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Informace o přihlašování</h2>
          <p className="text-gray-700 mb-3">
            Pro přihlášení na naše akce nebo pro získání více informací nás kontaktujte:
          </p>
          <div className="space-y-1">
            <p><strong>Email:</strong> mareseznam@seznam.cz</p>
            <p><strong>Telefon:</strong> +420 607 244 526</p>
            <p><strong>Vedoucí:</strong> Mgr. Ladislav Mareš</p>
          </div>
        </div>
      </div>
    </main>
  );
}