import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hájenka Bělá - Pionýrská skupina Pacov',
  description: 'Informace o naší táborové základně Hájenka Bělá.',
};

export default function HajenkabelaPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Hájenka Bělá</h1>

      <div className="prose max-w-none">
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div>
            <img
              src="/images/hajenka-exterior.jpg"
              alt="Hájenka Bělá - exteriér"
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
          </div>
          <div>
            <p className="text-lg text-gray-700 mb-4">
              Hájenka Bělá je naším táborovým centrem a základnou pro většinu našich aktivit.
              Nachází se v krásném přírodním prostředí, které nabízí ideální podmínky pro táborování a outdoorové aktivity.
            </p>
            <p className="text-gray-700">
              Objekt prošel rekonstrukcí a poskytuje moderní zázemí při zachování autentické táborové atmosféry.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Vybavení</h2>
            <ul className="space-y-2 text-gray-700">
              <li>• Ubytování pro 30+ osob</li>
              <li>• Vybavená kuchyně a jídelna</li>
              <li>• Sociální zařízení</li>
              <li>• Klubovna pro společné aktivity</li>
              <li>• Ohniště a grilovací místo</li>
              <li>• Sportovní areál</li>
              <li>• Okolní lesy a příroda</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Aktivity</h2>
            <ul className="space-y-2 text-gray-700">
              <li>• Táborové hry a programy</li>
              <li>• Turistické výlety</li>
              <li>• Sportovní aktivity</li>
              <li>• Rukodělné dílny</li>
              <li>• Večerní ohně</li>
              <li>• Pozorování hvězd</li>
              <li>• Přírodovědné programy</li>
            </ul>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-3">Poloha a dostupnost</h2>
          <p className="text-gray-700 mb-3">
            Hájenka Bělá se nachází v klidné přírodní lokalitě s dobrou dostupností jak automobilem,
            tak veřejnou dopravou. Okolí nabízí mnoho možností pro turistiku a poznávání přírody.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>GPS souřadnice:</strong></p>
              <p className="text-gray-600">Budou upřesněny</p>
            </div>
            <div>
              <p><strong>Nejbližší město:</strong></p>
              <p className="text-gray-600">Pacov (5 km)</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Kontakt</h2>
          <p className="text-gray-700 mb-3">
            Pro více informací o Hájence Bělá nebo rezervaci nás kontaktujte:
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