import React, { useState, useEffect, useContext, useCallback } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { fetchBalady } from '../services/reports';
import ArrowDownTrayIcon from './icons-redesign/ArrowDownTrayIcon';
import ChevronLeftIcon from './icons-redesign/ChevronLeftIcon';
import ChevronRightIcon from './icons-redesign/ChevronRightIcon';
import MagnifyingGlassIcon from './icons-redesign/MagnifyingGlassIcon';
import PrinterIcon from './icons-redesign/PrinterIcon';
import ErrorModal from './ErrorModal';

interface BaladyItem {
    id: string;
    contract_number: string;
    guest_name: string;
    national_id: string; // guest_id_number
    mobile: string; // guest_phone
    check_in: string;
    check_out: string;
    unit_number: string; // apartment_name
    contract_date: string; // created_at
    status_display: string;
    rental_display: string;
    amount: number;
    total: number;
    balance: number;
}
// Inline Modal for Print Preview
const PrintPreviewModal: React.FC<{ isOpen: boolean; onClose: () => void; url: string; t: any }> = ({ isOpen, onClose, url, t }) => {
    if (!isOpen) return null;

    const handlePrintFrame = () => {
        const iframe = document.getElementById('print-frame') as HTMLIFrameElement;
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.print();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden ring-1 ring-slate-900/5">
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t('reportsPage.labels.printPreview')}</h3>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrintFrame}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium"
                        >
                            <PrinterIcon className="w-4 h-4" />
                            {t('receipts.print')}
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                        >
                            {t('common.close')}
                        </button>
                    </div>
                </div>
                <div className="flex-1 bg-slate-200/50 dark:bg-slate-900/50 p-6 overflow-hidden relative flex justify-center">
                    <iframe
                        id="print-frame"
                        src={url}
                        className="w-full h-full max-w-[210mm] shadow-lg bg-white"
                        style={{ aspectRatio: '210/297' }}
                        title="Report Preview"
                    />
                </div>
            </div>
        </div>
    );
};

