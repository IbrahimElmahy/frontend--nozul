import React, { useState, useEffect, useContext, useMemo } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Guest, GuestTypeAPI, IdTypeAPI, CountryAPI } from '../types';
import XMarkIcon from './icons-redesign/XMarkIcon';
import CheckCircleIcon from './icons-redesign/CheckCircleIcon';
import DatePicker from './DatePicker';
import PhoneNumberInput from './PhoneNumberInput';
import SearchableSelect from './SearchableSelect';

interface AddGuestPanelProps {
    initialData: Guest | null;
    isEditing: boolean;
    isOpen: boolean;
    onClose: () => void;
    onSave: (formData: FormData) => void;
    guestTypes: GuestTypeAPI[];
    idTypes: IdTypeAPI[];
    countries: CountryAPI;
    validationErrors?: Record<string, string | string[]>;
    zIndexClass?: string;
}

const SectionHeader: React.FC<{ title: string; icon?: any }> = ({ title, icon }) => (
    <div className="bg-slate-100 dark:bg-slate-700/50 p-2 my-2 rounded-md flex items-center justify-between">
        <div className="flex items-center">
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 mx-2">{title}</span>
        </div>
        {icon && <span className="text-slate-400">{icon}</span>}
    </div>
);

const AddGuestPanel: React.FC<AddGuestPanelProps> = ({ initialData, isEditing, isOpen, onClose, onSave, guestTypes, idTypes, countries, validationErrors = {}, zIndexClass = "z-50" }) => {
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
                const guestTypeObj = guestTypes.find(gt => gt.name === initialData.guest_type);
                const idTypeObj = idTypes.find(it => it.name === initialData.ids);

                // Map initialData fields to formData state
                setFormData({
                    ...initialData,
                    guest_type: guestTypeObj?.id || '',
                    ids: idTypeObj?.id || '',
                    country: initialData.country || 'SA', // Nationality
                    address_country: initialData.address_country || 'SA', // Address Country
                });
            } else {
                setFormData({
                    name: '',
                    gender: 'male',
                    birthdate: null,
                    phone_number: '',
                    email: '',

                    work_number: '',
                    work_place: '',

                    // Address Section
                    country: 'SA', // Use 'country' for Nationality as per API "Key Fields".
                    address_country: 'SA', // Use 'address_country' for Address section
                    city: '',
                    neighborhood: '',
                    street: '',
                    postal_code: '',

                    // System Info
                    guest_type: guestTypes[0]?.id || '',
                    ids: '',
                    id_number: '',
                    id_serial: '', // Renamed from serial_number
                    id_copy_number: '',

                    expiry_date: null,
                    issue_date: null,
                    issue_place: '', // Renamed from issue_location

                    note: '',
                });
            }
        }
    }, [isOpen, initialData, isEditing, guestTypes, idTypes]);

    useEffect(() => {
        // Auto-select first available ID type if current selection is invalid or empty
        if (isOpen && availableIdTypes.length > 0) {
            if (!formData.ids || !availableIdTypes.some(it => it.value === formData.ids)) {
                setFormData(prev => ({ ...prev, ids: availableIdTypes[0].value }));
            }
        } else if (isOpen && availableIdTypes.length === 0) {
            setFormData(prev => ({ ...prev, ids: '' }));
        }
    }, [availableIdTypes, formData.ids, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const [localValidationErrors, setLocalValidationErrors] = useState<Record<string, string>>({});

    const validatePhoneNumber = (phone: string) => {
        if (!phone) return false;

        // Remove spaces and dashes for validation
        const cleanPhone = phone.replace(/[\s-]/g, '');

        if (cleanPhone.startsWith('+966')) { // Saudi Arabia
            // +966 5x xxx xxxx (12 digits total)
            return /^\+9665\d{8}$/.test(cleanPhone);
        }
        if (cleanPhone.startsWith('+20')) { // Egypt
            // +20 1x xxxxxxx (total 12 digits: +20 + 10 digits)
            return /^\+201\d{9}$/.test(cleanPhone);
        }
        if (cleanPhone.startsWith('+971')) { // UAE
            // +971 5x xxx xxxx
            return /^\+9715\d{8}$/.test(cleanPhone);
        }
        if (cleanPhone.startsWith('+965')) { // Kuwait
            // +965 xxxx xxxx (8 digits local) -> +965 + 8 = 12
            return /^\+965\d{8}$/.test(cleanPhone);
        }

        // Generic validation for other countries: Min 8, Max 15 digits
        return /^\+\d{8,15}$/.test(cleanPhone);
    };

    const handleSaveClick = () => {
        const errors: Record<string, string> = {};
        const requiredMsg = t('units.requiredField') || 'This field is required';
        const invalidPhoneMsg = t('units.invalidPhone') || 'Invalid phone number format';

        if (!formData.name) errors.name = requiredMsg;

        if (!formData.phone_number) {
            errors.phone_number = requiredMsg;
        } else if (!validatePhoneNumber(formData.phone_number)) {
            errors.phone_number = invalidPhoneMsg;
        }

        if (formData.work_number && !validatePhoneNumber(formData.work_number)) {
            errors.work_number = invalidPhoneMsg;
        }

        if (!formData.id_number) errors.id_number = requiredMsg;
        if (!formData.guest_type) errors.guest_type = requiredMsg;
        if (!formData.ids) errors.ids = requiredMsg;

        setLocalValidationErrors(errors);

        if (Object.keys(errors).length > 0) {
            return;
        }

        const dataToSave = new FormData();

        // ---------------------------------------------------------
        // API Payload Construction
        // Based on API Doc: https://www.osusideas.online/ar/guest/api/guests/
        // ---------------------------------------------------------

        // 1. Fixed Category
        dataToSave.append('category', 'customer');

        // 2. Dynamic Fields
        Object.keys(formData).forEach(key => {
            const val = formData[key];

            // Skip empty optional fields to prevent backend parsing errors
            // 'birthdate', 'expiry_date', 'issue_date': Date fields cannot be empty string
            // 'id_serial': Integer field cannot be empty string
            if (['birthdate', 'expiry_date', 'issue_date', 'id_serial'].includes(key) && val === '') {
                return;
            }

            if (val !== null && val !== undefined) {
                dataToSave.append(key, String(val));
            }
        });

        // 3. Explicitly Required Fields (Calculated/Mapped)

        // 'nationality': Required by backend alias for 'country'
        if (formData.country) {
            dataToSave.append('nationality', formData.country);
        }

        if (isEditing) {
            ['work_number', 'work_place', 'note', 'postal_code', 'street', 'neighborhood', 'id_serial'].forEach(key => {
                // Ensure optional fields are reset if cleared (but handle integer/date constraints above)
                if (!dataToSave.has(key)) {
                    // For text fields, empty string is fine. For others, let backend handle null via omission or explicit null if needed.
                    // But FormData implies strings. We skip id_serial if empty above.
                    // If we are editing and want to clear it? To clear an integer field via FormData is tricky if it doesn't accept null.
                    // Usually omitting it might keep old value? 
                    // For now, let's treat text fields safely.
                    if (!['id_serial'].includes(key)) {
                        dataToSave.append(key, '');
                    }
                }
            });
        }
        onSave(dataToSave);
    };

    const getFieldError = (fieldName: string) => {
        const error = validationErrors[fieldName] || localValidationErrors[fieldName];
        if (!error) return null;
        return Array.isArray(error) ? error.join(', ') : error;
    };

    const getInputClass = (fieldName: string) => {
        const base = `w-full px-3 py-2 bg-white dark:bg-slate-700/50 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-slate-200 text-sm`;
        return (validationErrors[fieldName] || localValidationErrors[fieldName])
            ? `${base} border-red-500`
            : `${base} border-gray-300 dark:border-slate-600`;
    };

    const labelBaseClass = `block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1`;
    const errorTextClass = `text-xs text-red-500 mt-1 block`;
    const inputBaseClass = `w-full px-3 py-2 bg-white dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-slate-200 text-sm`;

    const PersonalInfoIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
    );

    const ContactInfoIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
        </svg>
    );

    const AddressInfoIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
    );

    const GuestSystemIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
        </svg>
    );


    return (
        <div className={`fixed inset-0 ${zIndexClass} flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true"></div>
            <div className={`relative bg-slate-50 dark:bg-slate-800 shadow-2xl rounded-xl flex flex-col w-[95%] max-w-[90rem] transform transition-all duration-300 max-h-[calc(100vh-2rem)] ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <header className="flex items-center justify-between p-4 border-b dark:border-white/10 flex-shrink-0 bg-white dark:bg-slate-900 z-10 rounded-t-xl">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">{isEditing ? t('guests.editGuestTitle') : t('guests.addGuestTitle')}</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Close"><XMarkIcon className="w-6 h-6" /></button>
                </header>

                <div className="flex-grow p-6 overflow-y-auto">
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">

                        <SectionHeader title={t('guests.personalInfo')} icon={<PersonalInfoIcon />} />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label htmlFor="name" className={labelBaseClass}>{t('guests.th_name')}</label>
                                <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleInputChange} className={getInputClass('name')} />
                                {getFieldError('name') && <span className={errorTextClass}>{getFieldError('name')}</span>}
                            </div>
                            <div>
                                <label className={labelBaseClass}>{t('guests.th_nationality')}</label>
                                <div className={(validationErrors['country'] || localValidationErrors['country']) ? "border border-red-500 rounded-md" : ""}>
                                    <SearchableSelect id="country" options={countryOptions.map(o => o.label)} value={countryOptions.find(c => c.value === formData.country)?.label || ''} onChange={val => { const opt = countryOptions.find(c => c.label === val); if (opt) handleSelectChange('country', opt.value) }} />
                                </div>
                                {getFieldError('country') && <span className={errorTextClass}>{getFieldError('country')}</span>}
                            </div>
                            <div>
                                <label htmlFor="gender" className={labelBaseClass}>{t('guests.gender')}</label>
                                <div className={(validationErrors['gender'] || localValidationErrors['gender']) ? "border border-red-500 rounded-md" : ""}>
                                    <SearchableSelect id="gender" options={[{ value: 'male', label: t('guests.male') }, { value: 'female', label: t('guests.female') }].map(o => o.label)} value={formData.gender === 'male' ? t('guests.male') : t('guests.female')} onChange={val => handleSelectChange('gender', val === t('guests.male') ? 'male' : 'female')} />
                                </div>
                                {getFieldError('gender') && <span className={errorTextClass}>{getFieldError('gender')}</span>}
                            </div>
                            <div>
                                <div className={(validationErrors['birthdate'] || localValidationErrors['birthdate']) ? "border border-red-500 rounded-md" : ""}>
                                    <DatePicker
                                        label={t('guests.dob')}
                                        selectedDate={formData.birthdate ? new Date(formData.birthdate) : null}
                                        onChange={(dateString) => setFormData(prev => ({ ...prev, birthdate: dateString }))}
                                    />
                                </div>
                                {getFieldError('birthdate') && <span className={errorTextClass}>{getFieldError('birthdate')}</span>}
                            </div>
                        </div>

                        <SectionHeader title={t('guests.contactInfo')} icon={<ContactInfoIcon />} />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className={labelBaseClass}>{t('guests.th_mobileNumber')}</label>
                                <div className={(validationErrors['phone_number'] || localValidationErrors['phone_number']) ? "border border-red-500 rounded-md" : ""}>
                                    <PhoneNumberInput value={formData.phone_number || ''} onChange={val => handleSelectChange('phone_number', val)} />
                                </div>
                                {getFieldError('phone_number') && <span className={errorTextClass}>{getFieldError('phone_number')}</span>}
                            </div>
                            <div>
                                <label htmlFor="email" className={labelBaseClass}>{t('guests.email')}</label>
                                <input type="email" name="email" id="email" value={formData.email || ''} onChange={handleInputChange} className={getInputClass('email')} />
                                {getFieldError('email') && <span className={errorTextClass}>{getFieldError('email')}</span>}
                            </div>
                            <div>
                                <label htmlFor="work_number" className={labelBaseClass}>{t('guests.workNumber')}</label>
                                <div className={(validationErrors['work_number'] || localValidationErrors['work_number']) ? "border border-red-500 rounded-md" : ""}>
                                    <PhoneNumberInput value={formData.work_number || ''} onChange={val => handleSelectChange('work_number', val)} />
                                </div>
                                {getFieldError('work_number') && <span className={errorTextClass}>{getFieldError('work_number')}</span>}
                            </div>
                            <div>
                                <label htmlFor="work_place" className={labelBaseClass}>{t('guests.workLocation')}</label>
                                <input type="text" name="work_place" id="work_place" value={formData.work_place || ''} onChange={handleInputChange} className={getInputClass('work_place')} />
                                {getFieldError('work_place') && <span className={errorTextClass}>{getFieldError('work_place')}</span>}
                            </div>
                        </div>

                        <SectionHeader title={t('guests.addressInfo')} icon={<AddressInfoIcon />} />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div>
                                <label className={labelBaseClass}>{t('guests.country')}</label>
                                <div className={(validationErrors['address_country'] || localValidationErrors['address_country']) ? "border border-red-500 rounded-md" : ""}>
                                    <SearchableSelect id="address_country" options={countryOptions.map(o => o.label)} value={countryOptions.find(c => c.value === formData.address_country)?.label || ''} onChange={val => { const opt = countryOptions.find(c => c.label === val); if (opt) handleSelectChange('address_country', opt.value) }} />
                                </div>
                                {getFieldError('address_country') && <span className={errorTextClass}>{getFieldError('address_country')}</span>}
                            </div>
                            <div>
                                <label htmlFor="city" className={labelBaseClass}>{t('guests.city')}</label>
                                <input type="text" name="city" id="city" value={formData.city || ''} onChange={handleInputChange} className={getInputClass('city')} />
                                {getFieldError('city') && <span className={errorTextClass}>{getFieldError('city')}</span>}
                            </div>
                            <div>
                                <label htmlFor="neighborhood" className={labelBaseClass}>{t('guests.district')}</label>
                                <input type="text" name="neighborhood" id="neighborhood" value={formData.neighborhood || ''} onChange={handleInputChange} className={getInputClass('neighborhood')} />
                                {getFieldError('neighborhood') && <span className={errorTextClass}>{getFieldError('neighborhood')}</span>}
                            </div>
                            <div>
                                <label htmlFor="street" className={labelBaseClass}>{t('guests.street')}</label>
                                <input type="text" name="street" id="street" value={formData.street || ''} onChange={handleInputChange} className={getInputClass('street')} />
                                {getFieldError('street') && <span className={errorTextClass}>{getFieldError('street')}</span>}
                            </div>
                            <div>
                                <label htmlFor="postal_code" className={labelBaseClass}>{t('guests.postalCode')}</label>
                                <input type="text" name="postal_code" id="postal_code" value={formData.postal_code || ''} onChange={handleInputChange} className={getInputClass('postal_code')} />
                                {getFieldError('postal_code') && <span className={errorTextClass}>{getFieldError('postal_code')}</span>}
                            </div>
                        </div>

                        <SectionHeader title={t('guests.guestSystemInfo')} icon={<GuestSystemIcon />} />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className={labelBaseClass}>{t('guests.th_guestType')}</label>
                                <div className={(validationErrors['guest_type'] || localValidationErrors['guest_type']) ? "border border-red-500 rounded-md" : ""}>
                                    <SearchableSelect id="guest_type" options={guestTypeOptions.map(o => o.label)} value={guestTypeOptions.find(gt => gt.value === formData.guest_type)?.label || ''} onChange={val => { const opt = guestTypeOptions.find(gt => gt.label === val); if (opt) handleSelectChange('guest_type', opt.value); }} />
                                </div>
                                {getFieldError('guest_type') && <span className={errorTextClass}>{getFieldError('guest_type')}</span>}
                            </div>
                            <div>
                                <label className={labelBaseClass}>{t('guests.th_idType')}</label>
                                <div className={(validationErrors['ids'] || localValidationErrors['ids']) ? "border border-red-500 rounded-md" : ""}>
                                    <SearchableSelect id="ids" options={availableIdTypes.map(o => o.label)} value={availableIdTypes.find(it => it.value === formData.ids)?.label || ''} onChange={val => { const opt = availableIdTypes.find(it => it.label === val); if (opt) handleSelectChange('ids', opt.value); }} />
                                </div>
                                {getFieldError('ids') && <span className={errorTextClass}>{getFieldError('ids')}</span>}
                            </div>
                            <div>
                                <label htmlFor="id_number" className={labelBaseClass}>{t('guests.th_idNumber')}</label>
                                <input type="text" name="id_number" id="id_number" value={formData.id_number || ''} onChange={handleInputChange} className={getInputClass('id_number')} />
                                {getFieldError('id_number') && <span className={errorTextClass}>{getFieldError('id_number')}</span>}
                            </div>
                            <div>
                                <label htmlFor="id_serial" className={labelBaseClass}>{t('guests.serialNumber')}</label>
                                <input type="text" name="id_serial" id="id_serial" value={formData.id_serial || ''} onChange={handleInputChange} className={getInputClass('id_serial')} />
                                {getFieldError('id_serial') && <span className={errorTextClass}>{getFieldError('id_serial')}</span>}
                            </div>
                            <div>
                                <label htmlFor="id_copy_number" className={labelBaseClass}>{t('guests.th_idCopyNumber')}</label>
                                <input type="text" name="id_copy_number" id="id_copy_number" value={formData.id_copy_number || ''} onChange={handleInputChange} className={getInputClass('id_copy_number')} />
                                {getFieldError('id_copy_number') && <span className={errorTextClass}>{getFieldError('id_copy_number')}</span>}
                            </div>
                            <div>
                                <div className={(validationErrors['expiry_date'] || localValidationErrors['expiry_date']) ? "border border-red-500 rounded-md" : ""}>
                                    <DatePicker
                                        label={t('guests.th_expiryDate')}
                                        selectedDate={formData.expiry_date ? new Date(formData.expiry_date) : null}
                                        onChange={(dateString) => setFormData(prev => ({ ...prev, expiry_date: dateString }))}
                                    />
                                </div>
                                {getFieldError('expiry_date') && <span className={errorTextClass}>{getFieldError('expiry_date')}</span>}
                            </div>
                            <div>
                                <div className={(validationErrors['issue_date'] || localValidationErrors['issue_date']) ? "border border-red-500 rounded-md" : ""}>
                                    <DatePicker
                                        label={t('guests.th_issueDate')}
                                        selectedDate={formData.issue_date ? new Date(formData.issue_date) : null}
                                        onChange={(dateString) => setFormData(prev => ({ ...prev, issue_date: dateString }))}
                                    />
                                </div>
                                {getFieldError('issue_date') && <span className={errorTextClass}>{getFieldError('issue_date')}</span>}
                            </div>
                            <div>
                                <label htmlFor="issue_place" className={labelBaseClass}>{t('guests.issueLocation')}</label>
                                <input type="text" name="issue_place" id="issue_place" value={formData.issue_place || ''} onChange={handleInputChange} className={getInputClass('issue_place')} />
                                {getFieldError('issue_place') && <span className={errorTextClass}>{getFieldError('issue_place')}</span>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
                            <div className="lg:col-span-4">
                                <label className={labelBaseClass}>{t('guests.notes')}</label>
                                <textarea
                                    name="note"
                                    id="note"
                                    rows={2}
                                    className={inputBaseClass}
                                    placeholder={t('guests.notesPlaceholder')}
                                    value={formData.note || ''}
                                    onChange={handleInputChange}
                                ></textarea>
                                {getFieldError('note') && <span className={errorTextClass}>{getFieldError('note')}</span>}
                            </div>
                        </div>

                    </form>
                </div>

                <footer className="flex items-center justify-start p-4 border-t dark:border-white/10 flex-shrink-0 gap-3 bg-white dark:bg-slate-900 rounded-b-xl">
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