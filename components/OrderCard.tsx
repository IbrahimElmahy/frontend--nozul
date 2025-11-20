
import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Order } from '../types';

// Icons
import PencilSquareIcon from './icons-redesign/PencilSquareIcon';
import TrashIcon from './icons-redesign/TrashIcon';
import BuildingOfficeIcon from './icons-redesign/BuildingOfficeIcon';
import BriefcaseIcon from './icons-redesign/BriefcaseIcon';
import CalendarDaysIcon from './icons-redesign/CalendarDaysIcon';

interface OrderCardProps {
    order: Order;
    onViewClick: () => void;
    onEditClick: () => void;
    onDeleteClick: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onViewClick, onEditClick, onDeleteClick }) => {
    const { t } = useContext(LanguageContext);
    
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });

    const handleActionClick = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        action();
    }

    return (
        <div 
            onClick={onViewClick}
            className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border-t-4 border-blue-500 flex flex-col h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer`}>
            {/* Header */}
            <div className="p-4 flex items-start justify-between">
                <div>
                    <p className="font-bold text-lg text-slate-800 dark:text-slate-200 truncate">{order.orderNumber}</p>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                        {t('orders.th_total')}: <span className="font-bold text-blue-500">{order.total.toFixed(2)}</span>
                    </span>
                </div>
            </div>

            {/* Body */}
            <div className="px-4 pb-4 space-y-3 text-sm flex-grow">
                 <div className="flex items-center gap-2">
                    <BriefcaseIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">{order.bookingNumber || 'No Reservation'}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <BuildingOfficeIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-slate-400">{order.apartmentName || '-'}</span>
                </div>
                <div className="flex items-center gap-2 border-t dark:border-slate-700 pt-3">
                     <CalendarDaysIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />
                     <span className="font-medium text-slate-600 dark:text-slate-300">
                        {formatDate(order.createdAt)}
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
            </div>
        </div>
    );
};

export default OrderCard;
