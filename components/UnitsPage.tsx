import React, { useState, useEffect, useRef, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import UnitStatusCard from './UnitStatusCard';
import UnitCard from './UnitCard';
import UnitEditPanel from './UnitEditPanel';
// FIX: Import UnitStatus to be used for explicit typing.
import { Unit, UnitStatus } from '../types';

// Icons
import BuildingOfficeIcon from './icons-redesign/BuildingOfficeIcon';
import UserGroupIcon from './icons-redesign/UserGroupIcon';
import ArrowLeftOnRectangleIcon from './icons-redesign/ArrowLeftOnRectangleIcon';
import UserCheckIcon from './icons-redesign/UserCheckIcon';
import WrenchScrewdriverIcon from './icons-redesign/WrenchScrewdriverIcon';
import PlusCircleIcon from './icons-redesign/PlusCircleIcon';
import ArrowDownTrayIcon from './icons-redesign/ArrowDownTrayIcon';
import Squares2x2Icon from './icons-redesign/Squares2x2Icon';
import TableCellsIcon from './icons-redesign/TableCellsIcon';
import ArrowsPointingOutIcon from './icons-redesign/ArrowsPointingOutIcon';
import ChevronLeftIcon from './icons-redesign/ChevronLeftIcon';
import ChevronRightIcon from './icons-redesign/ChevronRightIcon';
import MagnifyingGlassIcon from './icons-redesign/MagnifyingGlassIcon';
import CheckIcon from './icons-redesign/CheckIcon';

type CleaningFilter = 'all' | 'clean' | 'not-clean';

const initialUnitsData: Unit[] = [
    { id: '1', unitNumber: '101', unitName: '101A', status: 'free', unitType: 'غرفة مفردة', cleaningStatus: 'not-clean', price: 100.00, isAvailable: true, floor: 1, rooms: 1, bathrooms: 1, beds: 1, doubleBeds: 0, wardrobes: 1, tvs: 1, coolingType: 'split', notes: '', features: { common: { roomCleaning: true, elevator: true, parking: true, internet: false }, special: { kitchen: true, lounge: false, diningTable: false, refrigerator: true, iron: true, restaurantMenu: true, washingMachine: false, qibla: true, microwave: true, newspaper: false, oven: false, phoneDirectory: true } } },
    { id: '100', unitNumber: '101', status: 'not-checked-in', unitType: 'جناح', cleaningStatus: 'not-clean', customerName: 'عبد الله سلمان صالح الحريصي', checkIn: '2025-10-09', checkOut: '2025-11-08', isAvailable: true, floor: 1, rooms: 2, bathrooms: 1, beds: 2, doubleBeds: 1, wardrobes: 2, tvs: 2, coolingType: 'central', notes: 'VIP Guest', features: { common: { roomCleaning: true, elevator: true, parking: true, internet: true }, special: { kitchen: true, lounge: true, diningTable: true, refrigerator: true, iron: true, restaurantMenu: true, washingMachine: true, qibla: true, microwave: true, newspaper: true, oven: true, phoneDirectory: true } } },
    { id: '3', unitNumber: '101', status: 'occupied', unitType: 'غرفة مفردة', cleaningStatus: 'clean', customerName: 'محمد', checkIn: '2025-10-07', checkOut: '2025-11-06', remaining: 150.00, isAvailable: true, floor: 1, rooms: 1, bathrooms: 1, beds: 1, doubleBeds: 0, wardrobes: 1, tvs: 1, coolingType: 'window', notes: '', features: { common: { roomCleaning: true, elevator: true, parking: true, internet: true }, special: { kitchen: false, lounge: false, diningTable: false, refrigerator: true, iron: false, restaurantMenu: true, washingMachine: false, qibla: true, microwave: false, newspaper: false, oven: false, phoneDirectory: true } } },
    { id: '4', unitNumber: '102', status: 'not-checked-in', unitType: 'غرفة مفردة', cleaningStatus: 'not-clean', customerName: 'تامر بن ناصر بن صالح ال عباس', checkIn: '2025-10-01', checkOut: '2025-10-31', isAvailable: true, floor: 1, rooms: 1, bathrooms: 1, beds: 1, doubleBeds: 0, wardrobes: 1, tvs: 1, coolingType: 'split', notes: '', features: { common: { roomCleaning: true, elevator: true, parking: true, internet: false }, special: { kitchen: true, lounge: false, diningTable: false, refrigerator: true, iron: true, restaurantMenu: true, washingMachine: false, qibla: true, microwave: true, newspaper: false, oven: false, phoneDirectory: true } } },
    { id: '5', unitNumber: '103', status: 'free', unitType: 'جناح', cleaningStatus: 'clean', price: 120.00, isAvailable: true, floor: 1, rooms: 2, bathrooms: 2, beds: 3, doubleBeds: 1, wardrobes: 2, tvs: 1, coolingType: 'central', notes: '', features: { common: { roomCleaning: true, elevator: true, parking: true, internet: true }, special: { kitchen: true, lounge: true, diningTable: true, refrigerator: true, iron: true, restaurantMenu: true, washingMachine: true, qibla: true, microwave: true, newspaper: true, oven: true, phoneDirectory: true } } },
    { id: '6', unitNumber: '201', status: 'occupied', unitType: 'جناح', cleaningStatus: 'not-clean', customerName: 'علي أحمد', checkIn: '2025-10-15', checkOut: '2025-10-20', remaining: 0, isAvailable: true, floor: 2, rooms: 2, bathrooms: 1, beds: 2, doubleBeds: 0, wardrobes: 2, tvs: 2, coolingType: 'central', notes: '', features: { common: { roomCleaning: true, elevator: true, parking: true, internet: true }, special: { kitchen: true, lounge: true, diningTable: true, refrigerator: true, iron: true, restaurantMenu: true, washingMachine: true, qibla: true, microwave: true, newspaper: true, oven: true, phoneDirectory: true } } },
    { id: '2', unitNumber: '202', status: 'free', unitType: 'غرفة مزدوجة', cleaningStatus: 'clean', price: 150.00, isAvailable: true, floor: 2, rooms: 1, bathrooms: 1, beds: 2, doubleBeds: 0, wardrobes: 1, tvs: 1, coolingType: 'split', notes: '', features: { common: { roomCleaning: true, elevator: true, parking: true, internet: true }, special: { kitchen: true, lounge: false, diningTable: false, refrigerator: true, iron: true, restaurantMenu: true, washingMachine: true, qibla: true, microwave: true, newspaper: false, oven: false, phoneDirectory: true } } },
    { id: '7', unitNumber: '301', status: 'out-of-service', unitType: 'غرفة مفردة', cleaningStatus: 'not-clean', isAvailable: false, floor: 3, rooms: 1, bathrooms: 1, beds: 1, doubleBeds: 0, wardrobes: 1, tvs: 0, coolingType: 'window', notes: 'AC requires maintenance.', features: { common: { roomCleaning: false, elevator: true, parking: true, internet: false }, special: { kitchen: false, lounge: false, diningTable: false, refrigerator: false, iron: false, restaurantMenu: false, washingMachine: false, qibla: true, microwave: false, newspaper: false, oven: false, phoneDirectory: false } } },
];


const UnitsPage: React.FC = () => {
    const { t, language } = useContext(LanguageContext);
    
    const [unitsData, setUnitsData] = useState<Unit[]>(initialUnitsData);
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
    const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);

    const [cleaningFilter, setCleaningFilter] = useState<CleaningFilter>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [isCleaningMenuOpen, setCleaningMenuOpen] = useState(false);
    const [isTypeMenuOpen, setTypeMenuOpen] = useState(false);
    
    const cleaningMenuRef = useRef<HTMLDivElement>(null);
    const typeMenuRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (cleaningMenuRef.current && !cleaningMenuRef.current.contains(event.target as Node)) {
                setCleaningMenuOpen(false);
            }
            if (typeMenuRef.current && !typeMenuRef.current.contains(event.target as Node)) {
                setTypeMenuOpen(false);
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
    };

    const handleClosePanel = () => {
        setIsEditPanelOpen(false);
        setSelectedUnit(null);
    };

    const handleSaveUnit = (updatedUnit: Unit) => {
        const newUnits = unitsData.map(unit => {
            if (unit.id === updatedUnit.id) {
                // FIX: Explicitly define the type of `status` as UnitStatus and correct the logic
                // to handle transitions from 'out-of-service' to 'free' when a unit becomes available,
                // while otherwise respecting the status from the updated unit data. This resolves the type error.
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

    const statusData = [
        { labelKey: 'units.free', value: unitsData.filter(u => u.status === 'free').length, icon: BuildingOfficeIcon, color: 'text-green-500', iconBg: 'bg-green-100 dark:bg-green-500/10' },
        { labelKey: 'units.occupied', value: unitsData.filter(u => u.status === 'occupied').length, icon: UserGroupIcon, color: 'text-red-500', iconBg: 'bg-red-100 dark:bg-red-500/10' },
        { labelKey: 'units.checkOutToday', value: 0, icon: ArrowLeftOnRectangleIcon, color: 'text-orange-500', iconBg: 'bg-orange-100 dark:bg-orange-500/10' },
        { labelKey: 'units.checkInToday', value: 0, icon: BuildingOfficeIcon, color: 'text-cyan-500', iconBg: 'bg-cyan-100 dark:bg-cyan-500/10' },
        { labelKey: 'units.notCheckedIn', value: unitsData.filter(u => u.status === 'not-checked-in').length, icon: UserCheckIcon, color: 'text-purple-500', iconBg: 'bg-purple-100 dark:bg-purple-500/10' },
        { labelKey: 'units.outOfService', value: unitsData.filter(u => u.status === 'out-of-service').length, icon: WrenchScrewdriverIcon, color: 'text-slate-500', iconBg: 'bg-slate-200 dark:bg-slate-700' },
    ];


    const cleaningFilterOptions: { value: CleaningFilter; labelKey: 'units.all' | 'units.clean' | 'units.notClean' }[] = [
        { value: 'all', labelKey: 'units.all' },
        { value: 'clean', labelKey: 'units.clean' },
        { value: 'not-clean', labelKey: 'units.notClean' },
    ];
    
    const uniqueUnitTypes: string[] = ['all', ...Array.from(new Set(unitsData.map(u => u.unitType).filter((t): t is string => !!t)))];

    const typeFilterOptions = uniqueUnitTypes.map(type => {
        if (type === 'all') return { value: 'all', label: t('units.all') };
        if (type === 'غرفة مفردة') return { value: type, label: t('units.singleRoom')};
        // FIX: Removed 'as any' from the translation key, which was causing a type inference issue.
        if (type === 'غرفة مزدوجة') return { value: type, label: t('units.doubleRoom') };
        if (type === 'جناح') return { value: type, label: t('units.suite')};
        return { value: type, label: type };
    });

    const filteredUnits = unitsData.filter(unit => {
        const cleaningMatch = cleaningFilter === 'all' || unit.cleaningStatus === cleaningFilter;
        const typeMatch = typeFilter === 'all' || unit.unitType === typeFilter;
        return cleaningMatch && typeMatch;
    });

    const dropdownPositionClass = language === 'ar' ? 'left-0' : 'right-0';

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {statusData.map(item => (
                    <UnitStatusCard
                        key={item.labelKey}
                        label={t(item.labelKey as any)}
                        value={item.value}
                        icon={item.icon}
                        color={item.color}
                        iconBg={item.iconBg}
                    />
                ))}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 space-y-4">
                 <div className="flex flex-wrap items-center justify-between gap-4">
                     <div className="flex items-center gap-2">
                        <button className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500">
                             <ChevronLeftIcon className={`w-5 h-5 transform ${language === 'en' ? 'rotate-180': ''}`} />
                        </button>
                        <button className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500">
                             <ChevronRightIcon className={`w-5 h-5 transform ${language === 'ar' ? 'rotate-180': ''}`} />
                        </button>
                     </div>
                     <div className="flex flex-wrap items-center gap-2">
                         <div className="relative" ref={cleaningMenuRef}>
                             <button 
                                 onClick={() => setCleaningMenuOpen(!isCleaningMenuOpen)}
                                 className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/50 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600">
                                 <PlusCircleIcon className="w-5 h-5" />
                                 <span>{t('units.cleaningStatus')}</span>
                             </button>
                             {isCleaningMenuOpen && (
                                <div className={`absolute top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-10 ${dropdownPositionClass}`}>
                                    <div className="p-2">
                                        {cleaningFilterOptions.map(opt => (
                                            <button 
                                                key={opt.value}
                                                onClick={() => { setCleaningFilter(opt.value); setCleaningMenuOpen(false); }}
                                                className={`w-full text-sm flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 ${cleaningFilter === opt.value ? 'font-semibold text-blue-600' : 'text-slate-700 dark:text-slate-200'}`}
                                            >
                                                <span>{t(opt.labelKey)}</span>
                                                {cleaningFilter === opt.value && <CheckIcon className="w-4 h-4 text-blue-600" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                             )}
                         </div>
                         <div className="relative" ref={typeMenuRef}>
                             <button 
                                 onClick={() => setTypeMenuOpen(!isTypeMenuOpen)}
                                 className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/50 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600">
                                 <PlusCircleIcon className="w-5 h-5" />
                                 <span>{t('units.type')}</span>
                             </button>
                             {isTypeMenuOpen && (
                                <div className={`absolute top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-10 ${dropdownPositionClass}`}>
                                    <div className="p-2 max-h-60 overflow-y-auto">
                                        {typeFilterOptions.map(opt => (
                                            <button 
                                                key={opt.value}
                                                onClick={() => { setTypeFilter(opt.value); setTypeMenuOpen(false); }}
                                                className={`w-full text-sm flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 ${typeFilter === opt.value ? 'font-semibold text-blue-600' : 'text-slate-700 dark:text-slate-200'}`}
                                            >
                                                <span>{opt.label}</span>
                                                {typeFilter === opt.value && <CheckIcon className="w-4 h-4 text-blue-600" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                             )}
                         </div>
                     </div>
                     <div className="relative flex-grow sm:flex-grow-0 sm:w-auto md:max-w-xs">
                         <input type="text" placeholder={t('units.searchPlaceholder')} className={`w-full py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm ${language === 'ar' ? 'pr-10' : 'pl-10'}`} />
                         <MagnifyingGlassIcon className={`w-5 h-5 absolute top-1/2 -translate-y-1/2 text-slate-400 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
                     </div>
                     <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
                         <span>{t('units.export')}</span>
                         <ArrowDownTrayIcon className="w-5 h-5" />
                     </button>
                 </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900/70 rounded-lg">
                        <button className="px-4 py-1.5 text-sm font-semibold text-white bg-blue-500 rounded-md shadow flex items-center gap-2">
                           <Squares2x2Icon className="w-5 h-5" /> {t('units.network')}
                        </button>
                        <button className="px-4 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 rounded-md flex items-center gap-2">
                           <TableCellsIcon className="w-5 h-5" /> {t('units.table')}
                        </button>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-500 dark:text-slate-400">{t('units.debtor')}</span>
                             <span className="font-bold text-red-500 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                93,277.00
                            </span>
                        </div>
                         <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-500 dark:text-slate-400">{t('units.creditor')}</span>
                             <span className="font-bold text-green-500 flex items-center gap-1">
                                 <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                3,349.00
                            </span>
                        </div>
                    </div>
                    
                    <button className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500">
                        <ArrowsPointingOutIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredUnits.map((unit) => (
                    <UnitCard key={unit.id} unit={unit} onClick={() => handleUnitClick(unit)} />
                ))}
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