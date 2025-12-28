import React, { useState, useMemo, useContext, useEffect, useCallback } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Expense } from '../types';
import ConfirmationModal from './ConfirmationModal';
import AddExpensePanel from './AddExpensePanel';
import ExpenseDetailsModal from './ExpenseDetailsModal';
import { listExpenses, createExpense, updateExpense, deleteExpense, toggleExpenseStatus } from '../services/financials';

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


const newExpenseTemplate: Omit<Expense, 'id' | 'created_at' | 'updated_at'> = {
    name_en: '',
    name_ar: '',
    description: '',
    status: 'active',
    is_active: true,
};

const ExpensesPage: React.FC = () => {
    const { t } = useContext(LanguageContext);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);

    // UI State
    const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
    const [viewingExpense, setViewingExpense] = useState<Expense | null>(null);

    const fetchExpenses = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('start', ((currentPage - 1) * itemsPerPage).toString());
            params.append('length', itemsPerPage.toString());

            const response = await listExpenses(params);
            const data: any = response.data;
            // Normalize API response
            const mappedData = data.map((item: any) => ({
                ...item,
                status: item.is_active ? 'active' : 'inactive' as 'active' | 'inactive'
            }));
            setExpenses(mappedData);

        } catch (err) {
            console.error("Error fetching expenses:", err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, itemsPerPage]);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);


    // Handlers
    const handleClosePanel = () => {
        setIsAddPanelOpen(false);
        setEditingExpense(null);
    };

    const handleSaveExpense = async (expenseData: Omit<Expense, 'id' | 'created_at' | 'updated_at'>) => {
        try {
            const formData = new FormData();
            formData.append('name_en', expenseData.name_en);
            formData.append('name_ar', expenseData.name_ar);
            formData.append('description', expenseData.description || '');

            let savedId: string | number | undefined;

            if (editingExpense) {
                await updateExpense(editingExpense.id, formData);
                savedId = editingExpense.id;
            } else {
                await createExpense(formData);
            }

            // Handle Activation/Deactivation separately
            if (expenseData.is_active !== undefined) {
                if (editingExpense && editingExpense.is_active !== expenseData.is_active) {
                    await toggleExpenseStatus(editingExpense.id, expenseData.is_active);
                }
            }

            fetchExpenses();
            handleClosePanel();
        } catch (err) {
            alert(`${t('expensesPage.saveError' as any)}: ${err instanceof Error ? err.message : t('common.unexpectedError')}`);
        }
    };

    const handleAddNewClick = () => {
        setEditingExpense(null);
        setIsAddPanelOpen(true);
    };

    const handleEditClick = (expense: Expense) => {
        setEditingExpense(expense);
        setIsAddPanelOpen(true);
    };

    const handleDeleteClick = (expense: Expense) => {
        setExpenseToDelete(expense);
    };

    const handleConfirmDelete = async () => {
        if (expenseToDelete) {
            try {
                await deleteExpense(expenseToDelete.id);
                fetchExpenses();
                setExpenseToDelete(null);
            } catch (err) {
                alert(`${t('expensesPage.deleteError' as any)}: ${err instanceof Error ? err.message : t('common.unexpectedError')}`);
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
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">{t('expensesPage.pageTitle')}</h2>
                    <button onClick={handleAddNewClick} className="flex items-center gap-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                        <PlusCircleIcon className="w-5 h-5" />
                        <span>{t('expensesPage.addExpense')}</span>
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                <div className="flex justify-between items-center border-b dark:border-slate-700 pb-3 mb-4">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{t('expensesPage.searchInfo')}</h3>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <button className="p-1 hover:text-slate-700 dark:hover:text-slate-200"><XMarkIcon className="w-5 h-5" /></button>
                        <button onClick={fetchExpenses} className="p-1 hover:text-slate-700 dark:hover:text-slate-200"><ArrowPathIcon className="w-5 h-5" /></button>
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
                                    <th key={header.key} scope="col" className={header.className}>{t(`expensesPage.${header.key}` as any)}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7} className="py-8 text-center"><div className="flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div></div></td></tr>
                            ) : expenses.map(expense => (
                                <tr key={expense.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
                                    <td className="px-4 py-2 hidden md:table-cell">{expense.id}</td>
                                    <td className="px-4 py-2 text-start">{expense.name_en}</td>
                                    <td className="px-4 py-2 text-start">{expense.name_ar}</td>
                                    <td className="px-4 py-2">
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${expense.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                            {t(`expensesPage.status_${expense.is_active ? 'active' : 'inactive'}`)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap hidden md:table-cell">{new Date(expense.created_at).toLocaleDateString()}</td>
                                    <td className="px-4 py-2 whitespace-nowrap hidden lg:table-cell">{new Date(expense.updated_at).toLocaleDateString()}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex items-center justify-center gap-1">
                                            <button onClick={() => handleDeleteClick(expense)} className="p-1.5 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10"><TrashIcon className="w-5 h-5" /></button>
                                            <button onClick={() => setViewingExpense(expense)} className="p-1.5 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/10"><EyeIcon className="w-5 h-5" /></button>
                                            <button onClick={() => handleEditClick(expense)} className="p-1.5 rounded-full text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-500/10"><PencilSquareIcon className="w-5 h-5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && expenses.length === 0 && (
                                <tr><td colSpan={7} className="py-8 text-center">{t('orders.noData')}</td></tr>
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

            <AddExpensePanel
                isOpen={isAddPanelOpen}
                onClose={handleClosePanel}
                onSave={handleSaveExpense}
                initialData={editingExpense || newExpenseTemplate}
                isEditing={!!editingExpense}
            />

            <ConfirmationModal
                isOpen={!!expenseToDelete}
                onClose={() => setExpenseToDelete(null)}
                onConfirm={handleConfirmDelete}
                title={t('expensesPage.deleteTitle')}
                message={t('expensesPage.confirmDeleteMessage')}
            />

            <ExpenseDetailsModal
                expense={viewingExpense}
                onClose={() => setViewingExpense(null)}
            />

        </div>
    );
};

export default ExpensesPage;