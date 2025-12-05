'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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
  createdAt: string;
}

const eventTypes = {
  'camp': { label: 'Tábor', color: 'bg-green-100 text-green-800', icon: '🏕️' },
  'meeting': { label: 'Schůzka', color: 'bg-blue-100 text-blue-800', icon: '👥' },
  'trip': { label: 'Výlet', color: 'bg-purple-100 text-purple-800', icon: '🥾' },
  'workshop': { label: 'Dílna', color: 'bg-orange-100 text-orange-800', icon: '🛠️' },
  'competition': { label: 'Soutěž', color: 'bg-red-100 text-red-800', icon: '🏆' },
  'other': { label: 'Ostatní', color: 'bg-gray-100 text-gray-800', icon: '📅' }
};

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  // Sample events with confirmed/public status
  const sampleEvents: Event[] = [
    {
      _id: '1',
      title: 'Letní tábor 2025',
      description: 'Tradiční dvoutýdenní letní tábor na Hájence Bělá. Program plný her, sportů a dobrodružství pro děti 7-15 let.',
      startDate: '2025-07-14',
      endDate: '2025-07-28',
      type: 'camp',
      location: 'Hájenka Bělá',
      maxParticipants: 30,
      currentParticipants: 18,
      registrationDeadline: '2025-06-01',
      organizer: 'Vedení skupiny',
      status: 'confirmed',
      isPublic: true,
      createdAt: '2024-12-01'
    },
    {
      _id: '2',
      title: 'Vánoční schůzka',
      description: 'Společné posezení u vánočního stromečku s programem a dárečky pro děti. Čekají nás hry, zpěv koled a překvapení.',
      startDate: '2024-12-20',
      endDate: '2024-12-20',
      type: 'meeting',
      location: 'Kulturní dům Pacov',
      maxParticipants: 50,
      currentParticipants: 32,
      organizer: 'Marie Svobodová',
      status: 'confirmed',
      isPublic: true,
      createdAt: '2024-11-15'
    },
    {
      _id: '3',
      title: 'Zimní výstup na Blanský les',
      description: 'Jednodenní výlet na rozhlednu s piknikem. Podle počasí možnost lyžování či běžek. S sebou teplé oblečení.',
      startDate: '2025-01-18',
      endDate: '2025-01-18',
      type: 'trip',
      location: 'Blanský les - rozhledna',
      maxParticipants: 25,
      currentParticipants: 12,
      organizer: 'Pavel Novák',
      status: 'confirmed',
      isPublic: true,
      createdAt: '2024-12-01'
    },
    {
      _id: '4',
      title: 'Rukodělná dílna',
      description: 'Workshop na výrobu jednoduchých dřevěných hraček a dekorací. Vhodné i pro rodiče s dětmi.',
      startDate: '2025-02-08',
      endDate: '2025-02-08',
      type: 'workshop',
      location: 'Hájenka Bělá',
      maxParticipants: 15,
      currentParticipants: 8,
      organizer: 'Jana Dvořáková',
      status: 'confirmed',
      isPublic: true,
      createdAt: '2024-11-28'
    },
    {
      _id: '5',
      title: 'Jarní úklid Hájenky',
      description: 'Společný úklid a příprava táborové základny na novou sezónu. Pomoc rodičů vítána!',
      startDate: '2025-03-15',
      endDate: '2025-03-15',
      type: 'other',
      location: 'Hájenka Bělá',
      organizer: 'Vedení skupiny',
      status: 'confirmed',
      isPublic: true,
      createdAt: '2024-12-01'
    }
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/admin/events');
      const result = await response.json();

      if (result.success) {
        // Filter only public and confirmed events
        const publicEvents = result.data.events.filter((event: Event) =>
          event.isPublic && (event.status === 'confirmed' || event.status === 'planned')
        );
        setEvents(publicEvents);
      } else {
        // Fallback to sample data
        setEvents(sampleEvents);
      }
    } catch (error) {
      console.log('Using sample data');
      setEvents(sampleEvents);
    } finally {
      setLoading(false);
    }
  };

  const getTypeInfo = (type: string) => {
    return eventTypes[type as keyof typeof eventTypes] || eventTypes.other;
  };

  const filteredEvents = events.filter(event => {
    if (filterType === 'all') return true;
    return event.type === filterType;
  });

  const upcomingEvents = filteredEvents.filter(e => new Date(e.startDate) >= new Date());
  const pastEvents = filteredEvents.filter(e => new Date(e.startDate) < new Date());

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('cs-CZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateRange = (start: string, end: string) => {
    if (start === end) {
      return formatDate(start);
    }
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold text-red-600">
                Pionýrská skupina Pacov
              </Link>
              <nav className="hidden md:flex space-x-8">
                <Link href="/" className="text-slate-600 hover:text-red-600 transition-colors">
                  Domů
                </Link>
                <Link href="/calendar" className="text-red-600 font-medium">
                  Kalendář
                </Link>
                <Link href="/articles" className="text-slate-600 hover:text-red-600 transition-colors">
                  Články
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="animate-pulse space-y-6">
                <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white rounded-xl p-6 shadow-sm border h-32"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-red-600">
              Pionýrská skupina Pacov
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-slate-600 hover:text-red-600 transition-colors">
                Domů
              </Link>
              <Link href="/calendar" className="text-red-600 font-medium">
                Kalendář
              </Link>
              <Link href="/articles" className="text-slate-600 hover:text-red-600 transition-colors">
                Články
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-slate-800 mb-4">
                Kalendář akcí
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Přehled všech našich akcí, táborů, výletů a setkání. Přihlašte se včas!
              </p>
            </div>

            {/* Type Filter */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterType === 'all'
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-red-50'
                  }`}
                >
                  Všechny akce
                </button>
                {Object.entries(eventTypes).map(([key, type]) => (
                  <button
                    key={key}
                    onClick={() => setFilterType(key)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filterType === key
                        ? 'bg-red-600 text-white'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-red-50'
                    }`}
                  >
                    {type.icon} {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">
                  Nadcházející akce
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((event) => {
                    const typeInfo = getTypeInfo(event.type);
                    return (
                      <div
                        key={event._id}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="p-6">
                          {/* Event Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${typeInfo.color}`}>
                                  {typeInfo.icon} {typeInfo.label}
                                </span>
                              </div>
                              <h3 className="text-lg font-bold text-slate-800 mb-2">
                                {event.title}
                              </h3>
                            </div>
                          </div>

                          {/* Event Details */}
                          <div className="space-y-3 text-sm">
                            <div className="flex items-center text-slate-600">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {formatDateRange(event.startDate, event.endDate)}
                            </div>

                            <div className="flex items-center text-slate-600">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {event.location}
                            </div>

                            {event.maxParticipants && (
                              <div className="flex items-center text-slate-600">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                                {event.currentParticipants || 0} / {event.maxParticipants} účastníků
                              </div>
                            )}
                          </div>

                          {/* Event Description */}
                          <p className="text-slate-600 text-sm mt-4 line-clamp-2">
                            {event.description}
                          </p>

                          {/* Registration Info */}
                          {event.registrationDeadline && new Date(event.registrationDeadline) > new Date() && (
                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <p className="text-sm text-yellow-800">
                                <strong>Uzávěrka přihlášek:</strong> {formatDate(event.registrationDeadline)}
                              </p>
                            </div>
                          )}

                          <div className="mt-4">
                            <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                              Zobrazit detail
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Past Events */}
            {pastEvents.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">
                  Minulé akce
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastEvents.slice(0, 6).map((event) => {
                    const typeInfo = getTypeInfo(event.type);
                    return (
                      <div
                        key={event._id}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="p-6">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${typeInfo.color}`}>
                              {typeInfo.icon} {typeInfo.label}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-slate-700 mb-2">
                            {event.title}
                          </h3>
                          <div className="text-sm text-slate-600 space-y-1">
                            <p>{formatDateRange(event.startDate, event.endDate)}</p>
                            <p>{event.location}</p>
                            {event.currentParticipants && (
                              <p>{event.currentParticipants} účastníků</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* No Events */}
            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  Žádné akce nenalezeny
                </h3>
                <p className="text-slate-600">
                  {filterType === 'all'
                    ? 'Aktuálně nejsou naplánované žádné veřejné akce.'
                    : `Aktuálně nejsou naplánované žádné akce typu "${eventTypes[filterType as keyof typeof eventTypes]?.label}".`
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Detail akce</h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-slate-500 hover:text-slate-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Event Header */}
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeInfo(selectedEvent.type).color}`}>
                      {getTypeInfo(selectedEvent.type).icon} {getTypeInfo(selectedEvent.type).label}
                    </span>
                  </div>
                  <h4 className="text-2xl font-bold text-slate-800 mb-4">
                    {selectedEvent.title}
                  </h4>
                </div>

                {/* Event Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Termín
                    </label>
                    <p className="text-slate-900">
                      {formatDateRange(selectedEvent.startDate, selectedEvent.endDate)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Místo konání
                    </label>
                    <p className="text-slate-900">{selectedEvent.location}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Organizátor
                    </label>
                    <p className="text-slate-900">{selectedEvent.organizer}</p>
                  </div>

                  {selectedEvent.maxParticipants && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Účastníci
                      </label>
                      <p className="text-slate-900">
                        {selectedEvent.currentParticipants || 0} / {selectedEvent.maxParticipants}
                      </p>
                    </div>
                  )}
                </div>

                {selectedEvent.registrationDeadline && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Uzávěrka přihlášek
                    </label>
                    <p className="text-slate-900">{formatDate(selectedEvent.registrationDeadline)}</p>
                  </div>
                )}

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Popis akce
                  </label>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-slate-900 leading-relaxed">
                      {selectedEvent.description}
                    </p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="font-semibold text-blue-800 mb-2">
                    Chcete se přihlásit?
                  </h5>
                  <p className="text-blue-700 text-sm">
                    Kontaktujte organizátora <strong>{selectedEvent.organizer}</strong> nebo nás napište na email.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}