import React, { useState, useContext, useEffect } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import PhoneNumberInput from './PhoneNumberInput';
import SearchableSelect from './SearchableSelect';
import CheckCircleIcon from './icons-redesign/CheckCircleIcon';
import { Page } from '../App';
import ChevronLeftIcon from './icons-redesign/ChevronLeftIcon';
import { apiClient } from '../apiClient';
import { CountryAPI } from '../types';


const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 border-b pb-3 dark:border-slate-700">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {children}
        </div>
    </div>
);

const FormField: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({ label, children, className }) => {
    const { language } = useContext(LanguageContext);
    const labelClass = `block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ${language === 'ar' ? 'text-right' : 'text-left'}`;
    return (
        <div className={className}>
            <label className={labelClass}>{label}</label>
            {children}
        </div>
    );
};

interface HotelInfoPageProps {
    setCurrentPage: (page: Page) => void;
}

const HotelInfoPage: React.FC<HotelInfoPageProps> = ({ setCurrentPage }) => {
    const { t, language } = useContext(LanguageContext);

    const [formData, setFormData] = useState({
        englishName: '',
        arabicName: '',
        email: '',
        poBox: '',
        website: '',
        country: '',
        city: '',
        district: '',
        street: '',
        timeZone: '',
        postalCode: '',
        taxNumber: '',
        commercialRegNo: '',
        mobileNumber: '',
        phoneNumber: '',
        quickContact: '',
        fax: '',
        description: '',
    });

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [countries, setCountries] = useState<[string, string][]>([]);
    const [timezones, setTimezones] = useState<string[]>([]);

    useEffect(() => {
        const fetchHotelData = async () => {
            setLoading(true);
            setError(null);
            try {
                // This ID should ideally come from the user's session or a global state.
                const hotelId = '32af5628-6b26-4ee7-8c11-3f82363007ff';
                const [hotelData, countriesData] = await Promise.all([
                    apiClient<any>(`/ar/hotel/api/hotels/${hotelId}/`),
                    apiClient<CountryAPI>('/ar/country/api/countries/')
                ]);

                const countryCode = Object.keys(countriesData).find(code => countriesData[code] === hotelData.country) || '';

                setFormData({
                    englishName: hotelData.name_en || '',
                    arabicName: hotelData.name_ar || '',
                    email: hotelData.email || '',
                    poBox: hotelData.p_o_box || '',
                    website: hotelData.website || '',
                    country: countryCode,
                    city: hotelData.city || '',
                    district: hotelData.neighborhood || '',
                    street: hotelData.street || '',
                    timeZone: hotelData.timezone || '',
                    postalCode: hotelData.postal_code || '',
                    taxNumber: hotelData.vatn || '',
                    commercialRegNo: hotelData.crn || '',
                    mobileNumber: hotelData.mobile_number || '',
                    phoneNumber: hotelData.phone_number || '',
                    quickContact: hotelData.hotline_number || '',
                    fax: hotelData.fax_number || '',
                    description: hotelData.description || '',
                });

                if (hotelData.logo) {
                    setLogoPreview(hotelData.logo);
                }

                setCountries(Object.entries(countriesData));
                // Mocking timezones as there is no API endpoint for it.
                setTimezones(['Asia/Riyadh', 'Asia/Dubai', 'Asia/Aden', 'Africa/Cairo', 'Europe/London']);

            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load hotel data.');
            } finally {
                setLoading(false);
            }
        };

        fetchHotelData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        setSuccess(null);

        const data = new FormData();
        data.append('name_en', formData.englishName);
        data.append('name_ar', formData.arabicName);
        data.append('email', formData.email);
        data.append('p_o_box', formData.poBox);
        data.append('website', formData.website);
        // Assuming API takes country code
        data.append('street', formData.street); // As per API, this is a text field in GET response
        data.append('timezone', formData.timeZone);
        data.append('postal_code', formData.postalCode);
        data.append('vatn', formData.taxNumber);
        data.append('crn', formData.commercialRegNo);
        data.append('phone_number', formData.phoneNumber);
        data.append('mobile_number', formData.mobileNumber);
        data.append('hotline_number', formData.quickContact);
        data.append('fax_number', formData.fax);
        data.append('description', formData.description);

        if (logoFile) {
            data.append('logo', logoFile);
        }

        try {
            const hotelId = '32af5628-6b26-4ee7-8c11-3f82363007ff';
            await apiClient(`/ar/hotel/api/hotels/${hotelId}/`, {
                method: 'PUT',
                body: data,
            });
            setSuccess('Hotel information saved successfully!');
            // Clear file input state after successful upload
            setLogoFile(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save hotel data.');
        } finally {
            setIsSaving(false);
        }
    };


    const inputClass = "w-full px-3 py-2 bg-slate-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-200 text-sm";
    const fileInputClass = `block w-full text-sm text-slate-500 dark:text-slate-400 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-500/10 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-500/20 cursor-pointer`;

    if (loading) {
        return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{t('hotelInfo.pageTitle')}</h2>
                <div className="flex gap-3">
                    <button
                        onClick={() => setCurrentPage('hotel-settings')}
                        className={`flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold py-2 px-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${language === 'ar' ? 'flex-row-reverse' : ''}`}
                    >
                        <ChevronLeftIcon className={`w-5 h-5 transform ${language === 'ar' ? 'rotate-180' : ''}`} />
                        <span>{t('buttons.back')}</span>
                    </button>
                </div>
            </div>

            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">{error}</div>}
            {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4" role="alert">{success}</div>}

            <form onSubmit={handleSave} className="space-y-6">
                <Section title={t('hotelInfo.hotelManagement')}>
                    <FormField label={t('hotelInfo.englishName')}><input name="englishName" value={formData.englishName} onChange={handleInputChange} className={inputClass} /></FormField>
                    <FormField label={t('hotelInfo.arabicName')}><input name="arabicName" value={formData.arabicName} onChange={handleInputChange} className={inputClass} /></FormField>
                    <FormField label={t('hotelInfo.email')}><input name="email" type="email" value={formData.email} onChange={handleInputChange} className={inputClass} /></FormField>
                    <FormField label={t('hotelInfo.companyLogo')}>
                        <div className="flex items-center gap-4">
                            {logoPreview && <img src={logoPreview} alt="Logo Preview" className="w-16 h-16 rounded-md object-cover" />}
                            <input type="file" onChange={handleFileChange} className={fileInputClass} accept="image/*" />
                        </div>
                    </FormField>
                    <FormField label={t('hotelInfo.poBox')}><input name="poBox" value={formData.poBox} onChange={handleInputChange} className={inputClass} /></FormField>
                    <FormField label={"Website"}><input name="website" value={formData.website} onChange={handleInputChange} className={inputClass} /></FormField>
                </Section>

                <Section title={t('hotelInfo.addressInfo')}>
                    <FormField label={t('hotelInfo.country')}><SearchableSelect id="country" options={countries.map(c => c[1])} value={countries.find(c => c[0] === formData.country)?.[1] || ''} onChange={val => setFormData(p => ({ ...p, country: countries.find(c => c[1] === val)?.[0] || '' }))} /></FormField>
                    <FormField label={t('hotelInfo.city')}><input name="city" value={formData.city} onChange={handleInputChange} className={inputClass} /></FormField>
                    <FormField label={t('hotelInfo.district')}><input name="district" value={formData.district} onChange={handleInputChange} className={inputClass} /></FormField>
                    <FormField label={t('hotelInfo.street')}><input name="street" value={formData.street} onChange={handleInputChange} className={inputClass} /></FormField>
                    <FormField label={t('hotelInfo.timeZone')}><SearchableSelect id="timezone" options={timezones} value={formData.timeZone} onChange={val => setFormData(p => ({ ...p, timeZone: val }))} /></FormField>
                    <FormField label={t('hotelInfo.postalCode')}><input name="postalCode" value={formData.postalCode} onChange={handleInputChange} className={inputClass} /></FormField>
                </Section>

                <Section title={t('hotelInfo.companyInfo')}>
                    <FormField label={t('hotelInfo.taxNumber')}><input name="taxNumber" value={formData.taxNumber} onChange={handleInputChange} className={inputClass} /></FormField>
                    <FormField label={t('hotelInfo.commercialRegNo')}><input name="commercialRegNo" value={formData.commercialRegNo} onChange={handleInputChange} className={inputClass} /></FormField>
                </Section>

                <Section title={t('hotelInfo.contactInfo')}>
                    <FormField label={t('hotelInfo.mobileNumber')}><PhoneNumberInput value={formData.mobileNumber} onChange={val => setFormData(p => ({ ...p, mobileNumber: val }))} /></FormField>
                    <FormField label={t('hotelInfo.phoneNumber')}><PhoneNumberInput value={formData.phoneNumber} onChange={val => setFormData(p => ({ ...p, phoneNumber: val }))} /></FormField>
                    <FormField label={t('hotelInfo.quickContact')}><PhoneNumberInput value={formData.quickContact} onChange={val => setFormData(p => ({ ...p, quickContact: val }))} /></FormField>
                    <FormField label={t('hotelInfo.fax')}><PhoneNumberInput value={formData.fax} onChange={val => setFormData(p => ({ ...p, fax: val }))} /></FormField>
                </Section>

                <Section title={t('hotelInfo.description')}>
                    <FormField label="" className="md:col-span-2">
                        <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} placeholder={t('hotelInfo.descriptionPlaceholder')} className={inputClass}></textarea>
                    </FormField>
                </Section>

                <div className="flex justify-start">
                    <button type="submit" disabled={isSaving} className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed">
                        {isSaving ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : (
                            <CheckCircleIcon className="w-5 h-5" />
                        )}
                        <span>{isSaving ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') : t('hotelInfo.saveChanges')}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default HotelInfoPage;
