interface BackgroundSectionProps {
  children?: React.ReactNode;
}

export default function BackgroundSection({ children }: BackgroundSectionProps) {
  return (
    <section className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Články sekce */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">
            Články
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Placeholder pro články */}
            <div className="bg-slate-50 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                Článek 1
              </h3>
              <p className="text-slate-600">
                Zde bude obsah článku...
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                Článek 2
              </h3>
              <p className="text-slate-600">
                Zde bude obsah článku...
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                Článek 3
              </h3>
              <p className="text-slate-600">
                Zde bude obsah článku...
              </p>
            </div>
          </div>
        </div>

        {/* Akce sekce */}
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">
            Akce
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Placeholder pro akce */}
            <div className="bg-slate-50 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                Nadcházející akce 1
              </h3>
              <p className="text-slate-600 mb-2">
                Datum: 15. prosince 2024
              </p>
              <p className="text-slate-600">
                Popis akce...
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                Nadcházející akce 2
              </h3>
              <p className="text-slate-600 mb-2">
                Datum: 22. prosince 2024
              </p>
              <p className="text-slate-600">
                Popis akce...
              </p>
            </div>
          </div>
        </div>

        {children}
      </div>
    </section>
  );
}