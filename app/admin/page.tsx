'use client';

import { useState, useEffect } from 'react';


function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'právě teď';
  if (minutes < 60) return `před ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `před ${hours} hod`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'včera';
  if (days < 7) return `před ${days} dny`;
  return new Date(iso).toLocaleDateString('cs-CZ');
}

export default function AdminDashboard() {
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [stats, setStats] = useState({ 
    pages: 0, 
    members: 0, 
    upcomingEvents: 0, 
    articles: 0,
    pendingCampApplications: 0,
    pendingRentalRequests: 0 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/admin/activity').then(r => r.ok ? r.json() : null),
      fetch('/api/admin/stats').then(r => r.ok ? r.json() : null)
    ]).then(([activityData, statsData]) => {
      if (activityData?.success) setRecentActivity(activityData.data);
      if (statsData?.success) setStats(statsData.data);
    }).catch(err => {
      console.error('Error loading dashboard data:', err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Vítejte v admin panelu
          </h1>
          <p className="text-slate-600">
            Spravujte obsah webových stránek Pionýrské skupiny Pacov
          </p>
        </div>
        {(stats.pendingCampApplications > 0 || stats.pendingRentalRequests > 0) && (
          <div className="flex gap-3">
            {stats.pendingCampApplications > 0 && (
              <div className="bg-red-50 border border-red-100 px-4 py-2 rounded-xl text-red-600 animate-pulse">
                <span className="font-bold">{stats.pendingCampApplications}</span> nové přihlášky
              </div>
            )}
            {stats.pendingRentalRequests > 0 && (
              <div className="bg-orange-50 border border-orange-100 px-4 py-2 rounded-xl text-orange-600 animate-pulse">
                <span className="font-bold">{stats.pendingRentalRequests}</span> nové žádosti o pronájem
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow cursor-default">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-xl">
              <span className="text-xl">📄</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Stránky</p>
              <p className="text-2xl font-black text-slate-800">{stats.pages}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow cursor-default">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-xl">
              <span className="text-xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Členové</p>
              <p className="text-2xl font-black text-slate-800">{stats.members}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow cursor-default">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-xl">
              <span className="text-xl">📅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Akce</p>
              <p className="text-2xl font-black text-slate-800">{stats.upcomingEvents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow cursor-default">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-xl">
              <span className="text-xl">📝</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Články</p>
              <p className="text-2xl font-black text-slate-800">{stats.articles}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Nedávná aktivita
        </h2>
        <div className="space-y-3">
          {recentActivity.length === 0 ? (
            <p className="text-sm text-slate-500">Zatím žádná aktivita.</p>
          ) : (
            recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.action}:</span>{' '}
                    <span className="text-slate-600">{activity.item}</span>
                  </p>
                  <p className="text-xs text-slate-500">{formatRelativeTime(activity.date)} • {activity.user}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}