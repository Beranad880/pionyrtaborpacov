'use client';

import { useState, useEffect } from 'react';
import { allPagesContent, siteData } from '@/data/content';

export default function HomeAdminPage() {
  const [homeContent, setHomeContent] = useState(allPagesContent.home);
  const [contactData, setContactData] = useState(siteData);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      const response = await fetch('/api/content?page=siteData');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setContactData(result.data);
        }
      }
    } catch (error) {
      console.log('Failed to fetch contact data, using static data');
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Save home content
      const homeResponse = await fetch('/api/admin/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page: 'home',
          content: homeContent,
        }),
      });

      // Save contact data (statistics)
      const contactResponse = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page: 'siteData',
          data: contactData,
        }),
      });

      if (homeResponse.ok && contactResponse.ok) {
        setMessage('Obsah i statistiky byly úspěšně uloženy!');
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
    setHomeContent((prev: typeof allPagesContent.home) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: value
      }
    }));
  };

  const updateAboutContent = (index: number, value: string) => {
    setHomeContent((prev: typeof allPagesContent.home) => ({
      ...prev,
      about: {
        ...prev.about,
        content: prev.about.content.map((item: string, i: number) => i === index ? value : item)
      }
    }));
  };

  const updateAboutField = (field: string, value: string) => {
    setHomeContent((prev: typeof allPagesContent.home) => ({
      ...prev,
      about: {
        ...prev.about,
        [field]: value
      }
    }));
  };

  const updatePioneerField = (field: string, value: string) => {
    setHomeContent((prev: typeof allPagesContent.home) => ({
      ...prev,
      pioneer: {
        ...prev.pioneer,
        [field]: value
      }
    }));
  };

  const updatePioneerIdeals = (field: string, value: any) => {
    setHomeContent((prev: typeof allPagesContent.home) => ({
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
    setHomeContent((prev: typeof allPagesContent.home) => ({
      ...prev,
      pioneer: {
        ...prev.pioneer,
        ideals: {
          ...prev.pioneer.ideals,
          content: prev.pioneer.ideals.content.map((item: string, i: number) => i === index ? value : item)
        }
      }
    }));
  };

  const updateHistoryContent = (field: string, value: string) => {
    setHomeContent((prev: typeof allPagesContent.home) => ({
      ...prev,
      history: {
        ...prev.history,
        [field]: value
      }
    }));
  };

  const updateStatistics = (field: string, value: number) => {
    setContactData(prev => ({
      ...prev,
      statistics: {
        ...prev.statistics,
        [field]: value
      }
    }));
  };

  const updateAgeGroup = (index: number, field: 'range' | 'count', value: string | number) => {
    const newAgeGroups = [...contactData.statistics.ageGroups];
    newAgeGroups[index] = {
      ...newAgeGroups[index],
      [field]: value
    };
    setContactData(prev => ({
      ...prev,
      statistics: {
        ...prev.statistics,
        ageGroups: newAgeGroups
      }
    }));
  };

  const addAgeGroup = () => {
    setContactData(prev => ({
      ...prev,
      statistics: {
        ...prev.statistics,
        ageGroups: [...prev.statistics.ageGroups, { range: '', count: 0 }]
      }
    }));
  };

  const removeAgeGroup = (index: number) => {
    const newAgeGroups = contactData.statistics.ageGroups.filter((_, i) => i !== index);
    setContactData(prev => ({
      ...prev,
      statistics: {
        ...prev.statistics,
        ageGroups: newAgeGroups
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

      {/* Section 1 */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Sekce 1</h2>
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
            {homeContent.about.content.map((paragraph: string, index: number) => (
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

      {/* Section 2 */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Sekce 2</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Obecný popis
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
              Nadpis sekce
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
              Popis sekce
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
              Obsah sekce
            </label>
            {homeContent.pioneer.ideals.content.map((paragraph: string, index: number) => (
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

      {/* Section 3 */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Sekce 3</h2>
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

      {/* Statistics Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Statistiky</h2>

        {/* Age Groups */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-slate-700">Věkové skupiny</h3>
            <button
              onClick={addAgeGroup}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
            >
              Přidat skupinu
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contactData.statistics.ageGroups.map((group, index) => (
              <div key={index} className="border border-slate-200 rounded-lg p-4">
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
              value={contactData.statistics.total}
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
              value={contactData.statistics.councilMembers}
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
              value={contactData.statistics.leadershipMembers}
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
              value={contactData.statistics.krpDelegates}
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
              value={contactData.statistics.foundedGroups}
              onChange={(e) => updateStatistics('foundedGroups', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}