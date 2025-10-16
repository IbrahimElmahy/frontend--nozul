import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

// Icons
import BuildingOfficeIcon from './icons-redesign/BuildingOfficeIcon';
import UserGroupIcon from './icons-redesign/UserGroupIcon';
import UserCheckIcon from './icons-redesign/UserCheckIcon';
import UserIcon from './icons-redesign/UserIcon';
import CalendarPlusIcon from './icons-redesign/CalendarPlusIcon';
import EllipsisVerticalIcon from './icons-redesign/EllipsisVerticalIcon';
import CurrencySaudiRiyalIcon from './icons-redesign/CurrencySaudiRiyalIcon';


type Status = 'free' | 'occupied' | 'not-checked-in';
type CleaningStatus = 'clean' | 'not-clean';

interface UnitCardProps {
    status: Status;
    cleaningStatus: CleaningStatus;
    unitNumber: string;
    unitId?: string;
    unitType?: string;
    customerName?: string;
    checkIn?: string;
    checkOut?: string;
    price?: number;
    remaining?: number;
}

const statusConfig = {
    free: {
        labelKey: 'units.free',
        Icon: BuildingOfficeIcon,
        color: 'green',
        textColor: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-100 dark:bg-green-500/10',
        borderColor: 'border-green-500',
    },
    occupied: {
        labelKey: 'units.occupied',
        Icon: UserGroupIcon,
        color: 'red',
        textColor: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-100 dark:bg-red-500/10',
        borderColor: 'border-red-500',
    },
    'not-checked-in': {
        labelKey: 'units.notCheckedIn',
        Icon: UserCheckIcon,
        color: 'purple',
        textColor: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-100 dark:bg-purple-500/10',
        borderColor: 'border-purple-500',
    },
};

const cleaningStatusConfig = {
    clean: {
        labelKey: 'units.clean',
        textColor: 'text-green-700',
        bgColor: 'bg-green-200/80',
    },
    'not-clean': {
        labelKey: 'units.notClean',
        textColor: 'text-red-700',
        bgColor: 'bg-red-200/80',
    }
}


const UnitCard: React.FC<UnitCardProps> = ({
    status,
    cleaningStatus,
    unitNumber,
    unitId,
    unitType,
    customerName,
    checkIn,
    checkOut,
    price,
    remaining,
}) => {
    const { t } = useContext(LanguageContext);
    const config = statusConfig[status];
    const cleanConfig = cleaningStatusConfig[cleaningStatus];

    return (
        <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border-t-4 ${config.borderColor} flex flex-col`}>
            <div className="p-4 flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <div className="text-left">
                        {unitType && <p className="font-bold text-blue-500 text-sm">{unitType}</p>}
                        <div className="flex items-end gap-2">
                            <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{unitNumber}</p>
                            {unitId && <p className="text-xl font-bold text-slate-500 dark:text-slate-400">{unitId}</p>}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                         <span className={`px-2 py-1 text-xs font-semibold rounded-md ${cleanConfig.textColor} ${cleanConfig.bgColor}`}>
                            {t(cleanConfig.labelKey as any)}
                        </span>
                    </div>
                </div>
                
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold ${config.textColor} ${config.bgColor} mb-4`}>
                    <config.Icon className="w-5 h-5" />
                    <span>{t(config.labelKey as any)}</span>
                </div>
                
                {status === 'free' && (
                     <button className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold text-green-600 bg-green-100/80 rounded-lg hover:bg-green-200/80 transition-colors">
                        <CalendarPlusIcon className="w-5 h-5" />
                        <span>{t('units.addReservation')}</span>
                    </button>
                )}

                {(status === 'occupied' || status === 'not-checked-in') && (
                    <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                            <UserIcon className="w-5 h-5 text-slate-400" />
                            <span className="font-medium">{customerName}</span>
                        </div>
                         <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-500 dark:text-slate-400">{t('units.checkIn')}</span>
                            <span>{checkIn}</span>
                        </div>
                         <div className="flex items-center gap-2">
                             <span className="font-semibold text-slate-500 dark:text-slate-400">{t('units.checkOut')}</span>
                            <span>{checkOut}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="border-t dark:border-slate-700 p-3 flex justify-between items-center text-sm">
                {status === 'free' && price && (
                    <div className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-200">
                        <CurrencySaudiRiyalIcon className="w-5 h-5 text-slate-500" />
                        <span>{price.toFixed(2)}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('units.night')}</span>
                    </div>
                )}
                {status === 'occupied' && remaining !== undefined && (
                     <div className="flex items-center gap-1 text-sm">
                        <span className="font-medium text-slate-500 dark:text-slate-400">{t('units.remainingForHim')}</span>
                        <span className="font-bold text-green-600 dark:text-green-400">{remaining.toFixed(2)}</span>
                    </div>
                )}
                 <button className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                    <EllipsisVerticalIcon className="w-5 h-5"/>
                </button>
            </div>
        </div>
    );
};

export default UnitCard;
