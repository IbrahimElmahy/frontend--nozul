import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import UnitStatusCard from './UnitStatusCard';
import UnitCard from './UnitCard';

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

// FIX: Define a specific type for unit data to ensure type compatibility with UnitCardProps.
type UnitDataItem = {
    status: 'free' | 'occupied' | 'not-checked-in';
    cleaningStatus: 'clean' | 'not-clean';
    unitNumber: string;
    unitId?: string;
    unitType?: string;
    customerName?: string;
    checkIn?: string;
    checkOut?: string;
    price?: number;
    remaining?: number;
};

const UnitsPage: React.FC = () => {
    const { t, language } = useContext(LanguageContext);
    
    const statusData = [
        { labelKey: 'units.free', value: 16, icon: BuildingOfficeIcon, color: 'text-green-500', iconBg: 'bg-green-100 dark:bg-green-500/10' },
        { labelKey: 'units.occupied', value: 2, icon: UserGroupIcon, color: 'text-red-500', iconBg: 'bg-red-100 dark:bg-red-500/10' },
        { labelKey: 'units.checkOutToday', value: 0, icon: ArrowRightStartOnRectangleIcon, color: 'text-orange-500', iconBg: 'bg-orange-100 dark:bg-orange-500/10' },
        { labelKey: 'units.checkInToday', value: 0, icon: BuildingOfficeIcon, color: 'text-cyan-500', iconBg: 'bg-cyan-100 dark:bg-cyan-500/10' },
        { labelKey: 'units.notCheckedIn', value: 4, icon: UserCheckIcon, color: 'text-purple-500', iconBg: 'bg-purple-100 dark:bg-purple-500/10' },
        { labelKey: 'units.outOfService', value: 3, icon: WrenchScrewdriverIcon, color: 'text-slate-500', iconBg: 'bg-slate-200 dark:bg-slate-700' },
    ];

    const unitsData: UnitDataItem[] = [
        { status: 'free', unitNumber: '101', unitId: '1', cleaningStatus: 'not-clean', price: 100.00 },
        { status: 'not-checked-in', unitNumber: '101', unitId: '100', cleaningStatus: 'not-clean', customerName: 'عبد الله سلمان صالح الحريصي', checkIn: '2025-10-09', checkOut: '2025-11-08' },
        { status: 'occupied', unitNumber: '101', unitType: 'غرفة مفردة', cleaningStatus: 'clean', customerName: 'محمد', checkIn: '2025-10-07', checkOut: '2025-11-06', remaining: 150.00 },
        { status: 'not-checked-in', unitNumber: '102', unitType: 'غرفة مفردة', cleaningStatus: 'not-clean', customerName: 'تامر بن ناصر بن صالح ال عباس', checkIn: '2025-10-01', checkOut: '2025-10-31' },
        { status: 'free', unitNumber: '103', unitType: 'غرفة مفردة', cleaningStatus: 'clean', price: 120.00 },
    ];

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
                             <ChevronRightIcon className={`w-5 h-5 transform ${language === 'en' ? 'rotate-180': ''}`} />
                        </button>
                     </div>
                     <div className="flex flex-wrap items-center gap-2">
                         <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600">
                             <PlusCircleIcon className="w-5 h-5" />
                             <span>{t('units.cleaningStatus')}</span>
                         </button>
                         <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600">
                             <PlusCircleIcon className="w-5 h-5" />
                             <span>{t('units.type')}</span>
                         </button>
                     </div>
                     <div className="relative flex-grow max-w-xs">
                         <input type="text" placeholder={t('units.searchPlaceholder')} className={`w-full py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${language === 'ar' ? 'pr-10' : 'pl-10'}`} />
                         <MagnifyingGlassIcon className={`w-5 h-5 absolute top-1/2 -translate-y-1/2 text-slate-400 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
                     </div>
                     <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
                         <span>{t('units.export')}</span>
                         <ArrowDownTrayIcon className="w-5 h-5" />
                     </button>
                 </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-700 rounded-lg">
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
                {unitsData.map((unit, index) => (
                    <UnitCard key={index} {...unit} />
                ))}
            </div>
        </div>
    );
};

export default UnitsPage;
