import React, { useState, useMemo, useContext, useRef, useEffect } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import UnitEditPanel from './UnitEditPanel';
import AddGroupPanel from './AddGroupPanel';
import { Unit, UnitStatus, CoolingType } from '../types';
import UnitCard from './UnitCard';
import UnitStatusCard from './UnitStatusCard';
import ConfirmationModal from './ConfirmationModal';

// Icons
import PlusCircleIcon from './icons-redesign/PlusCircleIcon';
import MagnifyingGlassIcon from './icons-redesign/MagnifyingGlassIcon';
import PencilSquareIcon from './icons-redesign/PencilSquareIcon';
import TrashIcon from './icons-redesign/TrashIcon';
import ChevronLeftIcon from './icons-redesign/ChevronLeftIcon';
import ChevronRightIcon from './icons-redesign/ChevronRightIcon';
import EllipsisVerticalIcon from './icons-redesign/EllipsisVerticalIcon';
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


const initialUnitsData: Unit[] = [
    { id: '1', unitNumber: '101', unitName: '101A', status: 'free', unitType: 'غرفة مفردة', cleaningStatus: 'not-clean', price: 100.00, isAvailable: true, floor: 1, rooms: 1, bathrooms: 1, beds: 1, doubleBeds: 0, wardrobes: 1, tvs: 1, coolingType: 'split', notes: '', features: { common: { roomCleaning: true, elevator: true, parking: true, internet: false }, special: { kitchen: true, lounge: false, diningTable: false, refrigerator: true, iron: true, restaurantMenu: true, washingMachine: false, qibla: true, microwave: true, newspaper: false, oven: false, phoneDirectory: true } } },
    { id: '100', unitNumber: '102', unitName: 'جناح ملكي', status: 'not-checked-in', unitType: 'جناح', cleaningStatus: 'not-clean', customerName: 'عبد الله سلمان صالح الحريصي', checkIn: '2025-10-09', checkOut: '2025-11-08', isAvailable: false, floor: 1, rooms: 2, bathrooms: 1, beds: 2, doubleBeds: 1, wardrobes: 2, tvs: 2, coolingType: 'central', notes: 'VIP Guest', features: { common: { roomCleaning: true, elevator: true, parking: true, internet: true }, special: { kitchen: true, lounge: true, diningTable: true, refrigerator: true, iron: true, restaurantMenu: true, washingMachine: true, qibla: true, microwave: true, newspaper: true, oven: true, phoneDirectory: true } } },
    { id: '3', unitNumber: '103', unitName: '101C', status: 'occupied', unitType: 'غرفة مفردة', cleaningStatus: 'clean', customerName: 'محمد', checkIn: '2025-10-07', checkOut: '2025-11-06', remaining: 150.00, isAvailable: false, floor: 1, rooms: 1, bathrooms: 1, beds: 1, doubleBeds: 0, wardrobes: 1, tvs: 1, coolingType: 'window', notes: '', features: { common: { roomCleaning: true, elevator: true, parking: true, internet: true }, special: { kitchen: false, lounge: false, diningTable: false, refrigerator: true, iron: false, restaurantMenu: true, washingMachine: false, qibla: true, microwave: false, newspaper: false, oven: false, phoneDirectory: true } } },
    { id: '4', unitNumber: '104', unitName: '102A', status: 'not-checked-in', unitType: 'غرفة مفردة', cleaningStatus: 'not-clean', customerName: 'تامر بن ناصر بن صالح ال عباس', checkIn: '2025-10-01', checkOut: '2025-10-31', isAvailable: false, floor: 1, rooms: 1, bathrooms: 1, beds: 1, doubleBeds: 0, wardrobes: 1, tvs: 1, coolingType: 'split', notes: '', features: { common: { roomCleaning: true, elevator: true, parking: true, internet: false }, special: { kitchen: true, lounge: false, diningTable: false, refrigerator: true, iron: true, restaurantMenu: true, washingMachine: false, qibla: true, microwave: true, newspaper: false, oven: false, phoneDirectory: true } } },
    { id: '5', unitNumber: '105', unitName: 'جناح ديلوكس', status: 'free', unitType: 'جناح', cleaningStatus: 'clean', price: 220.00, isAvailable: true, floor: 1, rooms: 2, bathrooms: 2, beds: 3, doubleBeds: 1, wardrobes: 2, tvs: 1, coolingType: 'central', notes: '', features: { common: { roomCleaning: true, elevator: true, parking: true, internet: true }, special: { kitchen: true, lounge: true, diningTable: true, refrigerator: true, iron: true, restaurantMenu: true, washingMachine: true, qibla: true, microwave: true, newspaper: true, oven: true, phoneDirectory: true } } },
    { id: '6', unitNumber: '201', unitName: '201A', status: 'occupied', unitType: 'جناح', cleaningStatus: 'not-clean', customerName: 'علي أحمد', checkIn: '2025-10-15', checkOut: '2025-10-20', remaining: 0, isAvailable: false, floor: 2, rooms: 2, bathrooms: 1, beds: 2, doubleBeds: 0, wardrobes: 2, tvs: 2, coolingType: 'central', notes: '', features: { common: { roomCleaning: true, elevator: true, parking: true, internet: true }, special: { kitchen: true, lounge: true, diningTable: true, refrigerator: true, iron: true, restaurantMenu: true, washingMachine: true, qibla: true, microwave: true, newspaper: true, oven: true, phoneDirectory: true } } },
    { id: '2', unitNumber: '202', unitName: 'غرفة مزدوجة', status: 'free', unitType: 'غرفة مزدوجة', cleaningStatus: 'clean', price: 150.00, isAvailable: true, floor: 2, rooms: 1, bathrooms: 1, beds: 2, doubleBeds: 0, wardrobes: 1, tvs: 1, coolingType: 'split', notes: '', features: { common: { roomCleaning: true, elevator: true, parking: true, internet: true }, special: { kitchen: true, lounge: false, diningTable: false, refrigerator: true, iron: true, restaurantMenu: true, washingMachine: true, qibla: true, microwave: true, newspaper: false, oven: false, phoneDirectory: true } } },
    { id: '7', unitNumber: '301', unitName: '301 - صيانة', status: 'out-of-service', unitType: 'غرفة مفردة', cleaningStatus: 'not-clean', isAvailable: false, floor: 3, rooms: 1, bathrooms: 1, beds: 1, doubleBeds: 0, wardrobes: 1, tvs: 0, coolingType: 'window', notes: 'AC requires maintenance.', features: { common: { roomCleaning: false, elevator: true, parking: true, internet: false }, special: { kitchen: false, lounge: false, diningTable: false, refrigerator: false, iron: false, restaurantMenu: false, washingMachine: false, qibla: true, microwave: false, newspaper: false, oven: false, phoneDirectory: false } } },
    { id: '8', unitNumber: '302', unitName: '302', status: 'free', unitType: 'غرفة مفردة', cleaningStatus: 'clean', price: 105.00, isAvailable: true, floor: 3, rooms: 1, bathrooms: 1, beds: 1, doubleBeds: 0, wardrobes: 1, tvs: 1, coolingType: 'split', notes: '', features: { common: { roomCleaning: true, elevator: true, parking: true, internet: true }, special: { kitchen: true, lounge: false, diningTable: false, refrigerator: true, iron: true, restaurantMenu: true, washingMachine: false, qibla: true, microwave: true, newspaper: false, oven: false, phoneDirectory: true } } },
    { id: '9', unitNumber: '303', unitName: '303', status: 'free', unitType: 'غرفة مزدوجة', cleaningStatus: 'clean', price: 160.00, isAvailable: true, floor: 3, rooms: 1, bathrooms: 1, beds: 2, doubleBeds: 1, wardrobes: 2, tvs: 1, coolingType: 'central', notes: '', features: { common: { roomCleaning: true, elevator: true, parking: true, internet: true }, special: { kitchen: true, lounge: false, diningTable: false, refrigerator: true, iron: true, restaurantMenu: true, washingMachine: true, qibla: true, microwave: true, newspaper: false, oven: false, phoneDirectory: true } } },
    { id: '10', unitNumber: '401', unitName: 'جناح رئاسي', status: 'occupied', unitType: 'جناح', cleaningStatus: 'clean', customerName: 'فهد', checkIn: '2025-10-18', checkOut: '2025-10-22', remaining: 500.00, isAvailable: false, floor: 4, rooms: 3, bathrooms: 2, beds: 3, doubleBeds: 1, wardrobes: 3, tvs: 3, coolingType: 'central', notes: 'Long term stay', features: { common: { roomCleaning: true, elevator: true, parking: true, internet: true }, special: { kitchen: true, lounge: true, diningTable: true, refrigerator: true, iron: true, restaurantMenu: true, washingMachine: true, qibla: true, microwave: true, newspaper: true, oven: true, phoneDirectory: true } } },
    { id: '11', unitNumber: '402', unitName: '402', status: 'free', unitType: 'جناح', cleaningStatus: 'not-clean', price: 250.00, isAvailable: true, floor: 4, rooms: 2, bathrooms: 1, beds: 2, doubleBeds: 0, wardrobes: 2, tvs: 1, coolingType: 'split', notes: '', features: { common: { roomCleaning: true, elevator: true, parking: true, internet: true }, special: { kitchen: true, lounge: true, diningTable: false, refrigerator: true, iron: true, restaurantMenu: true, washingMachine: false, qibla: true, microwave: true, newspaper: false, oven: false, phoneDirectory: true } } },
    { id: '12', unitNumber: '403', unitName: '403 - صيانة', status: 'out-of-service', unitType: 'غرفة مزدوجة', cleaningStatus: 'not-clean', isAvailable: false, floor: 4, rooms: 1, bathrooms: 1, beds: 2, doubleBeds: 0, wardrobes: 1, tvs: 1, coolingType: 'window', notes: 'Window lock broken.', features: { common: { roomCleaning: false, elevator: true, parking: true, internet: false }, special: { kitchen: false, lounge: false, diningTable: false, refrigerator: true, iron: false, restaurantMenu: false, washingMachine: false, qibla: true, microwave: false, newspaper: false, oven: false, phoneDirectory: true } } },
];

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
    unitType: 'غرفة مفردة', // Default to single room
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
        common: {
            roomCleaning: false,
            elevator: true,
            parking: true,
            internet: true,
        },
        special: {
            kitchen: false,
            lounge: false,
            diningTable: false,
            refrigerator: false,
            iron: false,
            restaurantMenu: false,
            washingMachine: false,
            qibla: true,
            microwave: false,
            newspaper: false,
            oven: false,
            phoneDirectory: false,
        },
    },
};


