import React, { useState, useContext, useEffect } from 'react';
import ProfileStatCard from './ProfileStatCard';
import InformationCircleIcon from './icons-redesign/InformationCircleIcon';
import DatePicker from './DatePicker';
import PhoneNumberInput from './PhoneNumberInput'; // Import the new component
import { LanguageContext } from '../contexts/LanguageContext';
import { User } from '../types';

// Icons for stat cards
import HeartIcon from './icons-redesign/HeartIcon';
import ArrowRightCircleIcon from './icons-redesign/ArrowRightCircleIcon';
import ArrowLeftCircleIcon from './icons-redesign/ArrowLeftCircleIcon';
import DesktopComputerIcon from './icons-redesign/DesktopComputerIcon';
import CheckCircleIcon from './icons-redesign/CheckCircleIcon';

interface UserProfilePageProps {
    user: User | null;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ user }) => {
    const { t, language } = useContext(LanguageContext);
    const [profileData, setProfileData] = useState({
        name: '',
        gender: 'ذكر',
        dob: '2000-02-29',
        notes: '',
        username: '',
        phoneNumber: '',
        email: '',
    });
    
    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                gender: 'ذكر', // This info is not in the user object
                dob: '2000-02-29', // This info is not in the user object
                notes: '',
                username: user.username || '',
                phoneNumber: user.phone_number || '',
                email: user.email || '',
            });
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({...prev, [name]: value}));
    };

    const handleDateChange = (date: string) => {
        setProfileData(prev => ({ ...prev, dob: date }));
    };

    const handlePhoneChange = (newNumber: string) => {
        setProfileData(prev => ({ ...prev, phoneNumber: newNumber }));
    };
    
    const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';
    const labelAlignClass = `block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${textAlignClass}`;
    const inputBaseClass = `w-full px-4 py-2 bg-slate-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-slate-200`;
    const fileInputClass = `block w-full text-sm text-slate-500 dark:text-slate-400 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-500/10 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-500/20 cursor-pointer ${language === 'ar' ? 'file:ml-4' : 'file:mr-4'}`;
    
    return (
        <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <ProfileStatCard
                    // FIX: Changed translation key to 'profilePage.*' to avoid conflict
                    title={t('profilePage.planA')}
                    subtitle={t('profilePage.plan')}
                    icon={HeartIcon}
                    iconBgColor="bg-purple-500"
                />
                <ProfileStatCard
                    title="09 ديسمبر 2024"
                    // FIX: Changed translation key to 'profilePage.*' to avoid conflict
                    subtitle={t('profilePage.subscriptionDate')}
                    icon={ArrowRightCircleIcon}
                    iconBgColor="bg-cyan-500"
                />
                <ProfileStatCard
                    title="09 ديسمبر 2025"
                    // FIX: Changed translation key to 'profilePage.*' to avoid conflict
                    subtitle={t('profilePage.subscriptionEndDate')}
                    icon={ArrowLeftCircleIcon}
                    iconBgColor="bg-red-500"
                />
                <ProfileStatCard
                    title="131"
                    // FIX: Changed translation key to 'profilePage.*' to avoid conflict
                    subtitle={t('profilePage.messageBalance')}
                    icon={DesktopComputerIcon}
                    iconBgColor="bg-slate-700"
                />
            </div>

            {/* User Info Form */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                <div className={`p-4 border-b dark:border-slate-700`}>
                    <h3 className={`text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <InformationCircleIcon className="w-6 h-6 text-slate-500" />
                        {/* FIX: Changed translation key to 'profilePage.*' to avoid conflict */}
                        <span>{t('profilePage.accountInfo')}</span>
                    </h3>
                </div>
                <form className="p-6 space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Name */}
                        <div>
                            {/* FIX: Changed translation key to 'profilePage.*' to avoid conflict */}
                            <label htmlFor="name" className={labelAlignClass}>{t('profilePage.name')}</label>
                            <input type="text" id="name" name="name" value={profileData.name} onChange={handleInputChange} className={`${inputBaseClass} ${textAlignClass}`} />
                        </div>

                        {/* Gender */}
                        <div>
                            {/* FIX: Changed translation key to 'profilePage.*' to avoid conflict */}
                            <label htmlFor="gender" className={labelAlignClass}>{t('profilePage.gender')}</label>
                            <select id="gender" name="gender" value={profileData.gender} onChange={handleInputChange} className={`${inputBaseClass} ${textAlignClass}`}>
                                {/* FIX: Changed translation key to 'profilePage.*' to avoid conflict */}
                                <option>{t('profilePage.genderSelect')}</option>
                                {/* FIX: Changed translation key to 'profilePage.*' to avoid conflict */}
                                <option>{t('profilePage.male')}</option>
                                {/* FIX: Changed translation key to 'profilePage.*' to avoid conflict */}
                                <option>{t('profilePage.female')}</option>
                            </select>
                        </div>
                        
                        {/* Date of Birth */}
                        <div>
                            {/* FIX: Changed translation key to 'profilePage.*' to avoid conflict */}
                            <label htmlFor="dob" className={labelAlignClass}>{t('profilePage.dob')}</label>
                            <DatePicker value={profileData.dob} onChange={handleDateChange} />
                        </div>

                        {/* Photo */}
                        <div>
                             {/* FIX: Changed translation key to 'profilePage.*' to avoid conflict */}
                             <label htmlFor="photo" className={labelAlignClass}>{t('profilePage.photo')}</label>
                             <input type="file" id="photo" className={fileInputClass}/>
                        </div>
                    </div>
                    
                    {/* Notes */}
                    <div>
                        {/* FIX: Changed translation key to 'profilePage.*' to avoid conflict */}
                        <label htmlFor="notes" className={labelAlignClass}>{t('profilePage.notes')}</label>
                        {/* FIX: Changed translation key to 'profilePage.*' to avoid conflict */}
                        <textarea id="notes" name="notes" rows={4} placeholder={t('profilePage.notesPlaceholder')} value={profileData.notes} onChange={handleInputChange} className={`${inputBaseClass} ${textAlignClass}`}></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                         {/* Username */}
                        <div>
                            {/* FIX: Changed translation key to 'profilePage.*' to avoid conflict */}
                            <label htmlFor="username" className={labelAlignClass}>{t('profilePage.username')}</label>
                            <input type="text" id="username" name="username" value={profileData.username} onChange={handleInputChange} className={`${inputBaseClass} ${textAlignClass}`} />
                        </div>

                         {/* Mobile Number */}
                        <div>
                            {/* FIX: Changed translation key to 'profilePage.*' to avoid conflict */}
                            <label htmlFor="phoneNumber" className={labelAlignClass}>{t('profilePage.mobileNumber')}</label>
                            <PhoneNumberInput value={profileData.phoneNumber} onChange={handlePhoneChange} />
                        </div>

                         {/* Email */}
                        <div>
                            {/* FIX: Changed translation key to 'profilePage.*' to avoid conflict */}
                            <label htmlFor="email" className={labelAlignClass}>{t('profilePage.email')}</label>
                            <input type="email" id="email" name="email" value={profileData.email} onChange={handleInputChange} className={`${inputBaseClass} ${textAlignClass}`} />
                        </div>
                        
                         {/* User Role */}
                         <div>
                            {/* FIX: Changed translation key to 'profilePage.*' to avoid conflict */}
                            <label htmlFor="role" className={labelAlignClass}>{t('profilePage.userRole')}</label>
                            {/* FIX: Changed translation key to 'profilePage.*' to avoid conflict */}
                            <input type="text" id="role" name="role" value={user?.role_name || t('profilePage.hotel')} className={`w-full px-4 py-2 bg-slate-200 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-md text-gray-500 dark:text-slate-400 ${textAlignClass}`} readOnly />
                        </div>
                    </div>
                    
                    <div className={`flex ${language === 'ar' ? 'justify-start' : 'justify-start'} pt-4`}>
                        <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
                            <CheckCircleIcon className="w-5 h-5" />
                            {/* FIX: Changed translation key to 'profilePage.*' to avoid conflict */}
                            <span>{t('profilePage.save')}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserProfilePage;