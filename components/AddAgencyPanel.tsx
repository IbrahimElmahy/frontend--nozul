
import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { BookingAgency, CountryAPI, GuestTypeAPI, IdTypeAPI } from '../types';
import XMarkIcon from './icons-redesign/XMarkIcon';
import CheckCircleIcon from './icons-redesign/CheckCircleIcon';
import DatePicker from './DatePicker';
import PhoneNumberInput from './PhoneNumberInput';
import SearchableSelect from './SearchableSelect';
import Switch from './Switch';
import { apiClient } from '../apiClient';

interface AddAgencyPanelProps {
    initialData: Omit<BookingAgency, 'id' | 'created_at' | 'updated_at'> | null;
    isEditing: boolean;
    isOpen: boolean;
    onClose: () => void;
    onSave: (formData: FormData) => void;
}

const SectionHeader: React.FC<{ title: string; }> = ({ title }) => (
    <div className="bg-slate-100 dark:bg-slate-700/50 p-2 my-4 rounded-md flex items-center">
        <div className="w-1 h-4 bg-blue-500 rounded-full mx-2"></div>
        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">{title}</h3>
    </div>
);

const AddAgencyPanel: React.FC<AddAgencyPanelProps> = ({ initialData, isEditing, isOpen, onClose, onSave }) => {
    const { t, language } = useContext(LanguageContext);
    const [formData, setFormData] = useState<any>({});

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
            if (initialData) {
                // Make a copy and try to resolve Names to IDs if necessary
                // The initialData usually contains names from the List API (e.g. "Company", "VAT Number")
                // But the form needs UUIDs for the select inputs.
                // We will resolve this inside the effect after options are loaded, or by matching names.
                // However, since options are async, we might need to wait or match later.
                // For now, we set what we have.
                setFormData(JSON.parse(JSON.stringify(initialData)));
            } else {
                setFormData({
                    name: '',
                    phone_number: '',
                    country: 'SA',
                    guest_type: '',
                    ids: '',
                    id_number: '',
                    is_active: true,
                    email: '',
                    discount_type: '',
                    discount_value: 0,
                    work_number: '',
                    serial_number: '',
                    issue_date: '',
                    expiry_date: '',
                    issue_place: '',
                    notes: '',
                });
            }
        }
    }, [isOpen, initialData]);

    // Logic to map display names back to IDs when editing
    useEffect(() => {
        if (isEditing && formData && agentTypes.length > 0) {
            // Check if guest_type is a name (not a UUID)
            // Simple heuristic: UUIDs usually are longer and contain dashes, but names can be anything.
            // Robust way: check if the current value exists in agentTypes IDs. If not, search by name.
            const currentTypeID = formData.guest_type;
            const foundTypeById = agentTypes.find(t => t.id === currentTypeID);

            if (!foundTypeById) {
                // Try to find by name (ar or en)
                const foundTypeByName = agentTypes.find(t => t.name_ar === currentTypeID || t.name_en === currentTypeID || t.name === currentTypeID);
                if (foundTypeByName) {
                    setFormData(prev => ({ ...prev, guest_type: foundTypeByName.id }));
                } else if (agentTypes.length > 0 && !currentTypeID) {
                    // Default if empty
                    setFormData(prev => ({ ...prev, guest_type: agentTypes[0].id }));
                }
            }
        }
    }, [isEditing, agentTypes, formData.guest_type]);

    useEffect(() => {
        const fetchIdTypes = async () => {
            if (formData.guest_type && agentTypes.length > 0) {
                // Verify guest_type is a valid UUID from our list
                const selectedAgentType = agentTypes.find(at => at.id === formData.guest_type);

                if (selectedAgentType) {
                    try {
                        const idTypesRes = await apiClient<{ data: IdTypeAPI[] }>(`/ar/guest/api/ids/?guests_types=${selectedAgentType.id}`);
                        setIdTypes(idTypesRes.data);

                        // Now resolve IDs for the ID Type field similarly
                        if (isEditing && formData.ids) {
                            const currentIdVal = formData.ids;
                            const foundIdById = idTypesRes.data.find(it => it.id === currentIdVal);
                            if (!foundIdById) {
                                const foundIdByName = idTypesRes.data.find(it => it.name_ar === currentIdVal || it.name_en === currentIdVal || it.name === currentIdVal);
                                if (foundIdByName) {
                                    setFormData(prev => ({ ...prev, ids: foundIdByName.id }));
                                }
                            }
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
    }, [formData.guest_type, agentTypes, isEditing]); // Removed formData.ids from dep array to avoid loop


    const handleSaveClick = () => {
        const data = new FormData();
        data.append('category', 'agent');
        data.append('name', formData.name || '');
        data.append('phone_number', formData.phone_number || '');
        data.append('email', formData.email || '');
        data.append('country', formData.country || 'SA');

        // The API doc mentions 'nationality', but Guest API usually uses 'country'.
        // We will send 'nationality' as well just in case, mapping from country code.
        data.append('nationality', formData.country || 'SA');

        data.append('guest_type', formData.guest_type || '');
        data.append('ids', formData.ids || '');
        data.append('id_number', formData.id_number || '');

        data.append('discount_type', formData.discount_type || '');
        data.append('discount_value', (formData.discount_value || 0).toString());

        // Address fields
        data.append('address_country', formData.address_country || formData.country || 'SA');
        data.append('city', formData.city || '');
        data.append('neighborhood', formData.neighborhood || '');
        data.append('street', formData.street || '');
        data.append('postal_code', formData.postal_code || '');

        // New fields
        data.append('work_number', formData.work_number || '');
        // Backend expects 'id_serial' for Serial Number usually
        data.append('id_serial', formData.serial_number || '');
        data.append('issue_date', formData.issue_date || '');
        data.append('expiry_date', formData.expiry_date || '');
        data.append('issue_place', formData.issue_place || '');
        data.append('note', formData.notes || '');

        onSave(data);
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
    const discountTypeOptions = discountTypes.map(([val, label]) => ({ value: val, label: label }));

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            role="dialog" aria-modal="true" aria-labelledby="add-agency-title"
        >
            <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden="true"></div>
            <div className={`relative bg-white dark:bg-slate-800 shadow-2xl flex flex-col w-full max-w-6xl max-h-[90vh] rounded-xl transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <header className="flex items-center justify-between p-4 border-b dark:border-slate-700 flex-shrink-0 sticky top-0 bg-white dark:bg-slate-800 z-10 rounded-t-xl">
                    <h2 id="add-agency-title" className="text-lg font-bold text-slate-800 dark:text-slate-200">{isEditing ? t('agencies.editAgencyTitle') : t('agencies.addAgencyTitle')}</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Close panel">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </header>

                <div className="flex-grow p-6 overflow-y-auto">
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                        <SectionHeader title={t('agencies.agencyInfo')} />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="name" className={labelBaseClass}>{t('agencies.th_name')}</label>
                                <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleInputChange} className={inputBaseClass} />
                            </div>
                            <div>
                                <label htmlFor="country" className={labelBaseClass}>{t('agencies.th_country')}</label>
                                <SearchableSelect id="country" options={countryOptions.map(o => o.label)} value={countryOptions.find(o => o.value === formData.country)?.label || ''} onChange={label => { const opt = countryOptions.find(o => o.label === label); if (opt) setFormData(p => ({ ...p, country: opt.value })) }} />
                            </div>
                        </div>

                        <SectionHeader title={t('guests.contactInfo')} />
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label htmlFor="phone_number" className={labelBaseClass}>{t('agencies.th_mobileNumber')}</label>
                                <PhoneNumberInput value={formData.phone_number} onChange={val => setFormData(p => ({ ...p, phone_number: val }))} />
                            </div>
                            <div>
                                <label htmlFor="work_number" className={labelBaseClass}>{t('guests.workNumber')}</label>
                                <PhoneNumberInput value={formData.work_number || ''} onChange={val => setFormData(p => ({ ...p, work_number: val }))} />
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="email" className={labelBaseClass}>{t('profilePage.email')}</label>
                                <input type="email" name="email" id="email" value={formData.email || ''} onChange={handleInputChange} className={inputBaseClass} />
                            </div>
                        </div>

                        <SectionHeader title={t('guests.addressInfo')} />
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            <div>
                                <label htmlFor="address_country" className={labelBaseClass}>{t('agencies.th_country')}</label>
                                <SearchableSelect id="address_country" options={countryOptions.map(o => o.label)} value={countryOptions.find(o => o.value === (formData.address_country || formData.country))?.label || ''} onChange={label => { const opt = countryOptions.find(o => o.label === label); if (opt) setFormData(p => ({ ...p, address_country: opt.value })) }} />
                            </div>
                            <div>
                                <label htmlFor="city" className={labelBaseClass}>{t('guests.city')}</label>
                                <input type="text" name="city" id="city" value={formData.city || ''} onChange={handleInputChange} className={inputBaseClass} />
                            </div>
                            <div>
                                <label htmlFor="neighborhood" className={labelBaseClass}>{t('guests.district')}</label>
                                <input type="text" name="neighborhood" id="neighborhood" value={formData.neighborhood || ''} onChange={handleInputChange} className={inputBaseClass} />
                            </div>
                            <div>
                                <label htmlFor="street" className={labelBaseClass}>{t('guests.street')}</label>
                                <input type="text" name="street" id="street" value={formData.street || ''} onChange={handleInputChange} className={inputBaseClass} />
                            </div>
                            <div>
                                <label htmlFor="postal_code" className={labelBaseClass}>{t('guests.postalCode')}</label>
                                <input type="text" name="postal_code" id="postal_code" value={formData.postal_code || ''} onChange={handleInputChange} className={inputBaseClass} />
                            </div>
                        </div>


                        <SectionHeader title={t('guests.guestInfo')} />
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label htmlFor="guest_type" className={labelBaseClass}>{t('agencies.th_agencyType')}</label>
                                <SearchableSelect id="guest_type" options={agentTypeOptions.map(o => o.label)} value={agentTypeOptions.find(o => o.value === formData.guest_type)?.label || ''} onChange={(label) => { const opt = agentTypeOptions.find(o => o.label === label); if (opt) setFormData(p => ({ ...p, guest_type: opt.value })) }} />
                            </div>
                            <div>
                                <label htmlFor="ids" className={labelBaseClass}>{t('agencies.th_idType')}</label>
                                <SearchableSelect id="ids" options={idTypeOptions.map(o => o.label)} value={idTypeOptions.find(o => o.value === formData.ids)?.label || ''} onChange={(label) => { const opt = idTypeOptions.find(o => o.label === label); if (opt) setFormData(p => ({ ...p, ids: opt.value })) }} />
                            </div>
                            <div>
                                <label htmlFor="id_number" className={labelBaseClass}>{t('agencies.th_idNumber')}</label>
                                <input type="text" name="id_number" id="id_number" value={formData.id_number || ''} onChange={handleInputChange} className={inputBaseClass} />
                            </div>
                            <div>
                                <label htmlFor="serial_number" className={labelBaseClass}>{t('guests.serialNumber')}</label>
                                <input type="text" name="serial_number" id="serial_number" value={formData.serial_number || ''} onChange={handleInputChange} className={inputBaseClass} />
                            </div>
                            <div>
                                <label className={labelBaseClass}>{t('guests.issueDate')}</label>
                                <DatePicker selected={formData.issue_date ? new Date(formData.issue_date) : null} onChange={date => setFormData(p => ({ ...p, issue_date: date || '' }))} placeholderText={t('guests.issueDate')} />
                            </div>
                            <div>
                                <label className={labelBaseClass}>{t('guests.expiryDate')}</label>
                                <DatePicker selected={formData.expiry_date ? new Date(formData.expiry_date) : null} onChange={date => setFormData(p => ({ ...p, expiry_date: date || '' }))} placeholderText={t('guests.expiryDate')} />
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="issue_place" className={labelBaseClass}>{t('guests.issuePlace')}</label>
                                <input type="text" name="issue_place" id="issue_place" value={formData.issue_place || ''} onChange={handleInputChange} className={inputBaseClass} />
                            </div>
                        </div>

                        <SectionHeader title={t('bookings.financialInfo')} />
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label htmlFor="discount_type" className={labelBaseClass}>{t('bookings.discountType')}</label>
                                <SearchableSelect id="discount_type" options={discountTypeOptions.map(o => o.label)} value={discountTypeOptions.find(o => o.value === formData.discount_type)?.label || ''} onChange={(label) => { const opt = discountTypeOptions.find(o => o.label === label); if (opt) setFormData(p => ({ ...p, discount_type: opt.value })) }} />
                            </div>
                            <div>
                                <label htmlFor="discount_value" className={labelBaseClass}>{t('bookings.value')}</label>
                                <input type="number" name="discount_value" id="discount_value" value={formData.discount_value || ''} onChange={handleInputChange} className={inputBaseClass} />
                            </div>
                        </div>

                        <SectionHeader title={t('orders.notes')} />
                        <div>
                            <textarea name="notes" rows={4} placeholder={t('orders.notesPlaceholder')} value={formData.notes || ''} onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))} className={inputBaseClass}></textarea>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{t('agencies.th_status')}</span>
                            <Switch id="is_active" checked={formData.is_active} onChange={(c) => setFormData(p => ({ ...p, is_active: c }))} />
                        </div>
                    </form>
                </div>

                <footer className="flex items-center justify-start p-4 border-t dark:border-slate-700 flex-shrink-0 gap-3 sticky bottom-0 bg-white dark:bg-slate-800 rounded-b-xl">
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
