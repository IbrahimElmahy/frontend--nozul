import React, { useState, useMemo, useContext, useEffect } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Booking, BookingStatus, RentType, Reservation } from '../types';
import UnitStatusCard from './UnitStatusCard';
import AddBookingPanel from './AddBookingPanel';
import BookingDetailsModal from './BookingDetailsModal';
import ConfirmationModal from './ConfirmationModal';
import BookingCard from './BookingCard';
import AddGroupBookingPanel from './AddGroupBookingPanel';
import { listReservations, deleteReservation, createReservation, updateReservation, getReservation, getReservationStatusCount } from '../services/reservations';

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
import PrinterIcon from './icons-redesign/PrinterIcon';
import RentalContract from './RentalContract';


// FIX: Update template to include all required fields and adjust type.
const newBookingTemplate: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt' | 'updatedAt'> = {
    guestName: '',
    unitName: '',
    checkInDate: new Date().toLocaleDateString('en-CA'), // YYYY-MM-DD in local time
    checkOutDate: new Date(Date.now() + 86400000).toLocaleDateString('en-CA'), // tomorrow in local time
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

const normalizeStatus = (status: Reservation['status']): BookingStatus => {
    if (status === 'checked_in') return 'check-in';
    if (status === 'checked_out') return 'check-out';
    if (status === 'pending') return 'pending';
    if (status === 'confirmed') return 'confirmed';
    if (status === 'cancelled') return 'cancelled';
    return 'check-in'; // Fallback
};

const normalizeRentType = (type: Reservation['rental_type']): RentType => {
    if (type === 'hourly' || type === 'daily' || type === 'weekly' || type === 'monthly') return type;
    return 'daily';
};

const mapReservationToBooking = (reservation: Reservation): Booking => {
    // Helper to safely extract name or ID
    const extractName = (entity: any): string => {
        if (!entity) return '';
        if (typeof entity === 'string' || typeof entity === 'number') return String(entity);
        // Try common name fields
        return entity.name_ar || entity.name_en || entity.name || entity.id?.toString() || String(entity);
    };

    return {
        id: reservation.id, // Use raw ID (string or number)
        bookingNumber: reservation.number,
        guestName: extractName(reservation.guest),
        unitName: extractName(reservation.apartment),
        checkInDate: reservation.check_in_date,
        checkOutDate: reservation.check_out_date,
        time: reservation.time || '',
        status: normalizeStatus(reservation.status),
        rentType: normalizeRentType(reservation.rental_type),
        duration: reservation.period,
        rent: parseFloat(String(reservation.rent || 0)),
        value: parseFloat(String(reservation.amount || 0)),
        discount: reservation.discount ? parseFloat(String(reservation.discount)) : parseFloat(String(reservation.discount_value || '0')) || 0,
        subtotal: parseFloat(String(reservation.subtotal || 0)),
        tax: parseFloat(String(reservation.tax || 0)),
        total: parseFloat(String(reservation.total || 0)),
        payments: parseFloat(String(reservation.paid || 0)),
        balance: parseFloat(String(reservation.balance || 0)),
        createdAt: reservation.created_at,
        updatedAt: reservation.updated_at,
        // UI-only helpers/fallbacks
        bookingSource: reservation.source ? reservation.source.toString() : '',
        bookingReason: reservation.reason ? reservation.reason.toString() : '',
        totalOrders: reservation.total_orders ? parseFloat(String(reservation.total_orders)) || 0 : 0,
        notes: reservation.note || '',
        price: reservation.apartment_price ? parseFloat(String(reservation.apartment_price)) : 0,
        guestType: '',
        companions: 0,
        discountType: reservation.discount_type === 'percent' ? 'percentage' : reservation.discount_type === 'fixed' ? 'fixed' : '',
        receiptVoucher: '',
        returnVouchers: '',
        invoices: '',
        order: '',
        // Map new fields
        vatOnly: reservation.vat_only,
        lodgingTax: reservation.lodging_tax,
        payment: reservation.payment,
        refund: reservation.refund,
        checkedInAt: reservation.checked_in_at,
        checkedOutAt: reservation.checked_out_at,
        createdBy: reservation.created_by,
        updatedBy: reservation.updated_by,
        statusDisplay: reservation.status_display,
        rentalDisplay: reservation.rental_display,
        discountDisplay: reservation.discount_display,
        companionsData: Array.isArray(reservation.companions) ? reservation.companions.map((c: any) => ({
            guestId: c.guest || c.guest_id, // Handle potential API variations
            guestName: c.guest_name || '', // API might not verify name, handle gracefully
            relationship: c.relationship,
            notes: c.note
        })) : [],
    };
};

