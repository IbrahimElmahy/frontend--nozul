import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { ApartmentPrice } from '../types';
import XMarkIcon from './icons-redesign/XMarkIcon';
import CheckCircleIcon from './icons-redesign/CheckCircleIcon';
import { updateApartmentPrice } from '../services/prices';

interface ApartmentPriceEditPanelProps {
    data: ApartmentPrice | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedData: ApartmentPrice) => void;
    mode: 'view' | 'edit';
}

const SectionHeader: React.FC<{ title: string; }> = ({ title }) => (
    <div className="bg-slate-100 dark:bg-slate-700/50 p-2 my-4 rounded-md flex items-center">
        <div className="w-1 h-4 bg-blue-500 rounded-full mx-2"></div>
        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">{title}</h3>
    </div>
);

const FormField: React.FC<{ label: string; children: React.ReactNode; }> = ({ label, children }) => {
    const { language } = useContext(LanguageContext);
    const labelClass = `block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ${language === 'ar' ? 'text-right' : 'text-left'}`;
    return (
        <div>
            <label className={labelClass}>{label}</label>
            {children}
        </div>
    );
};

const ApartmentPriceEditPanel: React.FC<ApartmentPriceEditPanelProps> = ({ data, isOpen, onClose, onSave, mode }) => {
    const { t } = useContext(LanguageContext);
    const [formData, setFormData] = useState<ApartmentPrice | null>(data);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (data) {
            setFormData(JSON.parse(JSON.stringify(data)));
        }
    }, [data]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!formData) return;
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    };

    const handleSaveClick = async () => {
        if (!formData) return;
        setIsSaving(true);
        try {
            const payload = new FormData();
            payload.append('hourly_price', formData.hourly_price.toString());
            payload.append('hourly_minimum_price', formData.hourly_minimum_price.toString());
            payload.append('regular_price', formData.regular_price.toString());
            payload.append('regular_minimum_price', formData.regular_minimum_price.toString());
            payload.append('monthly_price', formData.monthly_price.toString());
            payload.append('monthly_minimum_price', formData.monthly_minimum_price.toString());
            payload.append('peak_price', formData.peak_price.toString());

            const updatedData = await updateApartmentPrice(formData.apartment_id, payload);
            if (updatedData) {
                onSave({ ...formData, ...(updatedData as any) });
            } else {
                onSave({ ...formData }); // Fallback should update return data
            }
        } catch (error) {
            alert(`Error saving prices: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsSaving(false);
        }
    };


    const isViewMode = mode === 'view';
    if (!isOpen || !formData) return null;

    const title = mode === 'edit' ? t('apartmentPrices.edit.title') : t('apartmentPrices.view.title');
    const inputBaseClass = `w-full px-3 py-2 bg-white dark:bg-slate-900/50 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-slate-200 text-sm disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:cursor-not-allowed`;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-start justify-end transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            role="dialog" aria-modal="true"
        >
            <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden="true"></div>
            <div className={`relative h-full bg-slate-50 dark:bg-slate-800 shadow-2xl flex flex-col w-full max-w-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <header className="flex items-center justify-between p-4 border-b dark:border-slate-700 flex-shrink-0 sticky top-0 bg-white dark:bg-slate-900 z-10">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">{title} - {formData.apartment}</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Close"><XMarkIcon className="w-6 h-6" /></button>
                </header>

                <div className="flex-grow p-6 overflow-y-auto">
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                        <SectionHeader title={t('apartmentPrices.th_hourly')} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label={t('apartmentPrices.th_price')}>
                                <input type="number" name="hourly_price" value={formData.hourly_price} onChange={handleInputChange} className={inputBaseClass} disabled={isViewMode} />
                            </FormField>
                            <FormField label={t('apartmentPrices.th_lowestPrice')}>
                                <input type="number" name="hourly_minimum_price" value={formData.hourly_minimum_price} onChange={handleInputChange} className={inputBaseClass} disabled={isViewMode} />
                            </FormField>
                        </div>

                        <SectionHeader title={t('apartmentPrices.th_daily')} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label={t('apartmentPrices.th_price')}>
                                <input type="number" name="regular_price" value={formData.regular_price} onChange={handleInputChange} className={inputBaseClass} disabled={isViewMode} />
                            </FormField>
                            <FormField label={t('apartmentPrices.th_lowestPrice')}>
                                <input type="number" name="regular_minimum_price" value={formData.regular_minimum_price} onChange={handleInputChange} className={inputBaseClass} disabled={isViewMode} />
                            </FormField>
                        </div>

                        <SectionHeader title={t('apartmentPrices.th_monthly')} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label={t('apartmentPrices.th_price')}>
                                <input type="number" name="monthly_price" value={formData.monthly_price} onChange={handleInputChange} className={inputBaseClass} disabled={isViewMode} />
                            </FormField>
                            <FormField label={t('apartmentPrices.th_lowestPrice')}>
                                <input type="number" name="monthly_minimum_price" value={formData.monthly_minimum_price} onChange={handleInputChange} className={inputBaseClass} disabled={isViewMode} />
                            </FormField>
                        </div>

                        <SectionHeader title={t('apartmentPrices.th_peak')} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label={t('apartmentPrices.th_price')}>
                                <input type="number" name="peak_price" value={formData.peak_price} onChange={handleInputChange} className={inputBaseClass} disabled={isViewMode} />
                            </FormField>
                        </div>
                    </form>
                </div>

                <footer className="flex items-center justify-start p-4 border-t dark:border-slate-700 flex-shrink-0 gap-3 sticky bottom-0 bg-white dark:bg-slate-900">
                    {!isViewMode && (
                        <button onClick={handleSaveClick} disabled={isSaving} className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 disabled:bg-blue-400">
                            {isSaving ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <CheckCircleIcon className="w-5 h-5" />
                            )}
                            <span>{isSaving ? t('common.saving') : t('units.saveChanges')}</span>
                        </button>
                    )}
                    <button onClick={onClose} className="bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 font-semibold py-2 px-5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200">
                        {isViewMode ? t('buttons.back') : t('units.cancel')}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ApartmentPriceEditPanel;