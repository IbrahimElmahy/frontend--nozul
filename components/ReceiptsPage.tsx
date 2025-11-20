
import React, { useState, useMemo, useContext, useEffect, useCallback } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Receipt, User, Invoice } from '../types';
import PlusCircleIcon from './icons-redesign/PlusCircleIcon';
import TrashIcon from './icons-redesign/TrashIcon';
import EyeIcon from './icons-redesign/EyeIcon';
import PencilSquareIcon from './icons-redesign/PencilSquareIcon';
import AddReceiptPanel from './AddReceiptPanel';
import ConfirmationModal from './ConfirmationModal';
import ReceiptDetailsModal from './ReceiptDetailsModal';
import MagnifyingGlassIcon from './icons-redesign/MagnifyingGlassIcon';
import PrinterIcon from './icons-redesign/PrinterIcon';
import InvoiceDetailsModal from './InvoiceDetailsModal';
import InvoicePrintPreview from './InvoicePrintPreview';
import TableCellsIcon from './icons-redesign/TableCellsIcon';
import Squares2x2Icon from './icons-redesign/Squares2x2Icon';
import ChevronLeftIcon from './icons-redesign/ChevronLeftIcon';
import ChevronRightIcon from './icons-redesign/ChevronRightIcon';
import { apiClient } from '../apiClient';

const newReceiptTemplate: Omit<Receipt, 'id' | 'createdAt' | 'updatedAt'> = {
    receiptNumber: '',
    currency: '',
    value: 0,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    paymentMethod: '',
    paymentType: null,
    transactionNumber: null,
    bookingNumber: null,
};

type VoucherType = 'receipt' | 'payment' | 'invoice';

interface ReceiptsPageProps {
    user: User | null;
}