const ReportBalady: React.FC = () => {
    const { t, language } = useContext(LanguageContext);
    const [data, setData] = useState<BaladyItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [pagination, setPagination] = useState({ currentPage: 1, itemsPerPage: 10, totalRecords: 0 });
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [printUrl, setPrintUrl] = useState('');

    // Filter State
    const currentYear = new Date().getFullYear();
    const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString());
    const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString());

    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i); // Last 2 years to next 2 years

    // ... fetchData ...
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const query: Record<string, any> = {
                start: (pagination.currentPage - 1) * pagination.itemsPerPage,
                length: pagination.itemsPerPage,
                check_out_date__lte: `${selectedMonth}/${selectedYear}`
            };

            const response = await fetchBalady(query);

            const mappedData: BaladyItem[] = (response.data || []).map((item: any) => ({
                id: item.id,
                contract_number: item.number || item.id.toString(),
                guest_name: item.guest || '-',
                national_id: item.guest_id_number || '-',
                mobile: item.guest_phone || '-',
                check_in: item.check_in_date,
                check_out: item.check_out_date,
                unit_number: item.apartment || '-',
                contract_date: item.created_at || '-',
                status_display: item.status_display || item.status,
                rental_display: item.rental_display || item.rental_type,
                amount: parseFloat(item.amount || 0),
                total: parseFloat(item.total || 0),
                balance: parseFloat(item.balance || 0)
            }));

            setData(mappedData);
            setPagination(p => ({ ...p, totalRecords: response.recordsFiltered || 0 }));
        } catch (error) {
            console.error("Failed to fetch Balady report", error);
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [pagination.currentPage, pagination.itemsPerPage, selectedMonth, selectedYear]);

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
            const query: Record<string, any> = {
                start: 0,
                length: 1000,
                check_out_date__lte: `${selectedMonth}/${selectedYear}`
            };

            const response = await fetchBalady(query);
            const exportData = (response.data || []).map((item: any) => ({
                contract_number: item.number || '-',
                guest_name: item.guest || '-',
                national_id: item.guest_id_number || '-',
                mobile: item.guest_phone || '-',
                check_in: item.check_in_date || '-',
                check_out: item.check_out_date || '-',
                unit_number: item.apartment || '-',
                status: item.status_display || item.status || '-',
                rental_type: item.rental_display || item.rental_type || '-',
                total: item.total || 0,
                balance: item.balance || 0
            }));

            const headers = [
                t('bookings.bookingNumber'),
                t('bookings.th_guestName'),
                t('guests.th_idNumber'),
                t('guests.th_mobileNumber'),
                t('bookings.th_checkInDate'),
                t('bookings.th_checkOutDate'),
                t('bookings.th_unitName'),
                t('bookings.th_status'),
                t('bookings.th_rentType'),
                t('bookings.th_total'),
                t('bookings.th_balance')
            ];

            const csvContent = [
                headers.join(','),
                ...exportData.map((item: any) => [
                    item.contract_number,
                    `"${item.guest_name}"`,
                    item.national_id,
                    item.mobile,
                    item.check_in,
                    item.check_out,
                    item.unit_number,
                    item.status,
                    item.rental_type,
                    item.total,
                    item.balance
                ].join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `balady_report_${selectedMonth}_${selectedYear}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error("Export failed", error);
            setErrorMessage("Export failed");
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = async () => {
        const params = new URLSearchParams();
        // Construct query similar to fetchData/handleExport
        // Balady report seems to filter by check_out_date__lte
        params.append('check_out_date__lte', `${selectedMonth}/${selectedYear}`);

        // Assumption: Endpoint follows pattern /reports/balady/print/
        const targetUrl = `https://www.osusideas.online/ar/hpanel/reports/balady/print/?${params.toString()}`;

        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            const response = await fetch(targetUrl, {
                headers: {
                    'Authorization': `JWT ${token}`,
                    'Accept-Language': language
                }
            });

            if (!response.ok) throw new Error("Failed to load print view");

            let htmlContent = await response.text();

            const baseUrl = 'https://www.osusideas.online';
            htmlContent = htmlContent
                .replace(/(href|src)=["']\/([^"']+)["']/g, `$1="${baseUrl}/$2"`);

            htmlContent = htmlContent.replace('<head>', `<head><base href="${baseUrl}/" />`);

            const blob = new Blob([htmlContent], { type: 'text/html' });
            const blobUrl = URL.createObjectURL(blob);

            setPrintUrl(blobUrl);
            setShowPrintModal(true);
        } catch (error) {
            console.error("Print preview failed", error);
            setErrorMessage("Failed to load print preview");
        } finally {
            setLoading(false);
        }
    };


    <div className="flex gap-2 justify-end">
        <button onClick={handleSearch} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <MagnifyingGlassIcon className="w-5 h-5" />
            {t('phone.search')}
        </button>
        <button onClick={handlePrint} className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2">
            <PrinterIcon className="w-5 h-5" />
            {t('receipts.print')}
        </button>
        <button onClick={handleExport} className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-2">
            <ArrowDownTrayIcon className="w-5 h-5" />
            {t('units.export')}
        </button>
    </div>

    // Duplicate methods removed

    const totalPages = Math.ceil(pagination.totalRecords / pagination.itemsPerPage);

    return (
        <div className="space-y-6">
            {/* Filter Section */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{t('receipts.searchInfo')}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <label className={`block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                            {t('datepicker.months')}
                        </label>
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                        >
                            {months.map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={`block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                            Year
                        </label>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                        >
                            {years.map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
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
                            onChange={(e) => setPagination(p => ({ ...p, itemsPerPage: Number(e.target.value), currentPage: 1 }))}
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
                                <th className="px-4 py-3">{t('bookings.bookingNumber')}</th>
                                <th className="px-4 py-3">{t('bookings.th_guestName')}</th>
                                <th className="px-4 py-3">{t('guests.th_idNumber')}</th>
                                <th className="px-4 py-3">{t('guests.th_mobileNumber')}</th>
                                <th className="px-4 py-3">{t('bookings.th_checkInDate')}</th>
                                <th className="px-4 py-3">{t('bookings.th_checkOutDate')}</th>
                                <th className="px-4 py-3">{t('bookings.th_unitName')}</th>
                                <th className="px-4 py-3">{t('bookings.th_status')}</th>
                                <th className="px-4 py-3">{t('bookings.th_rentType')}</th>
                                <th className="px-4 py-3">{t('bookings.th_total')}</th>
                                <th className="px-4 py-3">{t('bookings.th_balance')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={12} className="py-8 text-center">Loading...</td></tr>
                            ) : data.length === 0 ? (
                                <tr><td colSpan={12} className="py-8 text-center">{t('orders.noData')}</td></tr>
                            ) : data.map((item, idx) => (
                                <tr key={item.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    <td className="px-4 py-3">{(pagination.currentPage - 1) * pagination.itemsPerPage + idx + 1}</td>
                                    <td className="px-4 py-3">{item.contract_number}</td>
                                    <td className="px-4 py-3">{item.guest_name}</td>
                                    <td className="px-4 py-3">{item.national_id}</td>
                                    <td className="px-4 py-3">{item.mobile}</td>
                                    <td className="px-4 py-3" dir="ltr">{item.check_in}</td>
                                    <td className="px-4 py-3" dir="ltr">{item.check_out}</td>
                                    <td className="px-4 py-3">{item.unit_number}</td>
                                    <td className="px-4 py-3">{item.status_display}</td>
                                    <td className="px-4 py-3">{item.rental_display}</td>
                                    <td className="px-4 py-3">{item.total}</td>
                                    <td className="px-4 py-3">{item.balance}</td>
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
                        <button onClick={() => setPagination(p => ({ ...p, currentPage: Math.max(1, p.currentPage - 1) }))} disabled={pagination.currentPage === 1} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"><ChevronLeftIcon className="w-5 h-5" /></button>
                        <span className="text-sm font-semibold px-2">{pagination.currentPage} / {totalPages || 1}</span>
                        <button onClick={() => setPagination(p => ({ ...p, currentPage: Math.min(totalPages, p.currentPage + 1) }))} disabled={pagination.currentPage === totalPages || totalPages === 0} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"><ChevronRightIcon className="w-5 h-5" /></button>
                    </nav>
                </div>
            </div>

            <ErrorModal
                isOpen={!!errorMessage}
                onClose={() => setErrorMessage(null)}
                message={errorMessage}
            />

            <PrintPreviewModal
                isOpen={showPrintModal}
                onClose={() => setShowPrintModal(false)}
                url={printUrl}
                t={t}
            />
        </div>
    );
};

export default ReportBalady;
