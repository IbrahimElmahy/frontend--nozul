import React, { useState, useMemo, useContext, useRef, useEffect } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import UnitEditPanel from './UnitEditPanel';
import { Unit, UnitStatus, CoolingType } from '../types';
import UnitCard from './UnitCard';

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


const UnitsPage: React.FC = () => {
    const { t, language } = useContext(LanguageContext);
    
    const [unitsData, setUnitsData] = useState<Unit[]>(initialUnitsData);
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
    const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);
    const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
    const actionMenuRef = useRef<HTMLDivElement>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

    useEffect(() => {
        if (viewMode === 'grid') {
            setItemsPerPage(12);
        } else {
            setItemsPerPage(10);
        }
        setCurrentPage(1); // Reset to page 1 when view changes
    }, [viewMode]);

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

    const handleUnitClick = (unit: Unit) => {
        setSelectedUnit(unit);
        setIsEditPanelOpen(true);
        setActiveActionMenu(null);
    };

    const handleDeleteClick = (unitId: string) => {
        setActiveActionMenu(null);
        if (window.confirm(t('units.confirmDelete'))) {
            setUnitsData(unitsData.filter(u => u.id !== unitId));
        }
    };

    const handleClosePanel = () => {
        setIsEditPanelOpen(false);
        setSelectedUnit(null);
    };

    const handleSaveUnit = (updatedUnit: Unit) => {
        const newUnits = unitsData.map(unit => {
            if (unit.id === updatedUnit.id) {
                let status: UnitStatus = updatedUnit.status;
                if (!updatedUnit.isAvailable) {
                    status = 'out-of-service';
                } else if (unit.status === 'out-of-service' && updatedUnit.isAvailable) {
                    status = 'free';
                }
                return { ...updatedUnit, status };
            }
            return unit;
        });
        setUnitsData(newUnits);
        handleClosePanel();
    };
    
    const filteredUnits = useMemo(() => {
        return unitsData.filter(unit => 
            (unit.unitName && unit.unitName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (unit.unitNumber && unit.unitNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (unit.customerName && unit.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [unitsData, searchTerm]);

    const paginatedUnits = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredUnits.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredUnits, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredUnits.length / itemsPerPage);

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const getUnitTypeTranslation = (type: string) => {
        if (type === 'غرفة مفردة') return t('units.singleRoom');
        if (type === 'غرفة مزدوجة') return t('units.doubleRoom');
        if (type === 'جناح') return t('units.suite');
        return type;
    };

    const getCoolingTypeTranslation = (type: CoolingType) => {
        if (type === 'central') return t('units.central');
        if (type === 'split') return t('units.split');
        if (type === 'window') return t('units.window');
        return '-';
    };


    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">{t('units.manageUnits')}</h2>
                    <div className="flex-grow sm:flex-grow-0 flex items-center gap-2 sm:gap-4">
                        <div className="flex items-center bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-2 transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-slate-800 text-blue-500 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50'}`}
                                aria-label={t('units.network')}
                                aria-pressed={viewMode === 'grid'}
                            >
                                <Squares2x2Icon className="w-5 h-5" />
                                <span className="hidden sm:inline">{t('units.network')}</span>
                            </button>
                            <button
                                onClick={() => setViewMode('table')}
                                className={`px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-2 transition-colors ${viewMode === 'table' ? 'bg-white dark:bg-slate-800 text-blue-500 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50'}`}
                                aria-label={t('units.table')}
                                aria-pressed={viewMode === 'table'}
                            >
                                <TableCellsIcon className="w-5 h-5" />
                                <span className="hidden sm:inline">{t('units.table')}</span>
                            </button>
                        </div>
                         <div className="relative flex-grow sm:w-64">
                             <input 
                                type="text" 
                                placeholder={t('units.searchUnits')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm ${language === 'ar' ? 'pr-10' : 'pl-10'}`} 
                             />
                             <MagnifyingGlassIcon className={`w-5 h-5 absolute top-1/2 -translate-y-1/2 text-slate-400 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
                         </div>
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors">
                            <PlusCircleIcon className="w-5 h-5" />
                            <span>{t('units.addUnit')}</span>
                        </button>
                    </div>
                </div>
            </div>

            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {paginatedUnits.map(unit => (
                        <UnitCard key={unit.id} unit={unit} onClick={() => handleUnitClick(unit)} />
                    ))}
                </div>
            ) : (
                <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                            <tr>
                                {['th_id', 'th_name', 'th_type', 'th_cleaning', 'th_availability', 'th_floor', 'th_rooms', 'th_beds', 'th_double_beds', 'th_bathrooms', 'th_wardrobes', 'th_tvs', 'th_cooling', 'th_actions'].map(key => (
                                    <th key={key} scope="col" className="px-6 py-3">{t(`units.${key}` as any)}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedUnits.map((unit, index) => {
                                const isMenuOpen = activeActionMenu === unit.id;
                                const dropdownPositionClass = language === 'ar' ? 'left-0' : 'right-0';
                                return (
                                    <tr key={unit.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
                                        <td className="px-6 py-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                        <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white">{unit.unitName || unit.unitNumber}</th>
                                        <td className="px-6 py-4">{getUnitTypeTranslation(unit.unitType)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${unit.cleaningStatus === 'clean' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                                {t(unit.cleaningStatus === 'clean' ? 'units.clean' : 'units.notClean')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${unit.isAvailable ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}`}>
                                                {t(unit.isAvailable ? 'units.available_status' : 'units.not_available_status')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{unit.floor}</td>
                                        <td className="px-6 py-4">{unit.rooms}</td>
                                        <td className="px-6 py-4">{unit.beds}</td>
                                        <td className="px-6 py-4">{unit.doubleBeds}</td>
                                        <td className="px-6 py-4">{unit.bathrooms}</td>
                                        <td className="px-6 py-4">{unit.wardrobes}</td>
                                        <td className="px-6 py-4">{unit.tvs}</td>
                                        <td className="px-6 py-4">{getCoolingTypeTranslation(unit.coolingType)}</td>
                                        <td className="px-6 py-4">
                                            <div className="relative">
                                                <button 
                                                    onClick={() => setActiveActionMenu(isMenuOpen ? null : unit.id)} 
                                                    className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                                                    aria-haspopup="true"
                                                    aria-expanded={isMenuOpen}
                                                >
                                                    <EllipsisVerticalIcon className="w-5 h-5"/>
                                                </button>
                                                {isMenuOpen && (
                                                    <div 
                                                        ref={actionMenuRef} 
                                                        className={`absolute z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-slate-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${dropdownPositionClass}`}
                                                        role="menu"
                                                        aria-orientation="vertical"
                                                        aria-labelledby={`menu-button-${unit.id}`}
                                                    >
                                                        <div className="py-1" role="none">
                                                            <a href="#" onClick={(e) => { e.preventDefault(); handleUnitClick(unit); }} className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 group flex items-center gap-3 px-4 py-2 text-sm" role="menuitem">
                                                                <MagnifyingGlassIcon className="h-5 w-5 text-slate-400 group-hover:text-slate-500" />
                                                                {t('units.viewDetails')}
                                                            </a>
                                                            <a href="#" onClick={(e) => { e.preventDefault(); handleUnitClick(unit); }} className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 group flex items-center gap-3 px-4 py-2 text-sm" role="menuitem">
                                                                <PencilSquareIcon className="h-5 w-5 text-slate-400 group-hover:text-slate-500" />
                                                                {t('units.editUnit')}
                                                            </a>
                                                            <a href="#" onClick={(e) => { e.preventDefault(); handleDeleteClick(unit.id); }} className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 group flex items-center gap-3 px-4 py-2 text-sm" role="menuitem">
                                                                <TrashIcon className="h-5 w-5 text-red-400 group-hover:text-red-500" />
                                                                {t('units.deleteUnit')}
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}


            <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
                <div className="text-slate-600 dark:text-slate-400">
                    {t('units.showing')} <span className="font-semibold text-slate-800 dark:text-slate-200">{(currentPage - 1) * itemsPerPage + 1}</span> {t('units.to')} <span className="font-semibold text-slate-800 dark:text-slate-200">{Math.min(currentPage * itemsPerPage, filteredUnits.length)}</span> {t('units.of')} <span className="font-semibold text-slate-800 dark:text-slate-200">{filteredUnits.length}</span> {t('units.entries')}
                </div>
                 <div className="flex items-center gap-2">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed">
                        <ChevronLeftIcon className={`w-5 h-5 transform ${language === 'en' ? 'rotate-180' : ''}`} />
                    </button>
                     <span className="text-slate-700 dark:text-slate-300">
                         {currentPage} / {totalPages}
                     </span>
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed">
                        <ChevronRightIcon className={`w-5 h-5 transform ${language === 'ar' ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>
            
            <UnitEditPanel 
                unit={selectedUnit}
                isOpen={isEditPanelOpen}
                onClose={handleClosePanel}
                onSave={handleSaveUnit}
            />
        </div>
    );
};

export default UnitsPage;