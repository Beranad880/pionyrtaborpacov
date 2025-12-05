'use client';

import React, { useState } from 'react';

interface RentalFormData {
  name: string;
  email: string;
  phone: string;
  organization: string;
  startDate: string;
  endDate: string;
  guestCount: number;
  purpose: string;
  facilities: string[];
  message: string;
  agreeTerms: boolean;
}

const facilityOptions = [
  { id: 'kitchen', name: 'Plně vybavená kuchyně', price: 0 },
  { id: 'wifi', name: 'Wi-Fi připojení', price: 50 },
  { id: 'fireplace', name: 'Krb a společenská místnost', price: 0 },
  { id: 'parking', name: 'Parkování', price: 0 },
  { id: 'heating', name: 'Topení', price: 100 },
  { id: 'electricity', name: 'Elektřina', price: 0 },
  { id: 'water', name: 'Teplá voda', price: 0 },
  { id: 'outdoor_grill', name: 'Venkovní gril', price: 50 },
  { id: 'sports_equipment', name: 'Sportovní vybavení', price: 100 }
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
  const [submitMessage, setSubmitMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculateDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const calculatePrice = () => {
    const days = calculateDays();
    const basePrice = days > 7 ? 1200 : 1500; // Týdenní vs víkendový tarif
    const facilitiesPrice = formData.facilities.reduce((total, facilityId) => {
      const facility = facilityOptions.find(f => f.id === facilityId);
      return total + (facility ? facility.price : 0);
    }, 0);

    return (basePrice * days) + facilitiesPrice;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Jméno je povinné';
    if (!formData.email.trim()) newErrors.email = 'Email je povinný';
    if (!formData.phone.trim()) newErrors.phone = 'Telefon je povinný';
    if (!formData.startDate) newErrors.startDate = 'Datum příjezdu je povinné';
    if (!formData.endDate) newErrors.endDate = 'Datum odjezdu je povinné';
    if (formData.guestCount < 1) newErrors.guestCount = 'Počet hostů musí být alespoň 1';
    if (!formData.purpose.trim()) newErrors.purpose = 'Účel pobytu je povinný';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'Musíte souhlasit s podmínkami';

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start >= end) {
        newErrors.endDate = 'Datum odjezdu musí být po datu příjezdu';
      }
      if (start < new Date()) {
        newErrors.startDate = 'Datum příjezdu nemůže být v minulosti';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setSubmitMessage('Opravte prosím chyby ve formuláři');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/admin/rental-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitMessage('Žádost byla úspěšně odeslána! Budeme Vás kontaktovat do 48 hodin.');
        setFormData({
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
      } else {
        setSubmitMessage(result.message || 'Chyba při odesílání žádosti');
      }
    } catch (error) {
      setSubmitMessage('Chyba při odesílání žádosti. Zkuste to prosím znovu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFacilityChange = (facilityId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      facilities: checked
        ? [...prev.facilities, facilityId]
        : prev.facilities.filter(id => id !== facilityId)
    }));
  };
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Pronájem Hájenky Bělá</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Information Section */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Kapacita a vybavení</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span><strong>Ubytování:</strong> až 35 osob v pokojích</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span><strong>Kuchyně:</strong> plně vybavená pro větší skupiny</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span><strong>Jídelna:</strong> prostorná pro celou skupinu</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span><strong>Sociální zařízení:</strong> sprchy a toalety</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span><strong>Klubovna:</strong> pro společné aktivity</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span><strong>Venkovní prostory:</strong> ohniště, sportoviště</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Cenník</h2>
            <div className="space-y-4">
              <div className="border-b pb-3">
                <p className="font-semibold">Víkendový pobyt (2-7 dní)</p>
                <p className="text-lg text-red-600 font-semibold">1 500 Kč / den</p>
                <p className="text-sm text-gray-600">za celý objekt</p>
              </div>
              <div className="border-b pb-3">
                <p className="font-semibold">Týdenní pobyt (8+ dní)</p>
                <p className="text-lg text-red-600 font-semibold">1 200 Kč / den</p>
                <p className="text-sm text-gray-600">za celý objekt</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">Kontakt</h2>
            <div className="space-y-2">
              <p><strong>Mgr. Ladislav Mareš</strong></p>
              <p><strong>Email:</strong> mareseznam@seznam.cz</p>
              <p><strong>Telefon:</strong> +420 607 244 526</p>
            </div>
          </div>
        </div>

        {/* Reservation Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6">Rezervační formulář</h2>

          {submitMessage && (
            <div className={`mb-6 p-4 rounded-lg ${
              submitMessage.includes('úspěšně')
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {submitMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jméno a příjmení *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Vaše jméno"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="vas@email.cz"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="+420 123 456 789"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organizace (nepovinné)
                </label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Název organizace"
                />
              </div>
            </div>

            {/* Stay Information */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Datum příjezdu *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                    errors.startDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Datum odjezdu *
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                    errors.endDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Počet hostů *
                </label>
                <input
                  type="number"
                  name="guestCount"
                  value={formData.guestCount}
                  onChange={handleInputChange}
                  min="1"
                  max="35"
                  className={`w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                    errors.guestCount ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.guestCount && <p className="mt-1 text-sm text-red-600">{errors.guestCount}</p>}
              </div>
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Účel pobytu *
              </label>
              <input
                type="text"
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                  errors.purpose ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Letní tábor, víkendový pobyt, školení..."
              />
              {errors.purpose && <p className="mt-1 text-sm text-red-600">{errors.purpose}</p>}
            </div>

            {/* Facilities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Požadované vybavení
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                {facilityOptions.map((facility) => (
                  <label key={facility.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.facilities.includes(facility.id)}
                      onChange={(e) => handleFacilityChange(facility.id, e.target.checked)}
                      className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">{facility.name}</span>
                      {facility.price > 0 && (
                        <span className="text-sm text-gray-600 block">+{facility.price} Kč</span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zpráva (nepovinné)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Další informace nebo požadavky..."
              />
            </div>

            {/* Price Calculation */}
            {formData.startDate && formData.endDate && calculateDays() > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-2">Předběžná kalkulace ceny</h4>
                <div className="space-y-1 text-sm text-gray-700">
                  <p>Počet dní: {calculateDays()}</p>
                  <p>Základní cena: {(calculateDays() > 7 ? 1200 : 1500) * calculateDays()} Kč</p>
                  {formData.facilities.length > 0 && (
                    <p>Příplatky za vybavení: {formData.facilities.reduce((total, facilityId) => {
                      const facility = facilityOptions.find(f => f.id === facilityId);
                      return total + (facility ? facility.price : 0);
                    }, 0)} Kč</p>
                  )}
                  <p className="font-semibold text-lg text-blue-700">
                    Celkem: {calculatePrice()} Kč
                  </p>
                  <p className="text-xs text-gray-600">
                    * Orientační cena, finální cena bude upřesněna při potvrzení rezervace
                  </p>
                </div>
              </div>
            )}

            {/* Terms */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                className={`mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ${
                  errors.agreeTerms ? 'border-red-300' : ''
                }`}
              />
              <div>
                <label className="text-sm text-gray-700">
                  Souhlasím s podmínkami pronájmu a zpracováním osobních údajů *
                </label>
                {errors.agreeTerms && <p className="mt-1 text-sm text-red-600">{errors.agreeTerms}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Odesílání...' : 'Odeslat žádost o rezervaci'}
            </button>

            <p className="text-sm text-gray-600 text-center">
              Po odeslání žádosti Vás budeme kontaktovat do 48 hodin s potvrzením rezervace.
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}