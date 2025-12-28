
import React, { useState, useContext, useMemo, useEffect } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import MagnifyingGlassIcon from './icons-redesign/MagnifyingGlassIcon';
import StarIcon from './icons-redesign/StarIcon';
import ArchiveBoxIcon from './icons-redesign/ArchiveBoxIcon';
import ChevronRightIcon from './icons-redesign/ChevronRightIcon';
import ChevronLeftIcon from './icons-redesign/ChevronLeftIcon';
import EyeIcon from './icons-redesign/EyeIcon';
import XMarkIcon from './icons-redesign/XMarkIcon';
import ErrorModal from './ErrorModal';
import { listArchiveLogs } from '../services/archives';
import { ArchiveLog } from '../types';

const archivesData = [
    { id: 'booking_archive', category: 'operational' },
    { id: 'guests_archive', category: 'operational' },
    { id: 'apartments_archive', category: 'operational' },
    { id: 'invoice_archive', category: 'financial' },
    { id: 'payment_vouchers_archive', category: 'financial' },
    { id: 'receipts_archive', category: 'financial' },
];

const categoryData = [
    { id: 'operational', nameKey: 'archivesPage.categories.operational' },
    { id: 'financial', nameKey: 'archivesPage.categories.financial' },
];

const ArchivesPage: React.FC = () => {
    const { t, language } = useContext(LanguageContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [favorites, setFavorites] = useState<string[]>([]);

    // Master-Detail State
    const [selectedArchiveId, setSelectedArchiveId] = useState<string | null>(null);
    const [logs, setLogs] = useState<ArchiveLog[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ currentPage: 1, itemsPerPage: 10, totalRecords: 0 });
    const [selectedLog, setSelectedLog] = useState<ArchiveLog | null>(null); // For details modal
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Query Param Mapper
    const getArchiveParams = (archiveId: string): Record<string, string> => {
        switch (archiveId) {
            case 'booking_archive': return { content_type__model: 'reservation' };
            case 'guests_archive': return { content_type__model: 'guest' };
            case 'apartments_archive': return { content_type__model: 'apartment' };
            case 'invoice_archive': return { content_type__model: 'invoice' };
            case 'payment_vouchers_archive': return { content_type__model: 'transaction', type: 'payment' };
            case 'receipts_archive': return { content_type__model: 'transaction', type: 'receipt' };
            default: return {};
        }
    };

    // Fetch Logs when archive is selected or page changes
    useEffect(() => {
        if (!selectedArchiveId) return;

        const fetchLogs = async () => {
            setLoading(true);
            try {
                const baseParams = getArchiveParams(selectedArchiveId);
                const params = new URLSearchParams({
                    ...baseParams,
                    start: ((pagination.currentPage - 1) * pagination.itemsPerPage).toString(),
                    length: pagination.itemsPerPage.toString(),
                });

                const response = await listArchiveLogs(params);
                setLogs(response.data);
                setPagination(prev => ({ ...prev, totalRecords: response.recordsFiltered }));
            } catch (error) {
                console.error("Failed to fetch archive logs", error);
                setErrorMessage(error instanceof Error ? error.message : t('common.unexpectedError'));
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, [selectedArchiveId, pagination.currentPage, pagination.itemsPerPage]);

    const handleToggleFavorite = (e: React.MouseEvent, archiveId: string) => {
        e.stopPropagation();
        setFavorites(prev =>
            prev.includes(archiveId)
                ? prev.filter(id => id !== archiveId)
                : [...prev, archiveId]
        );
    };

    const filteredArchives = useMemo(() => {
        return archivesData.filter(archive => {
            const title = t(`archivesPage.archives.${archive.id}.title` as any).toLowerCase();
            const description = t(`archivesPage.archives.${archive.id}.description` as any).toLowerCase();
            const lowerSearchTerm = searchTerm.toLowerCase();

            const matchesSearch = title.includes(lowerSearchTerm) || description.includes(lowerSearchTerm);

            if (activeCategory === 'all') return matchesSearch;
            if (activeCategory === 'favorites') return matchesSearch && favorites.includes(archive.id);
            return matchesSearch && archive.category === activeCategory;
        });
    }, [searchTerm, activeCategory, favorites, t]);

    const sidebarCategories = [
        { id: 'favorites', nameKey: 'archivesPage.favorites', icon: StarIcon },
        { id: 'all', nameKey: 'archivesPage.allArchives', icon: ArchiveBoxIcon },
        ...categoryData.map(c => ({ id: c.id, nameKey: c.nameKey, icon: ArchiveBoxIcon }))
    ];

    const totalPages = Math.ceil(pagination.totalRecords / pagination.itemsPerPage);

    // If an archive is selected, show the list (Detail View)
    if (selectedArchiveId) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => { setSelectedArchiveId(null); setLogs([]); }}
                            className={`flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors`}
                        >
                            <ChevronLeftIcon className={`w-5 h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
                            <span className="font-bold text-lg">{t('archivesPage.backToArchives')}</span>
                        </button>
                        <div className="h-6 w-px bg-slate-300 dark:bg-slate-700"></div>
                        <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                            {t(`archivesPage.archives.${selectedArchiveId}.title` as any)}
                        </h2>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-center text-slate-500 dark:text-slate-400">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-100 dark:bg-slate-700 dark:text-slate-300">
                                <tr>
                                    <th className="px-6 py-3">{t('archivesPage.th_actionType')}</th>
                                    <th className="px-6 py-3">{t('archivesPage.th_user')}</th>
                                    <th className="px-6 py-3">{t('archivesPage.th_role')}</th>
                                    <th className="px-6 py-3">{t('archivesPage.th_date')}</th>
                                    <th className="px-6 py-3">{t('archivesPage.th_details')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={5} className="py-8 text-center"><div className="flex justify-center items-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div></div></td></tr>
                                ) : logs.length === 0 ? (
                                    <tr><td colSpan={5} className="py-8 text-center text-slate-400">{t('orders.noData')}</td></tr>
                                ) : logs.map((log, idx) => (
                                    <tr key={idx} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${log.action_type.includes('إضافة') || log.action_type.includes('Create') ? 'bg-green-100 text-green-800' :
                                                log.action_type.includes('تعديل') || log.action_type.includes('Update') ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {log.action_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{log.action_by}</td>
                                        <td className="px-6 py-4">{log.role}</td>
                                        <td className="px-6 py-4" dir="ltr">{new Date(log.action_time).toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => setSelectedLog(log)}
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center justify-center gap-1 mx-auto"
                                            >
                                                <EyeIcon className="w-4 h-4" />
                                                <span>{t('archivesPage.viewDetails')}</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t dark:border-slate-700 mt-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                            <span>{t('archivesPage.showing')}</span>
                            <select
                                value={pagination.itemsPerPage}
                                onChange={(e) => setPagination(p => ({ ...p, itemsPerPage: Number(e.target.value), currentPage: 1 }))}
                                className="py-1 px-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                            <span>{t('archivesPage.entries')}</span>
                            <span className="mx-2 text-slate-400">|</span>
                            <span>{`${pagination.totalRecords > 0 ? (pagination.currentPage - 1) * pagination.itemsPerPage + 1 : 0} - ${Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalRecords)} ${t('archivesPage.of')} ${pagination.totalRecords}`}</span>
                        </div>
                        <nav className="flex items-center gap-1">
                            <button
                                onClick={() => setPagination(p => ({ ...p, currentPage: Math.max(1, p.currentPage - 1) }))}
                                disabled={pagination.currentPage === 1}
                                className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"
                            >
                                <ChevronLeftIcon className="w-5 h-5" />
                            </button>
                            <span className="text-sm font-semibold px-2">{pagination.currentPage} / {totalPages || 1}</span>
                            <button
                                onClick={() => setPagination(p => ({ ...p, currentPage: Math.min(totalPages, p.currentPage + 1) }))}
                                disabled={pagination.currentPage === totalPages || totalPages === 0}
                                className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"
                            >
                                <ChevronRightIcon className="w-5 h-5" />
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Log Details Modal */}
                {selectedLog && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedLog(null)}>
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                            <div className="p-4 border-b dark:border-slate-700 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{t('archivesPage.jsonSnapshot')}</h3>
                                <button onClick={() => setSelectedLog(null)} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500">
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="p-4 overflow-y-auto bg-slate-50 dark:bg-slate-900/50">
                                <pre className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono bg-slate-100 dark:bg-slate-900 p-4 rounded-lg border dark:border-slate-700">
                                    {JSON.stringify(selectedLog.data, null, 2)}
                                </pre>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Default View: Grid of Archives Categories
    return (
        <div className="flex flex-col md:flex-row-reverse gap-6">
            {/* Right Sidebar */}
            <aside className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm sticky top-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">{t('archivesPage.sidebarTitle')}</h3>
                    <nav className="space-y-2">
                        {sidebarCategories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors duration-150 ${activeCategory === cat.id
                                    ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                                    }`}
                            >
                                <cat.icon className="w-5 h-5" />
                                <span>{t(cat.nameKey as any)}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow w-full md:w-2/3">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm h-full">
                    <div className="relative mb-6">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t('archivesPage.searchPlaceholder')}
                            className="w-full py-3 px-4 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-200"
                        />
                    </div>

                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">{t('archivesPage.allArchives')}</h2>

                    <div className="space-y-6">
                        {categoryData.map(category => {
                            const archivesInCategory = filteredArchives.filter(r => r.category === category.id);
                            if (archivesInCategory.length === 0) return null;

                            return (
                                <div key={category.id}>
                                    <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-2 border-b dark:border-slate-700 pb-2">{t(category.nameKey as any)}</h3>
                                    <div className="space-y-2">
                                        {archivesInCategory.map(archive => (
                                            <div
                                                key={archive.id}
                                                onClick={() => setSelectedArchiveId(archive.id)}
                                                className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors duration-150 cursor-pointer group"
                                            >
                                                <div>
                                                    <h4 className="font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">{t(`archivesPage.archives.${archive.id}.title` as any)}</h4>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">{t(`archivesPage.archives.${archive.id}.description` as any)}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button onClick={(e) => handleToggleFavorite(e, archive.id)} aria-label="Toggle favorite" className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600">
                                                        <StarIcon className={`w-6 h-6 transition-colors ${favorites.includes(archive.id) ? 'text-yellow-400 fill-current' : 'text-slate-400 hover:text-yellow-400'}`} />
                                                    </button>
                                                    <ChevronLeftIcon className={`w-5 h-5 text-slate-400 transform ${language === 'en' ? 'rotate-180' : ''}`} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
            <ErrorModal
                isOpen={!!errorMessage}
                onClose={() => setErrorMessage(null)}
                message={errorMessage}
            />
        </div>
    );
};

export default ArchivesPage;
