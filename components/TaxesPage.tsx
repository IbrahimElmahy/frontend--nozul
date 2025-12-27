
import React, { useState, useMemo, useContext, useEffect, useCallback } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Tax } from '../types';
import PlusCircleIcon from './icons-redesign/PlusCircleIcon';
import XMarkIcon from './icons-redesign/XMarkIcon';
import PlusIcon from './icons-redesign/PlusIcon';
import ArrowPathIcon from './icons-redesign/ArrowPathIcon';
import ChevronLeftIcon from './icons-redesign/ChevronLeftIcon';
import ChevronRightIcon from './icons-redesign/ChevronRightIcon';
import EyeIcon from './icons-redesign/EyeIcon';
import PencilSquareIcon from './icons-redesign/PencilSquareIcon';
import TrashIcon from './icons-redesign/TrashIcon';
import AddTaxPanel from './AddTaxPanel';
import ConfirmationModal from './ConfirmationModal';
import TaxDetailsModal from './TaxDetailsModal';
import { listTaxes, deleteTax, toggleTaxStatus } from '../services/taxes';
import Switch from './Switch';

const newTaxTemplate: Omit<Tax, 'id' | 'created_at' | 'updated_at'> = {
    name: '',
    tax_value: 0,
    tax_type: 'percent',
    applies_to: 'reservation',
    start_date: new Date().toISOString(),
    end_date: new Date().toISOString(),
    is_added_to_price: false,
    is_vat_included: false,
    is_active: true,
};

