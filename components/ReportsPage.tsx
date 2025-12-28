
import React, { useState, useContext, useMemo } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import MagnifyingGlassIcon from './icons-redesign/MagnifyingGlassIcon';
import StarIcon from './icons-redesign/StarIcon';
import ArchiveBoxIcon from './icons-redesign/ArchiveBoxIcon';
import ChevronLeftIcon from './icons-redesign/ChevronLeftIcon';
import ReportDailyBookings from './ReportDailyBookings';
import ReportBalady from './ReportBalady';
import ReportFinancial from './ReportFinancial';
import ReportFundMovement from './ReportFundMovement';
import ReportAccountStatement from './ReportAccountStatement';

const reportsData = [
    { id: 'cash_flow', category: 'financial', component: ReportFundMovement },
    { id: 'account_statement', category: 'financial', component: ReportAccountStatement },
    { id: 'balady', category: 'operational', component: ReportBalady },
    { id: 'daily_bookings', category: 'operational', component: ReportDailyBookings },
];

const categoryData = [
    { id: 'financial', nameKey: 'reportsPage.categories.financial' },
    { id: 'operational', nameKey: 'reportsPage.categories.operational' },
];

const ReportsPage: React.FC = () => {
    const { t, language } = useContext(LanguageContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [favorites, setFavorites] = useState<string[]>([]);
    const [activeReportId, setActiveReportId] = useState<string | null>(null);

    const handleToggleFavorite = (e: React.MouseEvent, reportId: string) => {
        e.stopPropagation();
        setFavorites(prev =>
            prev.includes(reportId)
                ? prev.filter(id => id !== reportId)
                : [...prev, reportId]
        );
    };

    const filteredReports = useMemo(() => {
        return reportsData.filter(report => {
            const title = t(`reportsPage.reports.${report.id}.title` as any).toLowerCase();
            const description = t(`reportsPage.reports.${report.id}.description` as any).toLowerCase();
            const lowerSearchTerm = searchTerm.toLowerCase();

            const matchesSearch = title.includes(lowerSearchTerm) || description.includes(lowerSearchTerm);
            const matchesCategory = activeCategory === 'all' || report.category === activeCategory || (activeCategory === 'favorites' && favorites.includes(report.id));

            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, activeCategory, favorites, t]);

    const sidebarCategories = [
        { id: 'favorites', nameKey: 'reportsPage.favorites', icon: StarIcon },
        { id: 'all', nameKey: 'reportsPage.allReports', icon: ArchiveBoxIcon },
        ...categoryData.map(c => ({ id: c.id, nameKey: c.nameKey, icon: ArchiveBoxIcon }))
    ];

    // If a report is selected, show it
    if (activeReportId) {
        const reportConfig = reportsData.find(r => r.id === activeReportId);
        const ReportComponent = reportConfig?.component;

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setActiveReportId(null)}
                            className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            <ChevronLeftIcon className={`w-5 h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
                            <span className="font-bold text-lg">{t('buttons.back')}</span> {/* Reusing generic back translation or add new */}
                        </button>
                        <div className="h-6 w-px bg-slate-300 dark:bg-slate-700"></div>
                        <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                            {t(`reportsPage.reports.${activeReportId}.title` as any)}
                        </h2>
                    </div>
                </div>
                {ReportComponent && <ReportComponent />}
            </div>
        );
    }

    // Default View
    return (
        <div className="flex flex-col md:flex-row gap-6">
            {/* Main Content */}
            <main className="flex-grow w-full md:w-2/3">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm h-full">
                    <div className="relative mb-6">
                        <MagnifyingGlassIcon className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t('reportsPage.searchPlaceholder')}
                            className={`w-full py-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-200 ${language === 'ar' ? 'pr-10' : 'pl-10'}`}
                        />
                    </div>

                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">{t('reportsPage.allReports')}</h2>

                    <div className="space-y-6">
                        {categoryData.map(category => {
                            const reportsInCategory = filteredReports.filter(r => r.category === category.id);
                            if (reportsInCategory.length === 0) return null;

                            return (
                                <div key={category.id}>
                                    <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-2 border-b dark:border-slate-700 pb-2">{t(category.nameKey as any)}</h3>
                                    <div className="space-y-2">
                                        {reportsInCategory.map(report => (
                                            <div
                                                key={report.id}
                                                onClick={() => setActiveReportId(report.id)}
                                                className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors duration-150 cursor-pointer group"
                                            >
                                                <div>
                                                    <h4 className="font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">{t(`reportsPage.reports.${report.id}.title` as any)}</h4>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">{t(`reportsPage.reports.${report.id}.description` as any)}</p>
                                                </div>
                                                <button onClick={(e) => handleToggleFavorite(e, report.id)} aria-label="Toggle favorite">
                                                    <StarIcon className={`w-6 h-6 transition-colors ${favorites.includes(report.id) ? 'text-yellow-400 fill-current' : 'text-slate-400 hover:text-yellow-400'}`} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>

            {/* Right Sidebar */}
            <aside className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm sticky top-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">{t('reportsPage.sidebarTitle')}</h3>
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
        </div>
    );
};

export default ReportsPage;
