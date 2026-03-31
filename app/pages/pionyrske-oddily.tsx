'use client';

import { useState, useEffect } from 'react';
import { allPagesContent } from '@/data/content';

export default function PionyrseOddilyPage() {
  const [content, setContent] = useState<typeof allPagesContent.pioneerGroups | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content?page=pioneerGroups');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setContent(result.data);
            return;
          }
        }
      } catch (error) {
        console.log('Failed to fetch content, using static data');
      }
      setContent(allPagesContent.pioneerGroups);
    };

    fetchContent();
  }, []);

  if (!content) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="h-9 bg-slate-200 rounded w-64 mb-6"></div>
        <div className="h-5 bg-slate-200 rounded w-full mb-2"></div>
        <div className="h-5 bg-slate-200 rounded w-4/5 mb-8"></div>
        {/* Skeleton grid - 2 sloupce */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-slate-100 p-6 rounded-lg h-64"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{content.title}</h1>

      <div className="max-w-none">
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          {content.description}
        </p>

        {/* Mřížka oddílů - striktně 2 sloupce na desktopu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {content.groups?.filter((group: any) => group.name)?.map((group: any, index: number) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-slate-100 flex flex-col">
              <h2 className="text-xl font-bold text-red-700 mb-3">{group.name}</h2>
              
              <div className="mb-4">
                <span className="inline-block bg-red-50 text-red-700 text-sm font-semibold px-3 py-1 rounded-full">
                  Věk: {group.ageRange}
                </span>
              </div>

              <p className="text-gray-700 mb-6 flex-grow">
                {group.description}
              </p>

              {group.activities && group.activities.length > 0 && (
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-500 mb-3">Co děláme:</h3>
                  <ul className="grid grid-cols-1 gap-1">
                    {group.activities.map((activity: string, actIndex: number) => (
                      <li key={actIndex} className="text-sm text-gray-600 flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Join Info - Spodní sekce rovněž rozdělena na 2 sloupce */}
        {content.joinInfo && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-start border-t pt-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{content.joinInfo.title}</h2>
              <p className="text-gray-700 leading-relaxed">
                {content.joinInfo.description}
              </p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm">
              <h3 className="text-lg font-bold text-blue-900 mb-4">Kontaktujte nás</h3>
              <div className="space-y-3 text-blue-800">
                <div className="flex items-center">
                  <span className="font-semibold w-20">Email:</span>
                  <a href="mailto:mareseznam@seznam.cz" className="hover:underline">mareseznam@seznam.cz</a>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold w-20">Telefon:</span>
                  <a href="tel:+420607244526" className="hover:underline">+420 607 244 526</a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}