import React, { useState, useMemo, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Unit, UnitStatus } from '../types';

import UnitStatusCard from './UnitStatusCard';
import UnitCard from './UnitCard';
import UnitsTable from './UnitsTable';
import UnitEditPanel from './UnitEditPanel';

// Icons
import BuildingOfficeIcon from './icons-redesign/BuildingOfficeIcon';
import ArrowRightStartOnRectangleIcon from './icons-redesign/ArrowRightStartOnRectangleIcon';
import ArrowLeftOnRectangleIcon from './icons-redesign/ArrowLeftOnRectangleIcon';
import WrenchScrewdriverIcon from './icons-redesign/WrenchScrewdriverIcon';
import MagnifyingGlassIcon from './icons-redesign/MagnifyingGlassIcon';
import FunnelIcon from './icons-redesign/FunnelIcon';
import ArrowDownTrayIcon from './icons-redesign/ArrowDownTrayIcon';
import Squares2x2Icon from './icons-redesign/Squares2x2Icon';
import TableCellsIcon from './icons-redesign/TableCellsIcon';
import UserGroupIcon from './icons-redesign/UserGroupIcon';
import CalendarPlusIcon from './icons-redesign/CalendarPlusIcon';


const mockUnits: Unit[] = [
    { id: '1', unitNumber: '101', unitName: 'الجناح الملكي', status: 'occupied', customerName: 'عبدالله محمد', checkIn: '2024-07-20', checkOut: '2024-07-25', price: 500, remaining: -150, unitType: 'جناح', cleaningStatus: 'clean', isAvailable: false, floor: 1, rooms: 3, bathrooms: 2, beds: 2, doubleBeds: 1, wardrobes: 2, tvs: 2, coolingType: 'central', notes: 'عميل مميز', features: { common: { roomCleaning: true, elevator: true, parking: true, internet: true }, special: { kitchen: true, lounge: true, diningTable: true, refrigerator: true, iron: true, restaurantMenu: true, washingMachine: true, qibla: true, microwave: true, newspaper: true, oven: true, phoneDirectory: true } } },
    { id: '2', unitNumber: '102', status: 'free', unitType: 'غرفة مزدوجة', cleaningStatus: 'not-clean', isAvailable: true, floor: 1, rooms: 1, bathrooms: 1, beds: 2, doubleBeds: 0, wardrobes: 1, tvs: 1, coolingType: 'split', notes: '', features: { common: { roomCleaning: true, elevator: true, parking: true, internet: true }, special: { kitchen: false, lounge: false, diningTable: false, refrigerator: true, iron: true, restaurantMenu: true, washingMachine: false, qibla: true, microwave: false, newspaper: false, oven: false, phoneDirectory: true } } },
    { id: '3', unitNumber: '103', status: 'not-checked-in', customerName: 'فاطمة علي', checkIn: '2024-07-22', checkOut: '2024-07-24', price: 300, remaining: 300, unitType: 'غرفة مزدوجة', cleaningStatus: 'clean', isAvailable: false, floor: 1, rooms: 1, bathrooms: 1, beds: 2, doubleBeds: 0, wardrobes: 1, tvs: 1, coolingType: 'split', notes: '', features: { common: { roomCleaning: true, elevator: true, parking: true, internet: true }, special: { kitchen: false, lounge: false, diningTable: false, refrigerator: true, iron: true, restaurantMenu: true, washingMachine: false, qibla: true, microwave: false, newspaper: false, oven: false, phoneDirectory: true } } },
    { id: '4', unitNumber: '201', status: 'out-of-service', unitType: 'غرفة مفردة', cleaningStatus: 'not-clean', isAvailable: false, floor: 2, rooms: 1, bathrooms: 1, beds: 1, doubleBeds: 0, wardrobes: 1, tvs: 1, coolingType: 'window', notes: 'تحت الصيانة', features: { common: { roomCleaning: false, elevator: true, parking: true, internet: true }, special: { kitchen: false, lounge: false, diningTable: false, refrigerator: false, iron: false, restaurantMenu: true, washingMachine: false, qibla: true, microwave: false, newspaper: false, oven: false, phoneDirectory: true } } },
    { id: '5', unitNumber: '202', status: 'free', unitType: 'غرفة مفردة', cleaningStatus: 'clean', isAvailable: true, floor: 2, rooms: 1, bathrooms: 1, beds: 1, doubleBeds: 0, wardrobes: 1, tvs: 1, coolingType: 'window', notes: '', features: { common: { roomCleaning: true, elevator: true, parking: true, internet: true }, special: { kitchen: false, lounge: false, diningTable: false, refrigerator: false, iron: false, restaurantMenu: true, washingMachine: false, qibla: true, microwave: false, newspaper: false, oven: false, phoneDirectory: true } } },
    { id: '6', unitNumber: '203', status: 'occupied', customerName: 'خالد أحمد', checkIn: '2024-07-21', checkOut: '2024-07-23', price: 250, remaining: 0, unitType: 'غرفة مفردة', cleaningStatus: 'clean', isAvailable: false, floor: 2, rooms: 1, bathrooms: 1, beds: 1, doubleBeds: 0, wardrobes: 1, tvs: 1, coolingType: 'window', notes: '', features: { common: { roomCleaning: true, elevator: true, parking: true, internet: true }, special: { kitchen: false, lounge: false, diningTable: false, refrigerator: false, iron: false, restaurantMenu: true, washingMachine: false, qibla: true, microwave: false, newspaper: false, oven: false, phoneDirectory: true } } },
    { id: '7', unitNumber: '301', status: 'free', unitType: 'جناح', cleaningStatus: 'clean', isAvailable: true, floor: 3, rooms: 2, bathrooms: 2, beds: 1, doubleBeds: 1, wardrobes: 2, tvs: 2, coolingType: 'central', notes: '', features: { common: { roomCleaning: true, elevator: true, parking: true, internet: true }, special: { kitchen: true, lounge: true, diningTable: true, refrigerator: true, iron: true, restaurantMenu: true, washingMachine: true, qibla: true, microwave: true, newspaper: false, oven: true, phoneDirectory: true } } },
    { id: '8', unitNumber: '302', status: 'free', unitType: 'غرفة مزدوجة', cleaningStatus: 'not-clean', isAvailable: true, floor: 3, rooms: 1, bathrooms: 1, beds: 2, doubleBeds: 0, wardrobes: 1, tvs: 1, coolingType: 'split', notes: '', features: { common: { roomCleaning: true, elevator: true, parking: true, internet: true }, special: { kitchen: false, lounge: false, diningTable: false, refrigerator: true, iron: true, restaurantMenu: true, washingMachine: false, qibla: true, microwave: false, newspaper: false, oven: false, phoneDirectory: true } } },
];


