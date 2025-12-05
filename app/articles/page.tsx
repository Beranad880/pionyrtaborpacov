'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  category: 'news' | 'event-report' | 'general' | 'announcement';
  tags: string[];
  publishedAt: string;
  views: number;
  likes: number;
}

const categories = {
  'news': { label: 'Novinky', color: 'bg-purple-100 text-purple-800' },
  'event-report': { label: 'Reportáž', color: 'bg-green-100 text-green-800' },
  'general': { label: 'Obecné', color: 'bg-gray-100 text-gray-800' },
  'announcement': { label: 'Oznámení', color: 'bg-blue-100 text-blue-800' }
};

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('limit', '20');
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }

      const response = await fetch(`/api/articles?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setArticles(result.data.articles);
      } else {
        console.error('Failed to fetch articles:', result.message);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(article => {
    if (selectedCategory === 'all') return true;
    return article.category === selectedCategory;
  });

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
              <Link href="/articles" className="text-red-600 font-medium">
                Články
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-slate-800 mb-4">
                Články a novinky
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Přečtěte si nejnovější články, reportáže z akcí a oznámení Pionýrské skupiny Pacov
              </p>
            </div>

            {/* Category Filter */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-red-50'
                  }`}
                >
                  Všechny
                </button>
                {Object.entries(categories).map(([key, category]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedCategory === key
                        ? 'bg-red-600 text-white'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-red-50'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Articles Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-pulse">
                    <div className="h-4 bg-slate-200 rounded w-1/4 mb-3"></div>
                    <div className="h-6 bg-slate-200 rounded mb-3"></div>
                    <div className="h-4 bg-slate-200 rounded mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
                    <div className="h-8 bg-slate-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {filteredArticles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArticles.map((article) => (
                      <article key={article._id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                        <div className="p-6">
                          {/* Article Meta */}
                          <div className="flex items-center space-x-3 mb-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${categories[article.category].color}`}>
                              {categories[article.category].label}
                            </span>
                            <time className="text-slate-500 text-sm">
                              {new Date(article.publishedAt).toLocaleDateString('cs-CZ')}
                            </time>
                          </div>

                          {/* Article Title */}
                          <h2 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2">
                            {article.title}
                          </h2>

                          {/* Article Excerpt */}
                          <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                            {article.excerpt}
                          </p>

                          {/* Article Footer */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-slate-500 space-x-4">
                              <span>Autor: {article.author}</span>
                              <span>•</span>
                              <span>{article.views} zobrazení</span>
                            </div>
                          </div>

                          {/* Tags */}
                          {article.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {article.tags.slice(0, 3).map((tag, index) => (
                                <span
                                  key={index}
                                  className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs"
                                >
                                  #{tag}
                                </span>
                              ))}
                              {article.tags.length > 3 && (
                                <span className="text-slate-500 text-xs">+{article.tags.length - 3}</span>
                              )}
                            </div>
                          )}

                          {/* Read More Button */}
                          <div className="mt-4">
                            <Link
                              href={`/articles/${article.slug}`}
                              className="inline-flex items-center text-red-600 hover:text-red-700 font-medium text-sm transition-colors"
                            >
                              Číst více
                              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📄</div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">
                      Žádné články nenalezeny
                    </h3>
                    <p className="text-slate-600">
                      {selectedCategory === 'all'
                        ? 'V této kategorii zatím nejsou žádné publikované články.'
                        : `V kategorii "${categories[selectedCategory as keyof typeof categories]?.label}" zatím nejsou žádné články.`}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}