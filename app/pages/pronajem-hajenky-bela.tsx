import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pronájem Hájenky Bělá - Pionýrská skupina Pacov',
  description: 'Informace o pronájmu naší táborové základny Hájenka Bělá.',
};

export default function PronajemHajenkybePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Pronájem Hájenky Bělá</h1>

      <div className="prose max-w-none">
        <p className="text-lg text-gray-700 mb-8">
          Hájenka Bělá je k dispozici pro pronájem školám, spolkům a organizacím
          pro letní tábory, víkendové pobyty a další akce.
        </p>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Kapacita a vybavení</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span><strong>Ubytování:</strong> až 35 osob v pokojích</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span><strong>Kuchyně:</strong> plně vybavená pro větší skupiny</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span><strong>Jídelna:</strong> prostorná pro celou skupinu</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span><strong>Sociální zařízení:</strong> sprchy a toalety</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span><strong>Klubovna:</strong> pro společné aktivity</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span><strong>Venkovní prostory:</strong> ohniště, sportoviště</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Cenník</h2>
            <div className="space-y-4">
              <div className="border-b pb-3">
                <p className="font-semibold">Víkendový pobyt (2-3 dny)</p>
                <p className="text-lg text-red-600 font-semibold">1 500 Kč / den</p>
                <p className="text-sm text-gray-600">za celý objekt</p>
              </div>
              <div className="border-b pb-3">
                <p className="font-semibold">Týdenní pobyt</p>
                <p className="text-lg text-red-600 font-semibold">1 200 Kč / den</p>
                <p className="text-sm text-gray-600">za celý objekt</p>
              </div>
              <div>
                <p className="font-semibold">Dlouhodobý pronájem</p>
                <p className="text-lg text-red-600 font-semibold">Individuální cena</p>
                <p className="text-sm text-gray-600">podle domluvy</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Podmínky pronájmu</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-gray-900">Zahrnuté služby:</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• Ubytování v pokojích</li>
                <li>• Použití kuchyně a jídelny</li>
                <li>• Základní vybavení</li>
                <li>• Parkování</li>
                <li>• Použití venkovních prostorů</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-gray-900">Nutné uhradit navíc:</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• Energie (elektřina, voda)</li>
                <li>• Úklid (při nedostatečném úklidu)</li>
                <li>• Případné škody</li>
                <li>• Použití grilu (50 Kč/den)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Jak rezervovat</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-4">
            <li>Kontaktujte nás telefonicky nebo e-mailem</li>
            <li>Dohodněte termín a podmínky</li>
            <li>Složte zálohu 30% z celkové ceny</li>
            <li>Dostavte se v domluvený termín</li>
            <li>Doplaťte zbytek při příjezdu</li>
          </ol>
          <div className="bg-white p-4 rounded border-l-4 border-blue-500">
            <p className="font-semibold mb-2">Rezervace doporučujeme minimálně 1 měsíc předem!</p>
            <p className="text-sm text-gray-600">
              Zejména v období prázdnin a víkendů je o hájenku velký zájem.
            </p>
          </div>
        </div>

        <div className="bg-red-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Kontakt pro rezervace</h2>
          <div className="space-y-2">
            <p><strong>Mgr. Ladislav Mareš</strong></p>
            <p><strong>Email:</strong> mareseznam@seznam.cz</p>
            <p><strong>Telefon:</strong> +420 607 244 526</p>
            <p><strong>Adresa:</strong> Jana Autengrubera 227, 390 01 Pacov</p>
          </div>
          <div className="mt-4 text-sm text-gray-700">
            <p>
              <strong>Úřední hodiny:</strong> Po předchozí domluvě, nejlépe večer nebo o víkendu.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}