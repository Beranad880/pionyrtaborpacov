'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const adminCards = [
  {
    title: 'Úvodní stránka',
    description: 'Editace hero sekce, o nás a historie',
    href: '/admin/home',
    icon: '🏠',
    color: 'bg-blue-50 border-blue-200 text-blue-700'
  },
  {
    title: 'Pionýrské oddíly',
    description: 'Správa oddílů a jejich popisů',
    href: '/admin/pioneer-groups',
    icon: '👥',
    color: 'bg-green-50 border-green-200 text-green-700'
  },
  {
    title: 'Hájenka Bělá',
    description: 'Informace o táborové základně',
    href: '/admin/hajenka-bela',
    icon: '🏕️',
    color: 'bg-orange-50 border-orange-200 text-orange-700'
  },
  {
    title: 'Pronájem Hájenky',
    description: 'Ceník a podmínky pronájmu',
    href: '/admin/rental',
    icon: '🏗️',
    color: 'bg-purple-50 border-purple-200 text-purple-700'
  },
  {
    title: 'Kalendář akcí',
    description: 'Správa nadcházejících akcí',
    href: '/admin/calendar',
    icon: '📅',
    color: 'bg-pink-50 border-pink-200 text-pink-700'
  },
  {
    title: 'Články',
    description: 'Správa článků a novinek',
    href: '/admin/articles',
    icon: '📝',
    color: 'bg-indigo-50 border-indigo-200 text-indigo-700'
  },
  {
    title: 'Fotky z akcí',
    description: 'Galerie fotografií',
    href: '/admin/photos',
    icon: '📸',
    color: 'bg-teal-50 border-teal-200 text-teal-700'
  },
  {
    title: 'Kontakty a statistiky',
    description: 'Kontaktní údaje a členské statistiky',
    href: '/admin/contacts',
    icon: '📞',
    color: 'bg-yellow-50 border-yellow-200 text-yellow-700'
  },
  {
    title: 'Žádosti o pronájem',
    description: 'Správa žádostí o pronájem Hájenky Bělá',
    href: '/admin/rental-requests',
    icon: '🏡',
    color: 'bg-red-50 border-red-200 text-red-700'
  },
  {
    title: 'Táborové přihlášky',
    description: 'Správa přihlášek na letní dětský tábor',
    href: '/admin/camp-applications',
    icon: '🏕️',
    color: 'bg-emerald-50 border-emerald-200 text-emerald-700'
  },
];

const recentActivity = [
  {
    action: 'Úprava článku',
    item: 'Letní tábor 2024',
    time: 'před 2 hodinami',
    user: 'Admin'
  },
  {
    action: 'Přidána akce',
    item: 'Vánoční schůzka',
    time: 'včera',
    user: 'Admin'
  },
  {
    action: 'Aktualizace kontaktů',
    item: 'Telefon vedoucího',
    time: 'před 3 dny',
    user: 'Admin'
  }
];

export default function AdminDashboard() {
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const checkDatabaseStatus = async () => {
    try {
      const response = await fetch('/api/admin/init');
      const result = await response.json();
      setDbStatus(result.data);
    } catch (error) {
      console.error('Failed to check database status:', error);
    }
  };

  const initializeDatabase = async (action: 'init' | 'reset' = 'init') => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage(action === 'reset' ? 'Databáze byla resetována!' : 'Databáze byla inicializována!');
        await checkDatabaseStatus();
      } else {
        setMessage('Chyba při práci s databází');
      }
    } catch (error) {
      setMessage('Chyba při komunikaci s databází');
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  React.useEffect(() => {
    checkDatabaseStatus();
  }, []);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              Vítejte v admin panelu
            </h1>
            <p className="text-slate-600">
              Spravujte obsah webových stránek Pionýrské skupiny Pacov
            </p>
          </div>

          {/* Database Status */}
          <div className="text-right">
            {dbStatus && (
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                dbStatus.databaseConnected
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  dbStatus.databaseConnected ? 'bg-green-500' : 'bg-yellow-500'
                }`}></div>
                {dbStatus.databaseConnected ? 'MongoDB připojena' : 'Statický režim'}
              </div>
            )}
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {message}
          </div>
        )}
      </div>

      {/* Database Management */}
      {dbStatus && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Správa databáze</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">Stav připojení</p>
              <p className="font-semibold">{dbStatus.databaseConnected ? 'Připojeno' : 'Odpojeno'}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">Celkem záznamů</p>
              <p className="font-semibold">{dbStatus.totalCollections || 0}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">Inicializováno</p>
              <p className="font-semibold">{dbStatus.isInitialized ? 'Ano' : 'Ne'}</p>
            </div>
          </div>

          {dbStatus.totalCollections > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3 mb-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <p className="text-xs text-blue-600">Stránky</p>
                <p className="font-bold text-blue-800">{dbStatus.contentPages || 0}</p>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                <p className="text-xs text-green-600">Oddíly</p>
                <p className="font-bold text-green-800">{dbStatus.pioneerGroups || 0}</p>
              </div>
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-center">
                <p className="text-xs text-orange-600">Zařízení</p>
                <p className="font-bold text-orange-800">{dbStatus.facilities || 0}</p>
              </div>
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-center">
                <p className="text-xs text-purple-600">Statistiky</p>
                <p className="font-bold text-purple-800">{dbStatus.statistics || 0}</p>
              </div>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                <p className="text-xs text-yellow-600">Kontakty</p>
                <p className="font-bold text-yellow-800">{dbStatus.contacts || 0}</p>
              </div>
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-center">
                <p className="text-xs text-indigo-600">Články</p>
                <p className="font-bold text-indigo-800">{dbStatus.articles || 0}</p>
              </div>
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                <p className="text-xs text-red-600">Admini</p>
                <p className="font-bold text-red-800">{dbStatus.adminUsers || 0}</p>
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={() => initializeDatabase('init')}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Pracuji...' : 'Inicializovat DB'}
            </button>

            <button
              onClick={() => initializeDatabase('reset')}
              disabled={isLoading}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
            >
              Reset DB
            </button>

            <button
              onClick={checkDatabaseStatus}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
            >
              Obnovit stav
            </button>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-xl">📄</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-slate-600">Celkem stránek</p>
              <p className="text-xl font-semibold text-slate-800">8</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-xl">👥</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-slate-600">Celkem členů</p>
              <p className="text-xl font-semibold text-slate-800">75</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <span className="text-xl">📅</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-slate-600">Nadcházející akce</p>
              <p className="text-xl font-semibold text-slate-800">5</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-xl">📝</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-slate-600">Články</p>
              <p className="text-xl font-semibold text-slate-800">12</p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {adminCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group"
          >
            <div className={`border rounded-xl p-6 transition-all hover:shadow-md hover:scale-105 ${card.color}`}>
              <div className="flex items-start space-x-4">
                <div className="text-2xl">{card.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2 group-hover:underline">
                    {card.title}
                  </h3>
                  <p className="text-sm opacity-80">
                    {card.description}
                  </p>
                </div>
                <div className="opacity-60 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Nedávná aktivita
        </h2>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.action}:</span>{' '}
                  <span className="text-slate-600">{activity.item}</span>
                </p>
                <p className="text-xs text-slate-500">{activity.time} • {activity.user}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}