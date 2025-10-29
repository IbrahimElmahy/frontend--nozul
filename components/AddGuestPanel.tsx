import React, { useState, useEffect, useContext, useMemo } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Guest, GuestTypeAPI, IdTypeAPI, CountryAPI } from '../types';
import XMarkIcon from './icons-redesign/XMarkIcon';
import CheckCircleIcon from './icons-redesign/CheckCircleIcon';
import DatePicker from './DatePicker';
import PhoneNumberInput from './PhoneNumberInput';
import SearchableSelect from './SearchableSelect';
import Switch from './Switch';

interface AddGuestPanelProps {
    initialData: Guest | null;
    isEditing: boolean;
    isOpen: boolean;
    onClose: () => void;
    onSave: (formData: FormData) => void;
    guestTypes: GuestTypeAPI[];
    idTypes: IdTypeAPI[];
    countries: CountryAPI;
}

const SectionHeader: React.FC<{ title: string; }> = ({ title }) => (
    <div className="bg-slate-100 dark:bg-slate-700/50 p-2 my-4 rounded-md flex items-center">
        <div className="w-1 h-4 bg-blue-500 rounded-full mx-2"></div>
        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">{title}</h3>
    </div>
);

const AddGuestPanel: React.FC<AddGuestPanelProps> = ({ initialData, isEditing, isOpen, onClose, onSave, guestTypes, idTypes, countries }) => {
    const { t, language } = useContext(LanguageContext);
    const [formData, setFormData] = useState<Record<string, any>>({});
    
    // Derived states for dropdowns
    const countryOptions = useMemo(() => Object.entries(countries).map(([code, name]) => ({ value: code, label: name })), [countries]);
    const guestTypeOptions = useMemo(() => guestTypes.map(gt => ({ value: gt.id, label: language === 'ar' ? gt.name_ar : gt.name_en })), [guestTypes, language]);

    const availableIdTypes = useMemo(() => {
        if (!formData.guest_type || !guestTypes.length || !idTypes.length) {
            return [];
        }
        const selectedGuestType = guestTypes.find(gt => gt.id === formData.guest_type);
        if (!selectedGuestType) {
            return [];
        }
        return idTypes
            .filter(it => selectedGuestType.ids.includes(it.id))
            .map(it => ({ value: it.id, label: language === 'ar' ? it.name_ar : it.name_en }));
    }, [formData.guest_type, guestTypes, idTypes, language]);

    useEffect(() => {
        if (isOpen) {
            if (isEditing && initialData) {
                // Find the UUID for guest_type and ids based on the display name
                const guestTypeObj = guestTypes.find(gt => gt.name === initialData.guest_type);
                const idTypeObj = idTypes.find(it => it.name === initialData.ids);
                
                setFormData({
                    ...initialData,
                    guest_type: guestTypeObj?.id || '',
                    ids: idTypeObj?.id || '',
                });
            } else {
                // Defaults for new guest
                setFormData({
                    name: '',
                    gender: 'male',
                    country: 'SA',
                    phone_number: '',
                    email: '',
                    city: '',
                    guest_type: guestTypes[0]?.id || '',
                    id_number: '',
                    ids: '',
                });
            }
        }
    }, [isOpen, initialData, isEditing, guestTypes, idTypes]);
    
    // Effect to reset id type if it becomes invalid after guest type changes
    useEffect(() => {
        if (isOpen && !availableIdTypes.some(it => it.value === formData.ids)) {
             setFormData(prev => ({...prev, ids: ''}));
        }
    }, [availableIdTypes, formData.ids, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({...prev, [name]: value}));
    }

    const handleSaveClick = () => {
        const dataToSave = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null && formData[key] !== undefined) {
                 // The API expects certain fields that aren't in this simplified form.
                // Add them with empty values to satisfy PUT requirements.
                const apiValue = formData[key];
                dataToSave.append(key, apiValue);
            }
        });
        
        // Ensure all required fields for PUT are present, even if empty
        if (isEditing) {
           ['work_number', 'work_place', 'note', 'postal_code', 'street', 'neighborhood'].forEach(key => {
               if (!dataToSave.has(key)) {
                   dataToSave.append(key, '');
               }
           });
        }
        onSave(dataToSave);
    };

    const inputBaseClass = `w-full px-3 py-2 bg-white dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-slate-200 text-sm`;
    const labelBaseClass = `block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1`;
    
    return (
        <div className={`fixed inset-0 z-50 flex items-start justify-end transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden="true"></div>
            <div className={`relative h-full bg-slate-50 dark:bg-slate-800 shadow-2xl flex flex-col w-full max-w-2xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <header className="flex items-center justify-between p-4 border-b dark:border-slate-700 flex-shrink-0 sticky top-0 bg-white dark:bg-slate-900 z-10">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">{isEditing ? t('guests.editGuestTitle') : t('guests.addGuestTitle')}</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Close"><XMarkIcon className="w-6 h-6" /></button>
                </header>

                <div className="flex-grow p-6 overflow-y-auto">
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                        <SectionHeader title={t('guests.personalInfo')} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <label htmlFor="name" className={labelBaseClass}>{t('guests.th_name')}</label>
                                <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleInputChange} className={inputBaseClass} />
                            </div>
                            <div>
                                <label className={labelBaseClass}>{t('guests.gender')}</label>
                                <SearchableSelect id="gender" options={[{ value: 'male', label: t('guests.male') }, { value: 'female', label: t('guests.female') }].map(o => o.label)} value={formData.gender === 'male' ? t('guests.male') : t('guests.female')} onChange={val => handleSelectChange('gender', val === t('guests.male') ? 'male' : 'female')} />
                            </div>
                        </div>

                        <SectionHeader title={t('guests.contactInfo')} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelBaseClass}>{t('guests.th_mobileNumber')}</label>
                                <PhoneNumberInput value={formData.phone_number || ''} onChange={val => handleSelectChange('phone_number', val)} />
                            </div>
                             <div>
                                <label className={labelBaseClass}>{t('guests.country')}</label>
                                <SearchableSelect id="country" options={countryOptions.map(o => o.label)} value={countryOptions.find(c => c.value === formData.country)?.label || ''} onChange={val => { const opt = countryOptions.find(c => c.label === val); if(opt) handleSelectChange('country', opt.value)}} />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="email" className={labelBaseClass}>{t('guests.email')} ({t('settings.light')})</label>
                                <input type="email" name="email" id="email" value={formData.email || ''} onChange={handleInputChange} className={inputBaseClass} />
                            </div>
                             <div>
                                <label htmlFor="city" className={labelBaseClass}>{t('guests.city')} ({t('settings.light')})</label>
                                <input type="text" name="city" id="city" value={formData.city || ''} onChange={handleInputChange} className={inputBaseClass} />
                            </div>
                        </div>
                        
                        <SectionHeader title={t('guests.idInfo')} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelBaseClass}>{t('guests.th_guestType')}</label>
                                <SearchableSelect id="guest_type" options={guestTypeOptions.map(o => o.label)} value={guestTypeOptions.find(gt => gt.value === formData.guest_type)?.label || ''} onChange={val => { const opt = guestTypeOptions.find(gt => gt.label === val); if (opt) handleSelectChange('guest_type', opt.value); }} />
                            </div>
                            <div>
                                <label className={labelBaseClass}>{t('guests.th_idType')}</label>
                                <SearchableSelect id="ids" options={availableIdTypes.map(o => o.label)} value={availableIdTypes.find(it => it.value === formData.ids)?.label || ''} onChange={val => { const opt = availableIdTypes.find(it => it.label === val); if (opt) handleSelectChange('ids', opt.value); }} />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="id_number" className={labelBaseClass}>{t('guests.th_idNumber')}</label>
                                <input type="text" name="id_number" id="id_number" value={formData.id_number || ''} onChange={handleInputChange} className={inputBaseClass} />
                            </div>
                        </div>

                    </form>
                </div>

                <footer className="flex items-center justify-start p-4 border-t dark:border-slate-700 flex-shrink-0 gap-3 sticky bottom-0 bg-white dark:bg-slate-900">
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

export default AddGuestPanel;