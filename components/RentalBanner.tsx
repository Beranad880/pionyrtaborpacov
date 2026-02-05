'use client';

export default function RentalBanner() {
  return (
    <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-2xl p-6 md:p-8 h-full flex flex-col justify-between">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
          <svg className="w-8 h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Pronájem Hájenky Bělá
        </h2>

        <p className="text-white/90 mb-6">
          Ideální místo pro firemní akci, školní výlet, rodinnou oslavu nebo víkendový pobyt v krásné přírodě.
        </p>
      </div>

      <div className="text-center">
        <a
          href="/pages?page=hajenka-bela"
          className="inline-flex items-center gap-2 bg-white text-green-700 font-bold px-6 py-3 rounded-xl hover:bg-slate-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <span>Zjistit více a rezervovat</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
        <p className="mt-3 text-xs text-white/60">
          Kapacita 35 osob • 10 km od Pacova
        </p>
      </div>
    </div>
  );
}
