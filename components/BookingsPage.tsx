import React, { useState, useMemo, useContext, useRef } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Booking, BookingStatus, RentType } from '../types';
import UnitStatusCard from './UnitStatusCard';
import AddBookingPanel from './AddBookingPanel';

// Icons
import PlusCircleIcon from './icons-redesign/PlusCircleIcon';
import MagnifyingGlassIcon from './icons-redesign/MagnifyingGlassIcon';
import ChevronLeftIcon from './icons-redesign/ChevronLeftIcon';
import ChevronRightIcon from './icons-redesign/ChevronRightIcon';
import EllipsisVerticalIcon from './icons-redesign/EllipsisVerticalIcon';
import QuestionMarkCircleIcon from './icons-redesign/QuestionMarkCircleIcon';
import ClipboardDocumentListIcon from './icons-redesign/ClipboardDocumentListIcon';
import ArrowRightOnRectangleIcon from './icons-redesign/ArrowRightOnRectangleIcon';
import ArrowLeftOnRectangleIcon from './icons-redesign/ArrowLeftOnRectangleIcon';
import CalendarDaysIcon from './icons-redesign/CalendarDaysIcon';
import BriefcaseIcon from './icons-redesign/BriefcaseIcon';

// FIX: Removed .map() call and ensured mock data aligns with the Booking type.
const mockBookings: Booking[] = [
    { id: 1, bookingNumber: '0000000200', guestName: 'حملة محمد', unitName: '870', checkInDate: '2025-10-08 00:00:00', checkOutDate: '2025-10-09 00:00:00', time: '13:56:54', status: 'check-in', rentType: 'daily', duration: 1, rent: 111, value: 111, discount: 0, subtotal: 111, tax: 14.48, total: 111, payments: 0.0, balance: -111.0, createdAt: '2025-10-08 13:56:54', updatedAt: '2025-10-08 13:56:54' },
    { id: 2, bookingNumber: '0000000199', guestName: 'حملة محمد', unitName: '1', checkInDate: '2025-10-07 00:00:00', checkOutDate: '2025-10-09 00:00:00', time: '13:47:59', status: 'check-out', rentType: 'daily', duration: 2, rent: 0, value: 0, discount: 0, subtotal: 0, tax: 0, total: 0, payments: 0.0, balance: 0.0, createdAt: '2025-10-07 13:47:59', updatedAt: '2025-10-07 13:49:33' },
    { id: 3, bookingNumber: '0000000198', guestName: 'حملة محمد', unitName: '2', checkInDate: '2025-09-26 00:00:00', checkOutDate: '2025-09-27 00:00:00', time: '23:20:39', status: 'check-out', rentType: 'daily', duration: 1, rent: 0, value: 0, discount: 0, subtotal: 0, tax: 0, total: 0, payments: 0.0, balance: 0.0, createdAt: '2025-09-26 23:20:39', updatedAt: '2025-10-07 13:50:08' },
    { id: 4, bookingNumber: '0000000197', guestName: 'فيصل الجهني', unitName: '2', checkInDate: '2025-08-28 00:00:00', checkOutDate: '2025-08-29 00:00:00', time: '12:11:27', status: 'check-out', rentType: 'daily', duration: 1, rent: 500, value: 500, discount: 0, subtotal: 500, tax: 65.22, total: 500, payments: 0.0, balance: -500.0, createdAt: '2025-08-28 12:11:27', updatedAt: '2025-08-28 12:12:51' },
    { id: 5, bookingNumber: '0000000196', guestName: 'حملة محمد', unitName: 'حملة محمد', checkInDate: '2025-08-23 00:00:00', checkOutDate: '2025-08-24 00:00:00', time: '19:33:30', status: 'check-in', rentType: 'daily', duration: 1, rent: 25000, value: 25000, discount: 0, subtotal: 25000, tax: 3260.86, total: 25000, payments: 8000.0, balance: -17000.0, createdAt: '2025-08-23 19:33:30', updatedAt: '2025-08-23 19:34:23' },
    { id: 6, bookingNumber: '0000000195', guestName: 'محمد سالم', unitName: 'شاع', checkInDate: '2025-08-23 00:00:00', checkOutDate: '2025-08-24 00:00:00', time: '18:53:30', status: 'check-in', rentType: 'daily', duration: 1, rent: 200, value: 200, discount: 0, subtotal: 200, tax: 26.09, total: 200, payments: 100.0, balance: -100.0, createdAt: '2025-08-23 18:53:30', updatedAt: '2025-08-23 19:21:09' },
    { id: 7, bookingNumber: '0000000194', guestName: 'محمد سالم', unitName: '1', checkInDate: '2025-08-23 00:00:00', checkOutDate: '2025-08-24 00:00:00', time: '16:38:39', status: 'check-out', rentType: 'daily', duration: 1, rent: 0, value: 0, discount: 0, subtotal: 0, tax: 0, total: 0, payments: 0.0, balance: 0.0, createdAt: '2025-08-23 16:38:39', updatedAt: '2025-08-23 16:43:55' },
    { id: 8, bookingNumber: '0000000193', guestName: 'محمد سالم', unitName: '2', checkInDate: '2025-08-23 00:00:00', checkOutDate: '2025-08-24 00:00:00', time: '16:37:32', status: 'check-out', rentType: 'daily', duration: 1, rent: 50, value: 50, discount: 0, subtotal: 50, tax: 6.53, total: 50, payments: 0.0, balance: -50.0, createdAt: '2025-08-23 16:37:32', updatedAt: '2025-08-23 16:37:55' },
    { id: 9, bookingNumber: '0000000192', guestName: 'محمد احمد', unitName: 'A111', checkInDate: '2025-08-23 00:00:00', checkOutDate: '2025-08-24 00:00:00', time: '16:30:13', status: 'check-out', rentType: 'daily', duration: 1, rent: 100, value: 100, discount: 0, subtotal: 100, tax: 13.04, total: 100, payments: 100.0, balance: 0.0, createdAt: '2025-08-23 16:30:13', updatedAt: '2025-08-23 16:32:36' },
    { id: 10, bookingNumber: '0000000191', guestName: 'احمد', unitName: '1', checkInDate: '2025-08-04 00:00:00', checkOutDate: '2025-08-05 00:00:00', time: '12:26:55', status: 'check-out', rentType: 'daily', duration: 1, rent: 0, value: 0, discount: 0, subtotal: 0, tax: 0, total: 0, payments: 0.0, balance: 0.0, createdAt: '2025-08-04 12:26:55', updatedAt: '2025-08-06 15:56:49' },
    { id: 11, bookingNumber: '0000000190', guestName: 'حنكش المصري', unitName: '2', checkInDate: '2025-07-30 00:00:00', checkOutDate: '2025-07-31 00:00:00', time: '17:59:27', status: 'check-out', rentType: 'daily', duration: 1, rent: 100, value: 100, discount: 0, subtotal: 100, tax: 13.04, total: 100, payments: 0.0, balance: -100.0, createdAt: '2025-07-30 17:59:27', updatedAt: '2025-08-06 15:56:38' },
    { id: 12, bookingNumber: '0000000189', guestName: 'حنكش المصري', unitName: 'شالية 1', checkInDate: '2025-07-30 00:00:00', checkOutDate: '2025-07-31 00:00:00', time: '02:06:16', status: 'check-out', rentType: 'daily', duration: 1, rent: 2000, value: 2000, discount: 0, subtotal: 2000, tax: 260.86, total: 2000, payments: 0.0, balance: -2000.0, createdAt: '2025-07-30 02:06:16', updatedAt: '2025-08-06 15:58:04' },
    { id: 13, bookingNumber: '0000000188', guestName: 'راشد عمر', unitName: '3', checkInDate: '2025-07-30 00:00:00', checkOutDate: '2025-07-31 00:00:00', time: '02:02:07', status: 'check-out', rentType: 'daily', duration: 1, rent: 1600, value: 1600, discount: 0, subtotal: 1600, tax: 208.7, total: 1600, payments: 0.0, balance: -1600.0, createdAt: '2025-07-30 02:02:07', updatedAt: '2025-08-06 15:57:00' },
    { id: 14, bookingNumber: '0000000187', guestName: 'نادر حواش', unitName: '6', checkInDate: '2025-07-29 00:00:00', checkOutDate: '2025-07-30 00:00:00', time: '15:51:57', status: 'check-out', rentType: 'daily', duration: 1, rent: 1400, value: 1400, discount: 0, subtotal: 1400, tax: 182.6, total: 1400, payments: 0.0, balance: -1400.0, createdAt: '2025-07-29 15:51:57', updatedAt: '2025-08-06 15:57:34' },
    { id: 15, bookingNumber: '0000000186', guestName: 'مختار المختار', unitName: 'ذوى الهمم', checkInDate: '2025-07-29 00:00:00', checkOutDate: '2025-07-30 00:00:00', time: '15:43:18', status: 'check-out', rentType: 'daily', duration: 1, rent: 750, value: 750, discount: 0, subtotal: 750, tax: 97.83, total: 750, payments: 0.0, balance: -750.0, createdAt: '2025-07-29 15:43:18', updatedAt: '2025-08-06 15:57:52' },
    { id: 16, bookingNumber: '0000000185', guestName: 'مشعل القرم', unitName: '3', checkInDate: '2025-07-29 00:00:00', checkOutDate: '2025-07-30 00:00:00', time: '15:24:27', status: 'check-out', rentType: 'daily', duration: 1, rent: 1400, value: 1400, discount: 0, subtotal: 1400, tax: 182.6, total: 1400, payments: 0.0, balance: -1400.0, createdAt: '2025-07-29 15:24:27', updatedAt: '2025-07-29 15:57:19' },
    { id: 17, bookingNumber: '0000000184', guestName: 'نايف القحطاني', unitName: '1', checkInDate: '2025-07-29 00:00:00', checkOutDate: '2025-07-30 00:00:00', time: '15:19:32', status: 'check-out', rentType: 'daily', duration: 1, rent: 400, value: 400, discount: 0, subtotal: 400, tax: 52.18, total: 400, payments: 0.0, balance: -400.0, createdAt: '2025-07-29 15:19:32', updatedAt: '2025-07-30 19:06:11' },
    { id: 18, bookingNumber: '0000000183', guestName: 'احمد مفلح البلوى', unitName: '870', checkInDate: '2025-06-28 00:00:00', checkOutDate: '2025-06-30 00:00:00', time: '10:17:05', status: 'check-out', rentType: 'daily', duration: 2, rent: 350, value: 700, discount: 0, subtotal: 700, tax: 45.66, total: 700, payments: 0.0, balance: -700.0, createdAt: '2025-06-28 10:17:05', updatedAt: '2025-06-28 10:19:12' },
    { id: 19, bookingNumber: '0000000182', guestName: 'محمد جعفر', unitName: 'ذوى الهمم', checkInDate: '2025-06-26 00:00:00', checkOutDate: '2025-06-27 00:00:00', time: '18:56:31', status: 'check-out', rentType: 'daily', duration: 1, rent: 250, value: 250, discount: 0, subtotal: 250, tax: 32.61, total: 250, payments: 250.0, balance: -12.0, createdAt: '2025-06-26 18:56:31', updatedAt: '2025-06-28 10:26:17' },
    { id: 20, bookingNumber: '0000000181', guestName: 'محمد المصري', unitName: '1', checkInDate: '2025-06-11 00:00:00', checkOutDate: '2025-06-12 00:00:00', time: '15:01:42', status: 'check-out', rentType: 'daily', duration: 1, rent: 100, value: 100, discount: 0, subtotal: 100, tax: 13.04, total: 100, payments: 0.0, balance: -100.0, createdAt: '2025-06-11 15:01:42', updatedAt: '2025-06-27 09:50:50' },
    { id: 21, bookingNumber: '0000000180', guestName: 'KHAMIDA NARZIEVA', unitName: '2', checkInDate: '2025-06-07 00:00:00', checkOutDate: '2025-06-21 00:00:00', time: '02:42:16', status: 'check-out', rentType: 'daily', duration: 14, rent: 199, value: 2786, discount: 0, subtotal: 2786, tax: 25.96, total: 2786, payments: 0.0, balance: -2788.0, createdAt: '2025-06-09 02:42:16', updatedAt: '2025-06-28 10:05:33' },
    { id: 22, bookingNumber: '0000000179', guestName: 'محمد المصري', unitName: 'A111', checkInDate: '2025-06-06 00:00:00', checkOutDate: '2025-06-06 00:00:00', time: '15:18:01', status: 'check-out', rentType: 'hourly', duration: 4, rent: 50, value: 200, discount: 0, subtotal: 200, tax: 6.53, total: 200, payments: 0.0, balance: -200.0, createdAt: '2025-06-07 15:18:01', updatedAt: '2025-06-07 15:18:23' },
    { id: 23, bookingNumber: '0000000177', guestName: 'المعز احمد سليمان احمد', unitName: '116', checkInDate: '2025-06-06 00:00:00', checkOutDate: '2025-06-07 00:00:00', time: '13:49:21', status: 'check-out', rentType: 'daily', duration: 1, rent: 150, value: 150, discount: 0, subtotal: 150, tax: 3.75, total: 150, payments: 150.0, balance: 0.0, createdAt: '2025-06-07 13:49:21', updatedAt: '2025-07-30 02:10:11' },
    { id: 24, bookingNumber: '0000000173', guestName: 'مريم', unitName: 'A213', checkInDate: '2025-06-01 00:00:00', checkOutDate: '2025-06-02 00:00:00', time: '11:03:29', status: 'check-out', rentType: 'daily', duration: 1, rent: 0, value: 0, discount: 0, subtotal: 0, tax: 0, total: 0, payments: 0.0, balance: -30.0, createdAt: '2025-06-01 11:03:29', updatedAt: '2025-06-01 11:10:54' },
];

