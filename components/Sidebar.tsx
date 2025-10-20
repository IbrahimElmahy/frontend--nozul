import React, { useState, useContext } from 'react';
import { ThemeSettings, Page } from '../App';
import DashboardIcon from './icons-redesign/DashboardIcon';
import CalendarIcon from './icons-redesign/CalendarIcon';
import BriefcaseIcon from './icons-redesign/BriefcaseIcon';
import CartIcon from './icons-redesign/CartIcon';
import CreditCardIcon from './icons-redesign/CreditCardIcon';
import UsersIcon from './icons-redesign/UsersIcon';
import PresentationChartLineIcon from './icons-redesign/PresentationChartLineIcon';
import ClockIcon from './icons-redesign/ClockIcon';
import ArchiveBoxIcon from './icons-redesign/ArchiveBoxIcon';
import PaperAirplaneIcon from './icons-redesign/PaperAirplaneIcon';
import CogIcon from './icons-redesign/CogIcon';
import ArrowLeftOnRectangleIcon from './icons-redesign/ArrowLeftOnRectangleIcon';
import ChevronLeftIcon from './icons-redesign/ChevronLeftIcon';
import Logo from './icons/Logo';
import { LanguageContext } from '../contexts/LanguageContext';
import { User } from '../types';

interface NavItemProps {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    active?: boolean;
    notificationCount?: number;
    hasSubMenu?: boolean;
    collapsed: boolean;
    sidebarColor: ThemeSettings['sidebarColor'];
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const NavItem: React.FC<NavItemProps> = ({ label, icon: Icon, active, notificationCount, hasSubMenu, collapsed, sidebarColor, onClick }) => {
    const { language } = useContext(LanguageContext);
    
    const colorStyles = {
        light: {
            base: 'text-slate-600 hover:bg-slate-100',
            active: 'bg-blue-50 text-blue-600 dark:bg-slate-700 dark:text-white',
            notificationBase: 'bg-slate-200 text-slate-600',
            notificationActive: 'bg-blue-200 text-blue-600 dark:bg-slate-500 dark:text-white',
            chevron: 'text-slate-400'
        },
        dark: {
            base: 'text-slate-300 hover:bg-slate-700',
            active: 'bg-slate-600 text-white',
            notificationBase: 'bg-slate-700 text-white',
            notificationActive: 'bg-slate-500 text-white',
            chevron: 'text-slate-400'
        },
        brand: {
            base: 'text-blue-100 hover:bg-[#3a82ab]',
            active: 'bg-white text-[#4395c6] shadow-sm',
            notificationBase: 'bg-[#5badd9] text-white',
            notificationActive: 'bg-blue-100 text-[#4395c6]',
            chevron: 'text-blue-200'
        },
        gradient: {
            base: 'text-purple-100 hover:bg-white/10',
            active: 'bg-white/20 text-white shadow-sm',
            notificationBase: 'bg-white/20 text-white',
            notificationActive: 'bg-purple-100 text-purple-700',
            chevron: 'text-purple-200'
        }
    };

    const styles = colorStyles[sidebarColor] || colorStyles.brand;
    const baseClasses = 'flex items-center w-full p-3 my-1 rounded-lg text-base font-medium transition-colors duration-200';
    
    return (
        <a
            href="#"
            onClick={onClick}
            title={collapsed ? label : undefined}
            className={`${baseClasses} ${active ? styles.active : styles.base} ${collapsed ? 'justify-center' : ''}`}
        >
            <Icon className="w-6 h-6 flex-shrink-0" />
            {!collapsed && (
                <>
                    <span className={`flex-grow ${language === 'ar' ? 'mr-4 text-right' : 'ml-4 text-left'}`}>{label}</span>
                    {notificationCount && (
                        <span className={`flex items-center justify-center text-sm font-bold rounded-full w-6 h-6 ${language === 'ar' ? 'ml-2' : 'mr-2'} ${active ? styles.notificationActive : styles.notificationBase}`}>{notificationCount}</span>
                    )}
                    {hasSubMenu && (
                        <ChevronLeftIcon className={`w-6 h-6 transform ${language === 'ar' ? '' : 'rotate-180'} ${language === 'ar' ? 'mr-auto' : 'ml-auto'} ${active ? '' : styles.chevron}`} />
                    )}
                </>
            )}
        </a>
    );
};


const NavHeader: React.FC<{ collapsed: boolean; sidebarColor: ThemeSettings['sidebarColor']; children: React.ReactNode }> = ({ collapsed, sidebarColor, children }) => {
    const { language } = useContext(LanguageContext);
    if (collapsed) return null;

    const headerColors = {
        light: 'text-slate-400',
        dark: 'text-slate-500',
        brand: 'text-[#a4d3ed]',
        gradient: 'text-purple-200'
    }

    return (
        <h3 className={`px-3 pt-4 pb-2 text-sm font-semibold uppercase tracking-wider ${language === 'ar' ? 'text-right' : 'text-left'} ${headerColors[sidebarColor]}`}>
            {children}
        </h3>
    );
};

interface UserInfoBlockProps {
    collapsed: boolean;
    user: User | null;
    setCurrentPage: (page: Page) => void;
    sidebarColor: ThemeSettings['sidebarColor'];
}

const UserInfoBlock: React.FC<UserInfoBlockProps> = ({ collapsed, user, setCurrentPage, sidebarColor }) => {
    const { t, language } = useContext(LanguageContext);
    
    const colorStyles = {
        light: { base: 'text-slate-600 hover:bg-slate-100' },
        dark: { base: 'text-slate-300 hover:bg-slate-700' },
        brand: { base: 'text-blue-100 hover:bg-[#3a82ab]' },
        gradient: { base: 'text-purple-100 hover:bg-white/10' }
    };

    const styles = colorStyles[sidebarColor] || colorStyles.brand;
    const baseClasses = 'flex items-center w-full p-3 my-1 rounded-lg text-base font-medium transition-colors duration-200 cursor-pointer';

    const handleProfileClick = (e: React.MouseEvent | React.KeyboardEvent) => {
        e.preventDefault();
        setCurrentPage('profile');
    };

    return (
        <a 
            href="#"
            className={`${baseClasses} ${styles.base} ${collapsed ? 'justify-center' : ''}`}
            onClick={handleProfileClick}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleProfileClick(e); }}
            role="button"
            tabIndex={0}
            aria-label="View user profile"
        >
            <img
                src="https://picsum.photos/id/237/200/200"
                alt="User Avatar"
                className="w-10 h-10 rounded-md flex-shrink-0"
            />
            {!collapsed && (
                <div className={`${language === 'ar' ? 'mr-3 text-right' : 'ml-3 text-left'}`}>
                    <div className="font-semibold text-sm">{user?.name || t('walid_ullah')}</div>
                    <div className="text-xs opacity-80">{user?.role_name || t('manager')}</div>
                </div>
            )}
        </a>
    );
};

