'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
  adminNotes?: string;
  processedBy?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

const facilityNames: Record<string, string> = {
  kitchen: 'Kuchyně',
  wifi: 'Wi-Fi',
  fireplace: 'Krb',
  parking: 'Parkování',
  heating: 'Topení',
  electricity: 'Elektřina',
  water: 'Voda',
  outdoor_grill: 'Venkovní gril',
  sports_equipment: 'Sportovní vybavení'
};

const statusNames: Record<string, string> = {
  pending: 'Čekající',
  approved: 'Schváleno',
  rejected: 'Odmítnuto'
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  approved: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200'
};

export default function RentalRequestsAdmin() {
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedRequest, setSelectedRequest] = useState<RentalRequest | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      router.push('/admin');
      return;
    }
    fetchRequests();
  }, [filter, currentPage, router]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/rental-requests?status=${filter}&page=${currentPage}&limit=10`);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setRequests(result.data.requests || []);
          setTotalPages(result.data.pagination.pages || 1);
        }
      }
    } catch (error) {
      console.error('Failed to fetch rental requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (requestId: string, newStatus: 'approved' | 'rejected', notes: string = '') => {
    setIsProcessing(true);
    try {
      const response = await fetch(`/api/admin/rental-requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          adminNotes: notes,
          processedBy: 'Admin'
        }),
      });

      if (response.ok) {
        fetchRequests();
        setShowModal(false);
        setSelectedRequest(null);
        setAdminNotes('');
      } else {
        alert('Chyba při aktualizaci žádosti');
      }
    } catch (error) {
      console.error('Error updating rental request:', error);
      alert('Chyba při aktualizaci žádosti');
    } finally {
      setIsProcessing(false);
    }
  };

  const openModal = (request: RentalRequest) => {
    setSelectedRequest(request);
    setAdminNotes(request.adminNotes || '');
    setShowModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('cs-CZ');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('cs-CZ');
  };

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Žádosti o pronájem</h1>
            <button
              onClick={() => router.push('/admin')}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              ← Zpět do adminu
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {status === 'all' ? 'Všechny' : statusNames[status]}
            </button>
          ))}
        </div>

        {/* Requests List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Načítání žádostí...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">Žádné žádosti nebyly nalezeny.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{request.name}</h3>
                      <p className="text-gray-600">{request.email} • {request.phone}</p>
                      {request.organization && (
                        <p className="text-gray-600">{request.organization}</p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[request.status]}`}>
                      {statusNames[request.status]}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Pobyt</h4>
                      <p className="text-gray-600">
                        {formatDate(request.startDate)} - {formatDate(request.endDate)}
                        <span className="text-gray-500"> ({calculateDays(request.startDate, request.endDate)} dní)</span>
                      </p>
                      <p className="text-gray-600">Počet hostů: {request.guestCount}</p>
                      <p className="text-gray-600">Účel: {request.purpose}</p>
                    </div>

                    {request.facilities.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Požadované vybavení</h4>
                        <div className="flex flex-wrap gap-1">
                          {request.facilities.map((facility, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                            >
                              {facilityNames[facility] || facility}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {request.message && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Zpráva</h4>
                      <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{request.message}</p>
                    </div>
                  )}

                  {request.adminNotes && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Poznámky administrátora</h4>
                      <p className="text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">{request.adminNotes}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      <p>Vytvořeno: {formatDateTime(request.createdAt)}</p>
                      {request.processedAt && request.processedBy && (
                        <p>Zpracováno: {formatDateTime(request.processedAt)} ({request.processedBy})</p>
                      )}
                    </div>

                    {request.status === 'pending' && (
                      <button
                        onClick={() => openModal(request)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        Zpracovat
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Předchozí
            </button>

            <span className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              {currentPage} z {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Další →
            </button>
          </div>
        )}
      </div>

      {/* Modal for processing requests */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Zpracovat žádost</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">{selectedRequest.name}</h4>
                <p className="text-sm text-gray-600">
                  {formatDate(selectedRequest.startDate)} - {formatDate(selectedRequest.endDate)}
                  ({calculateDays(selectedRequest.startDate, selectedRequest.endDate)} dní)
                </p>
                <p className="text-sm text-gray-600">Počet hostů: {selectedRequest.guestCount}</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Poznámky administrátora
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Přidejte poznámky k žádosti..."
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => handleStatusChange(selectedRequest._id, 'approved', adminNotes)}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isProcessing ? 'Zpracování...' : 'Schválit'}
                </button>
                <button
                  onClick={() => handleStatusChange(selectedRequest._id, 'rejected', adminNotes)}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isProcessing ? 'Zpracování...' : 'Odmítnout'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}