'use client';

import { useState } from 'react';
import RentalCalendar from '@/components/RentalCalendar';

interface RentalFormData {
  name: string;
  email: string;
  phone: string;
  organization?: string;
  startDate: string;
  endDate: string;
  guestCount: number;
  purpose: string;
  facilities: string[];
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

export default function PronajemHajenkybePage() {
  const [formData, setFormData] = useState<RentalFormData>({
    name: '',
    email: '',
    phone: '',
    organization: '',
    startDate: '',
    endDate: '',
    guestCount: 1,
    purpose: '',
    facilities: [],
    message: '',
    agreeTerms: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    const dailyRate = days >= 7 ? 1200 : 1500; // Weekly vs weekend rate
    const total = days * dailyRate;

    return total;
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

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  Žádost byla úspěšně odeslána!
                </h2>
                <p className="text-slate-600 mb-6">
                  Vaše žádost o pronájem Hájenky Bělá byla přijata. Budeme vás brzy kontaktovat.
                </p>
                <div className="space-y-3">
                  <p className="text-sm text-slate-500">
                    <strong>Další kroky:</strong>
                  </p>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Prověříme dostupnost termínu</li>
                    <li>• Kontaktujeme vás s potvrzením</li>
                    <li>• Pošleme smlouvu a platební údaje</li>
                    <li>• Po složení zálohy bude rezervace potvrzena</li>
                  </ul>
                </div>
                <div className="mt-6 space-x-4">
                  <a
                    href="/pages?page=hajenka-bela"
                    className="inline-flex items-center px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    Více o hájence
                  </a>
                  <a
                    href="/"
                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Zpět na hlavní stránku
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const estimatedPrice = calculateEstimatedPrice();
  const days = formData.startDate && formData.endDate ?
    Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-800 mb-4">
                Žádost o pronájem Hájenky Bělá
              </h1>
              <p className="text-lg text-slate-600">
                Vyplňte formulář pro rezervaci
              </p>
            </div>

            {/* Availability Calendar */}
            <RentalCalendar className="mb-8" />

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4">
                  Kontaktní údaje
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-red-500 focus:border-red-500"
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
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                      placeholder="jan.novak@email.cz"
                    />
                  </div>
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
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                      placeholder="+420 123 456 789"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Organizace / Spolek
                    </label>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                      placeholder="Skautský oddíl, Škola, Firma..."
                    />
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4">
                  Podrobnosti o pobytu
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Datum příjezdu *
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Datum odjezdu *
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Počet hostů * (max. 35)
                    </label>
                    <input
                      type="number"
                      name="guestCount"
                      value={formData.guestCount}
                      onChange={handleInputChange}
                      required
                      min="1"
                      max="35"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Účel pobytu *
                  </label>
                  <select
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">Vyberte účel pobytu</option>
                    {purposeOptions.map(purpose => (
                      <option key={purpose} value={purpose}>{purpose}</option>
                    ))}
                  </select>
                </div>

                {days > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Délka pobytu:</span>
                        <p>{days} {days === 1 ? 'den' : days < 5 ? 'dny' : 'dní'}</p>
                      </div>
                      <div>
                        <span className="font-medium">Počet hostů:</span>
                        <p>{formData.guestCount}</p>
                      </div>
                      <div>
                        <span className="font-medium">Cena za den:</span>
                        <p>{days >= 7 ? '1 200' : '1 500'} Kč</p>
                      </div>
                      <div>
                        <span className="font-medium">Základní cena:</span>
                        <p className="font-bold text-blue-600">{estimatedPrice.toLocaleString()} Kč</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Message */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4">
                  Dodatečné informace
                </h2>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  placeholder="Jakékoliv speciální požadavky, dotazy nebo poznámky k rezervaci..."
                />
              </div>

              {/* Price Summary */}
              {estimatedPrice > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-slate-800 mb-4">
                    Orientační cena
                  </h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Základní pronájem ({days} {days < 5 ? 'dny' : 'dní'} × {days >= 7 ? '1 200' : '1 500'} Kč)</span>
                      <span>{(days * (days >= 7 ? 1200 : 1500)).toLocaleString()} Kč</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Celkem</span>
                      <span className="text-green-600">{estimatedPrice.toLocaleString()} Kč</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      * Orientační cena bez energií. Záloha 30% z celkové ceny.
                    </p>
                  </div>
                </div>
              )}

              {/* Terms */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    id="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    required
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-slate-300 rounded mt-1"
                  />
                  <label htmlFor="agreeTerms" className="ml-3 text-sm text-slate-700">
                    <span className="font-medium">Souhlasím s podmínkami pronájmu</span> *
                    <br />
                    <span className="text-xs text-slate-500">
                      Včetně úhrad za energie, úklid a případné škody podle ceníku.
                    </span>
                  </label>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.agreeTerms}
                  className="px-8 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Odesílám...' : 'Odeslat žádost'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}