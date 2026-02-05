'use client';

export default function CampRegistrationBanner() {
  return (
    <div className="bg-gradient-to-br from-[#0070af] to-[#005a8c] rounded-2xl p-6 md:p-8 h-full flex flex-col justify-between">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
          <svg className="w-8 h-8 text-[#0070af]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Přihlášky na letní tábor
        </h2>

        <p className="text-white/90 mb-6">
          Přihlaste své děti na nezapomenutelný letní tábor v Hájence Bělá!
          Čeká na vás bohatý program plný her a dobrodružství.
        </p>
      </div>

      <div className="text-center">
        <a
          href="https://www.ldtbela.cz/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white text-[#0070af] font-bold px-6 py-3 rounded-xl hover:bg-slate-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <span>Přihlásit se na tábor</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        <p className="mt-3 text-xs text-white/60">
          ldtbela.cz
        </p>
      </div>
    </div>
  );
}
