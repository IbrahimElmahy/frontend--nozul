import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Guest, GuestStatus, GuestType, IdType } from '../types';
import XMarkIcon from './icons-redesign/XMarkIcon';
import CheckCircleIcon from './icons-redesign/CheckCircleIcon';
import DatePicker from './DatePicker';
import PhoneNumberInput from './PhoneNumberInput';
import SearchableSelect from './SearchableSelect';
import Switch from './Switch';

interface AddGuestPanelProps {
    initialData: Guest | Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>;
    isEditing: boolean;
    isOpen: boolean;
    onClose: () => void;
    onSave: (guest: Guest | Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const SectionHeader: React.FC<{ title: string; }> = ({ title }) => (
    <div className="bg-slate-100 dark:bg-slate-700/50 p-2 my-4 rounded-md flex items-center">
        <div className="w-1 h-4 bg-blue-500 rounded-full mx-2"></div>
        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">{title}</h3>
    </div>
);

const AddGuestPanel: React.FC<AddGuestPanelProps> = ({ initialData, isEditing, isOpen, onClose, onSave }) => {
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
    
    const guestTypeOptions = [
      { value: 'citizen', label: t('guests.guestType_citizen') },
      { value: 'resident', label: t('guests.guestType_resident') },
      { value: 'visitor', label: t('guests.guestType_visitor') },
    ];

    const idTypeOptions = [
      { value: 'national_id', label: t('guests.idType_national_id') },
      { value: 'residence_card', label: t('guests.idType_residence_card') },
      { value: 'passport', label: t('guests.idType_passport') },
    ];
    
    const nationalities = ["السعودية", "مصر", "أفغانستان", "ألبانيا", "الجزائر"];


    return (
        <div
            className={`fixed inset-0 z-50 flex items-start justify-center p-4 transition-opacity duration-300 overflow-y-auto ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-guest-title"
        >
            <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden="true"></div>

            <div className={`relative w-full max-w-screen-2xl my-8 bg-white dark:bg-slate-800 rounded-lg shadow-2xl flex flex-col transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} style={{ maxHeight: '90vh' }}>
                <header className="flex items-center justify-between p-4 border-b dark:border-slate-700 flex-shrink-0 sticky top-0 bg-white dark:bg-slate-800 rounded-t-lg z-10">
                    <h2 id="add-guest-title" className="text-lg font-bold text-slate-800 dark:text-slate-200">{isEditing ? t('guests.editGuestTitle') : t('guests.addGuestTitle')}</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Close panel">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </header>

                <div className="flex-grow p-6 overflow-y-auto">
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8">
                            {/* Column 1 */}
                            <div>
                                <SectionHeader title={t('guests.personalInfo')} />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="sm:col-span-2">
                                        <label htmlFor="name" className={labelBaseClass}>{t('guests.th_name')}</label>
                                        <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} className={inputBaseClass} />
                                    </div>
                                    <div>
                                        <label htmlFor="gender" className={labelBaseClass}>{t('guests.gender')}</label>
                                        <SearchableSelect id="gender" options={[t('guests.male'), t('guests.female')]} value={formData.gender === 'male' ? t('guests.male') : formData.gender === 'female' ? t('guests.female') : ''} onChange={val => setFormData(p => ({...p, gender: val === t('guests.male') ? 'male' : 'female'}))} />
                                    </div>
                                    <div>
                                        <label htmlFor="nationality" className={labelBaseClass}>{t('guests.th_nationality')}</label>
                                        <SearchableSelect id="nationality" options={nationalities} value={formData.nationality} onChange={val => setFormData(p => ({...p, nationality: val}))} />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="dob" className={labelBaseClass}>{t('guests.dob')}</label>
                                        <DatePicker value={formData.dob || ''} onChange={date => setFormData(p => ({...p, dob: date}))} />
                                    </div>
                                </div>

                                <SectionHeader title={t('guests.contactInfo')} />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="mobileNumber" className={labelBaseClass}>{t('guests.th_mobileNumber')}</label>
                                        <PhoneNumberInput value={formData.mobileNumber} onChange={val => setFormData(p => ({...p, mobileNumber: val}))} />
                                    </div>
                                    <div>
                                        <label htmlFor="workNumber" className={labelBaseClass}>{t('guests.workNumber')}</label>
                                        <PhoneNumberInput value={formData.workNumber || ''} onChange={val => setFormData(p => ({...p, workNumber: val}))} />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="email" className={labelBaseClass}>{t('guests.email')}</label>
                                        <input type="email" name="email" id="email" value={formData.email || ''} onChange={handleInputChange} className={inputBaseClass} />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="workLocation" className={labelBaseClass}>{t('guests.workLocation')}</label>
                                        <input type="text" name="workLocation" id="workLocation" value={formData.workLocation || ''} onChange={handleInputChange} className={inputBaseClass} />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Column 2 */}
                            <div>
                                <SectionHeader title={t('guests.addressInfo')} />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="country" className={labelBaseClass}>{t('guests.country')}</label>
                                        <SearchableSelect id="country" options={nationalities} value={formData.country || ''} onChange={val => setFormData(p => ({...p, country: val}))} />
                                    </div>
                                    <div>
                                        <label htmlFor="city" className={labelBaseClass}>{t('guests.city')}</label>
                                        <input type="text" name="city" id="city" value={formData.city || ''} onChange={handleInputChange} className={inputBaseClass} />
                                    </div>
                                    <div>
                                        <label htmlFor="district" className={labelBaseClass}>{t('guests.district')}</label>
                                        <input type="text" name="district" id="district" value={formData.district || ''} onChange={handleInputChange} className={inputBaseClass} />
                                    </div>
                                    <div>
                                        <label htmlFor="postalCode" className={labelBaseClass}>{t('guests.postalCode')}</label>
                                        <input type="text" name="postalCode" id="postalCode" value={formData.postalCode || ''} onChange={handleInputChange} className={inputBaseClass} />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="street" className={labelBaseClass}>{t('guests.street')}</label>
                                        <input type="text" name="street" id="street" value={formData.street || ''} onChange={handleInputChange} className={inputBaseClass} />
                                    </div>
                                </div>

                                <SectionHeader title={t('guests.notes')} />
                                <textarea name="notes" rows={5} placeholder={t('guests.notesPlaceholder')} value={formData.notes || ''} onChange={handleInputChange} className={inputBaseClass}></textarea>
                            </div>

                            {/* Column 3 */}
                            <div>
                                <SectionHeader title={t('guests.guestSystemInfo')} />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="guestType" className={labelBaseClass}>{t('guests.th_guestType')}</label>
                                        <SearchableSelect id="guestType" options={guestTypeOptions.map(o => o.label)} value={guestTypeOptions.find(o => o.value === formData.guestType)?.label || ''} onChange={(label) => { const opt = guestTypeOptions.find(o => o.label === label); if(opt) setFormData(p => ({ ...p, guestType: opt.value as GuestType }))}} />
                                    </div>
                                    <div>
                                        <label htmlFor="idType" className={labelBaseClass}>{t('guests.th_idType')}</label>
                                        <SearchableSelect id="idType" options={idTypeOptions.map(o => o.label)} value={idTypeOptions.find(o => o.value === formData.idType)?.label || ''} onChange={(label) => { const opt = idTypeOptions.find(o => o.label === label); if(opt) setFormData(p => ({ ...p, idType: opt.value as IdType }))}} />
                                    </div>
                                    <div>
                                        <label htmlFor="idNumber" className={labelBaseClass}>{t('guests.th_idNumber')}</label>
                                        <input type="text" name="idNumber" id="idNumber" value={formData.idNumber} onChange={handleInputChange} className={inputBaseClass} />
                                    </div>
                                    <div>
                                        <label htmlFor="serialNumber" className={labelBaseClass}>{t('guests.serialNumber')}</label>
                                        <input type="text" name="serialNumber" id="serialNumber" value={formData.serialNumber || ''} onChange={handleInputChange} className={inputBaseClass} />
                                    </div>
                                    <div>
                                        <label htmlFor="issueDate" className={labelBaseClass}>{t('guests.th_issueDate')}</label>
                                        <DatePicker value={formData.issueDate || ''} onChange={date => setFormData(p => ({...p, issueDate: date}))} />
                                    </div>
                                    <div>
                                        <label htmlFor="issueLocation" className={labelBaseClass}>{t('guests.issueLocation')}</label>
                                        <input type="text" name="issueLocation" id="issueLocation" value={formData.issueLocation || ''} onChange={handleInputChange} className={inputBaseClass} />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="expiryDate" className={labelBaseClass}>{t('guests.th_expiryDate')}</label>
                                        <DatePicker value={formData.expiryDate || ''} onChange={date => setFormData(p => ({...p, expiryDate: date}))} />
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg sm:col-span-2">
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">{t('guests.th_status')}</span>
                                        <Switch id="status" checked={formData.status === 'active'} onChange={(c) => setFormData(p=> ({...p, status: c ? 'active' : 'inactive'}))} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <footer className="flex items-center justify-start p-4 border-t dark:border-slate-700 flex-shrink-0 gap-3 sticky bottom-0 bg-white dark:bg-slate-800 rounded-b-lg">
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

export default AddGuestPanel;