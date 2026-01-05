
import React, { useState, useEffect, useRef, useContext } from 'react';
import { ThemeSettings, Page } from '../App';
import ChevronLeftIcon from './icons-redesign/ChevronLeftIcon';
import ChevronDownIcon from './icons-redesign/ChevronDownIcon';
import UserIcon from './icons-redesign/UserIcon';
import ArrowLeftOnRectangleIcon from './icons-redesign/ArrowLeftOnRectangleIcon';
import BellIcon from './icons-redesign/BellIcon';
import ArrowsPointingOutIcon from './icons-redesign/ArrowsPointingOutIcon';
import ArrowsPointingInIcon from './icons-redesign/ArrowsPointingInIcon';
import Bars3Icon from './icons-redesign/Bars3Icon';
import GlobeAltIcon from './icons-redesign/GlobeAltIcon';
import { LanguageContext } from '../contexts/LanguageContext';
import { TranslationKey } from '../translations';
import { User, Notification } from '../types';
import { checkZakatStatus } from '../services/zakat';
import { listNotifications } from '../services/notifications';
import { API_BASE_URL } from '../config/api';
import IntegrationRequestModal from './IntegrationRequestModal';
import ZakatIntegrationModal from './ZakatIntegrationModal';

// Icons for notifications and status
import UserPlusIcon from './icons-redesign/UserPlusIcon';
import CurrencyDollarIcon from './icons-redesign/CurrencyDollarIcon';
import ServerIcon from './icons-redesign/ServerIcon';
import InformationCircleIcon from './icons-redesign/InformationCircleIcon';
import CheckCircleIcon from './icons-redesign/CheckCircleIcon';
import XMarkIcon from './icons-redesign/XMarkIcon';


interface HeaderProps {
    onLogout: () => void;
    settings: ThemeSettings;
    onMenuButtonClick: () => void;
    setCurrentPage: (page: Page) => void;
    currentPage: Page;
    user: User | null;
}

const pageDetails: Record<Page, { title: TranslationKey, breadcrumb: TranslationKey, parent?: TranslationKey }> = {
    dashboard: { title: 'header.dashboard', breadcrumb: 'header.hotelName' },
    profile: { title: 'header.userInformation', breadcrumb: 'header.dashboard', parent: 'header.dashboard' },
    units: { title: 'units.manageUnits', breadcrumb: 'sidebar.residentialRooms', parent: 'header.dashboard' },
    bookings: { title: 'bookings.manageBookings', breadcrumb: 'sidebar.bookings', parent: 'sidebar.reservationsManagement' },
    guests: { title: 'guests.manageGuests', breadcrumb: 'sidebar.guests', parent: 'sidebar.guestManagement' },
    agencies: { title: 'agencies.manageAgencies', breadcrumb: 'sidebar.bookingAgencies', parent: 'sidebar.guestManagement' },
    orders: { title: 'orders.manageOrders', breadcrumb: 'sidebar.orders', parent: 'sidebar.reservationsManagement' },
    receipts: { title: 'receipts.manageReceipts', breadcrumb: 'sidebar.receipts', parent: 'sidebar.financialManagement' },
    reports: { title: 'reportsPage.title', breadcrumb: 'sidebar.reports', parent: 'sidebar.other' },
    archives: { title: 'archivesPage.title', breadcrumb: 'sidebar.archives', parent: 'sidebar.other' },
    notifications: { title: 'notificationsPage.title', breadcrumb: 'sidebar.notifications', parent: 'sidebar.other' },
    'hotel-settings': { title: 'hotelSettings.pageTitle', breadcrumb: 'sidebar.settings', parent: 'sidebar.other' },
    'hotel-info': { title: 'hotelInfo.pageTitle', breadcrumb: 'hotelInfo.breadcrumb', parent: 'sidebar.settings' },
    'hotel-users': { title: 'usersPage.pageTitle', breadcrumb: 'usersPage.breadcrumb', parent: 'sidebar.settings' },
    'apartment-prices': { title: 'apartmentPrices.pageTitle', breadcrumb: 'hotelSettings.manageApartmentPrices', parent: 'sidebar.settings' },
    'peak-times': { title: 'peakTimes.pageTitle', breadcrumb: 'hotelSettings.managePeakTimes', parent: 'sidebar.settings' },
    taxes: { title: 'taxes.pageTitle', breadcrumb: 'hotelSettings.manageTaxes', parent: 'sidebar.settings' },
    items: { title: 'itemsPage.pageTitle', breadcrumb: 'hotelSettings.manageItems', parent: 'sidebar.settings' },
    currencies: { title: 'currenciesPage.pageTitle', breadcrumb: 'hotelSettings.manageCurrency', parent: 'sidebar.settings' },
    funds: { title: 'fundsPage.pageTitle', breadcrumb: 'hotelSettings.manageFunds', parent: 'sidebar.settings' },
    banks: { title: 'banksPage.pageTitle', breadcrumb: 'hotelSettings.manageBanks', parent: 'sidebar.settings' },
    expenses: { title: 'expensesPage.pageTitle', breadcrumb: 'hotelSettings.manageExpenses', parent: 'sidebar.settings' },
    'hotel-conditions': { title: 'hotelConditions.pageTitle', breadcrumb: 'hotelSettings.manageConditions', parent: 'sidebar.settings' },
    'payment-methods': { title: 'paymentMethodsPage.pageTitle', breadcrumb: 'hotelSettings.managePaymentMethods', parent: 'sidebar.settings' },
}

