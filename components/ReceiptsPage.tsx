
import React, { useState, useMemo, useContext, useEffect } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Receipt, User, Invoice } from '../types';
import PlusCircleIcon from './icons-redesign/PlusCircleIcon';
import ChevronLeftIcon from './icons-redesign/ChevronLeftIcon';
import ChevronRightIcon from './icons-redesign/ChevronRightIcon';
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
import ArrowUpIcon from './icons-redesign/ArrowUpIcon';
import ArrowDownIcon from './icons-redesign/ArrowDownIcon';
import ChevronUpDownIcon from './icons-redesign/ChevronUpDownIcon';

const mockReceipts: Receipt[] = [
  { id: '1', receiptNumber: '0000000018', currency: 'SAR', value: 152.0, date: '2025-10-07', time: '16:57:00', paymentMethod: 'نقدي', paymentType: '-', transactionNumber: '-', bookingNumber: '-', createdAt: '2025-10-07 13:58:41', updatedAt: '2025-10-07 13:58:41' },
  { id: '2', receiptNumber: '0000000017', currency: 'SAR', value: 8000.0, date: '2025-08-23', time: '22:33:00', paymentMethod: 'نقدي', paymentType: '-', transactionNumber: '-', bookingNumber: '0000000196', createdAt: '2025-08-23 19:34:23', updatedAt: '2025-08-23 19:34:23' },
  { id: '3', receiptNumber: '0000000016', currency: 'SAR', value: 100.0, date: '2025-08-23', time: '21:53:00', paymentMethod: 'نقدي', paymentType: '-', transactionNumber: '-', bookingNumber: '0000000195', createdAt: '2025-08-23 18:54:24', updatedAt: '2025-08-23 18:54:24' },
  { id: '4', receiptNumber: '0000000015', currency: 'SAR', value: 100.0, date: '2025-08-23', time: '19:30:00', paymentMethod: 'نقدي', paymentType: '-', transactionNumber: '-', bookingNumber: '0000000192', createdAt: '2025-08-23 16:31:45', updatedAt: '2025-08-23 16:31:45' },
  { id: '5', receiptNumber: '0000000014', currency: 'SAR', value: 250.0, date: '2025-06-26', time: '12:57:00', paymentMethod: 'بطاقة ائتمانية', paymentType: '-', transactionNumber: '-', bookingNumber: '0000000182', createdAt: '2025-06-28 10:26:17', updatedAt: '2025-06-28 10:26:17' },
  { id: '6', receiptNumber: '0000000013', currency: 'SAR', value: 150.0, date: '2025-06-07', time: '07:51:00', paymentMethod: 'التحويل البنكي', paymentType: '-', transactionNumber: '-', bookingNumber: '0000000177', createdAt: '2025-06-07 13:51:37', updatedAt: '2025-07-30 02:10:11' },
  { id: '7', receiptNumber: '0000000012', currency: 'SAR', value: 2750.0, date: '2025-06-07', time: '13:59:00', paymentMethod: 'نقدي', paymentType: '-', transactionNumber: '-', bookingNumber: '0000000176', createdAt: '2025-06-07 10:59:39', updatedAt: '2025-06-07 10:59:39' },
  { id: '8', receiptNumber: '0000000011', currency: 'SAR', value: 2750.0, date: '2025-06-07', time: '13:58:00', paymentMethod: 'نقدي', paymentType: '-', transactionNumber: '-', bookingNumber: '0000000176', createdAt: '2025-06-07 10:59:01', updatedAt: '2025-06-07 10:59:01' },
  { id: '9', receiptNumber: '0000000010', currency: 'SAR', value: 1400.0, date: '2025-05-22', time: '01:43:00', paymentMethod: 'نقدي', paymentType: '-', transactionNumber: '-', bookingNumber: '0000000154', createdAt: '2025-05-22 22:46:17', updatedAt: '2025-05-22 22:46:17' },
  { id: '10', receiptNumber: '0000000009', currency: 'SAR', value: 200.0, date: '2025-05-10', time: '03:33:00', paymentMethod: 'نقدي', paymentType: '-', transactionNumber: '-', bookingNumber: '-', createdAt: '2025-05-10 00:34:20', updatedAt: '2025-05-10 00:34:20' },
];

