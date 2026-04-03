'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Article {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: { name: string };
  category: string;
  tags: string[];
  publishedAt: string;
  views: number;
  likes: number;
  featuredImage?: string;
}

const categoryLabels: { [key: string]: { label: string; color: string } } = {
  'news': { label: 'Novinky', color: 'bg-purple-100 text-purple-800' },
  'event-report': { label: 'Reportáž', color: 'bg-green-100 text-green-800' },
  'general': { label: 'Obecné', color: 'bg-gray-100 text-gray-800' },
  'announcement': { label: 'Oznámení', color: 'bg-blue-100 text-blue-800' },
};

export default function ArticleDetailPage() {
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/articles/${params.slug}`);
        const result = await response.json();

        if (result.success) {
          setArticle(result.data);
        } else {
          setError('Article not found');
        }
      } catch (err) {
        try {
          setError('Article not found');
        } catch {
          setError('Failed to load article');
        }
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchArticle();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {error === 'Article not found' ? 'Článek nenalezen' : 'Chyba při načítání'}
          </h1>
          <p className="text-gray-600 mb-8">
            {error === 'Article not found'
              ? 'Požadovaný článek neexistuje nebo byl smazán.'
              : 'Při načítání článku došlo k chybě.'}
          </p>
          <Link
            href="/pages/clanky"
            className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 transition-colors"
          >
            Zpět na články
          </Link>
        </div>
      </div>
    );
  }

  const categoryInfo = categoryLabels[article.category] || { label: article.category, color: 'bg-gray-100 text-gray-800' };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/pages/clanky" className="hover:text-red-600">
              Články
            </Link>
            <span>›</span>
            <span className="text-gray-900">{article.title}</span>
          </div>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {article.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>
                  Publikováno {new Date(article.publishedAt).toLocaleDateString('cs-CZ', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                {article.author && (
                  <span>• Autor: {article.author.name}</span>
                )}
                <span>• {article.views} zobrazení</span>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${categoryInfo.color} flex-shrink-0 ml-4`}>
              {categoryInfo.label}
            </span>
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Featured Image */}
          {article.featuredImage && (
            <div className="mb-8">
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-64 object-cover rounded-lg shadow-sm"
              />
            </div>
          )}
        </header>

        {/* Article Content */}
        <article className="prose max-w-none">
          <div
            className="text-lg leading-relaxed text-gray-800"
            dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br>') }}
          />
        </article>

        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span>{article.likes} líbí se</span>
              </button>
            </div>

            <Link
              href="/pages/clanky"
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Zpět na články
            </Link>
          </div>
        </footer>

        {/* Contact Information */}
        <div className="mt-12 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Chcete být informováni?</h3>
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
    </div>
  );
}