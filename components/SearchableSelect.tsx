import React, { useState, useEffect, useRef, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import ChevronUpDownIcon from './icons-redesign/ChevronUpDownIcon';
import MagnifyingGlassIcon from './icons-redesign/MagnifyingGlassIcon';

interface SearchableSelectProps {
    options: string[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    id: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ options, value, onChange, placeholder, id }) => {
    const { language } = useContext(LanguageContext);
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (option: string) => {
        onChange(option);
        setIsOpen(false);
        setSearchTerm('');
    };

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const baseClass = `w-full px-4 py-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-slate-200`;
    const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                id={id}
                onClick={() => setIsOpen(!isOpen)}
                className={`${baseClass} ${textAlignClass} flex justify-between items-center`}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className={value ? 'text-gray-900 dark:text-slate-200' : 'text-gray-500 dark:text-gray-400'}>
                    {value || placeholder}
                </span>
                <ChevronUpDownIcon className="w-5 h-5 text-gray-400" />
            </button>

            {isOpen && (
                <div className={`absolute top-full mt-2 w-full bg-white dark:bg-slate-800 rounded-lg shadow-lg border dark:border-slate-700 z-20`}>
                    <div className="p-2">
                        <div className="relative">
                             <MagnifyingGlassIcon className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full py-2 border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-200 text-sm ${language === 'ar' ? 'pr-9' : 'pl-9'}`}
                            />
                        </div>
                    </div>
                    <ul className="max-h-60 overflow-y-auto" role="listbox">
                        {filteredOptions.map(option => (
                            <li
                                key={option}
                                onClick={() => handleSelect(option)}
                                className={`px-4 py-2 text-sm cursor-pointer ${textAlignClass} ${
                                    value === option
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700'
                                }`}
                                role="option"
                                aria-selected={value === option}
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchableSelect;