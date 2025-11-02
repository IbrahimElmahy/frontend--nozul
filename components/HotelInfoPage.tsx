import React, { useState, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import PhoneNumberInput from './PhoneNumberInput';
import SearchableSelect from './SearchableSelect';
import CheckCircleIcon from './icons-redesign/CheckCircleIcon';

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

const HotelInfoPage: React.FC = () => {
    const { t } = useContext(LanguageContext);
    const [formData, setFormData] = useState({
        englishName: 'demo',
        arabicName: 'demo',
        email: 'demo@gmail.com',
        logo: null,
        poBox: '',
        location: '',
        country: 'Saudi Arabia',
        city: '',
        district: '',
        street: '',
        timeZone: '',
        postalCode: '560094',
        taxNumber: '212343',
        commercialRegNo: '8545665',
        mobileNumber: '+967733997110',
        phoneNumber: '+966567289647',
        quickContact: '+966567289647',
        fax: '+966',
        description: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const inputClass = "w-full px-3 py-2 bg-slate-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-200 text-sm";
    const fileInputClass = `block w-full text-sm text-slate-500 dark:text-slate-400 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-500/10 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-500/20 cursor-pointer`;


    return (
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <Section title={t('hotelInfo.hotelManagement')}>
                <FormField label={t('hotelInfo.englishName')}><input name="englishName" value={formData.englishName} onChange={handleInputChange} className={inputClass} /></FormField>
                <FormField label={t('hotelInfo.arabicName')}><input name="arabicName" value={formData.arabicName} onChange={handleInputChange} className={inputClass} /></FormField>
                <FormField label={t('hotelInfo.email')}><input name="email" type="email" value={formData.email} onChange={handleInputChange} className={inputClass} /></FormField>
                <FormField label={t('hotelInfo.companyLogo')}><input type="file" className={fileInputClass} /></FormField>
                <FormField label={t('hotelInfo.poBox')}><input name="poBox" value={formData.poBox} onChange={handleInputChange} className={inputClass} /></FormField>
                <FormField label={t('hotelInfo.location')}><input name="location" value={formData.location} onChange={handleInputChange} className={inputClass} /></FormField>
            </Section>

            <Section title={t('hotelInfo.addressInfo')}>
                <FormField label={t('hotelInfo.country')}><SearchableSelect id="country" options={['Saudi Arabia', 'Egypt', 'UAE']} value={formData.country} onChange={val => setFormData(p => ({...p, country: val}))} /></FormField>
                <FormField label={t('hotelInfo.city')}><input name="city" value={formData.city} onChange={handleInputChange} className={inputClass} /></FormField>
                <FormField label={t('hotelInfo.district')}><input name="district" value={formData.district} onChange={handleInputChange} className={inputClass} /></FormField>
                <FormField label={t('hotelInfo.street')}><input name="street" value={formData.street} onChange={handleInputChange} className={inputClass} /></FormField>
                <FormField label={t('hotelInfo.timeZone')}><SearchableSelect id="timezone" options={['(GMT+03:00) Riyadh', '(GMT+04:00) Dubai']} value={formData.timeZone} onChange={val => setFormData(p => ({...p, timeZone: val}))} /></FormField>
                <FormField label={t('hotelInfo.postalCode')}><input name="postalCode" value={formData.postalCode} onChange={handleInputChange} className={inputClass} /></FormField>
            </Section>

            <Section title={t('hotelInfo.companyInfo')}>
                <FormField label={t('hotelInfo.taxNumber')}><input name="taxNumber" value={formData.taxNumber} onChange={handleInputChange} className={inputClass} /></FormField>
                <FormField label={t('hotelInfo.commercialRegNo')}><input name="commercialRegNo" value={formData.commercialRegNo} onChange={handleInputChange} className={inputClass} /></FormField>
            </Section>
            
            <Section title={t('hotelInfo.contactInfo')}>
                <FormField label={t('hotelInfo.mobileNumber')}><PhoneNumberInput value={formData.mobileNumber} onChange={val => setFormData(p => ({...p, mobileNumber: val}))} /></FormField>
                <FormField label={t('hotelInfo.phoneNumber')}><PhoneNumberInput value={formData.phoneNumber} onChange={val => setFormData(p => ({...p, phoneNumber: val}))} /></FormField>
                <FormField label={t('hotelInfo.quickContact')}><PhoneNumberInput value={formData.quickContact} onChange={val => setFormData(p => ({...p, quickContact: val}))} /></FormField>
                <FormField label={t('hotelInfo.fax')}><PhoneNumberInput value={formData.fax} onChange={val => setFormData(p => ({...p, fax: val}))} /></FormField>
            </Section>
            
             <Section title={t('hotelInfo.description')}>
                <FormField label="" className="md:col-span-2">
                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} placeholder={t('hotelInfo.descriptionPlaceholder')} className={inputClass}></textarea>
                </FormField>
            </Section>
            
            <div className="flex justify-start">
                <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
                    <CheckCircleIcon className="w-5 h-5" />
                    <span>{t('hotelInfo.saveChanges')}</span>
                </button>
            </div>
        </form>
    );
};

export default HotelInfoPage;