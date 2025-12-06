'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/lib/auth-admin';
import { useRouter } from 'next/navigation';

const adminPages = [
  { name: 'Přehled', href: '/admin', icon: '📊' },
  { name: 'Úvodní stránka', href: '/admin/home', icon: '🏠' },
  { name: 'Pionýrské oddíly', href: '/admin/pioneer-groups', icon: '👥' },
  { name: 'Pronájem hájenky', href: '/admin/rental', icon: '🏗️' },
  { name: 'Táborové přihlášky', href: '/admin/camp-applications', icon: '🏕️' },
  { name: 'Kalendář akcí', href: '/admin/calendar', icon: '📅' },
  { name: 'Články', href: '/admin/articles', icon: '📝' },
  { name: 'Fotky z akcí', href: '/admin/photos', icon: '📸' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isAuthenticated, isLoading, logout } = useAdminAuth();

  // VŽDY volat useEffect bez ohledu na podmínky
  useEffect(() => {
    if (pathname !== '/admin/login' && !isLoading && !isAuthenticated) {
      const loginUrl = `/admin/login${pathname !== '/admin' ? `?redirect=${encodeURIComponent(pathname)}` : ''}`;
      router.push(loginUrl);
    }
  }, [pathname, isLoading, isAuthenticated, router]);

  // Neaplikovat autentifikaci na login stránku
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Načítání...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-slate-800">
              Admin Panel - Pionýrská skupina Pacov
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-slate-600 hover:text-slate-800 transition-colors"
              target="_blank"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  A
                </div>
                <span className="text-sm text-slate-600">Admin</span>
              </div>

              <button
                onClick={() => {
                  logout();
                  router.push('/admin/login');
                }}
                className="text-sm text-slate-600 hover:text-red-600 transition-colors"
                title="Odhlásit se"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${isSidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-sm border-r border-slate-200 transition-all duration-300 min-h-screen`}>
          <nav className="p-4 space-y-2">
            {adminPages.map((page) => {
              const isActive = pathname === page.href;
              return (
                <Link
                  key={page.href}
                  href={page.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-lg">{page.icon}</span>
                  {isSidebarOpen && (
                    <span className="font-medium">{page.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}