'use client';

import { useState, useEffect } from 'react';
import { allPagesContent } from '@/data/content';
import RentalCalendar from '@/components/RentalCalendar';

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

interface RentalFormData {
  name: string;
  email: string;
  phone: string;
  organization?: string;
  startDate: string;
  endDate: string;
  guestCount: number;
  purpose: string;
  message?: string;
  agreeTerms: boolean;
}

const purposeOptions = [
  'Letní tábor',
  'Víkendový pobyt',
  'Firemní akce',
  'Školní výlet',
  'Rodinná oslava',
  'Sportovní soustředění',
  'Vzdělávací seminář',
  'Jiné'
];

export default function HajenkabelaPage() {
  const [content, setContent] = useState<typeof allPagesContent.hajenkaBela | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Rental form state
  const [formData, setFormData] = useState<RentalFormData>({
    name: '',
    email: '',
    phone: '',
    organization: '',
    startDate: '',
    endDate: '',
    guestCount: 1,
    purpose: '',
    message: '',
    agreeTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content?page=hajenkaBela');
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
      setContent(allPagesContent.hajenkaBela);
    };

    fetchContent();
  }, []);

  // Lightbox functions
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

  // Form functions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const calculateEstimatedPrice = () => {
    if (!formData.startDate || !formData.endDate) return 0;

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (days <= 0) return 0;

    const dailyRate = days >= 7 ? 1200 : 1500;
    return days * dailyRate;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.agreeTerms) {
      setError('Musíte souhlasit s podmínkami pronájmu');
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setError('Datum konce musí být po datu začátku');
      return;
    }

    if (formData.guestCount > 35) {
      setError('Kapacita hájenky je maximálně 35 osob');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/rental-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setShowSuccess(true);
      } else {
        setError(result.message || 'Chyba při odesílání žádosti');
      }
    } catch (error) {
      setError('Chyba při odesílání žádosti. Zkuste to prosím později.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const estimatedPrice = calculateEstimatedPrice();
  const days = formData.startDate && formData.endDate ?
    Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;

  if (!content) {
    return (
      <main className="container mx-auto px-4 py-8 animate-pulse">
        <div className="h-9 bg-slate-200 rounded w-80 mb-4"></div>
        <div className="h-5 bg-slate-200 rounded w-full mb-2"></div>
        <div className="h-5 bg-slate-200 rounded w-3/4 mb-8"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-lg"></div>)}
        </div>
        <div className="h-96 bg-slate-200 rounded-xl"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{content.title}</h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">{content.description}</p>
        </div>

        {/* Main hero image */}
        <div className="mb-8">
          <img
            src="/foto/bela2.jpg"
            alt="Hájenka Bělá - exteriér"
            className="w-full h-64 md:h-80 object-cover rounded-xl shadow-lg"
          />
        </div>

        {/* Two column layout */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left column - About */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-4">O hájence</h2>
              <p className="text-gray-700 mb-4">{content.description}</p>
              <p className="text-gray-700">{content.details}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Vybavení</h2>
              <ul className="space-y-2 text-gray-700">
                {content.equipment?.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Aktivity</h2>
              <ul className="space-y-2 text-gray-700">
                {content.activities?.map((activity: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-[#0070af] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {activity}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
              <h2 className="text-xl font-bold text-slate-800 mb-3">{content.location?.title || 'Poloha a dostupnost'}</h2>
              <p className="text-gray-700 mb-4">
                {content.location?.description || 'Hájenka Bělá se nachází v klidné přírodní lokalitě s dobrou dostupností.'}
              </p>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-slate-700">GPS souřadnice:</p>
                  <p className="text-gray-600">{content.location?.gps || 'Budou upřesněny'}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-700">Nejbližší město:</p>
                  <p className="text-gray-600">{content.location?.nearestTown || 'Pacov (5 km)'}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#0070af]/10 p-6 rounded-xl border border-[#0070af]/20">
              <h2 className="text-xl font-bold text-slate-800 mb-3">Kontakt</h2>
              <p className="text-gray-700 mb-3">
                Pro více informací o Hájence Bělá nás kontaktujte:
              </p>
              <div className="space-y-1 text-gray-700">
                <p><strong>Email:</strong> mareseznam@seznam.cz</p>
                <p><strong>Telefon:</strong> +420 607 244 526</p>
                <p><strong>Vedoucí:</strong> Mgr. Ladislav Mareš</p>
              </div>
            </div>
          </div>

          {/* Right column - Rental Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Žádost o pronájem</h2>
              <p className="text-slate-600 mb-6">Vyplňte formulář pro rezervaci hájenky</p>

              {showSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Žádost odeslána!</h3>
                  <p className="text-slate-600 mb-4">Budeme vás brzy kontaktovat.</p>
                  <button
                    onClick={() => {
                      setShowSuccess(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        organization: '',
                        startDate: '',
                        endDate: '',
                        guestCount: 1,
                        purpose: '',
                        message: '',
                        agreeTerms: false
                      });
                    }}
                    className="text-[#0070af] hover:underline"
                  >
                    Odeslat další žádost
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Jméno a příjmení *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-[#0070af] focus:border-[#0070af]"
                        placeholder="Jan Novák"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-[#0070af] focus:border-[#0070af]"
                        placeholder="jan@email.cz"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Telefon *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-[#0070af] focus:border-[#0070af]"
                        placeholder="+420 123 456 789"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Organizace
                      </label>
                      <input
                        type="text"
                        name="organization"
                        value={formData.organization}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-[#0070af] focus:border-[#0070af]"
                        placeholder="Volitelné"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Příjezd *
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-[#0070af] focus:border-[#0070af]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Odjezd *
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-[#0070af] focus:border-[#0070af]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Počet osob *
                      </label>
                      <input
                        type="number"
                        name="guestCount"
                        value={formData.guestCount}
                        onChange={handleInputChange}
                        required
                        min="1"
                        max="35"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-[#0070af] focus:border-[#0070af]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Účel pobytu *
                    </label>
                    <select
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-[#0070af] focus:border-[#0070af]"
                    >
                      <option value="">Vyberte účel</option>
                      {purposeOptions.map(purpose => (
                        <option key={purpose} value={purpose}>{purpose}</option>
                      ))}
                    </select>
                  </div>

                  {days > 0 && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span>{days} {days === 1 ? 'den' : days < 5 ? 'dny' : 'dní'} × {days >= 7 ? '1 200' : '1 500'} Kč</span>
                        <span className="font-bold text-blue-600">{estimatedPrice.toLocaleString()} Kč</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">* Orientační cena bez energií</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Poznámka
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-[#0070af] focus:border-[#0070af]"
                      placeholder="Speciální požadavky..."
                    />
                  </div>

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      id="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                      required
                      className="h-4 w-4 text-[#0070af] focus:ring-[#0070af] border-slate-300 rounded mt-1"
                    />
                    <label htmlFor="agreeTerms" className="ml-2 text-sm text-slate-700">
                      Souhlasím s podmínkami pronájmu *
                    </label>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-800 text-sm">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.agreeTerms}
                    className="w-full px-6 py-3 bg-[#0070af] text-white font-medium rounded-lg hover:bg-[#005a8c] transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Odesílám...' : 'Odeslat žádost o pronájem'}
                  </button>
                </form>
              )}
            </div>

            {/* Calendar */}
            <RentalCalendar className="bg-white rounded-xl shadow-sm border border-slate-200" />
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Fotogalerie</h2>
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
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            ))}
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
