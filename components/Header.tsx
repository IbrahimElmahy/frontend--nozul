
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
import { apiClient } from '../apiClient';


// Icons for notifications
import UserPlusIcon from './icons-redesign/UserPlusIcon';
import CurrencyDollarIcon from './icons-redesign/CurrencyDollarIcon';
import ServerIcon from './icons-redesign/ServerIcon';
import InformationCircleIcon from './icons-redesign/InformationCircleIcon';


interface HeaderProps {
  onLogout: () => void;
  settings: ThemeSettings;
  onMenuButtonClick: () => void;
  setCurrentPage: (page: Page) => void;
  currentPage: Page;
  user: User | null;
}

const pageDetails: Record<Page, {title: TranslationKey, breadcrumb: TranslationKey, parent?: TranslationKey}> = {
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
}

const Header: React.FC<HeaderProps> = ({ onLogout, settings, onMenuButtonClick, setCurrentPage, currentPage, user }) => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { language, setLanguage, t } = useContext(LanguageContext);


  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  
  const { topbarColor } = settings;
  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
      const fetchNotifications = async () => {
          try {
              const response = await apiClient<{ data: Notification[] }>('/ar/notification/api/notifications/');
              setNotifications(response.data);
          } catch (error) {
              console.error("Failed to fetch notifications", error);
          }
      }
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000); // Poll every minute
      return () => clearInterval(interval);
  }, []);

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

  const currentDetails = pageDetails[currentPage];

  const headerColorClass = topbarColor === 'dark' 
    ? 'bg-slate-800 text-slate-300 border-b border-slate-700' 
    : 'bg-white dark:bg-slate-800 dark:border-b dark:border-slate-700';

  const dropdownPosition = language === 'ar' ? 'left-0' : 'right-0';
  
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
    <header className={`${headerColorClass} shadow-sm p-4 flex justify-between items-center flex-shrink-0 h-20`}>
      <div className="flex items-center gap-2">
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
                    {t(currentDetails.breadcrumb)}
                </span>
            </div>
        </div>
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
                    <span className={`absolute -top-1 ${language === 'ar' ? '-right-1' : '-left-1'} flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white`}>
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
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${language === 'ar' ? 'ml-3' : 'mr-3'} ${!notification.unread ? 'bg-slate-200 dark:bg-slate-600' : 'bg-blue-100 dark:bg-blue-500/20'}`}>
                                        <InformationCircleIcon className={`w-5 h-5 ${!notification.unread ? 'text-slate-500' : 'text-blue-500'}`} />
                                    </div>
                                    <div className={`flex-grow ${language === 'ar' ? 'text-right' : 'text-left'}`}>
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
                src="https://picsum.photos/id/237/200/200"
                alt="User Avatar"
                className="w-10 h-10 rounded-full"
            />
            <div className="hidden sm:block">
                <div className={`font-semibold text-sm text-slate-700 dark:text-slate-300 ${language === 'ar' ? 'text-right' : 'text-left'}`}>{user?.name || t('walid_ullah')}</div>
                <div className={`text-xs text-gray-500 dark:text-gray-400 ${language === 'ar' ? 'text-right' : 'text-left'}`}>{user?.role_name || t('manager')}</div>
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
                <UserIcon className={`w-5 h-5 ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
                {/* FIX: Use namespaced translation key 'userMenu.profile' to resolve TypeScript error. */}
                <span>{t('userMenu.profile')}</span>
                </a>
                <button
                onClick={handleLogoutClick}
                className={`w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 ${language === 'ar' ? 'text-right' : 'text-left'} ${language === 'en' ? 'flex-row-reverse justify-between' : ''}`}
                >
                <ArrowLeftOnRectangleIcon className={`w-5 h-5 ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
                {/* FIX: Use namespaced translation key 'userMenu.logout' to resolve TypeScript error. */}
                <span>{t('userMenu.logout')}</span>
                </button>
            </div>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;
