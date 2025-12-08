
import React, { useState, useMemo, useContext, useEffect, useCallback } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { BookingAgency } from '../types';
import ConfirmationModal from './ConfirmationModal';
import AgencyCard from './AgencyCard';
import AddAgencyPanel from './AddAgencyPanel';
import AgencyDetailsModal from './AgencyDetailsModal';
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
import Switch from './Switch';

const newAgencyTemplate: Omit<BookingAgency, 'id' | 'created_at' | 'updated_at'> = {
    name: '',
    phone_number: '',
    country: 'SA',
    country_display: 'السعودية',
    guest_type: '',
    ids: '',
    id_number: '',
    is_active: true,
    email: '',
    discount_type: '',
    discount_value: 0,
    city: '',
    neighborhood: '',
    street: '',
    postal_code: '',
    work_number: '',
    serial_number: '',
    issue_date: '',
    expiry_date: '',
    issue_place: '',
    notes: '',
};

const BookingAgenciesPage: React.FC = () => {
    const { t, language } = useContext(LanguageContext);
    const [agencies, setAgencies] = useState<BookingAgency[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const [totalRecords, setTotalRecords] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
    const [editingAgency, setEditingAgency] = useState<BookingAgency | null>(null);
    const [agencyToDeleteId, setAgencyToDeleteId] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: keyof BookingAgency | null; direction: 'ascending' | 'descending' }>({ key: 'created_at', direction: 'descending' });
    const [viewingAgency, setViewingAgency] = useState<BookingAgency | null>(null);
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

    const fetchAgencies = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            params.append('category', 'agent');
            params.append('start', ((currentPage - 1) * itemsPerPage).toString());
            params.append('length', itemsPerPage.toString());
            if (searchTerm) params.append('search', searchTerm);

            const response = await apiClient<{ data: BookingAgency[], recordsFiltered: number }>(`/ar/guest/api/guests/?${params.toString()}`);
            setAgencies(response.data);
            setTotalRecords(response.recordsFiltered);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    }, [currentPage, itemsPerPage, searchTerm]);

    useEffect(() => {
        fetchAgencies();
    }, [fetchAgencies]);

    const sortedAgencies = useMemo(() => {
        let sortableItems = [...agencies];
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                const key = sortConfig.key as keyof BookingAgency;
                const aVal = a[key];
                const bVal = b[key];

                if (aVal === null || aVal === undefined) return 1;
                if (bVal === null || bVal === undefined) return -1;

                let comparison = 0;
                if (typeof aVal === 'number' && typeof bVal === 'number') {
                    comparison = aVal - bVal;
                } else {
                    comparison = String(aVal).localeCompare(String(bVal));
                }

                return sortConfig.direction === 'ascending' ? comparison : -comparison;
            });
        }
        return sortableItems;
    }, [agencies, sortConfig]);

    const totalPages = Math.ceil(totalRecords / itemsPerPage);

    const handleClosePanel = () => {
        setIsAddPanelOpen(false);
        setEditingAgency(null);
    };

    const handleSaveAgency = async (formData: FormData) => {
        try {
            if (editingAgency) {
                await apiClient(`/ar/guest/api/guests/${editingAgency.id}/`, {
                    method: 'PUT',
                    body: formData
                });
            } else {
                await apiClient('/ar/guest/api/guests/', {
                    method: 'POST',
                    body: formData
                });
            }
            fetchAgencies();
            handleClosePanel();
        } catch (err) {
            alert(`Error saving agency: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    };

    const handleToggleStatus = async (agency: BookingAgency, newStatus: boolean) => {
        try {
            const action = newStatus ? 'active' : 'disable';
            await apiClient(`/ar/guest/api/guests/${agency.id}/${action}/`, { method: 'POST' });
            // Optimistically update
            setAgencies(prev => prev.map(a => a.id === agency.id ? { ...a, is_active: newStatus } : a));
        } catch (err) {
            alert(`Error changing status: ${err instanceof Error ? err.message : 'Unknown error'}`);
            fetchAgencies(); // Revert on error
        }
    };

    const handleAddNewClick = () => {
        setEditingAgency(null);
        setIsAddPanelOpen(true);
    };

    const handleEditClick = (agency: BookingAgency) => {
        setEditingAgency(agency);
        setIsAddPanelOpen(true);
    };

    const handleDeleteClick = (agencyId: string) => {
        setAgencyToDeleteId(agencyId);
    };

    const handleConfirmDelete = async () => {
        if (agencyToDeleteId) {
            try {
                await apiClient(`/ar/guest/api/guests/${agencyToDeleteId}/`, { method: 'DELETE' });
                fetchAgencies();
                setAgencyToDeleteId(null);
            } catch (err) {
                alert(`Error deleting agency: ${err instanceof Error ? err.message : 'Unknown error'}`);
            }
        }
    };

    const requestSort = (key: keyof BookingAgency) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const tableHeaders: { key: keyof BookingAgency | 'actions', labelKey: string, className?: string }[] = [
        { key: 'id', labelKey: 'agencies.th_id', className: 'hidden 2xl:table-cell' },
        { key: 'name', labelKey: 'agencies.th_name' },
        { key: 'phone_number', labelKey: 'agencies.th_mobileNumber', className: 'hidden sm:table-cell' },
        { key: 'id_number', labelKey: 'agencies.th_idNumber', className: 'hidden md:table-cell' },
        { key: 'country_display', labelKey: 'agencies.th_country', className: 'hidden lg:table-cell' },
        { key: 'guest_type', labelKey: 'agencies.th_agencyType', className: 'hidden xl:table-cell' },
        { key: 'ids', labelKey: 'agencies.th_idType', className: 'hidden 2xl:table-cell' },
        { key: 'created_at', labelKey: 'agencies.th_createdAt', className: 'hidden 2xl:table-cell' },
        { key: 'is_active', labelKey: 'agencies.th_status' },
        { key: 'actions', labelKey: 'agencies.th_actions' },
    ];

    const searchAndViewsControls = (
        <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0 sm:w-96">
                <MagnifyingGlassIcon className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    placeholder={t('agencies.searchPlaceholder')}
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

    const showingEntriesControls = (
        <div className="flex items-center gap-2">
            <span>{t('units.showing')}</span>
            <select
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="py-1 px-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none text-sm"
            >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
            </select>
            <span>{t('units.entries')}</span>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{t('agencies.manageAgencies')}</h2>
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={handleAddNewClick}
                        className="flex items-center gap-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        <PlusCircleIcon className="w-5 h-5" />
                        <span>{t('agencies.addAgency')}</span>
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
                        {sortedAgencies.map(agency => (
                            <AgencyCard
                                key={agency.id}
                                agency={agency}
                                onViewClick={() => setViewingAgency(agency)}
                                onEditClick={() => handleEditClick(agency)}
                                onDeleteClick={() => handleDeleteClick(agency.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-start text-slate-500 dark:text-slate-400">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                                <tr>
                                    {tableHeaders.map(header => (
                                        <th key={header.key} scope="col" className={`px-6 py-3 ${header.className || ''}`}>
                                            {header.key !== 'actions' ? (
                                                <button
                                                    className="flex items-center gap-1.5 group"
                                                    onClick={() => requestSort(header.key as keyof BookingAgency)}
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
                                {sortedAgencies.map(agency => (
                                    <tr key={agency.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
                                        {tableHeaders.map(header => (
                                            <td key={`${agency.id}-${header.key}`} className={`px-6 py-4 whitespace-nowrap ${header.className || ''}`}>
                                                {header.key === 'actions' ? (
                                                    <div className="flex items-center gap-1">
                                                        <button onClick={() => setViewingAgency(agency)} className="p-1.5 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/10"><EyeIcon className="w-5 h-5" /></button>
                                                        <button onClick={() => handleEditClick(agency)} className="p-1.5 rounded-full text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-500/10"><PencilSquareIcon className="w-5 h-5" /></button>
                                                        <button onClick={() => handleDeleteClick(agency.id)} className="p-1.5 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10"><TrashIcon className="w-5 h-5" /></button>
                                                    </div>
                                                ) : header.key === 'is_active' ? (
                                                    <Switch
                                                        id={`status-${agency.id}`}
                                                        checked={!!agency.is_active}
                                                        onChange={(c) => handleToggleStatus(agency, c)}
                                                    />
                                                ) : header.key === 'created_at' ? (
                                                    new Date(agency.created_at).toLocaleDateString()
                                                ) : (
                                                    (agency[header.key as keyof BookingAgency] as string) || '-'
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                {sortedAgencies.length === 0 && (
                                    <tr><td colSpan={tableHeaders.length} className="text-center py-8">{t('orders.noData')}</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                        {`${t('units.showing')} ${sortedAgencies.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} ${t('units.to')} ${Math.min(currentPage * itemsPerPage, totalRecords)} ${t('units.of')} ${totalRecords} ${t('units.entries')}`}
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

            <AddAgencyPanel
                initialData={editingAgency || newAgencyTemplate}
                isEditing={!!editingAgency}
                isOpen={isAddPanelOpen}
                onClose={handleClosePanel}
                onSave={handleSaveAgency}
            />

            <AgencyDetailsModal
                agency={viewingAgency}
                onClose={() => setViewingAgency(null)}
            />

            <ConfirmationModal
                isOpen={!!agencyToDeleteId}
                onClose={() => setAgencyToDeleteId(null)}
                onConfirm={handleConfirmDelete}
                title={t('agencies.deleteAgencyTitle')}
                message={t('agencies.confirmDeleteMessage')}
            />
        </div>
    );
};

export default BookingAgenciesPage;
