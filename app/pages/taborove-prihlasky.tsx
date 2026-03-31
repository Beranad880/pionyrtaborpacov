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
      <div className="bg-gradient-to-b from-green-50 to-blue-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-green-600 text-6xl mb-4">✓</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Přihláška byla úspěšně odeslána!</h1>
            <p className="text-gray-600 mb-6">
              Děkujeme za zájem o náš letní tábor. Vaši přihlášku jsme obdrželi a brzy se vám ozveme s dalšími informacemi.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Co bude následovat?</h3>
              <ul className="text-blue-800 text-left space-y-1">
                <li>• Přihlášku zpracujeme do 3 pracovních dnů</li>
                <li>• Pošleme vám potvrzení na email</li>
                <li>• Zašleme pokyny k platbě zálohy</li>
                <li>• Před táborem obdržíte všechny potřebné informace</li>
              </ul>
            </div>
            <button
              onClick={() => setSubmitStatus('idle')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Podat další přihlášku
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-green-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <h1 className="text-4xl font-bold text-center mb-4 text-gray-900">
            Přihláška na letní dětský tábor
          </h1>
          <p className="text-center text-gray-600 text-lg">
            Připojte se k nám na nezapomenutelné prázdninové dobrodružství!
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Camp Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Informace o táboře</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-blue-600">Téma tábora</h3>
                  <p className="text-gray-700">{campInfo.theme}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-blue-600">Termín</h3>
                  <p className="text-gray-700">{campInfo.dates}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-blue-600">Místo konání</h3>
                  <p className="text-gray-700">{campInfo.location}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-blue-600">Věk účastníků</h3>
                  <p className="text-gray-700">{campInfo.ageRange}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-blue-600">Kapacita</h3>
                  <p className="text-gray-700">{campInfo.capacity} dětí</p>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-green-600 text-lg">Cena tábora</h3>
                  <p className="text-2xl font-bold text-green-700">{campInfo.price.toLocaleString()} Kč</p>
                  <p className="text-sm text-gray-600">Zahrnuje ubytování, stravu a program</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Co s sebou?</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Oblečení na 10 dní</li>
                  <li>• Pevnou obuv na turistiku</li>
                  <li>• Plavky a ručník</li>
                  <li>• Osobní hygienické potřeby</li>
                  <li>• Detailní seznam zašleme později</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Přihláška</h2>

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Participant Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Údaje o účastníkovi</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Jméno a příjmení *
                      </label>
                      <input
                        type="text"
                        name="participantName"
                        value={formData.participantName}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Třída *
                      </label>
                      <select
                        name="grade"
                        value={formData.grade}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Vyberte třídu</option>
                        {gradeOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Datum narození *
                      </label>
                      <input
                        type="text"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        placeholder="DD.MM.YYYY"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rodné číslo *
                      </label>
                      <input
                        type="text"
                        name="birthNumber"
                        value={formData.birthNumber}
                        onChange={handleInputChange}
                        placeholder="YYMMDD/XXXX (např. 101215/1234)"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Formát: RRMMDD/XXXX (rok, měsíc, den narození + 4 číslice)
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ulice a číslo popisné *
                      </label>
                      <input
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Město a PSČ *
                      </label>
                      <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Guardian Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Zákonný zástupce</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Jméno a příjmení *
                      </label>
                      <input
                        type="text"
                        name="guardianName"
                        value={formData.guardianName}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefon *
                      </label>
                      <input
                        type="tel"
                        name="guardianPhone"
                        value={formData.guardianPhone}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="guardianEmail"
                        value={formData.guardianEmail}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Jiná adresa (pokud se liší od adresy účastníka)
                      </label>
                      <input
                        type="text"
                        name="guardianAddress"
                        value={formData.guardianAddress}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Second Contact */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Druhý kontakt (v případě nedostupnosti zákonného zástupce)</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Jméno a příjmení *
                      </label>
                      <input
                        type="text"
                        name="secondContactName"
                        value={formData.secondContactName}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefon *
                      </label>
                      <input
                        type="tel"
                        name="secondContactPhone"
                        value={formData.secondContactPhone}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="secondContactEmail"
                        value={formData.secondContactEmail}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Jiná adresa
                      </label>
                      <input
                        type="text"
                        name="secondContactAddress"
                        value={formData.secondContactAddress}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Kontakt pro dotazy</h3>
                  <p className="text-gray-600">
                    Pokud máte jakékoli dotazy ohledně tábora nebo přihlášky, neváhejte nás kontaktovat:
                  </p>
                  <div className="mt-2 text-sm text-gray-700">
                    <p>Email: <a href={`mailto:${siteData.contact.email}`} className="text-blue-600 hover:underline">{siteData.contact.email}</a></p>
                    <p>Telefon: <a href={`tel:${siteData.contact.phone}`} className="text-blue-600 hover:underline">{siteData.contact.phone}</a></p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Odesílání...' : 'Odeslat přihlášku'}
                  </button>
                  <p className="mt-3 text-sm text-gray-600">
                    Pole označená hvězdičkou (*) jsou povinná
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