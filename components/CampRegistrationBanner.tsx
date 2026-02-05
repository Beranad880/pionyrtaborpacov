'use client';

export default function CampRegistrationBanner() {
  return (
    <section className="py-16 bg-gradient-to-r from-[#0070af] to-[#005a8c]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6">
              <svg className="w-10 h-10 text-[#0070af]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Přihlášky na letní tábor
            </h2>

            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Přihlaste své děti na nezapomenutelný letní tábor v Hájence Bělá!
              Čeká na vás bohatý program plný her, dobrodružství a nových přátelství.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://www.ldtbela.cz/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white text-[#0070af] font-bold px-8 py-4 rounded-xl hover:bg-slate-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <span>Přihlásit se na tábor</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            <p className="mt-6 text-sm text-white/70">
              Přihlášky probíhají na webu ldtbela.cz
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
