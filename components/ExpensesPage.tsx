import React, { useState, useMemo, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Expense } from '../types';
import ConfirmationModal from './ConfirmationModal';
import AddExpensePanel from './AddExpensePanel';
import ExpenseDetailsModal from './ExpenseDetailsModal';

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

const mockExpenses: Expense[] = [
    { id: 1, name_en: 'Wages and Salaries', name_ar: 'رواتب واجور العماله', status: 'active', createdAt: '18:03:12 2023-07-16', updatedAt: '18:03:12 2023-07-16' },
    { id: 2, name_en: 'Cleaning expenses', name_ar: 'مصاريف مهمات النظافة', status: 'active', createdAt: '18:03:26 2023-07-16', updatedAt: '18:03:26 2023-07-16' },
    { id: 3, name_en: 'Laundry and ironing expenses', name_ar: 'مصاريف غسيل وكوي', status: 'active', createdAt: '18:04:14 2023-07-16', updatedAt: '11:53:26 2024-01-25' },
    { id: 4, name_en: 'Guest Supplies', name_ar: 'مصاريف لوازم النزلاء', status: 'active', createdAt: '18:05:09 2023-07-16', updatedAt: '18:05:09 2023-07-16' },
    { id: 5, name_en: 'Workers\' Meals', name_ar: 'مصاريف وجبات العاملين', status: 'active', createdAt: '18:06:18 2023-07-16', updatedAt: '18:06:18 2023-07-16' },
    { id: 6, name_en: 'Water and Lighting expense', name_ar: 'مصاريف المياه والأنارة', status: 'active', createdAt: '18:06:37 2023-07-16', updatedAt: '18:06:37 2023-07-16' },
    { id: 7, name_en: 'Telecom and Internet expenses', name_ar: 'مصاريف الاتصالات والانترنت', status: 'active', createdAt: '18:07:21 2023-07-16', updatedAt: '18:07:21 2023-07-16' },
    { id: 8, name_en: 'Maintenance Expenses', name_ar: 'مصاريف الصيانة', status: 'active', createdAt: '18:07:40 2023-07-16', updatedAt: '18:07:40 2023-07-16' },
    { id: 9, name_en: 'Cash liquidation', name_ar: 'تصفية الصندوق', status: 'active', createdAt: '15:41:18 2024-03-02', updatedAt: '15:41:18 2024-03-02' },
    { id: 10, name_en: 'mas', name_ar: 'مصروفات 14', status: 'active', createdAt: '03:17:19 2025-03-18', updatedAt: '03:17:32 2025-03-18' },
    { id: 11, name_en: 'Expense 11', name_ar: 'مصروف 11', status: 'active', createdAt: '10:10:10 2023-01-01', updatedAt: '10:10:10 2023-01-01' },
    { id: 12, name_en: 'Expense 12', name_ar: 'مصروف 12', status: 'active', createdAt: '11:11:11 2023-02-02', updatedAt: '11:11:11 2023-02-02' },
];

const newExpenseTemplate: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'> = {
    name_en: '',
    name_ar: '',
    status: 'active',
};

const ExpensesPage: React.FC = () => {
    const { t } = useContext(LanguageContext);
    const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    
    // UI State
    const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
    const [viewingExpense, setViewingExpense] = useState<Expense | null>(null);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return expenses.slice(startIndex, startIndex + itemsPerPage);
    }, [expenses, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(expenses.length / itemsPerPage);

    // Handlers
    const handleClosePanel = () => {
        setIsAddPanelOpen(false);
        setEditingExpense(null);
    };

    const handleSaveExpense = (expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (editingExpense) {
            const updatedExpense = { ...editingExpense, ...expenseData, updatedAt: new Date().toISOString() };
            setExpenses(expenses.map(f => f.id === updatedExpense.id ? updatedExpense : f));
        } else {
            const newExpense: Expense = {
                ...expenseData,
                id: Math.max(...expenses.map(f => f.id), 0) + 1,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            setExpenses(prev => [newExpense, ...prev]);
        }
        handleClosePanel();
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

    const handleConfirmDelete = () => {
        if (expenseToDelete) {
            setExpenses(expenses.filter(f => f.id !== expenseToDelete.id));
            setExpenseToDelete(null);
        }
    };

    const tableHeaders = [
        { key: 'th_id', className: 'px-4 py-3' },
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
                                {tableHeaders.map(header => (
                                    <th key={header.key} scope="col" className={header.className}>{t(`expensesPage.${header.key}` as any)}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map(expense => (
                                <tr key={expense.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
                                    <td className="px-4 py-2">{expense.id}</td>
                                    <td className="px-4 py-2 text-start">{expense.name_en}</td>
                                    <td className="px-4 py-2 text-start">{expense.name_ar}</td>
                                    <td className="px-4 py-2">
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${expense.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                            {t(`expensesPage.status_${expense.status}`)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap hidden md:table-cell">{expense.createdAt}</td>
                                    <td className="px-4 py-2 whitespace-nowrap hidden lg:table-cell">{expense.updatedAt}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex items-center justify-center gap-1">
                                            <button onClick={() => handleDeleteClick(expense)} className="p-1.5 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10"><TrashIcon className="w-5 h-5"/></button>
                                            <button onClick={() => setViewingExpense(expense)} className="p-1.5 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/10"><EyeIcon className="w-5 h-5"/></button>
                                            <button onClick={() => handleEditClick(expense)} className="p-1.5 rounded-full text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-500/10"><PencilSquareIcon className="w-5 h-5"/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                 <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                        {`${t('usersPage.showing')} ${paginatedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} ${t('usersPage.to')} ${Math.min(currentPage * itemsPerPage, paginatedData.length)} ${t('usersPage.of')} ${expenses.length} ${t('usersPage.entries')}`}
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
