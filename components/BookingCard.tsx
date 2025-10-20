import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Booking, BookingStatus } from '../types';

// Icons
import PencilSquareIcon from './icons-redesign/PencilSquareIcon';
import TrashIcon from './icons-redesign/TrashIcon';
import CalendarDaysIcon from './icons-redesign/CalendarDaysIcon';
import UserIcon from './icons-redesign/UserIcon';
import BuildingOfficeIcon from './icons-redesign/BuildingOfficeIcon';

interface BookingCardProps {
    booking: Booking;
    onViewClick: () => void;
    onEditClick: () => void;
    onDeleteClick: () => void;
}

const statusConfig: Record<BookingStatus, { labelKey: string, className: string, borderColor: string }> = {
    'check-in': { 
        labelKey: 'bookings.status_check_in', 
        className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        borderColor: 'border-green-500',
    },
    'check-out': { 
        labelKey: 'bookings.status_check_out', 
        className: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
        borderColor: 'border-slate-500',
    }
};

const BookingCard: React.FC<BookingCardProps> = ({ booking, onViewClick, onEditClick, onDeleteClick }) => {
    const { t, language } = useContext(LanguageContext);
    
    const config = statusConfig[booking.status];
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { day: '2-digit', month: 'short' });

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
                    <p className="font-bold text-lg text-slate-800 dark:text-slate-200">{booking.bookingNumber}</p>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${config.className}`}>
                        {t(config.labelKey as any)}
                    </span>
                </div>
            </div>

            {/* Body */}
            <div className="px-4 pb-4 space-y-3 text-sm flex-grow">
                 <div className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">{booking.guestName}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <BuildingOfficeIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-slate-400">{booking.unitName}</span>
                </div>
                <div className="flex items-center gap-2 border-t dark:border-slate-700 pt-3">
                     <CalendarDaysIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />
                     <span className="font-medium text-slate-600 dark:text-slate-300">
                        {formatDate(booking.checkInDate)}
                     </span>
                     <span className="text-slate-400">-</span>
                      <span className="font-medium text-slate-600 dark:text-slate-300">
                        {formatDate(booking.checkOutDate)}
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
                    <span className="font-medium text-slate-500 dark:text-slate-400">{t('bookings.th_balance')}</span>
                    <p className={`font-bold font-mono ${booking.balance < 0 ? 'text-red-500' : 'text-green-500'}`}>{booking.balance.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
};

export default BookingCard;