const TaxesPage: React.FC = () => {
    const { t } = useContext(LanguageContext);
    const [taxes, setTaxes] = useState<Tax[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const [totalRecords, setTotalRecords] = useState(0);

    // UI State
    const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
    const [editingTax, setEditingTax] = useState<Tax | null>(null);
    const [taxToDelete, setTaxToDelete] = useState<Tax | null>(null);
    const [viewingTax, setViewingTax] = useState<Tax | null>(null);

    const fetchTaxes = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('start', ((currentPage - 1) * itemsPerPage).toString());
            params.append('length', itemsPerPage.toString());

            const response = await listTaxes(params);
            setTaxes(response.data);
            setTotalRecords(response.recordsFiltered);
        } catch (error) {
            console.error("Failed to fetch taxes", error);
        } finally {
            setLoading(false);
        }
    }, [currentPage, itemsPerPage]);

    useEffect(() => {
        fetchTaxes();
    }, [fetchTaxes]);

    const totalPages = Math.ceil(totalRecords / itemsPerPage);

    // Handlers
    const handleClosePanel = () => {
        setIsAddPanelOpen(false);
        setEditingTax(null);
    };

    const handleSaveTax = () => {
        fetchTaxes();
        handleClosePanel();
    };

    const handleAddNewClick = () => {
        setEditingTax(null);
        setIsAddPanelOpen(true);
    };

    const handleEditClick = (tax: Tax) => {
        setEditingTax(tax);
        setIsAddPanelOpen(true);
    };

    const handleDeleteClick = (tax: Tax) => {
        setTaxToDelete(tax);
    };

    const handleConfirmDelete = async () => {
        if (taxToDelete) {
            try {
                await deleteTax(taxToDelete.id);
                fetchTaxes();
                setTaxToDelete(null);
            } catch (error) {
                alert(`Error deleting tax: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
    };

    const handleToggleStatus = async (tax: Tax, newStatus: boolean) => {
        try {
            await toggleTaxStatus(tax.id, newStatus);
            setTaxes(prev => prev.map(t => t.id === tax.id ? { ...t, is_active: newStatus } : t));
        } catch (error) {
            alert(`Error updating tax status: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const tableHeaders = [
        { key: 'id', className: 'hidden sm:table-cell' },
        { key: 'name', className: '' },
        { key: 'tax', className: 'hidden sm:table-cell' },
        { key: 'applyTo', className: 'hidden sm:table-cell' },
        { key: 'startDate', className: 'hidden md:table-cell' },
        { key: 'endDate', className: 'hidden md:table-cell' },
        { key: 'addedToFees', className: 'hidden lg:table-cell' },
        { key: 'subjectToVat', className: 'hidden lg:table-cell' },
        { key: 'status', className: '' },
        { key: 'createdAt', className: 'hidden xl:table-cell' },
        { key: 'updatedAt', className: 'hidden xl:table-cell' },
        { key: 'actions', className: '' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{t('taxes.pageTitle')}</h2>
                <button onClick={handleAddNewClick} className="flex items-center gap-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                    <PlusCircleIcon className="w-5 h-5" />
                    <span>{t('taxes.addTax')}</span>
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                <div className="flex justify-between items-center border-b dark:border-slate-700 pb-3 mb-4">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{t('receipts.searchInfo')}</h3>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <button className="p-1 hover:text-slate-700 dark:hover:text-slate-200"><XMarkIcon className="w-5 h-5" /></button>
                        <button onClick={handleAddNewClick} className="p-1 hover:text-slate-700 dark:hover:text-slate-200"><PlusIcon className="w-5 h-5" /></button>
                        <button onClick={fetchTaxes} className="p-1 hover:text-slate-700 dark:hover:text-slate-200"><ArrowPathIcon className="w-5 h-5" /></button>
                    </div>
                </div>
                <div className="h-4"></div>
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
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                            <tr>
                                {tableHeaders.map(header => (
                                    <th key={header.key} scope="col" className={`px-4 py-3 whitespace-nowrap ${header.className}`}>{t(`taxes.th_${header.key}` as any)}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={12} className="text-center py-10">Loading...</td></tr>
                            ) : taxes.map(tax => (
                                <tr key={tax.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
                                    <td className="px-4 py-2 hidden sm:table-cell">{tax.id.substring(0, 8)}</td>
                                    <td className="px-4 py-2">{tax.name}</td>
                                    <td className="px-4 py-2 hidden sm:table-cell">{tax.tax_value.toFixed(1)}{tax.tax_type === 'percent' ? '%' : ''}</td>
                                    <td className="px-4 py-2 hidden sm:table-cell">{tax.applies_to}</td>
                                    <td className="px-4 py-2 hidden md:table-cell">{tax.start_date}</td>
                                    <td className="px-4 py-2 hidden md:table-cell">{tax.end_date}</td>
                                    <td className="px-4 py-2 hidden lg:table-cell"><input type="checkbox" checked={tax.is_added_to_price} readOnly className="form-checkbox h-4 w-4 text-blue-600 rounded" /></td>
                                    <td className="px-4 py-2 hidden lg:table-cell"><input type="checkbox" checked={tax.is_vat_included} readOnly className="form-checkbox h-4 w-4 text-blue-600 rounded" /></td>
                                    <td className="px-4 py-2">
                                        <Switch
                                            id={`tax-status-${tax.id}`}
                                            checked={tax.is_active}
                                            onChange={(c) => handleToggleStatus(tax, c)}
                                        />
                                    </td>
                                    <td className="px-4 py-2 hidden xl:table-cell">{new Date(tax.created_at).toLocaleDateString()}</td>
                                    <td className="px-4 py-2 hidden xl:table-cell">{new Date(tax.updated_at).toLocaleDateString()}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex items-center justify-center gap-1">
                                            <button onClick={() => setViewingTax(tax)} className="p-1.5 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/10"><EyeIcon className="w-5 h-5" /></button>
                                            <button onClick={() => handleEditClick(tax)} className="p-1.5 rounded-full text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-500/10"><PencilSquareIcon className="w-5 h-5" /></button>
                                            <button onClick={() => handleDeleteClick(tax)} className="p-1.5 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10"><TrashIcon className="w-5 h-5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && taxes.length === 0 && (
                                <tr><td colSpan={12} className="text-center py-8">{t('orders.noData')}</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                        {`${t('units.showing')} ${taxes.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} ${t('units.to')} ${Math.min(currentPage * itemsPerPage, totalRecords)} ${t('units.of')} ${totalRecords} ${t('units.entries')}`}
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

            <AddTaxPanel
                isOpen={isAddPanelOpen}
                onClose={handleClosePanel}
                onSave={handleSaveTax}
                initialData={editingTax || newTaxTemplate}
                isEditing={!!editingTax}
            />

            <TaxDetailsModal tax={viewingTax} onClose={() => setViewingTax(null)} />

            <ConfirmationModal
                isOpen={!!taxToDelete}
                onClose={() => setTaxToDelete(null)}
                onConfirm={handleConfirmDelete}
                title={t('taxes.deleteTaxTitle')}
                message={t('taxes.confirmDeleteMessage')}
            />
        </div>
    );
};

export default TaxesPage;
