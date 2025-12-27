import React, { useState, useEffect, useContext, useCallback } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

import { ReportFilterOption, DailyBookingItem } from '../types';
import { fetchDailyReservationsMovements, fetchAllReservationsMovements } from '../services/reports';
import MagnifyingGlassIcon from './icons-redesign/MagnifyingGlassIcon';
import ArrowDownTrayIcon from './icons-redesign/ArrowDownTrayIcon';
import ChevronLeftIcon from './icons-redesign/ChevronLeftIcon';
import ChevronRightIcon from './icons-redesign/ChevronRightIcon';
import PrinterIcon from './icons-redesign/PrinterIcon';
import DatePicker from './DatePicker';
import SearchableSelect from './SearchableSelect';
import PencilSquareIcon from './icons-redesign/PencilSquareIcon';
import TrashIcon from './icons-redesign/TrashIcon';
import ConfirmationModal from './ConfirmationModal';
import { getReservation, getReservationStatuses, getRentalTypes, getReservationSources, getReservationReasons, getApartmentTypes, deleteReservation } from '../services/reservations';
import RentalContract from './RentalContract';
import { Reservation } from '../types';

// Helper for status colors
const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'check-in': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
        case 'check-out': return 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300 border-gray-200 dark:border-gray-600';
        case 'confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
        case 'canceled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
        default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600';
    }
};

