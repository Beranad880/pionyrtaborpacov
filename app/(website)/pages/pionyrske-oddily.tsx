import { allPagesContent } from '@/data/content';

export default function PionyrseOddilyPage() {
  const content = allPagesContent.pioneerGroups;

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="relative py-20 bg-slate-50 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_30%_20%,_rgba(0,112,175,0.05)_0%,_transparent_50%)] pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-[#0070af]/10 text-[#0070af] font-black text-[10px] tracking-[0.3em] uppercase">
            Naše komunity
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">{content.title}</h1>
          <p className="text-xl text-slate-800 max-w-3xl mx-auto leading-relaxed font-medium">
            {content.description}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-24">
        {/* Mřížka oddílů - 2 sloupce */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-7xl mx-auto">
          {content.groups?.filter((group: any) => group.name)?.map((group: any, index: number) => (
            <div key={index} className="group relative bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200/60 border border-slate-100 flex flex-col transition-all duration-500 hover:-translate-y-2">
              {/* Top Accent Line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1.5 bg-[#0070af] rounded-b-full opacity-20 group-hover:w-3/4 transition-all duration-500"></div>

              <div className="flex justify-between items-start mb-8">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight group-hover:text-[#0070af] transition-colors">{group.name}</h2>
                <div className="bg-[#0070af] text-white text-[10px] font-black px-4 py-2 rounded-2xl shadow-lg shadow-[#0070af]/20 uppercase tracking-widest">
                  {group.ageRange}
                </div>
              </div>

              <p className="text-slate-800 text-lg mb-10 leading-relaxed font-medium flex-grow">
                {group.description}
              </p>

              {group.activities && group.activities.length > 0 && (
                <div className="bg-slate-50/80 border border-slate-100 p-8 rounded-[2rem] relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <svg className="w-12 h-12 text-[#0070af]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  </div>
                  <h3 className="font-black text-xs uppercase tracking-[0.2em] text-[#0070af] mb-4">Co nás čeká:</h3>
                  <ul className="space-y-3">
                    {group.activities.map((activity: string, actIndex: number) => (
                      <li key={actIndex} className="text-slate-800 font-bold flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-[#0070af]"></span>
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Join Info Section */}
        {content.joinInfo && (
          <div className="mt-32 max-w-6xl mx-auto">
            <div className="relative bg-slate-900 rounded-[3rem] p-10 md:p-20 overflow-hidden">
              {/* Glow effect */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#0070af] opacity-20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                <div>
                  <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                    {content.joinInfo.title}
                  </h2>
                  <p className="text-white text-lg leading-relaxed font-medium">
                    {content.joinInfo.description}
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
                  <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                    Kontakt na vedoucí
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  </h3>
                  <div className="space-y-6">
                    <a href="mailto:mareseznam@seznam.cz" className="flex items-center gap-5 group/link">
                      <div className="w-12 h-12 bg-[#0070af]/20 rounded-2xl flex items-center justify-center text-[#0070af] group-hover/link:bg-[#0070af] group-hover/link:text-white transition-all">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                      </div>
                      <span className="text-white font-bold text-lg border-b border-white/10 group-hover/link:border-[#0070af] transition-all">mareseznam@seznam.cz</span>
                    </a>
                    <a href="tel:+420607244526" className="flex items-center gap-5 group/link">
                      <div className="w-12 h-12 bg-[#0070af]/20 rounded-2xl flex items-center justify-center text-[#0070af] group-hover/link:bg-[#0070af] group-hover/link:text-white transition-all">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                      </div>
                      <span className="text-white font-bold text-lg border-b border-white/10 group-hover/link:border-[#0070af] transition-all">+420 607 244 526</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
