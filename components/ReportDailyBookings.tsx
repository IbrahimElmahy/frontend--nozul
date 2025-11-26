
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { apiClient } from '../apiClient';
import { FundReportItem, ReportFilterOption } from '../types';
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
    const [data, setData] = useState<any[]>([]);
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

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [statusRes, rentRes, sourceRes, reasonRes, typesRes] = await Promise.all([
                    apiClient<{ data: ReportFilterOption[] }>('/ar/reservation/api/reservations/status/'),
                    apiClient<{ data: ReportFilterOption[] }>('/ar/reservation/api/reservations/rental-types/'),
                    apiClient<{ data: ReportFilterOption[] }>('/ar/reservation/api/reservation-sources/?length=50'),
                    apiClient<{ data: ReportFilterOption[] }>('/ar/reservation/api/reservation-reasons/?length=50'),
                    apiClient<{ data: any[] }>('/ar/apartment/api/apartments-types/'),
                ]);
                setStatusOptions(statusRes.data || []);
                setRentTypeOptions(rentRes.data || []);
                setSourceOptions(sourceRes.data || []);
                setReasonOptions(reasonRes.data || []);
                setUnitTypes(typesRes.data.map((t: any) => ({ id: t.id, name: t.name })) || []);
            } catch (error) {
                console.error("Failed to fetch report filters", error);
            }
        };
        fetchFilters();
    }, []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('start', ((pagination.currentPage - 1) * pagination.itemsPerPage).toString());
            params.append('length', pagination.itemsPerPage.toString());

            if (filters.bookingNumber) params.append('number', filters.bookingNumber);
            if (filters.guestName) params.append('guest__name__contains', filters.guestName);
            if (filters.guestPhone) params.append('guest__phone_number', filters.guestPhone);
            if (filters.checkInDate) params.append('check_in_date', filters.checkInDate);
            if (filters.checkOutDate) params.append('check_out_date', filters.checkOutDate);
            if (filters.unitName) params.append('apartment__name', filters.unitName);
            if (filters.unitType) params.append('apartment__apartment_type', filters.unitType);
            if (filters.status) params.append('status', filters.status);
            if (filters.rentType) params.append('rental_type', filters.rentType);
            if (filters.source) params.append('source', filters.source);
            if (filters.reason) params.append('reason', filters.reason);
            if (filters.updatedDate) params.append('updated_at__date', filters.updatedDate);

            const response = await apiClient<{ data: any[], recordsFiltered: number }>(`/ar/report/api/daily_reservations_movements/?${params.toString()}`);

            setData(response.data);
            setPagination(p => ({ ...p, totalRecords: response.recordsFiltered }));
        } catch (error) {
            console.error("Failed to fetch daily bookings report", error);
        } finally {
            setLoading(false);
        }
    }, [pagination.currentPage, pagination.itemsPerPage, filters]);

    const handleSearch = () => {
        setPagination(p => ({ ...p, currentPage: 1 }));
        fetchData();
    };

    const handleExport = () => {
        const params = new URLSearchParams();
        // Add filters to params here matching fetchData logic if needed for export URL
        const url = `https://www.osusideas.online/reservation/api/reservations/export-excel-file/?${params.toString()}`;
        window.open(url, '_blank');
    };

    const handlePrint = () => {
        window.open('https://www.osusideas.online/hpanel/reports/daily_reservation_report/print/', '_blank', 'width=800,height=600');
    };

    const handleDeleteRow = (item: any) => {
        setItemToDelete(item);
    };

    const handleConfirmDelete = async () => {
        if (itemToDelete) {
            try {
                await apiClient(`/ar/reservation/api/reservations/${itemToDelete.id}/`, { method: 'DELETE' });
                fetchData();
                setItemToDelete(null);
            } catch (err) {
                alert(`Error deleting reservation: ${err instanceof Error ? err.message : 'Unknown error'}`);
            }
        }
    };

    const handleEditRow = (item: any) => {
        // Placeholder for edit action
        alert('Edit functionality for reports is currently read-only in this view.');
    };

    const handlePrintRow = (item: any) => {
        // Attempt to print individual reservation if endpoint exists, otherwise generic alert
        alert(`Printing booking #${item.booking_number}...`);
        // Example: window.open(`.../print/${item.id}`, '_blank');
    };

    const totalPages = Math.ceil(pagination.totalRecords / pagination.itemsPerPage);
    const labelClass = `block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider ${language === 'ar' ? 'text-right' : 'text-left'}`;
    const inputClass = `w-full px-3 py-2 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-slate-200 text-sm transition-shadow`;

    return (
        <div className="space-y-6">
            {/* Filters Bar */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700/50">
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
                        <SearchableSelect id="status" options={statusOptions.map(o => o.name)} value={statusOptions.find(o => o.id === filters.status)?.name || ''} onChange={val => { const f = statusOptions.find(o => o.name === val); if (f) setFilters({ ...filters, status: f.id }) }} />
                    </div>
                    <div>
                        <label className={labelClass}>{t('units.roomType')}</label>
                        <SearchableSelect id="unitType" options={unitTypes.map(o => o.name)} value={unitTypes.find(o => o.id === filters.unitType)?.name || ''} onChange={val => { const f = unitTypes.find(o => o.name === val); if (f) setFilters({ ...filters, unitType: f.id }) }} />
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
            </div>

            {/* Data Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
                <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800">
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
                                <th className="px-4 py-3 font-semibold hidden sm:table-cell text-start">{t('bookings.bookingNumber')}</th>
                                <th className="px-4 py-3 font-semibold text-start">{t('bookings.guest')}</th>
                                <th className="px-4 py-3 font-semibold text-start">{t('units.unitName')}</th>
                                <th className="px-4 py-3 font-semibold hidden lg:table-cell text-center">{t('bookings.th_checkInDate')}</th>
                                <th className="px-4 py-3 font-semibold hidden xl:table-cell text-center">{t('bookings.th_checkOutDate')}</th>
                                <th className="px-4 py-3 font-semibold text-center hidden md:table-cell">{t('bookings.th_status')}</th>
                                <th className="px-4 py-3 font-semibold hidden 2xl:table-cell text-end">{t('bookings.rent')}</th>
                                <th className="px-4 py-3 font-semibold hidden 2xl:table-cell text-end">{t('bookings.th_tax')}</th>
                                <th className="px-4 py-3 font-semibold hidden lg:table-cell text-end">{t('bookings.th_total')}</th>
                                <th className="px-4 py-3 font-semibold text-end">{t('bookings.balance')}</th>
                                <th className="px-4 py-3 font-semibold text-center">{t('agencies.th_actions')}</th>
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
                                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-200 hidden md:table-cell">{item.booking_number}</td>
                                    <td className="px-4 py-3 max-w-[150px] truncate" title={item.guest?.name}>
                                        <div className="font-medium text-slate-900 dark:text-white">{item.guest?.name}</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 md:hidden">{item.booking_number}</div>
                                    </td>
                                    <td className="px-4 py-3 max-w-[120px] truncate font-medium text-blue-600 dark:text-blue-400 hidden md:table-cell">{item.apartment?.name}</td>
                                    <td className="px-4 py-3 hidden lg:table-cell text-center font-mono text-xs" dir="ltr">{item.check_in_date}</td>
                                    <td className="px-4 py-3 hidden xl:table-cell text-center font-mono text-xs" dir="ltr">{item.check_out_date}</td>
                                    <td className="px-4 py-3 text-center hidden md:table-cell">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 hidden 2xl:table-cell text-end font-mono text-slate-600 dark:text-slate-400">{item.price}</td>
                                    <td className="px-4 py-3 hidden 2xl:table-cell text-end font-mono text-slate-600 dark:text-slate-400">{item.tax}</td>
                                    <td className="px-4 py-3 hidden lg:table-cell text-end font-bold font-mono text-slate-700 dark:text-slate-300">{item.total}</td>
                                    <td className="px-4 py-3 text-end">
                                        <span className={`font-bold font-mono ${item.balance < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                            {item.balance}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
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
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800">
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
            </div>

            <ConfirmationModal
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                onConfirm={handleConfirmDelete}
                title={t('bookings.deleteBookingTitle')}
                message={t('bookings.confirmDeleteMessage')}
            />
        </div>
    );
};

export default ReportDailyBookings;
