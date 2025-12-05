'use client';

import { useState } from 'react';
import { siteData } from '@/data/content';

export default function ContactsAdminPage() {
  const [data, setData] = useState(siteData);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page: 'siteData',
          content: data,
        }),
      });

      if (response.ok) {
        setMessage('Obsah byl úspěšně uložen!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Chyba při ukládání obsahu.');
      }
    } catch (error) {
      setMessage('Chyba při ukládání obsahu.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateBasicInfo = (field: string, value: string) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateContact = (field: string, value: string) => {
    setData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value
      }
    }));
  };

  const updateSocial = (field: string, value: string) => {
    setData(prev => ({
      ...prev,
      social: {
        ...prev.social,
        [field]: value
      }
    }));
  };

  const updateLeadership = (field: string, value: string | string[]) => {
    setData(prev => ({
      ...prev,
      leadership: {
        ...prev.leadership,
        [field]: value
      }
    }));
  };

  const updateDelegate = (index: number, value: string) => {
    setData(prev => ({
      ...prev,
      leadership: {
        ...prev.leadership,
        delegates: prev.leadership.delegates.map((delegate, i) =>
          i === index ? value : delegate
        )
      }
    }));
  };

  const addDelegate = () => {
    setData(prev => ({
      ...prev,
      leadership: {
        ...prev.leadership,
        delegates: [...prev.leadership.delegates, 'Nový delegát']
      }
    }));
  };

  const removeDelegate = (index: number) => {
    setData(prev => ({
      ...prev,
      leadership: {
        ...prev.leadership,
        delegates: prev.leadership.delegates.filter((_, i) => i !== index)
      }
    }));
  };

  const updateStatistics = (field: string, value: number) => {
    setData(prev => ({
      ...prev,
      statistics: {
        ...prev.statistics,
        [field]: value
      }
    }));
  };

  const updateAgeGroup = (index: number, field: string, value: string | number) => {
    setData(prev => ({
      ...prev,
      statistics: {
        ...prev.statistics,
        ageGroups: prev.statistics.ageGroups.map((group, i) =>
          i === index ? { ...group, [field]: value } : group
        )
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Kontakty a statistiky</h1>
          <p className="text-slate-600">Správa kontaktních údajů a členských statistik</p>
        </div>

        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'Ukládám...' : 'Uložit změny'}
        </button>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`p-4 rounded-lg ${message.includes('úspěšně') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message}
        </div>
      )}

      {/* Basic Site Info */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Základní informace webu</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Název organizace
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => updateBasicInfo('title', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Popis organizace
            </label>
            <textarea
              value={data.description}
              onChange={(e) => updateBasicInfo('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Kontaktní informace</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={data.contact.email}
              onChange={(e) => updateContact('email', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Telefon
            </label>
            <input
              type="tel"
              value={data.contact.phone}
              onChange={(e) => updateContact('phone', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Adresa
            </label>
            <input
              type="text"
              value={data.contact.address}
              onChange={(e) => updateContact('address', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Číslo účtu
            </label>
            <input
              type="text"
              value={data.contact.bankAccount}
              onChange={(e) => updateContact('bankAccount', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              IČ
            </label>
            <input
              type="text"
              value={data.contact.ico}
              onChange={(e) => updateContact('ico', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              DIČ
            </label>
            <input
              type="text"
              value={data.contact.dic}
              onChange={(e) => updateContact('dic', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Sociální sítě</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Facebook
            </label>
            <input
              type="url"
              value={data.social.facebook}
              onChange={(e) => updateSocial('facebook', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Instagram
            </label>
            <input
              type="url"
              value={data.social.instagram}
              onChange={(e) => updateSocial('instagram', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>
      </div>

      {/* Leadership */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Vedení skupiny</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Vedoucí PS
            </label>
            <input
              type="text"
              value={data.leadership.leader}
              onChange={(e) => updateLeadership('leader', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Hospodář PS
            </label>
            <input
              type="text"
              value={data.leadership.treasurer}
              onChange={(e) => updateLeadership('treasurer', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Revizor PS
            </label>
            <input
              type="text"
              value={data.leadership.auditor}
              onChange={(e) => updateLeadership('auditor', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">
                Delegáti PS
              </label>
              <button
                onClick={addDelegate}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                + Přidat
              </button>
            </div>

            <div className="space-y-2">
              {data.leadership.delegates.map((delegate, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={delegate}
                    onChange={(e) => updateDelegate(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  <button
                    onClick={() => removeDelegate(index)}
                    className="px-2 py-2 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Statistiky</h2>

        {/* Age Groups */}
        <div className="mb-6">
          <h3 className="text-md font-medium text-slate-700 mb-3">Věkové složení</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.statistics.ageGroups.map((group, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={group.range}
                  onChange={(e) => updateAgeGroup(index, 'range', e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Věkové rozpětí"
                />
                <input
                  type="number"
                  value={group.count}
                  onChange={(e) => updateAgeGroup(index, 'count', parseInt(e.target.value))}
                  className="w-20 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  min="0"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Other Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Celkem členů
            </label>
            <input
              type="number"
              value={data.statistics.total}
              onChange={(e) => updateStatistics('total', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Členů rady PS
            </label>
            <input
              type="number"
              value={data.statistics.councilMembers}
              onChange={(e) => updateStatistics('councilMembers', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Členů vedení PS
            </label>
            <input
              type="number"
              value={data.statistics.leadershipMembers}
              onChange={(e) => updateStatistics('leadershipMembers', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Delegátů do KRP
            </label>
            <input
              type="number"
              value={data.statistics.krpDelegates}
              onChange={(e) => updateStatistics('krpDelegates', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              min="0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}