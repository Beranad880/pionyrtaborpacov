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
  camp:        { border: 'border-red-600',    bg: 'bg-red-600',    text: 'text-white', dot: 'bg-red-600',    cell: 'bg-red-50',    cellText: 'text-red-950' },
  meeting:     { border: 'border-blue-600',   bg: 'bg-blue-600',   text: 'text-white', dot: 'bg-blue-600',   cell: 'bg-blue-50',   cellText: 'text-blue-950' },
  trip:        { border: 'border-green-700',  bg: 'bg-green-700',  text: 'text-white', dot: 'bg-green-700',  cell: 'bg-green-50',  cellText: 'text-green-950' },
  workshop:    { border: 'border-orange-600', bg: 'bg-orange-600', text: 'text-white', dot: 'bg-orange-600', cell: 'bg-orange-50', cellText: 'text-orange-950' },
  competition: { border: 'border-purple-600', bg: 'bg-purple-600', text: 'text-white', dot: 'bg-purple-600', cell: 'bg-purple-50', cellText: 'text-purple-950' },
  other:       { border: 'border-slate-600',  bg: 'bg-slate-600',  text: 'text-white', dot: 'bg-slate-600',  cell: 'bg-slate-100',  cellText: 'text-slate-950' },
};

const statusLabels = {
  planned:   { label: 'Plánováno',              color: 'bg-amber-100 text-amber-900 border border-amber-200 font-black' },
  confirmed: { label: 'Přihlašování otevřeno',  color: 'bg-emerald-100 text-emerald-900 border border-emerald-200 font-black' },
  cancelled: { label: 'Zrušeno',                color: 'bg-rose-100 text-rose-900 border border-rose-200 font-black' },
  completed: { label: 'Ukončeno',               color: 'bg-slate-200 text-slate-900 border border-slate-300 font-black' },
};

const typeLabels: Record<Event['type'], string> = {
  camp: 'Tábor', meeting: 'Schůzka', trip: 'Výlet',
  workshop: 'Workshop', competition: 'Soutěž', other: 'Ostatní',
};


