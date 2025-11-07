import React, { useState, useMemo, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Item } from '../types';
import ConfirmationModal from './ConfirmationModal';
import AddItemPanel from './AddItemPanel';
import ItemDetailsModal from './ItemDetailsModal';

// Icons
import PlusCircleIcon from './icons-redesign/PlusCircleIcon';
import MagnifyingGlassIcon from './icons-redesign/MagnifyingGlassIcon';
import ChevronLeftIcon from './icons-redesign/ChevronLeftIcon';
import ChevronRightIcon from './icons-redesign/ChevronRightIcon';
import EyeIcon from './icons-redesign/EyeIcon';
import PencilSquareIcon from './icons-redesign/PencilSquareIcon';
import TrashIcon from './icons-redesign/TrashIcon';
import XMarkIcon from './icons-redesign/XMarkIcon';
import PlusIcon from './icons-redesign/PlusIcon';
import ArrowPathIcon from './icons-redesign/ArrowPathIcon';
import DocumentDuplicateIcon from './icons-redesign/DocumentDuplicateIcon';


const mockItems: Item[] = [
    { id: 1, name_en: 'coffe', name_ar: 'كافي', services: 3, status: 'active', createdAt: '09:55:32 2025-06-28', updatedAt: '09:55:32 2025-06-28' },
    { id: 2, name_en: 'store', name_ar: 'المتجر', services: 0, status: 'active', createdAt: '12:16:38 2025-02-26', updatedAt: '12:16:38 2025-02-26' },
    { id: 3, name_en: 'test', name_ar: 'بوفية الفندق', services: 1, status: 'active', createdAt: '20:32:10 2024-11-18', updatedAt: '20:32:10 2024-11-18' },
    { id: 4, name_en: 'Room service', name_ar: 'خدمة الغرف', services: 3, status: 'active', createdAt: '14:13:06 2024-03-31', updatedAt: '14:13:06 2024-03-31' },
];

const newItemTemplate: Omit<Item, 'id' | 'createdAt' | 'updatedAt'> = {
    name_en: '',
    name_ar: '',
    services: 0,
    status: 'active',
};

