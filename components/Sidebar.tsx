import React, { useState } from 'react';
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
                    <span className="mr-4 flex-grow text-right">{label}</span>
                    {notificationCount && (
                        <span className={`flex items-center justify-center text-sm font-bold rounded-full w-6 h-6 ml-2 ${active ? styles.notificationActive : styles.notificationBase}`}>{notificationCount}</span>
                    )}
                    {hasSubMenu && (
                        <ChevronLeftIcon className={`w-6 h-6 mr-auto ${active ? '' : styles.chevron}`} />
                    )}
                </>
            )}
        </a>
    );
};


const NavHeader: React.FC<{ collapsed: boolean; sidebarColor: ThemeSettings['sidebarColor']; children: React.ReactNode }> = ({ collapsed, sidebarColor, children }) => {
    if (collapsed) return null;

    const headerColors = {
        light: 'text-slate-400',
        dark: 'text-slate-500',
        brand: 'text-[#a4d3ed]',
        gradient: 'text-purple-200'
    }

    return (
        <h3 className={`px-3 pt-4 pb-2 text-sm font-semibold uppercase tracking-wider text-right ${headerColors[sidebarColor]}`}>
            {children}
        </h3>
    );
};

const UserInfoBlock: React.FC<{ collapsed: boolean }> = ({ collapsed }) => (
    <div className={`p-4 flex items-center ${collapsed ? 'justify-center' : ''}`}>
        <img
            src="https://picsum.photos/id/237/200/200"
            alt="User Avatar"
            className="w-10 h-10 rounded-full flex-shrink-0"
          />
          {!collapsed && (
            <div className="mr-3 text-right">
                <div className="font-semibold text-sm">وليد الله</div>
                <div className="text-xs opacity-80">مدير</div>
            </div>
          )}
    </div>
);


const navigationSections = [
  {
    header: 'الصفحة الرئيسية',
    items: [{ label: 'لوحة التحكم', icon: DashboardIcon, active: true, notificationCount: 2 }]
  },
  {
    header: 'إدارة الحجوزات',
    items: [
      { label: 'الغرف السكنية', icon: CalendarIcon, hasSubMenu: true },
      { label: 'الحجوزات', icon: BriefcaseIcon },
      { label: 'الطلبات', icon: CartIcon }
    ]
  },
  {
    header: 'الإدارة المالية',
    items: [{ label: 'السندات', icon: CreditCardIcon, hasSubMenu: true }]
  },
  {
    header: 'إدارة النزلاء',
    items: [
      { label: 'النزيل', icon: UsersIcon },
      { label: 'وكالات الحجز', icon: PresentationChartLineIcon }
    ]
  },
  {
    header: 'أخرى',
    items: [
      { label: 'التقارير', icon: ClockIcon },
      { label: 'الارشيفات', icon: ArchiveBoxIcon },
      { label: 'الإشعارات', icon: PaperAirplaneIcon },
      { label: 'الإعدادات', icon: CogIcon }
    ]
  }
];


interface SidebarProps {
    onLogout: () => void;
    settings: ThemeSettings;
    isMobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
    setCurrentPage: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout, settings, isMobileMenuOpen, setMobileMenuOpen, setCurrentPage }) => {
    const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(true);

    const handleLogoutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        onLogout();
    };
    
    const handleNavItemClick = (e: React.MouseEvent<HTMLAnchorElement>, itemLabel: string) => {
        e.preventDefault();
        if (itemLabel === 'لوحة التحكم') {
            setCurrentPage('dashboard');
        }
        // For now, all links go to dashboard
        setCurrentPage('dashboard');

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
        condensed: { collapsed: 'lg:w-20', expanded: 'lg:w-56' }
    };
    
    const borderColor = {
        light: 'border-slate-200 dark:border-slate-700',
        dark: 'border-slate-700',
        brand: 'border-[#3a82ab]',
        gradient: 'border-white/10'
    }

    const widthClass = isDesktopCollapsed ? sizeClasses[sidebarSize].collapsed : sizeClasses[sidebarSize].expanded;
    const isEffectivelyCollapsed = isMobileMenuOpen ? false : isDesktopCollapsed;

  return (
    <aside 
        className={`${colorClasses[effectiveSidebarColor]} flex flex-col transition-transform duration-300 ease-in-out lg:transition-all lg:duration-300 h-screen fixed lg:relative z-50 right-0 w-72 lg:w-auto ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 ${widthClass}`}
        onMouseEnter={() => setIsDesktopCollapsed(false)}
        onMouseLeave={() => setIsDesktopCollapsed(true)}
    >
        <div className={`border-b ${borderColor[effectiveSidebarColor]} transition-all duration-300 flex items-center justify-center h-20 px-4`}>
            <h1 className={`font-bold whitespace-nowrap ${isEffectivelyCollapsed ? 'text-2xl' : 'text-xl'}`}>
                {isEffectivelyCollapsed ? 'نزلكم' : 'نزلكم لإدارة الفنادق'}
            </h1>
        </div>

      <nav className="flex-grow p-3 overflow-y-auto">
        {navigationSections.map((section, index) => (
            <div key={index}>
                <NavHeader collapsed={isEffectivelyCollapsed} sidebarColor={effectiveSidebarColor}>{section.header}</NavHeader>
                {section.items.map((item, itemIndex) => (
                    <NavItem 
                        key={itemIndex}
                        {...item}
                        collapsed={isEffectivelyCollapsed}
                        sidebarColor={effectiveSidebarColor}
                        onClick={(e) => handleNavItemClick(e, item.label)}
                    />
                ))}
            </div>
        ))}
      </nav>

      <div className={`p-3 border-t ${borderColor[effectiveSidebarColor]}`}>
        {showUserInfo && <UserInfoBlock collapsed={isEffectivelyCollapsed} />}
        <NavItem label="تسجيل الخروج" icon={ArrowLeftOnRectangleIcon} collapsed={isEffectivelyCollapsed} onClick={handleLogoutAndMenuClose} sidebarColor={effectiveSidebarColor} />
      </div>
    </aside>
  );
};

export default Sidebar;