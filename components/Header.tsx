import React, { useState, useEffect, useRef } from 'react';
import { ThemeSettings } from '../App';
import ChevronLeftIcon from './icons-redesign/ChevronLeftIcon';
import ChevronDownIcon from './icons-redesign/ChevronDownIcon';
import UserIcon from './icons-redesign/UserIcon';
import ArrowLeftOnRectangleIcon from './icons-redesign/ArrowLeftOnRectangleIcon';
import BellIcon from './icons-redesign/BellIcon';
import ArrowsPointingOutIcon from './icons-redesign/ArrowsPointingOutIcon';
import ArrowsPointingInIcon from './icons-redesign/ArrowsPointingInIcon';
import Bars3Icon from './icons-redesign/Bars3Icon';


// Icons for notifications
import UserPlusIcon from './icons-redesign/UserPlusIcon';
import CurrencyDollarIcon from './icons-redesign/CurrencyDollarIcon';
import ServerIcon from './icons-redesign/ServerIcon';


interface Notification {
  id: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  timestamp: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: 1, icon: UserPlusIcon, title: 'تم إنشاء حساب جديد', timestamp: 'منذ 5 دقائق', read: false },
  { id: 2, icon: CurrencyDollarIcon, title: 'تم استلام دفعة جديدة', timestamp: 'منذ 25 دقيقة', read: false },
  { id: 3, icon: ServerIcon, title: 'الخادم #1 تجاوز الحد', timestamp: 'منذ ساعة واحدة', read: true },
  { id: 4, icon: UserPlusIcon, title: 'مستخدم جديد مسجل', timestamp: 'منذ ساعتين', read: false },
];


interface HeaderProps {
  onLogout: () => void;
  settings: ThemeSettings;
  onMenuButtonClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout, settings, onMenuButtonClick }) => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [isFullscreen, setIsFullscreen] = useState(false);


  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  
  const { topbarColor } = settings;
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userDropdownRef, notificationsRef]);

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
  
  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = (e: React.MouseEvent) => {
    e.preventDefault();
    setNotifications(notifications.map(n => ({ ...n, read: true })));
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


  const headerColorClass = topbarColor === 'dark' 
    ? 'bg-slate-800 text-slate-300 border-b border-slate-700' 
    : 'bg-white dark:bg-slate-800 dark:border-b dark:border-slate-700';

  return (
    <header className={`${headerColorClass} shadow-sm p-4 flex justify-between items-center flex-shrink-0 h-20`}>
      <div className="flex items-center gap-2">
         <button 
            onClick={onMenuButtonClick} 
            className="lg:hidden text-slate-500 dark:text-slate-400 p-1 -mr-2"
            aria-label="Open menu"
          >
              <Bars3Icon className="w-6 h-6" />
          </button>
        <h1 className="text-lg font-bold text-slate-800 dark:text-slate-200">لوحة التحكم</h1>
        <div className="hidden md:flex items-center text-sm">
            <ChevronLeftIcon className="w-5 h-5 text-gray-400 dark:text-gray-500 mx-2" />
            <span className="text-gray-500 dark:text-gray-400 whitespace-nowrap">شقق ساس المصيف الفندقيه</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
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
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                        {unreadCount}
                    </span>
                )}
            </button>
            {isNotificationsOpen && (
                 <div className="absolute left-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-20">
                    <div className="flex justify-between items-center p-3 border-b dark:border-slate-700">
                        <h6 className="font-semibold text-slate-700 dark:text-slate-200">الإشعارات</h6>
                        <a href="#" onClick={handleMarkAllAsRead} className="text-xs text-blue-500 hover:underline">مسح الكل</a>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.map(notification => (
                             <a 
                                href="#" 
                                key={notification.id}
                                onClick={(e) => { e.preventDefault(); handleMarkAsRead(notification.id); }}
                                className={`flex items-start p-3 text-sm transition-colors duration-150 ${notification.read ? 'text-gray-600 dark:text-gray-400' : 'bg-blue-50/50 dark:bg-blue-500/10 text-gray-800 dark:text-gray-200'} hover:bg-gray-100 dark:hover:bg-slate-700`}
                             >
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${notification.read ? 'bg-slate-200 dark:bg-slate-600' : 'bg-blue-100 dark:bg-blue-500/20'}`}>
                                    <notification.icon className={`w-5 h-5 ${notification.read ? 'text-slate-500' : 'text-blue-500'}`} />
                                </div>
                                <div className="flex-grow text-right">
                                    <p className="font-medium">{notification.title}</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{notification.timestamp}</p>
                                </div>
                             </a>
                        ))}
                    </div>
                    <div className="p-2 border-t dark:border-slate-700 text-center">
                        <a href="#" className="text-sm font-medium text-blue-500 hover:underline">عرض جميع الإشعارات</a>
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
                <div className="font-semibold text-sm text-slate-700 dark:text-slate-300 text-right">وليد الله</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 text-right">مدير</div>
            </div>
            <ChevronDownIcon className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isUserDropdownOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-20">
                <a
                href="#"
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                <UserIcon className="w-5 h-5 ml-3" />
                <span>الملف الشخصي</span>
                </a>
                <button
                onClick={handleLogoutClick}
                className="w-full text-right flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                <ArrowLeftOnRectangleIcon className="w-5 h-5 ml-3" />
                <span>تسجيل الخروج</span>
                </button>
            </div>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;