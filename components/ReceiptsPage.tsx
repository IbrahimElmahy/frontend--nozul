import React, { useState, useMemo, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Receipt } from '../types';
import PlusCircleIcon from './icons-redesign/PlusCircleIcon';
import PlusIcon from './icons-redesign/PlusIcon';
import ArrowPathIcon from './icons-redesign/ArrowPathIcon';
import XCircleIcon from './icons-redesign/XCircleIcon';
import ChevronLeftIcon from './icons-redesign/ChevronLeftIcon';
import ChevronRightIcon from './icons-redesign/ChevronRightIcon';
import TrashIcon from './icons-redesign/TrashIcon';
import PrinterIcon from './icons-redesign/PrinterIcon';
import DocumentDuplicateIcon from './icons-redesign/DocumentDuplicateIcon';
import AddReceiptPanel from './AddReceiptPanel';

const mockReceipts: Receipt[] = [
  { id: 1, receiptNumber: '0000000018', currency: 'SAR', value: 152.0, date: '2025-10-07', time: '16:57:00', paymentMethod: 'نقدي', paymentType: null, transactionNumber: null, bookingNumber: null, createdAt: '2025-10-07 13:58:41', updatedAt: '2025-10-07 13:58:41' },
  { id: 2, receiptNumber: '0000000017', currency: 'SAR', value: 8000.0, date: '2025-08-23', time: '22:33:00', paymentMethod: 'نقدي', paymentType: null, transactionNumber: null, bookingNumber: '0000000196', createdAt: '2025-08-23 19:34:23', updatedAt: '2025-08-23 19:34:23' },
  { id: 3, receiptNumber: '0000000016', currency: 'SAR', value: 100.0, date: '2025-08-23', time: '21:53:00', paymentMethod: 'نقدي', paymentType: null, transactionNumber: null, bookingNumber: '0000000195', createdAt: '2025-08-23 18:54:24', updatedAt: '2025-08-23 18:54:24' },
  { id: 4, receiptNumber: '0000000015', currency: 'SAR', value: 100.0, date: '2025-08-23', time: '19:30:00', paymentMethod: 'نقدي', paymentType: null, transactionNumber: null, bookingNumber: '0000000192', createdAt: '2025-08-23 16:31:45', updatedAt: '2025-08-23 16:31:45' },
  { id: 5, receiptNumber: '0000000014', currency: 'SAR', value: 250.0, date: '2025-06-26', time: '12:57:00', paymentMethod: 'بطاقة ائتمانية', paymentType: null, transactionNumber: null, bookingNumber: '0000000182', createdAt: '2025-06-28 10:26:17', updatedAt: '2025-06-28 10:26:17' },
  { id: 6, receiptNumber: '0000000013', currency: 'SAR', value: 150.0, date: '2025-06-07', time: '07:51:00', paymentMethod: 'التحويل البنكي', paymentType: null, transactionNumber: null, bookingNumber: '0000000177', createdAt: '2025-06-07 13:51:37', updatedAt: '2025-07-30 02:10:11' },
  { id: 7, receiptNumber: '0000000012', currency: 'SAR', value: 2750.0, date: '2025-06-07', time: '13:59:00', paymentMethod: 'نقدي', paymentType: null, transactionNumber: null, bookingNumber: '0000000176', createdAt: '2025-06-07 10:59:39', updatedAt: '2025-06-07 10:59:39' },
  { id: 8, receiptNumber: '0000000011', currency: 'SAR', value: 2750.0, date: '2025-06-07', time: '13:58:00', paymentMethod: 'نقدي', paymentType: null, transactionNumber: null, bookingNumber: '0000000176', createdAt: '2025-06-07 10:59:01', updatedAt: '2025-06-07 10:59:01' },
  { id: 9, receiptNumber: '0000000010', currency: 'SAR', value: 1400.0, date: '2025-05-22', time: '01:43:00', paymentMethod: 'نقدي', paymentType: null, transactionNumber: null, bookingNumber: '0000000154', createdAt: '2025-05-22 22:46:17', updatedAt: '2025-05-22 22:46:17' },
  { id: 10, receiptNumber: '0000000009', currency: 'SAR', value: 200.0, date: '2025-05-10', time: '03:33:00', paymentMethod: 'نقدي', paymentType: null, transactionNumber: null, bookingNumber: null, createdAt: '2025-05-10 00:34:20', updatedAt: '2025-05-10 00:34:20' },
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


const ReceiptsPage: React.FC = () => {
    const { t } = useContext(LanguageContext);
    const [receipts, setReceipts] = useState<Receipt[]>(mockReceipts);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [activeFilter, setActiveFilter] = useState('vouchers');
    const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
    const [editingReceipt, setEditingReceipt] = useState<Receipt | null>(null);

    const filteredReceipts = useMemo(() => {
        // Placeholder for filtering logic
        return receipts;
    }, [receipts, activeFilter]);

    const totalPages = Math.ceil(filteredReceipts.length / itemsPerPage);
    const paginatedReceipts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredReceipts.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredReceipts, currentPage, itemsPerPage]);
    
    const handleAddNewClick = () => {
        setEditingReceipt(null);
        setIsAddPanelOpen(true);
    };
    
    const handleClosePanel = () => {
        setIsAddPanelOpen(false);
        setEditingReceipt(null);
    };

    const handleSaveReceipt = (receiptData: Omit<Receipt, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newReceipt: Receipt = {
            ...receiptData,
            id: Math.max(0, ...receipts.map(r => r.id)) + 1,
            receiptNumber: `00000000${Math.max(0, ...receipts.map(r => parseInt(r.receiptNumber, 10))) + 1}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setReceipts(prev => [newReceipt, ...prev]);
        handleClosePanel();
    };


    const tableHeaders = [
        'th_id', 'th_receiptNumber', 'th_currency', 'th_value', 'th_date', 'th_time',
        'th_paymentMethod', 'th_paymentType', 'th_transactionNumber', 'th_bookingNumber',
        'th_createdAt', 'th_updatedAt', 'th_actions'
    ];

    const filterButtons = [
        { key: 'vouchers', label: 'receipts.vouchers' },
        { key: 'receiptVouchers', label: 'receipts.receiptVouchers' },
        { key: 'paymentVouchers', label: 'receipts.paymentVouchers' },
        { key: 'invoices', label: 'receipts.invoices' },
    ];
    
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{t('receipts.manageReceipts')}</h2>
                 <div className="flex items-center gap-2">
                    <button onClick={handleAddNewClick} className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                        <PlusCircleIcon className="w-5 h-5" />
                        <span>{t('receipts.addReceipt')}</span>
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {filterButtons.map(btn => (
                     <button 
                        key={btn.key}
                        onClick={() => setActiveFilter(btn.key)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeFilter === btn.key ? 'bg-blue-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                    >
                         {t(btn.label as any)}
                     </button>
                ))}
            </div>

             <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-4 pb-4 border-b dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{t('receipts.searchInfo')}</h3>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <button className="p-1.5 hover:text-slate-700 dark:hover:text-slate-200"><PlusIcon className="w-5 h-5"/></button>
                        <button className="p-1.5 hover:text-slate-700 dark:hover:text-slate-200"><XCircleIcon className="w-5 h-5"/></button>
                        <button className="p-1.5 hover:text-slate-700 dark:hover:text-slate-200"><ArrowPathIcon className="w-5 h-5"/></button>
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
                                {tableHeaders.map(headerKey => <th key={headerKey} scope="col" className="px-6 py-3">{t(`receipts.${headerKey}` as any)}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedReceipts.map((receipt) => (
                                <tr key={receipt.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
                                    <td className="px-6 py-4">{receipt.id}</td>
                                    <td className="px-6 py-4">{receipt.receiptNumber}</td>
                                    <td className="px-6 py-4"><span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full dark:bg-blue-900 dark:text-blue-300">{t('receipts.currency_sar')}</span></td>
                                    <td className="px-6 py-4"><span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-1 rounded-full dark:bg-red-900 dark:text-red-300">{receipt.value.toFixed(1)}</span></td>
                                    <td className="px-6 py-4">{receipt.date}</td>
                                    <td className="px-6 py-4">{receipt.time}</td>
                                    <td className="px-6 py-4">{receipt.paymentMethod}</td>
                                    <td className="px-6 py-4">{receipt.paymentType || '-'}</td>
                                    <td className="px-6 py-4">{receipt.transactionNumber || '-'}</td>
                                    <td className="px-6 py-4">{receipt.bookingNumber || '-'}</td>
                                    <td className="px-6 py-4">{receipt.createdAt}</td>
                                    <td className="px-6 py-4">{receipt.updatedAt}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1">
                                            <button className="p-1.5 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/10"><PrinterIcon className="w-5 h-5"/></button>
                                            <button className="p-1.5 rounded-full text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-500/10"><DocumentDuplicateIcon className="w-5 h-5"/></button>
                                            <button className="p-1.5 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10"><TrashIcon className="w-5 h-5"/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                 <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                       {`${t('units.showing')} ${filteredReceipts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} ${t('units.to')} ${Math.min(currentPage * itemsPerPage, filteredReceipts.length)} ${t('units.of')} ${filteredReceipts.length} ${t('units.entries')}`}
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
                onSave={handleSaveReceipt}
                initialData={editingReceipt || newReceiptTemplate}
                isEditing={!!editingReceipt}
            />
        </div>
    );
};

export default ReceiptsPage;