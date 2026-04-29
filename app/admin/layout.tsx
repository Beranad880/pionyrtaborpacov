'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/lib/auth-admin';
import { useRouter } from 'next/navigation';
import { ToastProvider } from '@/components/Toast';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const adminPages = [
  { name: 'Přehled', href: '/admin', icon: '📊' },
  { name: 'Žádosti o pronájem', href: '/admin/rental-requests', icon: '🏗️' },
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
  const { isAuthenticated, isLoading, user, logout } = useAdminAuth();

  useEffect(() => {
    if (pathname !== '/admin/login' && !isLoading && !isAuthenticated) {
      const loginUrl = `/admin/login${pathname !== '/admin' ? `?redirect=${encodeURIComponent(pathname)}` : ''}`;
      router.push(loginUrl);
    }
  }, [pathname, isLoading, isAuthenticated, router]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Načítání systému...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <ToastProvider>
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-black text-xl">P</div>
          <span className="font-bold text-slate-800">Admin</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-xl bg-slate-100 text-slate-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white text-slate-900 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 border-r border-slate-200
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col p-6">
          {/* Logo Section */}
          <div className="mb-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-red-600/20">P</div>
            <div>
              <h1 className="font-black text-xl tracking-tight leading-none text-slate-900">PS Pacov</h1>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-1">Admin Panel</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 custom-scrollbar">
            {adminPages.map((page) => {
              const isActive = pathname === page.href;
              return (
                <Link
                  key={page.href}
                  href={page.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm group
                    ${isActive 
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' 
                      : 'text-slate-500 hover:text-red-600 hover:bg-red-50'}
                  `}
                >
                  <span className={`text-xl transition-transform group-hover:scale-110 ${isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
                    {page.icon}
                  </span>
                  <span>{page.name}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Consolidated Desktop Header */}
        <header className="hidden md:block bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
          <div className="px-8 py-4 flex items-center justify-between">
            {/* Left side: Status and Quick Links */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg border border-green-100">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-green-600">Systém připraven</span>
              </div>
              
              <div className="h-6 w-px bg-slate-200"></div>
              
              <div className="flex items-center gap-4">
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#0070af] transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  Web
                </Link>
                <button
                  onClick={() => {
                    if (confirm('Opravdu se chcete odhlásit?')) {
                      logout();
                      router.push('/admin/login');
                    }
                  }}
                  className="flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Odhlásit
                </button>
              </div>

              <div className="h-6 w-px bg-slate-200"></div>

              {/* User Section in Header */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-[10px] font-black">A</div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-slate-900 leading-none">adam</span>
                  <span className="text-[9px] font-bold text-green-500 uppercase tracking-tighter mt-0.5">Online</span>
                </div>
              </div>
            </div>

            {/* Right side: Date */}
            <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 shadow-inner">
              <div className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                {new Date().toLocaleDateString('cs-CZ', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
    </ToastProvider>
  );
}