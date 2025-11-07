import React, { useState, useMemo, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { ApartmentPrice } from '../types';
import MagnifyingGlassIcon from './icons-redesign/MagnifyingGlassIcon';
import ChevronLeftIcon from './icons-redesign/ChevronLeftIcon';
import ChevronRightIcon from './icons-redesign/ChevronRightIcon';
import PencilSquareIcon from './icons-redesign/PencilSquareIcon';
import XMarkIcon from './icons-redesign/XMarkIcon';
import PlusIcon from './icons-redesign/PlusIcon';
import ArrowPathIcon from './icons-redesign/ArrowPathIcon';
import EyeIcon from './icons-redesign/EyeIcon';
import ApartmentPriceEditPanel from './ApartmentPriceEditPanel';

const mockPrices: ApartmentPrice[] = [
    { id: 1, apartmentName: '302', roomType: 'غرفة وصالة', floor: 1, rooms: 1, price: 50, dailyPrice: 200, dailyLowestPrice: 35, monthlyPrice: 2000, monthlyLowestPrice: 175, peakPrice: 2000, peakLowestPrice: 1750 },
    { id: 2, apartmentName: '207', roomType: 'غرفة مفردة', floor: 1, rooms: 1, price: 0, dailyPrice: 0, dailyLowestPrice: 0, monthlyPrice: 0, monthlyLowestPrice: 0, peakPrice: 0, peakLowestPrice: 0 },
    { id: 3, apartmentName: '55', roomType: 'غرفة مفردة', floor: 4, rooms: 1, price: 60, dailyPrice: 150, dailyLowestPrice: 50, monthlyPrice: 1500, monthlyLowestPrice: 120, peakPrice: 1500, peakLowestPrice: 1200 },
    { id: 4, apartmentName: '306', roomType: 'غرفة مفردة', floor: 1, rooms: 1, price: 0, dailyPrice: 0, dailyLowestPrice: 0, monthlyPrice: 0, monthlyLowestPrice: 0, peakPrice: 0, peakLowestPrice: 0 },
    { id: 5, apartmentName: '105', roomType: 'غرفة مفردة', floor: 1, rooms: 1, price: 0, dailyPrice: 0, dailyLowestPrice: 0, monthlyPrice: 0, monthlyLowestPrice: 0, peakPrice: 0, peakLowestPrice: 0 },
    { id: 6, apartmentName: '204', roomType: 'غرفة مفردة', floor: 2, rooms: 1, price: 0, dailyPrice: 0, dailyLowestPrice: 0, monthlyPrice: 0, monthlyLowestPrice: 0, peakPrice: 0, peakLowestPrice: 0 },
    { id: 7, apartmentName: '107', roomType: 'غرفة مفردة', floor: 1, rooms: 2, price: 0, dailyPrice: 0, dailyLowestPrice: 0, monthlyPrice: 0, monthlyLowestPrice: 0, peakPrice: 0, peakLowestPrice: 0 },
    { id: 8, apartmentName: '506', roomType: 'غرفة مفردة', floor: 1, rooms: 1, price: 0, dailyPrice: 0, dailyLowestPrice: 0, monthlyPrice: 0, monthlyLowestPrice: 0, peakPrice: 0, peakLowestPrice: 0 },
    { id: 9, apartmentName: '402', roomType: 'غرفة مفردة', floor: 1, rooms: 2, price: 0, dailyPrice: 0, dailyLowestPrice: 0, monthlyPrice: 0, monthlyLowestPrice: 0, peakPrice: 0, peakLowestPrice: 0 },
    { id: 10, apartmentName: '304', roomType: 'غرفة مفردة', floor: 1, rooms: 1, price: 0, dailyPrice: 0, dailyLowestPrice: 0, monthlyPrice: 0, monthlyLowestPrice: 0, peakPrice: 0, peakLowestPrice: 0 },
];

const ApartmentPricesPage: React.FC = () => {
    const { t, language } = useContext(LanguageContext);
    const [prices, setPrices] = useState<ApartmentPrice[]>(mockPrices);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Panel state
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [panelMode, setPanelMode] = useState<'view' | 'edit'>('view');
    const [selectedPriceData, setSelectedPriceData] = useState<ApartmentPrice | null>(null);


    const filteredData = useMemo(() => {
        return prices.filter(item =>
            item.apartmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.roomType.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [prices, searchTerm]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, currentPage, itemsPerPage]);

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
                        </select>
                        <span>{t('units.entries')}</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-center text-slate-500 dark:text-slate-400 border-collapse">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                            <tr>
                                <th rowSpan={2} className="px-2 py-3 border dark:border-slate-600">{t('apartmentPrices.th_id')}</th>
                                <th rowSpan={2} className="px-6 py-3 border dark:border-slate-600">{t('apartmentPrices.th_apartment')}</th>
                                <th rowSpan={2} className="px-6 py-3 border dark:border-slate-600 hidden lg:table-cell">{t('apartmentPrices.th_roomType')}</th>
                                <th rowSpan={2} className="px-2 py-3 border dark:border-slate-600 hidden xl:table-cell">{t('apartmentPrices.th_floor')}</th>
                                <th rowSpan={2} className="px-2 py-3 border dark:border-slate-600 hidden xl:table-cell">{t('apartmentPrices.th_rooms')}</th>
                                <th rowSpan={2} className="px-2 py-3 border dark:border-slate-600 hidden sm:table-cell">{t('apartmentPrices.th_price')}</th>
                                <th colSpan={2} className="px-6 py-3 border dark:border-slate-600 hidden md:table-cell">{t('apartmentPrices.th_daily')}</th>
                                <th colSpan={2} className="px-6 py-3 border dark:border-slate-600 hidden lg:table-cell">{t('apartmentPrices.th_monthly')}</th>
                                <th colSpan={2} className="px-6 py-3 border dark:border-slate-600 hidden xl:table-cell">{t('apartmentPrices.th_peak')}</th>
                                <th rowSpan={2} className="px-6 py-3 border dark:border-slate-600">{t('apartmentPrices.th_action')}</th>
                            </tr>
                            <tr>
                                <th className="px-2 py-2 font-medium border dark:border-slate-600 hidden md:table-cell">{t('apartmentPrices.th_price')}</th>
                                <th className="px-2 py-2 font-medium border dark:border-slate-600 hidden md:table-cell">{t('apartmentPrices.th_lowestPrice')}</th>
                                <th className="px-2 py-2 font-medium border dark:border-slate-600 hidden lg:table-cell">{t('apartmentPrices.th_price')}</th>
                                <th className="px-2 py-2 font-medium border dark:border-slate-600 hidden lg:table-cell">{t('apartmentPrices.th_lowestPrice')}</th>
                                <th className="px-2 py-2 font-medium border dark:border-slate-600 hidden xl:table-cell">{t('apartmentPrices.th_price')}</th>
                                <th className="px-2 py-2 font-medium border dark:border-slate-600 hidden xl:table-cell">{t('apartmentPrices.th_lowestPrice')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map(item => (
                                <tr key={item.id} className="bg-white dark:bg-slate-800">
                                    <td className="px-2 py-2 border dark:border-slate-700">{item.id}</td>
                                    <td className="px-6 py-2 font-medium text-slate-900 dark:text-white border dark:border-slate-700">{item.apartmentName}</td>
                                    <td className="px-6 py-2 hidden lg:table-cell border dark:border-slate-700">{item.roomType}</td>
                                    <td className="px-2 py-2 hidden xl:table-cell border dark:border-slate-700">{item.floor}</td>
                                    <td className="px-2 py-2 hidden xl:table-cell border dark:border-slate-700">{item.rooms}</td>
                                    <td className="px-2 py-2 hidden sm:table-cell border dark:border-slate-700">{item.price}</td>
                                    <td className="px-2 py-2 hidden md:table-cell border dark:border-slate-700">{item.dailyPrice}</td>
                                    <td className="px-2 py-2 hidden md:table-cell border dark:border-slate-700">{item.dailyLowestPrice}</td>
                                    <td className="px-2 py-2 hidden lg:table-cell border dark:border-slate-700">{item.monthlyPrice}</td>
                                    <td className="px-2 py-2 hidden lg:table-cell border dark:border-slate-700">{item.monthlyLowestPrice}</td>
                                    <td className="px-2 py-2 hidden xl:table-cell border dark:border-slate-700">{item.peakPrice}</td>
                                    <td className="px-2 py-2 hidden xl:table-cell border dark:border-slate-700">{item.peakLowestPrice}</td>
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
                        {`${t('usersPage.showing')} ${filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} ${t('usersPage.to')} ${Math.min(currentPage * itemsPerPage, filteredData.length)} ${t('usersPage.of')} ${filteredData.length} ${t('usersPage.entries')}`}
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
