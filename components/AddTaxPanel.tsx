import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Tax } from '../types';
import XMarkIcon from './icons-redesign/XMarkIcon';
import CheckCircleIcon from './icons-redesign/CheckCircleIcon';
import DatePicker from './DatePicker';
import SearchableSelect from './SearchableSelect';
import Switch from './Switch';

interface AddTaxPanelProps {
    initialData: Omit<Tax, 'id' | 'createdAt' | 'updatedAt'>;
    isEditing: boolean;
    isOpen: boolean;
    onClose: () => void;
    onSave: (taxData: Omit<Tax, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const AddTaxPanel: React.FC<AddTaxPanelProps> = ({ initialData, isEditing, isOpen, onClose, onSave }) => {
    const { t } = useContext(LanguageContext);
    const [formData, setFormData] = useState(initialData);

    useEffect(() => {
        if (isOpen) {
            setFormData(JSON.parse(JSON.stringify(initialData)));
        }
    }, [isOpen, initialData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };
    
    const handleDateChange = (name: 'startDate' | 'endDate', date: string) => {
        // Keep the time part if it exists
        const timePart = formData[name]?.split(' ')[1] || '00:00:00';
        setFormData(prev => ({ ...prev, [name]: `${date} ${timePart}` }));
    };

    const handleSaveClick = () => {
        onSave(formData);
    };

    const inputBaseClass = `w-full px-3 py-2 bg-white dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-slate-200 text-sm`;
    const labelBaseClass = `block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1`;
    
    const applyToOptions = [t('taxes.applyTo_bookings'), t('taxes.applyTo_services')];

    return (
        <div className={`fixed inset-0 z-50 flex items-start justify-end transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} role="dialog">
            <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden="true"></div>
            <div className={`relative h-full bg-white dark:bg-slate-800 shadow-2xl flex flex-col w-full max-w-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <header className="flex items-center justify-between p-4 border-b dark:border-slate-700 flex-shrink-0 sticky top-0 bg-white dark:bg-slate-800 z-10">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">{isEditing ? t('taxes.editTaxTitle') : t('taxes.addTaxTitle')}</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Close"><XMarkIcon className="w-6 h-6" /></button>
                </header>
                <div className="flex-grow p-6 overflow-y-auto">
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                        <div>
                            <label htmlFor="name" className={labelBaseClass}>{t('taxes.th_name')}</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} className={inputBaseClass} />
                        </div>
                        <div>
                            <label htmlFor="tax" className={labelBaseClass}>{t('taxes.th_tax')} (%)</label>
                            <input type="number" name="tax" id="tax" value={formData.tax} onChange={handleNumberChange} className={inputBaseClass} />
                        </div>
                        <div>
                            <label htmlFor="applyTo" className={labelBaseClass}>{t('taxes.th_applyTo')}</label>
                            <SearchableSelect id="applyTo" options={applyToOptions} value={formData.applyTo} onChange={val => setFormData(p => ({...p, applyTo: val as 'الحجوزات' | 'الخدمات'}))} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelBaseClass}>{t('taxes.th_startDate')}</label>
                                <DatePicker value={formData.startDate.split(' ')[0]} onChange={date => handleDateChange('startDate', date)} />
                            </div>
                            <div>
                                <label className={labelBaseClass}>{t('taxes.th_endDate')}</label>
                                <DatePicker value={formData.endDate.split(' ')[0]} onChange={date => handleDateChange('endDate', date)} />
                            </div>
                        </div>
                         <div className="space-y-3 pt-4">
                             <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"><label htmlFor="addedToFees" className="text-sm font-medium">{t('taxes.th_addedToFees')}</label><Switch id="addedToFees" checked={formData.addedToFees} onChange={c => setFormData(p => ({...p, addedToFees: c}))} /></div>
                             <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"><label htmlFor="subjectToVat" className="text-sm font-medium">{t('taxes.th_subjectToVat')}</label><Switch id="subjectToVat" checked={formData.subjectToVat} onChange={c => setFormData(p => ({...p, subjectToVat: c}))} /></div>
                             <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"><label htmlFor="status" className="text-sm font-medium">{t('taxes.th_status')}</label><Switch id="status" checked={formData.status === 'مفعل'} onChange={c => setFormData(p => ({...p, status: c ? 'مفعل' : 'غير مفعل'}))} /></div>
                         </div>
                    </form>
                </div>
                <footer className="flex items-center justify-start p-4 border-t dark:border-slate-700 flex-shrink-0 gap-3 sticky bottom-0 bg-white dark:bg-slate-800">
                    <button onClick={handleSaveClick} className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 flex items-center gap-2"><CheckCircleIcon className="w-5 h-5" /><span>{t('units.saveChanges')}</span></button>
                    <button onClick={onClose} className="bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 font-semibold py-2 px-5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600">{t('units.cancel')}</button>
                </footer>
            </div>
        </div>
    );
};

export default AddTaxPanel;