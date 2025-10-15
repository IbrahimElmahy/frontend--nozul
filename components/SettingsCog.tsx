import React, { useState } from 'react';
import CogIcon from './icons-redesign/CogIcon';

interface SettingsCogProps {
    theme: string;
    setTheme: (theme: string) => void;
}

const SettingsCog: React.FC<SettingsCogProps> = ({ theme, setTheme }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <div className="fixed bottom-6 left-6 z-50">
            <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 invisible'}`}>
                <div className="absolute bottom-full left-0 mb-3 w-60 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border dark:border-slate-700 p-4">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 text-right">الإعدادات</h4>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">الوضع الداكن</span>
                        <label htmlFor="dark-mode-toggle" className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                id="dark-mode-toggle"
                                className="sr-only peer"
                                checked={theme === 'dark'}
                                onChange={toggleTheme}
                            />
                            <div className="w-11 h-6 bg-gray-200 dark:bg-slate-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-all duration-200 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                aria-label="Open settings"
                aria-expanded={isOpen}
            >
                <CogIcon className={`w-7 h-7 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
            </button>
        </div>
    );
};

export default SettingsCog;