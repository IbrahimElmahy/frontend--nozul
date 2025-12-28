import React, { useState, useMemo, useContext, useEffect, useCallback } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Guest, GuestTypeAPI, IdTypeAPI, CountryAPI } from '../types';
import ConfirmationModal from './ConfirmationModal';
import GuestCard from './GuestCard';
import AddGuestPanel from './AddGuestPanel';
import GuestDetailsModal from './GuestDetailsModal';
import { ApiValidationError } from '../apiClient';
import { listGuests, createGuest, updateGuest, deleteGuest, disableGuest, activateGuest, getGuestTypes, getIdTypes, getCountries } from '../services/guests';

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
import XCircleIcon from './icons-redesign/XCircleIcon';
import CheckCircleIcon from './icons-redesign/CheckCircleIcon';


const GuestsPage: React.FC = () => {
    const { t, language } = useContext(LanguageContext);

    // Data and loading states
    const [guests, setGuests] = useState<Guest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string | string[]>>({});
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Dropdown options states
    const [guestTypes, setGuestTypes] = useState<GuestTypeAPI[]>([]);
    const [idTypes, setIdTypes] = useState<IdTypeAPI[]>([]);
    const [countries, setCountries] = useState<CountryAPI>({});

    // UI state
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
    const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
    const [viewingGuest, setViewingGuest] = useState<Guest | null>(null);
    const [guestToAction, setGuestToAction] = useState<{ guest: Guest, action: 'delete' | 'deactivate' | 'activate' } | null>(null);

    // Search, sort, and pagination states
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Guest | null; direction: 'ascending' | 'descending' }>({ key: 'created_at', direction: 'descending' });
    const [pagination, setPagination] = useState({ currentPage: 1, itemsPerPage: 10, totalRecords: 0 });

    const fetchGuestsAndOptions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch options first, only if they are not already loaded
            if (guestTypes.length === 0) {
                const [guestTypesRes, idTypesRes, countriesRes] = await Promise.all([
                    getGuestTypes(),
                    getIdTypes(),
                    getCountries(),
                ]);
                setGuestTypes(guestTypesRes.data);
                setIdTypes(idTypesRes.data);
                setCountries(countriesRes);
            }

            // Fetch guests with current pagination and search
            const query: any = {
                start: (pagination.currentPage - 1) * pagination.itemsPerPage,
                length: pagination.itemsPerPage,
            };
            if (searchTerm) query.search = searchTerm;

            const guestsRes = await listGuests(query);
            setGuests(guestsRes.data);
            setPagination(p => ({ ...p, totalRecords: guestsRes.recordsFiltered }));

        } catch (err) {
            setError(err instanceof Error ? err.message : t('common.unexpectedError'));
        } finally {
            setLoading(false);
        }
    }, [pagination.currentPage, pagination.itemsPerPage, searchTerm, guestTypes.length]);

    useEffect(() => {
        fetchGuestsAndOptions();
    }, [fetchGuestsAndOptions]);

    // Reset page number when search term changes
    useEffect(() => {
        setPagination(p => ({ ...p, currentPage: 1 }));
    }, [searchTerm]);


    const handleAddNewClick = () => {
        setEditingGuest(null);
        setIsAddPanelOpen(true);
    };

    const handleEditClick = (guest: Guest) => {
        setEditingGuest(guest);
        setIsAddPanelOpen(true);
    };

    const handleSaveGuest = async (formData: FormData) => {
        setValidationErrors({});
        setErrorMessage(null);

        try {
            if (editingGuest) {
                await updateGuest(editingGuest.id, formData);
            } else {
                await createGuest(formData);
            }
            setIsAddPanelOpen(false);
            setEditingGuest(null);
            fetchGuestsAndOptions(); // Refresh data
        } catch (err) {
            if (err instanceof ApiValidationError) {
                setValidationErrors(err.errors);
                setErrorMessage(err.message);
            } else {
                setErrorMessage(err instanceof Error ? err.message : t('common.unexpectedError'));
            }
        }
    };

    const handleConfirmAction = async () => {
        if (!guestToAction) return;
        const { guest, action } = guestToAction;
        try {
            switch (action) {
                case 'delete':
                    await deleteGuest(guest.id);
                    break;
                case 'deactivate':
                    await disableGuest(guest.id);
                    break;
                case 'activate':
                    await activateGuest(guest.id);
                    break;
            }
            fetchGuestsAndOptions(); // Refresh data
        } catch (err) {
            alert(`${t('common.error')}: ${err instanceof Error ? err.message : t('common.unexpectedError')}`);
        } finally {
            setGuestToAction(null);
        }
    };

    const tableHeaders: { key: keyof Guest | 'actions', labelKey: string, className?: string }[] = [
        { key: 'name', labelKey: 'guests.th_name' },
        { key: 'phone_number', labelKey: 'guests.th_mobileNumber', className: 'hidden sm:table-cell' },
        { key: 'id_number', labelKey: 'guests.th_idNumber', className: 'hidden md:table-cell' },
        { key: 'guest_type', labelKey: 'guests.th_guestType', className: 'hidden lg:table-cell' },
        { key: 'ids', labelKey: 'guests.th_idType', className: 'hidden xl:table-cell' },
        { key: 'country_display', labelKey: 'guests.th_nationality', className: 'hidden xl:table-cell' },
        { key: 'created_at', labelKey: 'guests.th_createdAt', className: 'hidden 2xl:table-cell' },
        { key: 'is_active', labelKey: 'guests.th_status' },
        { key: 'actions', labelKey: 'guests.th_actions' },
    ];

    const totalPages = Math.ceil(pagination.totalRecords / pagination.itemsPerPage);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{t('guests.manageGuests')}</h2>
                <button onClick={handleAddNewClick} className="flex items-center gap-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                    <PlusCircleIcon className="w-5 h-5" />
                    <span>{t('guests.addGuest')}</span>
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                    <div className="relative flex-grow sm:flex-grow-0 sm:w-96">
                        <MagnifyingGlassIcon className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
                        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder={t('guests.searchPlaceholder')} className={`w-full py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-200 ${language === 'ar' ? 'pr-10' : 'pl-10'}`} />
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setViewMode('table')} className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}`} aria-label="Table View"><TableCellsIcon className="w-5 h-5" /></button>
                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}`} aria-label="Grid View"><Squares2x2Icon className="w-5 h-5" /></button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div></div>
                ) : error ? (
                    <div className="text-center py-10 text-red-500">{error}</div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {guests.map(guest => (
                            <GuestCard key={guest.id} guest={guest} onViewClick={() => setViewingGuest(guest)} onEditClick={() => handleEditClick(guest)} onDeleteClick={() => setGuestToAction({ guest, action: 'delete' })} />
                        ))}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-start text-slate-500 dark:text-slate-400">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                                <tr>
                                    {tableHeaders.map(header => <th key={header.key} scope="col" className={`px-2 py-2 ${header.className || ''}`}>{t(header.labelKey as any)}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {guests.map(guest => (
                                    <tr key={guest.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
                                        {tableHeaders.map(header => {
                                            const key = header.key;
                                            let content: React.ReactNode;

                                            if (key === 'actions') {
                                                content = (
                                                    <div className="flex items-center gap-1">
                                                        <button onClick={() => setViewingGuest(guest)} className="p-1.5 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/10"><EyeIcon className="w-5 h-5" /></button>
                                                        <button onClick={() => handleEditClick(guest)} className="p-1.5 rounded-full text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-500/10"><PencilSquareIcon className="w-5 h-5" /></button>
                                                        <button onClick={() => setGuestToAction({ guest, action: 'delete' })} className="p-1.5 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10"><TrashIcon className="w-5 h-5" /></button>
                                                        {guest.is_active ?
                                                            <button onClick={() => setGuestToAction({ guest, action: 'deactivate' })} className="p-1.5 rounded-full text-orange-500 hover:bg-orange-100 dark:hover:bg-orange-500/10" title="Deactivate"><XCircleIcon className="w-5 h-5" /></button> :
                                                            <button onClick={() => setGuestToAction({ guest, action: 'activate' })} className="p-1.5 rounded-full text-green-500 hover:bg-green-100 dark:hover:bg-green-500/10" title="Activate"><CheckCircleIcon className="w-5 h-5" /></button>
                                                        }
                                                    </div>
                                                );
                                            } else if (key === 'is_active') {
                                                content = (
                                                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${guest.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                                        {guest.is_active ? t('guests.status_active') : t('guests.status_inactive')}
                                                    </span>
                                                );
                                            } else if (key === 'id') {
                                                content = <span className="font-mono text-xs">{guest.id.substring(0, 8)}</span>;
                                            } else if (key === 'created_at') {
                                                content = new Date(guest.created_at).toLocaleDateString();
                                            } else {
                                                content = (guest[key as keyof Guest] as string) || '-';
                                            }

                                            return (
                                                <td key={key} className={`px-2 py-2 whitespace-nowrap ${header.className || ''}`}>
                                                    {content}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                        {`${t('units.showing')} ${pagination.totalRecords > 0 ? (pagination.currentPage - 1) * pagination.itemsPerPage + 1 : 0} ${t('units.to')} ${Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalRecords)} ${t('units.of')} ${pagination.totalRecords} ${t('units.entries')}`}
                    </div>
                    {totalPages > 1 && (
                        <nav className="flex items-center gap-1" aria-label="Pagination">
                            <button onClick={() => setPagination(p => ({ ...p, currentPage: Math.max(1, p.currentPage - 1) }))} disabled={pagination.currentPage === 1} className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronLeftIcon className="w-5 h-5" /></button>
                            <span className="text-sm font-semibold px-2">{pagination.currentPage} / {totalPages}</span>
                            <button onClick={() => setPagination(p => ({ ...p, currentPage: Math.min(totalPages, p.currentPage + 1) }))} disabled={pagination.currentPage === totalPages} className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronRightIcon className="w-5 h-5" /></button>
                        </nav>
                    )}
                </div>
            </div>

            <AddGuestPanel
                initialData={editingGuest}
                isEditing={!!editingGuest}
                isOpen={isAddPanelOpen}
                onClose={() => { setIsAddPanelOpen(false); setValidationErrors({}); }}
                onSave={handleSaveGuest}
                guestTypes={guestTypes}
                idTypes={idTypes}
                countries={countries}
                validationErrors={validationErrors}
            />

            <GuestDetailsModal guest={viewingGuest} onClose={() => setViewingGuest(null)} />

            <ConfirmationModal
                isOpen={!!guestToAction}
                onClose={() => setGuestToAction(null)}
                onConfirm={handleConfirmAction}
                title={guestToAction ? t(`guests.confirmAction_${guestToAction.action}_title` as any) : ''}
                message={guestToAction ? t(`guests.confirmAction_${guestToAction.action}_message` as any) : ''}
            />

            {errorMessage && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center" role="dialog" aria-modal="true">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setErrorMessage(null)}></div>
                    <div className="relative bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-sm mx-4 transform transition-all">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 mb-4">
                                <XCircleIcon className="h-8 w-8 text-red-600 dark:text-red-300" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">{t('units.error')}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{errorMessage}</p>
                            <button
                                onClick={() => setErrorMessage(null)}
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
                            >
                                {t('units.close')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GuestsPage;