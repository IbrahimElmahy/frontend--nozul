import React, { useState, useMemo, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { BookingAgency } from '../types';
import ConfirmationModal from './ConfirmationModal';
import AgencyCard from './AgencyCard';
import AddAgencyPanel from './AddAgencyPanel';
import AgencyDetailsModal from './AgencyDetailsModal';

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

// FIX: Define local types as they are not exported from types.ts
type AgencyStatus = 'active' | 'inactive';
type AgencyType = 'company' | 'individual';
type AgencyIdType = 'tax_id' | 'unified_establishment_number' | 'other';


const mockAgencies: BookingAgency[] = [
  // FIX: Converted `id` to string and updated property names to match the BookingAgency type.
  { id: '1', name: 'صالح محمد', phone_number: '+966556170543', country: 'SA', country_display: 'السعودية', guest_type: 'شركة', ids: 'رقم السجل الضريبي', id_number: '11', created_at: '2025-02-08 16:31:47', updated_at: '2025-02-08 16:31:47', is_active: true },
  // FIX: Converted `id` to string and updated property names to match the BookingAgency type.
  { id: '2', name: 'TEST2', phone_number: '+966505000084', country: 'SA', country_display: 'السعودية', guest_type: 'شركة', ids: 'رقم المنشأة الموحد', id_number: '2056012202', created_at: '2024-10-17 09:55:45', updated_at: '2025-02-03 10:33:12', is_active: true },
  // FIX: Converted `id` to string and updated property names to match the BookingAgency type.
  { id: '3', name: 'test', phone_number: '+966568765432', country: 'SA', country_display: 'السعودية', guest_type: 'شركة', ids: 'رقم المنشأة الموحد', id_number: '654321', created_at: '2024-10-17 09:44:08', updated_at: '2024-10-17 09:44:08', is_active: true },
];

const newAgencyTemplate: Omit<BookingAgency, 'id' | 'created_at' | 'updated_at'> = {
    name: '',
    phone_number: '',
    country: 'SA',
    country_display: 'السعودية',
    guest_type: 'شركة',
    ids: 'رقم السجل الضريبي',
    id_number: '',
    is_active: true,
};


const BookingAgenciesPage: React.FC = () => {
    const { t, language } = useContext(LanguageContext);
    const [agencies, setAgencies] = useState<BookingAgency[]>(mockAgencies);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
    const [editingAgency, setEditingAgency] = useState<BookingAgency | null>(null);
    // FIX: Changed state type from `number` to `string` to match the `id` type of BookingAgency.
    const [agencyToDeleteId, setAgencyToDeleteId] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: keyof BookingAgency | null; direction: 'ascending' | 'descending' }>({ key: 'id', direction: 'ascending' });
    const [viewingAgency, setViewingAgency] = useState<BookingAgency | null>(null);
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

    const filteredAgencies = useMemo(() => {
        return agencies.filter(agency => 
            agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            // FIX: Use correct property 'phone_number'
            agency.phone_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            // FIX: Use correct property 'id_number'
            agency.id_number.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [agencies, searchTerm]);

    const sortedAgencies = useMemo(() => {
        let sortableItems = [...filteredAgencies];
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                const key = sortConfig.key as keyof BookingAgency;
                if (a[key] === null || a[key] === undefined) return 1;
                if (b[key] === null || b[key] === undefined) return -1;
                
                let comparison = 0;
                // FIX: Corrected comparison for string IDs which could be numbers.
                if (key === 'id') {
                    comparison = Number(a[key]) - Number(b[key]);
                } else if (typeof a[key] === 'number' && typeof b[key] === 'number') {
                    comparison = (a[key] as number) - (b[key] as number);
                } else {
                    comparison = String(a[key]).localeCompare(String(b[key]));
                }
                
                return sortConfig.direction === 'ascending' ? comparison : -comparison;
            });
        }
        return sortableItems;
    }, [filteredAgencies, sortConfig]);
    
    const totalPages = Math.ceil(sortedAgencies.length / itemsPerPage);
    const paginatedAgencies = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedAgencies.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedAgencies, currentPage, itemsPerPage]);

    const handleClosePanel = () => {
        setIsAddPanelOpen(false);
        setEditingAgency(null);
    };

    const handleSaveAgency = (agencyData: BookingAgency | Omit<BookingAgency, 'id' | 'created_at' | 'updated_at'>) => {
        if (editingAgency) {
            // FIX: Use correct property 'updated_at'
            const updatedAgency = { ...agencyData, id: editingAgency.id, updated_at: new Date().toISOString() } as BookingAgency;
            setAgencies(agencies.map(b => b.id === updatedAgency.id ? updatedAgency : b));
        } else {
            const newAgency: BookingAgency = {
                ...(agencyData as Omit<BookingAgency, 'id' | 'created_at' | 'updated_at'>),
                // FIX: Converted string IDs to numbers for Math.max and converted the result back to a string for the new ID.
                id: (Math.max(0, ...agencies.map(b => Number(b.id))) + 1).toString(),
                // FIX: Use correct property 'created_at' and 'updated_at'
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            setAgencies(prev => [newAgency, ...prev]);
        }
        handleClosePanel();
    };

    const handleAddNewClick = () => {
        setEditingAgency(null);
        setIsAddPanelOpen(true);
    };

    const handleEditClick = (agency: BookingAgency) => {
        setEditingAgency(agency);
        setIsAddPanelOpen(true);
    };

    // FIX: Changed parameter type from `number` to `string` to match the `id` type.
    const handleDeleteClick = (agencyId: string) => {
        setAgencyToDeleteId(agencyId);
    };

    const handleConfirmDelete = () => {
        if (agencyToDeleteId) {
            setAgencies(agencies.filter(b => b.id !== agencyToDeleteId));
            setAgencyToDeleteId(null);
        }
    };
    
    const requestSort = (key: keyof BookingAgency) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // FIX: Corrected table header keys to match BookingAgency type
    const tableHeaders: { key: keyof BookingAgency | 'actions', labelKey: string, className?: string }[] = [
        { key: 'id', labelKey: 'agencies.th_id', className: 'hidden 2xl:table-cell' },
        { key: 'name', labelKey: 'agencies.th_name' },
        { key: 'phone_number', labelKey: 'agencies.th_mobileNumber', className: 'hidden sm:table-cell' },
        { key: 'country_display', labelKey: 'agencies.th_country', className: 'hidden md:table-cell' },
        { key: 'guest_type', labelKey: 'agencies.th_agencyType', className: 'hidden lg:table-cell' },
        { key: 'ids', labelKey: 'agencies.th_idType', className: 'hidden xl:table-cell' },
        { key: 'id_number', labelKey: 'agencies.th_idNumber', className: 'hidden xl:table-cell' },
        { key: 'created_at', labelKey: 'agencies.th_createdAt', className: 'hidden 2xl:table-cell' },
        { key: 'is_active', labelKey: 'agencies.th_status' },
        { key: 'actions', labelKey: 'agencies.th_actions' },
    ];
    
    // FIX: Corrected rendering logic for cell content
    const renderCellContent = (agency: BookingAgency, key: keyof BookingAgency) => {
      const value = agency[key];
      switch (key) {
        case 'is_active':
          const statusClass = value 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
          return (
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusClass}`}>
              {t(value ? 'agencies.status_active' : 'agencies.status_inactive' as any)}
            </span>
          );
        case 'created_at':
            return new Date(value as string).toLocaleDateString();
        default:
          return (value as string) || '-';
      }
    }
    
    const showingEntriesControls = (
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
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
    );

    const searchAndViewsControls = (
        <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0 sm:w-96">
                <MagnifyingGlassIcon className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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

                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {paginatedAgencies.map(agency => (
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
                                        <th key={header.key} scope="col" className={`px-2 py-2 ${header.className || ''}`}>
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
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedAgencies.map(agency => (
                                    <tr key={agency.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
                                       {tableHeaders.map(header => (
                                            <td key={`${agency.id}-${header.key}`} className={`px-2 py-2 whitespace-nowrap ${header.className || ''}`}>
                                                {header.key === 'actions' ? (
                                                    <div className="flex items-center gap-1">
                                                        <button onClick={() => setViewingAgency(agency)} className="p-1.5 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/10"><EyeIcon className="w-5 h-5" /></button>
                                                        <button onClick={() => handleEditClick(agency)} className="p-1.5 rounded-full text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-500/10"><PencilSquareIcon className="w-5 h-5" /></button>
                                                        <button onClick={() => handleDeleteClick(agency.id)} className="p-1.5 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10"><TrashIcon className="w-5 h-5" /></button>
                                                    </div>
                                                ) : (
                                                    renderCellContent(agency, header.key as keyof BookingAgency)
                                                )}
                                            </td>
                                       ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                        {`${t('units.showing')} ${sortedAgencies.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} ${t('units.to')} ${Math.min(currentPage * itemsPerPage, sortedAgencies.length)} ${t('units.of')} ${sortedAgencies.length} ${t('units.entries')}`}
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