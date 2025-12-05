'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: 'news' | 'event-report' | 'general' | 'announcement';
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

const categories = {
  'news': { label: 'Novinky', color: 'bg-purple-100 text-purple-800' },
  'event-report': { label: 'Reportáž', color: 'bg-green-100 text-green-800' },
  'general': { label: 'Obecné', color: 'bg-gray-100 text-gray-800' },
  'announcement': { label: 'Oznámení', color: 'bg-blue-100 text-blue-800' }
};

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.slug) {
      fetchArticle(params.slug as string);
    }
  }, [params.slug]);

  const fetchArticle = async (slug: string) => {
    try {
      const response = await fetch(`/api/articles/${slug}`);
      const result = await response.json();

      if (result.success) {
        setArticle(result.data);
      } else {
        setError(result.message || 'Článek nebyl nalezen');
      }
    } catch (error) {
      setError('Chyba při načítání článku');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/4"></div>
              <div className="h-32 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <div className="text-6xl mb-4">📄</div>
              <h1 className="text-2xl font-bold text-slate-800 mb-2">
                {error === 'Článek nebyl nalezen' ? 'Článek nebyl nalezen' : 'Chyba při načítání'}
              </h1>
              <p className="text-slate-600 mb-6">
                {error || 'Omlouváme se, ale článek se nepodařilo načíst.'}
              </p>
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Zpět na hlavní stránku
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const categoryInfo = categories[article.category];
  const publishDate = article.publishedAt ? new Date(article.publishedAt) : new Date(article.createdAt);

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
              <Link href="/articles" className="text-slate-600 hover:text-red-600 transition-colors">
                Články
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-6">
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Link href="/" className="hover:text-red-600 transition-colors">
                  Domů
                </Link>
                <span>›</span>
                <Link href="/articles" className="hover:text-red-600 transition-colors">
                  Články
                </Link>
                <span>›</span>
                <span className="text-slate-800">{article.title}</span>
              </div>
            </nav>

            {/* Article */}
            <article className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Article Header */}
              <div className="p-8 border-b border-slate-200">
                <div className="flex items-center space-x-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryInfo.color}`}>
                    {categoryInfo.label}
                  </span>
                  <span className="text-slate-500">•</span>
                  <time className="text-slate-500 text-sm">
                    {publishDate.toLocaleDateString('cs-CZ', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                  {article.title}
                </h1>

                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                  {article.excerpt}
                </p>

                <div className="flex items-center justify-between text-sm text-slate-500">
                  <div className="flex items-center space-x-4">
                    <span>Autor: {article.author}</span>
                    <span>•</span>
                    <span>{article.views} zobrazení</span>
                  </div>

                  {article.tags.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span>Tagy:</span>
                      {article.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Article Content */}
              <div className="p-8">
                <div
                  className="prose prose-slate max-w-none prose-headings:text-slate-800 prose-p:text-slate-700 prose-strong:text-slate-800"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              </div>

              {/* Article Footer */}
              <div className="px-8 py-6 bg-slate-50 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600">
                    Poslední úprava: {new Date(article.updatedAt).toLocaleDateString('cs-CZ')}
                  </div>

                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-2 text-slate-600 hover:text-red-600 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>{article.likes}</span>
                    </button>

                    <button className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      <span>Sdílet</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>

            {/* Back Button */}
            <div className="mt-8 text-center">
              <Link
                href="/articles"
                className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Zpět na články
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}