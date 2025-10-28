import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Invoice } from '../types';
import XMarkIcon from './icons-redesign/XMarkIcon';

interface InvoiceDetailsModalProps {
    invoice: Invoice | null;
    onClose: () => void;
}

const DetailItem: React.FC<{ label: string; value: string | number | undefined | null }> = ({ label, value }) => (
    <div>
        <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</dt>
        <dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-200">{value ?? '---'}</dd>
    </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="py-4 border-b dark:border-slate-700 last:border-b-0">
        <h3 className="text-base font-semibold text-blue-600 dark:text-blue-400 mb-3">{title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-4">
            {children}
        </div>
    </div>
);


const InvoiceDetailsModal: React.FC<InvoiceDetailsModalProps> = ({ invoice, onClose }) => {
    const { t } = useContext(LanguageContext);
    
    if (!invoice) return null;

    const isOpen = !!invoice;
    const formatDate = (dateString: string) => new Date(dateString).toLocaleString();

    return (
        <div
            className={`fixed inset-0 z-50 flex items-start justify-center p-4 transition-opacity duration-300 overflow-y-auto ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="invoice-details-title"
        >
            <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden="true"></div>

            <div className={`relative w-full max-w-4xl my-8 bg-white dark:bg-slate-800 rounded-lg shadow-2xl flex flex-col transform transition-all duration-300 max-h-[90vh] ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <header className="flex items-center justify-between p-4 border-b dark:border-slate-700 flex-shrink-0 sticky top-0 bg-white dark:bg-slate-800 rounded-t-lg z-10 no-print">
                    <h2 id="invoice-details-title" className="text-lg font-bold text-slate-800 dark:text-slate-200">
                        {t('receipts.detailsInvoiceTitle')} - {invoice.invoiceNumber}
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Close panel">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </header>

                <div className="flex-grow p-6 overflow-y-auto">
                    <Section title={t('bookings.bookingInfo')}>
                        <DetailItem label={t('receipts.th_invoiceNumber')} value={invoice.invoiceNumber} />
                        <DetailItem label={t('receipts.th_bookingNumber')} value={invoice.bookingNumber} />
                    </Section>
                    
                    <Section title={t('bookings.financialInfo')}>
                        <DetailItem label={t('receipts.th_value')} value={invoice.value.toFixed(2)} />
                        <DetailItem label={t('receipts.th_discount')} value={invoice.discount.toFixed(2)} />
                        <DetailItem label={t('receipts.th_subtotal')} value={invoice.subtotal.toFixed(2)} />
                        <DetailItem label={t('receipts.th_tax')} value={invoice.tax.toFixed(2)} />
                        <DetailItem label={t('receipts.th_total')} value={invoice.total.toFixed(2)} />
                    </Section>
                    
                     <Section title={t('bookings.details.timestamps')}>
                        <DetailItem label={t('receipts.th_createdAt')} value={formatDate(invoice.createdAt)} />
                        <DetailItem label={t('receipts.th_updatedAt')} value={formatDate(invoice.updatedAt)} />
                    </Section>
                </div>
            </div>
        </div>
    );
};

export default InvoiceDetailsModal;
