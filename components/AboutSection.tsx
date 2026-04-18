'use client';

import { useState, useEffect } from 'react';
import { pageContent } from '@/data/content';

export default function AboutSection() {
  const [content, setContent] = useState<typeof pageContent | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content?page=home');
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
      setContent(pageContent);
    };

    fetchContent();
  }, []);

  if (!content) {
    return (
      <section id="about-section" className="py-16 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto animate-pulse">
            <div className="text-center mb-12">
              <div className="h-10 bg-slate-200 rounded-lg max-w-sm mx-auto mb-6"></div>
              <div className="h-6 bg-slate-200 rounded-lg max-w-2xl mx-auto mb-2"></div>
              <div className="h-6 bg-slate-200 rounded-lg max-w-xl mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-4/5"></div>
              </div>
              <div className="flex justify-center">
                <div className="w-80 h-80 bg-slate-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about-section" className="relative py-24 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Main Header Card */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0070af]/10 text-[#0070af] font-bold text-sm tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#0070af] animate-pulse"></span>
              KDO JSME
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none">
              {content.about?.title || pageContent.about.title}
            </h2>
            <div className="relative max-w-4xl mx-auto group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#0070af] to-[#005a8c] rounded-[2rem] rotate-1 opacity-10 group-hover:rotate-0 transition-transform duration-500"></div>
              <blockquote className="relative text-2xl md:text-3xl text-slate-700 font-medium leading-snug px-8 py-12 md:px-16">
                <span className="absolute top-4 left-4 text-8xl text-[#0070af]/20 font-serif leading-none">“</span>
                {content.about?.subtitle || pageContent.about.subtitle}
                <span className="absolute bottom-0 right-4 text-8xl text-[#0070af]/20 font-serif leading-none rotate-180">“</span>
              </blockquote>
            </div>
          </div>
        </div>

        {/* Content Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-7xl mx-auto">
          {/* Main Text Card */}
          <div className="lg:col-span-7 bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-12 shadow-xl transition-all duration-500 group">
            <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
              Naše činnost
              <div className="h-1 w-12 bg-[#0070af] rounded-full group-hover:w-24 transition-all duration-500"></div>
            </h3>
            <div className="space-y-6">
              {(content.about?.content || pageContent.about.content).map((paragraph, index) => (
                <p key={index} className="text-slate-600 leading-relaxed text-lg font-medium">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Visual Card */}
          <div className="lg:col-span-5 relative group h-full min-h-[400px]">
            <div className="absolute inset-0 bg-[#0070af] rounded-[2.5rem] rotate-2 transition-transform group-hover:rotate-1"></div>
            <div
              className="absolute inset-0 bg-cover bg-center rounded-[2.5rem] shadow-2xl transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2 overflow-hidden"
              style={{
                backgroundImage: "url('/foto/bela2.jpg')"
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-10">
                <div className="w-16 h-16 bg-white rounded-2xl mb-4 flex items-center justify-center shadow-xl transform group-hover:rotate-12 transition-transform">
                  <span className="text-[#0070af] text-3xl font-black">P</span>
                </div>
                <div className="font-black text-3xl text-white tracking-tight">Pionýr Pacov</div>
                <div className="text-white/80 font-bold uppercase tracking-widest text-xs mt-2">Tradice od roku 1990</div>
              </div>
            </div>
          </div>

          {/* Pioneer Org Card - LIGHT VERSION */}
          <div className="lg:col-span-8 bg-white border border-[#0070af]/10 rounded-[2.5rem] p-8 md:p-12 text-slate-900 relative overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-500">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0070af]/5 rounded-full blur-[80px] pointer-events-none transition-transform group-hover:scale-150"></div>
            <div className="relative z-10">
              <h3 className="text-3xl font-black mb-8 tracking-tight text-slate-900">Kdo je Pionýr?</h3>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed font-medium">
                {content.pioneer?.description || pageContent.pioneer.description}
              </p>
              <div className="inline-block p-6 bg-[#0070af]/5 border border-[#0070af]/10 rounded-2xl">
                <div className="text-[#0070af] text-xs font-black uppercase tracking-[0.2em] mb-2">Příslušnost</div>
                <p className="text-slate-900 font-bold text-lg">
                  Krajská organizace Pionýra Vysočina (KOP Vysočina)
                </p>
                <a
                  href="https://vysocina.pionyr.cz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-[#0070af] hover:text-[#005a8c] transition-colors font-black"
                >
                  Navštívit web KOP
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Stats Card - LIGHTER */}
          <div className="lg:col-span-4 bg-[#0070af]/5 border border-[#0070af]/10 rounded-[2.5rem] p-10 flex flex-col justify-center items-center text-center relative overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-500">
             <div className="relative z-10">
                <div className="text-7xl font-black mb-4 tracking-tighter text-[#0070af] transition-transform group-hover:scale-110">600+</div>
                <div className="text-sm font-black uppercase tracking-widest text-slate-500 leading-tight">
                  míst po celé<br/>republice
                </div>
                <div className="mt-8 pt-8 border-t border-[#0070af]/20">
                  <div className="text-xl font-bold italic text-slate-700">"Jedna velká rodina"</div>
                </div>
             </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="max-w-7xl mx-auto mt-24">
          <div className="bg-slate-50 border border-slate-200 rounded-[3rem] p-12 md:p-16 relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 p-8 opacity-5">
               <svg className="w-64 h-64 text-slate-900" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
             </div>
             <div className="relative z-10">
                <h3 className="text-4xl font-black text-slate-900 mb-12 tracking-tight">
                   {content.history?.title || pageContent.history.title}
                </h3>
                <p className="text-slate-600 text-xl font-medium leading-relaxed mb-12">
                   {content.history?.content || pageContent.history.content}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { year: '2014', text: 'Oficiální vznik skupiny', active: true },
                    { year: '1990', text: 'Obnovená činnost', active: false },
                    { year: '1961', text: 'Původní založení', active: false }
                  ].map((item, i) => (
                    <div key={i} className={`p-8 rounded-[2rem] transition-all duration-500 hover:-translate-y-2 ${item.active ? 'bg-[#0070af]/10 border-2 border-[#0070af] shadow-xl shadow-[#0070af]/10' : 'bg-white text-slate-900 border border-slate-200 shadow-sm'}`}>
                      <div className={`text-3xl font-black mb-3 ${item.active ? 'text-[#0070af]' : 'text-slate-400'}`}>{item.year}</div>
                      <div className={`font-bold ${item.active ? 'text-slate-900' : 'text-slate-500 opacity-80'}`}>{item.text}</div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}