// Clock Component
const Clock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="hidden xl:flex bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg font-mono text-sm font-bold shadow-sm items-center justify-center gap-2 border border-slate-200 dark:border-slate-600">
            <span>{time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            <span className="text-slate-400">|</span>
            <span>{time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
        </div>
    );
};

// System Images
import wafiqLogo from '../images/wafeq-off.png';
import shomoosLogo from '../images/shomos.png';
import ntmLogo from '../images/minstry_active.png';
import zakatLogo from '../images/zacat.png';

// System Status Badge Component
const SystemStatusBadge = ({ name, isActive, imageSrc, systemKey, onClick }: { name: string, isActive: boolean, imageSrc: string, systemKey: string, onClick: (key: string, active: boolean) => void }) => (
    <div
        onClick={() => onClick(systemKey, isActive)}
        className={`relative group cursor-pointer transition-all duration-200 hover:scale-105 ${!isActive ? 'opacity-90 hover:opacity-100' : ''}`}
        title={name}
    >
        <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md bg-white overflow-hidden border border-slate-100 dark:border-slate-700">
            <img src={imageSrc} alt={name} className="w-full h-full object-cover" />
        </div>
        <div className={`absolute -bottom-1 -right-1 px-1 py-0.5 rounded-full text-[8px] font-bold text-white flex items-center justify-center shadow-sm w-4 h-4 border border-white dark:border-slate-800 ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}`}>
            {isActive ? <CheckCircleIcon className="w-2.5 h-2.5" /> : <XMarkIcon className="w-2.5 h-2.5" />}
        </div>
    </div>
);

