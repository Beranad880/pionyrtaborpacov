'use client';

import { useState, useEffect } from 'react';
import { pageContent } from '@/data/content';

export default function Hero() {
  const [heroData, setHeroData] = useState(pageContent.hero);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await fetch('/api/content?page=home');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data.hero) {
            setHeroData(result.data.hero);
          }
        }
      } catch (error) {
        console.log('Failed to fetch hero data, using static content');
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about-section');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/44780.jpg')"
          }}
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="bg-black/60 backdrop-blur-sm rounded-2xl px-8 py-12 mx-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-2xl">
            {heroData.title}
          </h1>
          <p className="text-xl md:text-2xl text-white/95 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-lg font-medium">
            {(heroData as any).subtitle || 'Demokratický, dobrovolný spolek dětí, mládeže a dospělých'}
          </p>
          <button
            onClick={scrollToAbout}
            className="bg-[#0070af] hover:bg-[#005a8c] text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg"
          >
            O nás
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce cursor-pointer"
        onClick={scrollToAbout}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}