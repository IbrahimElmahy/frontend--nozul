import React, { useState, useEffect, useRef } from 'react';
import ChevronLeftIcon from './icons-redesign/ChevronLeftIcon';
import ChevronDownIcon from './icons-redesign/ChevronDownIcon';
import UserIcon from './icons-redesign/UserIcon';
import ArrowLeftOnRectangleIcon from './icons-redesign/ArrowLeftOnRectangleIcon';

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogoutClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDropdownOpen(false);
    onLogout();
  }

  return (
    <header className="bg-white dark:bg-slate-800 dark:border-b dark:border-slate-700 shadow-sm p-4 flex justify-between items-center">
      <div className="flex items-center text-sm">
        <h1 className="text-lg font-bold text-slate-800 dark:text-slate-200">لوحة التحكم</h1>
        <ChevronLeftIcon className="w-5 h-5 text-gray-400 dark:text-gray-500 mx-2" />
        <span className="text-gray-500 dark:text-gray-400">شقق ساس المصيف الفندقيه</span>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-2 space-x-reverse"
          aria-haspopup="true"
          aria-expanded={isDropdownOpen}
        >
          <img
            src="https://picsum.photos/id/237/200/200"
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <div className="font-semibold text-sm text-slate-700 dark:text-slate-300 text-right">وليد الله</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 text-right">مدير</div>
          </div>
          <ChevronDownIcon className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        {isDropdownOpen && (
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
    </header>
  );
};

export default Header;