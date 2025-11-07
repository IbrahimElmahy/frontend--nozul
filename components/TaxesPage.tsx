import React, { useState, useMemo, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Tax } from '../types';
import PlusCircleIcon from './icons-redesign/PlusCircleIcon';
import XMarkIcon from './icons-redesign/XMarkIcon';
import PlusIcon from './icons-redesign/PlusIcon';
import ArrowPathIcon from './icons-redesign/ArrowPathIcon';
import ChevronLeftIcon from './icons-redesign/ChevronLeftIcon';
import ChevronRightIcon from './icons-redesign/ChevronRightIcon';
import EyeIcon from './icons-redesign/EyeIcon';
import PencilSquareIcon from './icons-redesign/PencilSquareIcon';
import TrashIcon from './icons-redesign/TrashIcon';

const mockTaxes: Tax[] = [
    { id: 1, name: 'القيمة المضافة', tax: 15.0, applyTo: 'الحجوزات', startDate: '2025-01-07 01:00:00', endDate: '2031-01-09 01:00:00', addedToFees: false, subjectToVat: false, status: 'مفعل', createdAt: '2025-01-07 18:28:35', updatedAt: '2025-06-07 13:59:44' },
    { id: 2, name: 'القيمة المضافة', tax: 15.0, applyTo: 'الخدمات', startDate: '2025-10-07 00:00:00', endDate: '2026-02-26 01:00:00', addedToFees: false, subjectToVat: false, status: 'مفعل', createdAt: '2025-10-07 14:21:10', updatedAt: '2025-10-07 14:21:10' },
];

const TaxesPage: React.FC = () => {
    const { t } = useContext(LanguageContext);
    const [taxes] = useState<Tax[]>(mockTaxes);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const totalPages = Math.ceil(taxes.length / itemsPerPage);
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return taxes.slice(startIndex, startIndex + itemsPerPage);
    }, [taxes, currentPage, itemsPerPage]);

    const tableHeaders = [
        { key: 'th_id', className: '' },
        { key: 'th_name', className: '' },
        { key: 'th_tax', className: 'hidden sm:table-cell' },
        { key: 'th_applyTo', className: 'hidden sm:table-cell' },
        { key: 'th_startDate', className: 'hidden md:table-cell' },
        { key: 'th_endDate', className: 'hidden md:table-cell' },
        { key: 'th_addedToFees', className: 'hidden lg:table-cell' },
        { key: 'th_subjectToVat', className: 'hidden lg:table-cell' },
        { key: 'th_status', className: '' },
        { key: 'th_createdAt', className: 'hidden xl:table-cell' },
        { key: 'th_updatedAt', className: 'hidden xl:table-cell' },
        { key: 'th_actions', className: '' },
    ];
    
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{t('taxes.pageTitle')}</h2>
                 <button className="flex items-center gap-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                    <PlusCircleIcon className="w-5 h-5" />
                    <span>{t('taxes.addTax')}</span>
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                <div className="flex justify-between items-center border-b dark:border-slate-700 pb-3 mb-4">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{t('receipts.searchInfo')}</h3>
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
                    </select>
                    <span>{t('units.entries')}</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-center text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                            <tr>
                                {tableHeaders.map(header => (
                                    <th key={header.key} scope="col" className={`px-4 py-3 whitespace-nowrap ${header.className}`}>{t(`taxes.${header.key}` as any)}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map(tax => (
                                <tr key={tax.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
                                    <td className="px-4 py-2">{tax.id}</td>
                                    <td className="px-4 py-2">{tax.name}</td>
                                    <td className="px-4 py-2 hidden sm:table-cell">{tax.tax.toFixed(1)}%</td>
                                    <td className="px-4 py-2 hidden sm:table-cell">{tax.applyTo}</td>
                                    <td className="px-4 py-2 hidden md:table-cell">{tax.startDate}</td>
                                    <td className="px-4 py-2 hidden md:table-cell">{tax.endDate}</td>
                                    <td className="px-4 py-2 hidden lg:table-cell"><input type="checkbox" checked={tax.addedToFees} readOnly className="form-checkbox h-4 w-4 text-blue-600 rounded" /></td>
                                    <td className="px-4 py-2 hidden lg:table-cell"><input type="checkbox" checked={tax.subjectToVat} readOnly className="form-checkbox h-4 w-4 text-blue-600 rounded" /></td>
                                    <td className="px-4 py-2">
                                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                            {tax.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 hidden xl:table-cell">{tax.createdAt}</td>
                                    <td className="px-4 py-2 hidden xl:table-cell">{tax.updatedAt}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex items-center justify-center gap-1">
                                            <button className="p-1.5 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/10"><EyeIcon className="w-5 h-5" /></button>
                                            <button className="p-1.5 rounded-full text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-500/10"><PencilSquareIcon className="w-5 h-5" /></button>
                                            <button className="p-1.5 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10"><TrashIcon className="w-5 h-5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                        {`${t('usersPage.showing')} ${paginatedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} ${t('usersPage.to')} ${Math.min(currentPage * itemsPerPage, paginatedData.length)} ${t('usersPage.of')} ${taxes.length} ${t('usersPage.entries')}`}
                    </div>
                    {totalPages > 1 && (
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

export default TaxesPage;