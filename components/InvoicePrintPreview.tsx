import React, { useContext } from 'react';
import { Invoice } from '../types';
import { LanguageContext } from '../contexts/LanguageContext';
import XMarkIcon from './icons-redesign/XMarkIcon';
import PrinterIcon from './icons-redesign/PrinterIcon';
import PrintableInvoice from './PrintableInvoice';

interface InvoicePrintPreviewProps {
    invoice: Invoice | null;
    isOpen: boolean;
    onClose: () => void;
}

const InvoicePrintPreview: React.FC<InvoicePrintPreviewProps> = ({ invoice, isOpen, onClose }) => {
    const { t } = useContext(LanguageContext);

    const handlePrint = () => {
        window.print();
    };

    if (!invoice) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="invoice-print-preview-title"
        >
            <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden="true"></div>

            <div className={`relative h-full bg-slate-50 dark:bg-slate-800 shadow-2xl flex flex-col w-full max-w-4xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <header className="flex items-center justify-between p-4 border-b dark:border-slate-700 flex-shrink-0 sticky top-0 bg-white dark:bg-slate-900 z-10 no-print">
                    <h2 id="invoice-print-preview-title" className="text-lg font-bold text-slate-800 dark:text-slate-200">
                        {/* FIX: Use correct property 'number' instead of 'invoiceNumber' */}
                        {t('receipts.detailsInvoiceTitle')} - {invoice.number}
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Close panel">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </header>

                <div className="flex-grow overflow-y-auto bg-gray-200 dark:bg-gray-900 p-4 sm:p-8">
                    <div className="max-w-4xl mx-auto shadow-lg">
                        <PrintableInvoice invoice={invoice} />
                    </div>
                </div>

                <footer className="flex items-center justify-start p-4 border-t dark:border-slate-700 flex-shrink-0 gap-3 sticky bottom-0 bg-white dark:bg-slate-900 no-print">
                    <button onClick={handlePrint} className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
                        <PrinterIcon className="w-5 h-5" />
                        <span>{t('receipts.print')}</span>
                    </button>
                    <button onClick={onClose} className="bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 font-semibold py-2 px-5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200">
                        {t('units.cancel')}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default InvoicePrintPreview;