'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CampApplication {
  _id: string;
  participantName: string;
  grade: string;
  dateOfBirth: string;
  birthNumber: string;
  address: {
    street: string;
    city: string;
  };
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  guardianAddress?: string;
  secondContactName: string;
  secondContactPhone: string;
  secondContactEmail?: string;
  secondContactAddress?: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  processedBy?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
  campInfo?: {
    theme: string;
    dates: string;
    price: number;
  };
}

interface Stats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

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

const gradeNames: Record<string, string> = {
  '0': '1. třída',
  '1': '2. třída',
  '2': '3. třída',
  '3': '4. třída',
  '4': '5. třída',
  '5': '6. třída',
  '6': '7. třída',
  '7': '8. třída',
  '8': '9. třída'
};

export default function CampApplicationsAdmin() {
  const [applications, setApplications] = useState<CampApplication[]>([]);
  const [stats, setStats] = useState<Stats>({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<CampApplication | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    fetchApplications();
  }, [filter, searchTerm, currentPage]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        status: filter,
        page: currentPage.toString(),
        limit: '10'
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`/api/admin/camp-applications?${params.toString()}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setApplications(result.data.applications || []);
          setStats(result.data.stats || { pending: 0, approved: 0, rejected: 0, total: 0 });
          setTotalPages(result.data.pagination.pages || 1);
        }
      }
    } catch (error) {
      console.error('Failed to fetch camp applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId: string, newStatus: 'approved' | 'rejected', notes: string = '') => {
    setIsProcessing(true);
    try {
      const response = await fetch(`/api/admin/camp-applications/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          adminNotes: notes
        }),
      });

      if (response.ok) {
        fetchApplications();
        setShowModal(false);
        setSelectedApplication(null);
        setAdminNotes('');
      } else {
        alert('Chyba při aktualizaci přihlášky');
      }
    } catch (error) {
      console.error('Error updating camp application:', error);
      alert('Chyba při aktualizaci přihlášky');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (applicationId: string) => {
    if (!confirm('Opravdu chcete smazat tuto přihlášku?')) return;

    try {
      const response = await fetch(`/api/admin/camp-applications/${applicationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchApplications();
        setShowDetailModal(false);
        setSelectedApplication(null);
      } else {
        alert('Chyba při mazání přihlášky');
      }
    } catch (error) {
      console.error('Error deleting camp application:', error);
      alert('Chyba při mazání přihlášky');
    }
  };

  const openModal = (application: CampApplication) => {
    setSelectedApplication(application);
    setAdminNotes(application.adminNotes || '');
    setShowModal(true);
  };

  const openDetailModal = (application: CampApplication) => {
    setSelectedApplication(application);
    setShowDetailModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('cs-CZ');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('cs-CZ');
  };

  const calculateAge = (birthDate: string) => {
    // Předpokládáme formát DD.MM.YYYY
    const [day, month, year] = birthDate.split('.').map(Number);
    const birth = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Táborové přihlášky</h1>
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
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-blue-800 text-sm font-medium">Celkem přihlášek</div>
            <div className="text-blue-900 text-2xl font-bold">{stats.total}</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-yellow-800 text-sm font-medium">Čekající</div>
            <div className="text-yellow-900 text-2xl font-bold">{stats.pending}</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-green-800 text-sm font-medium">Schváleno</div>
            <div className="text-green-900 text-2xl font-bold">{stats.approved}</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-800 text-sm font-medium">Odmítnuto</div>
            <div className="text-red-900 text-2xl font-bold">{stats.rejected}</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Hledat podle jména účastníka, rodiče nebo emailu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'Všechny' : statusNames[status]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Načítání přihlášek...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">Žádné přihlášky nebyly nalezeny.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div key={application._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{application.participantName}</h3>
                      <p className="text-gray-600">
                        {gradeNames[application.grade]} • Věk: {calculateAge(application.dateOfBirth)} let
                      </p>
                      <p className="text-gray-600">{application.guardianName}</p>
                      <p className="text-gray-600">{application.guardianEmail} • {application.guardianPhone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[application.status]}`}>
                        {statusNames[application.status]}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Adresa účastníka</h4>
                      <p className="text-gray-600">{application.address.street}</p>
                      <p className="text-gray-600">{application.address.city}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Druhý kontakt</h4>
                      <p className="text-gray-600">{application.secondContactName}</p>
                      <p className="text-gray-600">{application.secondContactPhone}</p>
                      {application.secondContactEmail && (
                        <p className="text-gray-600">{application.secondContactEmail}</p>
                      )}
                    </div>
                  </div>

                  {application.adminNotes && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Poznámky administrátora</h4>
                      <p className="text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">{application.adminNotes}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      <p>Vytvořeno: {formatDateTime(application.createdAt)}</p>
                      {application.processedAt && application.processedBy && (
                        <p>Zpracováno: {formatDateTime(application.processedAt)} ({application.processedBy})</p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openDetailModal(application)}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                      >
                        Detail
                      </button>
                      {application.status === 'pending' && (
                        <button
                          onClick={() => openModal(application)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                          Zpracovat
                        </button>
                      )}
                    </div>
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

      {/* Processing Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Zpracovat přihlášku</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">{selectedApplication.participantName}</h4>
                <p className="text-sm text-gray-600">{gradeNames[selectedApplication.grade]}</p>
                <p className="text-sm text-gray-600">Rodič: {selectedApplication.guardianName}</p>
                <p className="text-sm text-gray-600">Email: {selectedApplication.guardianEmail}</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Poznámky administrátora
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Přidejte poznámky k přihlášce..."
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => handleStatusChange(selectedApplication._id, 'approved', adminNotes)}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isProcessing ? 'Zpracování...' : 'Schválit'}
                </button>
                <button
                  onClick={() => handleStatusChange(selectedApplication._id, 'rejected', adminNotes)}
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

      {/* Detail Modal */}
      {showDetailModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Detail přihlášky</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Údaje o účastníkovi</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p><span className="font-medium">Jméno:</span> {selectedApplication.participantName}</p>
                    <p><span className="font-medium">Třída:</span> {gradeNames[selectedApplication.grade]}</p>
                    <p><span className="font-medium">Datum narození:</span> {selectedApplication.dateOfBirth} (Věk: {calculateAge(selectedApplication.dateOfBirth)} let)</p>
                    <p><span className="font-medium">Rodné číslo:</span> {selectedApplication.birthNumber}</p>
                    <p><span className="font-medium">Adresa:</span> {selectedApplication.address.street}, {selectedApplication.address.city}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Zákonný zástupce</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p><span className="font-medium">Jméno:</span> {selectedApplication.guardianName}</p>
                    <p><span className="font-medium">Telefon:</span> {selectedApplication.guardianPhone}</p>
                    <p><span className="font-medium">Email:</span> {selectedApplication.guardianEmail}</p>
                    {selectedApplication.guardianAddress && (
                      <p><span className="font-medium">Jiná adresa:</span> {selectedApplication.guardianAddress}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Druhý kontakt</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p><span className="font-medium">Jméno:</span> {selectedApplication.secondContactName}</p>
                    <p><span className="font-medium">Telefon:</span> {selectedApplication.secondContactPhone}</p>
                    {selectedApplication.secondContactEmail && (
                      <p><span className="font-medium">Email:</span> {selectedApplication.secondContactEmail}</p>
                    )}
                    {selectedApplication.secondContactAddress && (
                      <p><span className="font-medium">Jiná adresa:</span> {selectedApplication.secondContactAddress}</p>
                    )}
                  </div>
                </div>

                {selectedApplication.campInfo && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Informace o táboře</h4>
                    <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                      <p><span className="font-medium">Téma:</span> {selectedApplication.campInfo.theme}</p>
                      <p><span className="font-medium">Termín:</span> {selectedApplication.campInfo.dates}</p>
                      <p><span className="font-medium">Cena:</span> {selectedApplication.campInfo.price.toLocaleString()} Kč</p>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Status a zpracování</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p>
                      <span className="font-medium">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-sm ${statusColors[selectedApplication.status]}`}>
                        {statusNames[selectedApplication.status]}
                      </span>
                    </p>
                    <p><span className="font-medium">Vytvořeno:</span> {formatDateTime(selectedApplication.createdAt)}</p>
                    {selectedApplication.processedAt && (
                      <p><span className="font-medium">Zpracováno:</span> {formatDateTime(selectedApplication.processedAt)}</p>
                    )}
                    {selectedApplication.processedBy && (
                      <p><span className="font-medium">Zpracoval:</span> {selectedApplication.processedBy}</p>
                    )}
                    {selectedApplication.adminNotes && (
                      <div>
                        <span className="font-medium">Poznámky:</span>
                        <p className="mt-1 bg-yellow-100 p-2 rounded border border-yellow-200">
                          {selectedApplication.adminNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleDelete(selectedApplication._id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Smazat přihlášku
                </button>

                {selectedApplication.status === 'pending' && (
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      openModal(selectedApplication);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Zpracovat
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}