import React from 'react';
import ChevronLeftIcon from './icons/ChevronLeftIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <div className="flex items-center text-sm">
        <h1 className="text-lg font-bold text-slate-800">لوحة التحكم</h1>
        <ChevronLeftIcon className="w-5 h-5 text-gray-400 mx-2" />
        <span className="text-gray-500">شقق ساس المصيف الفندقيه</span>
      </div>

      <div className="flex items-center space-x-4 space-x-reverse">
        <div className="relative">
            <input type="text" placeholder="بحث..." className="w-48 px-3 py-1.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <img
            src="https://picsum.photos/id/237/200/200"
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <div className="font-semibold text-sm">وليد الله</div>
            <div className="text-xs text-gray-500">مدير</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