const toReservationPayload = (booking: Booking): Partial<Reservation> => ({
    hotel: 1, // Default hotel id; adjust when multi-hotel context is available
    rental_type: booking.rentType,
    check_in_date: booking.checkInDate.split(' ')[0],
    check_out_date: booking.checkOutDate.split(' ')[0],
    period: booking.duration,
    apartment: booking.unitName, // Assuming unitName holds the ID as string/number
    guest: booking.guestName, // Assuming guestName holds the ID as string/number
    status: booking.status === 'check-out' ? 'checked_out' : 'checked_in',
    source: 1,
    reason: 1,
    rent: booking.rent.toString(),
    discount_type: booking.discountType === 'percentage' ? 'percent' : booking.discountType === 'fixed' ? 'fixed' : null,
    discount_value: booking.discount?.toString() || '0',
    total_orders: booking.totalOrders?.toString() || '0',
    note: booking.notes,
    companions: booking.companionsData?.map(c => ({
        guest: c.guestId,
        relationship: c.relationship,
        note: c.notes
    })) || [],
});


const BookingsPage: React.FC = () => {
    const { t, language } = useContext(LanguageContext);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
    const [isAddGroupPanelOpen, setIsAddGroupPanelOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
    const [bookingToDeleteId, setBookingToDeleteId] = useState<number | string | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Booking | null; direction: 'ascending' | 'descending' }>({ key: 'id', direction: 'descending' });
    const [viewingBooking, setViewingBooking] = useState<Booking | null>(null);
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [printingReservation, setPrintingReservation] = useState<Reservation | null>(null);
    const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});

    useEffect(() => {
        const fetchReservations = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await listReservations();
                const items = Array.isArray(response)
                    ? response
                    : // support paginated and datatable shapes
                    (response as any)?.results ||
                    (response as any)?.data ||
                    [];
                setBookings(items.map(mapReservationToBooking));
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        const fetchStatusCounts = async () => {
            try {
                const response = await getReservationStatusCount();
                // response is LabelValueResponse[]: [{label: "...", value: 1}, ...]
                const counts: Record<string, number> = {};
                if (Array.isArray(response)) {
                    response.forEach((item: any) => {
                        counts[item.label] = item.value;
                    });
                }
                setStatusCounts(counts);
            } catch (err) {
                console.error("Failed to fetch status counts", err);
            }
        };

        fetchReservations();
        fetchStatusCounts();
    }, [t]);

    const formatDate = (dateString: string) => dateString.split(' ')[0];


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

    const handleSaveBooking = async (bookingData: Booking | Omit<Booking, 'id' | 'bookingNumber' | 'createdAt' | 'updatedAt'>) => {
        setIsSaving(true);
        setError(null);
        try {
            const payload = toReservationPayload(bookingData as Booking);

            let saved: Reservation;
            if (editingBooking) {
                // Ensure ID is passed as number if service expects number
                const idToUpdate = typeof editingBooking.id === 'string' ? parseInt(editingBooking.id) : editingBooking.id;
                saved = await updateReservation(idToUpdate, payload);
                const updated = mapReservationToBooking(saved);
                setBookings(prev => prev.map(b => (b.id === updated.id ? updated : b)));
            } else {
                saved = await createReservation(payload);
                const created = mapReservationToBooking(saved);
                setBookings(prev => [created, ...prev]);
            }
            handleClosePanel();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveGroupBooking = async (newBookings: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt' | 'updatedAt'>[]) => {
        setIsSaving(true);
        setError(null);
        try {
            // Process all bookings in parallel
            await Promise.all(newBookings.map(bookingData => {
                // Ensure payload is correct. toReservationPayload expects a Booking object, so we cast.
                // Critical: Ensure guestName and unitName are IDs here (AddGroupBookingPanel now sets IDs).
                const payload = toReservationPayload(bookingData as Booking);
                return createReservation(payload);
            }));

            // Refresh all bookings from API to reflect changes accurately
            const response = await listReservations();
            const items = Array.isArray(response)
                ? response
                : (response as any)?.results || (response as any)?.data || [];
            setBookings(items.map(mapReservationToBooking));

            setIsAddGroupPanelOpen(false);
        } catch (err) {
            console.error("Group booking failed", err);
            setError(err instanceof Error ? err.message : 'Failed to save group bookings');
        } finally {
            setIsSaving(false);
        }
    };


    const handleAddNewClick = () => {
        setEditingBooking(null);
        setIsAddPanelOpen(true);
    };

    const handleEditClick = (booking: Booking) => {
        setEditingBooking(booking);
        setIsAddPanelOpen(true);
    };

    const handleDeleteClick = (bookingId: number | string) => {
        setBookingToDeleteId(bookingId);
    };

    const handleConfirmDelete = async () => {
        if (!bookingToDeleteId) return;
        setLoading(true);
        setError(null);
        setError(null);
        try {
            const idToDelete = typeof bookingToDeleteId === 'string' ? parseInt(bookingToDeleteId) : bookingToDeleteId;
            await deleteReservation(idToDelete);
            setBookings(bookings.filter(b => b.id !== bookingToDeleteId));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setBookingToDeleteId(null);
            setLoading(false);
        }
    };

    const handlePrintClick = async (booking: Booking) => {
        try {
            const idToGet = typeof booking.id === 'string' ? parseInt(booking.id) : booking.id;
            const fullReservation = await getReservation(idToGet);
            setPrintingReservation(fullReservation);
            setTimeout(() => {
                window.print();
            }, 500);
        } catch (err) {
            console.error("Failed to fetch reservation for printing", err);
            // alert(t('bookings.printError')); // Optional: add translation key if needed
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
        'check-out': { labelKey: 'bookings.status_check_out', className: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300' },
        'pending': { labelKey: 'bookings.status_pending', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
        'confirmed': { labelKey: 'bookings.status_confirmed', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
        'cancelled': { labelKey: 'bookings.status_cancelled', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
    };

    const tableHeaders: { key: keyof Booking | 'actions', labelKey: string, numeric?: boolean, className?: string }[] = [
        { key: 'bookingNumber', labelKey: 'bookings.th_bookingNumber' },
        { key: 'guestName', labelKey: 'bookings.th_guestName' },
        { key: 'unitName', labelKey: 'bookings.th_unitName', className: 'hidden sm:table-cell' },
        { key: 'checkInDate', labelKey: 'bookings.th_checkInDate', className: 'hidden md:table-cell' },
        { key: 'checkOutDate', labelKey: 'bookings.th_checkOutDate', className: 'hidden md:table-cell' },
        { key: 'rentType', labelKey: 'bookings.th_rentType', className: 'hidden lg:table-cell' },
        { key: 'status', labelKey: 'bookings.th_status' },
        { key: 'total', labelKey: 'bookings.th_total', numeric: true, className: 'hidden xl:table-cell' },
        { key: 'balance', labelKey: 'bookings.th_balance', numeric: true },
        { key: 'createdAt', labelKey: 'bookings.th_createdAt', className: 'hidden 2xl:table-cell' },
        { key: 'actions', labelKey: 'bookings.th_actions' },
    ];

    const statusCardsData = [
        { labelKey: 'bookings.unconfirmed', value: statusCounts['قيد الانتظار'] || statusCounts['Pending'] || 0, Icon: QuestionMarkCircleIcon, iconBg: 'bg-yellow-500' },
        { labelKey: 'bookings.list', value: bookings.length, Icon: ClipboardDocumentListIcon, iconBg: 'bg-sky-500' },
        { labelKey: 'bookings.readyForCheckIn', value: statusCounts['تسجيل الدخول'] || statusCounts['Check-in'] || 0, Icon: ArrowRightOnRectangleIcon, iconBg: 'bg-green-500' },
        { labelKey: 'bookings.readyForCheckOut', value: statusCounts['مغادرة'] || statusCounts['Check-out'] || 0, Icon: ArrowLeftOnRectangleIcon, iconBg: 'bg-orange-500' },
        { labelKey: 'bookings.upcoming', value: 0, Icon: CalendarDaysIcon, iconBg: 'bg-indigo-500' }, // API doesn't seem to provide this yet
        { labelKey: 'bookings.allBookings', value: bookings.length, Icon: BriefcaseIcon, iconBg: 'bg-slate-500' },
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }


    return (
        <div className="space-y-6">
            {error && (
                <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
                    <span className="font-semibold">Error: </span>
                    <span>{error}</span>
                </div>
            )}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{t('bookings.manageBookings')}</h2>
                <div className="flex flex-wrap items-center gap-2">
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
                                        <th key={header.key} scope="col" className={`px-4 py-3 text-center ${header.className || ''}`}>
                                            {header.key !== 'actions' ? (
                                                <button
                                                    className="flex items-center gap-1.5 group w-full justify-center"
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
                                            <td key={`${booking.id}-${header.key}`} className={`px-4 py-3 whitespace-nowrap text-center ${header.className || ''}`}>
                                                {header.key === 'actions' ? (
                                                    <div className="flex items-center gap-1 justify-center">
                                                        <button
                                                            onClick={() => setViewingBooking(booking)}
                                                            className="p-1.5 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/10"
                                                            aria-label={`View details for booking ${booking.bookingNumber}`}
                                                        >
                                                            <EyeIcon className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handlePrintClick(booking)}
                                                            className="p-1.5 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                                                            aria-label={`Print contract for booking ${booking.bookingNumber}`}
                                                        >
                                                            <PrinterIcon className="w-5 h-5" />
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
                                                ) : header.key === 'checkInDate' || header.key === 'checkOutDate' || header.key === 'createdAt' ? (
                                                    <span className="text-slate-800 dark:text-slate-200 font-medium">
                                                        {formatDate(booking[header.key] as string)}
                                                    </span>
                                                ) : header.key === 'rentType' ? (
                                                    <span className="font-medium">
                                                        {t(`bookings.rent_${booking.rentType}` as any)}
                                                    </span>
                                                ) : header.key === 'balance' ? (
                                                    <span className={`font-medium font-mono ${booking.balance < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                                        {booking.balance.toFixed(2)}
                                                    </span>
                                                ) : (
                                                    <span className={`text-slate-800 dark:text-slate-200 font-medium ${header.numeric ? 'font-mono' : ''}`}>
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
                isSaving={isSaving}
            />

            <AddGroupBookingPanel
                isOpen={isAddGroupPanelOpen}
                onClose={() => setIsAddGroupPanelOpen(false)}
                onSave={handleSaveGroupBooking}
            />

            <BookingDetailsModal
                booking={viewingBooking}
                onClose={() => setViewingBooking(null)}
                onEdit={() => {
                    if (viewingBooking) {
                        setViewingBooking(null);
                        handleEditClick(viewingBooking);
                    }
                }}
            />
            <ConfirmationModal
                isOpen={!!bookingToDeleteId}
                onClose={() => setBookingToDeleteId(null)}
                onConfirm={handleConfirmDelete}
                title={t('bookings.deleteBookingTitle')}
                message={t('bookings.confirmDeleteMessage')}
            />
            {printingReservation && <RentalContract reservation={printingReservation} />}
        </div>
    );
};

export default BookingsPage;
