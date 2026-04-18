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
      <div className="min-h-screen bg-white">
        <div className="relative py-20 bg-slate-50 animate-pulse">
          <div className="container mx-auto px-4 text-center">
            <div className="w-32 h-6 bg-slate-200 rounded-full mx-auto mb-6"></div>
            <div className="w-64 h-12 bg-slate-200 rounded-2xl mx-auto mb-6"></div>
            <div className="w-96 h-6 bg-slate-200 rounded-xl mx-auto"></div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-5xl mx-auto space-y-12">
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
            Zde najdete nejnovější články, reportáže a novinky z činnosti naší pionýrské skupiny.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-24">
        <div className="max-w-5xl mx-auto">
          {articles.length === 0 ? (
            <div className="bg-slate-50 p-12 rounded-[2.5rem] text-center border border-dashed border-slate-300">
              <p className="text-slate-700 font-bold text-xl">Zatím zde nejsou žádné články.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {articles.map((article) => {
                const categoryInfo = categoryLabels[article.category] || {
                  label: article.category,
                  color: 'bg-gray-100 text-gray-800'
                };

                return (
                  <article key={article._id} className="group bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden transition-all duration-500 hover:-translate-y-1">
                    <div className="p-8 md:p-12">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest ${categoryInfo.color}`}>
                              {categoryInfo.label}
                            </span>
                            <span className="text-slate-700 font-bold text-sm">
                              {new Date(article.publishedAt).toLocaleDateString('cs-CZ')}
                            </span>
                          </div>
                          <h2 className="text-3xl font-black text-slate-900 group-hover:text-[#0070af] transition-colors leading-tight tracking-tight">
                            {article.title}
                          </h2>
                        </div>
                      </div>
                      
                      <p className="text-slate-800 text-lg mb-8 leading-relaxed font-medium line-clamp-3">
                        {article.excerpt}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-6">
                        <div className="flex flex-wrap gap-2">
                          {article.tags?.map((tag, index) => (
                            <span key={index} className="text-[#0070af] font-black text-xs uppercase tracking-wider">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        
                        <Link
                          href={`/pages/clanky/${article.slug}`}
                          className="inline-flex items-center gap-2 bg-[#0070af] text-white px-8 py-4 rounded-2xl font-black text-sm transition-all hover:bg-[#005a8c] shadow-lg shadow-[#0070af]/20 group/btn"
                        >
                          ČÍST VÍCE
                          <svg className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Social CTAs */}
          <div className="mt-32 relative bg-slate-900 rounded-[3rem] p-12 md:p-20 overflow-hidden text-center">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(0,112,175,0.15)_0%,_transparent_70%)]"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">Chcete být informováni?</h2>
              <p className="text-white text-lg mb-12 font-medium max-w-2xl mx-auto">
                Sledujte naše aktivity na sociálních sítích nebo nás kontaktujte přímo.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <a
                  href="https://www.facebook.com/profile.php?id=61573658450126"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1877F2] text-white px-10 py-5 rounded-2xl font-black transition-all hover:scale-105 flex items-center gap-3 shadow-xl shadow-blue-900/20"
                >
                  FACEBOOK
                </a>
                <a
                  href="https://www.instagram.com/ldtbela"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white px-10 py-5 rounded-2xl font-black transition-all hover:scale-105 flex items-center gap-3 shadow-xl shadow-pink-900/20"
                >
                  INSTAGRAM
                </a>
                <a
                  href="mailto:mareseznam@seznam.cz"
                  className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-2xl font-black transition-all hover:bg-white/20 flex items-center gap-3"
                >
                  EMAIL
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}