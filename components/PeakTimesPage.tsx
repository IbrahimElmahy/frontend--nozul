
import React, { useState, useMemo, useContext, useEffect, useCallback } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import ChevronLeftIcon from './icons-redesign/ChevronLeftIcon';
import ChevronRightIcon from './icons-redesign/ChevronRightIcon';
import PlusCircleIcon from './icons-redesign/PlusCircleIcon';
import XMarkIcon from './icons-redesign/XMarkIcon';
import PlusIcon from './icons-redesign/PlusIcon';
import ArrowPathIcon from './icons-redesign/ArrowPathIcon';
import PencilSquareIcon from './icons-redesign/PencilSquareIcon';
import TrashIcon from './icons-redesign/TrashIcon';
import CheckIcon from './icons-redesign/CheckIcon';
import { PeakTime } from '../types';
import { listPeakTimes, createPeakTime, updatePeakTime, deletePeakTime } from '../services/peakTimes';
import AddPeakTimePanel from './AddPeakTimePanel';
import ConfirmationModal from './ConfirmationModal';

const PeakTimesPage: React.FC = () => {
    const { t } = useContext(LanguageContext);
    const [peakTimes, setPeakTimes] = useState<PeakTime[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // UI State
    const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
    const [editingPeakTime, setEditingPeakTime] = useState<PeakTime | null>(null);
    const [peakTimeToDelete, setPeakTimeToDelete] = useState<PeakTime | null>(null);

    const fetchPeakTimes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Note: The API documentation doesn't explicitly mention pagination params for GET,
            // but standard list endpoints usually support them. Using basic GET for now.
            const response = await listPeakTimes();
            setPeakTimes(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPeakTimes();
    }, [fetchPeakTimes]);

    const totalPages = Math.ceil(peakTimes.length / itemsPerPage);
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return peakTimes.slice(startIndex, startIndex + itemsPerPage);
    }, [peakTimes, currentPage, itemsPerPage]);

    const handleAddNewClick = () => {
        setEditingPeakTime(null);
        setIsAddPanelOpen(true);
    };

    const handleEditClick = (item: PeakTime) => {
        setEditingPeakTime(item);
        setIsAddPanelOpen(true);
    };

    const handleDeleteClick = (item: PeakTime) => {
        setPeakTimeToDelete(item);
    };

    const handleConfirmDelete = async () => {
        if (peakTimeToDelete) {
            try {
                await deletePeakTime(peakTimeToDelete.id);
                setPeakTimes(prev => prev.filter(p => p.id !== peakTimeToDelete.id));
                setPeakTimeToDelete(null);
            } catch (err) {
                alert(`Error deleting peak time: ${err instanceof Error ? err.message : 'Unknown error'}`);
            }
        }
    };

    const handleClosePanel = () => {
        setIsAddPanelOpen(false);
        setEditingPeakTime(null);
    };

    const handleSavePeakTime = async (formData: FormData) => {
        try {
            if (editingPeakTime) {
                await updatePeakTime(editingPeakTime.id, formData);
            } else {
                await createPeakTime(formData);
            }
            fetchPeakTimes();
            handleClosePanel();
        } catch (err) {
            alert(`Error saving peak time: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    };

    const tableHeaders = [
        { key: 'id', label: 'peakTimes.th_id', className: 'hidden sm:table-cell' },
        { key: 'start_date', label: 'peakTimes.th_startDate', className: '' },
        { key: 'end_date', label: 'peakTimes.th_endDate', className: '' },
        { key: 'sat', label: 'peakTimes.th_saturday', className: 'hidden md:table-cell text-center' },
        { key: 'sun', label: 'peakTimes.th_sunday', className: 'hidden md:table-cell text-center' },
        { key: 'mon', label: 'peakTimes.th_monday', className: 'hidden lg:table-cell text-center' },
        { key: 'tue', label: 'peakTimes.th_tuesday', className: 'hidden lg:table-cell text-center' },
        { key: 'wed', label: 'peakTimes.th_wednesday', className: 'hidden xl:table-cell text-center' },
        { key: 'thu', label: 'peakTimes.th_thursday', className: 'hidden xl:table-cell text-center' },
        { key: 'fri', label: 'peakTimes.th_friday', className: 'hidden xl:table-cell text-center' },
        { key: 'created_at', label: 'peakTimes.th_createdAt', className: 'hidden 2xl:table-cell' },
        { key: 'actions', label: 'peakTimes.th_actions', className: '' },
    ];

    const renderCheckMark = (checked: boolean) => (
        checked ? <CheckIcon className="w-5 h-5 text-green-500 inline-block" /> : <span className="text-slate-300">-</span>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{t('peakTimes.pageTitle')}</h2>
                <button onClick={handleAddNewClick} className="flex items-center gap-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                    <PlusCircleIcon className="w-5 h-5" />
                    <span>{t('peakTimes.addPeakTime')}</span>
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                <div className="flex justify-between items-center border-b dark:border-slate-700 pb-3 mb-4">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{t('apartmentPrices.searchInfo')}</h3>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <button className="p-1 hover:text-slate-700 dark:hover:text-slate-200"><XMarkIcon className="w-5 h-5" /></button>
                        <button onClick={fetchPeakTimes} className="p-1 hover:text-slate-700 dark:hover:text-slate-200"><ArrowPathIcon className="w-5 h-5" /></button>
                    </div>
                </div>
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
                            {loading ? (
                                <tr><td colSpan={tableHeaders.length} className="text-center py-10">Loading...</td></tr>
                            ) : error ? (
                                <tr><td colSpan={tableHeaders.length} className="text-center py-10 text-red-500">{error}</td></tr>
                            ) : paginatedData.length > 0 ? paginatedData.map(item => (
                                <tr key={item.id} className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    <td className="px-4 py-3 border dark:border-slate-700 hidden sm:table-cell">{item.id}</td>
                                    <td className="px-4 py-3 border dark:border-slate-700">{item.start_date}</td>
                                    <td className="px-4 py-3 border dark:border-slate-700">{item.end_date}</td>
                                    <td className="px-4 py-3 border dark:border-slate-700 hidden md:table-cell">{renderCheckMark(item.sat)}</td>
                                    <td className="px-4 py-3 border dark:border-slate-700 hidden md:table-cell">{renderCheckMark(item.sun)}</td>
                                    <td className="px-4 py-3 border dark:border-slate-700 hidden lg:table-cell">{renderCheckMark(item.mon)}</td>
                                    <td className="px-4 py-3 border dark:border-slate-700 hidden lg:table-cell">{renderCheckMark(item.tue)}</td>
                                    <td className="px-4 py-3 border dark:border-slate-700 hidden xl:table-cell">{renderCheckMark(item.wed)}</td>
                                    <td className="px-4 py-3 border dark:border-slate-700 hidden xl:table-cell">{renderCheckMark(item.thu)}</td>
                                    <td className="px-4 py-3 border dark:border-slate-700 hidden xl:table-cell">{renderCheckMark(item.fri)}</td>
                                    <td className="px-4 py-3 border dark:border-slate-700 hidden 2xl:table-cell">{new Date(item.created_at).toLocaleDateString()}</td>
                                    <td className="px-4 py-3 border dark:border-slate-700">
                                        <div className="flex items-center justify-center gap-1">
                                            <button onClick={() => handleEditClick(item)} className="p-1.5 rounded-full text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-500/10"><PencilSquareIcon className="w-5 h-5" /></button>
                                            <button onClick={() => handleDeleteClick(item)} className="p-1.5 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10"><TrashIcon className="w-5 h-5" /></button>
                                        </div>
                                    </td>
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
                        {`${t('units.showing')} ${paginatedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} ${t('units.to')} ${Math.min(currentPage * itemsPerPage, peakTimes.length)} ${t('units.of')} ${peakTimes.length} ${t('units.entries')}`}
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

            <AddPeakTimePanel
                isOpen={isAddPanelOpen}
                onClose={handleClosePanel}
                onSave={handleSavePeakTime}
                initialData={editingPeakTime}
                isEditing={!!editingPeakTime}
            />

            <ConfirmationModal
                isOpen={!!peakTimeToDelete}
                onClose={() => setPeakTimeToDelete(null)}
                onConfirm={handleConfirmDelete}
                title={t('peakTimes.deletePeakTimeTitle')}
                message={t('peakTimes.confirmDeleteMessage')}
            />
        </div>
    );
};

export default PeakTimesPage;