const UnitsPage: React.FC = () => {
    const { t, language } = useContext(LanguageContext);
    
    const [unitsData, setUnitsData] = useState<Unit[]>(initialUnitsData);
    const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);
    const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
    const actionMenuRef = useRef<HTMLDivElement>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [isAddGroupPanelOpen, setIsAddGroupPanelOpen] = useState(false);
    const [unitToDeleteId, setUnitToDeleteId] = useState<string | null>(null);

    // Filter states
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [cleaningFilter, setCleaningFilter] = useState<string>('all');
    
    const unitCounts = useMemo(() => {
        return unitsData.reduce((acc, unit) => {
            if (!acc[unit.status]) {
                acc[unit.status] = 0;
            }
            acc[unit.status]++;
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
        setActiveActionMenu(null);
    };

    const handleAddNewUnit = () => {
        setEditingUnit(JSON.parse(JSON.stringify(newUnitTemplate)));
        setIsAdding(true);
        setIsPanelOpen(true);
    };

    const handleClosePanel = () => {
        setIsPanelOpen(false);
        setEditingUnit(null);
    };

    const handleSaveUnit = (updatedUnit: Unit) => {
        if (isAdding) {
            setUnitsData([...unitsData, { ...updatedUnit, id: `new-${Date.now()}` }]);
        } else {
            setUnitsData(unitsData.map(u => u.id === updatedUnit.id ? updatedUnit : u));
        }
        handleClosePanel();
    };
    
    const handleDeleteClick = (unitId: string) => {
        setUnitToDeleteId(unitId);
        setActiveActionMenu(null);
    };

    const handleConfirmDelete = () => {
        if (!unitToDeleteId) return;
        setUnitsData(prevUnits => prevUnits.filter(u => u.id !== unitToDeleteId));
        setUnitToDeleteId(null);
    };

    const handleCancelDelete = () => {
        setUnitToDeleteId(null);
    };


    const handleSaveNewGroup = (newUnits: Unit[]) => {
        setUnitsData(prev => [...prev, ...newUnits]);
        setIsAddGroupPanelOpen(false);
    };

    const filteredUnits = useMemo(() => {
        return unitsData
            .filter(unit => { // Search filter
                if (!searchTerm) return true;
                return (
                    unit.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (unit.unitName && unit.unitName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (unit.customerName && unit.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
                );
            })
            .filter(unit => { // Status filter
                if (statusFilter === 'all') return true;
                return unit.status === statusFilter;
            })
            .filter(unit => { // Type filter
                if (typeFilter === 'all') return true;
                return unit.unitType === typeFilter;
            })
            .filter(unit => { // Cleaning filter
                if (cleaningFilter === 'all') return true;
                return unit.cleaningStatus === cleaningFilter;
            });
    }, [unitsData, searchTerm, statusFilter, typeFilter, cleaningFilter]);

    const totalPages = itemsPerPage === Number.MAX_SAFE_INTEGER ? 1 : Math.ceil(filteredUnits.length / itemsPerPage);

    const paginatedUnits = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredUnits.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredUnits, currentPage, itemsPerPage]);


    // Effect to reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, typeFilter, cleaningFilter, itemsPerPage]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
                setActiveActionMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleClearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setTypeFilter('all');
        setCleaningFilter('all');
    };

    const handleExportCSV = () => {
        if (filteredUnits.length === 0) {
            return;
        }

        const toCamelCase = (str: string) => str.replace(/-(\w)/g, (_, c) => c.toUpperCase());

        // Headers for the CSV file
        const headers = [
            "Unit Number", "Unit Name", "Unit Type", "Cleaning Status", "Availability",
            "Status", "Customer Name", "Check-In", "Check-Out", "Price", "Remaining", "Floor", "Notes"
        ];

        const rows = filteredUnits.map(unit => {
            const statusKey = `units.${toCamelCase(unit.status)}`;
            const cleaningKey = `units.${unit.cleaningStatus === 'not-clean' ? 'notClean' : 'clean'}`;
            const translatedStatus = t(statusKey as any, unit.status);
            const translatedCleaning = t(cleaningKey as any, unit.cleaningStatus);
            const availability = unit.isAvailable ? t('units.available_status') : t('units.not_available_status');

            const rowData = [
                unit.unitNumber,
                unit.unitName || '',
                unit.unitType,
                translatedCleaning,
                availability,
                translatedStatus,
                unit.customerName || '',
                unit.checkIn || '',
                unit.checkOut || '',
                unit.price?.toString() || '0',
                unit.remaining?.toString() || '0',
                unit.floor.toString(),
                unit.notes || ''
            ];
            
            return rowData.map(value => {
                const strValue = String(value);
                if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
                    return `"${strValue.replace(/"/g, '""')}"`;
                }
                return strValue;
            }).join(',');
        });

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        link.href = URL.createObjectURL(blob);
        link.download = 'units_export.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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

        const pageNumbers = [];
        const siblingCount = 1;
        const totalVisiblePages = 7;

        if (totalPages <= totalVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
            const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
            const shouldShowLeftDots = leftSiblingIndex > 2;
            const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

            pageNumbers.push(1);

            if (shouldShowLeftDots) {
                pageNumbers.push('...');
            }

            for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
                if (i > 1 && i < totalPages) {
                    pageNumbers.push(i);
                }
            }

            if (shouldShowRightDots) {
                pageNumbers.push('...');
            }
            
            pageNumbers.push(totalPages);
        }
        
        const uniquePageNumbers = Array.from(new Set(pageNumbers));

        return (
            <nav className="flex items-center gap-1" aria-label="Pagination">
                <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous page"
                >
                    <ChevronLeftIcon className="w-5 h-5" />
                </button>

                {uniquePageNumbers.map((page, index) => {
                    if (page === '...') {
                        return (
                            <span key={`ellipsis-${index}`} className="flex items-center justify-center w-9 h-9 text-sm font-semibold text-slate-500 dark:text-slate-400">
                                ...
                            </span>
                        );
                    }
                    const isCurrent = page === currentPage;
                    return (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page as number)}
                            className={`inline-flex items-center justify-center w-9 h-9 rounded-md text-sm font-semibold transition-colors ${
                                isCurrent
                                    ? 'bg-blue-500 text-white shadow-sm'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                            aria-current={isCurrent ? 'page' : undefined}
                        >
                            {page}
                        </button>
                    );
                })}

                <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next page"
                >
                    <ChevronRightIcon className="w-5 h-5" />
                </button>
            </nav>
        );
    };


    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{t('units.manageUnits')}</h2>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleExportCSV} className="flex items-center gap-2 bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors">
                        <ArrowDownTrayIcon className="w-5 h-5" />
                        <span>{t('units.export')}</span>
                    </button>
                    <button onClick={handleAddNewUnit} className="flex items-center gap-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                        <PlusCircleIcon className="w-5 h-5" />
                        <span>{t('units.addUnit')}</span>
                    </button>
                    <button onClick={() => setIsAddGroupPanelOpen(true)} className="flex items-center gap-2 bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors">
                        <BuildingOfficeIcon className="w-5 h-5" />
                        <span>{t('units.addGroupOfRooms')}</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {statusCardsData.map(card => <UnitStatusCard key={card.labelKey} label={t(card.labelKey as any)} value={card.value} icon={card.Icon} iconBg={card.iconBg} />)}
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="relative w-full sm:w-auto sm:flex-grow">
                        <MagnifyingGlassIcon className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
                        <input 
                            type="text" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t('units.searchUnits')}
                            className={`w-full py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-200 ${language === 'ar' ? 'pr-10' : 'pl-10'}`}
                        />
                    </div>
                     <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}`}>
                            <Squares2x2Icon className="w-5 h-5" />
                        </button>
                        <button onClick={() => setViewMode('table')} className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}`}>
                            <TableCellsIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-4 border-t dark:border-slate-700">
                    <div className="flex-shrink-0 flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                         <FunnelIcon className="w-5 h-5"/>
                         <span>{t('units.filters.filterBy')}:</span>
                    </div>
                    <select aria-label={t('units.filters.status')} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClass}>
                        <option value="all">{t('units.filters.all')} {t('units.filters.status')}</option>
                        <option value="free">{t('units.free')}</option>
                        <option value="occupied">{t('units.occupied')}</option>
                        <option value="not-checked-in">{t('units.notCheckedIn')}</option>
                        <option value="out-of-service">{t('units.outOfService')}</option>
                    </select>
                    <select aria-label={t('units.filters.type')} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={selectClass}>
                        <option value="all">{t('units.filters.all')} {t('units.filters.type')}</option>
                        <option value="غرفة مفردة">{t('units.singleRoom')}</option>
                        <option value="غرفة مزدوجة">{t('units.doubleRoom')}</option>
                        <option value="جناح">{t('units.suite')}</option>
                    </select>
                    <select aria-label={t('units.filters.cleaning')} value={cleaningFilter} onChange={(e) => setCleaningFilter(e.target.value)} className={selectClass}>
                        <option value="all">{t('units.filters.all')} {t('units.filters.cleaning')}</option>
                        <option value="clean">{t('units.clean')}</option>
                        <option value="not-clean">{t('units.notClean')}</option>
                    </select>
                    <button onClick={handleClearFilters} className="ms-auto text-sm font-semibold text-blue-500 hover:underline">
                        {t('units.filters.clearFilters')}
                    </button>
                </div>
            </div>

            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {paginatedUnits.map(unit => (
                        <div key={unit.id} className="relative">
                            <UnitCard 
                                unit={unit} 
                                onEditClick={() => handleEditUnit(unit)} 
                                onMenuClick={(event) => {
                                    event.stopPropagation();
                                    setActiveActionMenu(activeActionMenu === unit.id ? null : unit.id);
                                }}
                            />
                             {activeActionMenu === unit.id && (
                                <div ref={actionMenuRef} className={`absolute top-14 z-10 mt-1 w-40 bg-white dark:bg-slate-900 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 ${language === 'ar' ? 'left-4' : 'right-4'}`}>
                                    <button onClick={() => handleEditUnit(unit)} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                                        <PencilSquareIcon className="w-4 h-4" />
                                        {t('units.editUnit')}
                                    </button>
                                    <button onClick={() => handleDeleteClick(unit.id)} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10">
                                        <TrashIcon className="w-4 h-4" />
                                        {t('units.deleteUnit')}
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                            <tr>
                                {tableHeaders.map(header => <th key={header.key} scope="col" className="px-6 py-3">{t(header.labelKey as any)}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedUnits.map(unit => (
                                <tr key={unit.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
                                    {tableHeaders.map(header => (
                                        <td key={`${unit.id}-${header.key}`} className="px-6 py-4">
                                            {header.key === 'actions' ? (
                                                <div className="relative" ref={activeActionMenu === unit.id ? actionMenuRef : null}>
                                                    <button onClick={() => setActiveActionMenu(activeActionMenu === unit.id ? null : unit.id)} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600">
                                                        <EllipsisVerticalIcon className="w-5 h-5" />
                                                    </button>
                                                    {activeActionMenu === unit.id && (
                                                        <div className="absolute top-full right-0 mt-1 w-40 bg-white dark:bg-slate-900 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                                                            <button onClick={() => handleEditUnit(unit)} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                                                                <PencilSquareIcon className="w-4 h-4" />
                                                                {t('units.editUnit')}
                                                            </button>
                                                            <button onClick={() => handleDeleteClick(unit.id)} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10">
                                                                <TrashIcon className="w-4 h-4" />
                                                                {t('units.deleteUnit')}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : typeof unit[header.key as keyof Unit] === 'boolean' ? (
                                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${unit[header.key as keyof Unit] ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                                    {unit[header.key as keyof Unit] ? t('units.available_status') : t('units.not_available_status')}
                                                </span>
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
                {/* Left Side: Items per page and count */}
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <span>{t('units.showing')}</span>
                    <select
                        id="items-per-page"
                        value={itemsPerPage === Number.MAX_SAFE_INTEGER ? 'all' : itemsPerPage}
                        onChange={(e) => {
                             const val = e.target.value;
                             setItemsPerPage(val === 'all' ? Number.MAX_SAFE_INTEGER : Number(val));
                        }}
                        className="py-1 px-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        aria-label={t('units.entries')}
                    >
                        <option value={12}>12</option>
                        <option value={24}>24</option>
                        <option value={48}>48</option>
                        <option value="all">{t('units.all')}</option>
                    </select>
                    <span>
                        {`${filteredUnits.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - ${Math.min(currentPage * itemsPerPage, filteredUnits.length)} ${t('units.of')} ${filteredUnits.length} ${t('units.entries')}`}
                    </span>
                </div>

                {/* Right Side: Page navigation */}
                <PaginationControls />
            </div>

            <UnitEditPanel unit={editingUnit} isOpen={isPanelOpen} onClose={handleClosePanel} onSave={handleSaveUnit} isAdding={isAdding} />
            <AddGroupPanel template={newUnitTemplate} isOpen={isAddGroupPanelOpen} onClose={() => setIsAddGroupPanelOpen(false)} onSave={handleSaveNewGroup} />
            <ConfirmationModal
                isOpen={!!unitToDeleteId}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title={t('units.deleteUnit')}
                message={t('units.confirmDelete')}
            />
        </div>
    );
};

export default UnitsPage;