'use client';

/* eslint-disable @next/next/no-img-element */

export default function MestoPacovPage() {
  const images = [
    {
      src: 'https://www.mestopacov.cz/assets/Image.ashx?id_org=11721&id_obrazky=13953',
      alt: 'Náměstí Svobody v Pacově',
      title: 'Náměstí Svobody'
    },
    {
      src: 'https://www.mestopacov.cz/assets/Image.ashx?id_org=11721&id_obrazky=13961',
      alt: 'Zámek Pacov',
      title: 'Zámek Pacov'
    },
    {
      src: 'https://www.mestopacov.cz/assets/Image.ashx?id_org=11721&id_obrazky=13965',
      alt: 'Pacovské kulturní léto',
      title: 'Kulturní léto'
    }
  ];

  const links = [
    {
      name: 'Oficiální stránky města',
      url: 'https://www.mestopacov.cz',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: 'Facebook města Pacov',
      url: 'https://www.facebook.com/mestopacov',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      name: 'Instagram města Pacov',
      url: 'https://www.instagram.com/mestopacov',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
        </svg>
      )
    },
    {
      name: 'YouTube kanál',
      url: 'https://www.youtube.com/@MestoPacov',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="relative py-20 bg-slate-50 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_30%_20%,_rgba(0,112,175,0.05)_0%,_transparent_50%)] pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-[#0070af]/10 text-[#0070af] font-black text-[10px] tracking-[0.3em] uppercase">
            Naše domovské město
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">Město Pacov</h1>
          <p className="text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed font-medium">
            Malebné město v srdci Českomoravské vrchoviny s bohatou historií a živou kulturou.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
          {/* About City Card */}
          <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl shadow-slate-200/60 border border-slate-100 mb-20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
               <svg className="w-64 h-64 text-slate-900" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-4">
                O městě
                <div className="h-1 w-12 bg-[#0070af] rounded-full"></div>
              </h2>
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                 <div className="space-y-6">
                    <p className="text-slate-800 text-lg leading-relaxed font-medium">
                      Pacov je město v okrese Pelhřimov v Kraji Vysočina. Leží v malebné krajině Českomoravské vrchoviny
                      a má bohatou historii sahající až do 13. století. Město je známé svým renesančním zámkem,
                      historickým náměstím a kostelem sv. Michaela archanděla.
                    </p>
                    <p className="text-slate-800 text-lg leading-relaxed font-medium">
                      V současnosti má Pacov přibližně 5 000 obyvatel a nabízí svým návštěvníkům i obyvatelům
                      řadu kulturních a sportovních aktivit, krásnou přírodu v okolí a příjemnou atmosféru malého města.
                    </p>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-[2.5rem] border border-slate-100 shadow-inner">
                    <img 
                      src="https://www.mestopacov.cz/assets/Image.ashx?id_org=11721&id_obrazky=13953" 
                      alt="Náměstí v Pacově" 
                      className="w-full h-full object-cover rounded-[2rem] shadow-lg"
                    />
                 </div>
              </div>
            </div>
          </div>

          {/* Photo Gallery */}
          <div className="mb-32">
            <div className="text-center mb-16 space-y-4">
               <div className="inline-block px-4 py-1.5 rounded-full bg-[#0070af]/10 text-[#0070af] font-black text-[10px] tracking-[0.3em] uppercase">
                 Fotogalerie
               </div>
               <h2 className="text-4xl font-black text-slate-900 tracking-tight">Pacov objektivem</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {images.map((image, index) => (
                <div key={index} className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100 transition-all duration-500 hover:-translate-y-2">
                  <div className="h-72 overflow-hidden relative">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{image.title}</h3>
                    <p className="text-slate-500 font-bold text-sm mt-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">Zobrazit detail města</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Links Section */}
          <div className="relative bg-slate-900 rounded-[3rem] p-12 md:p-20 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(0,112,175,0.15)_0%,_transparent_70%)]"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-16 text-center tracking-tight">Užitečné odkazy</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center text-center gap-6 p-10 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:-translate-y-1 hover:border-[#0070af]/50 group"
                  >
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:bg-[#0070af] group-hover:scale-110 transition-all">
                      {link.icon}
                    </div>
                    <span className="text-white font-black text-sm uppercase tracking-widest leading-snug group-hover:text-blue-200 transition-colors">
                      {link.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
