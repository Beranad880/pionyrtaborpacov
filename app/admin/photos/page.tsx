'use client';

import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/components/Toast';

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
  _id?: string;
  filename: string;
  url: string;
  caption?: string;
  tags: string[];
  uploadedBy: string;
  uploadedAt: string;
}

interface GalleryFormData {
  title: string;
  description: string;
  event: string;
  date: string;
  isPublic: boolean;
}


export default function PhotosAdminPage() {
  const { toast } = useToast();
  const [galleries, setGalleries] = useState<PhotoGallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGallery, setSelectedGallery] = useState<PhotoGallery | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [pendingPhotos, setPendingPhotos] = useState<Photo[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addPhotosInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<GalleryFormData>({
    title: '',
    description: '',
    event: '',
    date: '',
    isPublic: true
  });

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
      }
    } catch (error) {
      console.error('Error fetching galleries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingPhotos(true);
    const newPhotos: Photo[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      try {
        const base64 = await fileToBase64(file);
        newPhotos.push({
          filename: file.name,
          url: base64,
          caption: '',
          tags: [],
          uploadedBy: 'admin',
          uploadedAt: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error converting file:', error);
      }
    }

    setPendingPhotos(prev => [...prev, ...newPhotos]);
    setUploadingPhotos(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const removePendingPhoto = (index: number) => {
    setPendingPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const updatePendingPhotoCaption = (index: number, caption: string) => {
    setPendingPhotos(prev => prev.map((photo, i) =>
      i === index ? { ...photo, caption } : photo
    ));
  };

  const handleCreateGallery = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.event || !formData.date) {
      toast('Vyplňte všechna povinná pole', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/photo-galleries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          photos: pendingPhotos,
          coverPhoto: pendingPhotos.length > 0 ? pendingPhotos[0].url : undefined,
          createdBy: 'admin'
        })
      });

      const result = await response.json();

      if (result.success) {
        fetchGalleries();
        setShowAddForm(false);
        setFormData({ title: '', description: '', event: '', date: '', isPublic: true });
        setPendingPhotos([]);
        toast('Galerie byla úspěšně vytvořena', 'success');
      } else {
        toast(result.message || 'Chyba při vytváření galerie', 'error');
      }
    } catch (error) {
      console.error('Error creating gallery:', error);
      toast('Chyba při vytváření galerie', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddPhotosToGallery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedGallery) return;

    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingPhotos(true);
    const newPhotos: Photo[] = [...selectedGallery.photos];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      try {
        const base64 = await fileToBase64(file);
        newPhotos.push({
          filename: file.name,
          url: base64,
          caption: '',
          tags: [],
          uploadedBy: 'admin',
          uploadedAt: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error converting file:', error);
      }
    }

    try {
      const response = await fetch(`/api/admin/photo-galleries/${selectedGallery._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photos: newPhotos })
      });

      const result = await response.json();

      if (result.success) {
        setSelectedGallery({ ...selectedGallery, photos: newPhotos });
        fetchGalleries();
        toast('Fotky byly přidány', 'success');
      } else {
        toast(result.message || 'Chyba při přidávání fotek', 'error');
      }
    } catch (error) {
      console.error('Error adding photos:', error);
      toast('Chyba při přidávání fotek', 'error');
    } finally {
      setUploadingPhotos(false);
      if (addPhotosInputRef.current) {
        addPhotosInputRef.current.value = '';
      }
    }
  };

  const toggleGalleryVisibility = async (id: string) => {
    try {
      const gallery = galleries.find(g => g._id === id);
      if (!gallery) return;

      const response = await fetch(`/api/admin/photo-galleries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: !gallery.isPublic }),
      });

      const result = await response.json();

      if (result.success) {
        setGalleries(prev =>
          prev.map(g => g._id === id ? { ...g, isPublic: !g.isPublic } : g)
        );
        if (selectedGallery?._id === id) {
          setSelectedGallery({ ...selectedGallery, isPublic: !selectedGallery.isPublic });
        }
      } else {
        toast(result.message || 'Chyba při aktualizaci galerie', 'error');
      }
    } catch (error) {
      console.error('Error updating gallery:', error);
      toast('Chyba při aktualizaci galerie', 'error');
    }
  };

  const deleteGallery = async (id: string) => {
    if (!confirm('Opravdu chcete tuto galerii smazat? Všechny fotky budou trvale odstraněny.')) return;

    try {
      const response = await fetch(`/api/admin/photo-galleries/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setGalleries(prev => prev.filter(g => g._id !== id));
        setSelectedGallery(null);
        toast('Galerie byla smazána', 'success');
      } else {
        toast(result.message || 'Chyba při mazání galerie', 'error');
      }
    } catch (error) {
      console.error('Error deleting gallery:', error);
      toast('Chyba při mazání galerie', 'error');
    }
  };

  const deletePhoto = async (galleryId: string, photoIndex: number) => {
    if (!confirm('Opravdu chcete tuto fotku smazat?')) return;

    const gallery = galleries.find(g => g._id === galleryId);
    if (!gallery) return;

    const updatedPhotos = gallery.photos.filter((_, i) => i !== photoIndex);

    try {
      const response = await fetch(`/api/admin/photo-galleries/${galleryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photos: updatedPhotos })
      });

      const result = await response.json();

      if (result.success) {
        setGalleries(prev =>
          prev.map(g => g._id === galleryId ? { ...g, photos: updatedPhotos } : g)
        );
        if (selectedGallery?._id === galleryId) {
          setSelectedGallery({ ...selectedGallery, photos: updatedPhotos });
        }
        toast('Fotka byla smazána', 'success');
      } else {
        toast(result.message || 'Chyba při mazání fotky', 'error');
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast('Chyba při mazání fotky', 'error');
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
                <span className="text-blue-600 font-semibold">G</span>
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
                <span className="text-green-600 font-semibold">F</span>
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
                <span className="text-purple-600 font-semibold">V</span>
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
                <span className="text-orange-600 font-semibold">P</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Prumer fotek</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {galleries.length > 0 ? Math.round(totalPhotos / galleries.length) : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Galleries Grid */}
      {galleries.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">Zatim zadne galerie</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Vytvorit prvni galerii
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((gallery) => (
            <div key={gallery._id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {/* Gallery Cover */}
              <div className="relative h-48 bg-gray-200">
                {gallery.coverPhoto || gallery.photos[0]?.url ? (
                  <img
                    src={gallery.coverPhoto || gallery.photos[0]?.url}
                    alt={gallery.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">Bez nahledu</span>
                  </div>
                )}

                {/* Visibility indicator */}
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => toggleGalleryVisibility(gallery._id)}
                    className={`p-2 rounded-full text-white text-xs ${
                      gallery.isPublic ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                    title={gallery.isPublic ? 'Verejna galerie' : 'Soukroma galerie'}
                  >
                    {gallery.isPublic ? 'V' : 'S'}
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
                      {new Date(gallery.date).toLocaleDateString('cs-CZ')} - {gallery.event}
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

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{gallery.description}</p>

                <div className="text-xs text-gray-500">
                  Vytvoreno: {new Date(gallery.createdAt).toLocaleDateString('cs-CZ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Gallery Detail Modal */}
      {selectedGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedGallery.title}</h3>
                <p className="text-gray-600">{selectedGallery.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(selectedGallery.date).toLocaleDateString('cs-CZ')} - {selectedGallery.event} - {selectedGallery.photos.length} fotek
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => toggleGalleryVisibility(selectedGallery._id)}
                  className={`px-3 py-1 rounded text-sm text-white ${
                    selectedGallery.isPublic ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  {selectedGallery.isPublic ? 'Verejna' : 'Soukroma'}
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
              {selectedGallery.photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={photo.url}
                      alt={photo.caption || photo.filename}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Photo overlay with actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => deletePhoto(selectedGallery._id, index)}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      title="Smazat fotku"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Photo caption */}
                  {photo.caption && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-600 text-center">{photo.caption}</p>
                    </div>
                  )}
                </div>
              ))}

              {/* Add new photos */}
              <label className="aspect-square bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <input
                  ref={addPhotosInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAddPhotosToGallery}
                  className="hidden"
                  disabled={uploadingPhotos}
                />
                <div className="text-center">
                  {uploadingPhotos ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto"></div>
                  ) : (
                    <>
                      <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <p className="text-sm text-gray-500">Pridat fotky</p>
                    </>
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Add Gallery Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Nova galerie</h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({ title: '', description: '', event: '', date: '', isPublic: true });
                  setPendingPhotos([]);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateGallery} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nazev galerie *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    placeholder="Letni tabor 2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nazev akce *
                  </label>
                  <input
                    type="text"
                    name="event"
                    value={formData.event}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    placeholder="Letni tabor"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Datum akce *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isPublic"
                    id="isPublic"
                    checked={formData.isPublic}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700">
                    Verejna galerie
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Popis *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  placeholder="Popis galerie..."
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fotky
                </label>
                <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={uploadingPhotos}
                  />
                  <div className="text-center">
                    {uploadingPhotos ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                    ) : (
                      <>
                        <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm text-gray-500">Klikni pro vyber fotek</p>
                        <p className="text-xs text-gray-400">nebo pretahni soubory sem</p>
                      </>
                    )}
                  </div>
                </label>
              </div>

              {/* Pending Photos Preview */}
              {pendingPhotos.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Vybrane fotky ({pendingPhotos.length})
                  </h4>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {pendingPhotos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                          <img
                            src={photo.url}
                            alt={photo.filename}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removePendingPhoto(index)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <input
                          type="text"
                          placeholder="Popis..."
                          value={photo.caption || ''}
                          onChange={(e) => updatePendingPhotoCaption(index, e.target.value)}
                          className="mt-1 w-full px-2 py-1 text-xs border border-gray-200 rounded"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({ title: '', description: '', event: '', date: '', isPublic: true });
                    setPendingPhotos([]);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Zrusit
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Ukladam...' : 'Vytvorit galerii'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
