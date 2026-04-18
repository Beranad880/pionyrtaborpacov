'use client';

import { useState, useEffect } from 'react';
import { pageContent } from '@/data/content';

export default function Hero() {
  const [heroData, setHeroData] = useState(pageContent.hero);

  useEffect(() => {
    fetch('/api/content?page=home')
      .then(res => res.json())
      .then(result => {
        if (result.success && result.data?.hero) {
          setHeroData(result.data.hero);
        }
      })
      .catch(() => {});
  }, []);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about-section');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Advanced Overlay - STATIC */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/44780.jpg')"
          }}
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/20 px-8 py-16 md:px-16 md:py-24 shadow-2xl animate-fade-in-up">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-[#0070af]/20 border border-[#0070af]/30 text-white text-sm font-bold tracking-widest uppercase animate-fade-in">
            Vítejte u nás
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9] drop-shadow-2xl">
            {heroData.title.split(' ').map((word, i) => (
              <span key={i} className="inline-block mr-4 last:mr-0 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                {word}
              </span>
            ))}
          </h1>
          <p className="text-xl md:text-3xl text-white mb-12 max-w-3xl mx-auto leading-tight font-bold drop-shadow-lg animate-fade-in-delayed">
            {(heroData as any).subtitle || 'Demokratický, dobrovolný spolek dětí, mládeže a dospělých'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-delayed-more">
            <button
              onClick={scrollToAbout}
              className="w-full sm:w-auto bg-[#0070af] hover:bg-[#005a8c] text-white px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-[#0070af]/20 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group"
            >
              Zjistit více o nás
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </button>
            <button
              onClick={() => window.location.href = '/pages?page=kalendar-akci'}
              className="w-full sm:w-auto bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/40 px-10 py-5 rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95"
            >
              Kalendář akcí
            </button>
          </div>
        </div>
      </div>

    </section>
  );
}
