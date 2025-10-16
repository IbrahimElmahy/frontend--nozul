import React, { useState, useEffect, useRef, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import UnitStatusCard from './UnitStatusCard';
import UnitCard from './UnitCard';
import { UnitCardProps } from './UnitCard';

// Icons
import BuildingOfficeIcon from './icons-redesign/BuildingOfficeIcon';
import UserGroupIcon from './icons-redesign/UserGroupIcon';
import ArrowRightStartOnRectangleIcon from './icons-redesign/ArrowRightStartOnRectangleIcon';
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

const UnitsPage: React.FC = () => {
    const { t, language } = useContext(LanguageContext);
    
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

    const statusData = [
        { labelKey: 'units.free', value: 16, icon: BuildingOfficeIcon, color: 'text-green-500', iconBg: 'bg-green-100 dark:bg-green-500/10' },
        { labelKey: 'units.occupied', value: 2, icon: UserGroupIcon, color: 'text-red-500', iconBg: 'bg-red-100 dark:bg-red-500/10' },
        { labelKey: 'units.checkOutToday', value: 0, icon: ArrowRightStartOnRectangleIcon, color: 'text-orange-500', iconBg: 'bg-orange-100 dark:bg-orange-500/10' },
        { labelKey: 'units.checkInToday', value: 0, icon: BuildingOfficeIcon, color: 'text-cyan-500', iconBg: 'bg-cyan-100 dark:bg-cyan-500/10' },
        { labelKey: 'units.notCheckedIn', value: 4, icon: UserCheckIcon, color: 'text-purple-500', iconBg: 'bg-purple-100 dark:bg-purple-500/10' },
        { labelKey: 'units.outOfService', value: 3, icon: WrenchScrewdriverIcon, color: 'text-slate-500', iconBg: 'bg-slate-200 dark:bg-slate-700' },
    ];

    const unitsData: UnitCardProps[] = [
        { status: 'free', unitNumber: '101', unitId: '1', unitType: 'غرفة مفردة', cleaningStatus: 'not-clean', price: 100.00 },
        { status: 'not-checked-in', unitNumber: '101', unitId: '100', unitType: 'جناح', cleaningStatus: 'not-clean', customerName: 'عبد الله سلمان صالح الحريصي', checkIn: '2025-10-09', checkOut: '2025-11-08' },
        { status: 'occupied', unitNumber: '101', unitType: 'غرفة مفردة', cleaningStatus: 'clean', customerName: 'محمد', checkIn: '2025-10-07', checkOut: '2025-11-06', remaining: 150.00 },
        { status: 'not-checked-in', unitNumber: '102', unitType: 'غرفة مفردة', cleaningStatus: 'not-clean', customerName: 'تامر بن ناصر بن صالح ال عباس', checkIn: '2025-10-01', checkOut: '2025-10-31' },
        { status: 'free', unitNumber: '103', unitType: 'جناح', cleaningStatus: 'clean', price: 120.00 },
        { status: 'occupied', unitNumber: '201', unitType: 'جناح', cleaningStatus: 'not-clean', customerName: 'علي أحمد', checkIn: '2025-10-15', checkOut: '2025-10-20', remaining: 0 },
        { status: 'free', unitNumber: '202', unitId: '2', unitType: 'غرفة مزدوجة', cleaningStatus: 'clean', price: 150.00 },
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
        if (type === 'غرفة مزدوجة') return { value: type, label: t('units.doubleRoom')};
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
                {filteredUnits.map((unit, index) => (
                    <UnitCard key={index} {...unit} />
                ))}
            </div>
        </div>
    );
};

export default UnitsPage;
