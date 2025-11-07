import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Page } from '../App';

// Icons
import BuildingOfficeIcon from './icons-redesign/BuildingOfficeIcon';
import UserGroupIcon from './icons-redesign/UserGroupIcon';
import Squares2x2Icon from './icons-redesign/Squares2x2Icon';
import CurrencySaudiRiyalIcon from './icons-redesign/CurrencySaudiRiyalIcon';
import ClockIcon from './icons-redesign/ClockIcon';
import CreditCardIcon from './icons-redesign/CreditCardIcon';
import CartIcon from './icons-redesign/CartIcon';
import CurrencyDollarIcon from './icons-redesign/CurrencyDollarIcon';
import ArchiveBoxIcon from './icons-redesign/ArchiveBoxIcon';
import ClipboardDocumentListIcon from './icons-redesign/ClipboardDocumentListIcon';
import ChevronLeftIcon from './icons-redesign/ChevronLeftIcon';


interface SettingsCardProps {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    onClick: () => void;
}

const SettingsCard: React.FC<SettingsCardProps> = ({ icon: Icon, title, description, onClick }) => {
    const { language } = useContext(LanguageContext);
    return (
        <button 
            onClick={onClick}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 flex flex-col items-start text-left h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 flex-grow mb-4">{description}</p>
            <div className="flex items-center gap-2 mt-auto text-sm font-semibold text-blue-600 group-hover:text-blue-700 dark:text-blue-400 dark:group-hover:text-blue-300">
                <span>{language === 'ar' ? 'اذهب إلى الصفحة' : 'Go to Page'}</span>
                <ChevronLeftIcon className={`w-4 h-4 transform ${language === 'en' ? 'rotate-180' : ''}`} />
            </div>
        </button>
    );
};

interface HotelSettingsPageProps {
    setCurrentPage: (page: Page) => void;
}

const HotelSettingsPage: React.FC<HotelSettingsPageProps> = ({ setCurrentPage }) => {
    const { t } = useContext(LanguageContext);

    const settings = [
        { id: 'manageHotel', icon: BuildingOfficeIcon, page: 'hotel-info' as Page },
        { id: 'manageUsers', icon: UserGroupIcon, page: 'hotel-users' as Page },
        { id: 'manageApartments', icon: Squares2x2Icon, page: 'units' as Page },
        { id: 'manageApartmentPrices', icon: CurrencySaudiRiyalIcon, page: 'apartment-prices' as Page },
        { id: 'managePeakTimes', icon: ClockIcon, page: 'peak-times' as Page },
        { id: 'manageTaxes', icon: CreditCardIcon, page: 'taxes' as Page },
        { id: 'manageItems', icon: CartIcon, page: 'items' as Page },
        { id: 'manageCurrency', icon: CurrencyDollarIcon, page: 'currencies' as Page },
        { id: 'manageFunds', icon: ArchiveBoxIcon, page: 'funds' as Page },
        { id: 'manageBanks', icon: CreditCardIcon, page: 'banks' as Page },
        { id: 'manageExpenses', icon: CreditCardIcon, page: 'expenses' as Page },
        { id: 'manageConditions', icon: ClipboardDocumentListIcon, page: 'hotel-conditions' as Page },
    ];


    return (
        <div className="space-y-8">
            <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">{t('hotelSettings.pageTitle')}</h1>
                <p className="text-slate-500 dark:text-slate-400">{t('hotelSettings.pageDescription')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {settings.map(setting => (
                    <SettingsCard
                        key={setting.id}
                        icon={setting.icon}
                        title={t(`hotelSettings.${setting.id}` as any)}
                        description={t(`hotelSettings.${setting.id}Desc` as any)}
                        onClick={() => setCurrentPage(setting.page)}
                    />
                ))}
            </div>
            
            <footer className="text-center text-sm text-slate-500 dark:text-slate-400 pt-8">
                {t('hotelSettings.footer')}
            </footer>
        </div>
    );
};

export default HotelSettingsPage;