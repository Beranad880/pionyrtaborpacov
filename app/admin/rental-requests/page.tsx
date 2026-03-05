'use client';

import { useState, useEffect, type JSX } from 'react';
import { useRouter } from 'next/navigation';

const DAYS_CS = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];
const MONTHS_CS = ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'];

interface BlockedPeriod {
  _id: string;
  startDate: string;
  endDate: string;
  label: string;
}

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

  // Kalendář blokovaných termínů
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [blockedPeriods, setBlockedPeriods] = useState<BlockedPeriod[]>([]);
  const [approvedPeriods, setApprovedPeriods] = useState<{startDate: string; endDate: string}[]>([]);
  const [selectStart, setSelectStart] = useState<string | null>(null);
  const [selectEnd, setSelectEnd] = useState<string | null>(null);
  const [blockLabel, setBlockLabel] = useState('');
  const [isSavingBlock, setIsSavingBlock] = useState(false);

  useEffect(() => { fetchBlockedPeriods(); }, []);

  const fetchBlockedPeriods = async () => {
    try {
      const res = await fetch('/api/admin/blocked-periods', { credentials: 'include' });
      const result = await res.json();
      if (result.success) setBlockedPeriods(result.data);
    } catch {}
    try {
      const res = await fetch('/api/admin/rental-requests?status=approved&limit=100', { credentials: 'include' });
      const result = await res.json();
      if (result.success) setApprovedPeriods(result.data.requests || []);
    } catch {}
  };

  const dateStr = (d: Date) => d.toISOString().split('T')[0];

  const isBlocked = (d: Date) => {
    const s = dateStr(d);
    return blockedPeriods.some(p => s >= p.startDate.split('T')[0] && s <= p.endDate.split('T')[0]);
  };

  const isApproved = (d: Date) => {
    const s = dateStr(d);
    return approvedPeriods.some((p: any) => s >= p.startDate.split('T')[0] && s <= p.endDate.split('T')[0]);
  };

  const isInSelection = (d: Date) => {
    if (!selectStart) return false;
    const s = dateStr(d);
    const end = selectEnd || selectStart;
    const [a, b] = selectStart <= end ? [selectStart, end] : [end, selectStart];
    return s >= a && s <= b;
  };

  const handleDayClick = (d: Date) => {
    const s = dateStr(d);
    if (!selectStart || (selectStart && selectEnd)) {
      setSelectStart(s);
      setSelectEnd(null);
    } else {
      if (s < selectStart) { setSelectEnd(selectStart); setSelectStart(s); }
      else setSelectEnd(s);
    }
  };

  const saveBlockedPeriod = async () => {
    if (!selectStart || !selectEnd || !blockLabel.trim()) return;
    setIsSavingBlock(true);
    try {
      const res = await fetch('/api/admin/blocked-periods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ startDate: selectStart, endDate: selectEnd, label: blockLabel.trim() }),
      });
      const result = await res.json();
      if (result.success) {
        setBlockedPeriods(prev => [...prev, result.data]);
        setSelectStart(null); setSelectEnd(null); setBlockLabel('');
      }
    } finally {
      setIsSavingBlock(false);
    }
  };

  const deleteBlockedPeriod = async (id: string) => {
    await fetch('/api/admin/blocked-periods', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id }),
    });
    setBlockedPeriods(prev => prev.filter(p => p._id !== id));
  };

  const renderAdminCalendar = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = (() => { const d = new Date(year, month, 1).getDay(); return d === 0 ? 6 : d - 1; })();
    const cells: JSX.Element[] = [];

    for (let i = 0; i < firstDay; i++) cells.push(<div key={`e${i}`} />);

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const s = dateStr(date);
      const blocked = isBlocked(date);
      const approved = isApproved(date);
      const inSel = isInSelection(date);
      const isStart = s === selectStart;
      const isEnd = s === selectEnd;

      let cls = 'h-9 flex items-center justify-center rounded-lg text-sm cursor-pointer transition-colors select-none ';
      if (blocked) cls += 'bg-orange-400 text-white font-medium';
      else if (approved) cls += 'bg-red-500 text-white font-medium';
      else if (isStart || isEnd) cls += 'bg-blue-600 text-white font-bold';
      else if (inSel) cls += 'bg-blue-200 text-blue-900';
      else cls += 'hover:bg-slate-100 text-slate-700';

      cells.push(
        <div key={day} className={cls} onClick={() => handleDayClick(date)} title={s}>
          {day}
        </div>
      );
    }
    return cells;
  };

  useEffect(() => {
    fetchRequests();
  }, [filter, currentPage]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/rental-requests?status=${filter}&page=${currentPage}&limit=10`, {
        credentials: 'include'
      });
      if (response.ok) {
        const result = await response.json();
        console.log('Rental requests response:', result);
        if (result.success) {
          setRequests(result.data.requests || []);
          setTotalPages(result.data.pagination.pages || 1);
        }
      } else {
        console.error('Failed to fetch rental requests:', response.status, response.statusText);
        const errorResult = await response.json().catch(() => ({}));
        console.error('Error details:', errorResult);
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

  const deleteRequest = async (requestId: string) => {
    if (!confirm('Opravdu chcete tuto žádost smazat?')) return;
    try {
      const response = await fetch(`/api/admin/rental-requests/${requestId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        setRequests(prev => prev.filter(r => r._id !== requestId));
        if (selectedRequest?._id === requestId) {
          setShowModal(false);
          setSelectedRequest(null);
        }
      } else {
        alert('Chyba při mazání žádosti');
      }
    } catch (error) {
      console.error('Error deleting rental request:', error);
      alert('Chyba při mazání žádosti');
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

        {/* Kalendář blokovaných termínů */}
        <div className="bg-white rounded-xl shadow mb-8 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Správa termínů hájenky</h2>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Kalendář */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setCalendarDate(d => { const n = new Date(d); n.setMonth(d.getMonth() - 1); return n; })} className="p-2 hover:bg-slate-100 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <span className="font-semibold text-slate-700">{MONTHS_CS[calendarDate.getMonth()]} {calendarDate.getFullYear()}</span>
                <button onClick={() => setCalendarDate(d => { const n = new Date(d); n.setMonth(d.getMonth() + 1); return n; })} className="p-2 hover:bg-slate-100 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-1">
                {DAYS_CS.map(d => <div key={d} className="h-8 flex items-center justify-center text-xs font-medium text-slate-500">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {renderAdminCalendar()}
              </div>

              <div className="mt-4 pt-4 border-t flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-1"><div className="w-4 h-4 bg-red-500 rounded"></div><span>Schválená žádost</span></div>
                <div className="flex items-center gap-1"><div className="w-4 h-4 bg-orange-400 rounded"></div><span>Admin blokace</span></div>
                <div className="flex items-center gap-1"><div className="w-4 h-4 bg-blue-200 rounded"></div><span>Výběr</span></div>
              </div>
            </div>

            {/* Formulář + seznam blokací */}
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Zablokovat termín</h3>
                <p className="text-sm text-gray-500 mb-3">Kliknutím vyberte začátek a konec termínu v kalendáři.</p>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Od</label>
                    <div className="px-3 py-2 bg-white border rounded-lg text-sm text-gray-700">{selectStart || '—'}</div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Do</label>
                    <div className="px-3 py-2 bg-white border rounded-lg text-sm text-gray-700">{selectEnd || '—'}</div>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Popis (např. Tábor Pionýr, Oprava...)"
                  value={blockLabel}
                  onChange={e => setBlockLabel(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <div className="flex gap-2">
                  <button
                    onClick={saveBlockedPeriod}
                    disabled={!selectStart || !selectEnd || !blockLabel.trim() || isSavingBlock}
                    className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    {isSavingBlock ? 'Ukládám...' : 'Zablokovat'}
                  </button>
                  <button
                    onClick={() => { setSelectStart(null); setSelectEnd(null); setBlockLabel(''); }}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-sm transition-colors"
                  >
                    Zrušit
                  </button>
                </div>
              </div>

              {/* Seznam blokací */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Aktivní blokace</h3>
                {blockedPeriods.length === 0 ? (
                  <p className="text-sm text-gray-400">Žádné blokace.</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {blockedPeriods.map(p => (
                      <div key={p._id} className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
                        <div>
                          <div className="text-sm font-medium text-orange-800">{p.label}</div>
                          <div className="text-xs text-orange-600">
                            {new Date(p.startDate).toLocaleDateString('cs-CZ')} – {new Date(p.endDate).toLocaleDateString('cs-CZ')}
                          </div>
                        </div>
                        <button onClick={() => deleteBlockedPeriod(p._id)} className="text-red-400 hover:text-red-600 ml-3" title="Smazat">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

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

                    <div className="flex gap-2">
                      {request.status === 'pending' && (
                        <button
                          onClick={() => openModal(request)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                          Zpracovat
                        </button>
                      )}
                      <button
                        onClick={() => deleteRequest(request._id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      >
                        Smazat
                      </button>
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