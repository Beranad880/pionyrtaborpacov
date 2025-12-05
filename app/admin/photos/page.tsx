'use client';

import { useState, useEffect } from 'react';

interface PhotoGallery {
  _id: string;
  title: string;
  description: string;
  event: string;
  date: string;
  photos: Photo[];
  coverPhoto?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Photo {
  _id: string;
  filename: string;
  url: string;
  caption?: string;
  tags: string[];
  uploadedBy: string;
  uploadedAt: string;
}

export default function PhotosAdminPage() {
  const [galleries, setGalleries] = useState<PhotoGallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGallery, setSelectedGallery] = useState<PhotoGallery | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Sample galleries for demonstration
  const sampleGalleries: PhotoGallery[] = [
    {
      _id: '1',
      title: 'Letní tábor 2024',
      description: 'Fotky z našeho úspěšného letního tábora na Hájence Bělá.',
      event: 'Letní tábor 2024',
      date: '2024-07-15',
      photos: [
        {
          _id: 'p1',
          filename: 'tabor_01.jpg',
          url: '/images/gallery/tabor_01.jpg',
          caption: 'Táborové ohně',
          tags: ['tábor', 'oheň', 'večer'],
          uploadedBy: 'admin',
          uploadedAt: '2024-07-15'
        },
        {
          _id: 'p2',
          filename: 'tabor_02.jpg',
          url: '/images/gallery/tabor_02.jpg',
          caption: 'Sportovní aktivity',
          tags: ['sport', 'děti', 'zábava'],
          uploadedBy: 'admin',
          uploadedAt: '2024-07-15'
        },
        {
          _id: 'p3',
          filename: 'tabor_03.jpg',
          url: '/images/gallery/tabor_03.jpg',
          caption: 'Koupání v rybníce',
          tags: ['koupání', 'voda', 'léto'],
          uploadedBy: 'admin',
          uploadedAt: '2024-07-16'
        }
      ],
      coverPhoto: '/images/gallery/tabor_01.jpg',
      isPublic: true,
      createdAt: '2024-07-15',
      updatedAt: '2024-07-20'
    },
    {
      _id: '2',
      title: 'Výlet na Blanský les',
      description: 'Jednodenní výlet na rozhlednu s krásným výhledem.',
      event: 'Výlet Blanský les',
      date: '2024-09-14',
      photos: [
        {
          _id: 'p4',
          filename: 'blansky_01.jpg',
          url: '/images/gallery/blansky_01.jpg',
          caption: 'Rozhledna',
          tags: ['rozhledna', 'výhled', 'les'],
          uploadedBy: 'admin',
          uploadedAt: '2024-09-14'
        },
        {
          _id: 'p5',
          filename: 'blansky_02.jpg',
          url: '/images/gallery/blansky_02.jpg',
          caption: 'Skupinová fotka',
          tags: ['skupina', 'děti', 'výlet'],
          uploadedBy: 'admin',
          uploadedAt: '2024-09-14'
        }
      ],
      coverPhoto: '/images/gallery/blansky_01.jpg',
      isPublic: true,
      createdAt: '2024-09-14',
      updatedAt: '2024-09-15'
    },
    {
      _id: '3',
      title: 'Vánoční schůzka 2024',
      description: 'Fotky z vánoční schůzky s programem a dárečky.',
      event: 'Vánoční schůzka',
      date: '2024-12-20',
      photos: [
        {
          _id: 'p6',
          filename: 'vanoce_01.jpg',
          url: '/images/gallery/vanoce_01.jpg',
          caption: 'Vánoční stromeček',
          tags: ['vánoce', 'stromeček', 'slavnost'],
          uploadedBy: 'admin',
          uploadedAt: '2024-12-20'
        }
      ],
      coverPhoto: '/images/gallery/vanoce_01.jpg',
      isPublic: false,
      createdAt: '2024-12-20',
      updatedAt: '2024-12-20'
    }
  ];

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/photo-galleries');
      const result = await response.json();

