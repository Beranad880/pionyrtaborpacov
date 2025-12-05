'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold text-red-600">
                Pionýrská skupina Pacov
              </Link>
              <nav className="hidden md:flex space-x-8">
                <Link href="/" className="text-slate-600 hover:text-red-600 transition-colors">
                  Domů
                </Link>
                <Link href="/hajenka-bela" className="text-red-600 font-medium">
                  Hájenka Bělá
                </Link>
                <Link href="/calendar" className="text-slate-600 hover:text-red-600 transition-colors">
                  Kalendář
                </Link>
                <Link href="/articles" className="text-slate-600 hover:text-red-600 transition-colors">
                  Články
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="animate-pulse space-y-6">
                <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                <div className="h-64 bg-slate-200 rounded"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-slate-200 rounded"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-red-600">
              Pionýrská skupina Pacov
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-slate-600 hover:text-red-600 transition-colors">
                Domů
              </Link>
              <Link href="/hajenka-bela" className="text-red-600 font-medium">
                Hájenka Bělá
              </Link>
              <Link href="/calendar" className="text-slate-600 hover:text-red-600 transition-colors">
                Kalendář
              </Link>
              <Link href="/articles" className="text-slate-600 hover:text-red-600 transition-colors">
                Články
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {content.title}
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              Naše táborová základna v srdci přírody
            </p>
          </div>
        </div>
      </section>

      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Main Content */}
            <div className="grid lg:grid-cols-2 gap-12 mb-12">
              <div>
                <img
                  src={content.images?.exterior || "/images/hajenka-exterior.jpg"}
                  alt="Hájenka Bělá - exteriér"
                  className="w-full h-80 object-cover rounded-xl shadow-lg"
                />
              </div>
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-slate-800">
                  O naší základně
                </h2>
                <div className="prose prose-lg text-slate-700">
                  <p className="text-lg leading-relaxed">
                    {content.description}
                  </p>
                  <p className="leading-relaxed">
                    {content.details}
                  </p>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">🏠</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">Vybavení</h3>
                </div>
                <ul className="space-y-3">
                  {content.equipment?.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">Aktivity</h3>
                </div>
                <ul className="space-y-3">
                  {content.activities?.map((activity, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-slate-700">{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Location Section */}
            <div className="bg-green-50 p-8 rounded-xl border border-green-200 mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">📍</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-800">
                  {content.location?.title || 'Poloha a dostupnost'}
                </h3>
              </div>
              <p className="text-slate-700 text-lg mb-6 leading-relaxed">
                {content.location?.description || 'Hájenka Bělá se nachází v klidné přírodní lokalitě s dobrou dostupností jak automobilem, tak veřejnou dopravou.'}
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-800 mb-2">GPS souřadnice</h4>
                  <p className="text-slate-600">{content.location?.gps || 'Budou upřesněny'}</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-800 mb-2">Nejbližší město</h4>
                  <p className="text-slate-600">{content.location?.nearestTown || 'Pacov (5 km)'}</p>
                </div>
              </div>
            </div>

            {/* Gallery Section */}
            {content.images && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-slate-800 mb-8 text-center">
                  Fotogalerie
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(content.images).map(([key, src], index) => (
                    <div key={key} className="group cursor-pointer">
                      <img
                        src={src as string || "/images/placeholder.jpg"}
                        alt={`Hájenka Bělá - ${key}`}
                        className="w-full h-48 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Section */}
            <div className="bg-red-50 p-8 rounded-xl border border-red-200">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">
                  Máte zájem o pronájem?
                </h3>
                <p className="text-slate-700 text-lg max-w-2xl mx-auto">
                  Nejjednodušší způsob, jak si zarezervovat pobyt, je vyplnit náš online formulář. Ověřte si také obsazenost v našem kalendáři.
                </p>
              </div>

              <div className="text-center">
                <Link
                  href="/pronajem"
                  className="inline-flex items-center justify-center px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors text-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  Vyplnit žádost o pronájem
                </Link>
                <div className="mt-4">
                  <Link
                    href="/calendar"
                    className="text-sm text-slate-600 hover:text-red-600 transition-colors"
                  >
                    Zobrazit kalendář obsazenosti →
                  </Link>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-10 pt-8 border-t border-red-200">
                <div className="text-center">
                  <h4 className="font-semibold text-slate-800 mb-1">Email pro dotazy</h4>
                  <p className="text-sm text-slate-600">mareseznam@seznam.cz</p>
                </div>

                <div className="text-center">
                  <h4 className="font-semibold text-slate-800 mb-1">Telefon</h4>
                  <p className="text-sm text-slate-600">+420 607 244 526</p>
                </div>

                <div className="text-center">
                  <h4 className="font-semibold text-slate-800 mb-1">Vedoucí</h4>
                  <p className="text-sm text-slate-600">Mgr. Ladislav Mareš</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}