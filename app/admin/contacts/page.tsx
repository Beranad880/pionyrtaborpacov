'use client';

import { useState, useEffect } from 'react';
import { siteData } from '@/data/content';

interface Statistics {
  ageGroups: { range: string; count: number }[];
  total: number;
  councilMembers: number;
  leadershipMembers: number;
  krpDelegates: number;
  foundedGroups: number;
}

interface ContactData {
  contact: {
    address: string;
    bankAccount: string;
    ico: string;
    dic: string;
  };
  leadership: {
    leader: string;
    treasurer: string;
    auditor: string;
    delegates: string[];
  };
  statistics: Statistics;
}

export default function ContactsAdminPage() {
  const [data, setData] = useState<ContactData>(siteData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/content?page=siteData');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setData(result.data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page: 'siteData',
          data: data,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setMessage('Data byla úspěšně uložena!');
      } else {
        setMessage('Chyba při ukládání dat');
      }
    } catch (error) {
      setMessage('Chyba při komunikaci se serverem');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
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
    const newDelegates = [...data.leadership.delegates];
    newDelegates[index] = value;
    updateLeadership('delegates', newDelegates);
  };

  const addDelegate = () => {
    updateLeadership('delegates', [...data.leadership.delegates, '']);
  };

  const removeDelegate = (index: number) => {
    const newDelegates = data.leadership.delegates.filter((_, i) => i !== index);
    updateLeadership('delegates', newDelegates);
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

  const updateAgeGroup = (index: number, field: 'range' | 'count', value: string | number) => {
    const newAgeGroups = [...data.statistics.ageGroups];
    newAgeGroups[index] = {
      ...newAgeGroups[index],
      [field]: value
    };
    setData(prev => ({
      ...prev,
      statistics: {
        ...prev.statistics,
        ageGroups: newAgeGroups
      }
    }));
  };

  const addAgeGroup = () => {
    setData(prev => ({
      ...prev,
      statistics: {
        ...prev.statistics,
        ageGroups: [...prev.statistics.ageGroups, { range: '', count: 0 }]
      }
    }));
  };

  const removeAgeGroup = (index: number) => {
    const newAgeGroups = data.statistics.ageGroups.filter((_, i) => i !== index);
    setData(prev => ({
      ...prev,
      statistics: {
        ...prev.statistics,
        ageGroups: newAgeGroups
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Kontakty a statistiky</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          {saving ? 'Ukládám...' : 'Uložit změny'}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.includes('úspěšně') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message}
        </div>
      )}

      {/* Contact Information */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Kontaktní údaje</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Adresa
            </label>
            <textarea
              value={data.contact.address}
              onChange={(e) => updateContact('address', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Číslo účtu
            </label>
            <input
              type="text"
              value={data.contact.bankAccount}
              onChange={(e) => updateContact('bankAccount', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              IČ
            </label>
            <input
              type="text"
              value={data.contact.ico}
              onChange={(e) => updateContact('ico', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              DIČ
            </label>
            <input
              type="text"
              value={data.contact.dic}
              onChange={(e) => updateContact('dic', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>
      </div>

      {/* Leadership */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Vedení skupiny</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Vedoucí PS
            </label>
            <input
              type="text"
              value={data.leadership.leader}
              onChange={(e) => updateLeadership('leader', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Hospodář PS
            </label>
            <input
              type="text"
              value={data.leadership.treasurer}
              onChange={(e) => updateLeadership('treasurer', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Revizor PS
            </label>
            <input
              type="text"
              value={data.leadership.auditor}
              onChange={(e) => updateLeadership('auditor', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-slate-700">
              Delegáti PS – členové KRP
            </label>
            <button
              onClick={addDelegate}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Přidat
            </button>
          </div>
          <div className="space-y-2">
            {data.leadership.delegates.map((delegate, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={delegate}
                  onChange={(e) => updateDelegate(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  placeholder={`Delegát ${index + 1}`}
                />
                <button
                  onClick={() => removeDelegate(index)}
                  className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Statistiky</h2>

        {/* Age Groups */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-slate-700">Věkové skupiny</h3>
            <button
              onClick={addAgeGroup}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Přidat skupinu
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.statistics.ageGroups.map((group, index) => (
              <div key={index} className="border border-slate-200 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Skupina {index + 1}</span>
                  <button
                    onClick={() => removeAgeGroup(index)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    ×
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Věkové rozpětí (např. 6-10 let)"
                  value={group.range}
                  onChange={(e) => updateAgeGroup(index, 'range', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded mb-2 focus:ring-red-500 focus:border-red-500"
                />
                <input
                  type="number"
                  placeholder="Počet"
                  value={group.count}
                  onChange={(e) => updateAgeGroup(index, 'count', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-red-500 focus:border-red-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Other Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Celkem členů
            </label>
            <input
              type="number"
              value={data.statistics.total}
              onChange={(e) => updateStatistics('total', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Členů rady PS
            </label>
            <input
              type="number"
              value={data.statistics.councilMembers}
              onChange={(e) => updateStatistics('councilMembers', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Členů vedení PS
            </label>
            <input
              type="number"
              value={data.statistics.leadershipMembers}
              onChange={(e) => updateStatistics('leadershipMembers', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Delegátů do KRP
            </label>
            <input
              type="number"
              value={data.statistics.krpDelegates}
              onChange={(e) => updateStatistics('krpDelegates', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Založených oddílů
            </label>
            <input
              type="number"
              value={data.statistics.foundedGroups}
              onChange={(e) => updateStatistics('foundedGroups', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}