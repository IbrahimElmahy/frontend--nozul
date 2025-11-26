
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { apiClient } from '../apiClient';
import { BaladyItem } from '../types';
import ArrowDownTrayIcon from './icons-redesign/ArrowDownTrayIcon';
import ChevronLeftIcon from './icons-redesign/ChevronLeftIcon';
import ChevronRightIcon from './icons-redesign/ChevronRightIcon';
import MagnifyingGlassIcon from './icons-redesign/MagnifyingGlassIcon';
import DatePicker from './DatePicker';

const ReportBalady: React.FC = () => {
    const { t, language } = useContext(LanguageContext);
    const [data, setData] = useState<BaladyItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ currentPage: 1, itemsPerPage: 10, totalRecords: 0 });
    
    // Filter State
    const [endDate, setEndDate] = useState('');

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('start', ((pagination.currentPage - 1) * pagination.itemsPerPage).toString());
            params.append('length', pagination.itemsPerPage.toString());
            
            if (endDate) params.append('check_out_date__lte', endDate);
            
            const response = await apiClient<{ data: any[], recordsFiltered: number }>(`/ar/report/api/balady/?${params.toString()}`);
            
            const mappedData: BaladyItem[] = response.data.map((item: any) => ({
                id: item.id,
                contract_number: item.contract_number || item.id.toString(),
                guest_name: item.guest_name,
                national_id: item.guest_id_number || '-',
                mobile: item.guest_phone || '-',
                check_in: item.check_in_date,
                check_out: item.check_out_date,
                unit_number: item.apartment_name,
                contract_date: item.created_at
            }));

            setData(mappedData);
            setPagination(p => ({ ...p, totalRecords: response.recordsFiltered }));
        } catch (error) {
            console.error("Failed to fetch Balady report", error);
        } finally {
            setLoading(false);
        }
    }, [pagination.currentPage, pagination.itemsPerPage, endDate]);

    // Initial fetch? The screenshot shows search buttons, implying manual search. 
    // But generally reports load data or wait for search. Let's wait for user action or load if date present?
    // Let's auto-load.
    useEffect(() => {
        // Only fetch if end date is set? Or fetch all?
        // Spec says: check_out_date__lte. If empty, maybe get all.
        fetchData();
    }, [fetchData]);

    const handleSearch = () => {
        setPagination(p => ({ ...p, currentPage: 1 }));
        fetchData();
    };

    const handleExport = () => {
        const params = new URLSearchParams();
        if (endDate) params.append('check_out_date__lte', endDate);
        const url = `https://www.osusideas.online/ar/report/api/balady/export-excel-file/?${params.toString()}`;
        window.open(url, '_blank');
    };

    const totalPages = Math.ceil(pagination.totalRecords / pagination.itemsPerPage);

    return (
        <div className="space-y-6">
            {/* Filter Section */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{t('receipts.searchInfo')}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <div>
                        <label className={`block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                            {t('bookings.th_checkOutDate')}
                        </label>
                        <DatePicker value={endDate} onChange={setEndDate} />
                    </div>
                    <div className="flex gap-2 justify-end">
                        <button onClick={handleSearch} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                            <MagnifyingGlassIcon className="w-5 h-5" />
                            {t('phone.search')}
                        </button>
                        <button onClick={handleExport} className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-2">
                            <ArrowDownTrayIcon className="w-5 h-5" />
                            {t('units.export')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <span>{t('units.showing')}</span>
                        <select
                            value={pagination.itemsPerPage}
                            onChange={(e) => setPagination(p => ({...p, itemsPerPage: Number(e.target.value), currentPage: 1}))}
                            className="py-1 px-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                        <span>{t('units.entries')}</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-center text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-100 dark:bg-slate-700 dark:text-slate-300 border-b dark:border-slate-600">
                            <tr>
                                <th className="px-4 py-3">#</th>
                                <th className="px-4 py-3">{t('bookings.bookingNumber')}</th> {/* Using as Contract Number */}
                                <th className="px-4 py-3">{t('bookings.th_guestName')}</th>
                                <th className="px-4 py-3">{t('guests.th_idNumber')}</th>
                                <th className="px-4 py-3">{t('guests.th_mobileNumber')}</th>
                                <th className="px-4 py-3">{t('bookings.th_checkInDate')}</th>
                                <th className="px-4 py-3">{t('bookings.th_checkOutDate')}</th>
                                <th className="px-4 py-3">{t('bookings.th_unitName')}</th>
                                <th className="px-4 py-3">{t('orders.th_value')}</th>
                                <th className="px-4 py-3">{t('bookings.notes')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={10} className="py-8 text-center">Loading...</td></tr>
                            ) : data.length === 0 ? (
                                <tr><td colSpan={10} className="py-8 text-center">{t('orders.noData')}</td></tr>
                            ) : data.map((item, idx) => (
                                <tr key={item.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    <td className="px-4 py-3">{(pagination.currentPage - 1) * pagination.itemsPerPage + idx + 1}</td>
                                    <td className="px-4 py-3">{item.contract_number}</td>
                                    <td className="px-4 py-3">{item.guest_name}</td>
                                    <td className="px-4 py-3">{item.national_id}</td>
                                    <td className="px-4 py-3">{item.mobile}</td>
                                    <td className="px-4 py-3" dir="ltr">{item.check_in ? new Date(item.check_in).toLocaleDateString() : '-'}</td>
                                    <td className="px-4 py-3" dir="ltr">{item.check_out ? new Date(item.check_out).toLocaleDateString() : '-'}</td>
                                    <td className="px-4 py-3">{item.unit_number}</td>
                                    <td className="px-4 py-3">{item.contract_date || '-'}</td>
                                    <td className="px-4 py-3">-</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t dark:border-slate-700 mt-4">
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                        {`${t('units.showing')} ${data.length > 0 ? (pagination.currentPage - 1) * pagination.itemsPerPage + 1 : 0} ${t('units.to')} ${Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalRecords)} ${t('units.of')} ${pagination.totalRecords} ${t('units.entries')}`}
                    </div>
                    <nav className="flex items-center gap-1">
                        <button onClick={() => setPagination(p => ({...p, currentPage: Math.max(1, p.currentPage - 1)}))} disabled={pagination.currentPage === 1} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"><ChevronLeftIcon className="w-5 h-5" /></button>
                        <span className="text-sm font-semibold px-2">{pagination.currentPage} / {totalPages || 1}</span>
                        <button onClick={() => setPagination(p => ({...p, currentPage: Math.min(totalPages, p.currentPage + 1)}))} disabled={pagination.currentPage === totalPages || totalPages === 0} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"><ChevronRightIcon className="w-5 h-5" /></button>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default ReportBalady;
