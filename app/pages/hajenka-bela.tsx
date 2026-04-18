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

const defaultRentalSettings = {
  pricePerDayShort: 1500,
  pricePerDayWeek: 1200,
  weekThreshold: 7,
  capacity: 35,
  minDays: 1,
  note: 'Cena nezahrnuje energie',
};

export default function HajenkabelaPage() {
  const [content, setContent] = useState<typeof allPagesContent.hajenkaBela | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [rentalSettings, setRentalSettings] = useState(defaultRentalSettings);

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
    fetch('/api/content?page=rentalSettings')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.success && data.data) setRentalSettings({ ...defaultRentalSettings, ...data.data }); })
      .catch(() => {});
  }, []);

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

    const dailyRate = days >= rentalSettings.weekThreshold ? rentalSettings.pricePerDayWeek : rentalSettings.pricePerDayShort;
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

    if (formData.guestCount > rentalSettings.capacity) {
      setError(`Kapacita hájenky je maximálně ${rentalSettings.capacity} osob`);
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
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="h-9 bg-slate-200 rounded w-80 mb-4"></div>
        <div className="h-5 bg-slate-200 rounded w-full mb-2"></div>
        <div className="h-5 bg-slate-200 rounded w-3/4 mb-8"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-lg"></div>)}
        </div>
        <div className="h-96 bg-slate-200 rounded-xl"></div>
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
            Naše základna
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">{content.title}</h1>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-medium">
            {content.description}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-24">
        {/* Main hero image */}
        <div className="max-w-7xl mx-auto mb-20">
          <div className="relative group overflow-hidden rounded-[3rem] shadow-2xl">
             <img
               src="/foto/bela2.jpg"
               alt="Hájenka Bělá - exteriér"
               className="w-full h-[400px] md:h-[600px] object-cover transition-transform duration-700 group-hover:scale-105"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-12">
                <div className="text-white">
                   <div className="font-black text-3xl md:text-5xl tracking-tight mb-2">Hájenka Bělá</div>
                   <p className="text-white/80 font-bold text-lg">Místo pro vaše dobrodružství v přírodě</p>
                </div>
             </div>
          </div>
        </div>

        {/* Two column layout */}
        <div className="grid lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
          {/* Left column - About */}
          <div className="lg:col-span-7 space-y-12">
            <div className="bg-[#0070af] p-10 md:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              
              <div className="relative z-10">
                <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-4 tracking-tight">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  {content.location?.title || 'Poloha a dostupnost'}
                </h2>
                <p className="text-blue-50 text-xl mb-10 font-medium leading-relaxed opacity-90">
                  {content.location?.description || 'Hájenka Bělá se nachází v klidné přírodní lokalitě s dobrou dostupností.'}
                </p>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-8 border border-white/10 group-hover:bg-white/15 transition-all">
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-3">Adresa základny</p>
                    <p className="text-white font-black text-lg leading-tight">{content.location?.address || 'Červená Řečice 27, Červená Řečice, 394 46, Pelhřimov'}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-8 border border-white/10 group-hover:bg-white/15 transition-all">
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-3">GPS / Lokalita</p>
                    <p className="text-white font-black text-lg font-mono mb-2">{content.location?.gps || '49.50436, 15.13751'}</p>
                    <p className="text-blue-100 font-bold text-sm">Vzdálenost: {content.location?.nearestTown || 'Červená Řečice (1 km)'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-10 md:p-16 rounded-[3rem] shadow-sm group">
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Příběh a prostor</h2>
              <div className="space-y-6">
                <p className="text-slate-600 text-lg leading-relaxed font-medium">{content.description}</p>
                <p className="text-slate-600 text-lg leading-relaxed font-medium">{content.details}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white border border-slate-100 p-10 rounded-[3rem] shadow-xl">
                  <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
                     <span className="w-2 h-8 bg-green-500 rounded-full"></span>
                     Vybavení
                  </h2>
                  <ul className="space-y-4 text-slate-600 font-bold">
                    {content.equipment?.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                           <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white border border-slate-100 p-10 rounded-[3rem] shadow-xl">
                  <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
                     <span className="w-2 h-8 bg-[#0070af] rounded-full"></span>
                     Aktivity
                  </h2>
                  <ul className="space-y-4 text-slate-600 font-bold">
                    {content.activities?.map((activity: string, index: number) => (
                      <li key={index} className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                           <svg className="w-3.5 h-3.5 text-[#0070af]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>
            </div>

            <div className="bg-slate-900 p-10 md:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5">
                 <svg className="w-64 h-64 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              </div>
              <h2 className="text-3xl font-black text-white mb-10 tracking-tight relative z-10">Okolní místa</h2>
              <div className="space-y-6 relative z-10">
                {[
                  { name: 'Pacov', distance: '15 km', time: '15 min', icon: '🏘️' },
                  { name: 'Červená Řečice', distance: '8 km', time: '10 min', icon: '🏡' },
                  { name: 'Hořepník', distance: '4 km', time: '5 min', icon: '🏡' },
                  { name: 'Pelhřimov', distance: '15 km', time: '15 min', icon: '🏙️' },
                ].map(({ name, distance, time, icon }) => (
                  <div key={name} className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{icon}</span>
                      <span className="font-black text-white text-lg">{name}</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <span className="text-slate-400 flex items-center gap-2 font-bold">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {distance}
                      </span>
                      <span className="text-[#0070af] font-black flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-8 text-center">* Orientační vzdálenosti autem</p>
            </div>
          </div>

          {/* Right column - Rental Form */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 p-8 md:p-12 sticky top-24 overflow-hidden group/form">
              {/* Form header */}
              <div className="mb-10 text-center relative z-10">
                 <div className="w-20 h-20 bg-[#0070af]/5 rounded-3xl flex items-center justify-center mx-auto mb-6 text-[#0070af] shadow-inner group-hover/form:scale-110 transition-transform">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                 </div>
                 <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Chci si pronajmout</h2>
                 <p className="text-slate-500 font-bold">Vyplňte formulář a my se vám ozveme zpět.</p>
              </div>

              {showSuccess ? (
                <div className="text-center py-12 animate-fade-in relative z-10">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-900/10">
                    <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Odesláno!</h3>
                  <p className="text-slate-500 font-bold mb-10 text-lg">Vaši žádost jsme přijali. Brzy vás budeme kontaktovat.</p>
                  <button
                    onClick={() => {
                      setShowSuccess(false);
                      setFormData({ name: '', email: '', phone: '', organization: '', startDate: '', endDate: '', guestCount: 1, purpose: '', message: '', agreeTerms: false });
                    }}
                    className="bg-[#0070af] text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#005a8c] transition-all shadow-xl shadow-[#0070af]/20 active:scale-95"
                  >
                    Odeslat další žádost
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Jméno a příjmení *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#0070af]/10 focus:border-[#0070af] transition-all font-bold placeholder:text-slate-300"
                          placeholder="Jan Novák"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Váš email *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#0070af]/10 focus:border-[#0070af] transition-all font-bold placeholder:text-slate-300"
                          placeholder="jan@email.cz"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Telefon *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#0070af]/10 focus:border-[#0070af] transition-all font-bold placeholder:text-slate-300"
                          placeholder="+420..."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Příjezd *</label>
                        <input
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleInputChange}
                          required
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#0070af]/10 focus:border-[#0070af] transition-all font-bold"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Odjezd *</label>
                        <input
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleInputChange}
                          required
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#0070af]/10 focus:border-[#0070af] transition-all font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Počet osob *</label>
                          <input
                            type="number"
                            name="guestCount"
                            value={formData.guestCount}
                            onChange={handleInputChange}
                            required
                            min="1"
                            max={rentalSettings.capacity}
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#0070af]/10 focus:border-[#0070af] transition-all font-black text-lg text-[#0070af]"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Účel pobytu *</label>
                          <select
                            name="purpose"
                            value={formData.purpose}
                            onChange={handleInputChange}
                            required
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#0070af]/10 focus:border-[#0070af] transition-all font-bold"
                          >
                            <option value="">Vyberte účel</option>
                            {purposeOptions.map(purpose => (
                              <option key={purpose} value={purpose}>{purpose}</option>
                            ))}
                          </select>
                        </div>
                    </div>
                  </div>

                  {days > 0 && (
                    <div className="bg-[#0070af]/5 border border-[#0070af]/10 p-8 rounded-[2rem] animate-fade-in">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{days} {days === 1 ? 'den' : days < 5 ? 'dny' : 'dní'} pobytu</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Předběžná cena</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                         <span className="text-slate-500 font-bold text-sm">Sazba {(days >= rentalSettings.weekThreshold ? rentalSettings.pricePerDayWeek : rentalSettings.pricePerDayShort).toLocaleString()} Kč/den</span>
                         <span className="text-3xl font-black text-[#0070af]">{estimatedPrice.toLocaleString()} Kč</span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 mt-4 italic">* {rentalSettings.note}</p>
                    </div>
                  )}

                  <div className="flex items-start gap-3 px-2">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      id="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                      required
                      className="h-5 w-5 text-[#0070af] focus:ring-[#0070af] border-slate-300 rounded-lg mt-1 transition-all"
                    />
                    <label htmlFor="agreeTerms" className="text-xs text-slate-500 font-bold leading-relaxed">
                      Souhlasím s podmínkami pronájmu a se zpracováním osobních údajů pro účely vyřízení rezervace. *
                    </label>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-5 animate-shake">
                      <p className="text-red-800 text-sm font-bold flex items-center gap-2">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                         {error}
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.agreeTerms}
                    className="w-full bg-[#0070af] text-white px-8 py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-[#005a8c] transition-all shadow-xl shadow-[#0070af]/20 active:scale-95 disabled:bg-slate-300 disabled:shadow-none disabled:scale-100 mt-4"
                  >
                    {isSubmitting ? 'ODESÍLÁM...' : 'ODESLAT ŽÁDOST'}
                  </button>
                </form>
              )}
            </div>

            {/* Calendar Component */}
            <div className="bg-slate-50 border border-slate-100 rounded-[3rem] p-4 shadow-sm overflow-hidden">
                <RentalCalendar />
            </div>
          </div>
        </div>

        {/* Photo Gallery - MODERNIZED */}
        <div className="mt-40 mb-20">
          <div className="text-center mb-16 space-y-4">
             <div className="inline-block px-4 py-1.5 rounded-full bg-[#0070af]/10 text-[#0070af] font-black text-[10px] tracking-[0.3em] uppercase">
               Galerie hájenky
             </div>
             <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Prohlédněte si to u nás</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-7xl mx-auto">
            {galleryPhotos.map((photo, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden rounded-[2.5rem] shadow-xl cursor-pointer group"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-md p-6 rounded-full transform scale-50 group-hover:scale-100 transition-transform duration-500">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox - MODERNIZED matching other pages */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-slate-900/98 flex flex-col animate-fade-in"
          onClick={closeLightbox}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between p-6 md:p-10 relative z-[110]">
             <div className="text-white">
                <div className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">Galerie Hájenka Bělá</div>
                <div className="text-lg font-bold">{galleryPhotos[currentImageIndex].alt}</div>
             </div>
             <button
                onClick={closeLightbox}
                className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/10 text-white hover:bg-red-500 transition-all active:scale-95"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
          </div>

          <div className="flex-grow relative flex items-center justify-center p-4">
            {/* Previous button */}
            <button
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              className="absolute left-6 md:left-10 w-16 h-16 flex items-center justify-center rounded-2xl bg-white/5 text-white hover:bg-white/20 transition-all z-10 active:scale-90"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M15 19l-7-7 7-7" /></svg>
            </button>

            {/* Image */}
            <div className="relative group/img max-h-full max-w-full shadow-2xl shadow-black/50 rounded-2xl overflow-hidden">
                <img
                  src={galleryPhotos[currentImageIndex].src}
                  alt={galleryPhotos[currentImageIndex].alt}
                  className="max-h-[75vh] max-w-full object-contain animate-fade-in"
                  onClick={(e) => e.stopPropagation()}
                />
            </div>

            {/* Next button */}
            <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute right-6 md:right-10 w-16 h-16 flex items-center justify-center rounded-2xl bg-white/5 text-white hover:bg-white/20 transition-all z-10 active:scale-90"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          {/* Bottom Bar */}
          <div className="p-8 text-center">
              <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full text-white text-sm font-black tracking-widest uppercase">
                {currentImageIndex + 1} <span className="opacity-40">/</span> {galleryPhotos.length}
              </div>
          </div>
        </div>
      )}
    </div>
  );
}
