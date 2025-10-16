import React, { useState, useRef, useEffect, useContext } from 'react';
import { Unit } from '../types';
import { LanguageContext } from '../contexts/LanguageContext';
import EllipsisVerticalIcon from './icons-redesign/EllipsisVerticalIcon';
import PencilSquareIcon from './icons-redesign/PencilSquareIcon';
import TrashIcon from './icons-redesign/TrashIcon';
import CurrencySaudiRiyalIcon from './icons-redesign/CurrencySaudiRiyalIcon';
import UserCheckIcon from './icons-redesign/UserCheckIcon';
import CheckIcon from './icons-redesign/CheckIcon';
import XMarkIcon from './icons-redesign/XMarkIcon';
import Switch from './Switch';

interface UnitCardProps {
    unit: Unit;
    onEdit: (unit: Unit) => void;
    onStatusChange: (unitId: string, isAvailable: boolean) => void;
}

const statusStyles: { [key: string]: { bg: string; text: string; ring: string; } } = {
    free: { bg: 'bg-teal-50 dark:bg-teal-500/10', text: 'text-teal-600 dark:text-teal-300', ring: 'ring-teal-500/20' },
    occupied: { bg: 'bg-rose-50 dark:bg-rose-500/10', text: 'text-rose-600 dark:text-rose-300', ring: 'ring-rose-500/20' },
    'not-checked-in': { bg: 'bg-sky-50 dark:bg-sky-500/10', text: 'text-sky-600 dark:text-sky-300', ring: 'ring-sky-500/20' },
    'out-of-service': { bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-600 dark:text-amber-300', ring: 'ring-amber-500/20' },
};

const UnitCard: React.FC<UnitCardProps> = ({ unit, onEdit, onStatusChange }) => {
    const { t, language } = useContext(LanguageContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentStatusStyle = statusStyles[unit.status] || statusStyles.free;
    const isRtl = language === 'ar';

    const getStatusText = (status: string) => {
        switch (status) {
            case 'free': return t('units.free');
            case 'occupied': return t('units.occupied');
            case 'not-checked-in': return t('units.notCheckedIn');
            case 'out-of-service': return t('units.outOfService');
            default: return status;
        }
    };

    return (
        <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 flex flex-col justify-between ring-1 ring-inset ${currentStatusStyle.ring} ${currentStatusStyle.bg}`}>
            <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <p className="font-bold text-lg text-slate-800 dark:text-slate-200">{unit.unitNumber}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{unit.unitType}</p>
                    </div>
                    <div className="flex items-center gap-2">
                         <Switch
                            id={`status-switch-${unit.id}`}
                            checked={unit.isAvailable}
                            onChange={(checked) => onStatusChange(unit.id, checked)}
                            disabled={unit.status === 'occupied' || unit.status === 'not-checked-in'}
                        />
                        <div className="relative" ref={menuRef}>
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700">
                                <EllipsisVerticalIcon className="w-5 h-5" />
                            </button>
                            {isMenuOpen && (
                                <div className={`absolute top-full mt-1 w-40 bg-white dark:bg-slate-900 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10 ${isRtl ? 'left-0' : 'right-0'}`}>
                                    <button onClick={() => { onEdit(unit); setIsMenuOpen(false); }} className="w-full flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                                        <PencilSquareIcon className={`w-4 h-4 ${isRtl ? 'ml-2' : 'mr-2'}`} />
                                        <span>{t('units.editUnit')}</span>
                                    </button>
                                    <button className="w-full flex items-center px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10">
                                        <TrashIcon className={`w-4 h-4 ${isRtl ? 'ml-2' : 'mr-2'}`} />
                                        <span>{t('units.cancel')}</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Status and Customer Info */}
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${currentStatusStyle.bg} ${currentStatusStyle.text} mb-4 self-start`}>
                    {getStatusText(unit.status)}
                </div>
                {unit.customerName && (
                    <div className="mb-4 space-y-3">
                        {/* Customer Name */}
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                             <UserCheckIcon className="w-5 h-5 text-slate-400 flex-shrink-0"/>
                             <span className="font-semibold text-base truncate">{unit.customerName}</span>
                        </div>
                        {/* Dates in two columns */}
                        <div className="grid grid-cols-2 gap-x-4 text-xs text-slate-500 dark:text-slate-400">
                            <div className={isRtl ? 'text-right' : 'text-left'}>
                                <p className="font-medium">{t('units.checkIn')}</p>
                                <p className="font-mono">{unit.checkIn}</p>
                            </div>
                            <div className={isRtl ? 'text-right' : 'text-left'}>
                                <p className="font-medium">{t('units.checkOut')}</p>
                                <p className="font-mono">{unit.checkOut}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="border-t dark:border-slate-700 pt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {unit.cleaningStatus === 'clean' ? (
                        <CheckIcon className="w-5 h-5 text-teal-500" />
                    ) : (
                        <XMarkIcon className="w-5 h-5 text-amber-500" />
                    )}
                    <span className={`text-sm font-medium ${unit.cleaningStatus === 'clean' ? 'text-teal-600 dark:text-teal-400' : 'text-amber-600 dark:text-amber-400'}`}>
                        {t(`units.${unit.cleaningStatus}`)}
                    </span>
                </div>
                {unit.price && (
                    <div className="flex items-center gap-1 text-slate-800 dark:text-slate-200">
                        <CurrencySaudiRiyalIcon className="w-5 h-5"/>
                        <span className="font-bold">{unit.price}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{t('units.night')}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UnitCard;