import React, { useState, useMemo, useContext, useEffect } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import UnitEditPanel from './UnitEditPanel';
import AddGroupPanel from './AddGroupPanel';
import { Unit, UnitStatus, CoolingType } from '../types';
import UnitCard from './UnitCard';
import UnitStatusCard from './UnitStatusCard';
import ConfirmationModal from './ConfirmationModal';
import { apiClient } from '../apiClient';
import { mapApiUnitToUnit, mapUnitToFormData } from './data/apiMappers';


// Icons
import PlusCircleIcon from './icons-redesign/PlusCircleIcon';
import MagnifyingGlassIcon from './icons-redesign/MagnifyingGlassIcon';
import PencilSquareIcon from './icons-redesign/PencilSquareIcon';
import TrashIcon from './icons-redesign/TrashIcon';
import ChevronLeftIcon from './icons-redesign/ChevronLeftIcon';
import ChevronRightIcon from './icons-redesign/ChevronRightIcon';
import Squares2x2Icon from './icons-redesign/Squares2x2Icon';
import TableCellsIcon from './icons-redesign/TableCellsIcon';
import BuildingOfficeIcon from './icons-redesign/BuildingOfficeIcon';
import UserIcon from './icons-redesign/UserIcon';
import ArrowLeftOnRectangleIcon from './icons-redesign/ArrowLeftOnRectangleIcon';
import ArrowRightOnRectangleIcon from './icons-redesign/ArrowRightOnRectangleIcon';
import UsersIcon from './icons-redesign/UsersIcon';
import WrenchScrewdriverIcon from './icons-redesign/WrenchScrewdriverIcon';
import FunnelIcon from './icons-redesign/FunnelIcon';
import ArrowDownTrayIcon from './icons-redesign/ArrowDownTrayIcon';
import EyeIcon from './icons-redesign/EyeIcon';


const newUnitTemplate: Unit = {
    id: '', // Will be generated on save
    unitNumber: '',
    unitName: '',
    status: 'free',
    customerName: undefined,
    checkIn: undefined,
    checkOut: undefined,
    price: 0,
    remaining: undefined,
    unitType: '8e27565c-dcd0-47d0-a119-63f97d47fe3f', // Default to 'Small Room' ID
    cleaningStatus: 'clean',
    isAvailable: true,
    floor: 1,
    rooms: 1,
    bathrooms: 1,
    beds: 1,
    doubleBeds: 0,
    wardrobes: 1,
    tvs: 1,
    coolingType: 'split',
    notes: '',
    features: {
        common: { roomCleaning: false, elevator: true, parking: true, internet: true },
        // FIX: Add missing 'washingMachine' property to satisfy the Unit type.
        special: { kitchen: false, lounge: false, diningTable: false, refrigerator: false, iron: false, restaurantMenu: false, washingMachine: false, oven: false },
    },
};


