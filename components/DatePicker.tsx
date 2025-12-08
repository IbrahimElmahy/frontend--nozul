
import React, { useState, useEffect, useRef, useContext } from 'react';
import ChevronLeftIcon from './icons-redesign/ChevronLeftIcon';
import ChevronRightIcon from './icons-redesign/ChevronRightIcon';
import { LanguageContext } from '../contexts/LanguageContext';

interface DatePickerProps {
    value: string;
    onChange: (date: string) => void;
    label?: string; // Added label prop
    selectedDate?: Date | null; // Support the prop used in AddGuestPanel
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, label, selectedDate }) => {
    const { language, translationData } = useContext(LanguageContext);

    // Use selectedDate if provided (API compatibility with AddGuestPanel), otherwise fallback to value string logic
    // AddGuestPanel passes: selectedDate={formData.birthdate ? new Date(formData.birthdate) : null}
    // But DatePicker was previously expecting a 'value' string.
    // Let's normalize it:
    const effectiveValue = selectedDate
        ? selectedDate.toISOString().split('T')[0]
        : value || '';

    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(new Date(effectiveValue || Date.now()));
    const datepickerRef = useRef<HTMLDivElement>(null);

    // Safe access with fallback to English/Default if translation is missing to prevent crash
    const MONTH_NAMES = translationData?.datepicker?.months || ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const DAYS_OF_WEEK = translationData?.datepicker?.days || ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (datepickerRef.current && !datepickerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        // When value changes from outside, update the view
        const newDate = new Date(effectiveValue);
        if (!isNaN(newDate.getTime())) {
            setViewDate(newDate);
        }
    }, [effectiveValue]);

    const handleDateSelect = (day: number) => {
        const selected = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        // Ensure we get the local date string correct, ignoring timezone shifts for the date part
        const dateString = new Date(selected.getTime() - (selected.getTimezoneOffset() * 60000))
            .toISOString()
            .split('T')[0];

        // If the parent passed a date object, they effectively receive the string back. Assumes parent understands usage.
        onChange(dateString);
        setIsOpen(false);
    };

    const changeMonth = (offset: number) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1);
        setViewDate(newDate);
    };

    const changeYear = (offset: number) => {
        const newDate = new Date(viewDate.getFullYear() + offset, viewDate.getMonth(), 1);
        setViewDate(newDate);
    }

    const renderCalendar = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const selectedDate = new Date(effectiveValue);
        const selectedDay = !isNaN(selectedDate.getTime()) ? selectedDate.getDate() : -1;
        const selectedMonth = !isNaN(selectedDate.getTime()) ? selectedDate.getMonth() : -1;
        const selectedYear = !isNaN(selectedDate.getTime()) ? selectedDate.getFullYear() : -1;

        const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => <div key={`blank-${i}`} />);
        const days = Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const isSelected = day === selectedDay && month === selectedMonth && year === selectedYear;

            return (
                <div
                    key={`day-${day}`}
                    onClick={() => handleDateSelect(day)}
                    className={`w-9 h-9 flex items-center justify-center rounded-full cursor-pointer text-sm transition-colors duration-200
                        ${isSelected
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-500/20'
                        }
                    `}
                >
                    {day}
                </div>
            );
        });

        return (
            <div className="p-1">
                <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {DAYS_OF_WEEK.map((day, i) => <div key={i}>{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {blanks}
                    {days}
                </div>
            </div>
        );
    };

    const popoverPositionClass = language === 'ar' ? 'right-0' : 'left-0';

    return (
        <div className="relative" ref={datepickerRef}>
            {label && <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>}
            <input
                type="text"
                readOnly
                value={effectiveValue}
                onClick={() => setIsOpen(!isOpen)}
                placeholder="YYYY-MM-DD"
                className={`w-full px-4 py-2 bg-white dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-slate-200 cursor-pointer ${language === 'ar' ? 'text-right' : 'text-left'}`}
            />
            {isOpen && (
                <div className={`absolute top-full mt-2 z-10 w-72 bg-white dark:bg-slate-800 rounded-lg shadow-lg border dark:border-slate-700 p-2 ${popoverPositionClass}`}>
                    <div className="flex justify-between items-center mb-2 px-2">
                        <button onClick={() => changeMonth(-1)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"><ChevronRightIcon className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${language === 'ar' ? 'rotate-180' : ''}`} /></button>
                        <div className="font-semibold text-gray-800 dark:text-gray-200">{MONTH_NAMES[viewDate.getMonth()]}</div>
                        <button onClick={() => changeMonth(1)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"><ChevronRightIcon className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${language === 'ar' ? 'rotate-180' : ''} transform rotate-180`} /></button>
                    </div>
                    <div className="flex justify-between items-center mb-2 px-2">
                        <button onClick={() => changeYear(-1)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"><ChevronRightIcon className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${language === 'ar' ? 'rotate-180' : ''}`} /></button>
                        <div className="font-semibold text-gray-800 dark:text-gray-200">{viewDate.getFullYear()}</div>
                        <button onClick={() => changeYear(1)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"><ChevronRightIcon className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${language === 'ar' ? 'rotate-180' : ''} transform rotate-180`} /></button>
                    </div>
                    {renderCalendar()}
                </div>
            )}
        </div>
    );
};

export default DatePicker;
