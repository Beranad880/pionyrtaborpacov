'use client';

import { useState, useEffect } from 'react';
import { allPagesContent } from '@/data/content';

const galleryPhotos = [
  { src: '/foto/bela2003.jpg', alt: 'Hájenka Bělá 2003' },
  { src: '/foto/bela2012.jpg', alt: 'Hájenka Bělá 2012' },
  { src: '/foto/belaprezentacni.jpg', alt: 'Hájenka Bělá - prezentační foto' },
  { src: '/foto/20190210_151506.jpg', alt: 'Hájenka Bělá - zima 2019' },
  { src: '/foto/20210713_115940.jpg', alt: 'Hájenka Bělá - léto 2021' },
  { src: '/foto/IMG-20240512-WA0006.jpg', alt: 'Hájenka Bělá 2024' },
  { src: '/foto/IMG_20240907_111837_753.jpg', alt: 'Hájenka Bělá - září 2024' },
  { src: '/foto/IMG_20241027_150738_741.jpg', alt: 'Hájenka Bělá - říjen 2024' },
];

export default function HajenkabelaPage() {
  const [content, setContent] = useState(allPagesContent.hajenkaBela);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content?page=hajenkaBela');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setContent(result.data);
          }
        }
      } catch (error) {
        console.log('Failed to fetch content, using static data');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? galleryPhotos.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === galleryPhotos.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{content.title}</h1>

      <div className="prose max-w-none">
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div>
            <img
              src="/foto/bela2.jpg"
              alt="Hájenka Bělá - exteriér"
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
          </div>
          <div>
            <p className="text-lg text-gray-700 mb-4">
              {content.description}
            </p>
            <p className="text-gray-700">
              {content.details}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Vybavení</h2>
            <ul className="space-y-2 text-gray-700">
              {content.equipment?.map((item: string, index: number) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Aktivity</h2>
            <ul className="space-y-2 text-gray-700">
              {content.activities?.map((activity: string, index: number) => (
                <li key={index}>• {activity}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-3">{content.location?.title || 'Poloha a dostupnost'}</h2>
          <p className="text-gray-700 mb-3">
            {content.location?.description || 'Hájenka Bělá se nachází v klidné přírodní lokalitě s dobrou dostupností jak automobilem, tak veřejnou dopravou.'}
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>GPS souřadnice:</strong></p>
              <p className="text-gray-600">{content.location?.gps || 'Budou upřesněny'}</p>
            </div>
            <div>
              <p><strong>Nejbližší město:</strong></p>
              <p className="text-gray-600">{content.location?.nearestTown || 'Pacov (5 km)'}</p>
            </div>
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Fotogalerie</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryPhotos.map((photo, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden rounded-lg shadow-md cursor-pointer group"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0070af]/10 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Kontakt</h2>
          <p className="text-gray-700 mb-3">
            Pro více informací o Hájence Bělá nebo rezervaci nás kontaktujte:
          </p>
          <div className="space-y-1">
            <p><strong>Email:</strong> mareseznam@seznam.cz</p>
            <p><strong>Telefon:</strong> +420 607 244 526</p>
            <p><strong>Vedoucí:</strong> Mgr. Ladislav Mareš</p>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors"
            onClick={closeLightbox}
          >
            &times;
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-gray-300 transition-colors p-4"
            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
          >
            &#8249;
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-gray-300 transition-colors p-4"
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
          >
            &#8250;
          </button>
          <img
            src={galleryPhotos[currentImageIndex].src}
            alt={galleryPhotos[currentImageIndex].alt}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {currentImageIndex + 1} / {galleryPhotos.length}
          </div>
        </div>
      )}
    </main>
  );
}