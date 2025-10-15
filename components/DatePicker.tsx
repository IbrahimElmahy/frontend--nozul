import React, { useState, useEffect, useRef } from 'react';
import ChevronLeftIcon from './icons-redesign/ChevronLeftIcon';
import ChevronRightIcon from './icons-redesign/ChevronRightIcon';

interface DatePickerProps {
    value: string;
    onChange: (date: string) => void;
}

const MONTH_NAMES = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];
const DAYS_OF_WEEK = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(new Date(value || Date.now()));
    const datepickerRef = useRef<HTMLDivElement>(null);

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
        const newDate = new Date(value);
        if (!isNaN(newDate.getTime())) {
            setViewDate(newDate);
        }
    }, [value]);

    const handleDateSelect = (day: number) => {
        const selected = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        onChange(selected.toISOString().split('T')[0]);
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
        
        const selectedDate = new Date(value);
        const selectedDay = selectedDate.getDate();
        const selectedMonth = selectedDate.getMonth();
        const selectedYear = selectedDate.getFullYear();

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
                    {DAYS_OF_WEEK.map(day => <div key={day}>{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {blanks}
                    {days}
                </div>
            </div>
        );
    };

    return (
        <div className="relative" ref={datepickerRef}>
            <input
                type="text"
                readOnly
                value={value}
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right text-gray-900 dark:text-slate-200 cursor-pointer"
            />
            {isOpen && (
                <div className="absolute top-full mt-2 right-0 z-10 w-72 bg-white dark:bg-slate-800 rounded-lg shadow-lg border dark:border-slate-700 p-2">
                    <div className="flex justify-between items-center mb-2 px-2">
                        <button onClick={() => changeMonth(-1)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"><ChevronRightIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" /></button>
                        <div className="font-semibold text-gray-800 dark:text-gray-200">{MONTH_NAMES[viewDate.getMonth()]}</div>
                        <button onClick={() => changeMonth(1)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"><ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" /></button>
                    </div>
                    <div className="flex justify-between items-center mb-2 px-2">
                         <button onClick={() => changeYear(-1)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"><ChevronRightIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" /></button>
                        <div className="font-semibold text-gray-800 dark:text-gray-200">{viewDate.getFullYear()}</div>
                         <button onClick={() => changeYear(1)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"><ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" /></button>
                    </div>
                    {renderCalendar()}
                </div>
            )}
        </div>
    );
};

export default DatePicker;