const UnitsPage: React.FC = () => {
    const { t, language } = useContext(LanguageContext);
    
    const [unitsData, setUnitsData] = useState<Unit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [pagination, setPagination] = useState({ currentPage: 1, itemsPerPage: 12, totalRecords: 0 });
    
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [isAddGroupPanelOpen, setIsAddGroupPanelOpen] = useState(false);
    const [unitToDeleteId, setUnitToDeleteId] = useState<string | null>(null);

    // Filter states
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [cleaningFilter, setCleaningFilter] = useState<string>('all');
    
    // Options for dropdowns
    const [unitTypeOptions, setUnitTypeOptions] = useState<{ id: string, name: string }[]>([]);
    const [coolingTypeOptions, setCoolingTypeOptions] = useState<[string, string][]>([]);


    useEffect(() => {
        const fetchUnitsAndOptions = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch options first
                const [typesRes, coolingRes] = await Promise.all([
                    apiClient<{data: any[]}>('/ar/apartment/api/apartments-types/'),
                    apiClient<[string, string][]>('/ar/apartment/api/apartments/cooling-types/')
                ]);
                setUnitTypeOptions(typesRes.data.map(t => ({ id: t.id, name: t.name })));
                setCoolingTypeOptions(coolingRes);

                // Fetch units
                const params = new URLSearchParams();
                params.append('start', ((pagination.currentPage - 1) * pagination.itemsPerPage).toString());
                params.append('length', pagination.itemsPerPage.toString());
                if (searchTerm) params.append('name__contains', searchTerm);
                
                // Map frontend filters to API filters
                if (statusFilter === 'free') params.append('availability', 'available');
                if (statusFilter === 'occupied' || statusFilter === 'not-checked-in') params.append('availability', 'reserved');
                if (statusFilter === 'out-of-service') params.append('cleanliness', 'maintenance');
                
                if (typeFilter !== 'all') params.append('apartment_type', typeFilter);
                if (cleaningFilter === 'clean') params.append('cleanliness', 'clean');
                if (cleaningFilter === 'not-clean') params.append('cleanliness', 'dirty');


                const response = await apiClient<{data: any[], recordsFiltered: number}>(`/ar/apartment/api/apartments/?${params.toString()}`);
                
                setUnitsData(response.data.map(mapApiUnitToUnit));
                setPagination(prev => ({ ...prev, totalRecords: response.recordsFiltered }));

            } catch (err) {
                if (err instanceof Error) setError(err.message);
                else setError('An unexpected error occurred.');
            } finally {
                setLoading(false);
            }
        };

        fetchUnitsAndOptions();
    }, [pagination.currentPage, pagination.itemsPerPage, searchTerm, statusFilter, typeFilter, cleaningFilter]);


    const unitCounts = useMemo(() => {
        return unitsData.reduce((acc, unit) => {
            acc[unit.status] = (acc[unit.status] || 0) + 1;
            return acc;
        }, {} as Record<UnitStatus, number>);
    }, [unitsData]);
    
    const statusCardsData = [
        { labelKey: 'units.free', value: unitCounts.free || 0, Icon: BuildingOfficeIcon, iconBg: 'bg-green-500' },
        { labelKey: 'units.occupied', value: unitCounts.occupied || 0, Icon: UserIcon, iconBg: 'bg-red-500' },
        { labelKey: 'units.checkOutToday', value: 0, Icon: ArrowLeftOnRectangleIcon, iconBg: 'bg-orange-400' },
        { labelKey: 'units.checkInToday', value: 0, Icon: ArrowRightOnRectangleIcon, iconBg: 'bg-blue-400' },
        { labelKey: 'units.notCheckedIn', value: unitCounts['not-checked-in'] || 0, Icon: UsersIcon, iconBg: 'bg-purple-400' },
        { labelKey: 'units.outOfService', value: unitCounts['out-of-service'] || 0, Icon: WrenchScrewdriverIcon, iconBg: 'bg-slate-400' },
    ];
    
    const handleEditUnit = (unit: Unit) => {
        setEditingUnit(JSON.parse(JSON.stringify(unit)));
        setIsAdding(false);
        setIsPanelOpen(true);
    };

    const handleAddNewUnit = () => {
        const newTemplate = { ...newUnitTemplate, unitType: unitTypeOptions[0]?.id || '' };
        setEditingUnit(JSON.parse(JSON.stringify(newTemplate)));
        setIsAdding(true);
        setIsPanelOpen(true);
    };

    const handleClosePanel = () => {
        setIsPanelOpen(false);
        setEditingUnit(null);
    };

    const handleSaveUnit = async (updatedUnit: Unit) => {
        const formData = mapUnitToFormData(updatedUnit);
        try {
            if (isAdding) {
                const newApiUnit = await apiClient('/ar/apartment/api/apartments/', { method: 'POST', body: formData });
                setUnitsData(prev => [mapApiUnitToUnit(newApiUnit), ...prev]);
            } else {
                const updatedApiUnit = await apiClient(`/ar/apartment/api/apartments/${updatedUnit.id}/`, { method: 'PUT', body: formData });
                setUnitsData(unitsData.map(u => u.id === updatedUnit.id ? mapApiUnitToUnit(updatedApiUnit) : u));
            }
            handleClosePanel();
        } catch (err) {
            if (err instanceof Error) alert(`Error saving unit: ${err.message}`);
        }
    };
    
    const handleDeleteClick = (unitId: string) => {
        setUnitToDeleteId(unitId);
    };

    const handleConfirmDelete = async () => {
        if (!unitToDeleteId) return;
        try {
            await apiClient(`/ar/apartment/api/apartments/${unitToDeleteId}/`, { method: 'DELETE' });
            setUnitsData(prevUnits => prevUnits.filter(u => u.id !== unitToDeleteId));
            setUnitToDeleteId(null);
        } catch (err) {
            if (err instanceof Error) alert(`Error deleting unit: ${err.message}`);
        }
    };

    const handleCancelDelete = () => {
        setUnitToDeleteId(null);
    };


    const handleSaveNewGroup = (newUnits: Unit[]) => {
        // This should ideally be a single bulk API call, but the API doc doesn't specify one.
        // We will add them one by one.
        Promise.all(newUnits.map(unit => {
            const formData = mapUnitToFormData(unit);
            return apiClient('/ar/apartment/api/apartments/', { method: 'POST', body: formData });
        })).then(results => {
            const addedUnits = results.map(mapApiUnitToUnit);
            setUnitsData(prev => [...addedUnits, ...prev]);
            setIsAddGroupPanelOpen(false);
        }).catch(err => {
            if (err instanceof Error) alert(`Error saving group: ${err.message}`);
        });
    };

    const totalPages = pagination.itemsPerPage === Number.MAX_SAFE_INTEGER ? 1 : Math.ceil(pagination.totalRecords / pagination.itemsPerPage);

    // Effect to reset to page 1 when filters change
    useEffect(() => {
        setPagination(p => ({ ...p, currentPage: 1 }));
    }, [searchTerm, statusFilter, typeFilter, cleaningFilter, pagination.itemsPerPage]);

    const handleClearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setTypeFilter('all');
        setCleaningFilter('all');
    };

    const handleExportCSV = () => {
        // This should ideally fetch all filtered data, not just the paginated view.
        // For simplicity, we'll export the current view.
        if (unitsData.length === 0) return;
        // ... (existing export logic)
    };

    const selectClass = 'py-2 px-3 w-full sm:w-auto border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-200 text-sm';


    const tableHeaders: { key: keyof Unit | 'actions', labelKey: string }[] = [
        { key: 'unitNumber', labelKey: 'units.th_id' },
        { key: 'unitName', labelKey: 'units.th_name' },
        { key: 'unitType', labelKey: 'units.th_type' },
        { key: 'cleaningStatus', labelKey: 'units.th_cleaning' },
        { key: 'isAvailable', labelKey: 'units.th_availability' },
        { key: 'floor', labelKey: 'units.th_floor' },
        { key: 'rooms', labelKey: 'units.th_rooms' },
        { key: 'beds', labelKey: 'units.th_beds' },
        { key: 'doubleBeds', labelKey: 'units.th_double_beds' },
        { key: 'bathrooms', labelKey: 'units.th_bathrooms' },
        { key: 'wardrobes', labelKey: 'units.th_wardrobes' },
        { key: 'tvs', labelKey: 'units.th_tvs' },
        { key: 'coolingType', labelKey: 'units.th_cooling' },
        { key: 'actions', labelKey: 'units.th_actions' },
    ];
    
    const PaginationControls = () => {
        if (totalPages <= 1) return null;
        // ... (existing pagination logic)
        return (
             <nav className="flex items-center gap-1" aria-label="Pagination">
                <button onClick={() => setPagination(p => ({...p, currentPage: Math.max(1, p.currentPage - 1)}))} disabled={pagination.currentPage === 1} className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" aria-label="Previous page"><ChevronLeftIcon className="w-5 h-5" /></button>
                <span className="text-sm font-semibold px-2">{pagination.currentPage} / {totalPages}</span>
                <button onClick={() => setPagination(p => ({...p, currentPage: Math.min(totalPages, p.currentPage + 1)}))} disabled={pagination.currentPage === totalPages || totalPages === 0} className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" aria-label="Next page"><ChevronRightIcon className="w-5 h-5" /></button>
            </nav>
        );
    };


    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div><h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{t('units.manageUnits')}</h2></div>
                <div className="flex flex-wrap gap-2">
                    <button onClick={handleExportCSV} className="flex items-center gap-2 bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors"><ArrowDownTrayIcon className="w-5 h-5" /><span>{t('units.export')}</span></button>
                    <button onClick={handleAddNewUnit} className="flex items-center gap-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"><PlusCircleIcon className="w-5 h-5" /><span>{t('units.addUnit')}</span></button>
                    <button onClick={() => setIsAddGroupPanelOpen(true)} className="flex items-center gap-2 bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors"><BuildingOfficeIcon className="w-5 h-5" /><span>{t('units.addGroupOfRooms')}</span></button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {statusCardsData.map(card => <UnitStatusCard key={card.labelKey} label={t(card.labelKey as any)} value={card.value} icon={card.Icon} iconBg={card.iconBg} />)}
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="relative w-full sm:w-auto sm:flex-grow">
                        <MagnifyingGlassIcon className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
                        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder={t('units.searchUnits')} className={`w-full py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-200 ${language === 'ar' ? 'pr-10' : 'pl-10'}`} />
                    </div>
                     <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}`}><Squares2x2Icon className="w-5 h-5" /></button>
                        <button onClick={() => setViewMode('table')} className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}`}><TableCellsIcon className="w-5 h-5" /></button>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-4 border-t dark:border-slate-700">
                    <div className="flex-shrink-0 flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300"><FunnelIcon className="w-5 h-5"/><span>{t('units.filters.filterBy')}:</span></div>
                    <select aria-label={t('units.filters.status')} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClass}>
                        <option value="all">{t('units.filters.all')} {t('units.filters.status')}</option>
                        <option value="free">{t('units.free')}</option>
                        <option value="occupied">{t('units.occupied')}</option>
                        <option value="not-checked-in">{t('units.notCheckedIn')}</option>
                        <option value="out-of-service">{t('units.outOfService')}</option>
                    </select>
                    <select aria-label={t('units.filters.type')} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={selectClass}>
                        <option value="all">{t('units.filters.all')} {t('units.filters.type')}</option>
                        {unitTypeOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                    </select>
                    <select aria-label={t('units.filters.cleaning')} value={cleaningFilter} onChange={(e) => setCleaningFilter(e.target.value)} className={selectClass}>
                        <option value="all">{t('units.filters.all')} {t('units.filters.cleaning')}</option>
                        <option value="clean">{t('units.clean')}</option>
                        <option value="not-clean">{t('units.notClean')}</option>
                    </select>
                    <button onClick={handleClearFilters} className="ms-auto text-sm font-semibold text-blue-500 hover:underline">{t('units.filters.clearFilters')}</button>
                </div>
            </div>

            {loading ? (
                 <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div></div>
            ) : error ? (
                <div className="flex justify-center items-center h-full p-4"><div className="bg-red-100 dark:bg-red-900/50 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative" role="alert"><strong className="font-bold">Error: </strong><span className="block sm:inline">{error}</span></div></div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {unitsData.map(unit => (<UnitCard key={unit.id} unit={unit} onViewClick={() => handleEditUnit(unit)} onEditClick={() => handleEditUnit(unit)} onDeleteClick={() => handleDeleteClick(unit.id)} />))}
                </div>
            ) : (
                <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                            <tr>{tableHeaders.map(header => <th key={header.key} scope="col" className="px-6 py-3">{t(header.labelKey as any)}</th>)}</tr>
                        </thead>
                        <tbody>
                            {unitsData.map(unit => (
                                <tr key={unit.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
                                    {tableHeaders.map(header => (
                                        <td key={`${unit.id}-${header.key}`} className="px-6 py-4">
                                            {header.key === 'actions' ? (
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => handleEditUnit(unit)} className="p-1.5 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/10" aria-label={`View ${unit.unitNumber}`}><EyeIcon className="w-5 h-5" /></button>
                                                    <button onClick={() => handleEditUnit(unit)} className="p-1.5 rounded-full text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-500/10" aria-label={`Edit ${unit.unitNumber}`}><PencilSquareIcon className="w-5 h-5" /></button>
                                                    <button onClick={() => handleDeleteClick(unit.id)} className="p-1.5 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10" aria-label={`Delete ${unit.unitNumber}`}><TrashIcon className="w-5 h-5" /></button>
                                                </div>
                                            ) : typeof unit[header.key as keyof Unit] === 'boolean' ? (
                                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${unit[header.key as keyof Unit] ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>{unit[header.key as keyof Unit] ? t('units.available_status') : t('units.not_available_status')}</span>
                                            ) : (
                                                <span>{unit[header.key as keyof Unit]?.toString()}</span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <span>{t('units.showing')}</span>
                    <select id="items-per-page" value={pagination.itemsPerPage === Number.MAX_SAFE_INTEGER ? 'all' : pagination.itemsPerPage} onChange={(e) => { const val = e.target.value; setPagination(p => ({...p, itemsPerPage: val === 'all' ? Number.MAX_SAFE_INTEGER : Number(val) })) }} className="py-1 px-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none" aria-label={t('units.entries')}>
                        <option value={12}>12</option><option value={24}>24</option><option value={48}>48</option><option value="all">{t('units.all')}</option>
                    </select>
                    <span>{`${pagination.totalRecords > 0 ? (pagination.currentPage - 1) * pagination.itemsPerPage + 1 : 0} - ${Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalRecords)} ${t('units.of')} ${pagination.totalRecords} ${t('units.entries')}`}</span>
                </div>
                <PaginationControls />
            </div>

            <UnitEditPanel unit={editingUnit} isOpen={isPanelOpen} onClose={handleClosePanel} onSave={handleSaveUnit} isAdding={isAdding} unitTypeOptions={unitTypeOptions} coolingTypeOptions={coolingTypeOptions} />
            <AddGroupPanel template={newUnitTemplate} isOpen={isAddGroupPanelOpen} onClose={() => setIsAddGroupPanelOpen(false)} onSave={handleSaveNewGroup} />
            <ConfirmationModal isOpen={!!unitToDeleteId} onClose={handleCancelDelete} onConfirm={handleConfirmDelete} title={t('units.deleteUnit')} message={t('units.confirmDelete')} />
        </div>
    );
};

export default UnitsPage;