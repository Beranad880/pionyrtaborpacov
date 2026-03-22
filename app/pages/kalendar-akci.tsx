'use client';

import { useState, useEffect } from 'react';

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

const MONTHS_CS = ['Leden','Únor','Březen','Duben','Květen','Červen',
                   'Červenec','Srpen','Září','Říjen','Listopad','Prosinec'];
const DAYS_CS = ['Po','Út','St','Čt','Pá','So','Ne'];

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
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Kalendář akcí</h1>
        <div className="animate-pulse space-y-4">
          <div className="bg-white border rounded-xl h-80"></div>
          {[1,2,3].map(i => (
            <div key={i} className="bg-white border-l-4 border-gray-300 p-6 shadow-sm h-24"></div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Kalendář akcí</h1>
      <p className="text-lg text-gray-700 mb-8">
        Přehled akcí, táborů a aktivit naší pionýrské skupiny.
      </p>

      {/* ── Vizuální kalendář ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
        {/* Navigace */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors text-xl font-bold text-gray-600"
          >
            ‹
          </button>
          <h2 className="text-xl font-semibold text-gray-900">
            {MONTHS_CS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h2>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors text-xl font-bold text-gray-600"
          >
            ›
          </button>
        </div>

        {/* Záhlaví dnů */}
        <div className="grid grid-cols-7 border-b bg-gray-50">
          {DAYS_CS.map(day => (
            <div key={day} className="py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
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
                className={`min-h-[72px] md:min-h-[90px] border-r border-b p-1 transition-colors ${
                  !date   ? 'bg-gray-50' :
                  isToday ? 'ring-2 ring-inset ring-blue-500 ' + (hasEvents ? eventTypeColors[primaryType].cell : 'bg-blue-50') :
                  hasEvents ? eventTypeColors[primaryType].cell :
                  isWeekend ? 'bg-gray-50/60' : 'bg-white'
                }`}
              >
                {date && (
                  <>
                    <div className={`text-xs md:text-sm font-bold mb-0.5 w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full ${
                      isToday
                        ? 'bg-blue-600 text-white'
                        : hasEvents
                          ? eventTypeColors[primaryType].bg + ' ' + eventTypeColors[primaryType].text
                          : 'text-gray-500'
                    }`}>
                      {date.getDate()}
                    </div>
                    <div className="space-y-0.5">
                      {dayEvents.slice(0, 2).map(event => (
                        <button
                          key={event._id}
                          onClick={() => setSelectedEvent(event)}
                          title={event.title}
                          className={`w-full text-left text-[10px] md:text-xs px-1 py-0.5 rounded truncate font-semibold ${eventTypeColors[event.type].bg} ${eventTypeColors[event.type].text} hover:opacity-80 transition-opacity shadow-sm`}
                        >
                          {event.title}
                        </button>
                      ))}
                      {dayEvents.length > 2 && (
                        <p className={`text-[10px] font-medium px-1 ${hasEvents ? eventTypeColors[primaryType].cellText : 'text-gray-400'}`}>
                          +{dayEvents.length - 2} další
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
      <div className="flex flex-wrap gap-4 mb-8">
        {(Object.entries(typeLabels) as [Event['type'], string][]).map(([type, label]) => (
          <div key={type} className="flex items-center gap-1.5 text-sm text-gray-600">
            <div className={`w-3 h-3 rounded-full flex-shrink-0 ${eventTypeColors[type].dot}`}></div>
            {label}
          </div>
        ))}
      </div>

      {/* ── Detail vybrané akce ── */}
      {selectedEvent && (
        <div className={`bg-white border-l-4 ${eventTypeColors[selectedEvent.type].border} p-6 shadow-sm mb-8 rounded-r-xl`}>
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-semibold text-gray-900">{selectedEvent.title}</h3>
            <button
              onClick={() => setSelectedEvent(null)}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none ml-4"
            >
              ×
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1 text-gray-600">
              <p>
                <strong>Datum:</strong>{' '}
                {new Date(selectedEvent.startDate).toLocaleDateString('cs-CZ')}
                {selectedEvent.startDate !== selectedEvent.endDate &&
                  ` – ${new Date(selectedEvent.endDate).toLocaleDateString('cs-CZ')}`}
              </p>
              <p><strong>Místo:</strong> {selectedEvent.location}</p>
              <p><strong>Typ:</strong> {typeLabels[selectedEvent.type]}</p>
              {selectedEvent.price && selectedEvent.price > 0 && (
                <p><strong>Cena:</strong> {selectedEvent.price} Kč</p>
              )}
              {selectedEvent.maxParticipants && (
                <p><strong>Kapacita:</strong> {selectedEvent.currentParticipants || 0}/{selectedEvent.maxParticipants} účastníků</p>
              )}
              {selectedEvent.registrationDeadline && (
                <p><strong>Uzávěrka přihlášek:</strong>{' '}
                  {new Date(selectedEvent.registrationDeadline).toLocaleDateString('cs-CZ')}
                </p>
              )}
            </div>
            <p className="text-gray-700">{selectedEvent.description}</p>
          </div>
          <div className="mt-4">
            <span className={`inline-block px-3 py-1 rounded-full text-sm ${statusLabels[selectedEvent.status].color}`}>
              {statusLabels[selectedEvent.status].label}
            </span>
          </div>
        </div>
      )}

      {/* ── Nadcházející akce (seznam) ── */}
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Nadcházející akce</h2>
      {upcomingEvents.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded-lg text-center mb-8">
          <p className="text-gray-600">Momentálně nejsou plánovány žádné veřejné akce.</p>
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {upcomingEvents.map(event => (
            <button
              key={event._id}
              onClick={() => setSelectedEvent(event)}
              className={`w-full text-left bg-white border-l-4 ${eventTypeColors[event.type].border} p-5 shadow-sm rounded-r-lg hover:shadow-md transition-shadow`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{event.title}</h3>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    <span>
                      📅 {new Date(event.startDate).toLocaleDateString('cs-CZ')}
                      {event.startDate !== event.endDate &&
                        ` – ${new Date(event.endDate).toLocaleDateString('cs-CZ')}`}
                    </span>
                    <span>📍 {event.location}</span>
                    {event.price && event.price > 0 && <span>💰 {event.price} Kč</span>}
                    {event.maxParticipants && (
                      <span>👥 {event.currentParticipants || 0}/{event.maxParticipants}</span>
                    )}
                  </div>
                  {event.description && (
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{event.description}</p>
                  )}
                </div>
                <div className="mt-3 md:mt-0 md:ml-4 flex-shrink-0">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${statusLabels[event.status].color}`}>
                    {statusLabels[event.status].label}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ── Kontakt ── */}
      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Informace o přihlašování</h2>
        <p className="text-gray-700 mb-3">
          Pro přihlášení na naše akce nebo pro získání více informací nás kontaktujte:
        </p>
        <div className="space-y-1 text-sm">
          <p><strong>Email:</strong> mareseznam@seznam.cz</p>
          <p><strong>Telefon:</strong> +420 607 244 526</p>
          <p><strong>Vedoucí:</strong> Mgr. Ladislav Mareš</p>
        </div>
      </div>
    </main>
  );
}