export default function KalendarAkciPage() {
  const [events, setEvents]               = useState<Event[]>([]);
  const [loading, setLoading]             = useState(true);
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

  const handleSelectEvent = (event: Event) => {
    const element = document.getElementById(`event-${event._id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('ring-4', 'ring-[#0070af]/30');
      setTimeout(() => element.classList.remove('ring-4', 'ring-[#0070af]/30'), 2000);
    }
  };

  const today        = new Date();
  const calendarDays = buildCalendarDays();

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="relative py-20 bg-slate-50 animate-pulse">
          <div className="container mx-auto px-4 text-center">
            <div className="w-32 h-6 bg-slate-200 rounded-full mx-auto mb-6"></div>
            <div className="w-64 h-12 bg-slate-200 rounded-2xl mx-auto mb-6"></div>
            <div className="w-96 h-6 bg-slate-200 rounded-xl mx-auto"></div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-7xl mx-auto">
            <div className="bg-slate-50 rounded-[2.5rem] h-[600px] animate-pulse"></div>
          </div>
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
          <p className="text-xl text-slate-800 max-w-3xl mx-auto leading-relaxed font-medium">
            Přehled akcí, táborů a aktivit naší pionýrské skupiny.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-24">
        <div className="max-w-7xl mx-auto">
          {/* ── Vizuální kalendář ── */}
          <div className="bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-black/20 border border-slate-800 mb-12 overflow-hidden">
            {/* Navigace */}
            <div className="flex items-center justify-between px-10 py-8 bg-slate-800/50 border-b border-slate-800">
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-800 border border-slate-700 shadow-sm hover:bg-[#0070af] hover:text-white transition-all text-2xl font-bold text-white active:scale-95"
              >
                ‹
              </button>
              <h2 className="text-2xl font-black text-white tracking-tight">
                {MONTHS_CS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h2>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-800 border border-slate-700 shadow-sm hover:bg-[#0070af] hover:text-white transition-all text-2xl font-bold text-white active:scale-95"
              >
                ›
              </button>
            </div>

            {/* Záhlaví dnů */}
            <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-900/50">
              {DAYS_CS.map(day => (
                <div key={day} className="py-4 text-center text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
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

                return (
                  <div
                    key={idx}
                    className={`min-h-[100px] md:min-h-[140px] border-r border-b border-slate-800 p-2 transition-all duration-300 ${
                      !date   ? 'bg-slate-950/50' :
                      isToday ? 'bg-blue-500/10' :
                      isWeekend ? 'bg-slate-800/30' : 'bg-slate-900'
                    }`}
                  >
                    {date && (
                      <>
                        <div className={`text-sm font-black mb-2 w-8 h-8 flex items-center justify-center rounded-xl transition-all ${
                          isToday
                            ? 'bg-[#0070af] text-white shadow-lg shadow-[#0070af]/40'
                            : hasEvents
                              ? 'text-white bg-slate-700 shadow-sm'
                              : 'text-slate-500'
                        }`}>
                          {date.getDate()}
                        </div>
                        <div className="space-y-1.5">
                          {dayEvents.slice(0, 3).map(event => (
                            <button
                              key={event._id}
                              onClick={() => handleSelectEvent(event)}
                              title={event.title}
                              className={`w-full text-left text-[10px] md:text-xs px-2 py-1.5 rounded-lg truncate font-black uppercase tracking-wider transition-all hover:scale-[1.02] shadow-md border ${eventTypeColors[event.type].bg} ${eventTypeColors[event.type].text} ${eventTypeColors[event.type].border}`}
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
              <div key={type} className="flex items-center gap-3 bg-slate-900 px-5 py-2.5 rounded-2xl border border-slate-800 shadow-xl">
                <div className={`w-3.5 h-3.5 rounded-full flex-shrink-0 shadow-sm ${eventTypeColors[type].dot}`}></div>
                <span className="text-xs font-black text-slate-300 uppercase tracking-widest">{label}</span>
              </div>
            ))}
          </div>

          {/* ── Nadcházející akce (seznam s detaily) ── */}
          <div className="mb-24">
            <h2 className="text-3xl font-black text-slate-950 mb-10 tracking-tight flex items-center gap-4">
              Nadcházející akce
              <div className="h-1 w-24 bg-[#0070af] rounded-full"></div>
            </h2>
            
            {upcomingEvents.length === 0 ? (
              <div className="bg-slate-100 p-12 rounded-[2.5rem] text-center border border-dashed border-slate-400">
                <p className="text-slate-900 font-black text-xl">Momentálně nejsou plánovány žádné veřejné akce.</p>
              </div>
            ) : (
              <div className="space-y-12">
                {upcomingEvents.map(event => (
                  <div
                    key={event._id}
                    id={`event-${event._id}`}
                    className={`bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border-l-[12px] ${eventTypeColors[event.type].border} transition-all duration-500 border border-slate-200 relative overflow-hidden`}
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                      <svg className="w-32 h-32 text-slate-900" fill="currentColor" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/></svg>
                    </div>

                    <div className="relative z-10">
                      <div className="flex flex-wrap items-center gap-3 mb-6">
                        <div className={`px-4 py-1.5 rounded-full ${statusLabels[event.status].color} font-black text-[10px] tracking-widest uppercase shadow-sm`}>
                          {statusLabels[event.status].label}
                        </div>
                        <div className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-900 font-black text-[10px] tracking-widest uppercase border border-slate-200">
                          {typeLabels[event.type]}
                        </div>
                      </div>

                      <h3 className="text-3xl md:text-4xl font-black text-slate-950 mb-8 tracking-tight">{event.title}</h3>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-1">
                              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Datum konání</div>
                              <p className="text-lg font-bold text-slate-800">
                                {new Date(event.startDate).toLocaleDateString('cs-CZ')}
                                {event.startDate !== event.endDate &&
                                  ` – ${new Date(event.endDate).toLocaleDateString('cs-CZ')}`}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lokalita</div>
                              <p className="text-lg font-bold text-slate-800">{event.location}</p>
                            </div>
                            <div className="space-y-1">
                              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cena</div>
                              <p className="text-lg font-bold text-[#0070af]">
                                {event.price && event.price > 0 ? `${event.price.toLocaleString()} Kč` : 'Zdarma / Neuvedeno'}
                              </p>
                            </div>
                            {event.maxParticipants && (
                              <div className="space-y-1">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Obsazenost</div>
                                <p className="text-lg font-bold text-slate-800">{event.currentParticipants || 0} / {event.maxParticipants} míst</p>
                              </div>
                            )}
                          </div>
                          
                          {event.maxParticipants && (
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-[#0070af] transition-all duration-1000" 
                                  style={{ width: `${((event.currentParticipants || 0) / event.maxParticipants) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-4">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Popis akce</div>
                          <p className="text-slate-700 leading-relaxed font-medium">{event.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
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
                <p className="text-white text-lg font-medium leading-relaxed">
                  Rádi vám poskytneme podrobnější informace o připravovaných akcích, výletech i táborech.
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
                <div className="space-y-8">
                  <div>
                    <div className="text-[10px] font-black text-slate-100 uppercase tracking-[0.2em] mb-4">Hlavní kontakt</div>
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 bg-[#0070af] rounded-3xl flex items-center justify-center text-white shadow-xl shadow-[#0070af]/20">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                       </div>
                       <div>
                          <div className="text-white font-black text-xl">Mgr. Ladislav Mareš</div>
                          <div className="text-slate-100 font-bold">Vedoucí PS Pacov</div>
                       </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-white/10">
                    <a href="mailto:mareseznam@seznam.cz" className="flex flex-col gap-2 hover:opacity-80 transition-opacity">
                      <span className="text-[10px] font-black text-slate-100 uppercase tracking-widest">Email</span>
                      <span className="text-white font-bold">mareseznam@seznam.cz</span>
                    </a>
                    <a href="tel:+420607244526" className="flex flex-col gap-2 hover:opacity-80 transition-opacity">
                      <span className="text-[10px] font-black text-slate-100 uppercase tracking-widest">Telefon</span>
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