const mockInvoices: Invoice[] = [
  { id: '1', number: '0000000009', reservation: '0000000009', amount: 2000, discount: 0.0, subtotal: 2000, tax: 0, total: 2000, created_at: '2025-10-24 21:38:37', updated_at: '2025-10-24 21:38:37' },
  { id: '2', number: '0000000008', reservation: '0000000009', amount: 2000, discount: 0.0, subtotal: 2000, tax: 0, total: 2000, created_at: '2025-10-22 16:05:14', updated_at: '2025-10-22 16:05:14' },
  { id: '3', number: '0000000007', reservation: '0000000009', amount: 2000, discount: 0.0, subtotal: 2000, tax: 0, total: 2000, created_at: '2025-10-22 14:51:59', updated_at: '2025-10-22 14:51:59' },
  { id: '4', number: '0000000006', reservation: '0000000009', amount: 2000, discount: 0.0, subtotal: 2000, tax: 0, total: 2000, created_at: '2025-10-22 14:45:30', updated_at: '2025-10-22 14:45:30' },
  { id: '5', number: '0000000005', reservation: '0000000008', amount: 223, discount: 0.0, subtotal: 223, tax: 0, total: 223, created_at: '2025-10-04 18:24:12', updated_at: '2025-10-04 18:24:12' },
  { id: '6', number: '0000000004', reservation: '0000000008', amount: 222, discount: 0.0, subtotal: 222, tax: 0, total: 222, created_at: '2025-09-29 20:34:50', updated_at: '2025-09-29 20:34:50' },
  { id: '7', number: '0000000003', reservation: '0000000002', amount: 120, discount: 0.0, subtotal: 120, tax: 0, total: 120, created_at: '2025-07-27 12:27:54', updated_at: '2025-07-27 12:27:54' },
  { id: '8', number: '0000000002', reservation: '0000000001', amount: 100, discount: 0.0, subtotal: 100, tax: 0, total: 100, created_at: '2025-07-22 18:46:30', updated_at: '2025-07-22 18:46:30' },
  { id: '9', number: '0000000001', reservation: '0000000001', amount: 100, discount: 0.0, subtotal: 100, tax: 0, total: 100, created_at: '2025-07-22 18:32:55', updated_at: '2025-07-22 18:32:55' },
];

