
import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { PeakTime } from '../types';
import XMarkIcon from './icons-redesign/XMarkIcon';
import CheckCircleIcon from './icons-redesign/CheckCircleIcon';
import DatePicker from './DatePicker';
import Checkbox from './Checkbox';

interface AddPeakTimePanelProps {
    initialData: PeakTime | null;
    isEditing: boolean;
    isOpen: boolean;
    onClose: () => void;
    onSave: (formData: FormData) => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 border-b pb-3 dark:border-slate-700">{title}</h3>
        {children}
    </div>
);

const AddPeakTimePanel: React.FC<AddPeakTimePanelProps> = ({ initialData, isEditing, isOpen, onClose, onSave }) => {
    const { t, language } = useContext(LanguageContext);
    const [formData, setFormData] = useState<Partial<PeakTime>>({
        start_date: '',
        end_date: '',
        sat: false,
        sun: false,
        mon: false,
        tue: false,
        wed: false,
        thu: false,
        fri: false,
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({ ...initialData });
            } else {
                const today = new Date().toISOString().split('T')[0];
                setFormData({
                    start_date: today,
                    end_date: today,
                    sat: false,
                    sun: false,
                    mon: false,
                    tue: false,
                    wed: false,
                    thu: false,
                    fri: false,
                });
            }
        }
    }, [isOpen, initialData]);

    const handleDateChange = (key: 'start_date' | 'end_date', value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleDayChange = (day: keyof PeakTime, checked: boolean) => {
        setFormData(prev => ({ ...prev, [day]: checked }));
    };

    const handleSaveClick = () => {
        const data = new FormData();
        if (formData.start_date) data.append('start_date', formData.start_date);
        if (formData.end_date) data.append('end_date', formData.end_date);
        data.append('category', 'peak time');

        const days = ['sat', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri'] as const;
        days.forEach(day => {
            if (formData[day]) {
                data.append(day, 'on');
            }
        });

        onSave(data);
    };

    const labelClass = `block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ${language === 'ar' ? 'text-right' : 'text-left'}`;

    return (
        <div className={`fixed inset-0 z-50 flex items-start justify-end transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden="true"></div>
            <div className={`relative h-full bg-slate-100 dark:bg-slate-900 shadow-2xl flex flex-col w-full max-w-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <header className="flex items-center justify-between p-4 border-b dark:border-slate-700 flex-shrink-0 sticky top-0 bg-white dark:bg-slate-800 z-10">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                        {isEditing ? t('peakTimes.editPeakTimeTitle') : t('peakTimes.addPeakTimeTitle')}
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Close">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </header>

                <div className="flex-grow p-6 overflow-y-auto">
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                        <Section title={t('bookings.calendarInfo')}>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className={labelClass}>{t('peakTimes.th_startDate')}</label>
                                    <DatePicker value={formData.start_date || ''} onChange={(date) => handleDateChange('start_date', date)} />
                                </div>
                                <div>
                                    <label className={labelClass}>{t('peakTimes.th_endDate')}</label>
                                    <DatePicker value={formData.end_date || ''} onChange={(date) => handleDateChange('end_date', date)} />
                                </div>
                            </div>
                        </Section>

                        <Section title={t('peakTimes.days')}>
                            <div className="grid grid-cols-2 gap-4">
                                <Checkbox id="sat" label={t('peakTimes.th_saturday')} checked={!!formData.sat} onChange={(c) => handleDayChange('sat', c)} />
                                <Checkbox id="sun" label={t('peakTimes.th_sunday')} checked={!!formData.sun} onChange={(c) => handleDayChange('sun', c)} />
                                <Checkbox id="mon" label={t('peakTimes.th_monday')} checked={!!formData.mon} onChange={(c) => handleDayChange('mon', c)} />
                                <Checkbox id="tue" label={t('peakTimes.th_tuesday')} checked={!!formData.tue} onChange={(c) => handleDayChange('tue', c)} />
                                <Checkbox id="wed" label={t('peakTimes.th_wednesday')} checked={!!formData.wed} onChange={(c) => handleDayChange('wed', c)} />
                                <Checkbox id="thu" label={t('peakTimes.th_thursday')} checked={!!formData.thu} onChange={(c) => handleDayChange('thu', c)} />
                                <Checkbox id="fri" label={t('peakTimes.th_friday')} checked={!!formData.fri} onChange={(c) => handleDayChange('fri', c)} />
                            </div>
                        </Section>
                    </form>
                </div>

                <footer className="flex items-center justify-start p-4 border-t dark:border-slate-700 flex-shrink-0 gap-3 sticky bottom-0 bg-white dark:bg-slate-800">
                    <button onClick={handleSaveClick} className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
                        <CheckCircleIcon className="w-5 h-5" />
                        <span>{t('units.saveChanges')}</span>
                    </button>
                    <button onClick={onClose} className="bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 font-semibold py-2 px-5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                        {t('units.cancel')}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default AddPeakTimePanel;
