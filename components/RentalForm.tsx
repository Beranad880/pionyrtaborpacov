'use client';

import { useState, useEffect } from 'react';
import { IRental } from '@/models/Rental';

interface RentalFormProps {
  rental?: IRental | null;
  onClose: () => void;
  onSave: (rental: Partial<IRental>) => void;
  isProcessing: boolean;
}

const facilityOptions = [
    { id: 'kitchen', label: 'Kuchyně' },
    { id: 'wifi', label: 'Wi-Fi' },
    { id: 'fireplace', label: 'Krb' },
    { id: 'parking', label: 'Parkování' },
    { id: 'heating', label: 'Topení' },
    { id: 'electricity', label: 'Elektřina' },
    { id: 'water', label: 'Voda' },
    { id: 'outdoor_grill', label: 'Venkovní gril' },
    { id: 'sports_equipment', label: 'Sportovní vybavení' }
];

const getInitialData = (rental?: IRental | null): Partial<IRental> => {
    if (rental) {
        return {
            ...rental,
            startDate: rental.startDate ? new Date(rental.startDate).toISOString().split('T')[0] : '',
            endDate: rental.endDate ? new Date(rental.endDate).toISOString().split('T')[0] : '',
        };
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return {
        name: '',
        email: '',
        phone: '',
        organization: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: tomorrow.toISOString().split('T')[0],
        guestCount: 1,
        purpose: '',
        facilities: [],
        message: '',
        status: 'confirmed',
        price: 0,
        adminNotes: '',
    };
};

export default function RentalForm({ rental, onClose, onSave, isProcessing }: RentalFormProps) {
  const [formData, setFormData] = useState<Partial<IRental>>(getInitialData(rental));

  useEffect(() => {
    setFormData(getInitialData(rental));
  }, [rental]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFacilityChange = (facilityId: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities?.includes(facilityId)
        ? prev.facilities.filter(id => id !== facilityId)
        : [...(prev.facilities || []), facilityId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">{rental ? 'Upravit pronájem' : 'Nový pronájem'}</h3>
                    <button
                    onClick={onClose}
                    type="button"
                    className="text-gray-400 hover:text-gray-600"
                    >
                    ✕
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Column 1 */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Jméno a příjmení</label>
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Telefon</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Organizace</label>
                            <input type="text" name="organization" value={formData.organization} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Účel pobytu</label>
                            <input type="text" name="purpose" value={formData.purpose} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Zpráva od klienta</label>
                            <textarea name="message" value={formData.message} onChange={handleInputChange} rows={3} className="w-full mt-1 p-2 border rounded" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Poznámky administrátora</label>
                            <textarea name="adminNotes" value={formData.adminNotes} onChange={handleInputChange} rows={3} className="w-full mt-1 p-2 border rounded" />
                        </div>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Datum příjezdu</label>
                                <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Datum odjezdu</label>
                                <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded" required />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Počet hostů</label>
                                <input type="number" name="guestCount" value={formData.guestCount} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded" required min="1"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Cena (Kč)</label>
                                <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded" min="0" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select name="status" value={formData.status} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded">
                                <option value="confirmed">Potvrzeno</option>
                                <option value="paid">Zaplaceno</option>
                                <option value="completed">Dokončeno</option>
                                <option value="cancelled">Zrušeno</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Vybavení</label>
                            <div className="mt-2 grid grid-cols-2 gap-2">
                                {facilityOptions.map(facility => (
                                    <div key={facility.id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`facility-${facility.id}`}
                                        checked={formData.facilities?.includes(facility.id)}
                                        onChange={() => handleFacilityChange(facility.id)}
                                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor={`facility-${facility.id}`} className="ml-2 text-sm text-gray-600">
                                        {facility.label}
                                    </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                    Zrušit
                </button>
                <button
                    type="submit"
                    disabled={isProcessing}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                    {isProcessing ? 'Ukládání...' : 'Uložit'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}
