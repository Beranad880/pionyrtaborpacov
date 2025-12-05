'use client';

import { useState } from 'react';
import { allPagesContent } from '@/data/content';

export default function HajenkaBelaAdminPage() {
  const [content, setContent] = useState(allPagesContent.hajenkaBela);
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
          page: 'hajenkaBela',
          content: content,
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

  const updateBasicField = (field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateListItem = (list: string, index: number, value: string) => {
    setContent(prev => ({
      ...prev,
      [list]: (prev as any)[list].map((item: string, i: number) =>
        i === index ? value : item
      )
    }));
  };

  const addListItem = (list: string) => {
    setContent(prev => ({
      ...prev,
      [list]: [...(prev as any)[list], 'Nová položka']
    }));
  };

  const removeListItem = (list: string, index: number) => {
    setContent(prev => ({
      ...prev,
      [list]: (prev as any)[list].filter((_: any, i: number) => i !== index)
    }));
  };

  const updateLocation = (field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Hájenka Bělá</h1>
          <p className="text-slate-600">Informace o táborové základně</p>
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

      {/* Basic Info */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Základní informace</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nadpis stránky
            </label>
            <input
              type="text"
              value={content.title}
              onChange={(e) => updateBasicField('title', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Hlavní popis
            </label>
            <textarea
              value={content.description}
              onChange={(e) => updateBasicField('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Detailní informace
            </label>
            <textarea
              value={content.details}
              onChange={(e) => updateBasicField('details', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>
      </div>

      {/* Equipment */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Vybavení</h2>
          <button
            onClick={() => addListItem('equipment')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            + Přidat položku
          </button>
        </div>

        <div className="space-y-3">
          {content.equipment.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <span className="text-slate-400 text-sm w-8">•</span>
              <input
                type="text"
                value={item}
                onChange={(e) => updateListItem('equipment', index, e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              <button
                onClick={() => removeListItem('equipment', index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Activities */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Aktivity</h2>
          <button
            onClick={() => addListItem('activities')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            + Přidat aktivitu
          </button>
        </div>

        <div className="space-y-3">
          {content.activities.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <span className="text-slate-400 text-sm w-8">•</span>
              <input
                type="text"
                value={item}
                onChange={(e) => updateListItem('activities', index, e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              <button
                onClick={() => removeListItem('activities', index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Poloha a dostupnost</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nadpis sekce
            </label>
            <input
              type="text"
              value={content.location.title}
              onChange={(e) => updateLocation('title', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Popis lokace
            </label>
            <textarea
              value={content.location.description}
              onChange={(e) => updateLocation('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                GPS souřadnice
              </label>
              <input
                type="text"
                value={content.location.gps}
                onChange={(e) => updateLocation('gps', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nejbližší město
              </label>
              <input
                type="text"
                value={content.location.nearestTown}
                onChange={(e) => updateLocation('nearestTown', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}