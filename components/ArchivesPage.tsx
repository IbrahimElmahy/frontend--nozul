import React, { useState, useContext, useMemo } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import MagnifyingGlassIcon from './icons-redesign/MagnifyingGlassIcon';
import StarIcon from './icons-redesign/StarIcon';
import ArchiveBoxIcon from './icons-redesign/ArchiveBoxIcon';

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
    const { t } = useContext(LanguageContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [favorites, setFavorites] = useState<string[]>([]);

    const handleToggleFavorite = (archiveId: string) => {
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
                                className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors duration-150 ${
                                    activeCategory === cat.id
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
                                            <div key={archive.id} className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors duration-150">
                                                <div>
                                                    <h4 className="font-semibold text-blue-600 dark:text-blue-400">{t(`archivesPage.archives.${archive.id}.title` as any)}</h4>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">{t(`archivesPage.archives.${archive.id}.description` as any)}</p>
                                                </div>
                                                <button onClick={() => handleToggleFavorite(archive.id)} aria-label="Toggle favorite">
                                                    <StarIcon className={`w-6 h-6 transition-colors ${favorites.includes(archive.id) ? 'text-yellow-400 fill-current' : 'text-slate-400 hover:text-yellow-400'}`} />
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
        </div>
    );
};

export default ArchivesPage;
