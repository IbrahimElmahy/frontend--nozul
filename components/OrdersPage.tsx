import React, { useState, useMemo, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Order } from '../types';
import ConfirmationModal from './ConfirmationModal';
import OrderCard from './OrderCard';
import AddOrderPanel from './AddOrderPanel';
import OrderDetailsModal from './OrderDetailsModal';

// Icons
import PlusCircleIcon from './icons-redesign/PlusCircleIcon';
import MagnifyingGlassIcon from './icons-redesign/MagnifyingGlassIcon';
import ChevronLeftIcon from './icons-redesign/ChevronLeftIcon';
import ChevronRightIcon from './icons-redesign/ChevronRightIcon';
import ArrowUpIcon from './icons-redesign/ArrowUpIcon';
import ArrowDownIcon from './icons-redesign/ArrowDownIcon';
import ChevronUpDownIcon from './icons-redesign/ChevronUpDownIcon';
import EyeIcon from './icons-redesign/EyeIcon';
import PencilSquareIcon from './icons-redesign/PencilSquareIcon';
import TrashIcon from './icons-redesign/TrashIcon';
import TableCellsIcon from './icons-redesign/TableCellsIcon';
import Squares2x2Icon from './icons-redesign/Squares2x2Icon';


const mockOrders: Order[] = [
    { 
        id: 1, 
        orderNumber: '0000000016', 
        bookingNumber: '0000000180', 
        apartmentName: '2', 
        value: 58, 
        discount: 0, 
        subtotal: 58, 
        tax: 8.7, 
        total: 66.7, 
        createdAt: '2025-06-26 19:10:56', 
        updatedAt: '2025-06-26 19:10:56', 
        items: [
            { id: 'item-1', service: 'قهوه اليوم', category: 'بوفية الفندق', quantity: 2, price: 15 },
            { id: 'item-2', service: 'ماء', category: 'المتجر', quantity: 4, price: 2 },
            { id: 'item-3', service: 'كابتشينو', category: 'خدمة الغرف', quantity: 1, price: 20 },
        ], 
        notes: 'Please deliver to the room quickly.' 
    },
    { 
        id: 2, 
        orderNumber: '0000000015', 
        bookingNumber: '0000000182', 
        apartmentName: 'ذوى الهمم', 
        value: 25, 
        discount: 0, 
        subtotal: 25, 
        tax: 3.75, 
        total: 28.75, 
        createdAt: '2025-06-26 19:00:06', 
        updatedAt: '2025-06-26 19:00:07', 
        items: [
            { id: 'item-4', service: 'سباحة', category: 'خدمة الغرف', quantity: 1, price: 25 },
        ], 
        notes: '' 
    },
    { id: 3, orderNumber: '0000000014', bookingNumber: '0000000173', apartmentName: 'A213', value: 30, discount: 0, subtotal: 30, tax: 0, total: 30, createdAt: '2025-06-01 11:10:46', updatedAt: '2025-06-01 11:10:46', items: [], notes: '' },
    { id: 4, orderNumber: '0000000013', bookingNumber: '0000000165', apartmentName: 'testroom_123', value: 24, discount: 0, subtotal: 24, tax: 0, total: 24, createdAt: '2025-05-19 12:13:11', updatedAt: '2025-05-19 12:13:11', items: [], notes: '' },
    { id: 5, orderNumber: '0000000012', bookingNumber: '0000000160', apartmentName: 'testing room', value: 2, discount: 0, subtotal: 2, tax: 0, total: 2, createdAt: '2025-05-14 23:02:38', updatedAt: '2025-05-14 23:02:38', items: [], notes: '' },
    { id: 6, orderNumber: '0000000011', bookingNumber: '0000000138', apartmentName: 'A213', value: 2, discount: 0, subtotal: 2, tax: 0, total: 2, createdAt: '2025-05-13 10:43:31', updatedAt: '2025-05-13 10:43:32', items: [], notes: '' },
    { id: 7, orderNumber: '0000000010', bookingNumber: '0000000129', apartmentName: '001', value: 24, discount: 0, subtotal: 24, tax: 0, total: 24, createdAt: '2025-05-08 18:26:12', updatedAt: '2025-05-08 18:26:12', items: [], notes: '' },
    { id: 8, orderNumber: '0000000009', bookingNumber: '0000000069', apartmentName: '204', value: 12, discount: 0, subtotal: 12, tax: 0, total: 12, createdAt: '2024-12-17 22:28:57', updatedAt: '2024-12-17 22:28:57', items: [], notes: '' },
    { id: 9, orderNumber: '0000000008', bookingNumber: '0000000067', apartmentName: '206', value: 12, discount: 0, subtotal: 12, tax: 0, total: 12, createdAt: '2024-12-05 10:04:32', updatedAt: '2024-12-05 10:04:32', items: [], notes: '' },
    { id: 10, orderNumber: '0000000007', bookingNumber: '0000000034', apartmentName: '306', value: 30, discount: 0, subtotal: 30, tax: 0, total: 30, createdAt: '2024-11-18 20:30:25', updatedAt: '2024-11-18 20:30:25', items: [], notes: '' },
    { id: 11, orderNumber: '0000000006', bookingNumber: '0000000033', apartmentName: '305', value: 50, discount: 0, subtotal: 50, tax: 5, total: 55, createdAt: '2024-11-17 20:30:25', updatedAt: '2024-11-17 20:30:25', items: [], notes: '' },
    { id: 12, orderNumber: '0000000005', bookingNumber: '0000000032', apartmentName: '304', value: 60, discount: 0, subtotal: 60, tax: 6, total: 66, createdAt: '2024-11-16 20:30:25', updatedAt: '2024-11-16 20:30:25', items: [], notes: '' },
    { id: 13, orderNumber: '0000000004', bookingNumber: '0000000031', apartmentName: '303', value: 70, discount: 0, subtotal: 70, tax: 7, total: 77, createdAt: '2024-11-15 20:30:25', updatedAt: '2024-11-15 20:30:25', items: [], notes: '' },
];