const ReportDailyBookings: React.FC = () => {
    const { t, language } = useContext(LanguageContext);
    const [data, setData] = useState<DailyBookingItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ currentPage: 1, itemsPerPage: 10, totalRecords: 0 });

    // Filters Options
    const [statusOptions, setStatusOptions] = useState<ReportFilterOption[]>([]);
    const [rentTypeOptions, setRentTypeOptions] = useState<ReportFilterOption[]>([]);
    const [sourceOptions, setSourceOptions] = useState<ReportFilterOption[]>([]);
    const [reasonOptions, setReasonOptions] = useState<ReportFilterOption[]>([]);
    const [unitTypes, setUnitTypes] = useState<ReportFilterOption[]>([]);

    // Form State
    const [filters, setFilters] = useState({
        bookingNumber: '',
        guestName: '',
        guestPhone: '',
        checkInDate: '',
        checkOutDate: '',
        unitName: '',
        unitType: '',
        status: '',
        rentType: '',
        source: '',
        reason: '',
        updatedDate: '',
    });

    const [itemToDelete, setItemToDelete] = useState<any>(null);
    const [printingReservation, setPrintingReservation] = useState<Reservation | null>(null);

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                // Status and Rental Types return [["key", "Label"], ...]
                // Sources and Reasons might be standard paginated or list
                const [statusRes, rentRes, sourceRes, reasonRes, typesRes] = await Promise.all([
                    getReservationStatuses(),
                    getRentalTypes(),
                    getReservationSources({ length: 50 }),
                    getReservationReasons({ length: 50 }),
                    getApartmentTypes(),
                ]);

                // Parse Status
                if (Array.isArray(statusRes)) {
                    setStatusOptions(statusRes.map(([id, name]) => ({ id, name })));
                }

                // Parse Rental Types
                if (Array.isArray(rentRes)) {
                    setRentTypeOptions(rentRes.map(([id, name]) => ({ id, name })));
                }

                // Parse Sources (handle both array and paginated result)
                const sourcesData = 'results' in sourceRes ? sourceRes.results : (Array.isArray(sourceRes) ? sourceRes : []);
                setSourceOptions(sourcesData || []);

                // Parse Reasons
                const reasonsData = 'results' in reasonRes ? reasonRes.results : (Array.isArray(reasonRes) ? reasonRes : []);
                setReasonOptions(reasonsData || []);

                // Parse Unit Types (handle both {data: []} and [])
                const typesData = 'data' in typesRes ? typesRes.data : (Array.isArray(typesRes) ? typesRes : []);
                setUnitTypes(typesData.map((t: any) => ({ id: t.id, name: t.name })) || []);

            } catch (error) {
                console.error("Failed to fetch report filters", error);
            }
        };
        fetchFilters();
    }, []);

    const buildQuery = useCallback(() => {
        const query: Record<string, any> = {
            start: (pagination.currentPage - 1) * pagination.itemsPerPage,
            length: pagination.itemsPerPage,
        };

        if (filters.bookingNumber) query['number'] = filters.bookingNumber;
        if (filters.guestName) query['guest__name__contains'] = filters.guestName;
        if (filters.guestPhone) query['guest__phone_number'] = filters.guestPhone;
        if (filters.checkInDate) query['check_in_date'] = filters.checkInDate;
        if (filters.checkOutDate) query['check_out_date'] = filters.checkOutDate;
        if (filters.unitName) query['apartment__name'] = filters.unitName;
        if (filters.unitType) query['apartment__apartment_type'] = filters.unitType;
        if (filters.status) query['status'] = filters.status;
        if (filters.rentType) query['rental_type'] = filters.rentType;
        if (filters.source) query['source'] = filters.source;
        if (filters.reason) query['reason'] = filters.reason;
        if (filters.updatedDate) query['updated_at__date'] = filters.updatedDate;

        return query;
    }, [pagination.currentPage, pagination.itemsPerPage, filters]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const query = buildQuery();
            const response = await fetchDailyReservationsMovements(query);
            setData(response.data || []);
            setPagination(p => ({ ...p, totalRecords: response.recordsFiltered || 0 }));
        } catch (error) {
            console.error("Failed to fetch daily bookings report", error);
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [buildQuery]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSearch = () => {
        setPagination(p => ({ ...p, currentPage: 1 }));
        fetchData();
    };

    const handleExport = async () => {
        try {
            setLoading(true);
            const query = buildQuery();
            delete query.start;
            delete query.length;

            // Fetch all data for export
            const allData = await fetchAllReservationsMovements(query);

            if (!allData || allData.length === 0) {
                alert(t('orders.noData'));
                return;
            }

            // Generate CSV with Semicolon delimiter for better Excel compatibility in some regions
            const headers = [
                t('bookings.bookingNumber'),
                t('bookings.guest'),
                t('units.unitName'),
                t('bookings.th_checkInDate'),
                t('bookings.th_checkOutDate'),
                t('bookings.th_status'),
                t('bookings.rent'),
                t('bookings.th_tax'),
                t('bookings.th_total'),
                t('bookings.balance')
            ];

            const formatDateForExport = (dateStr: string) => {
                if (!dateStr) return '';
                return dateStr.split('T')[0];
            };

            // Generate content with Tab delimiter
            const delimiter = '\t';
            const headersStr = headers.join(delimiter);
            const rowsStr = allData.map((item: any) => [
                item.number || item.booking_number,
                `"${(item.guest || '').replace(/"/g, '""')}"`,
                `"${(item.apartment || '').replace(/"/g, '""')}"`,
                formatDateForExport(item.check_in_date),
                formatDateForExport(item.check_out_date),
                item.status_display || item.status,
                item.amount || item.price,
                item.tax,
                item.total,
                item.balance
            ].join(delimiter)).join('\n');

            const content = headersStr + '\n' + rowsStr;

            // Convert to UTF-16LE with BOM
            const buffer = new ArrayBuffer(2 + (content.length * 2));
            const view = new DataView(buffer);
            view.setUint16(0, 0xFEFF, true); // BOM Little Endian

            for (let i = 0; i < content.length; i++) {
                view.setUint16(2 + (i * 2), content.charCodeAt(i), true);
            }

            const blob = new Blob([buffer], { type: 'text/csv;charset=utf-16le;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `daily_bookings_report_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error("Export failed", error);
            alert(t('reportsPage.exportFailed') || "Export failed");
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        // Ensure no specific reservation is being printed
        setPrintingReservation(null);
        setTimeout(() => {
            window.print();
        }, 100);
    };

    const handleDeleteRow = (item: any) => {
        setItemToDelete(item);
    };

    const handleConfirmDelete = async () => {
        if (itemToDelete) {
            try {
                await deleteReservation(itemToDelete.id);
                fetchData();
                setItemToDelete(null);
            } catch (err) {
                alert(`Error deleting reservation: ${err instanceof Error ? err.message : 'Unknown error'}`);
            }
        }
    };

    const handleEditRow = (item: any) => {
        alert('Edit functionality for reports is currently read-only in this view.');
    };

    const handlePrintRow = async (item: any) => {
        try {
            const fullReservation = await getReservation(item.id);
            setPrintingReservation(fullReservation);
            // Don't auto-print immediately, let user see the preview
        } catch (err) {
            console.error("Failed to fetch reservation for printing", err);
            alert(t('bookings.printError' as any) || "Failed to print reservation");
        }
    };

    const totalPages = Math.ceil(pagination.totalRecords / pagination.itemsPerPage);
    const labelClass = `block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider ${language === 'ar' ? 'text-right' : 'text-left'}`;
    const inputClass = `w-full px-3 py-2 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-slate-200 text-sm transition-shadow`;

    return (
        <div className="space-y-6 print:space-y-0">
            {/* Main Report Content - Hide when printing a specific reservation */}
            <div className={printingReservation ? 'hidden print:hidden' : ''}>
                {/* Filters Bar - Hide on Print */}
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700/50 print:hidden">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            <MagnifyingGlassIcon className="w-5 h-5 text-blue-500" />
                            {t('receipts.searchInfo')}
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-5 mb-6">
                        <div>
                            <label className={labelClass}>{t('bookings.bookingNumber')}</label>
                            <input type="text" className={inputClass} value={filters.bookingNumber} onChange={e => setFilters({ ...filters, bookingNumber: e.target.value })} placeholder="#" />
                        </div>
                        <div>
                            <label className={labelClass}>{t('bookings.guest')}</label>
                            <input type="text" className={inputClass} value={filters.guestName} onChange={e => setFilters({ ...filters, guestName: e.target.value })} />
                        </div>
                        <div>
                            <label className={labelClass}>{t('guests.th_mobileNumber')}</label>
                            <input type="text" className={inputClass} value={filters.guestPhone} onChange={e => setFilters({ ...filters, guestPhone: e.target.value })} />
                        </div>
                        <div>
                            <label className={labelClass}>{t('units.unitName')}</label>
                            <input type="text" className={inputClass} value={filters.unitName} onChange={e => setFilters({ ...filters, unitName: e.target.value })} />
                        </div>

                        {/* Second Row */}
                        <div>
                            <label className={labelClass}>{t('bookings.th_checkInDate')}</label>
                            <DatePicker value={filters.checkInDate} onChange={d => setFilters({ ...filters, checkInDate: d })} />
                        </div>
                        <div>
                            <label className={labelClass}>{t('bookings.th_checkOutDate')}</label>
                            <DatePicker value={filters.checkOutDate} onChange={d => setFilters({ ...filters, checkOutDate: d })} />
                        </div>
                        <div>
                            <label className={labelClass}>{t('bookings.th_status')}</label>
                            <SearchableSelect id="status" options={statusOptions.map(o => o.name)} value={statusOptions.find(o => String(o.id) === String(filters.status))?.name || ''} onChange={val => { const f = statusOptions.find(o => o.name === val); if (f) setFilters({ ...filters, status: String(f.id) }) }} />
                        </div>
                        <div>
                            <label className={labelClass}>{t('units.roomType')}</label>
                            <SearchableSelect id="unitType" options={unitTypes.map(o => o.name)} value={unitTypes.find(o => String(o.id) === String(filters.unitType))?.name || ''} onChange={val => { const f = unitTypes.find(o => o.name === val); if (f) setFilters({ ...filters, unitType: String(f.id) }) }} />
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-700">
                        <button onClick={handleSearch} className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm text-sm font-medium">
                            <MagnifyingGlassIcon className="w-4 h-4" />
                            {t('phone.search')}
                        </button>
                        <button onClick={handlePrint} className="bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 px-5 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex items-center gap-2 shadow-sm text-sm font-medium">
                            <PrinterIcon className="w-4 h-4" />
                            {t('receipts.print')}
                        </button>
                        <button onClick={handleExport} className="bg-teal-500 text-white px-5 py-2 rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-2 shadow-sm text-sm font-medium">
                            <ArrowDownTrayIcon className="w-4 h-4" />
                            {t('units.export')}
                        </button>
                    </div>
                </div >

                {/* Data Table */}
                < div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col print:shadow-none print:border-none" >
                    <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 print:hidden">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                            <span>{t('units.showing')}</span>
                            <select
                                value={pagination.itemsPerPage}
                                onChange={(e) => setPagination(p => ({ ...p, itemsPerPage: Number(e.target.value), currentPage: 1 }))}
                                className="py-1.5 px-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                            <span>{t('units.entries')}</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                            <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-4 py-3 font-semibold text-center w-12">#</th>
                                    <th className="px-4 py-3 font-semibold hidden sm:table-cell text-center">{t('bookings.bookingNumber')}</th>
                                    <th className="px-4 py-3 font-semibold text-center">{t('bookings.guest')}</th>
                                    <th className="px-4 py-3 font-semibold text-center">{t('units.unitName')}</th>
                                    <th className="px-4 py-3 font-semibold hidden lg:table-cell text-center">{t('bookings.th_checkInDate')}</th>
                                    <th className="px-4 py-3 font-semibold hidden xl:table-cell text-center">{t('bookings.th_checkOutDate')}</th>
                                    <th className="px-4 py-3 font-semibold text-center hidden md:table-cell">{t('bookings.th_status')}</th>
                                    <th className="px-4 py-3 font-semibold hidden 2xl:table-cell text-end">{t('bookings.rent')}</th>
                                    <th className="px-4 py-3 font-semibold hidden 2xl:table-cell text-end">{t('bookings.th_tax')}</th>
                                    <th className="px-4 py-3 font-semibold hidden lg:table-cell text-end">{t('bookings.th_total')}</th>
                                    <th className="px-4 py-3 font-semibold text-end">{t('bookings.balance')}</th>
                                    <th className="px-4 py-3 font-semibold text-center print:hidden">{t('agencies.th_actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {loading ? (
                                    <tr><td colSpan={12} className="py-12 text-center"><div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div></td></tr>
                                ) : data.length === 0 ? (
                                    <tr>
                                        <td colSpan={12} className="py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                                                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-3">
                                                    <MagnifyingGlassIcon className="w-8 h-8 opacity-50" />
                                                </div>
                                                <p className="text-base font-medium">{t('orders.noData')}</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : data.map((item, idx) => (
                                    <tr key={item.id} className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-4 py-3 text-center font-mono text-xs text-slate-400">{idx + 1 + ((pagination.currentPage - 1) * pagination.itemsPerPage)}</td>
                                        <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-200 hidden md:table-cell text-center">{item.number}</td>
                                        <td className="px-4 py-3 max-w-[150px] truncate text-center" title={item.guest}>
                                            <div className="font-medium text-slate-900 dark:text-white">{item.guest}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 md:hidden">{item.number}</div>
                                        </td>
                                        <td className="px-4 py-3 max-w-[120px] truncate font-medium text-blue-600 dark:text-blue-400 hidden md:table-cell text-center">{item.apartment}</td>
                                        <td className="px-4 py-3 hidden lg:table-cell text-center font-mono text-xs" dir="ltr">{item.check_in_date}</td>
                                        <td className="px-4 py-3 hidden xl:table-cell text-center font-mono text-xs" dir="ltr">{item.check_out_date}</td>
                                        <td className="px-4 py-3 text-center hidden md:table-cell">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                                                {item.status_display || item.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 hidden 2xl:table-cell text-end font-mono text-slate-600 dark:text-slate-400">{item.amount}</td>
                                        <td className="px-4 py-3 hidden 2xl:table-cell text-end font-mono text-slate-600 dark:text-slate-400">{item.tax || 0}</td>
                                        <td className="px-4 py-3 hidden lg:table-cell text-end font-bold font-mono text-slate-700 dark:text-slate-300">{item.total}</td>
                                        <td className="px-4 py-3 text-end">
                                            <span className={`font-bold font-mono ${Number(item.balance) < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                                {item.balance}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center print:hidden">
                                            <div className="flex items-center justify-center gap-1">
                                                <button onClick={() => handlePrintRow(item)} className="p-1.5 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" title={t('receipts.print')}>
                                                    <PrinterIcon className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleEditRow(item)} className="p-1.5 rounded-full text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-500/10 transition-colors" title={t('bookings.edit')}>
                                                    <PencilSquareIcon className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDeleteRow(item)} className="p-1.5 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10 transition-colors" title={t('bookings.delete')}>
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 print:hidden">
                        <div className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                            {`${t('units.showing')} ${data.length > 0 ? (pagination.currentPage - 1) * pagination.itemsPerPage + 1 : 0} ${t('units.to')} ${Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalRecords)} ${t('units.of')} ${pagination.totalRecords} ${t('units.entries')}`}
                        </div>
                        <nav className="flex items-center gap-1.5">
                            <button
                                onClick={() => setPagination(p => ({ ...p, currentPage: Math.max(1, p.currentPage - 1) }))}
                                disabled={pagination.currentPage === 1}
                                className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                                <ChevronLeftIcon className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
                            </button>
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 px-3 py-1.5 rounded-lg shadow-sm">
                                {pagination.currentPage} / {totalPages || 1}
                            </span>
                            <button
                                onClick={() => setPagination(p => ({ ...p, currentPage: Math.min(totalPages || 1, p.currentPage + 1) }))}
                                disabled={pagination.currentPage === totalPages || totalPages === 0}
                                className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                                <ChevronRightIcon className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
                            </button>
                        </nav>
                    </div>
                </div >
            </div>

            <ConfirmationModal
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                onConfirm={handleConfirmDelete}
                title={t('bookings.deleteBookingTitle')}
                message={t('bookings.confirmDeleteMessage')}
            />

            {/* Print Preview Modal */}
            {printingReservation && (
                <div className="fixed inset-0 z-50 bg-white overflow-auto">
                    <div className="p-4 max-w-4xl mx-auto print:p-0 print:max-w-none">
                        <div className="flex justify-between items-center mb-4 print:hidden">
                            <h2 className="text-xl font-bold">{t('receipts.print')}</h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => window.print()}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                >
                                    <PrinterIcon className="w-4 h-4" />
                                    {t('receipts.print')}
                                </button>
                                <button
                                    onClick={() => setPrintingReservation(null)}
                                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                                >
                                    {t('common.close' as any)}
                                </button>
                            </div>
                        </div>
                        <div className="border p-8 shadow-sm print:border-none print:shadow-none print:p-0">
                            <RentalContract reservation={printingReservation} />
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default ReportDailyBookings;
