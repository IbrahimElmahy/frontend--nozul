import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Guest, GuestStatus } from '../types';

// Icons
import PencilSquareIcon from './icons-redesign/PencilSquareIcon';
import TrashIcon from './icons-redesign/TrashIcon';
import PhoneIcon from './icons-redesign/PhoneIcon';
import GlobeAltIcon from './icons-redesign/GlobeAltIcon';
import IdentificationIcon from './icons-redesign/IdentificationIcon';


interface GuestCardProps {
    guest: Guest;
    onViewClick: () => void;
    onEditClick: () => void;
    onDeleteClick: () => void;
}

const statusConfig: Record<GuestStatus, { labelKey: string, borderColor: string }> = {
    'active': { 
        labelKey: 'guests.status_active', 
        borderColor: 'border-green-500',
    },
    'inactive': { 
        labelKey: 'guests.status_inactive', 
        borderColor: 'border-red-500',
    }
};

const GuestCard: React.FC<GuestCardProps> = ({ guest, onViewClick, onEditClick, onDeleteClick }) => {
    const { t } = useContext(LanguageContext);
    
    const config = statusConfig[guest.status];

    const handleActionClick = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        action();
    }

    return (
        <div 
            onClick={onViewClick}
            className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border-t-4 ${config.borderColor} flex flex-col h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer`}>
            {/* Header */}
            <div className="p-4 flex items-start justify-between">
                <div>
                    <p className="font-bold text-lg text-slate-800 dark:text-slate-200 truncate">{guest.name}</p>
                    <span className="text-sm text-blue-500 font-medium">
                        {t(`guests.guestType_${guest.guestType}` as any)}
                    </span>
                </div>
            </div>

            {/* Body */}
            <div className="px-4 pb-4 space-y-3 text-sm flex-grow">
                 <div className="flex items-center gap-2">
                    <PhoneIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-slate-400" dir="ltr">{guest.mobileNumber}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <GlobeAltIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-slate-400">{guest.nationality}</span>
                </div>
                <div className="flex items-center gap-2 border-t dark:border-slate-700 pt-3">
                     <IdentificationIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />
                     <span className="font-medium text-slate-600 dark:text-slate-300">
                        {guest.idNumber}
                     </span>
                </div>
            </div>
            
            {/* Footer */}
            <div className="border-t dark:border-slate-700 p-3 flex items-center justify-between text-sm bg-slate-50 dark:bg-slate-800/50 rounded-b-xl">
                 <div className="flex items-center gap-2">
                    <button 
                        onClick={(e) => handleActionClick(e, onEditClick)}
                        className="p-1.5 rounded-full text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-500/10"
                        aria-label={t('bookings.edit')}
                    >
                        <PencilSquareIcon className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={(e) => handleActionClick(e, onDeleteClick)}
                        className="p-1.5 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10"
                        aria-label={t('bookings.delete')}
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
                 <div className="text-end">
                     <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${guest.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                        {t(config.labelKey as any)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default GuestCard;