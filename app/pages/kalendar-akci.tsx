'use client';

import { useState, useEffect } from 'react';
import { Metadata } from 'next';

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
  camp: 'border-red-500',
  meeting: 'border-blue-500',
  trip: 'border-green-500',
  workshop: 'border-orange-500',
  competition: 'border-purple-500',
  other: 'border-gray-500'
};

const statusLabels = {
  planned: { label: 'Plánováno', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Přihlašování otevřeno', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Zrušeno', color: 'bg-red-100 text-red-800' },
  completed: { label: 'Ukončeno', color: 'bg-gray-100 text-gray-800' }
};

export default function KalendarAkciPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events?upcoming=true');
        const result = await response.json();

        if (result.success) {
          setEvents(result.data.events);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Kalendář akcí</h1>
        <div className="animate-pulse space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white border-l-4 border-gray-300 p-6 shadow-sm h-32"></div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Kalendář akcí</h1>

      <div className="prose max-w-none">
        <p className="text-lg text-gray-700 mb-8">
          Zde najdete přehled všech nadcházejících akcí, táborů a aktivit naší pionýrské skupiny.
        </p>

        {events.length === 0 ? (
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <p className="text-gray-600">Momentálně nejsou plánovány žádné veřejné akce.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {events.map((event) => (
              <div key={event._id} className={`bg-white border-l-4 ${eventTypeColors[event.type]} p-6 shadow-sm`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-gray-600 mb-2">
                      <strong>Datum:</strong> {new Date(event.startDate).toLocaleDateString('cs-CZ')}
                      {event.startDate !== event.endDate && ` - ${new Date(event.endDate).toLocaleDateString('cs-CZ')}`}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <strong>Místo:</strong> {event.location}
                    </p>
                    {event.maxParticipants && (
                      <p className="text-gray-600 mb-2">
                        <strong>Kapacita:</strong> {event.currentParticipants || 0}/{event.maxParticipants} účastníků
                      </p>
                    )}
                    {event.price && event.price > 0 && (
                      <p className="text-gray-600 mb-2">
                        <strong>Cena:</strong> {event.price} Kč
                      </p>
                    )}
                    <p className="text-gray-700">
                      {event.description}
                    </p>
                    {event.registrationDeadline && (
                      <p className="text-sm text-gray-500 mt-2">
                        <strong>Uzávěrka přihlášek:</strong> {new Date(event.registrationDeadline).toLocaleDateString('cs-CZ')}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 md:mt-0">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${statusLabels[event.status].color}`}>
                      {statusLabels[event.status].label}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Informace o přihlašování</h2>
          <p className="text-gray-700 mb-3">
            Pro přihlášení na naše akce nebo pro získání více informací nás kontaktujte:
          </p>
          <div className="space-y-1">
            <p><strong>Email:</strong> mareseznam@seznam.cz</p>
            <p><strong>Telefon:</strong> +420 607 244 526</p>
            <p><strong>Vedoucí:</strong> Mgr. Ladislav Mareš</p>
          </div>
        </div>
    </main>
  );
}