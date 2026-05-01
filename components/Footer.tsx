'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { siteData } from '@/data/content';

export default function Footer() {
  const [siteInfo, setSiteInfo] = useState(siteData);

  useEffect(() => {
    fetch('/api/content?page=siteData')
      .then(res => res.json())
      .then(result => {
        if (result.success && result.data) setSiteInfo(result.data);
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Organization Info */}
          <div>
            <h3 className="font-bold text-xl mb-4 text-slate-800">{siteInfo.title}</h3>
            <p className="text-slate-700 mb-4">Pionýr, z.s.</p>
            <div className="space-y-2 text-sm text-slate-700">
              <p>{siteInfo.contact.address}</p>
              <p>IČ: {siteInfo.contact.ico}</p>
              <p>DIČ: {siteInfo.contact.dic}</p>
              <p>Č.ú.: {siteInfo.contact.bankAccount}</p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-slate-800">Kontakt</h4>
            <div className="space-y-2 text-sm text-slate-700">
              <p>
                <span className="font-medium">Email:</span>{' '}
                <a href={`mailto:${siteInfo.contact.email}`} className="hover:text-[#0070af] transition-colors">
                  {siteInfo.contact.email}
                </a>
              </p>
              <p>
                <span className="font-medium">Telefon:</span>{' '}
                <a href={`tel:${siteInfo.contact.phone}`} className="hover:text-[#0070af] transition-colors">
                  {siteInfo.contact.phone}
                </a>
              </p>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4 mt-4">
              <a
                href={siteInfo.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-700 hover:text-blue-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href={siteInfo.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-700 hover:text-pink-500 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913a5.885 5.885 0 001.384 2.126A5.868 5.868 0 004.14 23.37c.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558a5.898 5.898 0 002.126-1.384 5.86 5.86 0 001.384-2.126c.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913a5.89 5.89 0 00-1.384-2.126A5.847 5.847 0 0019.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227a3.81 3.81 0 01-.899 1.382 3.744 3.744 0 01-1.38.896c-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421a3.716 3.716 0 01-1.379-.899 3.644 3.644 0 01-.9-1.38c-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 01-2.88 0 1.44 1.44 0 012.88 0z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-slate-800">Rychlé odkazy</h4>
            <div className="space-y-2 text-sm">
              <Link href="/pages?page=hajenka-bela" className="block text-slate-700 hover:text-[#0070af] transition-colors">
                Hájenka Bělá
              </Link>
              <Link href="/pages?page=clanky" className="block text-slate-700 hover:text-[#0070af] transition-colors">
                Články
              </Link>
              <Link href="/pages?page=kalendar-akci" className="block text-slate-700 hover:text-[#0070af] transition-colors">
                Kalendář akcí
              </Link>
              <Link href="/pages?page=pronajem-hajenky-bela" className="block text-slate-700 hover:text-[#0070af] transition-colors">
                Pronájem
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 flex flex-col items-center gap-4 text-sm text-slate-600">
          <div className="flex items-end justify-center gap-8">
            <div className="flex flex-col items-center w-40">
              <p className="text-sm text-slate-600 mb-3">Podpořil</p>
              <a
                href="https://www.kr-vysocina.cz/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-16 w-full hover:opacity-80 transition-opacity"
              >
                <img
                  src="/logovysocina.jpg"
                  alt="Kraj Vysočina"
                  className="h-16 w-auto"
                />
              </a>
            </div>
            <div className="flex flex-col items-center w-40">
              <p className="text-sm text-slate-600 mb-3">Web vytvořil</p>
              <a
                href="https://humbletech.cz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-16 w-full hover:opacity-80 transition-opacity"
              >
                <span className="group flex items-center justify-center h-16 w-full rounded bg-blue-700 hover:bg-black transition-colors duration-200 px-3">
                  <span className="font-bold text-lg tracking-tight">
                    <span className="text-white group-hover:text-blue-700 transition-colors duration-200">humble</span><span className="text-black group-hover:text-white transition-colors duration-200">tech</span>
                  </span>
                </span>
              </a>
            </div>
          </div>
          <div className="border-t border-slate-300 w-full" />
          <div className="flex justify-between w-full">
            <p>&copy; 2026 {siteInfo.title}. Všechna práva vyhrazena.</p>
            <p>Aktualizace 2026</p>
          </div>
        </div>
      </div>
    </footer>
  );
}