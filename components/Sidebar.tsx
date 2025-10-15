import React, { useState } from 'react';
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
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const NavItem: React.FC<NavItemProps> = ({ label, icon: Icon, active, notificationCount, hasSubMenu, collapsed, onClick }) => {
    const baseClasses = 'flex items-center w-full p-3 my-1 rounded-lg text-base font-medium transition-colors duration-200';
    const activeClasses = 'bg-white text-[#4395c6] shadow-sm';
    const inactiveClasses = 'text-blue-100 hover:bg-[#3a82ab]';

    return (
        <a
            href="#"
            onClick={onClick}
            title={collapsed ? label : undefined}
            className={`${baseClasses} ${active ? activeClasses : inactiveClasses} ${collapsed ? 'justify-center' : ''}`}
        >
            <Icon className="w-6 h-6 flex-shrink-0" />
            {!collapsed && (
                <>
                    <span className="mr-4 flex-grow text-right">{label}</span>
                    {notificationCount && (
                        <span className={`flex items-center justify-center text-sm font-bold rounded-full w-6 h-6 ml-2 ${active ? 'bg-blue-100 text-[#4395c6]' : 'bg-[#5badd9] text-white'}`}>{notificationCount}</span>
                    )}
                    {hasSubMenu && (
                        <ChevronLeftIcon className={`w-6 h-6 mr-auto ${active ? 'text-[#4395c6]' : 'text-blue-200'}`} />
                    )}
                </>
            )}
        </a>
    );
};


const NavHeader: React.FC<{ collapsed: boolean, children: React.ReactNode }> = ({ collapsed, children }) => {
    if (collapsed) return null;
    return (
        <h3 className="px-3 pt-4 pb-2 text-sm font-semibold text-[#a4d3ed] uppercase tracking-wider text-right">
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
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const handleLogoutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        onLogout();
    };
    
  return (
    <aside 
        className={`bg-[#4395c6] text-white flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'w-24' : 'w-72'}`}
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
    >
        <div className="border-b border-[#3a82ab] transition-all duration-300 flex items-center justify-center h-20 px-4">
            <h1 className={`font-bold whitespace-nowrap ${isCollapsed ? 'text-2xl' : 'text-xl'}`}>
                {isCollapsed ? 'نزلكم' : 'نزلكم لإدارة الفنادق'}
            </h1>
        </div>

      <nav className="flex-grow p-3 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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

      <div className="p-3 border-t border-[#3a82ab]">
        <NavItem label="تسجيل الخروج" icon={ArrowLeftOnRectangleIcon} collapsed={isCollapsed} onClick={handleLogoutClick} />
      </div>
    </aside>
  );
};

export default Sidebar;