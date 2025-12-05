import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pionýrské oddíly - Pionýrská skupina Pacov',
  description: 'Informace o našich pionýrských oddílech a jejich činnosti.',
};

export default function PionyrseOddilyPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Pionýrské oddíly</h1>

      <div className="prose max-w-none">
        <p className="text-lg text-gray-700 mb-6">
          Naše pionýrské oddíly poskytují zážitkové aktivity pro děti a mládež různých věkových kategorií.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Mladší pionýři</h2>
            <p className="text-gray-600 mb-2"><strong>Věk:</strong> 6-10 let</p>
            <p className="text-gray-700">
              Hry, rukodělné aktivity, poznávání přírody a základy táborových dovedností.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Starší pionýři</h2>
            <p className="text-gray-600 mb-2"><strong>Věk:</strong> 11-15 let</p>
            <p className="text-gray-700">
              Dobrodružné výpravy, sportovní aktivity, projekty a komunitní služba.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Roveři</h2>
            <p className="text-gray-600 mb-2"><strong>Věk:</strong> 16+ let</p>
            <p className="text-gray-700">
              Vedení mladších skupin, organizace akcí a rozvoj leadership dovedností.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Jak se zapojit?</h2>
          <p className="text-gray-700 mb-4">
            Pokud máte zájem o zapojení do našich oddílů, kontaktujte nás pomocí níže uvedených údajů
            nebo navštivte některou z našich akcí.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="font-semibold">Kontakt:</p>
            <p>Email: mareseznam@seznam.cz</p>
            <p>Telefon: +420 607 244 526</p>
          </div>
        </div>
      </div>
    </main>
  );
}