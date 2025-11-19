import React, { useState, useMemo, useContext, useEffect, useCallback } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Bank } from '../types';
import ConfirmationModal from './ConfirmationModal';
import AddBankPanel from './AddBankPanel';
import BankDetailsModal from './BankDetailsModal';
import { apiClient } from '../apiClient';

// Icons
import PlusCircleIcon from './icons-redesign/PlusCircleIcon';
import ChevronLeftIcon from './icons-redesign/ChevronLeftIcon';
import ChevronRightIcon from './icons-redesign/ChevronRightIcon';
import EyeIcon from './icons-redesign/EyeIcon';
import PencilSquareIcon from './icons-redesign/PencilSquareIcon';
import TrashIcon from './icons-redesign/TrashIcon';
import XMarkIcon from './icons-redesign/XMarkIcon';
import PlusIcon from './icons-redesign/PlusIcon';
import ArrowPathIcon from './icons-redesign/ArrowPathIcon';


const newBankTemplate: Omit<Bank, 'id' | 'created_at' | 'updated_at'> = {
    name_en: '',
    name_ar: '',
    description: '',
    status: 'active',
    is_active: true,
};

const BanksPage: React.FC = () => {
    const { t } = useContext(LanguageContext);
    const [banks, setBanks] = useState<Bank[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    
    // UI State
    const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
    const [editingBank, setEditingBank] = useState<Bank | null>(null);
    const [bankToDelete, setBankToDelete] = useState<Bank | null>(null);
    const [viewingBank, setViewingBank] = useState<Bank | null>(null);

    const fetchBanks = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('start', ((currentPage - 1) * itemsPerPage).toString());
            params.append('length', itemsPerPage.toString());
            
            const response = await apiClient<{ data: Bank[], recordsFiltered: number }>(`/ar/bank/api/banks/?${params.toString()}`);
             // Normalize API response
            const mappedData = response.data.map(item => ({
                ...item,
                status: item.is_active ? 'active' : 'inactive' as 'active' | 'inactive'
            }));
            setBanks(mappedData);

        } catch (err) {
            console.error("Error fetching banks:", err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, itemsPerPage]);

    useEffect(() => {
        fetchBanks();
    }, [fetchBanks]);

    // Handlers
    const handleClosePanel = () => {
        setIsAddPanelOpen(false);
        setEditingBank(null);
    };

    const handleSaveBank = async (bankData: Omit<Bank, 'id' | 'created_at' | 'updated_at'>) => {
         try {
            const formData = new FormData();
            formData.append('name_en', bankData.name_en);
            formData.append('name_ar', bankData.name_ar);
            formData.append('description', bankData.description || '');

            let savedBank: Bank;

            if (editingBank) {
                 savedBank = await apiClient<Bank>(`/ar/bank/api/banks/${editingBank.id}/`, {
                    method: 'PUT',
                    body: formData
                });
            } else {
                 savedBank = await apiClient<Bank>(`/ar/bank/api/banks/`, {
                    method: 'POST',
                    body: formData
                });
            }

            // Handle Activation/Deactivation separately
            if (bankData.is_active !== undefined) {
                 const action = bankData.is_active ? 'active' : 'disable';
                 if (!editingBank || editingBank.is_active !== bankData.is_active) {
                     await apiClient(`/ar/bank/api/banks/${savedBank.id}/${action}/`, { method: 'POST' });
                 }
            }

            fetchBanks();
            handleClosePanel();
        } catch (err) {
             alert(`Error saving bank: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    };

    const handleAddNewClick = () => {
        setEditingBank(null);
        setIsAddPanelOpen(true);
    };

    const handleEditClick = (bank: Bank) => {
        setEditingBank(bank);
        setIsAddPanelOpen(true);
    };

    const handleDeleteClick = (bank: Bank) => {
        setBankToDelete(bank);
    };

    const handleConfirmDelete = async () => {
        if (bankToDelete) {
            try {
                await apiClient(`/ar/bank/api/banks/${bankToDelete.id}/`, { method: 'DELETE' });
                fetchBanks();
                setBankToDelete(null);
            } catch (err) {
                 alert(`Error deleting bank: ${err instanceof Error ? err.message : 'Unknown error'}`);
            }
        }
    };

    const tableHeaders = [
        { key: 'th_id', className: 'px-4 py-3 hidden md:table-cell' },
        { key: 'th_name_en', className: 'px-4 py-3 text-start' },
        { key: 'th_name_ar', className: 'px-4 py-3 text-start' },
        { key: 'th_status', className: 'px-4 py-3' },
        { key: 'th_createdAt', className: 'px-4 py-3 hidden md:table-cell' },
        { key: 'th_updatedAt', className: 'px-4 py-3 hidden lg:table-cell' },
        { key: 'th_actions', className: 'px-4 py-3' },
    ];
    
    return (
        <div className="space-y-6">
             <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">{t('banksPage.pageTitle')}</h2>
                    <button onClick={handleAddNewClick} className="flex items-center gap-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                        <PlusCircleIcon className="w-5 h-5" />
                        <span>{t('banksPage.addBank')}</span>
                    </button>
                </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                <div className="flex justify-between items-center border-b dark:border-slate-700 pb-3 mb-4">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{t('banksPage.searchInfo')}</h3>
                     <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <button className="p-1 hover:text-slate-700 dark:hover:text-slate-200"><XMarkIcon className="w-5 h-5"/></button>
                        <button onClick={fetchBanks} className="p-1 hover:text-slate-700 dark:hover:text-slate-200"><ArrowPathIcon className="w-5 h-5"/></button>
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
                                {tableHeaders.map(header => (
                                    <th key={header.key} scope="col" className={header.className}>{t(`banksPage.${header.key}` as any)}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7} className="py-8 text-center">Loading...</td></tr>
                            ) : banks.map(bank => (
                                <tr key={bank.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
                                    <td className="px-4 py-2 hidden md:table-cell">{bank.id}</td>
                                    <td className="px-4 py-2 text-start">{bank.name_en}</td>
                                    <td className="px-4 py-2 text-start">{bank.name_ar}</td>
                                    <td className="px-4 py-2">
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${bank.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                            {t(`banksPage.status_${bank.is_active ? 'active' : 'inactive'}`)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap hidden md:table-cell">{new Date(bank.created_at).toLocaleDateString()}</td>
                                    <td className="px-4 py-2 whitespace-nowrap hidden lg:table-cell">{new Date(bank.updated_at).toLocaleDateString()}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex items-center justify-center gap-1">
                                            <button onClick={() => handleDeleteClick(bank)} className="p-1.5 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10"><TrashIcon className="w-5 h-5"/></button>
                                            <button onClick={() => setViewingBank(bank)} className="p-1.5 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/10"><EyeIcon className="w-5 h-5"/></button>
                                            <button onClick={() => handleEditClick(bank)} className="p-1.5 rounded-full text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-500/10"><PencilSquareIcon className="w-5 h-5"/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                             {!loading && banks.length === 0 && (
                                <tr><td colSpan={7} className="py-8 text-center">{t('orders.noData')}</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                 <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
                     <div className="text-sm text-slate-600 dark:text-slate-300">
                         Page {currentPage}
                    </div>
                    <nav className="flex items-center gap-1" aria-label="Pagination">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronLeftIcon className="w-5 h-5" /></button>
                        <span className="text-sm font-semibold px-2">{currentPage}</span>
                        <button onClick={() => setCurrentPage(p => p + 1)} className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronRightIcon className="w-5 h-5" /></button>
                    </nav>
                </div>
            </div>
            
            <AddBankPanel
                isOpen={isAddPanelOpen}
                onClose={handleClosePanel}
                onSave={handleSaveBank}
                initialData={editingBank || newBankTemplate}
                isEditing={!!editingBank}
            />

            <ConfirmationModal
                isOpen={!!bankToDelete}
                onClose={() => setBankToDelete(null)}
                onConfirm={handleConfirmDelete}
                title={t('banksPage.deleteTitle')}
                message={t('banksPage.confirmDeleteMessage')}
            />

            <BankDetailsModal 
                bank={viewingBank}
                onClose={() => setViewingBank(null)}
            />

        </div>
    );
};

export default BanksPage;