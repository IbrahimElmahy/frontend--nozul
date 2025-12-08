import React, { useState, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import XMarkIcon from './icons-redesign/XMarkIcon';
import CheckCircleIcon from './icons-redesign/CheckCircleIcon';
import { apiClient } from '../apiClient';

interface AddInvoicePanelProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    bookingData: any; // Using any for flexibility as we pass the whole booking state
}

const AddInvoicePanel: React.FC<AddInvoicePanelProps> = ({ isOpen, onClose, onSave, bookingData }) => {
    const { t } = useContext(LanguageContext);
    const [loading, setLoading] = useState(false);

    const handleCreateInvoice = async () => {
        setLoading(true);
        try {
            // Construct payload from bookingData
            // The API expects a payload similar to rental calculation + reservation ID
            const payload = new URLSearchParams();
            if (bookingData.id) payload.append('reservation', bookingData.id);
            if (bookingData.bookingSource) payload.append('source', bookingData.bookingSource);
            if (bookingData.rentType) payload.append('rental_type', bookingData.rentType);
            if (bookingData.checkInDate) payload.append('check_in_date', bookingData.checkInDate.split(' ')[0]);
            if (bookingData.checkOutDate) payload.append('check_out_date', bookingData.checkOutDate.split(' ')[0]);
            if (bookingData.duration) payload.append('period', bookingData.duration.toString());
            if (bookingData.unitName) payload.append('apartment', bookingData.unitName);
            // price? maybe unit price?
            payload.append('price', '0'); // Script sends 0
            if (bookingData.bookingReason) payload.append('reason', bookingData.bookingReason);
            if (bookingData.guestName) payload.append('guest', bookingData.guestName);
            if (bookingData.rent) payload.append('rent', bookingData.rent.toString());

            payload.append('discount_type', bookingData.discountType === 'percentage' ? 'percent' : 'fixed');
            payload.append('discount', bookingData.discount?.toString() || '0');
            payload.append('discount_value', '0.0'); // Script sends 0.0
            payload.append('note', bookingData.notes || '');

            await apiClient('/ar/invoice/api/invoices/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                body: payload
            });

            onSave();
            onClose();
            alert(t('bookings.alerts.invoiceCreated') || 'Invoice created successfully');

        } catch (error) {
            console.error("Error creating invoice", error);
            alert(`Error creating invoice: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden="true"></div>
            <div className={`relative bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md p-6 transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{t('bookings.createInvoice') || 'Create Invoice'}</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"><XMarkIcon className="w-6 h-6" /></button>
                </div>

                <p className="text-slate-600 dark:text-slate-300 mb-6">
                    {t('bookings.confirmCreateInvoice') || 'Are you sure you want to generate an invoice for this reservation?'}
                </p>

                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 font-medium transition-colors">
                        {t('units.cancel')}
                    </button>
                    <button onClick={handleCreateInvoice} disabled={loading} className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 font-medium flex items-center gap-2 transition-colors disabled:opacity-50">
                        {loading ? 'Creating...' : (
                            <>
                                <CheckCircleIcon className="w-5 h-5" />
                                <span>{t('bookings.create') || 'Create'}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddInvoicePanel;
