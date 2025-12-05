'use client';

import { useState, useEffect } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: { name: string };
  category: string;
  tags: string[];
  publishedAt: string;
  views: number;
  likes: number;
}

interface ArticlesResponse {
  articles: Article[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const categoryLabels: { [key: string]: { label: string; color: string } } = {
  'news': { label: 'Novinky', color: 'bg-purple-100 text-purple-800' },
  'event-report': { label: 'Reportáž', color: 'bg-green-100 text-green-800' },
  'general': { label: 'Obecné', color: 'bg-gray-100 text-gray-800' },
  'announcement': { label: 'Oznámení', color: 'bg-blue-100 text-blue-800' },
};

export default function ClankyPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Static fallback articles
  const fallbackArticles: Article[] = [
    {
      _id: '1',
      title: 'Přípravy na zimní tábor 2024',
      slug: 'pripravy-na-zimni-tabor-2024',
      excerpt: 'Blíží se termín našeho tradičního zimního tábora. Letos se koná od 27. prosince 2024 do 2. ledna 2025 na Hájence Bělá. Program je plný her, sportovních aktivit a táborového dobrodružství.',
      author: { name: 'Vedení skupiny' },
      category: 'announcement',
      tags: ['tábor', 'zima', '2024'],
      publishedAt: '2024-11-15',
      views: 124,
      likes: 8
    },
    {
      _id: '2',
      title: 'Úspěšný letní tábor 2024',
      slug: 'uspesny-letni-tabor-2024',
      excerpt: 'Letní tábor 2024 na Hájence Bělá se vydařil na výbornou. Účastnilo se ho 28 dětí a měli jsme krásné počasí po celou dobu. Děti si užily spoustu her, výletů a táborových aktivit.',
      author: { name: 'Vedení skupiny' },
      category: 'event-report',
      tags: ['tábor', 'léto', '2024', 'reportáž'],
      publishedAt: '2024-08-15',
      views: 256,
      likes: 15
    },
    {
      _id: '3',
      title: 'Rekonstrukce hájenky dokončena',
      slug: 'rekonstrukce-hajenky-dokoncena',
      excerpt: 'Dokončili jsme rozsáhlou rekonstrukci naší hájenky. Nové sociální zařízení, opravené střechy a celkově modernizované zázemí nám poskytne ještě lepší podmínky pro naše aktivity.',
      author: { name: 'Vedení skupiny' },
      category: 'news',
      tags: ['hájenka', 'rekonstrukce', 'novinky'],
      publishedAt: '2024-05-01',
      views: 189,
      likes: 12
    },
    {
      _id: '4',
      title: 'Oslava 10. výročí skupiny',
      slug: 'oslava-10-vyroci-skupiny',
      excerpt: 'Letos slavíme 10 let od založení Pionýrské skupiny Pacov. Během této doby jsme uspořádali desítky táborů, výletů a akcí pro stovky dětí z Pacova a okolí. Děkujeme všem vedoucím a rodičům za podporu!',
      author: { name: 'Vedení skupiny' },
      category: 'announcement',
      tags: ['výročí', '10 let', 'oslava'],
      publishedAt: '2024-01-01',
      views: 342,
      likes: 24
    }
  ];

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/articles');
        const result = await response.json();

        if (result.success && result.data.articles.length > 0) {
          setArticles(result.data.articles);
        } else {
          // Use fallback articles if no articles in database
          setArticles(fallbackArticles);
        }
      } catch (err) {
        console.log('Using fallback articles due to API error');
        setArticles(fallbackArticles);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Články</h1>
        <div className="prose max-w-none">
          <p className="text-lg text-gray-700 mb-8">
            Zde najdete nejnovější články, reportáže a novinky z činnosti naší pionýrské skupiny.
          </p>
          <div className="space-y-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border rounded-lg shadow-sm overflow-hidden animate-pulse">
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Články</h1>

      <div className="prose max-w-none">
        <p className="text-lg text-gray-700 mb-8">
          Zde najdete nejnovější články, reportáže a novinky z činnosti naší pionýrské skupiny.
        </p>

        <div className="space-y-8">
          {articles.map((article) => {
            const categoryInfo = categoryLabels[article.category] || {
              label: article.category,
              color: 'bg-gray-100 text-gray-800'
            };

            return (
              <article key={article._id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {article.title}
                      </h2>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>
                          Publikováno {new Date(article.publishedAt).toLocaleDateString('cs-CZ', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        {article.author && <span>• {article.author.name}</span>}
                        <span>• {article.views} zobrazení</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${categoryInfo.color} flex-shrink-0 ml-4`}>
                      {categoryInfo.label}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4">
                    {article.excerpt}
                  </p>
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <Link
                    href={`/pages/clanky/${article.slug}`}
                    className="text-red-600 hover:text-red-800 font-medium transition-colors"
                  >
                    Číst více →
                  </Link>
                </div>
              </article>
            );
          })}
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