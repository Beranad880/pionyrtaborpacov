'use client';

import { useState, useEffect } from 'react';
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
}

const categoryLabels: { [key: string]: { label: string; color: string } } = {
  'news': { label: 'Novinky', color: 'bg-purple-100 text-purple-800' },
  'event-report': { label: 'Reportáž', color: 'bg-green-100 text-green-800' },
  'general': { label: 'Obecné', color: 'bg-slate-100 text-slate-700' },
  'announcement': { label: 'Oznámení', color: 'bg-blue-100 text-blue-800' },
};

export default function ClankyPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/articles')
      .then(r => r.json())
      .then(result => {
        if (result.success && result.data.articles) {
          setArticles(result.data.articles);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="relative py-20 bg-slate-50 animate-pulse">
          <div className="container mx-auto px-4 text-center">
            <div className="w-32 h-6 bg-slate-200 rounded-full mx-auto mb-6"></div>
            <div className="w-64 h-12 bg-slate-200 rounded-2xl mx-auto mb-6"></div>
            <div className="w-96 h-6 bg-slate-200 rounded-xl mx-auto"></div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-5xl mx-auto space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-50 rounded-[2.5rem] h-64 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="relative py-20 bg-slate-50 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_30%_20%,_rgba(0,112,175,0.05)_0%,_transparent_50%)] pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-[#0070af]/10 text-[#0070af] font-black text-[10px] tracking-[0.3em] uppercase">
            Aktuality & Činnost
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">Články</h1>
          <p className="text-xl text-slate-800 max-w-3xl mx-auto leading-relaxed font-medium">
            Nejnovější články, reportáže a novinky z činnosti naší pionýrské skupiny.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-24">
        <div className="max-w-5xl mx-auto">
          {articles.length === 0 ? (
            <div className="bg-slate-50 p-16 rounded-[2.5rem] text-center border border-dashed border-slate-300">
              <div className="w-16 h-16 bg-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-slate-700 font-bold text-xl">Zatím zde nejsou žádné články.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {articles.map((article) => {
                const categoryInfo = categoryLabels[article.category] || {
                  label: article.category,
                  color: 'bg-slate-100 text-slate-700'
                };

                return (
                  <article
                    key={article._id}
                    className="group bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-slate-300/60"
                  >
                    <div className="p-8 md:p-12">
                      <div className="flex items-center gap-3 mb-5">
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

                      <h2 className="text-2xl md:text-3xl font-black text-slate-900 group-hover:text-[#0070af] transition-colors leading-tight tracking-tight mb-4">
                        {article.title}
                      </h2>

                      <p className="text-slate-600 text-lg mb-8 leading-relaxed font-medium line-clamp-3">
                        {article.excerpt}
                      </p>

                      <div className="flex items-center justify-between gap-4">
                        {article.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {article.tags.map((tag, i) => (
                              <span key={i} className="text-[#0070af]/70 font-black text-xs uppercase tracking-wider">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <Link
                          href={`/pages/clanky/${article.slug}`}
                          className="ml-auto inline-flex items-center gap-2 bg-[#0070af] text-white px-8 py-4 rounded-2xl font-black text-sm transition-all hover:bg-[#005a8c] shadow-lg shadow-[#0070af]/20 group/btn flex-shrink-0"
                        >
                          ČÍST VÍCE
                          <svg className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
