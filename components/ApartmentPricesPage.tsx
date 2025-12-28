import React, { useState, useMemo, useContext, useEffect, useCallback } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { ApartmentPrice } from '../types';
import MagnifyingGlassIcon from './icons-redesign/MagnifyingGlassIcon';
import ChevronLeftIcon from './icons-redesign/ChevronLeftIcon';
import ChevronRightIcon from './icons-redesign/ChevronRightIcon';
import PencilSquareIcon from './icons-redesign/PencilSquareIcon';
import EyeIcon from './icons-redesign/EyeIcon';
import ApartmentPriceEditPanel from './ApartmentPriceEditPanel';
import { listApartmentPrices } from '../services/prices';

const ApartmentPricesPage: React.FC = () => {
    const { t } = useContext(LanguageContext);
    const [prices, setPrices] = useState<ApartmentPrice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({ currentPage: 1, itemsPerPage: 10, totalRecords: 0 });

    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [panelMode, setPanelMode] = useState<'view' | 'edit'>('view');
    const [selectedPriceData, setSelectedPriceData] = useState<ApartmentPrice | null>(null);

    const fetchPrices = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            params.append('start', ((pagination.currentPage - 1) * pagination.itemsPerPage).toString());
            params.append('length', pagination.itemsPerPage.toString());
            if (searchTerm) params.append('search', searchTerm);

            const response = await listApartmentPrices(params);

            setPrices(response.data);
            setPagination(p => ({ ...p, totalRecords: response.recordsFiltered }));

        } catch (err) {
            setError(err instanceof Error ? err.message : t('common.unexpectedError'));
        } finally {
            setLoading(false);
        }
    }, [pagination.currentPage, pagination.itemsPerPage, searchTerm]);

    useEffect(() => {
        fetchPrices();
    }, [fetchPrices]);

    useEffect(() => {
        setPagination(p => ({ ...p, currentPage: 1 }));
    }, [searchTerm, pagination.itemsPerPage]);


    const totalPages = Math.ceil(pagination.totalRecords / pagination.itemsPerPage);

    const handleViewClick = (item: ApartmentPrice) => {
        setSelectedPriceData(item);
        setPanelMode('view');
        setIsPanelOpen(true);
    };

    const handleEditClick = (item: ApartmentPrice) => {
        setSelectedPriceData(item);
        setPanelMode('edit');
        setIsPanelOpen(true);
    };

    const handleClosePanel = () => {
        setIsPanelOpen(false);
        setSelectedPriceData(null);
    };

    const handleSavePrice = (updatedData: ApartmentPrice) => {
        setPrices(prev => prev.map(p => p.id === updatedData.id ? updatedData : p));
        handleClosePanel();
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{t('apartmentPrices.pageTitle')}</h2>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                <div className="relative w-full sm:w-auto sm:flex-grow max-w-lg">
                    <MagnifyingGlassIcon className="absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 left-3" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t('guests.searchPlaceholder')}
                        className="w-full py-2 pl-10 pr-4 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-200"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 mb-4">
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

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-center text-slate-500 dark:text-slate-400 border-collapse">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                            <tr>
                                <th rowSpan={2} className="px-2 py-3 border dark:border-slate-600">{t('apartmentPrices.th_apartment')}</th>
                                <th rowSpan={2} className="px-6 py-3 border dark:border-slate-600 hidden lg:table-cell">{t('apartmentPrices.th_roomType')}</th>
                                <th rowSpan={2} className="px-2 py-3 border dark:border-slate-600 hidden xl:table-cell">{t('apartmentPrices.th_floor')}</th>
                                <th rowSpan={2} className="px-2 py-3 border dark:border-slate-600 hidden xl:table-cell">{t('apartmentPrices.th_rooms')}</th>
                                <th colSpan={2} className="px-6 py-3 border dark:border-slate-600 hidden sm:table-cell">{t('apartmentPrices.th_hourly')}</th>
                                <th colSpan={2} className="px-6 py-3 border dark:border-slate-600 hidden md:table-cell">{t('apartmentPrices.th_daily')}</th>
                                <th colSpan={2} className="px-6 py-3 border dark:border-slate-600 hidden lg:table-cell">{t('apartmentPrices.th_monthly')}</th>
                                <th colSpan={1} className="px-6 py-3 border dark:border-slate-600 hidden xl:table-cell">{t('apartmentPrices.th_peak')}</th>
                                <th rowSpan={2} className="px-6 py-3 border dark:border-slate-600">{t('apartmentPrices.th_action')}</th>
                            </tr>
                            <tr>
                                <th className="px-2 py-2 font-medium border dark:border-slate-600 hidden sm:table-cell">{t('apartmentPrices.th_price')}</th>
                                <th className="px-2 py-2 font-medium border dark:border-slate-600 hidden sm:table-cell">{t('apartmentPrices.th_lowestPrice')}</th>
                                <th className="px-2 py-2 font-medium border dark:border-slate-600 hidden md:table-cell">{t('apartmentPrices.th_price')}</th>
                                <th className="px-2 py-2 font-medium border dark:border-slate-600 hidden md:table-cell">{t('apartmentPrices.th_lowestPrice')}</th>
                                <th className="px-2 py-2 font-medium border dark:border-slate-600 hidden lg:table-cell">{t('apartmentPrices.th_price')}</th>
                                <th className="px-2 py-2 font-medium border dark:border-slate-600 hidden lg:table-cell">{t('apartmentPrices.th_lowestPrice')}</th>
                                <th className="px-2 py-2 font-medium border dark:border-slate-600 hidden xl:table-cell">{t('apartmentPrices.th_price')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={12} className="text-center py-10"><div className="flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div></div></td></tr>
                            ) : error ? (
                                <tr><td colSpan={12} className="text-center py-10 text-red-500">{error}</td></tr>
                            ) : prices.map(item => (
                                <tr key={item.id} className="bg-white dark:bg-slate-800">
                                    <td className="px-6 py-2 font-medium text-slate-900 dark:text-white border dark:border-slate-700">{item.apartment}</td>
                                    <td className="px-6 py-2 hidden lg:table-cell border dark:border-slate-700">{item.apartment_type}</td>
                                    <td className="px-2 py-2 hidden xl:table-cell border dark:border-slate-700">{item.floor}</td>
                                    <td className="px-2 py-2 hidden xl:table-cell border dark:border-slate-700">{item.rooms}</td>
                                    <td className="px-2 py-2 hidden sm:table-cell border dark:border-slate-700">{item.hourly_price}</td>
                                    <td className="px-2 py-2 hidden sm:table-cell border dark:border-slate-700">{item.hourly_minimum_price}</td>
                                    <td className="px-2 py-2 hidden md:table-cell border dark:border-slate-700">{item.regular_price}</td>
                                    <td className="px-2 py-2 hidden md:table-cell border dark:border-slate-700">{item.regular_minimum_price}</td>
                                    <td className="px-2 py-2 hidden lg:table-cell border dark:border-slate-700">{item.monthly_price}</td>
                                    <td className="px-2 py-2 hidden lg:table-cell border dark:border-slate-700">{item.monthly_minimum_price}</td>
                                    <td className="px-2 py-2 hidden xl:table-cell border dark:border-slate-700">{item.peak_price}</td>
                                    <td className="px-6 py-2 border dark:border-slate-700">
                                        <div className="flex items-center justify-center gap-1">
                                            <button onClick={() => handleViewClick(item)} className="p-1.5 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/10"><EyeIcon className="w-5 h-5" /></button>
                                            <button onClick={() => handleEditClick(item)} className="p-1.5 rounded-full text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-500/10"><PencilSquareIcon className="w-5 h-5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                        {`${t('usersPage.showing' as any)} ${pagination.totalRecords > 0 ? (pagination.currentPage - 1) * pagination.itemsPerPage + 1 : 0} ${t('usersPage.to' as any)} ${Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalRecords)} ${t('usersPage.of' as any)} ${pagination.totalRecords} ${t('usersPage.entries' as any)}`}
                    </div>
                    {totalPages > 1 && (
                        <nav className="flex items-center gap-1" aria-label="Pagination">
                            <button onClick={() => setPagination(p => ({ ...p, currentPage: Math.max(1, p.currentPage - 1) }))} disabled={pagination.currentPage === 1} className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronLeftIcon className="w-5 h-5" /></button>
                            <span className="text-sm font-semibold px-2">{pagination.currentPage} / {totalPages}</span>
                            <button onClick={() => setPagination(p => ({ ...p, currentPage: Math.min(totalPages, p.currentPage + 1) }))} disabled={pagination.currentPage === totalPages} className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronRightIcon className="w-5 h-5" /></button>
                        </nav>
                    )}
                </div>
            </div>

            <ApartmentPriceEditPanel
                isOpen={isPanelOpen}
                onClose={handleClosePanel}
                onSave={handleSavePrice}
                data={selectedPriceData}
                mode={panelMode}
            />
        </div>
    );
};

export default ApartmentPricesPage;