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

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/articles');
        const result = await response.json();

        if (result.success && result.data.articles) {
          setArticles(result.data.articles);
        }
      } catch (err) {
        console.log('Error fetching articles:', err);
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

        {articles.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <p className="text-gray-600">Zatím zde nejsou žádné články.</p>
          </div>
        ) : (
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
        )}

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