// FIX: Update template to include all required fields and adjust type.
const newBookingTemplate: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt' | 'updatedAt'> = {
    guestName: '',
    unitName: '',
    checkInDate: new Date().toISOString().split('T')[0],
    checkOutDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
    time: new Date().toTimeString().slice(0, 5),
    status: 'check-in',
    rentType: 'daily',
    duration: 1,
    rent: 0,
    value: 0,
    discount: 0,
    subtotal: 0,
    total: 0,
    payments: 0,
    balance: 0,
    // New fields
    bookingSource: '',
    bookingReason: '',
    guestType: '',
    companions: 0,
    discountType: 'fixed',
    totalOrders: 0,
    notes: '',
    price: 0,
    receiptVoucher: '',
    returnVouchers: '',
    invoices: '',
    order: '',
};


const BookingsPage: React.FC = () => {
    const { t, language } = useContext(LanguageContext);
    const [bookings, setBookings] = useState<Booking[]>(mockBookings);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(50);
    const [activeActionMenu, setActiveActionMenu] = useState<number | null>(null);
    const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
    const actionMenuRef = useRef<HTMLDivElement>(null);

    const filteredBookings = useMemo(() => {
        return bookings.filter(booking => 
            booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [bookings, searchTerm]);
    
    const totalPages = itemsPerPage === Number.MAX_SAFE_INTEGER ? 1 : Math.ceil(filteredBookings.length / itemsPerPage);

    const paginatedBookings = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredBookings.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredBookings, currentPage, itemsPerPage]);

    const handleSaveNewBooking = (newBookingData: Omit<Booking, 'id'>) => {
        const newBooking: Booking = {
            ...newBookingData,
            id: Math.max(...bookings.map(b => b.id), 0) + 1,
        };
        setBookings(prev => [newBooking, ...prev]);
        setIsAddPanelOpen(false);
    };

    const statusConfig: Record<BookingStatus, { labelKey: string, className: string }> = {
        'check-in': { labelKey: 'bookings.status_check_in', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
        'check-out': { labelKey: 'bookings.status_check_out', className: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300' }
    };

    const tableHeaders = [
        { key: 'id', labelKey: 'bookings.th_id' },
        { key: 'bookingNumber', labelKey: 'bookings.th_bookingNumber' },
        { key: 'guestName', labelKey: 'bookings.th_guestName' },
        { key: 'unitName', labelKey: 'bookings.th_unitName' },
        { key: 'checkInDate', labelKey: 'bookings.th_checkInDate' },
        { key: 'checkOutDate', labelKey: 'bookings.th_checkOutDate' },
        { key: 'time', labelKey: 'bookings.th_time' },
        { key: 'status', labelKey: 'bookings.th_status' },
        { key: 'rentType', labelKey: 'bookings.th_rentType' },
        { key: 'duration', labelKey: 'bookings.th_duration' },
        { key: 'rent', labelKey: 'bookings.th_rent' },
        { key: 'value', labelKey: 'bookings.th_value' },
        { key: 'discount', labelKey: 'bookings.th_discount' },
        { key: 'subtotal', labelKey: 'bookings.th_subtotal' },
        { key: 'tax', labelKey: 'bookings.th_tax' },
        { key: 'total', labelKey: 'bookings.th_total' },
        { key: 'payments', labelKey: 'bookings.th_payments' },
        { key: 'balance', labelKey: 'bookings.th_balance' },
        { key: 'createdAt', labelKey: 'bookings.th_createdAt' },
        { key: 'updatedAt', labelKey: 'bookings.th_updatedAt' },
        { key: 'actions', labelKey: 'bookings.th_actions' },
    ];

    const statusCardsData = [
        { labelKey: 'bookings.unconfirmed', value: 2, Icon: QuestionMarkCircleIcon, iconBg: 'bg-yellow-500' },
        { labelKey: 'bookings.list', value: 3, Icon: ClipboardDocumentListIcon, iconBg: 'bg-sky-500' },
        { labelKey: 'bookings.readyForCheckIn', value: 192, Icon: ArrowRightOnRectangleIcon, iconBg: 'bg-green-500' },
        { labelKey: 'bookings.readyForCheckOut', value: 1, Icon: ArrowLeftOnRectangleIcon, iconBg: 'bg-orange-500' },
        { labelKey: 'bookings.upcoming', value: 0, Icon: CalendarDaysIcon, iconBg: 'bg-indigo-500' },
        { labelKey: 'bookings.allBookings', value: 335, Icon: BriefcaseIcon, iconBg: 'bg-slate-500' },
    ];


    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{t('bookings.manageBookings')}</h2>
                <button 
                    onClick={() => setIsAddPanelOpen(true)}
                    className="flex items-center gap-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    <PlusCircleIcon className="w-5 h-5" />
                    <span>{t('bookings.addBooking')}</span>
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {statusCardsData.map(card => <UnitStatusCard key={card.labelKey} label={t(card.labelKey as any)} value={card.value} icon={card.Icon} iconBg={card.iconBg} />)}
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <span>{t('units.showing')}</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            className="py-1 px-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                        <span>{t('units.entries')}</span>
                    </div>
                    <div className="relative w-full sm:w-auto sm:max-w-xs">
                        <MagnifyingGlassIcon className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t('bookings.searchPlaceholder')}
                            className={`w-full py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-200 ${language === 'ar' ? 'pr-10' : 'pl-10'}`}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                            <tr>
                                {tableHeaders.map(header => <th key={header.key} scope="col" className="px-6 py-3">{t(header.labelKey as any)}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedBookings.map(booking => (
                                <tr key={booking.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
                                    {tableHeaders.map(header => (
                                        <td key={`${booking.id}-${header.key}`} className="px-6 py-4">
                                            {header.key === 'actions' ? (
                                                <div className="relative">
                                                    <button className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600">
                                                        <EllipsisVerticalIcon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ) : header.key === 'status' ? (
                                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusConfig[booking.status].className}`}>
                                                    {t(statusConfig[booking.status].labelKey as any)}
                                                </span>
                                            ) : (
                                                <span className="text-slate-800 dark:text-slate-200 font-medium">
                                                    {(booking[header.key as keyof Booking] || '').toString()}
                                                </span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                        {`${t('units.showing')} ${filteredBookings.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} ${t('units.to')} ${Math.min(currentPage * itemsPerPage, filteredBookings.length)} ${t('units.of')} ${filteredBookings.length} ${t('units.entries')}`}
                    </div>
                    {totalPages > 1 && (
                         <nav className="flex items-center gap-1" aria-label="Pagination">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeftIcon className="w-5 h-5" />
                            </button>
                             <span className="text-sm font-semibold">{currentPage}</span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRightIcon className="w-5 h-5" />
                            </button>
                        </nav>
                    )}
                </div>
            </div>
            
            <AddBookingPanel
                template={newBookingTemplate}
                isOpen={isAddPanelOpen}
                onClose={() => setIsAddPanelOpen(false)}
                onSave={handleSaveNewBooking}
            />
        </div>
    );
};

export default BookingsPage;
