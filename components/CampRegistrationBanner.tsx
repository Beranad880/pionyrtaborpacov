'use client';

export default function CampRegistrationBanner() {
  return (
    <div className="relative group overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 rounded-[2rem] blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
      
      <div className="relative bg-gradient-to-br from-[#0070af] via-[#005a8c] to-[#003d5e] rounded-[2rem] p-8 md:p-12 h-full flex flex-col justify-between shadow-2xl transition-all duration-500 hover:-translate-y-2">
        {/* Decorative Sun Icon */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
        
        <div className="text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl mb-8 transform group-hover:rotate-12 transition-transform duration-500 shadow-xl">
            <svg className="w-10 h-10 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
            Letní tábor <br/><span className="text-yellow-400">Hájence Bělá</span>
          </h2>

          <p className="text-white/80 text-lg mb-10 font-medium leading-relaxed max-w-lg mx-auto">
            Nezapomenutelné dobrodružství čeká! Přihlaste své děti na léto plné her, přátelství a nových zážitků.
          </p>
        </div>

        <div className="text-center relative z-10">
          <a
            href="https://www.ldtbela.cz/"
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn relative inline-flex items-center gap-3 bg-white text-[#0070af] font-black px-10 py-5 rounded-2xl hover:bg-yellow-400 hover:text-slate-900 transition-all duration-500 shadow-xl shadow-black/20 hover:shadow-yellow-400/40 hover:scale-110 active:scale-95 text-xl"
          >
            <span>PŘIHLÁSIT SE TEĎ</span>
            <svg className="w-6 h-6 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          <div className="mt-6 flex items-center justify-center gap-2 text-white/50 text-sm font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping"></span>
            Registrace otevřena na ldtbela.cz
          </div>
        </div>
      </div>
    </div>
  );
}