interface SidebarProps {
    onLogout: () => void;
    settings: ThemeSettings;
    isMobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
    setCurrentPage: (page: Page) => void;
    currentPage: Page;
    user: User | null;
}

const pageMapping: Record<string, Page> = {
    dashboard: 'dashboard',
    rooms: 'units',
    bookings: 'bookings',
    guests: 'guests',
    agencies: 'agencies',
};


const Sidebar: React.FC<SidebarProps> = ({ onLogout, settings, isMobileMenuOpen, setMobileMenuOpen, setCurrentPage, currentPage, user }) => {
    const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(true);
    const { t, language } = useContext(LanguageContext);

    const navigationSections = [
        {
            header: t('sidebar.mainPage'),
            items: [{ id: 'dashboard', label: t('sidebar.dashboard'), icon: DashboardIcon, notificationCount: 2 }]
        },
        {
            header: t('sidebar.reservationsManagement'),
            items: [
            { id: 'rooms', label: t('sidebar.residentialRooms'), icon: CalendarIcon },
            { id: 'bookings', label: t('sidebar.bookings'), icon: BriefcaseIcon },
            { id: 'orders', label: t('sidebar.orders'), icon: CartIcon }
            ]
        },
        {
            header: t('sidebar.financialManagement'),
            items: [{ id: 'receipts', label: t('sidebar.receipts'), icon: CreditCardIcon }]
        },
        {
            header: t('sidebar.guestManagement'),
            items: [
            { id: 'guests', label: t('sidebar.guests'), icon: UsersIcon },
            { id: 'agencies', label: t('sidebar.bookingAgencies'), icon: PresentationChartLineIcon }
            ]
        },
        {
            header: t('sidebar.other'),
            items: [
            { id: 'reports', label: t('sidebar.reports'), icon: ClockIcon },
            { id: 'archives', label: t('sidebar.archives'), icon: ArchiveBoxIcon },
            { id: 'notifications', label: t('sidebar.notifications'), icon: PaperAirplaneIcon },
            { id: 'settings', label: t('sidebar.settings'), icon: CogIcon }
            ]
        }
    ];


    const handleLogoutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        onLogout();
    };
    
    const handleNavItemClick = (e: React.MouseEvent<HTMLAnchorElement>, itemId: string) => {
        e.preventDefault();
        const targetPage = pageMapping[itemId];
        if (targetPage) {
            setCurrentPage(targetPage);
        } else {
            // For now, all other links can go to dashboard or do nothing
            // For example:
            // if (itemId === 'bookings') { /* navigate to bookings */ }
            // else { setCurrentPage('dashboard'); }
        }


        if (isMobileMenuOpen) {
            setMobileMenuOpen(false);
        }
    };
    
    const handleLogoutAndMenuClose = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (isMobileMenuOpen) {
            setMobileMenuOpen(false);
        }
        handleLogoutClick(e);
    }

    const { sidebarColor, sidebarSize, showUserInfo, colorScheme } = settings;

    // When the global theme is dark, force light/brand sidebars to become dark for consistency.
    const effectiveSidebarColor = colorScheme === 'dark' && (sidebarColor === 'light' || sidebarColor === 'brand')
        ? 'dark'
        : sidebarColor;

    const colorClasses = {
        light: 'bg-white text-slate-700 border-r dark:bg-slate-900/70 dark:border-slate-700',
        dark: 'bg-slate-800 text-white',
        brand: 'bg-[#4395c6] text-white',
        gradient: 'bg-gradient-to-b from-blue-600 to-indigo-700 text-white'
    };

    const sizeClasses = {
        default: { collapsed: 'lg:w-24', expanded: 'lg:w-72' },
        compact: { collapsed: 'lg:w-20', expanded: 'lg:w-64' },
        condensed: { collapsed: 'lg:w-16', expanded: 'lg:w-56' }
    };
    
    const borderColor = {
        light: 'border-slate-200 dark:border-slate-700',
        dark: 'border-slate-700',
        brand: 'border-[#3a82ab]',
        gradient: 'border-white/10'
    }

    const widthClass = isDesktopCollapsed ? sizeClasses[sidebarSize].collapsed : sizeClasses[sidebarSize].expanded;
    const isEffectivelyCollapsed = isMobileMenuOpen ? false : isDesktopCollapsed;

    const mobileMenuPosition = language === 'ar' 
        ? `right-0 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}` 
        : `left-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`;
    const borderClass = language === 'ar' ? 'border-l' : 'border-r';

  return (
    <aside 
        className={`${colorClasses[effectiveSidebarColor]} flex flex-col transition-transform duration-300 ease-in-out lg:transition-all lg:duration-300 h-screen fixed lg:relative z-50 w-72 ${mobileMenuPosition} lg:translate-x-0 ${widthClass}`}
        onMouseEnter={() => setIsDesktopCollapsed(false)}
        onMouseLeave={() => setIsDesktopCollapsed(true)}
    >
        <div className={`border-b ${borderColor[effectiveSidebarColor]} transition-all duration-300 flex items-center justify-center h-20 px-4`}>
            <Logo className={`transition-all duration-300 ${isEffectivelyCollapsed ? 'h-8' : 'h-10'}`} />
        </div>

      <nav className="flex-grow p-3 overflow-y-auto">
        {navigationSections.map((section, index) => (
            <div key={index}>
                <NavHeader collapsed={isEffectivelyCollapsed} sidebarColor={effectiveSidebarColor}>{section.header}</NavHeader>
                {section.items.map((item, itemIndex) => (
                    <NavItem 
                        key={itemIndex}
                        {...item}
                        active={currentPage === pageMapping[item.id]}
                        collapsed={isEffectivelyCollapsed}
                        sidebarColor={effectiveSidebarColor}
                        onClick={(e) => handleNavItemClick(e, item.id)}
                    />
                ))}
            </div>
        ))}
      </nav>

      <div className={`p-3 border-t ${borderColor[effectiveSidebarColor]}`}>
        {showUserInfo && <UserInfoBlock collapsed={isEffectivelyCollapsed} user={user} setCurrentPage={setCurrentPage} sidebarColor={effectiveSidebarColor}/>}
        {/* FIX: Use namespaced translation key 'userMenu.logout' to resolve TypeScript error and improve maintainability. */}
        <NavItem label={t('userMenu.logout')} icon={ArrowLeftOnRectangleIcon} collapsed={isEffectivelyCollapsed} onClick={handleLogoutAndMenuClose} sidebarColor={effectiveSidebarColor} />
      </div>
    </aside>
  );
};

export default Sidebar;