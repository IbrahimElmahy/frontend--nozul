import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Bank } from '../types';
import XMarkIcon from './icons-redesign/XMarkIcon';
import CheckCircleIcon from './icons-redesign/CheckCircleIcon';
import Switch from './Switch';

interface AddBankPanelProps {
    initialData: Omit<Bank, 'id' | 'created_at' | 'updated_at'>;
    isEditing: boolean;
    isOpen: boolean;
    onClose: () => void;
    onSave: (bankData: Omit<Bank, 'id' | 'created_at' | 'updated_at'>) => void;
}

const AddBankPanel: React.FC<AddBankPanelProps> = ({ initialData, isEditing, isOpen, onClose, onSave }) => {
    const { t } = useContext(LanguageContext);
    const [formData, setFormData] = useState(initialData);

    useEffect(() => {
        if (isOpen) {
            setFormData(JSON.parse(JSON.stringify(initialData)));
        }
    }, [isOpen, initialData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveClick = () => {
        onSave(formData);
    };

    const inputBaseClass = `w-full px-3 py-2 bg-white dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-slate-200 text-sm`;
    const labelBaseClass = `block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1`;
    
    return (
        <div className={`fixed inset-0 z-50 flex items-start justify-end transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} role="dialog">
            <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden="true"></div>
            <div className={`relative h-full bg-white dark:bg-slate-800 shadow-2xl flex flex-col w-full max-w-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <header className="flex items-center justify-between p-4 border-b dark:border-slate-700 flex-shrink-0 sticky top-0 bg-white dark:bg-slate-800 z-10">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">{isEditing ? t('banksPage.editTitle') : t('banksPage.addTitle')}</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Close"><XMarkIcon className="w-6 h-6" /></button>
                </header>
                <div className="flex-grow p-6 overflow-y-auto">
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                        <div>
                            <label htmlFor="name_en" className={labelBaseClass}>{t('banksPage.th_name_en')}</label>
                            <input type="text" name="name_en" id="name_en" value={formData.name_en} onChange={handleInputChange} className={inputBaseClass} />
                        </div>
                        <div>
                            <label htmlFor="name_ar" className={labelBaseClass}>{t('banksPage.th_name_ar')}</label>
                            <input type="text" name="name_ar" id="name_ar" value={formData.name_ar} onChange={handleInputChange} className={inputBaseClass} />
                        </div>
                        <div>
                            <label htmlFor="description" className={labelBaseClass}>{"الوصف"}</label>
                            <textarea name="description" id="description" value={formData.description || ''} onChange={handleInputChange} className={inputBaseClass} rows={3}></textarea>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                            <label htmlFor="status" className="font-semibold text-slate-800 dark:text-slate-200">{t('banksPage.th_status')}</label>
                            <Switch id="status" checked={formData.is_active !== false} onChange={c => setFormData(p => ({ ...p!, is_active: c, status: c ? 'active' : 'inactive' }))} />
                        </div>
                    </form>
                </div>
                <footer className="flex items-center justify-start p-4 border-t dark:border-slate-700 flex-shrink-0 gap-3 sticky bottom-0 bg-white dark:bg-slate-800">
                    <button onClick={handleSaveClick} className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                        <CheckCircleIcon className="w-5 h-5" />
                        <span>{t('banksPage.save')}</span>
                    </button>
                    <button onClick={onClose} className="bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 font-semibold py-2 px-5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600">
                        {t('banksPage.cancel')}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default AddBankPanel;