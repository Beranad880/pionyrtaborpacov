'use client';

import { useState } from 'react';
import { allPagesContent } from '@/data/content';

export default function HomeAdminPage() {
  const [homeContent, setHomeContent] = useState(allPagesContent.home);
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
          page: 'home',
          content: homeContent,
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

  const updateHeroContent = (field: string, value: string) => {
    setHomeContent(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: value
      }
    }));
  };

  const updateAboutContent = (index: number, value: string) => {
    setHomeContent(prev => ({
      ...prev,
      about: {
        ...prev.about,
        content: prev.about.content.map((item, i) => i === index ? value : item)
      }
    }));
  };

  const updateAboutField = (field: string, value: string) => {
    setHomeContent(prev => ({
      ...prev,
      about: {
        ...prev.about,
        [field]: value
      }
    }));
  };

  const updatePioneerField = (field: string, value: string) => {
    setHomeContent(prev => ({
      ...prev,
      pioneer: {
        ...prev.pioneer,
        [field]: value
      }
    }));
  };

  const updatePioneerIdeals = (field: string, value: any) => {
    setHomeContent(prev => ({
      ...prev,
      pioneer: {
        ...prev.pioneer,
        ideals: {
          ...prev.pioneer.ideals,
          [field]: value
        }
      }
    }));
  };

  const updatePioneerIdealsContent = (index: number, value: string) => {
    setHomeContent(prev => ({
      ...prev,
      pioneer: {
        ...prev.pioneer,
        ideals: {
          ...prev.pioneer.ideals,
          content: prev.pioneer.ideals.content.map((item, i) => i === index ? value : item)
        }
      }
    }));
  };

  const updateHistoryContent = (field: string, value: string) => {
    setHomeContent(prev => ({
      ...prev,
      history: {
        ...prev.history,
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Úvodní stránka</h1>
          <p className="text-slate-600">Editace obsahu hlavní stránky webu</p>
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

      {/* Hero Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Hero sekce</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Hlavní nadpis
            </label>
            <input
              type="text"
              value={homeContent.hero.title}
              onChange={(e) => updateHeroContent('title', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Podnadpis
            </label>
            <input
              type="text"
              value={homeContent.hero.subtitle}
              onChange={(e) => updateHeroContent('subtitle', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Obrázek na pozadí (cesta k souboru)
            </label>
            <input
              type="text"
              value={homeContent.hero.backgroundImage}
              onChange={(e) => updateHeroContent('backgroundImage', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Sekce "O nás"</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nadpis sekce
            </label>
            <input
              type="text"
              value={homeContent.about.title}
              onChange={(e) => updateAboutField('title', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Hlavní citát
            </label>
            <textarea
              value={homeContent.about.subtitle}
              onChange={(e) => updateAboutField('subtitle', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Odstavce textu
            </label>
            {homeContent.about.content.map((paragraph, index) => (
              <div key={index} className="mb-3">
                <label className="block text-xs text-slate-500 mb-1">
                  Odstavec {index + 1}
                </label>
                <textarea
                  value={paragraph}
                  onChange={(e) => updateAboutContent(index, e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pioneer Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Sekce "Pionýr"</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Popis Pionýra
            </label>
            <textarea
              value={homeContent.pioneer.description}
              onChange={(e) => updatePioneerField('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nadpis ideálů
            </label>
            <input
              type="text"
              value={homeContent.pioneer.ideals.title}
              onChange={(e) => updatePioneerIdeals('title', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Popis ideálů
            </label>
            <textarea
              value={homeContent.pioneer.ideals.description}
              onChange={(e) => updatePioneerIdeals('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Obsah ideálů
            </label>
            {homeContent.pioneer.ideals.content.map((paragraph, index) => (
              <div key={index} className="mb-3">
                <label className="block text-xs text-slate-500 mb-1">
                  Odstavec {index + 1}
                </label>
                <textarea
                  value={paragraph}
                  onChange={(e) => updatePioneerIdealsContent(index, e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* History Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Sekce "Historie"</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nadpis
            </label>
            <input
              type="text"
              value={homeContent.history.title}
              onChange={(e) => updateHistoryContent('title', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Obsah
            </label>
            <textarea
              value={homeContent.history.content}
              onChange={(e) => updateHistoryContent('content', e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}