const ReceiptsPage: React.FC<ReceiptsPageProps> = ({ user }) => {
    const { t, language } = useContext(LanguageContext);
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [paymentVouchers, setPaymentVouchers] = useState<Receipt[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [voucherType, setVoucherType] = useState<VoucherType>('receipt'); 
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState<Receipt | null>(null);
    const [voucherToDelete, setVoucherToDelete] = useState<Receipt | null>(null);
    const [viewingVoucher, setViewingVoucher] = useState<Receipt | null>(null);
    
    const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
    const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);
    const [invoiceForPreview, setInvoiceForPreview] = useState<Invoice | null>(null);

    const isPaymentView = voucherType === 'payment';
    const isInvoiceView = voucherType === 'invoice';

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            params.append('start', ((currentPage - 1) * itemsPerPage).toString());
            params.append('length', itemsPerPage.toString());
            if (searchTerm) params.append('search', searchTerm);

            let endpoint = '';
            if (voucherType === 'invoice') {
                endpoint = '/ar/invoice/api/invoices/';
            } else {
                endpoint = '/ar/transaction/api/transactions/';
                params.append('type', voucherType);
            }

            const response = await apiClient<{ data: any[], recordsFiltered: number }>(`${endpoint}?${params.toString()}`);

            if (voucherType === 'invoice') {
                 setInvoices(response.data as Invoice[]);
            } else {
                // Map transaction response to Receipt type
                const mappedData: Receipt[] = response.data.map((item: any) => ({
                    id: item.id,
                    receiptNumber: item.number || item.id, // Use number if available
                    currency: item.currency?.name_ar || 'SAR', // Simplification
                    value: parseFloat(item.amount),
                    date: item.date,
                    time: item.time,
                    paymentMethod: item.payment_method?.name_ar || '',
                    paymentType: item.type,
                    transactionNumber: item.id, // Using ID as txn number for now
                    bookingNumber: '', // Not always available directly on transaction object
                    createdAt: item.created_at,
                    updatedAt: item.updated_at,
                    description: item.description
                }));

                if (voucherType === 'payment') {
                    setPaymentVouchers(mappedData);
                } else {
                    setReceipts(mappedData);
                }
            }
            setTotalRecords(response.recordsFiltered);

        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    }, [voucherType, currentPage, itemsPerPage, searchTerm]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    const handleAddNewClick = () => {
        setEditingVoucher(null);
        setIsAddPanelOpen(true);
    };

    const handleEditClick = (voucher: Receipt) => {
        setEditingVoucher(voucher);
        setIsAddPanelOpen(true);
    };

    const handleDeleteClick = (voucher: Receipt) => {
        setVoucherToDelete(voucher);
    };

    const handleConfirmDelete = async () => {
        if (voucherToDelete) {
            try {
                await apiClient(`/ar/transaction/api/transactions/${voucherToDelete.id}/`, { method: 'DELETE' });
                fetchData();
                setVoucherToDelete(null);
            } catch (err) {
                alert(`Error deleting transaction: ${err instanceof Error ? err.message : 'Unknown error'}`);
            }
        }
    };
    
    const handleClosePanel = () => {
        setIsAddPanelOpen(false);
        setEditingVoucher(null);
    };

    const handleSaveVoucher = () => {
        // Trigger refresh after save
        fetchData();
        handleClosePanel();
    };

    const handlePrintInvoice = (invoice: Invoice) => {
        setViewingInvoice(null);
        setInvoiceForPreview(invoice);
    };

    const handleConfirmDeleteInvoice = async () => {
        if (invoiceToDelete) {
            try {
                await apiClient(`/ar/invoice/api/invoices/${invoiceToDelete.id}/`, { method: 'DELETE' });
                fetchData();
                setInvoiceToDelete(null);
            } catch (err) {
                alert(`Error deleting invoice: ${err instanceof Error ? err.message : 'Unknown error'}`);
            }
        }
    };

    const receiptTableHeaders = [
        { key: 'th_id', className: 'hidden sm:table-cell' },
        { key: isPaymentView ? 'th_paymentVoucherNumber' : 'th_receiptNumber', className: '' },
        { key: 'th_currency', className: 'hidden xl:table-cell' },
        { key: 'th_value', className: '' },
        { key: 'th_date', className: 'hidden md:table-cell' },
        { key: 'th_time', className: 'hidden lg:table-cell' },
        { key: 'th_paymentMethod', className: '' },
        { key: 'th_createdAt', className: 'hidden 2xl:table-cell' },
        { key: 'th_actions', className: '' }
    ];
    
    const invoiceTableHeaders = [
        { key: 'th_id', className: 'hidden sm:table-cell' },
        { key: 'th_invoiceNumber', className: '' },
        { key: 'th_bookingNumber', className: 'hidden md:table-cell' },
        { key: 'th_value', className: '' },
        { key: 'th_total', className: 'hidden sm:table-cell' },
        { key: 'th_createdAt', className: 'hidden 2xl:table-cell' },
        { key: 'th_actions', className: '' }
    ];
    
    const currentTableHeaders = isInvoiceView ? invoiceTableHeaders : receiptTableHeaders;

    const filterButtons = [
        { key: 'receipt', label: 'receipts.receiptVouchers' },
        { key: 'payment', label: 'receipts.paymentVouchers' },
        { key: 'invoice', label: 'receipts.invoices' },
    ];
    
    const totalPages = Math.ceil(totalRecords / itemsPerPage);
    const displayData = isInvoiceView ? invoices : (isPaymentView ? paymentVouchers : receipts);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                    {isInvoiceView ? t('receipts.manageInvoices') : isPaymentView ? t('receipts.managePaymentVouchers') : t('receipts.manageReceipts')}
                </h2>
                 <div className="flex items-center gap-2">
                    {!isInvoiceView && (
                        <button onClick={handleAddNewClick} className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                            <PlusCircleIcon className="w-5 h-5" />
                            <span>{isPaymentView ? t('receipts.addPaymentVoucher') : t('receipts.addReceipt')}</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {filterButtons.map(btn => (
                     <button 
                        key={btn.key}
                        onClick={() => {
                            setVoucherType(btn.key as VoucherType);
                            setCurrentPage(1);
                            setSearchTerm('');
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${voucherType === btn.key ? 'bg-blue-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                    >
                         {t(btn.label as any)}
                     </button>
                ))}
            </div>

             <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4 pb-4 border-b dark:border-slate-700">
                    <div className="relative w-full sm:w-auto sm:flex-grow max-w-lg">
                        <MagnifyingGlassIcon className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t('bookings.searchPlaceholder')}
                            className={`w-full py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-200 ${language === 'ar' ? 'pr-10' : 'pl-10'}`}
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <span>{t('units.showing')}</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            className="py-1 px-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                        <span>{t('units.entries')}</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-start text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                            <tr>
                                {currentTableHeaders.map(header => (
                                    <th key={header.key} scope="col" className={`px-6 py-3 ${header.className}`}>
                                        {t(`receipts.${header.key}` as any)}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                             {loading ? (
                                <tr><td colSpan={currentTableHeaders.length} className="text-center py-10">Loading...</td></tr>
                            ) : displayData.length > 0 ? (
                                isInvoiceView ? (
                                    (displayData as Invoice[]).map(invoice => (
                                        <tr key={invoice.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
                                            <td className="px-6 py-4 hidden sm:table-cell">{invoice.id.substring(0, 8)}...</td>
                                            <td className="px-6 py-4">{invoice.number}</td>
                                            <td className="px-6 py-4 hidden md:table-cell">{invoice.reservation || '-'}</td>
                                            <td className="px-6 py-4">{invoice.amount.toFixed(2)}</td>
                                            <td className="px-6 py-4 hidden sm:table-cell">{invoice.total.toFixed(2)}</td>
                                            <td className="px-6 py-4 hidden 2xl:table-cell">{new Date(invoice.created_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => setViewingInvoice(invoice)} className="p-1.5 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/10" aria-label={t('bookings.view')}><EyeIcon className="w-5 h-5"/></button>
                                                    <button onClick={() => handlePrintInvoice(invoice)} className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700" aria-label={t('receipts.print')}><PrinterIcon className="w-5 h-5"/></button>
                                                    <button onClick={() => setInvoiceToDelete(invoice)} className="p-1.5 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10" aria-label={t('bookings.delete')}><TrashIcon className="w-5 h-5"/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    (displayData as Receipt[]).map(voucher => (
                                        <tr key={voucher.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
                                            <td className="px-6 py-4 hidden sm:table-cell">{voucher.id.substring(0, 8)}...</td>
                                            <td className="px-6 py-4">{voucher.receiptNumber}</td>
                                            <td className="px-6 py-4 hidden xl:table-cell"><span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full dark:bg-blue-900 dark:text-blue-300">{voucher.currency}</span></td>
                                            <td className="px-6 py-4"><span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-1 rounded-full dark:bg-red-900 dark:text-red-300">{voucher.value.toFixed(2)}</span></td>
                                            <td className="px-6 py-4 hidden md:table-cell">{voucher.date}</td>
                                            <td className="px-6 py-4 hidden lg:table-cell">{voucher.time}</td>
                                            <td className="px-6 py-4">{voucher.paymentMethod}</td>
                                            <td className="px-6 py-4 hidden 2xl:table-cell">{new Date(voucher.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => setViewingVoucher(voucher)} className="p-1.5 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/10" aria-label={t('bookings.view')}><EyeIcon className="w-5 h-5"/></button>
                                                    <button onClick={() => handleEditClick(voucher)} className="p-1.5 rounded-full text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-500/10" aria-label={t('bookings.edit')}><PencilSquareIcon className="w-5 h-5"/></button>
                                                    <button onClick={() => handleDeleteClick(voucher)} className="p-1.5 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10" aria-label={t('bookings.delete')}><TrashIcon className="w-5 h-5"/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )
                            ) : (
                                <tr>
                                    <td colSpan={currentTableHeaders.length} className="text-center py-10 text-slate-500 dark:text-slate-400">
                                        {t('orders.noData')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                 <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                       {`${t('units.showing')} ${displayData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} ${t('units.to')} ${Math.min(currentPage * itemsPerPage, totalRecords)} ${t('units.of')} ${totalRecords} ${t('units.entries')}`}
                    </div>
                    {totalPages > 1 && (
                         <nav className="flex items-center gap-1" aria-label="Pagination">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronLeftIcon className="w-5 h-5" /></button>
                             <span className="text-sm font-semibold px-2">{currentPage} / {totalPages}</span>
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronRightIcon className="w-5 h-5" /></button>
                        </nav>
                    )}
                </div>
            </div>
            
            <AddReceiptPanel 
                isOpen={isAddPanelOpen}
                onClose={handleClosePanel}
                onSave={handleSaveVoucher}
                initialData={editingVoucher || newReceiptTemplate}
                isEditing={!!editingVoucher}
                voucherType={voucherType as 'receipt' | 'payment'}
                user={user}
            />

            <ReceiptDetailsModal 
                receipt={viewingVoucher}
                onClose={() => setViewingVoucher(null)}
                voucherType={voucherType as 'receipt' | 'payment'}
            />

            <ConfirmationModal
                isOpen={!!voucherToDelete}
                onClose={() => setVoucherToDelete(null)}
                onConfirm={handleConfirmDelete}
                title={isPaymentView ? t('receipts.deletePaymentVoucherTitle') : t('receipts.deleteReceiptTitle')}
                message={t('receipts.confirmDeleteMessage')}
            />
            
            <InvoiceDetailsModal 
                invoice={viewingInvoice} 
                onClose={() => setViewingInvoice(null)} 
                onPrint={handlePrintInvoice}
            />

            <ConfirmationModal
                isOpen={!!invoiceToDelete}
                onClose={() => setInvoiceToDelete(null)}
                onConfirm={handleConfirmDeleteInvoice}
                title={t('receipts.deleteInvoiceTitle')}
                message={t('receipts.confirmDeleteInvoiceMessage')}
            />

            <InvoicePrintPreview
                isOpen={!!invoiceForPreview}
                invoice={invoiceForPreview}
                onClose={() => setInvoiceForPreview(null)}
            />
        </div>
    );
};

export default ReceiptsPage;
