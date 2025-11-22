
import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Tax } from '../types';
import XMarkIcon from './icons-redesign/XMarkIcon';
import CheckCircleIcon from './icons-redesign/CheckCircleIcon';
import DatePicker from './DatePicker';
import SearchableSelect from './SearchableSelect';
import Switch from './Switch';
import { apiClient } from '../apiClient';

interface AddTaxPanelProps {
    initialData: Omit<Tax, 'id' | 'createdAt' | 'updatedAt'>;
    isEditing: boolean;
    isOpen: boolean;
    onClose: () => void;
    onSave: (taxData: any) => void;
}

const AddTaxPanel: React.FC<AddTaxPanelProps> = ({ initialData, isEditing, isOpen, onClose, onSave }) => {
    const { t, language } = useContext(LanguageContext);
    const [formData, setFormData] = useState(initialData);
    
    const [taxNames, setTaxNames] = useState<[string, string][]>([]);
    const [appliesToOptions, setAppliesToOptions] = useState<[string, string][]>([]);
    const [taxTypes, setTaxTypes] = useState<[string, string][]>([]);

    useEffect(() => {
        if (isOpen) {
            setFormData(JSON.parse(JSON.stringify(initialData)));
            fetchOptions();
        }
    }, [isOpen, initialData]);

    const fetchOptions = async () => {
        try {
            const [names, applies, types] = await Promise.all([
                apiClient<[string, string][]>('/ar/tax/api/taxes/names/'),
                apiClient<[string, string][]>('/ar/tax/api/taxes/applies/'),
                apiClient<[string, string][]>('/ar/tax/api/taxes/types/')
            ]);
            setTaxNames(names);
            setAppliesToOptions(applies);
            setTaxTypes(types);
        } catch (error) {
            console.error("Failed to fetch tax options", error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };
    
    const handleDateChange = (name: 'start_date' | 'end_date', date: string) => {
        // Keep the time part if it exists
        const timePart = formData[name]?.split(' ')[1] || '00:00:00';
        setFormData(prev => ({ ...prev, [name]: `${date} ${timePart}` }));
    };

    const handleSaveClick = async () => {
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('tax_value', formData.tax_value.toString());
            data.append('tax_type', formData.tax_type);
            data.append('applies_to', formData.applies_to);
            data.append('start_date', formData.start_date);
            data.append('end_date', formData.end_date);
            
            if (formData.is_added_to_price) data.append('is_added_to_price', 'on');
            if (formData.is_vat_included) data.append('is_vat_included', 'on');
            
            let endpoint = '/ar/tax/api/taxes/';
            let method: 'POST' | 'PUT' = 'POST';

            if (isEditing && (initialData as any).id) {
                endpoint += `${(initialData as any).id}/`;
                method = 'PUT';
            }

            await apiClient(endpoint, { method, body: data });
            onSave(null); // Signal success to parent
        } catch (error) {
            alert(`Error saving tax: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const inputBaseClass = `w-full px-3 py-2 bg-white dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-slate-200 text-sm`;
    const labelBaseClass = `block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1`;
    
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
                            <SearchableSelect 
                                id="name" 
                                options={taxNames.map(n => n[1])} 
                                value={taxNames.find(n => n[0] === formData.name)?.[1] || formData.name} 
                                onChange={label => {
                                    const found = taxNames.find(n => n[1] === label);
                                    if (found) setFormData(p => ({...p, name: found[0]}));
                                }} 
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="tax_value" className={labelBaseClass}>{t('taxes.th_tax')}</label>
                                <input type="number" name="tax_value" id="tax_value" value={formData.tax_value} onChange={handleNumberChange} className={inputBaseClass} />
                            </div>
                            <div>
                                <label htmlFor="tax_type" className={labelBaseClass}>Type</label>
                                <SearchableSelect 
                                    id="tax_type" 
                                    options={taxTypes.map(t => t[1])} 
                                    value={taxTypes.find(t => t[0] === formData.tax_type)?.[1] || formData.tax_type} 
                                    onChange={label => {
                                        const found = taxTypes.find(t => t[1] === label);
                                        if(found) setFormData(p => ({...p, tax_type: found[0]}));
                                    }} 
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="applies_to" className={labelBaseClass}>{t('taxes.th_applyTo')}</label>
                            <SearchableSelect 
                                id="applies_to" 
                                options={appliesToOptions.map(a => a[1])} 
                                value={appliesToOptions.find(a => a[0] === formData.applies_to)?.[1] || formData.applies_to} 
                                onChange={label => {
                                    const found = appliesToOptions.find(a => a[1] === label);
                                    if(found) setFormData(p => ({...p, applies_to: found[0]}));
                                }} 
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelBaseClass}>{t('taxes.th_startDate')}</label>
                                <DatePicker value={formData.start_date.split(' ')[0]} onChange={date => handleDateChange('start_date', date)} />
                            </div>
                            <div>
                                <label className={labelBaseClass}>{t('taxes.th_endDate')}</label>
                                <DatePicker value={formData.end_date.split(' ')[0]} onChange={date => handleDateChange('end_date', date)} />
                            </div>
                        </div>
                         <div className="space-y-3 pt-4">
                             <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"><label htmlFor="is_added_to_price" className="text-sm font-medium">{t('taxes.th_addedToFees')}</label><Switch id="is_added_to_price" checked={formData.is_added_to_price} onChange={c => setFormData(p => ({...p, is_added_to_price: c}))} /></div>
                             <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"><label htmlFor="is_vat_included" className="text-sm font-medium">{t('taxes.th_subjectToVat')}</label><Switch id="is_vat_included" checked={formData.is_vat_included} onChange={c => setFormData(p => ({...p, is_vat_included: c}))} /></div>
                             <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"><label htmlFor="is_active" className="text-sm font-medium">{t('taxes.th_status')}</label><Switch id="is_active" checked={formData.is_active} onChange={c => setFormData(p => ({...p, is_active: c}))} /></div>
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
