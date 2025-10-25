import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Receipt } from '../types';
import XMarkIcon from './icons-redesign/XMarkIcon';

interface ReceiptDetailsModalProps {
    receipt: Receipt | null;
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


const ReceiptDetailsModal: React.FC<ReceiptDetailsModalProps> = ({ receipt, onClose }) => {
    const { t } = useContext(LanguageContext);
    
    if (!receipt) return null;

    const isOpen = !!receipt;
    const formatDate = (dateString: string | null | undefined) => dateString ? new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : '---';

    return (
        <div
            className={`fixed inset-0 z-50 flex items-start justify-center p-4 transition-opacity duration-300 overflow-y-auto ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="receipt-details-title"
        >
            <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden="true"></div>

            <div className={`relative w-full max-w-4xl my-8 bg-white dark:bg-slate-800 rounded-lg shadow-2xl flex flex-col transform transition-all duration-300 max-h-[90vh] ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <header className="flex items-center justify-between p-4 border-b dark:border-slate-700 flex-shrink-0 sticky top-0 bg-white dark:bg-slate-800 rounded-t-lg z-10">
                    <h2 id="receipt-details-title" className="text-lg font-bold text-slate-800 dark:text-slate-200">
                        {t('receipts.detailsTitle')} - {receipt.receiptNumber}
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Close panel">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </header>

                <div className="flex-grow p-6 overflow-y-auto">
                    <Section title={t('receipts.addReceiptPanel.receiptInfo')}>
                        <DetailItem label={t('receipts.th_receiptNumber')} value={receipt.receiptNumber} />
                        <DetailItem label={t('receipts.th_value')} value={receipt.value.toFixed(2)} />
                        <DetailItem label={t('receipts.th_currency')} value={receipt.currency} />
                        <DetailItem label={t('receipts.th_date')} value={formatDate(receipt.date)} />
                        <DetailItem label={t('receipts.th_time')} value={receipt.time} />
                    </Section>

                    <Section title={t('receipts.addReceiptPanel.financialAccountInfo')}>
                        <DetailItem label={t('receipts.th_paymentMethod')} value={receipt.paymentMethod} />
                        <DetailItem label={t('receipts.th_paymentType')} value={receipt.paymentType} />
                        <DetailItem label={t('receipts.th_transactionNumber')} value={receipt.transactionNumber} />
                        <DetailItem label={t('receipts.th_bookingNumber')} value={receipt.bookingNumber} />
                    </Section>
                    
                     <Section title={t('bookings.details.timestamps')}>
                        <DetailItem label={t('receipts.th_createdAt')} value={new Date(receipt.createdAt).toLocaleString()} />
                        <DetailItem label={t('receipts.th_updatedAt')} value={new Date(receipt.updatedAt).toLocaleString()} />
                    </Section>
                </div>
            </div>
        </div>
    );
};

export default ReceiptDetailsModal;
