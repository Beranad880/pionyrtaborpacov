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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Evidenční Listy
            </h2>
            <p className="text-slate-600">
              Stáhněte si evidenční listy pro jednotlivé oddíly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pdfFiles.map((file, index) => (
              <a
                key={index}
                href={`/${file.filename}`}
                download
                className="group flex flex-col items-center p-6 bg-slate-50 rounded-xl hover:bg-[#0070af]/10 transition-all duration-300 border border-slate-200 hover:border-[#0070af]/30"
              >
                <div className="w-16 h-16 bg-[#0070af] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-800 text-center mb-2 group-hover:text-[#0070af] transition-colors">
                  {file.name}
                </h3>
                <p className="text-sm text-slate-500 text-center mb-4">
                  {file.description}
                </p>
                <span className="inline-flex items-center gap-2 text-[#0070af] font-medium text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Stáhnout PDF
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
