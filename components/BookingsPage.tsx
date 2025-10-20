import React, { useState, useMemo, useContext, useRef, useEffect } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Booking, BookingStatus, RentType } from '../types';
import UnitStatusCard from './UnitStatusCard';
import AddBookingPanel from './AddBookingPanel';
import BookingDetailsModal from './BookingDetailsModal';
import ConfirmationModal from './ConfirmationModal';
import BookingCard from './BookingCard';
import AddGroupBookingPanel from './AddGroupBookingPanel';

// Icons
import PlusCircleIcon from './icons-redesign/PlusCircleIcon';
import MagnifyingGlassIcon from './icons-redesign/MagnifyingGlassIcon';
import ChevronLeftIcon from './icons-redesign/ChevronLeftIcon';
import ChevronRightIcon from './icons-redesign/ChevronRightIcon';
import QuestionMarkCircleIcon from './icons-redesign/QuestionMarkCircleIcon';
import ClipboardDocumentListIcon from './icons-redesign/ClipboardDocumentListIcon';
import ArrowRightOnRectangleIcon from './icons-redesign/ArrowRightOnRectangleIcon';
import ArrowLeftOnRectangleIcon from './icons-redesign/ArrowLeftOnRectangleIcon';
import CalendarDaysIcon from './icons-redesign/CalendarDaysIcon';
import BriefcaseIcon from './icons-redesign/BriefcaseIcon';
import ArrowUpIcon from './icons-redesign/ArrowUpIcon';
import ArrowDownIcon from './icons-redesign/ArrowDownIcon';
import ChevronUpDownIcon from './icons-redesign/ChevronUpDownIcon';
import EyeIcon from './icons-redesign/EyeIcon';
import PencilSquareIcon from './icons-redesign/PencilSquareIcon';
import TrashIcon from './icons-redesign/TrashIcon';
import TableCellsIcon from './icons-redesign/TableCellsIcon';
import Squares2x2Icon from './icons-redesign/Squares2x2Icon';
import UsersIcon from './icons-redesign/UsersIcon';

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
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [activeActionMenu, setActiveActionMenu] = useState<number | null>(null);
    const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
    const [isAddGroupPanelOpen, setIsAddGroupPanelOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
    const [bookingToDeleteId, setBookingToDeleteId] = useState<number | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Booking | null; direction: 'ascending' | 'descending' }>({ key: 'id', direction: 'descending' });
    const [viewingBooking, setViewingBooking] = useState<Booking | null>(null);
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const actionMenuRef = useRef<HTMLDivElement>(null);

    const formatDate = (dateString: string) => dateString.split(' ')[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
                setActiveActionMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const filteredBookings = useMemo(() => {
        return bookings.filter(booking => 
            booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [bookings, searchTerm]);

    const sortedBookings = useMemo(() => {
        let sortableItems = [...filteredBookings];
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                const key = sortConfig.key as keyof Booking;
                const aValue = a[key];
                const bValue = b[key];

                if (aValue === null || aValue === undefined) return 1;
                if (bValue === null || bValue === undefined) return -1;
                
                let comparison = 0;
                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    comparison = aValue - bValue;
                } else {
                    comparison = String(aValue).localeCompare(String(bValue));
                }
                
                return sortConfig.direction === 'ascending' ? comparison : -comparison;
            });
        }
        return sortableItems;
    }, [filteredBookings, sortConfig]);
    
    const totalPages = itemsPerPage === Number.MAX_SAFE_INTEGER ? 1 : Math.ceil(sortedBookings.length / itemsPerPage);

    const paginatedBookings = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedBookings.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedBookings, currentPage, itemsPerPage]);

    const handleClosePanel = () => {
        setIsAddPanelOpen(false);
        setEditingBooking(null);
    };

    const handleSaveBooking = (bookingData: Booking | Omit<Booking, 'id' | 'bookingNumber' | 'createdAt' | 'updatedAt'>) => {
        if (editingBooking) {
            const updatedBooking = { ...bookingData, id: editingBooking.id, updatedAt: new Date().toISOString() } as Booking;
            setBookings(bookings.map(b => b.id === updatedBooking.id ? updatedBooking : b));
        } else {
            const newBooking: Booking = {
                ...(bookingData as Omit<Booking, 'id'>),
                id: Math.max(...bookings.map(b => b.id), 0) + 1,
                bookingNumber: `0000000${Math.max(...bookings.map(b => b.id), 0) + 1}`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            setBookings(prev => [newBooking, ...prev]);
        }
        handleClosePanel();
    };
    
    const handleSaveGroupBooking = (newBookings: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt' | 'updatedAt'>[]) => {
        const maxId = Math.max(0, ...bookings.map(b => b.id));
        const bookingsToAdd: Booking[] = newBookings.map((booking, index) => ({
            ...booking,
            id: maxId + 1 + index,
            bookingNumber: `GRP-${maxId + 1 + index}`, // Differentiate group bookings
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        } as Booking));
        setBookings(prev => [...bookingsToAdd, ...prev]);
        setIsAddGroupPanelOpen(false);
    };


    const handleAddNewClick = () => {
        setEditingBooking(null);
        setIsAddPanelOpen(true);
    };

    const handleEditClick = (booking: Booking) => {
        setEditingBooking(booking);
        setIsAddPanelOpen(true);
        setActiveActionMenu(null);
    };

    const handleDeleteClick = (bookingId: number) => {
        setBookingToDeleteId(bookingId);
        setActiveActionMenu(null);
    };

    const handleConfirmDelete = () => {
        if (bookingToDeleteId) {
            setBookings(bookings.filter(b => b.id !== bookingToDeleteId));
            setBookingToDeleteId(null);
        }
    };
    
    const requestSort = (key: keyof Booking) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const statusConfig: Record<BookingStatus, { labelKey: string, className: string }> = {
        'check-in': { labelKey: 'bookings.status_check_in', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
        'check-out': { labelKey: 'bookings.status_check_out', className: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300' }
    };

    const tableHeaders: { key: keyof Booking | 'actions', labelKey: string, numeric?: boolean }[] = [
        { key: 'bookingNumber', labelKey: 'bookings.th_bookingNumber' },
        { key: 'guestName', labelKey: 'bookings.th_guestName' },
        { key: 'unitName', labelKey: 'bookings.th_unitName' },
        { key: 'checkInDate', labelKey: 'bookings.th_checkInDate' },
        { key: 'checkOutDate', labelKey: 'bookings.th_checkOutDate' },
        { key: 'status', labelKey: 'bookings.th_status' },
        { key: 'total', labelKey: 'bookings.th_total', numeric: true },
        { key: 'balance', labelKey: 'bookings.th_balance', numeric: true },
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

    const showingEntriesControls = (
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
    );

    const searchAndViewsControls = (
        <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0 sm:w-96">
                <MagnifyingGlassIcon className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('bookings.searchPlaceholder')}
                    className={`w-full py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-200 ${language === 'ar' ? 'pr-10' : 'pl-10'}`}
                />
            </div>
            <div className="flex items-center gap-2">
                <button onClick={() => setViewMode('table')} className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}`} aria-label="Table View">
                    <TableCellsIcon className="w-5 h-5" />
                </button>
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}`} aria-label="Grid View">
                    <Squares2x2Icon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );


    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{t('bookings.manageBookings')}</h2>
                 <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setIsAddGroupPanelOpen(true)}
                        className="flex items-center gap-2 bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors"
                    >
                        <UsersIcon className="w-5 h-5" />
                        <span>{t('bookings.addGroupBooking')}</span>
                    </button>
                    <button 
                        onClick={handleAddNewClick}
                        className="flex items-center gap-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        <PlusCircleIcon className="w-5 h-5" />
                        <span>{t('bookings.addBooking')}</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {statusCardsData.map(card => <UnitStatusCard key={card.labelKey} label={t(card.labelKey as any)} value={card.value} icon={card.Icon} iconBg={card.iconBg} />)}
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                 <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                    {language === 'ar' ? (
                        <>
                            {searchAndViewsControls}
                            {showingEntriesControls}
                        </>
                    ) : (
                        <>
                            {showingEntriesControls}
                            {searchAndViewsControls}
                        </>
                    )}
                </div>

                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {paginatedBookings.map(booking => (
                            <BookingCard
                                key={booking.id}
                                booking={booking}
                                onViewClick={() => {
                                    setViewingBooking(booking);
                                    setActiveActionMenu(null);
                                }}
                                onEditClick={() => handleEditClick(booking)}
                                onDeleteClick={() => handleDeleteClick(booking.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-start text-slate-500 dark:text-slate-400">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                                <tr>
                                    {tableHeaders.map(header => (
                                        <th key={header.key} scope="col" className={`px-6 py-3 ${header.numeric || header.key === 'actions' ? 'text-end' : 'text-start'}`}>
                                            {header.key !== 'actions' ? (
                                                <button 
                                                    className="flex items-center gap-1.5 group" 
                                                    onClick={() => requestSort(header.key as keyof Booking)}
                                                    aria-label={`Sort by ${t(header.labelKey as any)}`}
                                                >
                                                    <span>{t(header.labelKey as any)}</span>
                                                    <span className="flex-shrink-0">
                                                        {sortConfig.key === header.key ? (
                                                            sortConfig.direction === 'ascending' ? <ArrowUpIcon className="w-3.5 h-3.5" /> : <ArrowDownIcon className="w-3.5 h-3.5" />
                                                        ) : (
                                                            <ChevronUpDownIcon className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        )}
                                                    </span>
                                                </button>
                                            ) : (
                                                <span>{t(header.labelKey as any)}</span>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedBookings.map(booking => (
                                    <tr key={booking.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
                                        {tableHeaders.map(header => (
                                            <td key={`${booking.id}-${header.key}`} className={`px-6 py-4 ${header.numeric || header.key === 'actions' ? 'text-end' : 'text-start'}`}>
                                                {header.key === 'actions' ? (
                                                    <div className="flex items-center gap-1 justify-end">
                                                        <button 
                                                            onClick={() => setViewingBooking(booking)}
                                                            className="p-1.5 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/10"
                                                            aria-label={`View details for booking ${booking.bookingNumber}`}
                                                        >
                                                            <EyeIcon className="w-5 h-5" />
                                                        </button>
                                                         <button 
                                                            onClick={() => handleEditClick(booking)}
                                                            className="p-1.5 rounded-full text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-500/10"
                                                            aria-label={`Edit booking ${booking.bookingNumber}`}
                                                        >
                                                            <PencilSquareIcon className="w-5 h-5" />
                                                        </button>
                                                         <button 
                                                            onClick={() => handleDeleteClick(booking.id)}
                                                            className="p-1.5 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10"
                                                            aria-label={`Delete booking ${booking.bookingNumber}`}
                                                        >
                                                            <TrashIcon className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                ) : header.key === 'status' ? (
                                                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusConfig[booking.status].className}`}>
                                                        {t(statusConfig[booking.status].labelKey as any)}
                                                    </span>
                                                ) : header.key === 'checkInDate' || header.key === 'checkOutDate' ? (
                                                    <span className="text-slate-800 dark:text-slate-200 font-medium whitespace-nowrap">
                                                        {formatDate(booking[header.key] as string)}
                                                    </span>
                                                ) : header.key === 'balance' ? (
                                                    <span className={`font-medium whitespace-nowrap font-mono ${booking.balance < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                                        {booking.balance.toFixed(2)}
                                                    </span>
                                                ) : (
                                                    <span className={`text-slate-800 dark:text-slate-200 font-medium whitespace-nowrap ${header.numeric ? 'font-mono' : ''}`}>
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
                )}
                
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                        {`${t('units.showing')} ${sortedBookings.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} ${t('units.to')} ${Math.min(currentPage * itemsPerPage, sortedBookings.length)} ${t('units.of')} ${sortedBookings.length} ${t('units.entries')}`}
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
                             <span className="text-sm font-semibold px-2">{currentPage} / {totalPages}</span>
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
                initialData={editingBooking || newBookingTemplate}
                isEditing={!!editingBooking}
                isOpen={isAddPanelOpen}
                onClose={handleClosePanel}
                onSave={handleSaveBooking}
            />

            <AddGroupBookingPanel
                isOpen={isAddGroupPanelOpen}
                onClose={() => setIsAddGroupPanelOpen(false)}
                onSave={handleSaveGroupBooking}
            />

            <BookingDetailsModal
                booking={viewingBooking}
                onClose={() => setViewingBooking(null)}
            />
            <ConfirmationModal
                isOpen={!!bookingToDeleteId}
                onClose={() => setBookingToDeleteId(null)}
                onConfirm={handleConfirmDelete}
                title={t('bookings.deleteBookingTitle')}
                message={t('bookings.confirmDeleteMessage')}
            />
        </div>
    );
};

export default BookingsPage;