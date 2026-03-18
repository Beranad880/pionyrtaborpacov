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
  createdAt: string;
}

const eventTypes = [
  { value: 'camp', label: 'Tábor', color: 'bg-green-100 text-green-800' },
  { value: 'meeting', label: 'Schůzka', color: 'bg-blue-100 text-blue-800' },
  { value: 'trip', label: 'Výlet', color: 'bg-purple-100 text-purple-800' },
  { value: 'workshop', label: 'Dílna', color: 'bg-orange-100 text-orange-800' },
  { value: 'competition', label: 'Soutěž', color: 'bg-red-100 text-red-800' },
  { value: 'other', label: 'Ostatní', color: 'bg-gray-100 text-gray-800' }
];

const eventStatuses = [
  { value: 'planned', label: 'Plánováno', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'confirmed', label: 'Potvrzeno', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Zrušeno', color: 'bg-red-100 text-red-800' },
  { value: 'completed', label: 'Dokončeno', color: 'bg-gray-100 text-gray-800' }
];

export default function CalendarAdminPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    type: 'meeting',
    organizer: '',
    maxParticipants: '',
    registrationDeadline: '',
    isPublic: true,
    price: '',
  });

  // Sample events for demonstration
  const sampleEvents: Event[] = [
    {
      _id: '1',
      title: 'Letní tábor 2025',
      description: 'Tradiční dvoutýdenní letní tábor na Hájence Bělá. Program plný her, sportů a dobrodružství.',
      startDate: '2025-07-14',
      endDate: '2025-07-28',
      type: 'camp',
      location: 'Hájenka Bělá',
      maxParticipants: 30,
      currentParticipants: 18,
      registrationDeadline: '2025-06-01',
      organizer: 'Vedení skupiny',
      status: 'planned',
      isPublic: true,
      createdAt: '2024-12-01'
    },
    {
      _id: '2',
      title: 'Vánoční schůzka',
      description: 'Společné posezení u vánočního stromečku s programem a dárečky pro děti.',
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
      description: 'Jednodenní výlet na rozhlednu s piknikem. Podle počasí možnost lyžování.',
      startDate: '2025-01-18',
      endDate: '2025-01-18',
      type: 'trip',
      location: 'Blanský les - rozhledna',
      maxParticipants: 25,
      currentParticipants: 12,
      organizer: 'Pavel Novák',
      status: 'planned',
      isPublic: true,
      createdAt: '2024-12-01'
    },
    {
      _id: '4',
      title: 'Rukodělná dílna',
      description: 'Workshop na výrobu jednoduchých dřevěných hraček a dekorací.',
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
    }
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/events');
      const result = await response.json();

      if (result.success) {
        setEvents(result.data.events);
      } else {
        console.error('Failed to fetch events:', result.message);
        // Fallback to sample data
        setEvents(sampleEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      // Fallback to sample data
      setEvents(sampleEvents);
    } finally {
      setLoading(false);
    }
  };

  const getTypeInfo = (type: string) => {
    return eventTypes.find(t => t.value === type) || eventTypes[eventTypes.length - 1];
  };

  const getStatusInfo = (status: string) => {
    return eventStatuses.find(s => s.value === status) || eventStatuses[0];
  };

  const updateEventStatus = async (id: string, status: Event['status']) => {
    try {
      // Try API first, fallback to local state update if API fails
      const response = await fetch(`/api/admin/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setEvents(prev =>
            prev.map(event =>
              event._id === id ? { ...event, status } : event
            )
          );
          return;
        }
      }

      // Fallback: Update local state directly (for sample data)
      setEvents(prev =>
        prev.map(event =>
          event._id === id ? { ...event, status } : event
        )
      );

    } catch (error) {
      // Fallback: Update local state directly (for sample data)
      console.log('API not available, updating local state');
      setEvents(prev =>
        prev.map(event =>
          event._id === id ? { ...event, status } : event
        )
      );
    }
  };

  const deleteEvent = async (id: string) => {
    if (confirm('Opravdu chcete tuto akci smazat?')) {
      try {
        // Try API first, fallback to local state update if API fails
        const response = await fetch(`/api/admin/events/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setEvents(prev => prev.filter(event => event._id !== id));
            setSelectedEvent(null);
            return;
          }
        }

        // Fallback: Update local state directly (for sample data)
        setEvents(prev => prev.filter(event => event._id !== id));
        setSelectedEvent(null);

      } catch (error) {
        // Fallback: Update local state directly (for sample data)
        console.log('API not available, updating local state');
        setEvents(prev => prev.filter(event => event._id !== id));
        setSelectedEvent(null);
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
          price: formData.price ? parseFloat(formData.price) : undefined,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setEvents(prev => [result.data, ...prev]);
        setShowAddForm(false);
        setFormData({
          title: '',
          description: '',
          startDate: '',
          endDate: '',
          location: '',
          type: 'meeting',
          organizer: '',
          maxParticipants: '',
          registrationDeadline: '',
          isPublic: true,
          price: '',
        });
      } else {
        alert(`Chyba: ${result.message}`);
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Chyba při vytváření akce');
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Kalendář akcí</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  const upcomingEvents = events.filter(e => new Date(e.startDate) >= new Date() && e.status !== 'cancelled');
  const pastEvents = events.filter(e => new Date(e.startDate) < new Date() || e.status === 'completed');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Kalendář akcí</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Přidat akci
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">📅</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Nadchází</h3>
              <p className="text-2xl font-semibold text-gray-900">{upcomingEvents.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold">✅</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Potvrzeno</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {events.filter(e => e.status === 'confirmed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-semibold">👥</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Účastníci</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {events.reduce((sum, e) => sum + (e.currentParticipants || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-semibold">🏕️</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Tábory</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {events.filter(e => e.type === 'camp').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Nadcházející akce</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {upcomingEvents.map((event) => (
            <div key={event._id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeInfo(event.type).color}`}>
                      {getTypeInfo(event.type).label}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusInfo(event.status).color}`}>
                      {getStatusInfo(event.status).label}
                    </span>
                    {!event.isPublic && (
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                        Soukromé
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Termín:</span><br/>
                      {new Date(event.startDate).toLocaleDateString('cs-CZ')}
                      {event.startDate !== event.endDate && ` - ${new Date(event.endDate).toLocaleDateString('cs-CZ')}`}
                    </div>
                    <div>
                      <span className="font-medium">Místo:</span><br/>
                      {event.location}
                    </div>
                    <div>
                      <span className="font-medium">Účastníci:</span><br/>
                      {event.currentParticipants || 0}/{event.maxParticipants || '∞'}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600">{event.description}</p>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
                  >
                    Detail
                  </button>
                  {event.status === 'planned' && (
                    <button
                      onClick={() => updateEventStatus(event._id, 'confirmed')}
                      className="px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
                    >
                      Potvrdit
                    </button>
                  )}
                  <button
                    onClick={() => deleteEvent(event._id)}
                    className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
                  >
                    Smazat
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Minulé akce</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {pastEvents.slice(0, 5).map((event) => (
              <div key={event._id} className="p-6 opacity-75">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-700">{event.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeInfo(event.type).color}`}>
                        {getTypeInfo(event.type).label}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(event.startDate).toLocaleDateString('cs-CZ')} • {event.location}
                      {event.currentParticipants && ` • ${event.currentParticipants} účastníků`}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  >
                    Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Detail akce</h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">{selectedEvent.title}</h4>
                <div className="flex space-x-2 mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeInfo(selectedEvent.type).color}`}>
                    {getTypeInfo(selectedEvent.type).label}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusInfo(selectedEvent.status).color}`}>
                    {getStatusInfo(selectedEvent.status).label}
                  </span>
                  {!selectedEvent.isPublic && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                      Soukromé
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Začátek</label>
                  <p className="text-gray-900">{new Date(selectedEvent.startDate).toLocaleDateString('cs-CZ')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Konec</label>
                  <p className="text-gray-900">{new Date(selectedEvent.endDate).toLocaleDateString('cs-CZ')}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Místo konání</label>
                <p className="text-gray-900">{selectedEvent.location}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Organizátor</label>
                  <p className="text-gray-900">{selectedEvent.organizer}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Účastníci</label>
                  <p className="text-gray-900">
                    {selectedEvent.currentParticipants || 0}
                    {selectedEvent.maxParticipants && ` / ${selectedEvent.maxParticipants}`}
                  </p>
                </div>
              </div>

              {selectedEvent.registrationDeadline && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Uzávěrka přihlášek</label>
                  <p className="text-gray-900">{new Date(selectedEvent.registrationDeadline).toLocaleDateString('cs-CZ')}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Popis</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded">{selectedEvent.description}</p>
              </div>

              <div className="flex space-x-3 pt-4 border-t">
                {selectedEvent.status === 'planned' && (
                  <button
                    onClick={() => {
                      updateEventStatus(selectedEvent._id, 'confirmed');
                      setSelectedEvent(null);
                    }}
                    className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
                  >
                    Potvrdit akci
                  </button>
                )}
                <button
                  onClick={() => {
                    deleteEvent(selectedEvent._id);
                  }}
                  className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
                >
                  Smazat akci
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Event Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Přidat novou akci</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Název akce *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Např. Letní tábor 2025"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Typ akce *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleFormChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {eventTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Popis akce *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  required
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Popis akce, program, co si vzít s sebou..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Datum začátku *
                  </label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleFormChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Datum konce *
                  </label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleFormChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Místo konání *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleFormChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Hájenka Bělá, Blanský les..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organizátor *
                  </label>
                  <input
                    type="text"
                    name="organizer"
                    value={formData.organizer}
                    onChange={handleFormChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Vedení skupiny"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max. účastníků
                  </label>
                  <input
                    type="number"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleFormChange}
                    onFocus={(e) => e.target.select()}
                    min="1"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cena (Kč)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    onFocus={(e) => e.target.select()}
                    min="0"
                    step="0.01"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Uzávěrka přihlášek
                  </label>
                  <input
                    type="date"
                    name="registrationDeadline"
                    value={formData.registrationDeadline}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isPublic"
                  id="isPublic"
                  checked={formData.isPublic}
                  onChange={handleFormChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
                  Veřejná akce (zobrazit na webu)
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                >
                  Zrušit
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
                >
                  Vytvořit akci
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}