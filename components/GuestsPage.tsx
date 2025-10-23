import React, { useState, useMemo, useContext, useRef, useEffect } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Guest, GuestStatus, GuestType, IdType } from '../types';
import ConfirmationModal from './ConfirmationModal';
import GuestCard from './GuestCard';
import AddGuestPanel from './AddGuestPanel';
import GuestDetailsModal from './GuestDetailsModal';

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


const mockGuests: Guest[] = [
  { id: 1, name: 'امين احمد', mobileNumber: '+966502020301', nationality: 'أفغانستان', guestType: 'visitor', idType: 'passport', idNumber: '26846844895', issueDate: null, expiryDate: null, status: 'active', createdAt: '2025-10-07 13:52:36', updatedAt: '2025-10-07 13:52:36', gender: 'male', dob: '1990-01-01', email: 'amin@example.com', country: 'أفغانستان' },
  { id: 2, name: 'فيصل الجهني', mobileNumber: '+966558788889', nationality: 'السعودية', guestType: 'citizen', idType: 'national_id', idNumber: '1005001000', issueDate: '1430-01-01', expiryDate: null, status: 'active', createdAt: '2025-08-28 12:11:11', updatedAt: '2025-08-28 12:14:45', gender: 'male', dob: '1985-05-15', email: 'faisal@example.com', country: 'السعودية' },
  { id: 3, name: 'حملة محمد', mobileNumber: '+966555555555', nationality: 'ألبانيا', guestType: 'visitor', idType: 'passport', idNumber: '22222', issueDate: null, expiryDate: null, status: 'active', createdAt: '2025-08-23 19:32:48', updatedAt: '2025-08-23 19:32:48', gender: 'male', dob: '1992-03-20', email: 'hamla@example.com', country: 'ألبانيا' },
  { id: 4, name: 'محمد سالم', mobileNumber: '+966555555555', nationality: 'مصر', guestType: 'visitor', idType: 'passport', idNumber: '142147', issueDate: null, expiryDate: null, status: 'active', createdAt: '2025-08-23 16:37:05', updatedAt: '2025-08-23 16:37:05', gender: 'male', dob: '1988-11-10', email: 'salem@example.com', country: 'مصر' },
  { id: 5, name: 'محمد احمد', mobileNumber: '+966555544778', nationality: 'الجزائر', guestType: 'resident', idType: 'residence_card', idNumber: '2201245787', issueDate: null, expiryDate: null, status: 'active', createdAt: '2025-08-23 16:28:59', updatedAt: '2025-08-23 16:28:59', gender: 'male', dob: '1995-07-25', email: 'ahmed@example.com', country: 'الجزائر' },
  { id: 6, name: 'احمد', mobileNumber: '+966583311431', nationality: 'السعودية', guestType: 'citizen', idType: 'national_id', idNumber: '1078374845885', issueDate: null, expiryDate: null, status: 'active', createdAt: '2025-08-06 15:53:00', updatedAt: '2025-08-06 15:53:00', gender: 'male', dob: '1991-01-01', email: 'ahmed2@example.com', country: 'السعودية' },
  { id: 7, name: 'احمد', mobileNumber: '+966583311431', nationality: 'السعودية', guestType: 'citizen', idType: 'national_id', idNumber: '1088615362', issueDate: null, expiryDate: null, status: 'active', createdAt: '2025-08-05 03:26:14', updatedAt: '2025-08-05 03:26:14', gender: 'male', dob: '1993-02-14', email: 'ahmed3@example.com', country: 'السعودية' },
  { id: 8, name: 'احمد', mobileNumber: '+966583311462', nationality: 'السعودية', guestType: 'citizen', idType: 'national_id', idNumber: '107837484885', issueDate: null, expiryDate: null, status: 'active', createdAt: '2025-08-04 12:15:12', updatedAt: '2025-08-04 12:15:12', gender: 'male', dob: '1994-09-30', email: 'ahmed4@example.com', country: 'السعودية' },
  { id: 9, name: 'حنكش المصري', mobileNumber: '+966569876545', nationality: 'السعودية', guestType: 'citizen', idType: 'national_id', idNumber: '234567898765', issueDate: '2002-07-18', expiryDate: '2025-07-30', status: 'active', createdAt: '2025-07-30 02:05:06', updatedAt: '2025-07-30 02:05:06', gender: 'male', dob: '1970-04-04', email: 'hankash@example.com', country: 'السعودية' },
  { id: 10, name: 'راشد عمر', mobileNumber: '+966545678765', nationality: 'السعودية', guestType: 'citizen', idType: 'national_id', idNumber: '34567876', issueDate: '2000-05-14', expiryDate: '2025-07-30', status: 'active', createdAt: '2025-07-30 01:59:35', updatedAt: '2025-07-30 01:59:35', gender: 'male', dob: '1980-08-08', email: 'rashed@example.com', country: 'السعودية' },
];