const newReceiptTemplate: Omit<Receipt, 'id' | 'createdAt' | 'updatedAt'> = {
    receiptNumber: '',
    currency: 'SAR',
    value: 0,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    paymentMethod: 'نقدي',
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
    const [receipts, setReceipts] = useState<Receipt[]>(mockReceipts);
    const [paymentVouchers, setPaymentVouchers] = useState<Receipt[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [voucherType, setVoucherType] = useState<VoucherType>('receipt'); // Default to receipt
    const [searchTerm, setSearchTerm] = useState('');
    const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');

    const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState<Receipt | null>(null);
    const [voucherToDelete, setVoucherToDelete] = useState<Receipt | null>(null);
    const [viewingVoucher, setViewingVoucher] = useState<Receipt | null>(null);
    
    // State for invoice actions
    const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
    const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);
    const [invoiceForPreview, setInvoiceForPreview] = useState<Invoice | null>(null);

    const isPaymentView = voucherType === 'payment';
    const isInvoiceView = voucherType === 'invoice';

    const dataForCurrentTab = useMemo(() => {
        switch (voucherType) {
            case 'invoice': return invoices;
            case 'payment': return paymentVouchers;
            case 'receipt':
            default:
                return receipts;
        }
    }, [voucherType, invoices, paymentVouchers, receipts]);

    const paymentMethodsForFilter = useMemo(() => [
        t('receipts.paymentMethod_cash'),
        t('receipts.paymentMethod_creditCard'),
        t('receipts.paymentMethod_bankTransfer'),
        t('receipts.paymentMethod_paidByCompany'),
        t('receipts.paymentMethod_digitalPayment'),
        t('receipts.paymentMethod_travelAgents'),
        t('receipts.paymentMethod_electronicChannel'),
        t('receipts.paymentMethod_unspecified'),
    ], [t]);

    const filteredData = useMemo(() => {
        let data: (Receipt | Invoice)[] = dataForCurrentTab;

        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            data = data.filter(item => {
                if ('receiptNumber' in item) { // Receipt or PaymentVoucher
                    return (
                        item.receiptNumber.toLowerCase().includes(lowerSearchTerm) ||
                        (item.bookingNumber && item.bookingNumber.toLowerCase().includes(lowerSearchTerm))
                    );
                }
                if ('number' in item) { // Invoice
                    return (
                        item.number.toLowerCase().includes(lowerSearchTerm) ||
                        item.reservation.toLowerCase().includes(lowerSearchTerm)
                    );
                }
                return false;
            });
        }

        if (voucherType !== 'invoice' && paymentMethodFilter !== 'all') {
            data = (data as Receipt[]).filter(item => item.paymentMethod === paymentMethodFilter);
        }
        
        return data;
    }, [dataForCurrentTab, searchTerm, voucherType, paymentMethodFilter]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, currentPage, itemsPerPage]);
    
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

    const handleConfirmDelete = () => {
        if (voucherToDelete) {
            if (isPaymentView) {
                setPaymentVouchers(prev => prev.filter(v => v.id !== voucherToDelete.id));
            } else {
                setReceipts(prev => prev.filter(v => v.id !== voucherToDelete.id));
            }
            setVoucherToDelete(null);
        }
    };
    
    const handleClosePanel = () => {
        setIsAddPanelOpen(false);
        setEditingVoucher(null);
    };

    const handleSaveVoucher = (voucherData: Omit<Receipt, 'id' | 'createdAt' | 'updatedAt'>) => {
        const dataSource = isPaymentView ? paymentVouchers : receipts;
        const setDataSource = isPaymentView ? setPaymentVouchers : setReceipts;

        if (editingVoucher) {
            const updatedVoucher: Receipt = {
                ...editingVoucher,
                ...voucherData,
                updatedAt: new Date().toISOString(),
            };
            setDataSource(dataSource.map(v => v.id === updatedVoucher.id ? updatedVoucher : v));
        } else {
            const maxId = Math.max(0, ...receipts.map(r => Number(r.id)), ...paymentVouchers.map(p => Number(p.id)));
            const newVoucher: Receipt = {
                ...voucherData,
                id: (maxId + 1).toString(),
                receiptNumber: `00000000${maxId + 1}`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            setDataSource(prev => [newVoucher, ...prev]);
        }
        handleClosePanel();
    };

    // Invoice action handlers
    const handlePrintInvoice = (invoice: Invoice) => {
        setViewingInvoice(null);
        setInvoiceForPreview(invoice);
    };

    const handleConfirmDeleteInvoice = () => {
        if (invoiceToDelete) {
            setInvoices(prev => prev.filter(i => i.id !== invoiceToDelete.id));
            setInvoiceToDelete(null);
        }
    };

    // Updated table headers with hidden classes for responsiveness
    // Key changes: Hidden classes added to prioritize ID, Receipt#, Value, PaymentMethod, Actions
    const receiptTableHeaders = [
        { key: 'th_id', className: 'hidden sm:table-cell' },
        { key: isPaymentView ? 'th_paymentVoucherNumber' : 'th_receiptNumber', className: '' },
        { key: 'th_currency', className: 'hidden xl:table-cell' },
        { key: 'th_value', className: '' },
        { key: 'th_date', className: 'hidden md:table-cell' },
        { key: 'th_time', className: 'hidden lg:table-cell' },
        { key: 'th_paymentMethod', className: '' },
        { key: 'th_paymentType', className: 'hidden 2xl:table-cell' },
        { key: 'th_transactionNumber', className: 'hidden 2xl:table-cell' },
        { key: 'th_bookingNumber', className: 'hidden md:table-cell' },
        { key: 'th_createdAt', className: 'hidden 2xl:table-cell' },
        { key: 'th_updatedAt', className: 'hidden 2xl:table-cell' },
        { key: 'th_actions', className: '' }
    ];
    
    const invoiceTableHeaders = [
        { key: 'th_id', className: 'hidden sm:table-cell' },
        { key: 'th_invoiceNumber', className: '' },
        { key: 'th_bookingNumber', className: 'hidden md:table-cell' },
        { key: 'th_value', className: '' },
        { key: 'th_discount', className: 'hidden lg:table-cell' },
        { key: 'th_subtotal', className: 'hidden xl:table-cell' },
        { key: 'th_tax', className: 'hidden xl:table-cell' },
        { key: 'th_total', className: 'hidden sm:table-cell' },
        { key: 'th_createdAt', className: 'hidden 2xl:table-cell' },
        { key: 'th_updatedAt', className: 'hidden 2xl:table-cell' },
        { key: 'th_actions', className: '' }
    ];
    
    const currentTableHeaders = isInvoiceView ? invoiceTableHeaders : receiptTableHeaders;

    const filterButtons = [
        { key: 'receipt', label: 'receipts.receiptVouchers' },
        { key: 'payment', label: 'receipts.paymentVouchers' },
        { key: 'invoice', label: 'receipts.invoices' },
    ];
    
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
                            setPaymentMethodFilter('all');
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
                    {!isInvoiceView && (
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <label htmlFor="paymentMethodFilter" className="text-sm font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap">{t('receipts.th_paymentMethod')}:</label>
                            <select
                                id="paymentMethodFilter"
                                value={paymentMethodFilter}
                                onChange={(e) => setPaymentMethodFilter(e.target.value)}
                                className="py-2 px-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-200 text-sm w-full sm:w-auto"
                            >
                                <option value="all">{t('units.all')}</option>
                                {paymentMethodsForFilter.map(method => <option key={method} value={method}>{method}</option>)}
                            </select>
                        </div>
                    )}
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
                            {paginatedData.length > 0 ? (
                                isInvoiceView ? (
                                    (paginatedData as Invoice[]).map(invoice => (
                                        <tr key={invoice.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
                                            <td className="px-6 py-4 hidden sm:table-cell">{invoice.id}</td>
                                            <td className="px-6 py-4">{invoice.number}</td>
                                            <td className="px-6 py-4 hidden md:table-cell">{invoice.reservation}</td>
                                            <td className="px-6 py-4">{invoice.amount.toFixed(2)}</td>
                                            <td className="px-6 py-4 hidden lg:table-cell">{invoice.discount?.toFixed(2) ?? 'N/A'}</td>
                                            <td className="px-6 py-4 hidden xl:table-cell">{invoice.subtotal?.toFixed(2) ?? 'N/A'}</td>
                                            <td className="px-6 py-4 hidden xl:table-cell">{invoice.tax?.toFixed(2) ?? 'N/A'}</td>
                                            <td className="px-6 py-4 hidden sm:table-cell">{invoice.total.toFixed(2)}</td>
                                            <td className="px-6 py-4 hidden 2xl:table-cell">{invoice.created_at}</td>
                                            <td className="px-6 py-4 hidden 2xl:table-cell">{invoice.updated_at}</td>
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
                                    (paginatedData as Receipt[]).map(voucher => (
                                        <tr key={voucher.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
                                            <td className="px-6 py-4 hidden sm:table-cell">{voucher.id}</td>
                                            <td className="px-6 py-4">{voucher.receiptNumber}</td>
                                            <td className="px-6 py-4 hidden xl:table-cell"><span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full dark:bg-blue-900 dark:text-blue-300">{t('receipts.currency_sar')}</span></td>
                                            <td className="px-6 py-4"><span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-1 rounded-full dark:bg-red-900 dark:text-red-300">{voucher.value.toFixed(1)}</span></td>
                                            <td className="px-6 py-4 hidden md:table-cell">{voucher.date}</td>
                                            <td className="px-6 py-4 hidden lg:table-cell">{voucher.time}</td>
                                            <td className="px-6 py-4">{voucher.paymentMethod}</td>
                                            <td className="px-6 py-4 hidden 2xl:table-cell">{voucher.paymentType || '-'}</td>
                                            <td className="px-6 py-4 hidden 2xl:table-cell">{voucher.transactionNumber || '-'}</td>
                                            <td className="px-6 py-4 hidden md:table-cell">{voucher.bookingNumber || '-'}</td>
                                            <td className="px-6 py-4 hidden 2xl:table-cell">{voucher.createdAt}</td>
                                            <td className="px-6 py-4 hidden 2xl:table-cell">{voucher.updatedAt}</td>
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
                       {`${t('units.showing')} ${filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} ${t('units.to')} ${Math.min(currentPage * itemsPerPage, filteredData.length)} ${t('units.of')} ${filteredData.length} ${t('units.entries')}`}
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
