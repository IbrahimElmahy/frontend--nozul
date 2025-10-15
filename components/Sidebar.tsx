import React, { useState } from 'react';
import DashboardIcon from './icons/DashboardIcon';
import CalendarIcon from './icons/CalendarIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import CartIcon from './icons/CartIcon';
import CreditCardIcon from './icons/CreditCardIcon';
import UsersIcon from './icons/UsersIcon';
import ChartBarIcon from './icons/ChartBarIcon';
import ClockIcon from './icons/ClockIcon';
import ArchiveIcon from './icons/ArchiveIcon';
import PaperAirplaneIcon from './icons/PaperAirplaneIcon';
import CogIcon from './icons/CogIcon';
import LogoutIcon from './icons/LogoutIcon';
import ChevronDoubleRightIcon from './icons/ChevronDoubleRightIcon';
import ChevronLeftIcon from './icons/ChevronLeftIcon';

interface NavItemProps {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    active?: boolean;
    notificationCount?: number;
    hasSubMenu?: boolean;
    collapsed: boolean;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const NavItem: React.FC<NavItemProps> = ({ label, icon: Icon, active, notificationCount, hasSubMenu, collapsed, onClick }) => {
    const baseClasses = 'flex items-center w-full p-2.5 my-1 rounded-md text-sm font-medium transition-colors duration-200';
    const activeClasses = 'bg-white text-blue-700 shadow-sm';
    const inactiveClasses = 'text-blue-100 hover:bg-blue-700';

    return (
        <a
            href="#"
            onClick={onClick}
            title={collapsed ? label : undefined}
            className={`${baseClasses} ${active ? activeClasses : inactiveClasses} ${collapsed ? 'justify-center' : 'justify-between'}`}
        >
            <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-end'} flex-grow`}>
                {!collapsed && (
                     <div className="flex-1 flex items-center justify-between">
                        <div className="flex items-center">
                            {hasSubMenu && <ChevronLeftIcon className={`w-5 h-5 ${active ? 'text-blue-700' : 'text-blue-200'}`} />}
                        </div>
                        <div className="flex items-center">
                             {notificationCount && (
                                <span className={`flex items-center justify-center text-xs font-bold rounded-full w-5 h-5 mr-2 ${active ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`}>{notificationCount}</span>
                            )}
                            <span className="mr-2">{label}</span>
                        </div>
                    </div>
                )}
                <Icon className="w-5 h-5" />
            </div>
        </a>
    );
};


const NavHeader: React.FC<{ collapsed: boolean, children: React.ReactNode }> = ({ collapsed, children }) => {
    if (collapsed) return null;
    return (
        <h3 className="px-3 pt-4 pb-2 text-xs font-semibold text-blue-300 uppercase tracking-wider">
            {children}
        </h3>
    );
};


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
      { label: 'وكالات الحجز', icon: ChartBarIcon }
    ]
  },
  {
    header: 'أخرى',
    items: [
      { label: 'التقارير', icon: ClockIcon },
      { label: 'الارشيفات', icon: ArchiveIcon },
      { label: 'الإشعارات', icon: PaperAirplaneIcon },
      { label: 'الإعدادات', icon: CogIcon }
    ]
  }
];


interface SidebarProps {
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleLogoutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        onLogout();
    };
    
  return (
    <aside className={`bg-blue-600 text-white flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-blue-700">
            <h1 className={`text-lg font-bold whitespace-nowrap overflow-hidden transition-opacity ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                نزلكم لإدارة الفنادق
            </h1>
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white">
                <ChevronDoubleRightIcon className={`w-6 h-6 transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
            </button>
        </div>

      <nav className="flex-grow p-2 overflow-y-auto">
        {navigationSections.map((section, index) => (
            <div key={index}>
                <NavHeader collapsed={isCollapsed}>{section.header}</NavHeader>
                {section.items.map((item, itemIndex) => (
                    <NavItem 
                        key={itemIndex}
                        {...item}
                        collapsed={isCollapsed}
                    />
                ))}
            </div>
        ))}
      </nav>

      <div className="p-2 border-t border-blue-700">
        <NavItem label="تسجيل الخروج" icon={LogoutIcon} collapsed={isCollapsed} onClick={handleLogoutClick} />
      </div>
    </aside>
  );
};

export default Sidebar;