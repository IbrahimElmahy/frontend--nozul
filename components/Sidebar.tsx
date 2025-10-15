import React from 'react';
import DashboardIcon from './icons/DashboardIcon';
import CalendarIcon from './icons/CalendarIcon';
import BedIcon from './icons/BedIcon';
import CartIcon from './icons/CartIcon';
import UsersIcon from './icons/UsersIcon';
import ChartBarIcon from './icons/ChartBarIcon';
import ClockIcon from './icons/ClockIcon';
import CogIcon from './icons/CogIcon';
import LogoutIcon from './icons/LogoutIcon';

const NavItem: React.FC<{ icon: React.ReactNode; active?: boolean, notification?: boolean }> = ({ icon, active, notification }) => (
  <a
    href="#"
    className={`relative flex items-center justify-center p-3 my-2 rounded-lg transition-colors duration-200 ${
      active ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
    }`}
  >
    {icon}
    {notification && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>}
  </a>
);

const Sidebar: React.FC = () => {
  return (
    <aside className="w-20 bg-slate-800 text-white flex flex-col items-center py-4">
      <div className="text-2xl font-bold text-blue-400 mb-8">ن</div>

      <nav className="flex flex-col items-center flex-grow">
        <NavItem icon={<DashboardIcon />} active />
        <NavItem icon={<CalendarIcon />} />
        <NavItem icon={<BedIcon />} />
        <NavItem icon={<CartIcon />} />
        <NavItem icon={<UsersIcon />} />
        <NavItem icon={<ChartBarIcon />} />
        <NavItem icon={<ClockIcon />} />
      </nav>

      <div className="flex flex-col items-center">
        <NavItem icon={<CogIcon />} />
        <NavItem icon={<LogoutIcon />} />
      </div>
    </aside>
  );
};

export default Sidebar;
