'use client';

import React, { useState } from 'react';
import { siteData } from '@/data/content';

interface CampApplicationForm {
  participantName: string;
  grade: string;
  dateOfBirth: string;
  birthNumber: string;
  address: {
    street: string;
    city: string;
  };
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  guardianAddress: string;
  secondContactName: string;
  secondContactPhone: string;
  secondContactEmail: string;
  secondContactAddress: string;
}

const gradeOptions = [
  { value: '0', label: '1. třída' },
  { value: '1', label: '2. třída' },
  { value: '2', label: '3. třída' },
  { value: '3', label: '4. třída' },
  { value: '4', label: '5. třída' },
  { value: '5', label: '6. třída' },
  { value: '6', label: '7. třída' },
  { value: '7', label: '8. třída' },
  { value: '8', label: '9. třída' }
];

const campInfo = {
  theme: "Dobrodružství v přírodě",
  dates: "15. - 25. července 2025",
  price: 8500,
  location: "Hájenka Bělá",
  capacity: 30,
  ageRange: "6-15 let"
};

export default function CampApplications() {
  const [formData, setFormData] = useState<CampApplicationForm>({
    participantName: '',
    grade: '',
    dateOfBirth: '',
    birthNumber: '',
    address: {
      street: '',
      city: ''
    },
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
    guardianAddress: '',
    secondContactName: '',
    secondContactPhone: '',
    secondContactEmail: '',
    secondContactAddress: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof CampApplicationForm] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    const requiredFields = [
      'participantName', 'grade', 'dateOfBirth', 'birthNumber',
      'address.street', 'address.city', 'guardianName', 'guardianPhone',
      'guardianEmail', 'secondContactName', 'secondContactPhone'
    ];

    for (const field of requiredFields) {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        if (!(formData[parent as keyof CampApplicationForm] as any)?.[child]) {
          return false;
        }
      } else {
        if (!formData[field as keyof CampApplicationForm]) {
          return false;
        }
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.guardianEmail)) {
      return false;
    }

    if (formData.secondContactEmail && !emailRegex.test(formData.secondContactEmail)) {
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setErrorMessage('Prosím vyplňte všechna povinná pole správně.');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/admin/camp-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          campInfo
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          participantName: '',
          grade: '',
          dateOfBirth: '',
          birthNumber: '',
          address: {
            street: '',
            city: ''
          },
          guardianName: '',
          guardianPhone: '',
          guardianEmail: '',
          guardianAddress: '',
          secondContactName: '',
          secondContactPhone: '',
          secondContactEmail: '',
          secondContactAddress: ''
        });
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Nastala chyba při odesílání přihlášky.');
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting camp application:', error);
      setErrorMessage('Nastala chyba při odesílání přihlášky. Zkuste to prosím později.');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-[3rem] shadow-2xl border border-slate-100 p-12 md:p-20 text-center animate-fade-in-up relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
            <div className="w-24 h-24 bg-green-100 rounded-3xl flex items-center justify-center mx-auto mb-10 text-green-600 shadow-xl shadow-green-900/10 transform rotate-12">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Přihláška odeslána!</h1>
            <p className="text-slate-700 font-medium text-xl mb-12 leading-relaxed">
              Děkujeme za zájem o náš letní tábor. Vaši přihlášku jsme v pořádku přijali a brzy se vám ozveme s dalšími informacemi.
            </p>
            <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-10 mb-12 text-left">
              <h3 className="text-xs font-black text-[#0070af] uppercase tracking-[0.2em] mb-6">Co bude následovat?</h3>
              <ul className="space-y-4">
                {[
                  'Přihlášku zpracujeme do 3 pracovních dnů',
                  'Pošleme vám potvrzení na uvedený email',
                  'Zašleme pokyny k platbě zálohy',
                  'Před táborem obdržíte detailní pokyny'
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-4 text-slate-800 font-bold">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => setSubmitStatus('idle')}
              className="bg-[#0070af] text-white px-12 py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-[#005a8c] transition-all shadow-xl shadow-[#0070af]/20 active:scale-95"
            >
              PODAT DALŠÍ PŘIHLÁŠKU
            </button>
          </div>
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
            Letní dobrodružství 2025
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">Přihláška na tábor</h1>
          <p className="text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed font-medium">
            Připojte se k nám na nezapomenutelné prázdninové dobrodružství v hájenka bělá!
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12">
          {/* Camp Info Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              <div className="bg-[#0070af] rounded-[3rem] p-10 shadow-2xl text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <h2 className="text-2xl font-black mb-10 tracking-tight relative z-10">Informace o táboře</h2>

                <div className="space-y-8 relative z-10">
                  {[
                    { l: 'Téma tábora', v: campInfo.theme, i: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/> },
                    { l: 'Termín konání', v: campInfo.dates, i: <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/> },
                    { l: 'Místo pobytu', v: campInfo.location, i: <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"/> },
                    { l: 'Věk a kapacita', v: `${campInfo.ageRange} / ${campInfo.capacity} dětí`, i: <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/> }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-5">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                         <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.i as any}/></svg>
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-1">{item.l}</div>
                        <div className="text-lg font-bold leading-tight">{item.v}</div>
                      </div>
                    </div>
                  ))}

                  <div className="pt-8 border-t border-white/10 mt-10">
                    <div className="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-2">Cena tábora</div>
                    <div className="text-4xl font-black text-white tracking-tighter mb-2">{campInfo.price.toLocaleString()} Kč</div>
                    <p className="text-xs text-white font-medium opacity-90">Zahrnuje ubytování, 5× denně stravu, pitný režim a program.</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                <h3 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-widest flex items-center gap-3">
                   <span className="w-1.5 h-6 bg-yellow-400 rounded-full"></span>
                   Co s sebou?
                </h3>
                <ul className="space-y-4">
                  {[
                    'Oblečení na 10 dní v přírodě',
                    'Pevnou obuv na turistiku',
                    'Plavky a osušku',
                    'Osobní hygienické potřeby',
                    'Detailní seznam zašleme emailem'
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700 font-bold text-sm leading-snug">
                      <svg className="w-4 h-4 text-[#0070af] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 p-8 md:p-16 overflow-hidden">
              <div className="flex items-center gap-6 mb-12 pb-12 border-b border-slate-50">
                 <div className="w-16 h-16 bg-[#0070af]/5 rounded-2xl flex items-center justify-center text-[#0070af]">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                 </div>
                 <h2 className="text-3xl font-black text-slate-900 tracking-tight">Vyplnit přihlášku</h2>
              </div>

              {submitStatus === 'error' && (
                <div className="mb-10 p-6 bg-red-50 border border-red-100 text-red-700 rounded-2xl font-bold flex items-center gap-4 animate-shake">
                  <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-16">
                {/* Participant Information */}
                <div className="space-y-10">
                  <div className="flex items-center gap-4">
                     <span className="text-xs font-black text-[#0070af] bg-[#0070af]/10 px-3 py-1 rounded-lg uppercase tracking-widest">Sekce 01</span>
                     <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest">Údaje o dítěti</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-2">Jméno a příjmení *</label>
                      <input
                        type="text"
                        name="participantName"
                        value={formData.participantName}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#0070af]/10 focus:border-[#0070af] transition-all font-bold placeholder:text-slate-400"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-2">Aktuální třída *</label>
                      <select
                        name="grade"
                        value={formData.grade}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#0070af]/10 focus:border-[#0070af] transition-all font-bold"
                        required
                      >
                        <option value="">Vyberte třídu</option>
                        {gradeOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-2">Datum narození *</label>
                      <input
                        type="text"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        placeholder="DD.MM.YYYY"
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#0070af]/10 focus:border-[#0070af] transition-all font-bold placeholder:text-slate-400"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-2">Rodné číslo *</label>
                      <input
                        type="text"
                        name="birthNumber"
                        value={formData.birthNumber}
                        onChange={handleInputChange}
                        placeholder="YYMMDD/XXXX"
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#0070af]/10 focus:border-[#0070af] transition-all font-bold placeholder:text-slate-400"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-2">Ulice a č.p. *</label>
                      <input
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#0070af]/10 focus:border-[#0070af] transition-all font-bold"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-2">Město a PSČ *</label>
                      <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-[#0070af]/10 focus:border-[#0070af] transition-all font-bold"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Guardian Information */}
                <div className="space-y-10">
                  <div className="flex items-center gap-4">
                     <span className="text-xs font-black text-[#0070af] bg-[#0070af]/10 px-3 py-1 rounded-lg uppercase tracking-widest">Sekce 02</span>
                     <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest">Zákonný zástupce</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-2">Jméno a příjmení *</label>
                      <input
                        type="text"
                        name="guardianName"
                        value={formData.guardianName}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-[#0070af]/10 focus:border-[#0070af] transition-all font-bold placeholder:text-slate-400"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-2">Mobilní telefon *</label>
                      <input
                        type="tel"
                        name="guardianPhone"
                        value={formData.guardianPhone}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-[#0070af]/10 focus:border-[#0070af] transition-all font-bold placeholder:text-slate-400"
                        required
                      />
                    </div>

                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-2">Email pro komunikaci *</label>
                      <input
                        type="email"
                        name="guardianEmail"
                        value={formData.guardianEmail}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-[#0070af]/10 focus:border-[#0070af] transition-all font-bold placeholder:text-slate-400"
                        required
                      />
                    </div>

                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-2">Jiná adresa (pokud se liší)</label>
                      <input
                        type="text"
                        name="guardianAddress"
                        value={formData.guardianAddress}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-[#0070af]/10 focus:border-[#0070af] transition-all font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Second Contact */}
                <div className="space-y-10">
                  <div className="flex items-center gap-4">
                     <span className="text-xs font-black text-[#0070af] bg-[#0070af]/10 px-3 py-1 rounded-lg uppercase tracking-widest">Sekce 03</span>
                     <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest">Náhradní kontakt</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-2">Jméno a příjmení *</label>
                      <input
                        type="text"
                        name="secondContactName"
                        value={formData.secondContactName}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-[#0070af]/10 focus:border-[#0070af] transition-all font-bold placeholder:text-slate-400"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-2">Telefon *</label>
                      <input
                        type="tel"
                        name="secondContactPhone"
                        value={formData.secondContactPhone}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-[#0070af]/10 focus:border-[#0070af] transition-all font-bold placeholder:text-slate-400"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-slate-50 rounded-[2.5rem] p-10 md:p-12 border border-slate-100 flex flex-col md:flex-row gap-10 items-center">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-[#0070af] shadow-xl shadow-slate-200 flex-shrink-0">
                     <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight uppercase tracking-widest">Potřebujete poradit?</h3>
                    <p className="text-slate-700 font-bold mb-4">Neváhejte se na nás obrátit s jakýmkoliv dotazem ohledně tábora.</p>
                    <div className="flex flex-wrap gap-8 text-sm">
                       <a href={`mailto:${siteData.contact.email}`} className="text-[#0070af] font-black uppercase tracking-widest flex items-center gap-2 hover:underline">
                          <span className="opacity-50">@</span> {siteData.contact.email}
                       </a>
                       <a href={`tel:${siteData.contact.phone}`} className="text-[#0070af] font-black uppercase tracking-widest flex items-center gap-2 hover:underline">
                          <svg className="w-4 h-4 opacity-50" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                          {siteData.contact.phone}
                       </a>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center pt-8">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-16 py-8 bg-green-600 hover:bg-green-700 text-white text-xl font-black rounded-[2.5rem] transition-all shadow-2xl shadow-green-900/20 active:scale-95 disabled:bg-slate-400 disabled:shadow-none uppercase tracking-widest"
                  >
                    {isSubmitting ? 'ODESÍLÁNÍ...' : 'ODESLAT PŘIHLÁŠKU'}
                  </button>
                  <p className="mt-8 text-xs text-slate-600 font-black uppercase tracking-widest">
                    Pole označená hvězdičkou (*) jsou povinná pro úspěšné odeslání
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}