'use client';

import { useState, useEffect } from 'react';
import { DAYS_CS, MONTHS_CS } from '@/lib/labels';

interface Event {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  type: 'camp' | 'meeting' | 'trip' | 'workshop' | 'competition' | 'other';
  location: string;
  maxParticipants?: number;
  currentParticipants?: number;
  registrationDeadline?: string;
  organizer: string;
  status: 'planned' | 'confirmed' | 'cancelled' | 'completed';
  isPublic: boolean;
  price?: number;
}

const eventTypeColors = {
  camp:        { border: 'border-red-500',    bg: 'bg-red-500',    text: 'text-white', dot: 'bg-red-500',    cell: 'bg-red-100',    cellText: 'text-red-900' },
  meeting:     { border: 'border-blue-500',   bg: 'bg-blue-500',   text: 'text-white', dot: 'bg-blue-500',   cell: 'bg-blue-100',   cellText: 'text-blue-900' },
  trip:        { border: 'border-green-500',  bg: 'bg-green-600',  text: 'text-white', dot: 'bg-green-500',  cell: 'bg-green-100',  cellText: 'text-green-900' },
  workshop:    { border: 'border-orange-500', bg: 'bg-orange-500', text: 'text-white', dot: 'bg-orange-500', cell: 'bg-orange-100', cellText: 'text-orange-900' },
  competition: { border: 'border-purple-500', bg: 'bg-purple-500', text: 'text-white', dot: 'bg-purple-500', cell: 'bg-purple-100', cellText: 'text-purple-900' },
  other:       { border: 'border-gray-500',   bg: 'bg-gray-500',   text: 'text-white', dot: 'bg-gray-500',   cell: 'bg-gray-200',   cellText: 'text-gray-900' },
};

const statusLabels = {
  planned:   { label: 'Plánováno',              color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Přihlašování otevřeno',  color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Zrušeno',                color: 'bg-red-100 text-red-800' },
  completed: { label: 'Ukončeno',               color: 'bg-gray-100 text-gray-800' },
};

const typeLabels: Record<Event['type'], string> = {
  camp: 'Tábor', meeting: 'Schůzka', trip: 'Výlet',
  workshop: 'Workshop', competition: 'Soutěž', other: 'Ostatní',
};