const ItemsPage: React.FC = () => {
    const { t } = useContext(LanguageContext);
    const [items, setItems] = useState<Item[]>(mockItems);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    
    // UI State
    const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
    const [panelMode, setPanelMode] = useState<'add' | 'edit' | 'copy'>('add');
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
    const [viewingItem, setViewingItem] = useState<Item | null>(null);

    const filteredData = useMemo(() => {
        return items.filter(item =>
            item.name_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.name_en.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [items, searchTerm]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, currentPage, itemsPerPage]);

    const handleClosePanel = () => {
        setIsAddPanelOpen(false);
        setEditingItem(null);
    };

    const handleSaveItem = (itemData: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (panelMode === 'edit' && editingItem) {
            const updatedItem = { ...editingItem, ...itemData, updatedAt: new Date().toISOString() };
            setItems(items.map(i => i.id === updatedItem.id ? updatedItem : i));
        } else { // add or copy
            const newItem: Item = {
                ...itemData,
                id: Math.max(...items.map(i => i.id), 0) + 1,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            setItems(prev => [newItem, ...prev]);
        }
        handleClosePanel();
    };

    const handleAddNewClick = () => {
        setEditingItem(null);
        setPanelMode('add');
        setIsAddPanelOpen(true);
    };
    
    const handleEditClick = (item: Item) => {
        setEditingItem(item);
        setPanelMode('edit');
        setIsAddPanelOpen(true);
    };

    const handleCopyClick = (item: Item) => {
        setEditingItem(item);
        setPanelMode('copy');
        setIsAddPanelOpen(true);
    }

    const handleDeleteClick = (item: Item) => {
        setItemToDelete(item);
    };

    const handleConfirmDelete = () => {
        if (itemToDelete) {
            setItems(items.filter(i => i.id !== itemToDelete.id));
            setItemToDelete(null);
        }
    };

    return (
        <div className="space-y-6">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{t('itemsPage.pageTitle')}</h2>
                 <button onClick={handleAddNewClick} className="flex items-center gap-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                    <PlusCircleIcon className="w-5 h-5" />
                    <span>{t('itemsPage.addNewItem')}</span>
                </button>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                <div className="flex justify-between items-center border-b dark:border-slate-700 pb-3 mb-4">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{t('itemsPage.searchInfo')}</h3>
                     <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <button className="p-1 hover:text-slate-700 dark:hover:text-slate-200"><XMarkIcon className="w-5 h-5"/></button>
                        <button className="p-1 hover:text-slate-700 dark:hover:text-slate-200"><PlusIcon className="w-5 h-5"/></button>
                        <button className="p-1 hover:text-slate-700 dark:hover:text-slate-200"><ArrowPathIcon className="w-5 h-5"/></button>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                 <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 mb-4">
                    <span>{t('units.showing')}</span>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                        className="py-1 px-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    >
                        <option value={10}>10</option>
                    </select>
                    <span>{t('units.entries')}</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-center text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-100 dark:bg-slate-700 dark:text-slate-300">
                            <tr>
                                <th className="px-4 py-3">{t('itemsPage.th_id')}</th>
                                <th className="px-4 py-3 text-start">{t('itemsPage.th_name_en')}</th>
                                <th className="px-4 py-3 text-start">{t('itemsPage.th_name_ar')}</th>
                                <th className="px-4 py-3">{t('itemsPage.th_services')}</th>
                                <th className="px-4 py-3">{t('itemsPage.th_status')}</th>
                                <th className="px-4 py-3">{t('itemsPage.th_createdAt')}</th>
                                <th className="px-4 py-3">{t('itemsPage.th_updatedAt')}</th>
                                <th className="px-4 py-3">{t('itemsPage.th_actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map(item => (
                                <tr key={item.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
                                    <td className="px-4 py-2">{item.id}</td>
                                    <td className="px-4 py-2 text-start">{item.name_en}</td>
                                    <td className="px-4 py-2 text-start">{item.name_ar}</td>
                                    <td className="px-4 py-2"><span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">{item.services}</span></td>
                                    <td className="px-4 py-2">
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${item.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                            {t(`itemsPage.status_${item.status}`)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap">{item.createdAt}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">{item.updatedAt}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex items-center justify-center gap-1">
                                            <button onClick={() => handleDeleteClick(item)} className="p-1.5 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10"><TrashIcon className="w-5 h-5"/></button>
                                            <button onClick={() => setViewingItem(item)} className="p-1.5 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/10"><EyeIcon className="w-5 h-5"/></button>
                                            <button onClick={() => handleEditClick(item)} className="p-1.5 rounded-full text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-500/10"><PencilSquareIcon className="w-5 h-5"/></button>
                                            <button onClick={() => handleCopyClick(item)} className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"><DocumentDuplicateIcon className="w-5 h-5"/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                 <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                        {`${t('usersPage.showing')} ${paginatedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} ${t('usersPage.to')} ${Math.min(currentPage * itemsPerPage, paginatedData.length)} ${t('usersPage.of')} ${filteredData.length} ${t('usersPage.entries')}`}
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

            <AddItemPanel 
                isOpen={isAddPanelOpen}
                onClose={handleClosePanel}
                onSave={handleSaveItem}
                mode={panelMode}
                initialData={panelMode === 'add' ? newItemTemplate : editingItem}
            />

            <ConfirmationModal
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                onConfirm={handleConfirmDelete}
                title={t('itemsPage.deleteItemTitle')}
                message={t('itemsPage.confirmDeleteMessage')}
            />

            <ItemDetailsModal 
                item={viewingItem}
                onClose={() => setViewingItem(null)}
            />

        </div>
    );
};

export default ItemsPage;
