'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IRental } from '@/models/Rental';
import RentalForm from '@/components/RentalForm';

const statusNames: Record<string, string> = {
    confirmed: 'Potvrzeno',
    paid: 'Zaplaceno',
    completed: 'Dokončeno',
    cancelled: 'Zrušeno'
};

const statusColors: Record<string, string> = {
    confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
    paid: 'bg-green-100 text-green-800 border-green-200',
    completed: 'bg-gray-100 text-gray-800 border-gray-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200'
};

export default function RentalsAdminPage() {
  const [rentals, setRentals] = useState<IRental[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'paid' | 'completed' | 'cancelled'>('all');
  const [selectedRental, setSelectedRental] = useState<IRental | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    fetchRentals();
  }, [filter, currentPage]);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/rental?status=${filter}&page=${currentPage}&limit=10`);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setRentals(result.data.rentals || []);
          setTotalPages(result.data.pagination.pages || 1);
        }
      }
    } catch (error) {
      console.error('Failed to fetch rentals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRental = async (data: Partial<IRental>) => {
    setIsProcessing(true);
    const url = data._id ? `/api/admin/rental/${data._id}` : '/api/admin/rental';
    const method = data._id ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        fetchRentals();
        setShowForm(false);
        setSelectedRental(null);
      } else {
        const res = await response.json();
        alert(res.message || 'Chyba při ukládání pronájmu');
      }
    } catch (error) {
      console.error('Error saving rental:', error);
      alert('Chyba při ukládání pronájmu');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteRental = async (rentalId: string) => {
    if (confirm('Opravdu chcete tento pronájem smazat?')) {
        setIsProcessing(true);
        try {
          const response = await fetch(`/api/admin/rental/${rentalId}`, {
            method: 'DELETE',
          });
    
          if (response.ok) {
            fetchRentals();
          } else {
            alert('Chyba při mazání pronájmu');
          }
        } catch (error) {
          console.error('Error deleting rental:', error);
          alert('Chyba při mazání pronájmu');
        } finally {
          setIsProcessing(false);
        }
    }
  }

  const openForm = (rental: IRental | null) => {
    setSelectedRental(rental);
    setShowForm(true);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('cs-CZ');
  };

  const calculateDays = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return 0;
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
            <h1 className="text-2xl font-bold text-gray-900">Správa pronájmů</h1>
            <div className="flex items-center gap-4">
                <button
                onClick={() => openForm(null)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                + Nový pronájem
                </button>
                <button
                onClick={() => router.push('/admin')}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                ← Zpět do adminu
                </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {(['all', 'confirmed', 'paid', 'completed', 'cancelled'] as const).map((status) => (
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

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Načítání pronájmů...</p>
          </div>
        ) : rentals.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">Žádné pronájmy nebyly nalezeny.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {rentals.map((rental) => (
              <div key={rental._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{rental.name}</h3>
                      <p className="text-gray-600">{rental.email} • {rental.phone}</p>
                      {rental.organization && (
                        <p className="text-gray-600">{rental.organization}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[rental.status]}`}>
                            {statusNames[rental.status]}
                        </span>
                        <button
                            onClick={() => openForm(rental)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            Upravit
                        </button>
                         <button
                            onClick={() => handleDeleteRental(rental._id)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                            Smazat
                        </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Pobyt</h4>
                      <p className="text-gray-600">
                        {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                        <span className="text-gray-500"> ({calculateDays(rental.startDate, rental.endDate)} dní)</span>
                      </p>
                      <p className="text-gray-600">Počet hostů: {rental.guestCount}</p>
                      <p className="text-gray-600">Cena: {rental.price ? `${rental.price} Kč` : 'Nespecifikováno'}</p>
                    </div>

                    {rental.adminNotes && (
                        <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Poznámky administrátora</h4>
                        <p className="text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">{rental.adminNotes}</p>
                        </div>
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

      {showForm && (
        <RentalForm
            rental={selectedRental}
            onClose={() => setShowForm(false)}
            onSave={handleSaveRental}
            isProcessing={isProcessing}
        />
      )}
    </div>
  );
}
