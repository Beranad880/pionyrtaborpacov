'use client';

import { useState } from 'react';
import { allPagesContent } from '@/data/content';

export default function PioneerGroupsAdminPage() {
  const [content, setContent] = useState(allPagesContent.pioneerGroups);
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
          page: 'pioneerGroups',
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

  const updateGroup = (index: number, field: string, value: string | string[]) => {
    setContent(prev => ({
      ...prev,
      groups: prev.groups.map((group, i) =>
        i === index ? { ...group, [field]: value } : group
      )
    }));
  };

  const updateGroupActivity = (groupIndex: number, activityIndex: number, value: string) => {
    setContent(prev => ({
      ...prev,
      groups: prev.groups.map((group, i) =>
        i === groupIndex
          ? {
              ...group,
              activities: group.activities.map((activity, j) =>
                j === activityIndex ? value : activity
              )
            }
          : group
      )
    }));
  };

  const addGroupActivity = (groupIndex: number) => {
    setContent(prev => ({
      ...prev,
      groups: prev.groups.map((group, i) =>
        i === groupIndex
          ? { ...group, activities: [...group.activities, 'Nová aktivita'] }
          : group
      )
    }));
  };

  const removeGroupActivity = (groupIndex: number, activityIndex: number) => {
    setContent(prev => ({
      ...prev,
      groups: prev.groups.map((group, i) =>
        i === groupIndex
          ? {
              ...group,
              activities: group.activities.filter((_, j) => j !== activityIndex)
            }
          : group
      )
    }));
  };

  const updateJoinInfo = (field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      joinInfo: {
        ...prev.joinInfo,
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pionýrské oddíly</h1>
          <p className="text-slate-600">Správa oddílů a jejich popisů</p>
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
              Popis
            </label>
            <textarea
              value={content.description}
              onChange={(e) => updateBasicField('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>
      </div>

      {/* Pioneer Groups */}
      <div className="space-y-6">
        {content.groups.map((group, groupIndex) => (
          <div key={groupIndex} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Oddíl {groupIndex + 1}: {group.name}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Název oddílu
                  </label>
                  <input
                    type="text"
                    value={group.name}
                    onChange={(e) => updateGroup(groupIndex, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Věkové rozpětí
                  </label>
                  <input
                    type="text"
                    value={group.ageRange}
                    onChange={(e) => updateGroup(groupIndex, 'ageRange', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Popis oddílu
                  </label>
                  <textarea
                    value={group.description}
                    onChange={(e) => updateGroup(groupIndex, 'description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Aktivity oddílu
                  </label>
                  <button
                    onClick={() => addGroupActivity(groupIndex)}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    + Přidat
                  </button>
                </div>

                <div className="space-y-2">
                  {group.activities.map((activity, activityIndex) => (
                    <div key={activityIndex} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={activity}
                        onChange={(e) => updateGroupActivity(groupIndex, activityIndex, e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                      <button
                        onClick={() => removeGroupActivity(groupIndex, activityIndex)}
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
        ))}
      </div>

      {/* Join Info */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Informace o zapojení</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nadpis sekce
            </label>
            <input
              type="text"
              value={content.joinInfo.title}
              onChange={(e) => updateJoinInfo('title', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Popis
            </label>
            <textarea
              value={content.joinInfo.description}
              onChange={(e) => updateJoinInfo('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}