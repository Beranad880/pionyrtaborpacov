'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  featuredImage?: string;
}

const categoryLabels: { [key: string]: { label: string; color: string } } = {
  'news': { label: 'Novinky', color: 'bg-purple-100 text-purple-800' },
  'event-report': { label: 'Reportáž', color: 'bg-green-100 text-green-800' },
  'general': { label: 'Obecné', color: 'bg-slate-100 text-slate-700' },
  'announcement': { label: 'Oznámení', color: 'bg-blue-100 text-blue-800' },
};

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.slug) return;
    fetch(`/api/articles/${params.slug}`)
      .then(r => r.json())
      .then(result => {
        if (result.success) {
          setArticle(result.data);
        } else {
          setError('not-found');
        }
      })
      .catch(() => setError('error'))
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="relative py-20 bg-slate-50 animate-pulse">
          <div className="container mx-auto px-4">
            <div className="w-24 h-5 bg-slate-200 rounded-full mb-8"></div>
            <div className="w-3/4 h-14 bg-slate-200 rounded-2xl mb-6"></div>
            <div className="w-1/3 h-5 bg-slate-200 rounded-xl"></div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-5 bg-slate-100 rounded-xl animate-pulse" style={{ width: `${90 - i * 5}%` }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
            {error === 'not-found' ? 'Článek nenalezen' : 'Chyba při načítání'}
          </h1>
          <p className="text-slate-600 font-medium mb-10">
            {error === 'not-found'
              ? 'Požadovaný článek neexistuje nebo byl smazán.'
              : 'Při načítání článku došlo k chybě. Zkuste to prosím znovu.'}
          </p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 bg-[#0070af] text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-[#005a8c] transition-all shadow-lg shadow-[#0070af]/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Zpět
          </button>
        </div>
      </div>
    );
  }

  const categoryInfo = categoryLabels[article.category] || { label: article.category, color: 'bg-slate-100 text-slate-700' };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="relative py-20 bg-slate-50 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_30%_20%,_rgba(0,112,175,0.05)_0%,_transparent_50%)] pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-[#0070af] font-black text-sm uppercase tracking-widest transition-colors mb-10 group"
          >
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Zpět na články
          </button>

          <div className="flex items-center gap-3 mb-6">
            <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest ${categoryInfo.color}`}>
              {categoryInfo.label}
            </span>
            <span className="text-slate-500 font-bold text-sm">
              {new Date(article.publishedAt).toLocaleDateString('cs-CZ', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </span>
            {article.author?.name && (
              <>
                <span className="text-slate-300">·</span>
                <span className="text-slate-500 font-bold text-sm">{article.author.name}</span>
              </>
            )}
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl">
            {article.title}
          </h1>

          {article.tags?.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-6">
              {article.tags.map((tag, i) => (
                <span key={i} className="text-[#0070af]/70 font-black text-xs uppercase tracking-wider">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          {/* Featured image */}
          {article.featuredImage && (
            <div className="mb-12 overflow-hidden rounded-[2.5rem] shadow-2xl shadow-slate-200/60">
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-72 md:h-96 object-cover"
              />
            </div>
          )}

          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-xl text-slate-600 leading-relaxed font-medium mb-10 pb-10 border-b border-slate-100">
              {article.excerpt}
            </p>
          )}

          {/* Content */}
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br>') }}
          />

          {/* Footer */}
          <div className="mt-16 pt-10 border-t border-slate-100 flex items-center justify-between gap-4">
            <div className="text-slate-500 font-bold text-sm">
              {article.views} zobrazení
            </div>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-slate-700 transition-all shadow-lg group"
            >
              <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              Zpět na články
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
