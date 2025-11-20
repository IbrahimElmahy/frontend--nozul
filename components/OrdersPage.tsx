
import React, { useState, useMemo, useContext, useEffect, useCallback } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Order } from '../types';
import ConfirmationModal from './ConfirmationModal';
import OrderCard from './OrderCard';
import AddOrderPanel from './AddOrderPanel';
import OrderDetailsModal from './OrderDetailsModal';
import { apiClient } from '../apiClient';

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
    const [orders, setOrders] = useState<Order[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const [totalRecords, setTotalRecords] = useState(0);
    
    const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);
    const [orderToDeleteId, setOrderToDeleteId] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Order | null; direction: 'ascending' | 'descending' }>({ key: 'createdAt', direction: 'descending' });
    const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');


    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('start', ((currentPage - 1) * itemsPerPage).toString());
            params.append('length', itemsPerPage.toString());
            if (searchTerm) params.append('search', searchTerm);

            const response = await apiClient<{ data: any[], recordsFiltered: number }>(`/ar/order/api/orders/?${params.toString()}`);
            
            const mappedOrders: Order[] = response.data.map((o: any) => ({
                id: o.id,
                orderNumber: o.number, // API field is 'number'
                bookingNumber: o.reservation ? o.reservation.id : '', // Use ID or a displayable number if available
                apartmentName: o.reservation && o.reservation.apartment ? o.reservation.apartment : '',
                value: parseFloat(o.amount),
                discount: parseFloat(o.discount || 0),
                subtotal: parseFloat(o.subtotal),
                tax: parseFloat(o.tax),
                total: parseFloat(o.total),
                createdAt: o.created_at,
                updatedAt: o.updated_at,
                notes: o.note,
                items: o.order_items ? o.order_items.map((item: any) => ({
                    id: item.id,
                    service: item.service?.name_ar ?? item.service?.name_en ?? '', 
                    category: item.category?.name_ar ?? item.category?.name_en ?? '',
                    quantity: item.quantity,
                    price: parseFloat(item.price)
                })) : []
            }));

            setOrders(mappedOrders);
            setTotalRecords(response.recordsFiltered);

        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    }, [currentPage, itemsPerPage, searchTerm]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);


    const handleClosePanel = () => {
        setIsAddPanelOpen(false);
        setEditingOrder(null);
    };

    const handleSaveOrder = async (orderData: any) => {
        // orderData comes from AddOrderPanel state. 
        // It contains 'items', 'reservation' ID (passed in bookingNumber field temporarily), 'notes'
        
        try {
            const formData = new FormData();
            // Use the reservation ID stored in bookingNumber field from the panel
            formData.append('reservation', orderData.bookingNumber); 
            formData.append('note', orderData.notes);

            if (orderData.items) {
                orderData.items.forEach((item: any, index: number) => {
                    formData.append(`order_items[${index}]service`, item.service);
                    formData.append(`order_items[${index}]category`, item.category);
                    formData.append(`order_items[${index}]quantity`, item.quantity.toString());
                });
            }

            if (editingOrder) {
                await apiClient(`/ar/order/api/orders/${editingOrder.id}/`, {
                    method: 'PUT',
                    body: formData
                });
            } else {
                await apiClient('/ar/order/api/orders/', {
                    method: 'POST',
                    body: formData
                });
            }
            fetchOrders();
            handleClosePanel();
        } catch (err) {
            alert(`Error saving order: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    };

    const handleAddNewClick = () => {
        setEditingOrder(null);
        setIsAddPanelOpen(true);
    };

    const handleEditClick = (order: Order) => {
        setEditingOrder(order);
        setIsAddPanelOpen(true);
    };

    const handleDeleteClick = (orderId: string) => {
        setOrderToDeleteId(orderId);
    };

    const handleConfirmDelete = async () => {
        if (orderToDeleteId) {
            try {
                await apiClient(`/ar/order/api/orders/${orderToDeleteId}/`, { method: 'DELETE' });
                fetchOrders();
                setOrderToDeleteId(null);
            } catch (err) {
                alert(`Error deleting order: ${err instanceof Error ? err.message : 'Unknown error'}`);
            }
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
        { key: 'apartmentName', labelKey: 'orders.th_apartmentName' },
        { key: 'value', labelKey: 'orders.th_value' },
        { key: 'subtotal', labelKey: 'orders.th_subtotal' },
        { key: 'tax', labelKey: 'orders.th_tax' },
        { key: 'total', labelKey: 'orders.th_total' },
        { key: 'createdAt', labelKey: 'orders.th_createdAt' },
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
    
    const totalPages = Math.ceil(totalRecords / itemsPerPage);

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

                {loading ? (
                    <div className="text-center py-10">Loading...</div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {orders.map(order => (
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
                                             {header.key !== 'actions' ? (
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
                                             ) : (
                                                 <span>{t(header.labelKey as any)}</span>
                                             )}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
                                       {tableHeaders.map(header => (
                                            <td key={`${order.id}-${header.key}`} className="px-6 py-4 whitespace-nowrap">
                                                {header.key === 'actions' ? (
                                                    <div className="flex items-center gap-1">
                                                        <button onClick={() => setViewingOrder(order)} className="p-1.5 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/10"><EyeIcon className="w-5 h-5" /></button>
                                                        <button onClick={() => handleEditClick(order)} className="p-1.5 rounded-full text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-500/10"><PencilSquareIcon className="w-5 h-5" /></button>
                                                        <button onClick={() => handleDeleteClick(order.id)} className="p-1.5 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10"><TrashIcon className="w-5 h-5" /></button>
                                                    </div>
                                                ) : header.key === 'createdAt' ? (
                                                    new Date(order.createdAt).toLocaleDateString()
                                                ) : (
                                                    (order[header.key as keyof Order] as string | number) || '-'
                                                )}
                                            </td>
                                       ))}
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                     <tr><td colSpan={tableHeaders.length} className="text-center py-8">{t('orders.noData')}</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                        {`${t('units.showing')} ${orders.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} ${t('units.to')} ${Math.min(currentPage * itemsPerPage, totalRecords)} ${t('units.of')} ${totalRecords} ${t('units.entries')}`}
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
