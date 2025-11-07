import React, { useState, useMemo, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import ChevronLeftIcon from './icons-redesign/ChevronLeftIcon';
import ChevronRightIcon from './icons-redesign/ChevronRightIcon';
import PlusCircleIcon from './icons-redesign/PlusCircleIcon';
import XMarkIcon from './icons-redesign/XMarkIcon';
import PlusIcon from './icons-redesign/PlusIcon';
import ArrowPathIcon from './icons-redesign/ArrowPathIcon';
import { PeakTime } from '../types';

const mockPeakTimes: PeakTime[] = []; // Initially empty as per user request

const PeakTimesPage: React.FC = () => {
    const { t } = useContext(LanguageContext);
    const [peakTimes] = useState<PeakTime[]>(mockPeakTimes);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const totalPages = Math.ceil(peakTimes.length / itemsPerPage);
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return peakTimes.slice(startIndex, startIndex + itemsPerPage);
    }, [peakTimes, currentPage, itemsPerPage]);

     const tableHeaders = [
        { key: 'th_id', label: 'peakTimes.th_id', className: '' },
        { key: 'th_item', label: 'peakTimes.th_item', className: '' },
        { key: 'th_startDate', label: 'peakTimes.th_startDate', className: 'hidden sm:table-cell' },
        { key: 'th_endDate', label: 'peakTimes.th_endDate', className: 'hidden sm:table-cell' },
        { key: 'th_saturday', label: 'peakTimes.th_saturday', className: 'hidden md:table-cell' },
        { key: 'th_sunday', label: 'peakTimes.th_sunday', className: 'hidden md:table-cell' },
        { key: 'th_monday', label: 'peakTimes.th_monday', className: 'hidden lg:table-cell' },
        { key: 'th_tuesday', label: 'peakTimes.th_tuesday', className: 'hidden lg:table-cell' },
        { key: 'th_wednesday', label: 'peakTimes.th_wednesday', className: 'hidden xl:table-cell' },
        { key: 'th_thursday', label: 'peakTimes.th_thursday', className: 'hidden xl:table-cell' },
        { key: 'th_friday', label: 'peakTimes.th_friday', className: 'hidden xl:table-cell' },
        { key: 'th_createdAt', label: 'peakTimes.th_createdAt', className: 'hidden 2xl:table-cell' },
        { key: 'th_updatedAt', label: 'peakTimes.th_updatedAt', className: 'hidden 2xl:table-cell' },
        { key: 'th_actions', label: 'peakTimes.th_actions', className: '' },
    ];


    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{t('peakTimes.pageTitle')}</h2>
                 <button className="flex items-center gap-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                    <PlusCircleIcon className="w-5 h-5" />
                    <span>{t('peakTimes.addPeakTime')}</span>
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                <div className="flex justify-between items-center border-b dark:border-slate-700 pb-3 mb-4">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{t('apartmentPrices.searchInfo')}</h3>
                     <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <button className="p-1 hover:text-slate-700 dark:hover:text-slate-200"><XMarkIcon className="w-5 h-5"/></button>
                        <button className="p-1 hover:text-slate-700 dark:hover:text-slate-200"><PlusIcon className="w-5 h-5"/></button>
                        <button className="p-1 hover:text-slate-700 dark:hover:text-slate-200"><ArrowPathIcon className="w-5 h-5"/></button>
                    </div>
                </div>
                <div className="h-16"></div> 
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                 <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 mb-4">
                    <span>{t('units.showing')}</span>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
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
                                {tableHeaders.map(header => (
                                    <th key={header.key} className={`px-4 py-3 border dark:border-slate-600 whitespace-nowrap ${header.className}`}>{t(header.label as any)}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.length > 0 ? paginatedData.map(item => (
                                <tr key={item.id} className="bg-white dark:bg-slate-800">
                                    {/* Data cells will go here */}
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={tableHeaders.length} className="text-center py-10 text-slate-500 dark:text-slate-400 border dark:border-slate-700">
                                        {t('orders.noData')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                        {`${t('usersPage.showing')} 0 ${t('usersPage.to')} 0 ${t('usersPage.of')} 0 ${t('usersPage.entries')}`}
                    </div>
                    {totalPages > 0 && (
                         <nav className="flex items-center gap-1" aria-label="Pagination">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronLeftIcon className="w-5 h-5" /></button>
                             <span className="text-sm font-semibold px-2">{currentPage} / {totalPages}</span>
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronRightIcon className="w-5 h-5" /></button>
                        </nav>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PeakTimesPage;
