import React, { useState, useMemo, useContext, useEffect, useCallback } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Fund } from '../types';
import ConfirmationModal from './ConfirmationModal';
import AddFundPanel from './AddFundPanel';
import FundDetailsModal from './FundDetailsModal';
import { listFunds, createFund, updateFund, deleteFund, toggleFundStatus } from '../services/financials';

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

const newFundTemplate: Omit<Fund, 'id' | 'created_at' | 'updated_at'> = {
    name_en: '',
    name_ar: '',
    description: '',
    status: 'active',
    is_active: true,
};

const FundsPage: React.FC = () => {
    const { t } = useContext(LanguageContext);
    const [funds, setFunds] = useState<Fund[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // UI State
    const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
    const [editingFund, setEditingFund] = useState<Fund | null>(null);
    const [fundToDelete, setFundToDelete] = useState<Fund | null>(null);
    const [viewingFund, setViewingFund] = useState<Fund | null>(null);

    const fetchFunds = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            params.append('start', ((currentPage - 1) * itemsPerPage).toString());
            params.append('length', itemsPerPage.toString());

            const response = await listFunds(params);
            const data: any = response.data;
            // Normalize API response
            const mappedData = data.map((item: any) => ({
                ...item,
                status: item.is_active ? 'active' : 'inactive' as 'active' | 'inactive'
            }));
            setFunds(mappedData);

        } catch (err) {
            setError(err instanceof Error ? err.message : t('fundsPage.fetchError' as any));
        } finally {
            setLoading(false);
        }
    }, [currentPage, itemsPerPage]);

    useEffect(() => {
        fetchFunds();
    }, [fetchFunds]);


    const totalPages = Math.ceil(funds.length / itemsPerPage); // Ideally use recordsFiltered from API for true total

    // Handlers
    const handleClosePanel = () => {
        setIsAddPanelOpen(false);
        setEditingFund(null);
    };

    const handleSaveFund = async (fundData: Omit<Fund, 'id' | 'created_at' | 'updated_at'>) => {
        try {
            const formData = new FormData();
            formData.append('name_en', fundData.name_en);
            formData.append('name_ar', fundData.name_ar);
            formData.append('description', fundData.description || '');

            let savedId: string | number | undefined;

            if (editingFund) {
                await updateFund(editingFund.id, formData);
                savedId = editingFund.id;
            } else {
                await createFund(formData);
            }

            // Handle Activation/Deactivation separately if status changed or is new
            // Assuming create/update doesn't set status directly or we want to enforce it via separate call
            // Consistent with previous logic
            if (fundData.is_active !== undefined) {
                if (editingFund && editingFund.is_active !== fundData.is_active) {
                    await toggleFundStatus(editingFund.id, fundData.is_active);
                }
                // If new, we might miss the ID if create doesn't return it.
            }

            fetchFunds();
            handleClosePanel();
        } catch (err) {
            alert(`${t('fundsPage.saveError' as any)}: ${err instanceof Error ? err.message : t('common.unexpectedError')}`);
        }
    };

    const handleAddNewClick = () => {
        setEditingFund(null);
        setIsAddPanelOpen(true);
    };

    const handleEditClick = (fund: Fund) => {
        setEditingFund(fund);
        setIsAddPanelOpen(true);
    };

    const handleDeleteClick = (fund: Fund) => {
        setFundToDelete(fund);
    };

    const handleConfirmDelete = async () => {
        if (fundToDelete) {
            try {
                await deleteFund(fundToDelete.id);
                fetchFunds();
                setFundToDelete(null);
            } catch (err) {
                alert(`${t('fundsPage.deleteError' as any)}: ${err instanceof Error ? err.message : t('common.unexpectedError')}`);
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
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">{t('fundsPage.pageTitle')}</h2>
                    <button onClick={handleAddNewClick} className="flex items-center gap-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                        <PlusCircleIcon className="w-5 h-5" />
                        <span>{t('fundsPage.addFund')}</span>
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                <div className="flex justify-between items-center border-b dark:border-slate-700 pb-3 mb-4">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{t('fundsPage.searchInfo')}</h3>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <button className="p-1 hover:text-slate-700 dark:hover:text-slate-200"><XMarkIcon className="w-5 h-5" /></button>
                        <button onClick={fetchFunds} className="p-1 hover:text-slate-700 dark:hover:text-slate-200"><ArrowPathIcon className="w-5 h-5" /></button>
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
                                    <th key={header.key} scope="col" className={header.className}>{t(`fundsPage.${header.key}` as any)}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7} className="py-8 text-center"><div className="flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div></div></td></tr>
                            ) : funds.map(fund => (
                                <tr key={fund.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
                                    <td className="px-4 py-2 hidden md:table-cell">{fund.id}</td>
                                    <td className="px-4 py-2 text-start">{fund.name_en}</td>
                                    <td className="px-4 py-2 text-start">{fund.name_ar}</td>
                                    <td className="px-4 py-2">
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${fund.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                            {t(`fundsPage.status_${fund.is_active ? 'active' : 'inactive'}`)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap hidden md:table-cell">{new Date(fund.created_at).toLocaleDateString()}</td>
                                    <td className="px-4 py-2 whitespace-nowrap hidden lg:table-cell">{new Date(fund.updated_at).toLocaleDateString()}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex items-center justify-center gap-1">
                                            <button onClick={() => handleDeleteClick(fund)} className="p-1.5 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10"><TrashIcon className="w-5 h-5" /></button>
                                            <button onClick={() => setViewingFund(fund)} className="p-1.5 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/10"><EyeIcon className="w-5 h-5" /></button>
                                            <button onClick={() => handleEditClick(fund)} className="p-1.5 rounded-full text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-500/10"><PencilSquareIcon className="w-5 h-5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && funds.length === 0 && (
                                <tr><td colSpan={7} className="py-8 text-center">{t('orders.noData')}</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                        {/* Simple pagination display for now */}
                        {currentPage}
                    </div>
                    <nav className="flex items-center gap-1" aria-label="Pagination">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronLeftIcon className="w-5 h-5" /></button>
                        <span className="text-sm font-semibold px-2">{currentPage}</span>
                        <button onClick={() => setCurrentPage(p => p + 1)} className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronRightIcon className="w-5 h-5" /></button>
                    </nav>
                </div>
            </div>

            <AddFundPanel
                isOpen={isAddPanelOpen}
                onClose={handleClosePanel}
                onSave={handleSaveFund}
                initialData={editingFund || newFundTemplate}
                isEditing={!!editingFund}
            />

            <ConfirmationModal
                isOpen={!!fundToDelete}
                onClose={() => setFundToDelete(null)}
                onConfirm={handleConfirmDelete}
                title={t('fundsPage.deleteTitle')}
                message={t('fundsPage.confirmDeleteMessage')}
            />

            <FundDetailsModal
                fund={viewingFund}
                onClose={() => setViewingFund(null)}
            />

        </div>
    );
};

export default FundsPage;