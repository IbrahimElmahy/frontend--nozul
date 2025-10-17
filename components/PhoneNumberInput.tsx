import React, { useState, useEffect, useRef, useContext } from 'react';
import ChevronDownIcon from './icons-redesign/ChevronDownIcon';
import { LanguageContext } from '../contexts/LanguageContext';

interface Country {
    name: string;
    code: string;
    iso: string;
    flag: string;
}

const countries: Country[] = [
    { name: 'Saudi Arabia', code: '+966', iso: 'SA', flag: '🇸🇦' },
    { name: 'United Arab Emirates', code: '+971', iso: 'AE', flag: '🇦🇪' },
    { name: 'Egypt', code: '+20', iso: 'EG', flag: '🇪🇬' },
    { name: 'Kuwait', code: '+965', iso: 'KW', flag: '🇰🇼' },
    { name: 'United States', code: '+1', iso: 'US', flag: '🇺🇸' },
    { name: 'United Kingdom', code: '+44', iso: 'GB', flag: '🇬🇧' },
    { name: 'India', code: '+91', iso: 'IN', flag: '🇮🇳' },
    { name: 'Pakistan', code: '+92', iso: 'PK', flag: '🇵🇰' },
];

// Sort countries by name for display
const sortedCountries = [...countries].sort((a, b) => a.name.localeCompare(b.name));

interface PhoneNumberInputProps {
    value: string;
    onChange: (value: string) => void;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({ value, onChange }) => {
    const { t } = useContext(LanguageContext);
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCountry, setSelectedCountry] = useState<Country>(sortedCountries.find(c => c.iso === 'SA') || sortedCountries[0]);
    const [localPhoneNumber, setLocalPhoneNumber] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Find the best matching country code from the value prop
        let bestMatch: Country | null = null;
        if (value && value.startsWith('+')) {
            for (const country of sortedCountries) {
                if (value.startsWith(country.code)) {
                    if (!bestMatch || country.code.length > bestMatch.code.length) {
                        bestMatch = country;
                    }
                }
            }
        }
        
        if (bestMatch) {
            setSelectedCountry(bestMatch);
            setLocalPhoneNumber(value.substring(bestMatch.code.length));
        } else {
            // No matching prefix found. Default to SA and log a warning.
            const saudiArabia = sortedCountries.find(c => c.iso === 'SA') || sortedCountries[0];
            setSelectedCountry(saudiArabia);

            if (value && value.startsWith('+')) {
                console.warn(`PhoneNumberInput: The initial value "${value}" does not have a recognized country code prefix. Defaulting to ${saudiArabia.name} (${saudiArabia.code}).`);
            }
            
            // Use the full value as the local number since we can't parse it
            setLocalPhoneNumber(value || '');
        }
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleCountrySelect = (country: Country) => {
        setSelectedCountry(country);
        onChange(`${country.code}${localPhoneNumber}`);
        setIsOpen(false);
        setSearchTerm('');
    };

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newNumber = e.target.value;
        setLocalPhoneNumber(newNumber);
        onChange(`${selectedCountry.code}${newNumber}`);
    };
    
    const filteredCountries = sortedCountries.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.code.includes(searchTerm)
    );

    return (
        <div className="relative" ref={containerRef} dir="ltr">
            <div className="flex rounded-md shadow-sm">
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="relative z-10 inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium bg-slate-50 dark:bg-slate-700/50 border border-r-0 border-gray-200 dark:border-slate-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <span>{selectedCountry.flag}</span>
                        <ChevronDownIcon className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                        <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-lg shadow-lg border dark:border-slate-700 z-20">
                            <div className="p-2">
                                <input
                                    type="text"
                                    placeholder={t('phone.search')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-md text-sm text-slate-900 dark:text-slate-200"
                                />
                            </div>
                            <ul className="max-h-60 overflow-y-auto">
                                {filteredCountries.map(country => (
                                    <li
                                        key={country.iso}
                                        onClick={() => handleCountrySelect(country)}
                                        className="flex items-center justify-between px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer"
                                    >
                                        <span className="flex items-center gap-3">
                                            <span>{country.flag}</span>
                                            <span>{country.name}</span>
                                        </span>
                                        <span className="text-gray-500 dark:text-gray-400">{country.code}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div className="flex items-center pl-3 pr-2 bg-slate-50 dark:bg-slate-700/50 border-t border-b border-gray-200 dark:border-slate-600 text-sm text-gray-600 dark:text-gray-300">
                    {selectedCountry.code}
                </div>
                <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={localPhoneNumber}
                    onChange={handlePhoneNumberChange}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700/50 border border-l-0 border-gray-200 dark:border-slate-600 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-left text-gray-900 dark:text-slate-200"
                />
            </div>
        </div>
    );
};

export default PhoneNumberInput;