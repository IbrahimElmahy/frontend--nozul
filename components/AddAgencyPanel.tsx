import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { BookingAgency, AgencyStatus, AgencyType, AgencyIdType } from '../types';
import XMarkIcon from './icons-redesign/XMarkIcon';
import CheckCircleIcon from './icons-redesign/CheckCircleIcon';
import DatePicker from './DatePicker';
import PhoneNumberInput from './PhoneNumberInput';
import SearchableSelect from './SearchableSelect';
import Switch from './Switch';

interface AddAgencyPanelProps {
    initialData: BookingAgency | Omit<BookingAgency, 'id' | 'createdAt' | 'updatedAt'>;
    isEditing: boolean;
    isOpen: boolean;
    onClose: () => void;
    onSave: (agency: BookingAgency | Omit<BookingAgency, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const AddAgencyPanel: React.FC<AddAgencyPanelProps> = ({ initialData, isEditing, isOpen, onClose, onSave }) => {
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

    const handleSaveClick = () => {
        onSave(formData);
    };

    const inputBaseClass = `w-full px-3 py-2 bg-white dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-slate-200 text-sm`;
    const labelBaseClass = `block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1`;
    
    const agencyTypeOptions = [
      { value: 'company', label: t('agencies.agencyType_company') },
      { value: 'individual', label: t('agencies.agencyType_individual') },
    ];

    const idTypeOptions = [
      { value: 'tax_id', label: t('agencies.idType_tax_id') },
      { value: 'unified_establishment_number', label: t('agencies.idType_unified_establishment_number') },
      { value: 'other', label: t('agencies.idType_other') },
    ];
    
    const countries = ["السعودية", "مصر", "أفغانستان", "ألبانيا", "الجزائر"];


    return (
        <div
            className={`fixed inset-0 z-50 flex items-start justify-end transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            role="dialog" aria-modal="true" aria-labelledby="add-agency-title"
        >
            <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden="true"></div>
            <div className={`relative h-full bg-white dark:bg-slate-800 shadow-2xl flex flex-col w-full max-w-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <header className="flex items-center justify-between p-4 border-b dark:border-slate-700 flex-shrink-0 sticky top-0 bg-white dark:bg-slate-800 z-10">
                    <h2 id="add-agency-title" className="text-lg font-bold text-slate-800 dark:text-slate-200">{isEditing ? t('agencies.editAgencyTitle') : t('agencies.addAgencyTitle')}</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Close panel">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </header>

                <div className="flex-grow p-6 overflow-y-auto">
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                        <div>
                            <label htmlFor="name" className={labelBaseClass}>{t('agencies.th_name')}</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} className={inputBaseClass} />
                        </div>
                         <div>
                            <label htmlFor="mobileNumber" className={labelBaseClass}>{t('agencies.th_mobileNumber')}</label>
                            <PhoneNumberInput value={formData.mobileNumber} onChange={val => setFormData(p => ({...p, mobileNumber: val}))} />
                        </div>
                         <div>
                            <label htmlFor="country" className={labelBaseClass}>{t('agencies.th_country')}</label>
                            <SearchableSelect id="country" options={countries} value={formData.country} onChange={val => setFormData(p => ({...p, country: val}))} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="agencyType" className={labelBaseClass}>{t('agencies.th_agencyType')}</label>
                                <SearchableSelect id="agencyType" options={agencyTypeOptions.map(o => o.label)} value={agencyTypeOptions.find(o => o.value === formData.agencyType)?.label || ''} onChange={(label) => { const opt = agencyTypeOptions.find(o => o.label === label); if(opt) setFormData(p => ({ ...p, agencyType: opt.value as AgencyType }))}} />
                            </div>
                             <div>
                                <label htmlFor="idType" className={labelBaseClass}>{t('agencies.th_idType')}</label>
                                <SearchableSelect id="idType" options={idTypeOptions.map(o => o.label)} value={idTypeOptions.find(o => o.value === formData.idType)?.label || ''} onChange={(label) => { const opt = idTypeOptions.find(o => o.label === label); if(opt) setFormData(p => ({ ...p, idType: opt.value as AgencyIdType }))}} />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="idNumber" className={labelBaseClass}>{t('agencies.th_idNumber')}</label>
                            <input type="text" name="idNumber" id="idNumber" value={formData.idNumber} onChange={handleInputChange} className={inputBaseClass} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="issueDate" className={labelBaseClass}>{t('agencies.th_issueDate')}</label>
                                <DatePicker value={formData.issueDate || ''} onChange={date => setFormData(p => ({...p, issueDate: date}))} />
                            </div>
                            <div>
                                <label htmlFor="expiryDate" className={labelBaseClass}>{t('agencies.th_expiryDate')}</label>
                                <DatePicker value={formData.expiryDate || ''} onChange={date => setFormData(p => ({...p, expiryDate: date}))} />
                            </div>
                        </div>
                         <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{t('agencies.th_status')}</span>
                            <Switch id="status" checked={formData.status === 'active'} onChange={(c) => setFormData(p=> ({...p, status: c ? 'active' : 'inactive'}))} />
                        </div>
                    </form>
                </div>

                <footer className="flex items-center justify-start p-4 border-t dark:border-slate-700 flex-shrink-0 gap-3 sticky bottom-0 bg-white dark:bg-slate-800">
                    <button onClick={handleSaveClick} className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
                        <CheckCircleIcon className="w-5 h-5" />
                        <span>{t('units.saveChanges')}</span>
                    </button>
                     <button onClick={onClose} className="bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 font-semibold py-2 px-5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200">
                        {t('units.cancel')}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default AddAgencyPanel;