const newOrderTemplate: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
    orderNumber: '',
    bookingNumber: '',
    apartmentName: '',
    value: 0,
    discount: 0,
    subtotal: 0,
    tax: 0,
    total: 0,
    items: [],
    notes: '',
};


const OrdersPage: React.FC = () => {
    const { t, language } = useContext(LanguageContext);
    const [orders, setOrders] = useState<Order[]>(mockOrders);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);
    const [orderToDeleteId, setOrderToDeleteId] = useState<number | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Order | null; direction: 'ascending' | 'descending' }>({ key: 'id', direction: 'ascending' });
    const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

    const filteredOrders = useMemo(() => {
        return orders.filter(order => 
            order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [orders, searchTerm]);

    const sortedOrders = useMemo(() => {
        let sortableItems = [...filteredOrders];
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                const key = sortConfig.key as keyof Order;
                if (a[key] === null || a[key] === undefined) return 1;
                if (b[key] === null || b[key] === undefined) return -1;
                
                let comparison = 0;
                if (typeof a[key] === 'number' && typeof b[key] === 'number') {
                    comparison = (a[key] as number) - (b[key] as number);
                } else {
                    comparison = String(a[key]).localeCompare(String(b[key]));
                }
                
                return sortConfig.direction === 'ascending' ? comparison : -comparison;
            });
        }
        return sortableItems;
    }, [filteredOrders, sortConfig]);
    
    const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedOrders.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedOrders, currentPage, itemsPerPage]);

    const handleClosePanel = () => {
        setIsAddPanelOpen(false);
        setEditingOrder(null);
    };

    const handleSaveOrder = (orderData: Order | Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (editingOrder) {
            const updatedOrder = { ...orderData, id: editingOrder.id, updatedAt: new Date().toISOString() } as Order;
            setOrders(orders.map(b => b.id === updatedOrder.id ? updatedOrder : b));
        } else {
            const newOrder: Order = {
                ...(orderData as Omit<Order, 'id' | 'createdAt' | 'updatedAt'>),
                id: Math.max(...orders.map(b => b.id), 0) + 1,
                orderNumber: `00000000${Math.max(...orders.map(o => o.id), 0) + 1}`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            setOrders(prev => [newOrder, ...prev]);
        }
        handleClosePanel();
    };

    const handleAddNewClick = () => {
        setEditingOrder(null);
        setIsAddPanelOpen(true);
    };

    const handleEditClick = (order: Order) => {
        setEditingOrder(order);
        setIsAddPanelOpen(true);
    };

    const handleDeleteClick = (orderId: number) => {
        setOrderToDeleteId(orderId);
    };

    const handleConfirmDelete = () => {
        if (orderToDeleteId) {
            setOrders(orders.filter(b => b.id !== orderToDeleteId));
            setOrderToDeleteId(null);
        }
    };
    
    const requestSort = (key: keyof Order) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const tableHeaders: { key: keyof Order | 'actions', labelKey: string }[] = [
        { key: 'id', labelKey: 'orders.th_id' },
        { key: 'orderNumber', labelKey: 'orders.th_orderNumber' },
        { key: 'bookingNumber', labelKey: 'orders.th_bookingNumber' },
        { key: 'apartmentName', labelKey: 'orders.th_apartmentName' },
        { key: 'value', labelKey: 'orders.th_value' },
        { key: 'discount', labelKey: 'orders.th_discount' },
        { key: 'subtotal', labelKey: 'orders.th_subtotal' },
        { key: 'tax', labelKey: 'orders.th_tax' },
        { key: 'total', labelKey: 'orders.th_total' },
        { key: 'createdAt', labelKey: 'orders.th_createdAt' },
        { key: 'updatedAt', labelKey: 'orders.th_updatedAt' },
        { key: 'actions', labelKey: 'orders.th_actions' },
    ];
    
    const showingEntriesControls = (
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
    );

    const searchAndViewsControls = (
        <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0 sm:w-96">
                <MagnifyingGlassIcon className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('orders.searchPlaceholder')}
                    className={`w-full py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-200 ${language === 'ar' ? 'pr-10' : 'pl-10'}`}
                />
            </div>
             <div className="flex items-center gap-2">
                <button onClick={() => setViewMode('table')} className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}`} aria-label="Table View">
                    <TableCellsIcon className="w-5 h-5" />
                </button>
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}`} aria-label="Grid View">
                    <Squares2x2Icon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );


    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{t('orders.manageOrders')}</h2>
                 <div className="flex flex-wrap items-center gap-2">
                    <button 
                        onClick={handleAddNewClick}
                        className="flex items-center gap-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        <PlusCircleIcon className="w-5 h-5" />
                        <span>{t('orders.addOrder')}</span>
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                 <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                    {language === 'ar' ? (
                        <>
                            {searchAndViewsControls}
                            {showingEntriesControls}
                        </>
                    ) : (
                        <>
                            {showingEntriesControls}
                            {searchAndViewsControls}
                        </>
                    )}
                </div>

                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {paginatedOrders.map(order => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                onViewClick={() => setViewingOrder(order)}
                                onEditClick={() => handleEditClick(order)}
                                onDeleteClick={() => handleDeleteClick(order.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-start text-slate-500 dark:text-slate-400">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                                <tr>
                                    {tableHeaders.map(header => (
                                        <th key={header.key} scope="col" className="px-6 py-3">
                                             <button 
                                                className="flex items-center gap-1.5 group" 
                                                onClick={() => requestSort(header.key as keyof Order)}
                                            >
                                                <span>{t(header.labelKey as any)}</span>
                                                <span className="flex-shrink-0">
                                                    {sortConfig.key === header.key ? (
                                                        sortConfig.direction === 'ascending' ? <ArrowUpIcon className="w-3.5 h-3.5" /> : <ArrowDownIcon className="w-3.5 h-3.5" />
                                                    ) : (
                                                        <ChevronUpDownIcon className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    )}
                                                </span>
                                            </button>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedOrders.map(order => (
                                    <tr key={order.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
                                       {tableHeaders.map(header => (
                                            <td key={`${order.id}-${header.key}`} className="px-6 py-4 whitespace-nowrap">
                                                {header.key === 'actions' ? (
                                                    <div className="flex items-center gap-1">
                                                        <button onClick={() => setViewingOrder(order)} className="p-1.5 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/10"><EyeIcon className="w-5 h-5" /></button>
                                                        <button onClick={() => handleEditClick(order)} className="p-1.5 rounded-full text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-500/10"><PencilSquareIcon className="w-5 h-5" /></button>
                                                        <button onClick={() => handleDeleteClick(order.id)} className="p-1.5 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10"><TrashIcon className="w-5 h-5" /></button>
                                                    </div>
                                                ) : header.key === 'discount' ? (
                                                    `${order.discount.toFixed(1)}%`
                                                ) : (
                                                    (order[header.key as keyof Order] as string | number) || '-'
                                                )}
                                            </td>
                                       ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                        {`${t('units.showing')} ${sortedOrders.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} ${t('units.to')} ${Math.min(currentPage * itemsPerPage, sortedOrders.length)} ${t('units.of')} ${sortedOrders.length} ${t('units.entries')}`}
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
            
            <AddOrderPanel
                initialData={editingOrder || newOrderTemplate}
                isEditing={!!editingOrder}
                isOpen={isAddPanelOpen}
                onClose={handleClosePanel}
                onSave={handleSaveOrder}
            />

            <OrderDetailsModal
                order={viewingOrder}
                onClose={() => setViewingOrder(null)}
            />

            <ConfirmationModal
                isOpen={!!orderToDeleteId}
                onClose={() => setOrderToDeleteId(null)}
                onConfirm={handleConfirmDelete}
                title={t('orders.deleteOrderTitle')}
                message={t('orders.confirmDeleteMessage')}
            />
        </div>
    );
};

export default OrdersPage;
