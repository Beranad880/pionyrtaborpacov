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
    <section id="about-section" className="py-16 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4">
        {/* About Section */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
              {content.about?.title || pageContent.about.title}
            </h2>
            <blockquote className="text-xl md:text-2xl text-slate-600 italic leading-relaxed max-w-4xl mx-auto border-l-4 border-[#0070af] pl-6 bg-[#0070af]/10 p-6 rounded-r-lg shadow-sm">
              {content.about?.subtitle || pageContent.about.subtitle}
            </blockquote>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {(content.about?.content || pageContent.about.content).map((paragraph, index) => (
                <p key={index} className="text-slate-700 leading-relaxed text-justify">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="flex justify-center">
              <div className="relative w-80 h-80 rounded-xl overflow-hidden shadow-lg">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1529390079861-591de354faf5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')"
                  }}
                />
                <div className="absolute inset-0 bg-[#0070af] bg-opacity-80 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-[#0070af] text-2xl font-bold">P</span>
                    </div>
                    <div className="font-bold text-xl">Pionýr</div>
                    <div className="text-sm opacity-90">od roku 1990</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pioneer Organization Section */}
        <div className="max-w-6xl mx-auto mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6">
                Pionýr
              </h3>
              <p className="text-slate-700 leading-relaxed mb-6">
                {content.pioneer?.description || pageContent.pioneer.description}
              </p>

              <div className="mb-8 p-4 bg-[#0070af]/10 rounded-lg border border-[#0070af]/20">
                <p className="text-slate-700">
                  Jsme součástí{' '}
                  <a
                    href="https://vysocina.pionyr.cz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0070af] font-semibold hover:text-[#005a8c] hover:underline transition-colors"
                  >
                    Krajské organizace Pionýra Vysočina (KOP Vysočina)
                  </a>
                </p>
              </div>

              <h4 className="text-xl md:text-2xl font-bold text-slate-800 mb-4">
                {content.pioneer?.ideals?.title || pageContent.pioneer.ideals.title}
              </h4>
              <p className="text-slate-700 leading-relaxed mb-6">
                {content.pioneer?.ideals?.description || pageContent.pioneer.ideals.description}
              </p>

              <div className="space-y-4">
                {(content.pioneer?.ideals?.content || pageContent.pioneer.ideals.content).map((paragraph, index) => (
                  <p key={index} className="text-slate-700 leading-relaxed text-justify">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="w-64 h-64 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0070af] to-[#005a8c] rounded-lg transform rotate-6 opacity-20"></div>
                <div
                  className="absolute inset-0 rounded-lg bg-cover bg-center"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')"
                  }}
                />
                <div className="absolute inset-0 bg-[#0070af] bg-opacity-85 rounded-lg flex items-center justify-center text-white">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">600+</div>
                    <div className="text-sm">míst po celé republice</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="max-w-6xl mx-auto mt-20">
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6">
              {content.history?.title || pageContent.history.title}
            </h3>
            <p className="text-slate-700 leading-relaxed text-justify">
              {content.history?.content || pageContent.history.content}
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-[#0070af] mb-2">2014</div>
                <div className="text-sm text-gray-600">Oficiální vznik skupiny</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-[#0070af] mb-2">1990</div>
                <div className="text-sm text-gray-600">Obnovená činnost</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-[#0070af] mb-2">1961</div>
                <div className="text-sm text-gray-600">Původní založení</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}