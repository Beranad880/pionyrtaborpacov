'use client';

const pdfFiles = [
  {
    name: 'Evidenční list PS Pacov 2026',
    filename: 'pspacov2026.pdf',
    description: 'Evidenční list pro rok 2026'
  },
  {
    name: 'Evidenční list - Běláci',
    filename: 'pspacovbelaci.pdf',
    description: 'Evidenční list oddílu Běláci'
  },
  {
    name: 'Evidenční list - Mažoretky',
    filename: 'pspacovmazoretky.pdf',
    description: 'Evidenční list oddílu Mažoretky'
  }
];

export default function EvidencniListy() {
  return (
    <section className="relative py-24">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-block px-4 py-1.5 rounded-full bg-blue-600 text-white font-black text-[10px] tracking-[0.3em] uppercase shadow-lg shadow-blue-600/30">
              Dokumenty ke stažení
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
              Evidenční Listy
            </h2>
            <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
              Všechny potřebné formuláře pro vaše děti přehledně na jednom místě. Stačí kliknout a stáhnout.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pdfFiles.map((file, index) => (
              <a
                key={index}
                href={`/${file.filename}`}
                download
                className="group relative bg-white/70 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/50 shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 flex flex-col items-center text-center overflow-hidden"
              >
                {/* Hover gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0070af]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-700 rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-red-500/30 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-[#0070af] transition-colors leading-tight">
                    {file.name}
                  </h3>
                  
                  <p className="text-slate-500 font-bold mb-8 opacity-80">
                    {file.description}
                  </p>

                  <div className="mt-auto">
                    <span className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-xs tracking-widest uppercase transition-all duration-300 group-hover:bg-[#0070af] group-hover:shadow-lg group-hover:shadow-[#0070af]/30">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      PDF STÁHNOUT
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