const Header: React.FC<HeaderProps> = ({ onLogout, settings, onMenuButtonClick, setCurrentPage, currentPage, user }) => {
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Integration Modal State
    // Integration Modal State
    const [showIntegrationModal, setShowIntegrationModal] = useState(false);
    const [showZakatModal, setShowZakatModal] = useState(false);
    const [selectedSystem, setSelectedSystem] = useState('');
    const [isZakatActive, setIsZakatActive] = useState(false);

    const { language, setLanguage, t } = useContext(LanguageContext);
    const isRTL = language === 'ar' || language === 'ur';


    const userDropdownRef = useRef<HTMLDivElement>(null);
    const notificationsRef = useRef<HTMLDivElement>(null);
    const langDropdownRef = useRef<HTMLDivElement>(null);


    const { topbarColor } = settings;
    const unreadCount = notifications.filter(n => n.unread).length;

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await listNotifications();
                setNotifications(data);
            } catch (error) {
                console.error("Failed to fetch notifications", error);
            }
        }

        const fetchZakatStatus = async () => {
            try {
                const apiLang = (language === 'ur' || language === 'en') ? 'ar' : language;
                const status = await checkZakatStatus(apiLang);
                setIsZakatActive(status.is_ready);
            } catch (error) {
                console.error("Failed to check Zakat status", error);
            }
        };

        fetchNotifications();
        fetchZakatStatus();
        const interval = setInterval(() => {
            fetchNotifications();
            // Optional: poll zakat status too if needed, or just on mount/modal success
        }, 60000); // Poll every minute
        return () => clearInterval(interval);
    }, [language]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
                setIsUserDropdownOpen(false);
            }
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
            if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
                setIsLangDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const onFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', onFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', onFullscreenChange);
        };
    }, []);

    const handleLogoutClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsUserDropdownOpen(false);
        onLogout();
    }

    const handleMarkAsRead = (id: string) => {
        setNotifications(notifications.map(n => n.pk === id ? { ...n, unread: false } : n));
        // API call to mark as read would go here if supported by the endpoint provided
    };

    const handleMarkAllAsRead = (e: React.MouseEvent) => {
        e.preventDefault();
        setNotifications(notifications.map(n => ({ ...n, unread: false })));
    };

    const handleToggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    const handleProfileClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setCurrentPage('profile');
        setIsUserDropdownOpen(false);
    }

    const handleSystemClick = (systemName: string, isActive: boolean) => {
        if (systemName === 'zakat') {
            setShowZakatModal(true);
        } else {
            // For other systems, we only show the request modal if NOT active (for now)
            // Or if we want to show a similar status modal later, we'd remove this check too.
            // But per user request "show verification page", let's open it.
            // However, the other modal (IntegrationRequestModal) is just a form.
            // For now, let's keep others strictly as is (only open if inactive to request), 
            // BUT since user asked generically, maybe he implies others too?
            // "any platform... show verification page"
            // Since others are never active yet, this change primarily affects Zakat.
            // Let's just allow opening the appropriate modal.

            // Actually, for the *others*, if they ARE active (which they aren't yet), 
            // we don't have a "Status Modal" for them. We only have `IntegrationRequestModal`.
            // So for others, if active, maybe we shouldn't open the "Request" modal?
            // But currently they are always inactive. 
            // So removing the check is safe for Zakat.
            // Let's logic: if Zakat, always open (it handles both states).
            // If others, open Request Modal (which is for requesting).
            if (!isActive) {
                setSelectedSystem(systemName);
                setShowIntegrationModal(true);
            }
        }
    };

    const currentDetails = pageDetails[currentPage];

    const headerColorClass = topbarColor === 'dark'
        ? 'bg-slate-800 text-slate-300 border-b border-slate-700'
        : 'bg-white dark:bg-slate-800 dark:border-b dark:border-slate-700';

    const dropdownPosition = isRTL ? 'left-0' : 'right-0';

    const getTimeAgo = (isoDate: string) => {
        const date = new Date(isoDate);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

        if (diffInMinutes < 1) return t('time.justNow');
        if (diffInMinutes < 60) return t('time.minutesAgo', diffInMinutes);
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return diffInHours === 1 ? t('time.hourAgo') : t('time.hoursAgo', diffInHours);
        const diffInDays = Math.floor(diffInHours / 24);
        return diffInDays === 1 ? t('time.dayAgo') : t('time.daysAgo', diffInDays);
    }

    return (
        <header className={`${headerColorClass} shadow-sm px-4 py-2 flex justify-between items-center flex-shrink-0 h-20 z-30 sticky top-0`}>
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuButtonClick}
                    className="lg:hidden text-slate-500 dark:text-slate-400 p-1"
                    aria-label="Open menu"
                >
                    <Bars3Icon className="w-6 h-6" />
                </button>
                <div className="flex flex-col items-start">
                    <h1 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                        {t(currentDetails.title)}
                    </h1>
                    <div className="hidden md:flex items-center text-sm">
                        <span className="text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            {t(currentDetails.parent || 'sidebar.mainPage')}
                        </span>
                        <ChevronLeftIcon className={`w-4 h-4 text-gray-400 dark:text-gray-500 mx-1 transform ${language === 'en' ? 'rotate-180' : ''}`} />
                        <span className="text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            {currentDetails.breadcrumb === 'header.hotelName' && user?.name ? user.name : t(currentDetails.breadcrumb)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Center Section: System Status & Clock (Hidden on small screens) */}
            <div className="hidden lg:flex items-center gap-6 absolute left-1/2 transform -translate-x-1/2">
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <SystemStatusBadge
                        name="وافق"
                        isActive={false}
                        imageSrc={wafiqLogo}
                        systemKey="wafiq"
                        onClick={handleSystemClick}
                    />
                    <SystemStatusBadge
                        name="شموس"
                        isActive={false}
                        imageSrc={shomoosLogo}
                        systemKey="shomoos"
                        onClick={handleSystemClick}
                    />
                    <SystemStatusBadge
                        name="الرصد السياحي"
                        isActive={false}
                        imageSrc={ntmLogo}
                        systemKey="ntm"
                        onClick={handleSystemClick}
                    />
                    <SystemStatusBadge
                        name="هيئة الزكاة"
                        isActive={isZakatActive}
                        imageSrc={zakatLogo}
                        systemKey="zakat"
                        onClick={handleSystemClick}
                    />
                </div>

                <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                        <CheckCircleIcon className="w-3 h-3" />
                        <span>{language === 'en' ? 'Active' : (language === 'ar' ? 'نشط' : 'فعال')}</span>
                    </div>
                    <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 tracking-wide">PLAN A</span>
                </div>

                <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

                <Clock />
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                {/* Language Switcher */}
                <div className="relative" ref={langDropdownRef}>
                    <button
                        onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        aria-label="Change language"
                    >
                        <GlobeAltIcon className="w-6 h-6" />
                    </button>
                    {isLangDropdownOpen && (
                        <div className={`absolute top-full mt-2 w-32 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-20 ${dropdownPosition}`}>
                            <button
                                onClick={() => { setLanguage('ar'); setIsLangDropdownOpen(false); }}
                                className={`w-full text-right flex items-center px-4 py-2 text-sm ${language === 'ar' ? 'font-bold text-blue-600' : 'text-gray-700 dark:text-gray-200'} hover:bg-gray-100 dark:hover:bg-slate-700`}
                            >
                                العربية
                            </button>
                            <button
                                onClick={() => { setLanguage('en'); setIsLangDropdownOpen(false); }}
                                className={`w-full text-left flex items-center px-4 py-2 text-sm ${language === 'en' ? 'font-bold text-blue-600' : 'text-gray-700 dark:text-gray-200'} hover:bg-gray-100 dark:hover:bg-slate-700`}
                            >
                                English
                            </button>
                            <button
                                onClick={() => { setLanguage('ur'); setIsLangDropdownOpen(false); }}
                                className={`w-full text-right flex items-center px-4 py-2 text-sm ${language === 'ur' ? 'font-bold text-blue-600' : 'text-gray-700 dark:text-gray-200'} hover:bg-gray-100 dark:hover:bg-slate-700`}
                            >
                                اردو
                            </button>
                        </div>
                    )}
                </div>

                {/* Full Screen Button */}
                <button
                    onClick={handleToggleFullScreen}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"}
                >
                    {isFullscreen ? (
                        <ArrowsPointingInIcon className="w-6 h-6" />
                    ) : (
                        <ArrowsPointingOutIcon className="w-6 h-6" />
                    )}
                </button>

                {/* Notifications Panel */}
                <div className="relative" ref={notificationsRef}>
                    <button
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        className="relative text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        aria-haspopup="true"
                        aria-expanded={isNotificationsOpen}
                        aria-label={`You have ${unreadCount} unread notifications`}
                    >
                        <BellIcon className="w-6 h-6" />
                        {unreadCount > 0 && (
                            <span className={`absolute -top-1 ${isRTL ? '-right-1' : '-left-1'} flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white`}>
                                {unreadCount}
                            </span>
                        )}
                    </button>
                    {isNotificationsOpen && (
                        <div className={`absolute top-full mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-20 ${dropdownPosition}`}>
                            <div className="flex justify-between items-center p-3 border-b dark:border-slate-700">
                                <h6 className="font-semibold text-slate-700 dark:text-slate-200">{t('notifications')}</h6>
                                <a href="#" onClick={handleMarkAllAsRead} className="text-xs text-blue-500 hover:underline">{t('clear_all')}</a>
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">{t('notificationsPage.noNotifications')}</div>
                                ) : (
                                    notifications.map(notification => (
                                        <a
                                            href="#"
                                            key={notification.pk}
                                            onClick={(e) => { e.preventDefault(); handleMarkAsRead(notification.pk); }}
                                            className={`flex items-start p-3 text-sm transition-colors duration-150 ${!notification.unread ? 'text-gray-600 dark:text-gray-400' : 'bg-blue-50/50 dark:bg-blue-500/10 text-gray-800 dark:text-gray-200'} hover:bg-gray-100 dark:hover:bg-slate-700`}
                                        >
                                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isRTL ? 'ml-3' : 'mr-3'} ${!notification.unread ? 'bg-slate-200 dark:bg-slate-600' : 'bg-blue-100 dark:bg-blue-500/20'}`}>
                                                <InformationCircleIcon className={`w-5 h-5 ${!notification.unread ? 'text-slate-500' : 'text-blue-500'}`} />
                                            </div>
                                            <div className={`flex-grow ${isRTL ? 'text-right' : 'text-left'}`}>
                                                <p className="font-medium">{notification.verb}</p>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{getTimeAgo(notification.timestamp)}</p>
                                            </div>
                                        </a>
                                    ))
                                )}
                            </div>
                            <div className="p-2 border-t dark:border-slate-700 text-center">
                                <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('notifications'); setIsNotificationsOpen(false); }} className="text-sm font-medium text-blue-500 hover:underline">{t('view_all_notifications')}</a>
                            </div>
                        </div>
                    )}
                </div>

                {/* User Profile Dropdown */}
                <div className="relative" ref={userDropdownRef}>
                    <button
                        onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                        className="flex items-center space-x-2 space-x-reverse"
                        aria-haspopup="true"
                        aria-expanded={isUserDropdownOpen}
                    >
                        <img
                            src={user?.image_url ? (user.image_url.startsWith('http') ? user.image_url : `${API_BASE_URL}${user.image_url}`) : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect width='150' height='150' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='48' fill='%2394a3b8'%3E%3F%3C/text%3E%3C/svg%3E"}
                            alt="User Avatar"
                            loading="eager"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="hidden sm:block">
                            <div className={`font-semibold text-sm text-slate-700 dark:text-slate-300 ${isRTL ? 'text-right' : 'text-left'}`}>{user?.name || t('walid_ullah')}</div>
                            <div className={`text-xs text-gray-500 dark:text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}>{user?.role_name || t('manager')}</div>
                        </div>
                        <ChevronDownIcon className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isUserDropdownOpen && (
                        <div className={`absolute top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-20 ${dropdownPosition}`}>
                            <a
                                href="#"
                                onClick={handleProfileClick}
                                className={`flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 ${language === 'en' ? 'flex-row-reverse justify-end' : ''}`}
                            >
                                <UserIcon className={`w-5 h-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                                {/* FIX: Use namespaced translation key 'userMenu.profile' to resolve TypeScript error. */}
                                <span>{t('userMenu.profile')}</span>
                            </a>
                            <button
                                onClick={handleLogoutClick}
                                className={`w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 ${isRTL ? 'text-right' : 'text-left'} ${language === 'en' ? 'flex-row-reverse justify-between' : ''}`}
                            >
                                <ArrowLeftOnRectangleIcon className={`w-5 h-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                                {/* FIX: Use namespaced translation key 'userMenu.logout' to resolve TypeScript error. */}
                                <span>{t('userMenu.logout')}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <IntegrationRequestModal
                isOpen={showIntegrationModal}
                onClose={() => {
                    setShowIntegrationModal(false);
                    setSelectedSystem('');
                }}
                hotelData={{
                    name: user?.name || '',
                    email: user?.email || '',
                    phone: user?.phone_number || ''
                }}
                initialSystemType={selectedSystem}
            />
            <ZakatIntegrationModal
                isOpen={showZakatModal}
                onClose={() => setShowZakatModal(false)}
                onSuccess={() => setIsZakatActive(true)}
            />
        </header>
    );
};

export default Header;
