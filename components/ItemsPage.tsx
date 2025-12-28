
import React, { useState, useContext, useEffect, useCallback } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Item, Service, Category } from '../types';
import ConfirmationModal from './ConfirmationModal';
import AddItemPanel from './AddItemPanel';
import ItemDetailsModal from './ItemDetailsModal';
import { listServices, createService, updateService, deleteService, toggleServiceStatus, listCategories, createCategory, updateCategory, deleteCategory, toggleCategoryStatus } from '../services/items';

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
import TagIcon from './icons-redesign/TagIcon';
import CubeIcon from './icons-redesign/CubeIcon';
import Switch from './Switch';


const newItemTemplate: Omit<Item, 'id' | 'created_at' | 'updated_at'> = {
    name_en: '',
    name_ar: '',
    description: '',
    status: 'active',
    is_active: true,
    services: 0,
    price: 0,
    category: '',
};

type ViewType = 'services' | 'categories';

const ItemsPage: React.FC = () => {
    const { t, language } = useContext(LanguageContext);
    const [items, setItems] = useState<Item[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState<ViewType>('services');

    // UI State
    const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
    const [panelMode, setPanelMode] = useState<'add' | 'edit' | 'copy'>('add');
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
    const [viewingItem, setViewingItem] = useState<Item | null>(null);


    const fetchItems = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('start', ((currentPage - 1) * itemsPerPage).toString());
            params.append('length', itemsPerPage.toString());

            let response;
            if (activeView === 'services') {
                response = await listServices(params);
            } else {
                response = await listCategories(params);
            }

            // Normalize API response
            const mappedData = response.data.map(item => ({
                ...item,
                services: item.services || 0,
                status: item.is_active ? 'active' : 'inactive' as 'active' | 'inactive',
                category_name: typeof item.category === 'object' ? item.category.name_ar : '' // Handle category object expansion if API returns it
            }));
            setItems(mappedData);

        } catch (err) {
            console.error(`Error fetching ${activeView}:`, err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, itemsPerPage, activeView]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    useEffect(() => {
        setPagination({ currentPage: 1 }); // Reset to page 1 on view switch
    }, [activeView]);

    const setPagination = (updates: Partial<{ currentPage: number, itemsPerPage: number }>) => {
        if (updates.currentPage) setCurrentPage(updates.currentPage);
        if (updates.itemsPerPage) setItemsPerPage(updates.itemsPerPage);
    }


    // Handlers
    const handleClosePanel = () => {
        setIsAddPanelOpen(false);
        setEditingItem(null);
    };

    const handleSaveItem = async (itemData: Omit<Item, 'id' | 'created_at' | 'updated_at'>) => {
        try {
            const formData = new FormData();
            formData.append('name_en', itemData.name_en);
            formData.append('name_ar', itemData.name_ar);
            formData.append('description', itemData.description || '');

            if (activeView === 'services') {
                formData.append('price', (itemData.price || 0).toString());
                if (itemData.category) {
                    formData.append('category', itemData.category);
                }
            }

            let savedItem: Item | any; // create/updateService returns generic or Item.

            if (panelMode === 'edit' && editingItem) {
                if (activeView === 'services') {
                    savedItem = await updateService(editingItem.id, formData);
                } else {
                    savedItem = await updateCategory(editingItem.id, formData);
                }
            } else {
                if (activeView === 'services') {
                    savedItem = await createService(formData);
                } else {
                    savedItem = await createCategory(formData);
                }
            }

            // Handle Activation/Deactivation separately
            if (itemData.is_active !== undefined) {
                // If editing, check if status actually changed. If new, assume default active or enforce.
                // We need ID for toggle. `savedItem` should have it.
                // createService/Category likely returns the created object with ID.
                const newItemId = savedItem?.id || (savedItem as any)?.data?.id;

                if (newItemId) {
                    if (!editingItem || editingItem.is_active !== itemData.is_active || panelMode !== 'edit') {
                        if (activeView === 'services') {
                            await toggleServiceStatus(newItemId, itemData.is_active);
                        } else {
                            await toggleCategoryStatus(newItemId, itemData.is_active);
                        }
                    }
                }
            }

            fetchItems();
            handleClosePanel();
        } catch (err) {
            alert(`${t('itemsPage.saveError' as any)}: ${err instanceof Error ? err.message : t('common.unexpectedError')}`);
        }
    };

    const handleToggleStatus = async (item: Item, newStatus: boolean) => {
        try {
            if (activeView === 'services') {
                await toggleServiceStatus(item.id, newStatus);
            } else {
                await toggleCategoryStatus(item.id, newStatus);
            }

            // Optimistically update
            setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_active: newStatus, status: newStatus ? 'active' : 'inactive' } : i));
        } catch (err) {
            alert(`${t('itemsPage.statusError' as any)}: ${err instanceof Error ? err.message : t('common.unexpectedError')}`);
            fetchItems(); // Revert on error
        }
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

    const handleConfirmDelete = async () => {
        if (itemToDelete) {
            try {
                if (activeView === 'services') {
                    await deleteService(itemToDelete.id);
                } else {
                    await deleteCategory(itemToDelete.id);
                }
                fetchItems();
                setItemToDelete(null);
            } catch (err) {
                alert(`${t('itemsPage.deleteError' as any)}: ${err instanceof Error ? err.message : t('common.unexpectedError')}`);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                    {activeView === 'services' ? t('itemsPage.pageTitle') : t('categories.pageTitle')}
                </h2>
                <button onClick={handleAddNewClick} className="flex items-center gap-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                    <PlusCircleIcon className="w-5 h-5" />
                    <span>{activeView === 'services' ? t('itemsPage.addService') : t('categories.addCategory')}</span>
                </button>
            </div>

            {/* Toggle View */}
            <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
                <button
                    onClick={() => setActiveView('services')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all ${activeView === 'services' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                >
                    <CubeIcon className="w-4 h-4" />
                    <span>{t('itemsPage.services')}</span>
                </button>
                <button
                    onClick={() => setActiveView('categories')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all ${activeView === 'categories' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                >
                    <TagIcon className="w-4 h-4" />
                    <span>{t('itemsPage.categories')}</span>
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                <div className="flex justify-between items-center border-b dark:border-slate-700 pb-3 mb-4">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{t('itemsPage.searchInfo')}</h3>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <button className="p-1 hover:text-slate-700 dark:hover:text-slate-200"><XMarkIcon className="w-5 h-5" /></button>
                        <button onClick={fetchItems} className="p-1 hover:text-slate-700 dark:hover:text-slate-200"><ArrowPathIcon className="w-5 h-5" /></button>
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
                        <option value={25}>25</option>
                        <option value={50}>50</option>
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
                                {activeView === 'services' ? (
                                    <>
                                        <th className="px-4 py-3">{t('itemsPage.servicePrice')}</th>
                                        <th className="px-4 py-3">{t('itemsPage.serviceCategory')}</th>
                                    </>
                                ) : (
                                    <th className="px-4 py-3">{t('itemsPage.th_services')}</th>
                                )}
                                <th className="px-4 py-3">{t('itemsPage.th_status')}</th>
                                <th className="px-4 py-3">{t('itemsPage.th_createdAt')}</th>
                                <th className="px-4 py-3">{t('itemsPage.th_updatedAt')}</th>
                                <th className="px-4 py-3">{t('itemsPage.th_actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={activeView === 'services' ? 9 : 8} className="py-8 text-center"><div className="flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div></div></td></tr>
                            ) : items.map(item => (
                                <tr key={item.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
                                    <td className="px-4 py-2 hidden md:table-cell"><span className="font-mono text-xs">{item.id.split('-')[0]}</span></td>
                                    <td className="px-4 py-2 text-start">{item.name_en}</td>
                                    <td className="px-4 py-2 text-start">{item.name_ar}</td>

                                    {activeView === 'services' ? (
                                        <>
                                            <td className="px-4 py-2 font-medium">{item.price}</td>
                                            <td className="px-4 py-2 text-xs text-slate-500">{item.category_name || '-'}</td>
                                        </>
                                    ) : (
                                        <td className="px-4 py-2"><span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">{item.services}</span></td>
                                    )}

                                    <td className="px-4 py-2">
                                        <Switch
                                            id={`status-${item.id}`}
                                            checked={!!item.is_active}
                                            onChange={(c) => handleToggleStatus(item, c)}
                                        />
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap">{new Date(item.created_at).toLocaleDateString()}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">{new Date(item.updated_at).toLocaleDateString()}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex items-center justify-center gap-1">
                                            <button onClick={() => handleDeleteClick(item)} className="p-1.5 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10"><TrashIcon className="w-5 h-5" /></button>
                                            <button onClick={() => setViewingItem(item)} className="p-1.5 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/10"><EyeIcon className="w-5 h-5" /></button>
                                            <button onClick={() => handleEditClick(item)} className="p-1.5 rounded-full text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-500/10"><PencilSquareIcon className="w-5 h-5" /></button>
                                            <button onClick={() => handleCopyClick(item)} className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"><DocumentDuplicateIcon className="w-5 h-5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && items.length === 0 && (
                                <tr><td colSpan={activeView === 'services' ? 9 : 8} className="py-8 text-center">{t('orders.noData')}</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                        {currentPage}
                    </div>
                    <nav className="flex items-center gap-1" aria-label="Pagination">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronLeftIcon className="w-5 h-5" /></button>
                        <span className="text-sm font-semibold px-2">{currentPage}</span>
                        <button onClick={() => setCurrentPage(p => p + 1)} className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronRightIcon className="w-5 h-5" /></button>
                    </nav>
                </div>
            </div>

            <AddItemPanel
                isOpen={isAddPanelOpen}
                onClose={handleClosePanel}
                onSave={handleSaveItem}
                mode={panelMode}
                type={activeView}
                initialData={panelMode === 'add' ? newItemTemplate : editingItem}
            />

            <ConfirmationModal
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                onConfirm={handleConfirmDelete}
                title={activeView === 'services' ? t('itemsPage.deleteItemTitle') : t('categories.deleteCategory')}
                message={activeView === 'services' ? t('itemsPage.confirmDeleteMessage') : t('categories.confirmDeleteMessage')}
            />

            <ItemDetailsModal
                item={viewingItem}
                onClose={() => setViewingItem(null)}
            />

        </div>
    );
};

export default ItemsPage;
