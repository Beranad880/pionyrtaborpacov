'use client';

import { useState, useEffect } from 'react';
import { allPagesContent } from '@/data/content';

export default function HajenkabelaPage() {
  const [content, setContent] = useState(allPagesContent.hajenkaBela);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content?page=hajenkaBela');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setContent(result.data);
          }
        }
      } catch (error) {
        console.log('Failed to fetch content, using static data');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{content.title}</h1>

      <div className="prose max-w-none">
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div>
            <img
              src={content.images?.exterior || "/images/hajenka-exterior.jpg"}
              alt="Hájenka Bělá - exteriér"
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
          </div>
          <div>
            <p className="text-lg text-gray-700 mb-4">
              {content.description}
            </p>
            <p className="text-gray-700">
              {content.details}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Vybavení</h2>
            <ul className="space-y-2 text-gray-700">
              {content.equipment?.map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Aktivity</h2>
            <ul className="space-y-2 text-gray-700">
              {content.activities?.map((activity, index) => (
                <li key={index}>• {activity}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-3">{content.location?.title || 'Poloha a dostupnost'}</h2>
          <p className="text-gray-700 mb-3">
            {content.location?.description || 'Hájenka Bělá se nachází v klidné přírodní lokalitě s dobrou dostupností jak automobilem, tak veřejnou dopravou.'}
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>GPS souřadnice:</strong></p>
              <p className="text-gray-600">{content.location?.gps || 'Budou upřesněny'}</p>
            </div>
            <div>
              <p><strong>Nejbližší město:</strong></p>
              <p className="text-gray-600">{content.location?.nearestTown || 'Pacov (5 km)'}</p>
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