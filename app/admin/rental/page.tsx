'use client';

import { useState, useEffect } from 'react';

interface RentalRequest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  organization?: string;
  startDate: string;
  endDate: string;
  guestCount: number;
  purpose: string;
  facilities: string[];
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function RentalAdminPage() {
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<RentalRequest | null>(null);

  // Sample data for demonstration
  const sampleRequests: RentalRequest[] = [
    {
      _id: '1',
      name: 'Jan Novák',
      email: 'jan.novak@email.cz',
      phone: '+420 123 456 789',
      organization: 'Skautský oddíl Tábor',
      startDate: '2024-07-15',
      endDate: '2024-07-22',
      guestCount: 25,
      purpose: 'Letní tábor pro děti',
      facilities: ['kitchen', 'wifi', 'fireplace'],
      message: 'Potřebovali bychom celou hájenku na týden. Máme zkušenosti s provozem táborů.',
      status: 'pending',
      createdAt: '2024-12-01'
    },
    {
      _id: '2',
      name: 'Marie Svobodová',
      email: 'marie.s@firma.cz',
      phone: '+420 987 654 321',
      organization: 'Firma XYZ',
      startDate: '2024-06-10',
      endDate: '2024-06-12',
      guestCount: 15,
      purpose: 'Firemní teambuilding',
      facilities: ['kitchen', 'wifi'],
      message: 'Rádi bychom si pronajali hájenku na víkendový teambuilding.',
      status: 'approved',
      createdAt: '2024-11-28'
    },
    {
      _id: '3',
      name: 'Petr Černý',
      email: 'petr.cerny@email.cz',
      phone: '+420 555 666 777',
      startDate: '2024-08-01',
      endDate: '2024-08-05',
      guestCount: 35,
      purpose: 'Rodinná oslava',
      facilities: ['kitchen', 'fireplace', 'parking'],
      message: 'Slavíme 50. narozeniny, chtěli bychom udělat velkou rodinnou akci.',
      status: 'rejected',
      createdAt: '2024-11-25'
    }
  ];

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/rental-requests');
      const result = await response.json();

      if (result.success) {
        setRequests(result.data.requests);
      } else {
        console.error('Failed to fetch requests:', result.message);
        // Fallback to sample data
        setRequests(sampleRequests);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      // Fallback to sample data
      setRequests(sampleRequests);
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/admin/rental-requests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          processedBy: 'admin',
        }),
      });

      const result = await response.json();

      if (result.success) {
        setRequests(prev =>
          prev.map(req =>
            req._id === id ? { ...req, status } : req
          )
        );
        setSelectedRequest(null);
      } else {
        alert(`Chyba: ${result.message}`);
      }
    } catch (error) {
      console.error('Error updating request:', error);
      alert('Chyba při aktualizaci žádosti');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Čeká na vyřízení';
      case 'approved': return 'Schváleno';
      case 'rejected': return 'Zamítnuto';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Pronájem hájenky</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Pronájem hájenky</h1>
        <div className="flex space-x-2">
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
            {requests.filter(r => r.status === 'pending').length} čeká
          </span>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            {requests.filter(r => r.status === 'approved').length} schváleno
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Žádosti o pronájem</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {requests.map((request) => (
            <div key={request._id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900">{request.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {getStatusText(request.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Termín:</span><br/>
                      {new Date(request.startDate).toLocaleDateString('cs-CZ')} - {new Date(request.endDate).toLocaleDateString('cs-CZ')}
                    </div>
                    <div>
                      <span className="font-medium">Účastníků:</span><br/>
                      {request.guestCount} osob
                    </div>
                    <div>
                      <span className="font-medium">Účel:</span><br/>
                      {request.purpose}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Kontakt:</span> {request.email}, {request.phone}
                    {request.organization && <span> • {request.organization}</span>}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
                  >
                    Detail
                  </button>
                  {request.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateRequestStatus(request._id, 'approved')}
                        className="px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
                      >
                        Schválit
                      </button>
                      <button
                        onClick={() => updateRequestStatus(request._id, 'rejected')}
                        className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
                      >
                        Zamítnout
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Detail žádosti</h3>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Jméno</label>
                  <p className="text-gray-900">{selectedRequest.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                    {getStatusText(selectedRequest.status)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{selectedRequest.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefon</label>
                  <p className="text-gray-900">{selectedRequest.phone}</p>
                </div>
              </div>

              {selectedRequest.organization && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Organizace</label>
                  <p className="text-gray-900">{selectedRequest.organization}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Datum příjezdu</label>
                  <p className="text-gray-900">{new Date(selectedRequest.startDate).toLocaleDateString('cs-CZ')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Datum odjezdu</label>
                  <p className="text-gray-900">{new Date(selectedRequest.endDate).toLocaleDateString('cs-CZ')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Počet osob</label>
                  <p className="text-gray-900">{selectedRequest.guestCount}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Účel pobytu</label>
                  <p className="text-gray-900">{selectedRequest.purpose}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Požadované služby</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedRequest.facilities.map((facility, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {facility}
                    </span>
                  ))}
                </div>
              </div>

              {selectedRequest.message && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Zpráva</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded">{selectedRequest.message}</p>
                </div>
              )}

              {selectedRequest.status === 'pending' && (
                <div className="flex space-x-3 pt-4 border-t">
                  <button
                    onClick={() => updateRequestStatus(selectedRequest._id, 'approved')}
                    className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
                  >
                    Schválit žádost
                  </button>
                  <button
                    onClick={() => updateRequestStatus(selectedRequest._id, 'rejected')}
                    className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
                  >
                    Zamítnout žádost
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}