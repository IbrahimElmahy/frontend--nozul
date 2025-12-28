import React, { useState, useMemo, useContext, useEffect, useCallback } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Currency } from '../types';
import ConfirmationModal from './ConfirmationModal';
import AddCurrencyPanel from './AddCurrencyPanel';
import CurrencyDetailsModal from './CurrencyDetailsModal';
import { listCurrencies, createCurrency, updateCurrency, deleteCurrency, toggleCurrencyStatus } from '../services/financials';

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

const newCurrencyTemplate: Omit<Currency, 'id' | 'createdAt' | 'updatedAt'> = {
    name_en: '',
    name_ar: '',
    type: 'local',
    exchange_rate: 1,
    status: 'active',
    symbol_en: '',
    fraction_en: '',
    symbol_ar: '',
    fraction_ar: '',
};

const CurrenciesPage: React.FC = () => {
    const { t } = useContext(LanguageContext);
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);

    // UI State
    const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
    const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);
    const [currencyToDelete, setCurrencyToDelete] = useState<Currency | null>(null);
    const [viewingCurrency, setViewingCurrency] = useState<Currency | null>(null);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return currencies.slice(startIndex, startIndex + itemsPerPage);
    }, [currencies, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(currencies.length / itemsPerPage);

    const fetchCurrencies = useCallback(async () => {
        setLoading(true);
        try {
            const data = await listCurrencies();
            setCurrencies(data);
        } catch (err) {
            console.error("Error fetching currencies", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCurrencies();
    }, [fetchCurrencies]);

    // Handlers
    const handleClosePanel = () => {
        setIsAddPanelOpen(false);
        setEditingCurrency(null);
    };

    const handleSaveCurrency = async (currencyData: Omit<Currency, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
            const formData = new FormData();
            formData.append('name_en', currencyData.name_en);
            formData.append('name_ar', currencyData.name_ar);
            formData.append('type', currencyData.type);
            formData.append('exchange_rate', currencyData.exchange_rate.toString());
            // Map status to boolean for toggle? Or backend expects 'active'/'inactive'?
            // My add panel sends 'active'/'inactive' string in `status` field, but toggleService expects bool.
            // But create/update endpoints likely expect fields.
            // Let's look at AddCurrencyPanel again. It updates `status` (string).
            // `formData` in AddCurrencyPanel has `status` string.

            // Backend likely expects 'is_active' or similar?
            // services/financials.ts toggle uses `is_active` boolean.
            // ItemsPage used `is_active`.
            // Let's assume backend for currency might want `is_active` too or just status.
            // But wait, `Currency` type has `status`.
            // Let's invoke createCurrency with formData as constructed by keys.

            formData.append('symbol_en', currencyData.symbol_en);
            formData.append('fraction_en', currencyData.fraction_en);
            formData.append('symbol_ar', currencyData.symbol_ar);
            formData.append('fraction_ar', currencyData.fraction_ar);

            // Handle status/is_active
            // If API expects is_active:
            // formData.append('is_active', currencyData.status === 'active' ? 'true' : 'false');
            // Or maybe it expects no status field in create/update and uses toggle?
            // I'll append what I have.

            let savedId: string | number | undefined;

            if (editingCurrency) {
                await updateCurrency(editingCurrency.id, formData);
                savedId = editingCurrency.id;
            } else {
                const response = await createCurrency(formData);
                // Try to get ID from response. It might be direct or in data property.
                // apiClient normally returns parsed JSON.
                savedId = (response as any).id || (response as any).data?.id;
            }

            // Handle status toggle if needed
            if (currencyData.status) {
                const isActive = currencyData.status === 'active';
                if (savedId && (!editingCurrency || editingCurrency.status !== currencyData.status)) {
                    await toggleCurrencyStatus(savedId, isActive);
                } else if (!editingCurrency) {
                    // For new, we might not have ID easily if createCurrency doesn't return it structured.
                    // Assuming create handles initial status or defaulting to active.
                }
            }

            fetchCurrencies();
            handleClosePanel();
        } catch (err) {
            alert(`${t('currenciesPage.saveError' as any)}: ${err instanceof Error ? err.message : t('common.unexpectedError')}`);
        }
    };

    const handleAddNewClick = () => {
        setEditingCurrency(null);
        setIsAddPanelOpen(true);
    };

    const handleEditClick = (currency: Currency) => {
        setEditingCurrency(currency);
        setIsAddPanelOpen(true);
    };

    const handleDeleteClick = (currency: Currency) => {
        setCurrencyToDelete(currency);
    };

    const handleConfirmDelete = async () => {
        if (currencyToDelete) {
            try {
                await deleteCurrency(currencyToDelete.id);
                fetchCurrencies();
                setCurrencyToDelete(null);
            } catch (err) {
                alert(`${t('currenciesPage.deleteError' as any)}: ${err instanceof Error ? err.message : t('common.unexpectedError')}`);
            }
        }
    };

    const tableHeaders = [
        { key: 'th_id', className: '' },
        { key: 'th_name_en', className: 'hidden sm:table-cell' },
        { key: 'th_name_ar', className: '' },
        { key: 'th_type', className: 'hidden md:table-cell' },
        { key: 'th_exchange', className: 'hidden md:table-cell' },
        { key: 'th_status', className: '' },
        { key: 'th_symbol_en', className: 'hidden lg:table-cell' },
        { key: 'th_fraction_en', className: 'hidden xl:table-cell' },
        { key: 'th_symbol_ar', className: 'hidden lg:table-cell' },
        { key: 'th_fraction_ar', className: 'hidden xl:table-cell' },
        { key: 'th_createdAt', className: 'hidden 2xl:table-cell' },
        { key: 'th_updatedAt', className: 'hidden 2xl:table-cell' },
        { key: 'th_actions', className: '' },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">{t('currenciesPage.pageTitle')}</h2>
                    <button onClick={handleAddNewClick} className="flex items-center gap-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                        <PlusCircleIcon className="w-5 h-5" />
                        <span>{t('currenciesPage.addCurrency')}</span>
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                <div className="flex justify-between items-center border-b dark:border-slate-700 pb-3 mb-4">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{t('currenciesPage.searchInfo')}</h3>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <button className="p-1 hover:text-slate-700 dark:hover:text-slate-200"><XMarkIcon className="w-5 h-5" /></button>
                        <button className="p-1 hover:text-slate-700 dark:hover:text-slate-200"><PlusIcon className="w-5 h-5" /></button>
                        <button onClick={fetchCurrencies} className="p-1 hover:text-slate-700 dark:hover:text-slate-200"><ArrowPathIcon className="w-5 h-5" /></button>
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
                                    <th key={header.key} scope="col" className={`px-4 py-3 whitespace-nowrap ${header.className}`}>{t(`currenciesPage.${header.key}` as any)}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={13} className="text-center py-10"><div className="flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div></div></td></tr>
                            ) : paginatedData.map(currency => (
                                <tr key={currency.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
                                    <td className="px-4 py-2">{currency.id}</td>
                                    <td className="px-4 py-2 hidden sm:table-cell">{currency.name_en}</td>
                                    <td className="px-4 py-2">{currency.name_ar}</td>
                                    <td className="px-4 py-2 hidden md:table-cell"><span className={`px-2 py-0.5 text-xs font-medium rounded-full ${currency.type === 'local' ? 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300' : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'}`}>{t(`currenciesPage.type_${currency.type}`)}</span></td>
                                    <td className="px-4 py-2 hidden md:table-cell">{currency.exchange_rate}</td>
                                    <td className="px-4 py-2">
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${currency.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                            {t(`currenciesPage.status_${currency.status}`)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 hidden lg:table-cell">{currency.symbol_en}</td>
                                    <td className="px-4 py-2 hidden xl:table-cell">{currency.fraction_en}</td>
                                    <td className="px-4 py-2 hidden lg:table-cell">{currency.symbol_ar}</td>
                                    <td className="px-4 py-2 hidden xl:table-cell">{currency.fraction_ar}</td>
                                    <td className="px-4 py-2 hidden 2xl:table-cell">{currency.createdAt}</td>
                                    <td className="px-4 py-2 hidden 2xl:table-cell">{currency.updatedAt}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex items-center justify-center gap-1">
                                            <button onClick={() => handleDeleteClick(currency)} className="p-1.5 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10"><TrashIcon className="w-5 h-5" /></button>
                                            <button onClick={() => setViewingCurrency(currency)} className="p-1.5 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/10"><EyeIcon className="w-5 h-5" /></button>
                                            <button onClick={() => handleEditClick(currency)} className="p-1.5 rounded-full text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-500/10"><PencilSquareIcon className="w-5 h-5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                        {`${t('usersPage.showing' as any)} ${currencies.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} ${t('usersPage.to' as any)} ${Math.min(currentPage * itemsPerPage, currencies.length)} ${t('usersPage.of' as any)} ${currencies.length} ${t('usersPage.entries' as any)}`}
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

            <AddCurrencyPanel
                isOpen={isAddPanelOpen}
                onClose={handleClosePanel}
                onSave={handleSaveCurrency}
                initialData={editingCurrency || newCurrencyTemplate}
                isEditing={!!editingCurrency}
            />

            <ConfirmationModal
                isOpen={!!currencyToDelete}
                onClose={() => setCurrencyToDelete(null)}
                onConfirm={handleConfirmDelete}
                title={t('currenciesPage.deleteTitle')}
                message={t('currenciesPage.confirmDeleteMessage')}
            />

            <CurrencyDetailsModal
                currency={viewingCurrency}
                onClose={() => setViewingCurrency(null)}
            />

        </div>
    );
};

export default CurrenciesPage;