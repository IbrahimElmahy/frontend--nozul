import React, { useState, useMemo, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Currency } from '../types';
import ConfirmationModal from './ConfirmationModal';
import AddCurrencyPanel from './AddCurrencyPanel';
import CurrencyDetailsModal from './CurrencyDetailsModal';

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

const mockCurrencies: Currency[] = [
    { id: 1, name_en: 'Saudi Riyal', name_ar: 'ريال سعودي', type: 'local', exchange_rate: 1, status: 'active', symbol_en: 'SAR', fraction_en: 'Halala', symbol_ar: 'ر.س', fraction_ar: 'هللة', createdAt: '12:45:20 2024-03-31', updatedAt: '12:48:01 2024-03-31' },
];

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
    const [currencies, setCurrencies] = useState<Currency[]>(mockCurrencies);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    
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

    // Handlers
    const handleClosePanel = () => {
        setIsAddPanelOpen(false);
        setEditingCurrency(null);
    };

    const handleSaveCurrency = (currencyData: Omit<Currency, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (editingCurrency) {
            const updatedCurrency = { ...editingCurrency, ...currencyData, updatedAt: new Date().toISOString() };
            setCurrencies(currencies.map(c => c.id === updatedCurrency.id ? updatedCurrency : c));
        } else {
            const newCurrency: Currency = {
                ...currencyData,
                id: Math.max(...currencies.map(c => c.id), 0) + 1,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            setCurrencies(prev => [newCurrency, ...prev]);
        }
        handleClosePanel();
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

    const handleConfirmDelete = () => {
        if (currencyToDelete) {
            setCurrencies(currencies.filter(c => c.id !== currencyToDelete.id));
            setCurrencyToDelete(null);
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
                                    <th key={header.key} scope="col" className={`px-4 py-3 whitespace-nowrap ${header.className}`}>{t(`currenciesPage.${header.key}` as any)}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map(currency => (
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
                                            <button onClick={() => handleDeleteClick(currency)} className="p-1.5 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10"><TrashIcon className="w-5 h-5"/></button>
                                            <button onClick={() => setViewingCurrency(currency)} className="p-1.5 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/10"><EyeIcon className="w-5 h-5"/></button>
                                            <button onClick={() => handleEditClick(currency)} className="p-1.5 rounded-full text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-500/10"><PencilSquareIcon className="w-5 h-5"/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                 <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                        {`${t('usersPage.showing')} ${paginatedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} ${t('usersPage.to')} ${Math.min(currentPage * itemsPerPage, paginatedData.length)} ${t('usersPage.of')} ${currencies.length} ${t('usersPage.entries')}`}
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