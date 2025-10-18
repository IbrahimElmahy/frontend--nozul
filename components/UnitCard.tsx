import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Unit } from '../types';

// Icons
import BuildingOfficeIcon from './icons-redesign/BuildingOfficeIcon';
import UserGroupIcon from './icons-redesign/UserGroupIcon';
import UserCheckIcon from './icons-redesign/UserCheckIcon';
import UserIcon from './icons-redesign/UserIcon';
import CalendarIcon from './icons-redesign/CalendarIcon';
import EllipsisVerticalIcon from './icons-redesign/EllipsisVerticalIcon';
import CurrencySaudiRiyalIcon from './icons-redesign/CurrencySaudiRiyalIcon';
import WrenchScrewdriverIcon from './icons-redesign/WrenchScrewdriverIcon';

interface UnitCardProps {
    unit: Unit;
    onEditClick: () => void;
    onMenuClick: (event: React.MouseEvent) => void;
}

const statusConfig = {
    free: {
        labelKey: 'units.free',
        Icon: BuildingOfficeIcon,
        textColor: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-100 dark:bg-green-500/10',
        borderColor: 'border-green-500',
    },
    occupied: {
        labelKey: 'units.occupied',
        Icon: UserGroupIcon,
        textColor: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-100 dark:bg-red-500/10',
        borderColor: 'border-red-500',
    },
    'not-checked-in': {
        labelKey: 'units.notCheckedIn',
        Icon: UserCheckIcon,
        textColor: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-100 dark:bg-purple-500/10',
        borderColor: 'border-purple-500',
    },
    'out-of-service': {
        labelKey: 'units.outOfService',
        Icon: WrenchScrewdriverIcon,
        textColor: 'text-slate-600 dark:text-slate-400',
        bgColor: 'bg-slate-200 dark:bg-slate-700',
        borderColor: 'border-slate-500',
    },
};

const cleaningStatusConfig = {
    clean: {
        labelKey: 'units.clean',
        textColor: 'text-green-700 dark:text-green-300',
        bgColor: 'bg-green-200/80 dark:bg-green-500/20',
    },
    'not-clean': {
        labelKey: 'units.notClean',
        textColor: 'text-red-700 dark:text-red-300',
        bgColor: 'bg-red-200/80 dark:bg-red-500/20',
    }
}

const UnitCard: React.FC<UnitCardProps> = ({ unit, onEditClick, onMenuClick }) => {
    const { t } = useContext(LanguageContext);
    const { 
        status, 
        cleaningStatus, 
        unitNumber, 
        id, 
        unitType, 
        customerName, 
        checkIn, 
        checkOut, 
        price, 
        remaining 
    } = unit;
    
    const config = statusConfig[status];
    const cleanConfig = cleaningStatusConfig[cleaningStatus];

    return (
        <div 
            onClick={onEditClick}
            className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border-t-4 ${config.borderColor} flex flex-col h-full cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200`}
        >
            <div className="p-4 flex-grow">
                <div className="flex items-start justify-between mb-2">
                    <div className="text-start">
                        {unitType && <p className="font-bold text-blue-500 text-sm">{unitType}</p>}
                        <div className="flex items-end gap-2">
                            <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{unitNumber}</p>
                            {id && <p className="text-xl font-bold text-slate-500 dark:text-slate-400">{id}</p>}
                        </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-md ${cleanConfig.textColor} ${cleanConfig.bgColor}`}>
                        {t(cleanConfig.labelKey as any)}
                    </span>
                </div>
                
                <div className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold ${config.textColor} ${config.bgColor} mb-4`}>
                    <config.Icon className="w-5 h-5" />
                    <span>{t(config.labelKey as any)}</span>
                </div>
                
                {status === 'free' ? (
                     <button className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold text-green-600 bg-green-100/80 rounded-lg hover:bg-green-200/80 transition-colors dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/20 pointer-events-none">
                        <CalendarIcon className="w-5 h-5" />
                        <span>{t('units.addReservation')}</span>
                    </button>
                ) : status !== 'out-of-service' ? (
                    <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                        <div className="flex items-center justify-start gap-2">
                            <UserIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />
                            <span className="font-medium truncate">{customerName}</span>
                        </div>
                         <div className="flex items-center justify-start gap-2">
                            <span className="font-semibold text-slate-500 dark:text-slate-400">{t('units.checkIn')}</span>
                            <span>{checkIn}</span>
                        </div>
                         <div className="flex items-center justify-start gap-2">
                            <span className="font-semibold text-slate-500 dark:text-slate-400">{t('units.checkOut')}</span>
                            <span>{checkOut}</span>
                        </div>
                    </div>
                ) : null}
            </div>

            <div className="border-t dark:border-slate-700 p-3 flex items-center justify-between text-sm">
                <div>
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
                </div>
                <button className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 z-10" onClick={onMenuClick}>
                    <EllipsisVerticalIcon className="w-5 h-5"/>
                </button>
            </div>
        </div>
    );
};

export default UnitCard;