      if (result.success) {
        setGalleries(result.data.galleries);
      } else {
        console.error('Failed to fetch galleries:', result.message);
        // Fallback to sample data
        setGalleries(sampleGalleries);
      }
    } catch (error) {
      console.error('Error fetching galleries:', error);
      // Fallback to sample data
      setGalleries(sampleGalleries);
    } finally {
      setLoading(false);
    }
  };

  const toggleGalleryVisibility = async (id: string) => {
    try {
      const gallery = galleries.find(g => g._id === id);
      if (!gallery) return;

      const response = await fetch(`/api/admin/photo-galleries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPublic: !gallery.isPublic }),
      });

      const result = await response.json();

      if (result.success) {
        setGalleries(prev =>
          prev.map(gallery =>
            gallery._id === id ? { ...gallery, isPublic: !gallery.isPublic } : gallery
          )
        );
      } else {
        alert(`Chyba: ${result.message}`);
      }
    } catch (error) {
      console.error('Error updating gallery:', error);
      alert('Chyba při aktualizaci galerie');
    }
  };

  const deleteGallery = async (id: string) => {
    if (confirm('Opravdu chcete tuto galerii smazat? Všechny fotky budou trvale odstraněny.')) {
      try {
        const response = await fetch(`/api/admin/photo-galleries/${id}`, {
          method: 'DELETE',
        });

        const result = await response.json();

        if (result.success) {
          setGalleries(prev => prev.filter(gallery => gallery._id !== id));
          setSelectedGallery(null);
        } else {
          alert(`Chyba: ${result.message}`);
        }
      } catch (error) {
        console.error('Error deleting gallery:', error);
        alert('Chyba při mazání galerie');
      }
    }
  };

  const deletePhoto = (galleryId: string, photoId: string) => {
    if (confirm('Opravdu chcete tuto fotku smazat?')) {
      setGalleries(prev =>
        prev.map(gallery =>
          gallery._id === galleryId
            ? { ...gallery, photos: gallery.photos.filter(photo => photo._id !== photoId) }
            : gallery
        )
      );
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Fotky z akcí</h1>
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-lg shadow-sm border h-64"></div>
          ))}
        </div>
      </div>
    );
  }

  const totalPhotos = galleries.reduce((sum, gallery) => sum + gallery.photos.length, 0);
  const publicGalleries = galleries.filter(g => g.isPublic).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Fotky z akcí</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Nová galerie
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">🖼️</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Galerie</h3>
              <p className="text-2xl font-semibold text-gray-900">{galleries.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold">📷</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Fotky celkem</h3>
              <p className="text-2xl font-semibold text-gray-900">{totalPhotos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-semibold">🌐</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Veřejné</h3>
              <p className="text-2xl font-semibold text-gray-900">{publicGalleries}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-semibold">📁</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Průměr fotek</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {galleries.length > 0 ? Math.round(totalPhotos / galleries.length) : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Galleries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleries.map((gallery) => (
          <div key={gallery._id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
            {/* Gallery Cover */}
            <div className="relative h-48 bg-gray-200">
              {gallery.coverPhoto ? (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-500">📸 {gallery.title}</span>
                </div>
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">Bez náhledu</span>
                </div>
              )}

              {/* Visibility indicator */}
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => toggleGalleryVisibility(gallery._id)}
                  className={`p-2 rounded-full text-white text-xs ${
                    gallery.isPublic ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                  title={gallery.isPublic ? 'Veřejná galerie' : 'Soukromá galerie'}
                >
                  {gallery.isPublic ? '🌐' : '🔒'}
                </button>
              </div>

              {/* Photo count overlay */}
              <div className="absolute bottom-2 left-2">
                <span className="bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                  {gallery.photos.length} fotek
                </span>
              </div>
            </div>

            {/* Gallery Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">{gallery.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(gallery.date).toLocaleDateString('cs-CZ')} • {gallery.event}
                  </p>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setSelectedGallery(gallery)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    title="Zobrazit detail"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteGallery(gallery._id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                    title="Smazat galerii"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3">{gallery.description}</p>

              <div className="text-xs text-gray-500">
                Vytvořeno: {new Date(gallery.createdAt).toLocaleDateString('cs-CZ')}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gallery Detail Modal */}
      {selectedGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedGallery.title}</h3>
                <p className="text-gray-600">{selectedGallery.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(selectedGallery.date).toLocaleDateString('cs-CZ')} • {selectedGallery.event} • {selectedGallery.photos.length} fotek
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => toggleGalleryVisibility(selectedGallery._id)}
                  className={`px-3 py-1 rounded text-sm text-white ${
                    selectedGallery.isPublic ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  {selectedGallery.isPublic ? '🌐 Veřejná' : '🔒 Soukromá'}
                </button>
                <button
                  onClick={() => setSelectedGallery(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Photos Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {selectedGallery.photos.map((photo) => (
                <div key={photo._id} className="relative group">
                  <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">📷 {photo.filename}</span>
                    </div>
                  </div>

                  {/* Photo overlay with actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => deletePhoto(selectedGallery._id, photo._id)}
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        title="Smazat fotku"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Photo caption */}
                  {photo.caption && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-600 text-center">{photo.caption}</p>
                    </div>
                  )}

                  {/* Photo tags */}
                  {photo.tags.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1 justify-center">
                      {photo.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-600 px-1 py-0.5 rounded text-xs">
                          #{tag}
                        </span>
                      ))}
                      {photo.tags.length > 2 && (
                        <span className="text-gray-400 text-xs">+{photo.tags.length - 2}</span>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Add new photos placeholder */}
              <div className="aspect-square bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <div className="text-center">
                  <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <p className="text-sm text-gray-500">Přidat fotky</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Gallery Form Modal - Placeholder */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Nová galerie</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="text-center py-8">
              <p className="text-gray-500">Formulář pro vytvoření nové galerie bude doplněn později.</p>
              <p className="text-sm text-gray-400 mt-2">
                Zde bude možnost nahrát fotky, nastavit název galerie, popis a viditelnost.
              </p>
              <button
                onClick={() => setShowAddForm(false)}
                className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Zavřít
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}