const newGuestTemplate: Omit<Guest, 'id' | 'createdAt' | 'updatedAt'> = {
    name: '',
    mobileNumber: '',
    nationality: 'السعودية',
    guestType: 'citizen',
    idType: 'national_id',
    idNumber: '',
    issueDate: null,
    expiryDate: null,
    status: 'active',
    gender: 'male',
    dob: null,
    workNumber: '',
    email: '',
    workLocation: '',
    country: 'السعودية',
    city: '',
    district: '',
    street: '',
    postalCode: '',
    issueLocation: '',
    serialNumber: '',
    notes: '',
};


const GuestsPage: React.FC = () => {
    const { t, language } = useContext(LanguageContext);
    const [guests, setGuests] = useState<Guest[]>(mockGuests);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
    const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
    const [guestToDeleteId, setGuestToDeleteId] = useState<number | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Guest | null; direction: 'ascending' | 'descending' }>({ key: 'id', direction: 'ascending' });
    const [viewingGuest, setViewingGuest] = useState<Guest | null>(null);
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

    const filteredGuests = useMemo(() => {
        return guests.filter(guest => 
            guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            guest.mobileNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            guest.idNumber.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [guests, searchTerm]);

    const sortedGuests = useMemo(() => {
        let sortableItems = [...filteredGuests];
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                const key = sortConfig.key as keyof Guest;
                if (a[key] === null || a[key] === undefined) return 1;
                if (b[key] === null || b[key] === undefined) return -1;
                
                let comparison = 0;
                if (typeof a[key] === 'number' && typeof b[key] === 'number') {
                    comparison = (a[key] as number) - (b[key] as number);
                } else {
                    comparison = String(a[key]).localeCompare(String(b[key]));
                }
                
                return sortConfig.direction === 'ascending' ? comparison : -comparison;
            });
        }
        return sortableItems;
    }, [filteredGuests, sortConfig]);
    
    const totalPages = Math.ceil(sortedGuests.length / itemsPerPage);
    const paginatedGuests = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedGuests.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedGuests, currentPage, itemsPerPage]);

    const handleClosePanel = () => {
        setIsAddPanelOpen(false);
        setEditingGuest(null);
    };

    const handleSaveGuest = (guestData: Guest | Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (editingGuest) {
            const updatedGuest = { ...guestData, id: editingGuest.id, updatedAt: new Date().toISOString() } as Guest;
            setGuests(guests.map(b => b.id === updatedGuest.id ? updatedGuest : b));
        } else {
            const newGuest: Guest = {
                ...(guestData as Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>),
                id: Math.max(...guests.map(b => b.id), 0) + 1,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            setGuests(prev => [newGuest, ...prev]);
        }
        handleClosePanel();
    };

    const handleAddNewClick = () => {
        setEditingGuest(null);
        setIsAddPanelOpen(true);
    };

    const handleEditClick = (guest: Guest) => {
        setEditingGuest(guest);
        setIsAddPanelOpen(true);
    };

    const handleDeleteClick = (guestId: number) => {
        setGuestToDeleteId(guestId);
    };

    const handleConfirmDelete = () => {
        if (guestToDeleteId) {
            setGuests(guests.filter(b => b.id !== guestToDeleteId));
            setGuestToDeleteId(null);
        }
    };
    
    const requestSort = (key: keyof Guest) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const tableHeaders: { key: keyof Guest | 'actions', labelKey: string }[] = [
        { key: 'id', labelKey: 'guests.th_id' },
        { key: 'name', labelKey: 'guests.th_name' },
        { key: 'mobileNumber', labelKey: 'guests.th_mobileNumber' },
        { key: 'nationality', labelKey: 'guests.th_nationality' },
        { key: 'guestType', labelKey: 'guests.th_guestType' },
        { key: 'idType', labelKey: 'guests.th_idType' },
        { key: 'idNumber', labelKey: 'guests.th_idNumber' },
        { key: 'status', labelKey: 'guests.th_status' },
        { key: 'actions', labelKey: 'guests.th_actions' },
    ];
    
    const renderCellContent = (guest: Guest, key: keyof Guest) => {
      const value = guest[key];
      switch (key) {
        case 'guestType':
          return t(`guests.guestType_${value as GuestType}`);
        case 'idType':
          return t(`guests.idType_${value as IdType}`);
        case 'status':
          const statusClass = value === 'active' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
          return (
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusClass}`}>
              {t(`guests.status_${value as GuestStatus}`)}
            </span>
          );
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
                    placeholder={t('guests.searchPlaceholder')}
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
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{t('guests.manageGuests')}</h2>
                 <div className="flex flex-wrap items-center gap-2">
                    <button 
                        onClick={handleAddNewClick}
                        className="flex items-center gap-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        <PlusCircleIcon className="w-5 h-5" />
                        <span>{t('guests.addGuest')}</span>
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
                        {paginatedGuests.map(guest => (
                            <GuestCard
                                key={guest.id}
                                guest={guest}
                                onViewClick={() => setViewingGuest(guest)}
                                onEditClick={() => handleEditClick(guest)}
                                onDeleteClick={() => handleDeleteClick(guest.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-start text-slate-500 dark:text-slate-400">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                                <tr>
                                    {tableHeaders.map(header => (
                                        <th key={header.key} scope="col" className="px-6 py-3">
                                             <button 
                                                className="flex items-center gap-1.5 group" 
                                                onClick={() => requestSort(header.key as keyof Guest)}
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
                                {paginatedGuests.map(guest => (
                                    <tr key={guest.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
                                       {tableHeaders.map(header => (
                                            <td key={`${guest.id}-${header.key}`} className="px-6 py-4 whitespace-nowrap">
                                                {header.key === 'actions' ? (
                                                    <div className="flex items-center gap-1">
                                                        <button onClick={() => setViewingGuest(guest)} className="p-1.5 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/10"><EyeIcon className="w-5 h-5" /></button>
                                                        <button onClick={() => handleEditClick(guest)} className="p-1.5 rounded-full text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-500/10"><PencilSquareIcon className="w-5 h-5" /></button>
                                                        <button onClick={() => handleDeleteClick(guest.id)} className="p-1.5 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10"><TrashIcon className="w-5 h-5" /></button>
                                                    </div>
                                                ) : (
                                                    renderCellContent(guest, header.key as keyof Guest)
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
                        {`${t('units.showing')} ${sortedGuests.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} ${t('units.to')} ${Math.min(currentPage * itemsPerPage, sortedGuests.length)} ${t('units.of')} ${sortedGuests.length} ${t('units.entries')}`}
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
            
            <AddGuestPanel
                initialData={editingGuest || newGuestTemplate}
                isEditing={!!editingGuest}
                isOpen={isAddPanelOpen}
                onClose={handleClosePanel}
                onSave={handleSaveGuest}
            />

            <GuestDetailsModal
                guest={viewingGuest}
                onClose={() => setViewingGuest(null)}
            />

            <ConfirmationModal
                isOpen={!!guestToDeleteId}
                onClose={() => setGuestToDeleteId(null)}
                onConfirm={handleConfirmDelete}
                title={t('guests.deleteGuestTitle')}
                message={t('guests.confirmDeleteMessage')}
            />
        </div>
    );
};

export default GuestsPage;
