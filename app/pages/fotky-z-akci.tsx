import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fotky z akcí - Pionýrská skupina Pacov',
  description: 'Fotogalerie z akcí a táborů Pionýrské skupiny Pacov.',
};

export default function FotkyZAkciPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Fotky z akcí</h1>

      <div className="prose max-w-none">
        <p className="text-lg text-gray-700 mb-8">
          Podívejte se na fotky z našich táborů, výletů a dalších akcí.
          Zachycujeme zde nejkrásnější okamžiky z pionýrského života.
        </p>

        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Zimní tábor 2023/24</h2>
              <p className="text-gray-600">27. 12. 2023 - 2. 1. 2024 • Hájenka Bělá</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={`/images/gallery/zimni-tabor-2023-${i}.jpg`}
                    alt={`Zimní tábor 2023 - foto ${i}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik05MCA3MEwxMTAgOTBMMTMwIDcwTDE1MCA5MEwxMzAgMTEwTDExMCAxMzBMOTAgMTEwTDcwIDkwTDkwIDcwWiIgZmlsbD0iI0Q1RDlERiIvPgo8L3N2Zz4K';
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="p-4 border-t bg-gray-50">
              <button className="text-red-600 hover:text-red-800 font-medium">
                Zobrazit všechny fotky (24) →
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Letní tábor 2024</h2>
              <p className="text-gray-600">7. - 21. července 2024 • Hájenka Bělá</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={`/images/gallery/letni-tabor-2024-${i}.jpg`}
                    alt={`Letní tábor 2024 - foto ${i}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik05MCA3MEwxMTAgOTBMMTMwIDcwTDE1MCA5MEwxMzAgMTEwTDExMCAxMzBMOTAgMTEwTDcwIDkwTDkwIDcwWiIgZmlsbD0iI0Q1RDlERiIvPgo8L3N2Zz4K';
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="p-4 border-t bg-gray-50">
              <button className="text-red-600 hover:text-red-800 font-medium">
                Zobrazit všechny fotky (67) →
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Víkendová výprava - Pelhřimov</h2>
              <p className="text-gray-600">15. - 16. září 2024</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={`/images/gallery/vyprava-pelhrimov-${i}.jpg`}
                    alt={`Výprava Pelhřimov - foto ${i}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik05MCA3MEwxMTAgOTBMMTMwIDcwTDE1MCA5MEwxMzAgMTEwTDExMCAxMzBMOTAgMTEwTDcwIDkwTDkwIDcwWiIgZmlsbD0iI0Q1RDlERiIvPgo8L3N2Zz4K';
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="p-4 border-t bg-gray-50">
              <button className="text-red-600 hover:text-red-800 font-medium">
                Zobrazit všechny fotky (18) →
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Stavění májky 2024</h2>
              <p className="text-gray-600">1. května 2024 • Pacov</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={`/images/gallery/majka-2024-${i}.jpg`}
                    alt={`Stavění májky 2024 - foto ${i}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik05MCA3MEwxMTAgOTBMMTMwIDcwTDE1MCA5MEwxMzAgMTEwTDExMCAxMzBMOTAgMTEwTDcwIDkwTDkwIDcwWiIgZmlsbD0iI0Q1RDlERiIvPgo8L3N2Zz4K';
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="p-4 border-t bg-gray-50">
              <button className="text-red-600 hover:text-red-800 font-medium">
                Zobrazit všechny fotky (12) →
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Sdílení fotek</h2>
          <p className="text-gray-700 mb-4">
            Pokud máte fotky z našich akcí, které byste chtěli sdílet,
            pošlete je na náš email nebo je označte na sociálních sítích.
          </p>
          <div className="space-y-2">
            <p><strong>Email:</strong> mareseznam@seznam.cz</p>
            <p><strong>Facebook:</strong> @pionyrska.skupina.pacov</p>
            <p><strong>Instagram:</strong> @ldtbela</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Všechny fotky jsou použity se souhlasem rodičů a účastníků akcí.
          </p>
        </div>
      </div>
    </main>
  );
}