export default function KalendarAkciPage() {
  const [events, setEvents]               = useState<Event[]>([]);
  const [loading, setLoading]             = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [currentMonth, setCurrentMonth]   = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        const result = await response.json();
        if (result.success) setEvents(result.data.events);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const getEventsForDay = (date: Date): Event[] => {
    const day = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    return events.filter(event => {
      const start = new Date(new Date(event.startDate).toDateString()).getTime();
      const end   = new Date(new Date(event.endDate).toDateString()).getTime();
      return day >= start && day <= end;
    });
  };

  const buildCalendarDays = (): (Date | null)[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay  = new Date(year, month + 1, 0);
    let startDow = firstDay.getDay() - 1;
    if (startDow < 0) startDow = 6;
    const days: (Date | null)[] = Array(startDow).fill(null);
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));
    while (days.length % 7 !== 0) days.push(null);
    return days;
  };

  const upcomingEvents = [...events]
    .filter(e => new Date(e.startDate) >= new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const today        = new Date();
  const calendarDays = buildCalendarDays();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Kalendář akcí</h1>
        <div className="animate-pulse space-y-4">
          <div className="bg-white border rounded-xl h-80"></div>
          {[1,2,3].map(i => (
            <div key={i} className="bg-white border-l-4 border-gray-300 p-6 shadow-sm h-24"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="relative py-20 bg-slate-50 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_30%_20%,_rgba(0,112,175,0.05)_0%,_transparent_50%)] pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-[#0070af]/10 text-[#0070af] font-black text-[10px] tracking-[0.3em] uppercase">
            Plánované události
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">Kalendář akcí</h1>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-medium">
            Přehled akcí, táborů a aktivit naší pionýrské skupiny.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-24">
        <div className="max-w-7xl mx-auto">
          {/* ── Vizuální kalendář ── */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 mb-12 overflow-hidden">
            {/* Navigace */}
            <div className="flex items-center justify-between px-10 py-8 bg-slate-50/50 border-b border-slate-100">
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200 shadow-sm hover:bg-[#0070af] hover:text-white transition-all text-2xl font-bold text-slate-600 active:scale-95"
              >
                ‹
              </button>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {MONTHS_CS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h2>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200 shadow-sm hover:bg-[#0070af] hover:text-white transition-all text-2xl font-bold text-slate-600 active:scale-95"
              >
                ›
              </button>
            </div>

            {/* Záhlaví dnů */}
            <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/30">
              {DAYS_CS.map(day => (
                <div key={day} className="py-4 text-center text-xs font-black text-[#0070af] uppercase tracking-[0.2em]">
                  {day}
                </div>
              ))}
            </div>

            {/* Buňky */}
            <div className="grid grid-cols-7">
              {calendarDays.map((date, idx) => {
                const dayEvents  = date ? getEventsForDay(date) : [];
                const isToday    = date && date.toDateString() === today.toDateString();
                const isWeekend  = date && (date.getDay() === 0 || date.getDay() === 6);
                const hasEvents  = dayEvents.length > 0;
                const primaryType = dayEvents[0]?.type;

                return (
                  <div
                    key={idx}
                    className={`min-h-[100px] md:min-h-[140px] border-r border-b border-slate-50 p-2 transition-all duration-300 ${
                      !date   ? 'bg-slate-50/50' :
                      isToday ? 'bg-blue-50/50' :
                      isWeekend ? 'bg-slate-50/30' : 'bg-white'
                    }`}
                  >
                    {date && (
                      <>
                        <div className={`text-sm font-black mb-2 w-8 h-8 flex items-center justify-center rounded-xl transition-all ${
                          isToday
                            ? 'bg-[#0070af] text-white shadow-lg shadow-[#0070af]/20'
                            : hasEvents
                              ? 'text-[#0070af] bg-[#0070af]/5'
                              : 'text-slate-400'
                        }`}>
                          {date.getDate()}
                        </div>
                        <div className="space-y-1.5">
                          {dayEvents.slice(0, 3).map(event => (
                            <button
                              key={event._id}
                              onClick={() => setSelectedEvent(event)}
                              title={event.title}
                              className={`w-full text-left text-[10px] md:text-xs px-2 py-1.5 rounded-lg truncate font-black uppercase tracking-wider transition-all hover:scale-[1.02] shadow-sm ${eventTypeColors[event.type].bg} ${eventTypeColors[event.type].text}`}
                            >
                              {event.title}
                            </button>
                          ))}
                          {dayEvents.length > 3 && (
                            <p className="text-[10px] font-black text-slate-400 px-2 uppercase tracking-widest">
                              +{dayEvents.length - 3} další
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Legenda ── */}
          <div className="flex flex-wrap justify-center gap-6 mb-24">
            {(Object.entries(typeLabels) as [Event['type'], string][]).map(([type, label]) => (
              <div key={type} className="flex items-center gap-3 bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-100 shadow-sm">
                <div className={`w-3.5 h-3.5 rounded-full flex-shrink-0 shadow-sm ${eventTypeColors[type].dot}`}></div>
                <span className="text-xs font-black text-slate-600 uppercase tracking-widest">{label}</span>
              </div>
            ))}
          </div>

          {/* ── Detail vybrané akce ── */}
          {selectedEvent && (
            <div className={`bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl border-l-[12px] ${eventTypeColors[selectedEvent.type].border} mb-24 transition-all animate-fade-in-up relative overflow-hidden`}>
              <div className="absolute top-0 right-0 p-10 opacity-5">
                <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/></svg>
              </div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <div className={`inline-block px-4 py-1.5 rounded-full ${statusLabels[selectedEvent.status].color} font-black text-[10px] tracking-widest uppercase mb-6`}>
                      {statusLabels[selectedEvent.status].label}
                    </div>
                    <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">{selectedEvent.title}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all text-3xl leading-none"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Datum konání</div>
                        <p className="text-lg font-bold text-slate-800">
                          {new Date(selectedEvent.startDate).toLocaleDateString('cs-CZ')}
                          {selectedEvent.startDate !== selectedEvent.endDate &&
                            ` – ${new Date(selectedEvent.endDate).toLocaleDateString('cs-CZ')}`}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lokalita</div>
                        <p className="text-lg font-bold text-slate-800">{selectedEvent.location}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Typ akce</div>
                        <p className="text-lg font-bold text-slate-800">{typeLabels[selectedEvent.type]}</p>
                      </div>
                      {selectedEvent.price && selectedEvent.price > 0 && (
                        <div className="space-y-1">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cena</div>
                          <p className="text-lg font-bold text-[#0070af]">{selectedEvent.price} Kč</p>
                        </div>
                      )}
                    </div>
                    
                    {selectedEvent.maxParticipants && (
                      <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Obsazenost</span>
                          <span className="text-xs font-black text-[#0070af] uppercase tracking-widest">
                            {selectedEvent.currentParticipants || 0} / {selectedEvent.maxParticipants} míst
                          </span>
                        </div>
                        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#0070af] transition-all duration-1000" 
                            style={{ width: `${((selectedEvent.currentParticipants || 0) / selectedEvent.maxParticipants) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-6">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Popis akce</div>
                    <p className="text-slate-600 text-lg leading-relaxed font-medium">{selectedEvent.description}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Nadcházející akce (seznam) ── */}
          <div className="mb-24">
            <h2 className="text-3xl font-black text-slate-900 mb-10 tracking-tight flex items-center gap-4">
              Nadcházející akce
              <div className="h-1 w-24 bg-[#0070af] rounded-full"></div>
            </h2>
            
            {upcomingEvents.length === 0 ? (
              <div className="bg-slate-50 p-12 rounded-[2.5rem] text-center border border-dashed border-slate-300">
                <p className="text-slate-500 font-bold text-xl">Momentálně nejsou plánovány žádné veřejné akce.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {upcomingEvents.map(event => (
                  <button
                    key={event._id}
                    onClick={() => setSelectedEvent(event)}
                    className={`group w-full text-left bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl border-l-[12px] ${eventTypeColors[event.type].border} hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 border border-slate-100`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <span className={`px-4 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${statusLabels[event.status].color}`}>
                            {statusLabels[event.status].label}
                          </span>
                          <span className="text-[#0070af] font-black text-xs uppercase tracking-widest">
                            {typeLabels[event.type]}
                          </span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 group-hover:text-[#0070af] transition-colors mb-4 tracking-tight">{event.title}</h3>
                        <div className="flex flex-wrap gap-6 text-slate-500 font-bold text-sm">
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                            {new Date(event.startDate).toLocaleDateString('cs-CZ')}
                          </span>
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            {event.location}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                         <div className="bg-slate-100 group-hover:bg-[#0070af] p-5 rounded-2xl text-slate-400 group-hover:text-white transition-all">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
                         </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Kontakt Section ── */}
          <div className="relative bg-slate-900 rounded-[3rem] p-12 md:p-20 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(0,112,175,0.15)_0%,_transparent_70%)]"></div>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">Máte dotazy k akcím?</h2>
                <p className="text-slate-400 text-lg font-medium leading-relaxed">
                  Rádi vám poskytneme podrobnější informace o připravovaných akcích, výletech i táborech.
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
                <div className="space-y-8">
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Hlavní kontakt</div>
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 bg-[#0070af] rounded-3xl flex items-center justify-center text-white shadow-xl shadow-[#0070af]/20">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                       </div>
                       <div>
                          <div className="text-white font-black text-xl">Mgr. Ladislav Mareš</div>
                          <div className="text-slate-400 font-bold">Vedoucí PS Pacov</div>
                       </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-white/10">
                    <a href="mailto:mareseznam@seznam.cz" className="flex flex-col gap-2 hover:opacity-80 transition-opacity">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email</span>
                      <span className="text-white font-bold">mareseznam@seznam.cz</span>
                    </a>
                    <a href="tel:+420607244526" className="flex flex-col gap-2 hover:opacity-80 transition-opacity">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Telefon</span>
                      <span className="text-white font-bold">+420 607 244 526</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
