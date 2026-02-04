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
  coverPhoto?: string;
  isPublic: boolean;
}

export default function FotkyZAkciPage() {
  const [galleries, setGalleries] = useState<PhotoGallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGallery, setSelectedGallery] = useState<PhotoGallery | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      const response = await fetch('/api/admin/photo-galleries?isPublic=true');
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
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Fotky z akci</h1>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Fotky z akci</h1>

      <p className="text-lg text-gray-700 mb-8">
        Podivejte se na fotky z nasich taboru, vyletu a dalsich akci.
      </p>

      {galleries.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">Zatim zadne fotogalerie.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {galleries.map((gallery) => (
            <div key={gallery._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{gallery.title}</h2>
                <p className="text-gray-600">
                  {new Date(gallery.date).toLocaleDateString('cs-CZ')} - {gallery.event}
                </p>
                {gallery.description && (
                  <p className="text-gray-500 mt-2">{gallery.description}</p>
                )}
              </div>

              {gallery.photos.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-4">
                    {gallery.photos.slice(0, 8).map((photo, index) => (
                      <div
                        key={index}
                        className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => openLightbox(gallery, index)}
                      >
                        <img
                          src={photo.url}
                          alt={photo.caption || photo.filename}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    ))}
                  </div>

                  {gallery.photos.length > 8 && (
                    <div className="p-4 border-t bg-gray-50">
                      <button
                        onClick={() => openLightbox(gallery, 0)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Zobrazit vsechny fotky ({gallery.photos.length})
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-8 text-center text-gray-400">
                  Galerie zatim neobsahuje zadne fotky
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxPhoto && selectedGallery && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <div className="relative max-w-6xl w-full h-full flex items-center justify-center p-4">
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Previous button */}
            {lightboxIndex > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}
                className="absolute left-4 text-white hover:text-gray-300 z-10"
              >
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Image */}
            <img
              src={lightboxPhoto.url}
              alt={lightboxPhoto.caption || lightboxPhoto.filename}
              className="max-h-full max-w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Next button */}
            {lightboxIndex < selectedGallery.photos.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}
                className="absolute right-4 text-white hover:text-gray-300 z-10"
              >
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* Caption and counter */}
            <div className="absolute bottom-4 left-0 right-0 text-center text-white">
              {lightboxPhoto.caption && (
                <p className="mb-2">{lightboxPhoto.caption}</p>
              )}
              <p className="text-sm text-gray-400">
                {lightboxIndex + 1} / {selectedGallery.photos.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
