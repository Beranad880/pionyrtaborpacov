'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { siteData } from '@/data/content';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [siteInfo, setSiteInfo] = useState(siteData);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });

    fetch('/api/auth/verify')
      .then(res => res.json())
      .then(data => setIsAdminLoggedIn(data.success === true))
      .catch(() => setIsAdminLoggedIn(false));

    fetch('/api/content?page=siteData')
      .then(res => res.json())
      .then(result => { if (result.success && result.data) setSiteInfo(result.data); })
      .catch(() => {});

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    } finally {
      setIsAdminLoggedIn(false);
      closeMobileMenu();
      router.push('/');
    }
  };

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white shadow-sm'}`}>
        {/* Contact Bar */}
        <div className={`hidden sm:block transition-all duration-500 ease-in-out overflow-hidden ${isScrolled ? 'max-h-0 opacity-0 invisible' : 'max-h-[40px] opacity-100 visible bg-slate-100 border-b border-slate-200'}`}>
          <div className="py-2">
            <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-[13px] font-black uppercase tracking-widest">
              <div className="flex space-x-6 items-center">
                <a
                  href={siteInfo.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-blue-600 transition-all hover:scale-110"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href={siteInfo.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-pink-600 transition-all hover:scale-110"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913a5.885 5.885 0 001.384 2.126A5.868 5.868 0 004.14 23.37c.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558a5.898 5.898 0 002.126-1.384 5.86 5.86 0 001.384-2.126c.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913a5.89 5.89 0 00-1.384-2.126A5.847 5.847 0 0019.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227a3.81 3.81 0 01-.899 1.382 3.744 3.744 0 01-1.38.896c-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421a3.716 3.716 0 01-1.379-.899 3.644 3.644 0 01-.9-1.38c-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 01-2.88 0 1.44 1.44 0 012.88 0z"/>
                  </svg>
                </a>
              </div>
              <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-8 mt-2 sm:mt-0">
                <a href={`mailto:${siteInfo.contact.email}`} className="text-slate-700 hover:text-[#0070af] transition-colors flex items-center gap-2">
                  <span className="opacity-40"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg></span>
                  {siteInfo.contact.email}
                </a>
                <a href={`tel:${siteInfo.contact.phone}`} className="text-slate-700 hover:text-[#0070af] transition-colors flex items-center gap-2">
                  <span className="opacity-40"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg></span>
                  {siteInfo.contact.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="bg-transparent">
          <div className="container mx-auto px-4">
            <div className="flex items-center py-5">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-4 group flex-shrink-0" onClick={closeMobileMenu}>
                <div className="transition-all duration-500 bg-white p-1.5 rounded-2xl shadow-xl shadow-black/5 group-hover:scale-110 h-16">
                  <img
                    src="/logoVertikal1pionir.gif"
                    alt="Pionýrská skupina Pacov"
                    className="h-full w-auto object-contain"
                  />
                </div>
                <div className="hidden sm:block">
                  <div className="font-black tracking-tighter text-slate-900 text-xl leading-tight">{siteInfo.title}</div>
                  <div className="text-[10px] font-black text-[#0070af] uppercase tracking-[0.3em] opacity-80">Pacovští pionýři</div>
                </div>
              </Link>

              {/* Desktop Menu - Centered between logo and action button */}
              <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
                {siteInfo.menu.slice(0, -1).map((item, index) => (
                  <div key={index} className="relative group/menu">
                    <Link
                      href={item.href}
                      className="text-slate-800 hover:text-[#0070af] px-2.5 py-2 rounded-xl transition-all font-black text-[13px] uppercase tracking-[0.1em] relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-[#0070af] after:transition-all hover:after:w-1/2 hover:after:left-1/4 whitespace-nowrap"
                    >
                      {item.title}
                    </Link>

                    {item.submenu && (
                      <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-300 translate-y-2 group-hover/menu:translate-y-0">
                        <div className="bg-white/95 backdrop-blur-xl shadow-2xl border border-slate-100 rounded-3xl py-4 min-w-[240px] overflow-hidden">
                          {item.submenu.map((subitem, subindex) => (
                            <Link
                              key={subindex}
                              href={subitem.href}
                              className="flex items-center gap-3 px-6 py-3.5 text-slate-800 hover:bg-[#0070af] hover:text-white transition-all font-bold text-sm"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0070af] group-hover:bg-white transition-colors"></span>
                              {subitem.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Buttons (Right) */}
              <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
                {siteInfo.menu.slice(-1).map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#0070af] text-white hover:bg-[#005a8c] transition-all px-4 py-2 rounded-xl font-black text-[13px] uppercase tracking-widest inline-flex items-center gap-2 shadow-lg shadow-[#0070af]/10 hover:shadow-[#0070af]/30 hover:-translate-y-0.5"
                  >
                    {item.title}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ))}

                {isAdminLoggedIn && (
                  <div className="flex items-center gap-4 ml-6 pl-6 border-l border-slate-200">
                    <Link
                      href="/admin"
                      className="bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl shadow-black/10"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543-.94-3.31.826-2.37 2.37a1.724 1.724 0 00-1.065 2.572c-1.756.426-1.756 2.924 0 3.35a1.724 1.724 0 001.066 2.573c-.94 1.543.826 3.31 2.37 2.37.996.608 2.296.07 2.572-1.065z" />
                      </svg>
                      Admin
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-slate-500 hover:text-red-600 transition-colors font-black text-[10px] uppercase tracking-widest"
                    >
                      Odhlásit
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden relative z-[110] w-12 h-12 flex flex-col justify-center items-center gap-1.5 rounded-2xl transition-all active:scale-90"
                onClick={() => setIsMobileMenuOpen(v => !v)}
                aria-label={isMobileMenuOpen ? 'Zavřít menu' : 'Otevřít menu'}
              >
                <span className={`w-6 h-0.5 transition-all duration-300 ${isMobileMenuOpen ? 'bg-white rotate-45 translate-y-2' : 'bg-slate-900'}`}></span>
                <span className={`w-6 h-0.5 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 bg-white' : 'bg-slate-900'}`}></span>
                <span className={`w-6 h-0.5 transition-all duration-300 ${isMobileMenuOpen ? 'bg-white -rotate-45 -translate-y-2' : 'bg-slate-900'}`}></span>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay — outside <header> so z-index works correctly */}
      <div
        className={`lg:hidden fixed inset-0 z-[100] transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={closeMobileMenu}
        />

        {/* Drawer — slides in from right */}
        <div className={`absolute top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col transition-all duration-500 ease-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div>
              <div className="font-black text-slate-900 tracking-tight">{siteInfo.title}</div>
              <div className="text-[10px] font-black text-[#0070af] uppercase tracking-widest">Pacovští pionýři</div>
            </div>
            <button
              onClick={closeMobileMenu}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-red-100 hover:text-red-600 transition-all"
              aria-label="Zavřít menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Nav Items */}
          <div className="flex-1 overflow-y-auto py-4 px-4">
            {siteInfo.menu.map((item, index) => {
              const isExternal = item.href.startsWith('http');
              return (
                <div key={index} className="mb-1">
                  {isExternal ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full px-5 py-4 bg-[#0070af] text-white rounded-2xl font-black text-base shadow-lg shadow-[#0070af]/20 mb-2"
                      onClick={closeMobileMenu}
                    >
                      {item.title}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ) : (
                    <div>
                      <Link
                        href={item.href}
                        className="block px-5 py-4 text-xl font-black text-slate-900 hover:text-[#0070af] hover:bg-slate-50 rounded-2xl transition-all"
                        onClick={closeMobileMenu}
                      >
                        {item.title}
                      </Link>
                      {item.submenu && (
                        <div className="ml-4 mb-2 space-y-0.5">
                          {item.submenu.map((subitem, si) => (
                            <Link
                              key={si}
                              href={subitem.href}
                              className="block px-5 py-3 text-base font-bold text-slate-600 hover:text-[#0070af] hover:bg-slate-50 rounded-xl transition-all border-l-2 border-slate-100 hover:border-[#0070af] ml-2"
                              onClick={closeMobileMenu}
                            >
                              {subitem.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Admin section */}
          {isAdminLoggedIn && (
            <div className="p-4 border-t border-slate-100 space-y-2">
              <Link
                href="/admin"
                className="flex items-center justify-center gap-3 w-full px-5 py-4 bg-slate-900 text-white rounded-2xl font-black text-base"
                onClick={closeMobileMenu}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543-.94-3.31.826-2.37 2.37a1.724 1.724 0 00-1.065 2.572c-1.756.426-1.756 2.924 0 3.35a1.724 1.724 0 001.066 2.573c-.94 1.543.826 3.31 2.37 2.37.996.608 2.296.07 2.572-1.065z" />
                </svg>
                Admin Panel
              </Link>
              <button
                onClick={handleLogout}
                className="w-full py-3 text-slate-500 hover:text-red-600 font-black text-xs uppercase tracking-widest transition-colors"
              >
                Odhlásit se
              </button>
            </div>
          )}

          {/* Contact */}
          <div className="p-4 border-t border-slate-100 space-y-2 text-xs font-bold text-slate-500">
            <a href={`mailto:${siteInfo.contact.email}`} className="block hover:text-[#0070af] transition-colors">
              {siteInfo.contact.email}
            </a>
            <a href={`tel:${siteInfo.contact.phone}`} className="block hover:text-[#0070af] transition-colors">
              {siteInfo.contact.phone}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
