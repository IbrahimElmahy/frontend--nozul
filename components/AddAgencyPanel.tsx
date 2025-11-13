import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { BookingAgency, AgencyStatus, AgencyType, AgencyIdType, CountryAPI, GuestTypeAPI, IdTypeAPI } from '../types';
import XMarkIcon from './icons-redesign/XMarkIcon';
import CheckCircleIcon from './icons-redesign/CheckCircleIcon';
import DatePicker from './DatePicker';
import PhoneNumberInput from './PhoneNumberInput';
import SearchableSelect from './SearchableSelect';
import Switch from './Switch';
import { apiClient } from '../apiClient';

interface AddAgencyPanelProps {
    initialData: Omit<BookingAgency, 'id' | 'createdAt' | 'updatedAt'>;
    isEditing: boolean;
    isOpen: boolean;
    onClose: () => void;
    onSave: (agency: Omit<BookingAgency, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const AddAgencyPanel: React.FC<AddAgencyPanelProps> = ({ initialData, isEditing, isOpen, onClose, onSave }) => {
    const { t, language } = useContext(LanguageContext);
    const [formData, setFormData] = useState(initialData);

    const [countries, setCountries] = useState<CountryAPI>({});
    const [agentTypes, setAgentTypes] = useState<GuestTypeAPI[]>([]);
    const [idTypes, setIdTypes] = useState<IdTypeAPI[]>([]);
    const [discountTypes, setDiscountTypes] = useState<[string, string][]>([]);
    
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [countriesRes, agentTypesRes, discountTypesRes] = await Promise.all([
                    apiClient<CountryAPI>('/ar/country/api/countries/'),
                    apiClient<{ data: GuestTypeAPI[] }>('/ar/guest/api/guests-types/?category=agent'),
                    apiClient<[string, string][]>('/ar/discount/api/discount-types/')
                ]);
                setCountries(countriesRes);
                setAgentTypes(agentTypesRes.data);
                setDiscountTypes(discountTypesRes);
            } catch (error) {
                console.error("Failed to fetch agency options", error);
            }
        };

        if (isOpen) {
            fetchOptions();
            setFormData(JSON.parse(JSON.stringify(initialData)));
        }
    }, [isOpen, initialData]);

    useEffect(() => {
        const fetchIdTypes = async () => {
            if (formData.agencyType) {
                const selectedAgentType = agentTypes.find(at => at.id === formData.agencyType);
                if (selectedAgentType) {
                    try {
                        const idTypesRes = await apiClient<{ data: IdTypeAPI[] }>(`/ar/guest/api/ids/?guests_types=${selectedAgentType.id}`);
                        setIdTypes(idTypesRes.data);
                        // Reset idType if it's not valid for the new agencyType
                        if (!idTypesRes.data.some(it => it.id === formData.idType)) {
                            setFormData(p => ({ ...p, idType: '' }));
                        }
                    } catch (error) {
                        console.error("Failed to fetch ID types", error);
                    }
                }
            } else {
                setIdTypes([]);
            }
        };
        fetchIdTypes();
    }, [formData.agencyType, agentTypes]);


    const handleSaveClick = () => {
        // Here we'd convert back to API format, but since we are just updating state, we pass it as is.
        // In a real scenario, this would create FormData and map fields.
        onSave(formData);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const inputBaseClass = `w-full px-3 py-2 bg-white dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-slate-200 text-sm`;
    const labelBaseClass = `block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1`;
    
    const countryOptions = Object.entries(countries).map(([code, name]) => ({ value: code, label: name }));
    const agentTypeOptions = agentTypes.map(at => ({ value: at.id, label: language === 'ar' ? at.name_ar : at.name_en }));
    const idTypeOptions = idTypes.map(it => ({ value: it.id, label: language === 'ar' ? it.name_ar : it.name_en }));

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
                            <SearchableSelect id="country" options={countryOptions.map(o => o.label)} value={countryOptions.find(o => o.value === formData.country)?.label || ''} onChange={label => { const opt = countryOptions.find(o => o.label === label); if (opt) setFormData(p => ({...p, country: opt.value}))}} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="agencyType" className={labelBaseClass}>{t('agencies.th_agencyType')}</label>
                                <SearchableSelect id="agencyType" options={agentTypeOptions.map(o => o.label)} value={agentTypeOptions.find(o => o.value === formData.agencyType)?.label || ''} onChange={(label) => { const opt = agentTypeOptions.find(o => o.label === label); if(opt) setFormData(p => ({ ...p, agencyType: opt.value }))}} />
                            </div>
                             <div>
                                <label htmlFor="idType" className={labelBaseClass}>{t('agencies.th_idType')}</label>
                                <SearchableSelect id="idType" options={idTypeOptions.map(o => o.label)} value={idTypeOptions.find(o => o.value === formData.idType)?.label || ''} onChange={(label) => { const opt = idTypeOptions.find(o => o.label === label); if(opt) setFormData(p => ({ ...p, idType: opt.value }))}} />
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