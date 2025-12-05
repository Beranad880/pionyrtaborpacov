'use client';

import { useState, useEffect } from 'react';
import { allPagesContent } from '@/data/content';

export default function PionyrseOddilyPage() {
  const [content, setContent] = useState(allPagesContent.pioneerGroups);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content?page=pioneerGroups');
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
        <p className="text-lg text-gray-700 mb-6">
          {content.description}
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.groups?.map((group, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-3">{group.name}</h2>
              <p className="text-gray-600 mb-2"><strong>Věk:</strong> {group.ageRange}</p>
              <p className="text-gray-700 mb-4">
                {group.description}
              </p>
              {group.activities && group.activities.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Aktivity:</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {group.activities.map((activity, actIndex) => (
                      <li key={actIndex}>• {activity}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {content.joinInfo && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">{content.joinInfo.title}</h2>
            <p className="text-gray-700 mb-4">
              {content.joinInfo.description}
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-semibold">Kontakt:</p>
              <p>Email: mareseznam@seznam.cz</p>
              <p>Telefon: +420 607 244 526</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}