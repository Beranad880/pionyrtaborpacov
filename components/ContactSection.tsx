'use client';

import { useState, useEffect } from 'react';
import { siteData } from '@/data/content';

export default function ContactSection() {
  const [data, setData] = useState<typeof siteData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/content?page=siteData');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setData(result.data);
            return;
          }
        }
      } catch (error) {
        console.log('Failed to fetch site data, using static data');
      }
      setData(siteData);
    };

    fetchData();
  }, []);

  if (!data) {
    return (
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto animate-pulse">
            <div className="text-center mb-12">
              <div className="h-10 bg-slate-200 rounded-lg max-w-md mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="w-full h-96 bg-slate-200 rounded-xl"></div>
              <div className="space-y-6">
                <div className="h-16 bg-slate-200 rounded-lg"></div>
                <div className="h-16 bg-slate-200 rounded-lg"></div>
                <div className="h-16 bg-slate-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_30%_20%,_rgba(0,112,175,0.05)_0%,_transparent_50%)] pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#0070af]/10 text-[#0070af] font-black text-xs tracking-[0.2em] uppercase">
              Kontakt & Informace
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Kde nás najdete?
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
            {/* Map Card */}
            <div className="lg:col-span-7 bg-white p-4 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 group transition-all duration-500 hover:shadow-3xl">
              <div className="w-full h-[500px] rounded-[2rem] overflow-hidden relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3065.1984384752836!2d15.137517886719422!3d49.5043601405731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470cee324a743da9%3A0x176df48f75fa238a!2zxIxlcnZlbsOhIMWYZcSNaWNlIDI3LCAzOTQgNDYgxIxlcnZlbsOhIMWYZcSNaWNl!5e0!3m2!1scs!2scz!4v1770283990549!5m2!1scs!2scz"
                  className="w-full h-full grayscale-[0.2] contrast-[1.1] group-hover:grayscale-0 transition-all duration-700"
                  style={{border: 0}}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Contact Info Bento */}
            <div className="lg:col-span-5 grid grid-cols-1 gap-6">
              {[
                {
                  title: 'Sídlo skupiny',
                  content: data.contact.address,
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />,
                  color: 'bg-blue-500'
                },
                {
                  title: 'Číslo účtu',
                  content: data.contact.bankAccount,
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />,
                  color: 'bg-[#0070af]'
                },
                {
                  title: 'Identifikace',
                  content: `IČ: ${data.contact.ico}\nDIČ: ${data.contact.dic}`,
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
                  color: 'bg-slate-800'
                }
              ].map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex items-start gap-6 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center flex-shrink-0 text-white shadow-lg shadow-blue-900/10 group-hover:scale-110 transition-transform`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">{item.icon}</svg>
                  </div>
                  <div>
                    <h3 className="text-slate-900 font-black text-lg mb-2">{item.title}</h3>
                    <p className="text-slate-700 font-bold leading-relaxed whitespace-pre-line">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard Section */}
          <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-slate-200/60 border border-slate-50 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-[#0070af] to-indigo-600"></div>
             
             <div className="text-center mb-16">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Vedení & Statistiky</h3>
             </div>

             {/* Leadership Grid */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                {[
                  { label: 'Vedoucí PS', name: data.leadership.leader },
                  { label: 'Hospodář PS', name: data.leadership.treasurer },
                  { label: 'Revizor PS', name: data.leadership.auditor }
                ].map((person, i) => (
                  <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 group hover:bg-[#0070af] transition-colors duration-500">
                    <div className="text-[#0070af] group-hover:text-white font-black drop-shadow-sm transition-colors">{person.label}</div>
                    <div className="text-slate-900 group-hover:text-white font-black text-lg transition-colors">{person.name}</div>
                  </div>
                ))}
             </div>

             {/* Age Stats Dashboard - LIGHT VERSION */}
             <div className="bg-[#0070af]/5 border border-[#0070af]/10 rounded-[2.5rem] p-8 md:p-12 text-slate-900 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#0070af]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
                   {/* Total Circle */}
                   <div className="flex-shrink-0">
                      <div className="relative w-48 h-48 flex items-center justify-center">
                         <svg className="absolute inset-0 w-full h-full -rotate-90">
                            <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-[#0070af]/10" />
                            <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-[#0070af]" strokeDasharray="552.92" strokeDashoffset="100" strokeLinecap="round" />
                         </svg>
                         <div className="text-center">
                            <div className="text-6xl font-black text-slate-900">{data.statistics.total}</div>
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0070af]">Členů celkem</div>
                         </div>
                      </div>
                   </div>

                   {/* Grid Stats */}
                   <div className="flex-grow grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-8 w-full">
                      {data.statistics.ageGroups.map((group, index) => (
                        <div key={index} className="bg-white border border-[#0070af]/10 rounded-2xl p-6 hover:shadow-xl hover:shadow-[#0070af]/10 transition-all duration-300 group">
                          <div className="text-3xl font-black text-[#0070af] mb-1 group-hover:scale-110 transition-transform origin-left">{group.count}</div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-slate-700">Věk {group.range}</div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Sub Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-12 border-t border-[#0070af]/10 relative z-10">
                   {[
                     { v: data.statistics.councilMembers, l: 'Členů rady' },
                     { v: data.statistics.leadershipMembers, l: 'Členů vedení' },
                     { v: data.statistics.krpDelegates, l: 'Delegátů' },
                     { v: data.statistics.foundedGroups, l: 'Oddílů' }
                   ].map((s, i) => (
                     <div key={i} className="text-center">
                        <div className="text-3xl font-black text-slate-900">{s.v}</div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-[#0070af] font-bold mt-1">{s.l}</div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}