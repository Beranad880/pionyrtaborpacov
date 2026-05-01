'use client';

import { useState, useEffect } from 'react';

interface Photo {
  _id?: string;
  filename: string;
  url: string;
  caption?: string;
}

interface PhotoGallery {
  _id: string;
  title: string;
  description: string;
  event: string;
  date: string;
  photos: Photo[];
  photosCount: number;
  coverPhoto?: string;
  isPublic: boolean;
}

export default function FotkyZAkciPage() {
  const [galleries, setGalleries] = useState<PhotoGallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGallery, setSelectedGallery] = useState<PhotoGallery | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [loadingFullGallery, setLoadingFullGallery] = useState(false);

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      const response = await fetch('/api/photo-galleries');
      const result = await response.json();

      if (result.success) {
        setGalleries(result.data.galleries);
      }
    } catch (error) {
      console.error('Error fetching galleries:', error);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (gallery: PhotoGallery, index: number) => {
    setSelectedGallery(gallery);
    setLightboxPhoto(gallery.photos[index]);
    setLightboxIndex(index);
  };

  const openFullGallery = async (gallery: PhotoGallery) => {
    setSelectedGallery(gallery);
    setLightboxPhoto(gallery.photos[0]);
    setLightboxIndex(0);

    if (gallery.photosCount > gallery.photos.length) {
      setLoadingFullGallery(true);
      try {
        const response = await fetch(`/api/photo-galleries/${gallery._id}`);
        const result = await response.json();
        if (result.success) {
          setSelectedGallery(result.data);
          setLightboxPhoto(result.data.photos[0]);
        }
      } catch {
        // zůstane s náhledovými fotkami
      } finally {
        setLoadingFullGallery(false);
      }
    }
  };

  const closeLightbox = () => {
    setLightboxPhoto(null);
    setSelectedGallery(null);
  };

  const navigateLightbox = (direction: number) => {
    if (!selectedGallery) return;
    const newIndex = lightboxIndex + direction;
    if (newIndex >= 0 && newIndex < selectedGallery.photos.length) {
      setLightboxIndex(newIndex);
      setLightboxPhoto(selectedGallery.photos[newIndex]);
    }
  };

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
        <div className="container mx-auto px-4 py-24 text-center">
           <div className="flex justify-center mb-12">
             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#0070af]"></div>
           </div>
           <p className="text-slate-700 font-black uppercase tracking-widest animate-pulse">Načítáme vzpomínky...</p>
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
            Vizuální vzpomínky
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">Fotky z akcí</h1>
          <p className="text-xl text-slate-800 max-w-3xl mx-auto leading-relaxed font-medium">
            Podívejte se na fotky z našich táborů, výletů a dalších akcí. Prožijte naše dobrodružství s námi.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-24">
        <div className="max-w-7xl mx-auto">
          {galleries.length === 0 ? (
            <div className="bg-slate-50 p-12 rounded-[2.5rem] text-center border border-dashed border-slate-300">
              <p className="text-slate-700 font-bold text-xl">Zatím zde nejsou žádné fotogalerie.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-16">
              {galleries.map((gallery) => (
                <div key={gallery._id} className="group bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden transition-all duration-500 hover:shadow-3xl">
                  <div className="p-8 md:p-12 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="bg-[#0070af] text-white text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest">
                          {new Date(gallery.date).toLocaleDateString('cs-CZ')}
                        </span>
                        <span className="text-[#0070af] font-black text-xs uppercase tracking-widest">
                          {gallery.event}
                        </span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{gallery.title}</h2>
                      {gallery.description && (
                        <p className="text-slate-800 mt-4 text-lg font-medium max-w-2xl">{gallery.description}</p>
                      )}
                    </div>
                  </div>

                  {gallery.photos.length > 0 ? (
                    <div className="p-8 md:p-12">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {gallery.photos.slice(0, 8).map((photo, index) => (
                          <div
                            key={index}
                            className="aspect-square bg-slate-100 rounded-[2rem] overflow-hidden cursor-pointer group/photo relative"
                            onClick={() => openLightbox(gallery, index)}
                          >
                            <img
                              src={photo.url}
                              alt={photo.caption || photo.filename}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover/photo:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center">
                               <div className="bg-white/20 backdrop-blur-md p-4 rounded-full">
                                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
                               </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {(gallery.photosCount ?? gallery.photos.length) > 8 && (
                        <div className="mt-12 text-center">
                          <button
                            onClick={() => openFullGallery(gallery)}
                            className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-[#0070af] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/10 hover:shadow-[#0070af]/20"
                          >
                            <span>Zobrazit celou galerii ({gallery.photosCount ?? gallery.photos.length})</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-20 text-center text-slate-500 font-bold italic">
                      Galerie zatím neobsahuje žádné fotky
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Social CTA Section */}
          <div className="mt-40 relative bg-[#0070af] rounded-[3rem] p-12 md:p-24 overflow-hidden text-center text-white">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.2)_0%,_transparent_50%)] pointer-events-none"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black mb-8 tracking-tight">Sledujte naše nejnovější momentky</h2>
              <p className="text-white/80 text-xl font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
                Nezapomeňte nás sledovat na Instagramu, kde sdílíme fotky a videa z aktuálně probíhajících akcí!
              </p>
              <a
                href="https://www.instagram.com/ldtbela"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-4 bg-white text-[#0070af] px-12 py-6 rounded-3xl font-black text-lg transition-all hover:scale-110 shadow-2xl shadow-black/20"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.074 4.876 4.876.058 1.266.069 1.646.069 4.85s-.011 3.585-.069 4.85c-.105 3.802-1.624 4.728-4.876 4.876-1.266.058-1.646.07-4.85.07s-3.585-.011-4.85-.07c-3.252-.148-4.771-1.074-4.876-4.876-.058-1.266-.069-1.646-.069-4.85s.011-3.585.069-4.85c.105-3.802 1.624-4.728 4.876-4.876 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.058-1.281.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.28-.058-1.689-.072-4.948-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                INSTAGRAM PS PACOV
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal - MODERNIZED */}
      {lightboxPhoto && selectedGallery && (
        <div
          className="fixed inset-0 bg-slate-900/98 z-[100] flex flex-col animate-fade-in"
          onClick={closeLightbox}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between p-6 md:p-10 relative z-[110]">
             <div className="text-white">
                <div className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">{selectedGallery.title}</div>
                <div className="text-lg font-bold">{lightboxPhoto.caption || photoCaption(lightboxPhoto.filename)}</div>
             </div>
             <button
                onClick={closeLightbox}
                className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/10 text-white hover:bg-red-500 transition-all active:scale-95"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
          </div>

          <div className="flex-grow relative flex items-center justify-center p-4">
            {/* Previous button */}
            {lightboxIndex > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}
                className="absolute left-6 md:left-10 w-16 h-16 flex items-center justify-center rounded-2xl bg-white/5 text-white hover:bg-white/20 transition-all z-10 active:scale-90"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Image */}
            <div className="relative group/img max-h-full max-w-full shadow-2xl shadow-black/50 rounded-2xl overflow-hidden">
                <img
                  src={lightboxPhoto.url}
                  alt={lightboxPhoto.caption || lightboxPhoto.filename}
                  className="max-h-[80vh] max-w-full object-contain animate-fade-in"
                  onClick={(e) => e.stopPropagation()}
                />
            </div>

            {/* Next button */}
            {lightboxIndex < selectedGallery.photos.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}
                className="absolute right-6 md:right-10 w-16 h-16 flex items-center justify-center rounded-2xl bg-white/5 text-white hover:bg-white/20 transition-all z-10 active:scale-90"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {/* Bottom Bar */}
          <div className="p-8 text-center">
            {loadingFullGallery ? (
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full text-white text-sm font-black tracking-widest uppercase">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                <span>Načítám celou galerii...</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full text-white text-sm font-black tracking-widest uppercase">
                {lightboxIndex + 1} <span className="opacity-40">/</span> {selectedGallery.photos.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper to clean up filenames as captions if needed
function photoCaption(filename: string) {
    return filename.split('.')[0].replace(/_/g, ' ').replace(/-/g, ' ');
}