const UnitsPage: React.FC = () => {
    const { t } = useContext(LanguageContext);
    const [units, setUnits] = useState<Unit[]>(mockUnits);
    const [viewMode, setViewMode] = useState<'network' | 'table'>('network');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeStatusFilter, setActiveStatusFilter] = useState<UnitStatus | 'all'>('all');
    const [activeTypeFilter, setActiveTypeFilter] = useState<string>('all');
    
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
    const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);

    const handleEditUnit = (unit: Unit) => {
        setSelectedUnit(unit);
        setIsEditPanelOpen(true);
    };

    const handleSaveUnit = (updatedUnit: Unit) => {
        setUnits(units.map(u => u.id === updatedUnit.id ? updatedUnit : u));
        setIsEditPanelOpen(false);
        setSelectedUnit(null);
    };

    const handleClosePanel = () => {
        setIsEditPanelOpen(false);
        setSelectedUnit(null);
    };
    
    const handleDeleteUnit = (unitId: string) => {
        setUnits(prevUnits => prevUnits.filter(u => u.id !== unitId));
    };

    const handleUnitStatusChange = (unitId: string, isAvailable: boolean) => {
        setUnits(prevUnits =>
            prevUnits.map(u => {
                if (u.id === unitId) {
                    const updatedUnit = { ...u, isAvailable };
                    
                    if (isAvailable && updatedUnit.status === 'out-of-service') {
                        updatedUnit.status = 'free';
                    } else if (!isAvailable && updatedUnit.status === 'free') {
                        updatedUnit.status = 'out-of-service';
                    }

                    return updatedUnit;
                }
                return u;
            })
        );
    };

    const statusCounts = useMemo(() => {
        return units.reduce((acc, unit) => {
            acc[unit.status] = (acc[unit.status] || 0) + 1;
            return acc;
        }, {} as Record<UnitStatus, number>);
    }, [units]);

    const filteredUnits = useMemo(() => {
        return units
            .filter(unit => activeStatusFilter === 'all' || unit.status === activeStatusFilter)
            .filter(unit => activeTypeFilter === 'all' || unit.unitType === activeTypeFilter)
            .filter(unit => 
                unit.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                unit.unitNumber.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [units, searchTerm, activeStatusFilter, activeTypeFilter]);

    const unitTypes = useMemo(() => [...new Set(units.map(u => u.unitType))], [units]);

    const statusFilters: { label: string; value: UnitStatus | 'all'; count: number }[] = [
        { label: t('units.free'), value: 'free', count: statusCounts.free || 0 },
        { label: t('units.occupied'), value: 'occupied', count: statusCounts.occupied || 0 },
        { label: t('units.checkInToday'), value: 'not-checked-in', count: statusCounts['not-checked-in'] || 0 },
        { label: t('units.outOfService'), value: 'out-of-service', count: statusCounts['out-of-service'] || 0 },
    ];
    
    return (
        <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 <UnitStatusCard icon={BuildingOfficeIcon} label={t('units.free')} value={statusCounts.free || 0} color="text-teal-500" iconBg="bg-teal-500/10" />
                 <UnitStatusCard icon={ArrowRightStartOnRectangleIcon} label={t('units.occupied')} value={statusCounts.occupied || 0} color="text-rose-500" iconBg="bg-rose-500/10" />
                 <UnitStatusCard icon={ArrowLeftOnRectangleIcon} label={t('units.notCheckedIn')} value={statusCounts['not-checked-in'] || 0} color="text-sky-500" iconBg="bg-sky-500/10" />
                 <UnitStatusCard icon={WrenchScrewdriverIcon} label={t('units.outOfService')} value={statusCounts['out-of-service'] || 0} color="text-amber-500" iconBg="bg-amber-500/10" />
            </div>

            {/* Toolbar */}
             <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 space-y-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                     <div className="w-full md:w-auto relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                        <input
                            type="text"
                            placeholder={t('units.searchPlaceholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-64 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg text-slate-500 bg-slate-100 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"><FunnelIcon className="w-5 h-5"/></button>
                        <button className="p-2 rounded-lg text-slate-500 bg-slate-100 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"><ArrowDownTrayIcon className="w-5 h-5"/></button>
                        <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                            <button onClick={() => setViewMode('network')} className={`px-3 py-1 rounded-md text-sm font-semibold transition-colors ${viewMode === 'network' ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'}`}><Squares2x2Icon className="w-5 h-5"/></button>
                            <button onClick={() => setViewMode('table')} className={`px-3 py-1 rounded-md text-sm font-semibold transition-colors ${viewMode === 'table' ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'}`}><TableCellsIcon className="w-5 h-5"/></button>
                        </div>
                        <button className="bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 font-semibold py-2 px-4 rounded-lg flex items-center gap-2"><UserGroupIcon className="w-5 h-5"/>{t('units.debtor')}</button>
                        <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2"><CalendarPlusIcon className="w-5 h-5"/>{t('units.addReservation')}</button>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">{t('units.cleaningStatus')}:</span>
                     {statusFilters.map(filter => (
                        <button key={filter.value} onClick={() => setActiveStatusFilter(filter.value)} className={`px-3 py-1 rounded-full font-medium ${activeStatusFilter === filter.value ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                            {filter.label} ({filter.count})
                        </button>
                    ))}
                    <span className="font-semibold text-slate-600 dark:text-slate-300">{t('units.type')}:</span>
                    <button onClick={() => setActiveTypeFilter('all')} className={`px-3 py-1 rounded-full font-medium ${activeTypeFilter === 'all' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                        {t('units.all')}
                    </button>
                     {unitTypes.map(type => (
                        <button key={type} onClick={() => setActiveTypeFilter(type)} className={`px-3 py-1 rounded-full font-medium ${activeTypeFilter === type ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div>
                {viewMode === 'network' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredUnits.map(unit => (
                            <UnitCard 
                                key={unit.id} 
                                unit={unit} 
                                onEdit={handleEditUnit}
                                onStatusChange={handleUnitStatusChange}
                            />
                        ))}
                    </div>
                ) : (
                    <UnitsTable units={filteredUnits} onEdit={handleEditUnit} onDelete={handleDeleteUnit} />
                )}
            </div>
            
            <UnitEditPanel unit={selectedUnit} isOpen={isEditPanelOpen} onClose={handleClosePanel} onSave={handleSaveUnit} />
        </div>
    );
};

export default UnitsPage;