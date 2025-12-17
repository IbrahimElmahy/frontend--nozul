
import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { translations } from '../translations';
import { HotelUser } from '../types';
import XMarkIcon from './icons-redesign/XMarkIcon';
import CheckCircleIcon from './icons-redesign/CheckCircleIcon';
import DatePicker from './DatePicker';
import PhoneNumberInput from './PhoneNumberInput';
import SearchableSelect from './SearchableSelect';
import Switch from './Switch';
import Checkbox from './Checkbox';
import EyeIcon from './icons-redesign/EyeIcon';
import EyeOffIcon from './icons-redesign/EyeOffIcon';

interface AddUserPanelProps {
    initialData: Omit<HotelUser, 'id' | 'lastLogin' | 'createdAt' | 'updatedAt'> | HotelUser;
    isEditing: boolean;
    isOpen: boolean;
    onClose: () => void;
    onSave: (formData: FormData) => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 border-b pb-3 dark:border-white/10">{title}</h3>
        {children}
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

const permissionKeys: (keyof typeof translations.ar.addUserPanel.permissionsList)[] = [
    'view_accounts', 'add_apartments', 'edit_apartments', 'delete_apartments', 'view_apartments',
    'edit_apartment_prices', 'view_apartment_prices', 'activate_banks', 'add_banks', 'edit_banks',
    'delete_banks', 'deactivate_banks', 'view_banks', 'activate_funds', 'add_funds', 'edit_funds',
    'delete_funds', 'deactivate_funds', 'view_funds', 'activate_items', 'add_items', 'edit_items',
    'delete_items', 'deactivate_items', 'view_items', 'add_companions', 'delete_companions',
    'edit_conditions', 'view_conditions', 'activate_currencies', 'add_currencies', 'edit_currencies',
    'delete_currencies', 'deactivate_currencies', 'view_currencies', 'activate_expenses', 'add_expenses',
    'edit_expenses', 'delete_expenses', 'deactivate_expenses', 'view_expenses', 'activate_guests',
    'add_guests', 'edit_guests', 'delete_guests', 'deactivate_guests', 'view_guests', 'edit_hotel',
    'view_hotel', 'add_users', 'edit_users', 'view_users', 'add_invoices', 'delete_invoices',
    'view_invoices', 'send_notifications', 'delete_notifications', 'view_notifications', 'add_orders',
    'edit_orders', 'delete_orders', 'view_orders', 'add_peak', 'edit_peak', 'delete_peak', 'view_peak',
    'add_bookings', 'edit_bookings', 'checkin_bookings', 'checkout_bookings', 'delete_bookings',
    'view_bookings', 'add_booking_taxes', 'view_booking_taxes', 'activate_services', 'add_services',
    'edit_services', 'delete_services', 'deactivate_services', 'view_services', 'activate_taxes',
    'add_taxes', 'edit_taxes', 'delete_taxes', 'deactivate_taxes', 'view_taxes', 'add_transactions',
    'edit_transactions', 'delete_transactions', 'view_financial_report', 'view_accounts_report',
    'view_transactions', 'activate_users', 'deactivate_users'
];

const AddUserPanel: React.FC<AddUserPanelProps> = ({ initialData, isEditing, isOpen, onClose, onSave }) => {
    const { t } = useContext(LanguageContext);
    const [formData, setFormData] = useState<any>(initialData);
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [photo, setPhoto] = useState<File | null>(null);

    useEffect(() => {
        if (isOpen) {
            setFormData(JSON.parse(JSON.stringify(initialData)));
            setPassword('');
            setConfirmPassword('');
            setPhoto(null);
        }
    }, [isOpen, initialData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePermissionChange = (key: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            permissions: {
                ...prev.permissions,
                [key]: checked
            }
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPhoto(e.target.files[0]);
        }
    };

    const handleSaveClick = () => {
        if (password && password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const data = new FormData();
        data.append('username', formData.username || '');
        data.append('name', formData.name || '');
        data.append('email', formData.email || '');
        data.append('phone_number', formData.mobile || formData.phone_number || ''); // Handle both fields
        data.append('role', 'hotel'); // Fixed role
        data.append('gender', formData.gender || '');
        data.append('birthdate', formData.dob || formData.profile?.birthdate || '');
        data.append('is_active', formData.is_active ? 'true' : 'false');
        data.append('login_allowed', formData.isManager ? 'true' : 'false'); // Assuming 'isManager' maps to login_allowed
        data.append('notes', formData.notes || '');

        if (password) {
            data.append('password', password);
        }

        if (photo) {
            data.append('image', photo);
        }

        // Permissions
        // Assuming backend expects list of permission keys or similar
        const activePermissions = Object.entries(formData.permissions || {})
            .filter(([_, value]) => value)
            .map(([key]) => key);

        activePermissions.forEach(perm => {
            data.append('user_permissions', perm);
        });

        onSave(data);
    };

    const inputClass = "w-full px-3 py-2 bg-slate-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-200 text-sm";
    const fileInputClass = `block w-full text-sm text-slate-500 dark:text-slate-400 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-500/10 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-500/20 cursor-pointer`;
    const passwordInputContainerClass = "relative";
    const passwordToggleClass = "absolute inset-y-0 right-0 pr-3 flex items-center";


    return (
        <div className={`fixed inset-0 z-50 flex items-start justify-end transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden="true"></div>
            <div className={`relative h-full bg-slate-100 dark:bg-slate-900 shadow-2xl flex flex-col w-full max-w-4xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <header className="flex items-center justify-between p-4 border-b dark:border-white/10 flex-shrink-0 sticky top-0 bg-white dark:bg-slate-800 z-10">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">{isEditing ? t('addUserPanel.editTitle') : t('addUserPanel.title')}</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Close"><XMarkIcon className="w-6 h-6" /></button>
                </header>

                <div className="flex-grow p-6 overflow-y-auto">
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                        <Section title={t('addUserPanel.supervisorInfo')}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                <FormField label={t('addUserPanel.name')}><input name="name" value={formData.name || ''} onChange={handleInputChange} className={inputClass} /></FormField>
                                <FormField label={t('addUserPanel.photo')}><input type="file" onChange={handleFileChange} className={fileInputClass} /></FormField>
                                <FormField label={t('addUserPanel.gender')}><SearchableSelect id="gender" options={[t('addUserPanel.male'), t('addUserPanel.female')]} value={formData.gender === 'male' ? t('addUserPanel.male') : t('addUserPanel.female')} onChange={val => setFormData(p => ({ ...p, gender: val === t('addUserPanel.male') ? 'male' : 'female' }))} placeholder={t('addUserPanel.selectGender')} /></FormField>
                                <FormField label={t('addUserPanel.dob')}><DatePicker value={formData.dob || ''} onChange={date => setFormData(p => ({ ...p, dob: date }))} /></FormField>
                            </div>
                        </Section>

                        <Section title={t('addUserPanel.loginInfo')}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                <FormField label={t('addUserPanel.username')}><input name="username" value={formData.username || ''} onChange={handleInputChange} className={inputClass} /></FormField>
                                <FormField label={t('addUserPanel.email')}><input name="email" type="email" value={formData.email || ''} onChange={handleInputChange} className={inputClass} /></FormField>
                                <FormField label={t('addUserPanel.mobile')}><PhoneNumberInput value={formData.mobile || formData.phone_number || ''} onChange={val => setFormData(p => ({ ...p, mobile: val }))} /></FormField>
                                <FormField label={t('addUserPanel.isHotelManager')}><div className="h-10 flex items-center"><Switch id="isManager" checked={!!formData.isManager} onChange={c => setFormData(p => ({ ...p, isManager: c }))} /></div></FormField>
                            </div>
                        </Section>

                        <Section title={t('addUserPanel.passwordInfo')}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                <FormField label={t('addUserPanel.password')}>
                                    <div className={passwordInputContainerClass}>
                                        <input type={isPasswordVisible ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('addUserPanel.passwordPlaceholder')} className={inputClass} />
                                        <button type="button" onClick={() => setPasswordVisible(!isPasswordVisible)} className={passwordToggleClass}><span className="sr-only">Toggle password visibility</span>{isPasswordVisible ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}</button>
                                    </div>
                                </FormField>
                                <FormField label={t('addUserPanel.confirmPassword')}>
                                    <div className={passwordInputContainerClass}>
                                        <input type={isConfirmPasswordVisible ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder={t('addUserPanel.confirmPasswordPlaceholder')} className={inputClass} />
                                        <button type="button" onClick={() => setConfirmPasswordVisible(!isConfirmPasswordVisible)} className={passwordToggleClass}><span className="sr-only">Toggle confirm password visibility</span>{isConfirmPasswordVisible ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}</button>
                                    </div>
                                </FormField>
                            </div>
                        </Section>

                        <Section title={t('addUserPanel.permissions')}>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {permissionKeys.map(key => (
                                    <Checkbox key={key} id={`perm-${key}`} label={t(`addUserPanel.permissionsList.${key}` as any)} checked={!!formData.permissions?.[key]} onChange={c => handlePermissionChange(key, c)} />
                                ))}
                            </div>
                        </Section>

                        <Section title={t('addUserPanel.notes')}>
                            <textarea name="notes" value={formData.notes || ''} onChange={handleInputChange} rows={4} placeholder={t('addUserPanel.notesPlaceholder')} className={inputClass}></textarea>
                        </Section>

                    </form>
                </div>

                <footer className="flex items-center justify-start p-4 border-t dark:border-white/10 flex-shrink-0 gap-3 sticky bottom-0 bg-white dark:bg-slate-800">
                    <button onClick={handleSaveClick} className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
                        <CheckCircleIcon className="w-5 h-5" />
                        <span>{t('addUserPanel.save')}</span>
                    </button>
                    <button onClick={onClose} className="bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 font-semibold py-2 px-5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200">
                        {t('addUserPanel.cancel')}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default AddUserPanel;
