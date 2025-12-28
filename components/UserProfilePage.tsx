import React, { useState, useContext, useEffect } from 'react';
import { updateProfile } from '../services/users';
import { API_BASE_URL } from '../config/api';
import ProfileStatCard from './ProfileStatCard';
import InformationCircleIcon from './icons-redesign/InformationCircleIcon';
import DatePicker from './DatePicker';
import PhoneNumberInput from './PhoneNumberInput';
import { LanguageContext } from '../contexts/LanguageContext';
import { User } from '../types';

// Icons
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
        gender: 'male',
        dob: '2000-01-01',
        notes: '',
        username: '',
        phoneNumber: '',
        email: '',
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Memoize timestamp to prevent image refreshing on every keystroke/render
    const mountTime = React.useMemo(() => new Date().getTime(), []);

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                gender: user.gender || 'male',
                dob: user.birthdate || '2000-01-01',
                notes: '',
                username: user.username || '',
                phoneNumber: user.phone_number || '',
                email: user.email || '',
            });
        }
    }, [user]);

    // Cleanup preview URL on unmount
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date: string) => {
        setProfileData(prev => ({ ...prev, dob: date }));
    };

    const handlePhoneChange = (newNumber: string) => {
        setProfileData(prev => ({ ...prev, phoneNumber: newNumber }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setError(null);

        // Basic Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (profileData.email && !emailRegex.test(profileData.email)) {
            setError(t('common.invalidEmail' as any) || "Invalid email format");
            return;
        }

        setLoading(true);
        try {
            let bodyData: FormData | URLSearchParams;

            if (selectedFile) {
                // Use FormData for file upload (includes all other fields + file)
                const formData = new FormData();
                formData.append('name', profileData.name);
                formData.append('email', profileData.email);
                formData.append('username', profileData.username);
                formData.append('phonenumber', profileData.phoneNumber);
                if (profileData.dob) formData.append('profile.birthdate', profileData.dob);
                if (profileData.gender) formData.append('profile.gender', profileData.gender);
                formData.append('profile.image', selectedFile);
                formData.append('profile.summary', profileData.notes || '');
                bodyData = formData;
            } else {
                // Use URLSearchParams for text-only update (matches valid x-www-form-urlencoded pattern)
                const params = new URLSearchParams();
                params.append('name', profileData.name);
                params.append('email', profileData.email);
                params.append('username', profileData.username);
                params.append('phonenumber', profileData.phoneNumber);
                if (profileData.dob) params.append('profile.birthdate', profileData.dob);
                if (profileData.gender) params.append('profile.gender', profileData.gender);
                params.append('profile.image', '');
                params.append('profile.summary', profileData.notes || '');
                bodyData = params;
            }

            // Using PUT to update profile without specific ID (as ID endpoint gave 404)
            const updatedUserResponse = await updateProfile(bodyData);

            // Update local storage with the new user data
            if (user) {
                let newUserData = { ...user, ...updatedUserResponse };

                // FIX: Flatten nested profile fields if they exist (API mismatch handling)
                const responseAny = updatedUserResponse as any;
                // FIX: Force update with form data to ensure changes persist even if API response is partial
                newUserData.name = profileData.name;
                newUserData.email = profileData.email;
                newUserData.username = profileData.username;
                newUserData.phone_number = profileData.phoneNumber;
                newUserData.gender = profileData.gender; // Directly set from form
                newUserData.birthdate = profileData.dob; // Directly set from form

                // If backend returns 'image' but not 'image_url', clear the stale 'image_url'
                if ('image' in updatedUserResponse && !('image_url' in updatedUserResponse)) {
                    newUserData.image_url = null;
                }

                localStorage.setItem('user', JSON.stringify(newUserData));
            }

            // Reload page to reflect changes (App.tsx will read new localStorage)
            window.location.reload();

        } catch (err) {
            console.error("Failed to update profile:", err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(t('profilePage.updateError'));
            }
        } finally {
            setLoading(false);
        }
    };

    // ... (getImageUrl)
    const getImageUrl = (url: string | null | undefined) => {
        if (!url) return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect width='150' height='150' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='48' fill='%2394a3b8'%3E%3F%3C/text%3E%3C/svg%3E";

        if (url.startsWith('http')) return url;

        // Remove leading slash from path and trailing slash from base to ensure exactly one slash
        const cleanBase = API_BASE_URL.replace(/\/+$/, '');
        const cleanUrl = url.replace(/^\/+/, '');

        return `${cleanBase}/${cleanUrl}`;
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
                    title={t('profilePage.planA')}
                    subtitle={t('profilePage.plan')}
                    icon={HeartIcon}
                    iconBgColor="bg-purple-500"
                />
                <ProfileStatCard
                    title={t('profilePage.dummySubscriptionDate' as any)}
                    subtitle={t('profilePage.subscriptionDate')}
                    icon={ArrowRightCircleIcon}
                    iconBgColor="bg-cyan-500"
                />
                <ProfileStatCard
                    title={t('profilePage.dummySubscriptionEndDate' as any)}
                    subtitle={t('profilePage.subscriptionEndDate')}
                    icon={ArrowLeftCircleIcon}
                    iconBgColor="bg-red-500"
                />
                <ProfileStatCard
                    title={t('profilePage.dummyBalance' as any)}
                    subtitle={t('profilePage.messageBalance')}
                    icon={DesktopComputerIcon}
                    iconBgColor="bg-slate-700"
                />
            </div>

            {/* User Info Form */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                <div className={`p-4 border-b dark:border-slate-700`}>
                    <h3 className={`text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2`}>
                        <InformationCircleIcon className="w-6 h-6 text-slate-500" />
                        <span>{t('profilePage.accountInfo')}</span>
                    </h3>
                </div>
                {error && (
                    <div className="mx-6 mt-6 bg-red-100 dark:bg-red-900/50 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">{t('common.error')}: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                <form className="p-6 space-y-6" onSubmit={handleSave}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className={labelAlignClass}>{t('profilePage.name')}</label>
                            <input type="text" id="name" name="name" value={profileData.name} onChange={handleInputChange} className={`${inputBaseClass} ${textAlignClass}`} />
                        </div>

                        {/* Gender */}
                        <div>
                            <label htmlFor="gender" className={labelAlignClass}>{t('profilePage.gender')}</label>
                            <select id="gender" name="gender" value={profileData.gender} onChange={handleInputChange} className={`${inputBaseClass} ${textAlignClass}`}>
                                <option value="">{t('profilePage.selectGender' as any)}</option>
                                <option value="male">{t('profilePage.male')}</option>
                                <option value="female">{t('profilePage.female')}</option>
                            </select>
                        </div>

                        {/* Photo */}
                        <div className="relative">
                            <img
                                src={previewUrl || `${getImageUrl(user?.image_url || user?.image)}?t=${mountTime}`}
                                alt="Profile"
                                loading="lazy"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect width='150' height='150' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='48' fill='%2394a3b8'%3E%3F%3C/text%3E%3C/svg%3E";
                                }}
                                className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-lg"
                            />
                            <label htmlFor="photo" className={labelAlignClass}>{t('profilePage.photo')}</label>
                            <input type="file" id="photo" onChange={handleFileChange} className={fileInputClass} accept="image/*" />
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label htmlFor="dob" className={labelAlignClass}>{t('profilePage.dob')}</label>
                            <DatePicker value={profileData.dob} onChange={handleDateChange} />
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label htmlFor="notes" className={labelAlignClass}>{t('profilePage.notes')}</label>
                        <textarea id="notes" name="notes" rows={4} placeholder={t('profilePage.notesPlaceholder')} value={profileData.notes} onChange={handleInputChange} className={`${inputBaseClass} ${textAlignClass}`}></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Username */}
                        <div>
                            <label htmlFor="username" className={labelAlignClass}>{t('profilePage.username')}</label>
                            <input type="text" id="username" name="username" value={profileData.username} onChange={handleInputChange} className={`${inputBaseClass} ${textAlignClass}`} />
                        </div>

                        {/* Mobile Number */}
                        <div>
                            <label htmlFor="phoneNumber" className={labelAlignClass}>{t('profilePage.mobileNumber')}</label>
                            <PhoneNumberInput value={profileData.phoneNumber} onChange={handlePhoneChange} />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className={labelAlignClass}>{t('profilePage.email')}</label>
                            <input type="email" id="email" name="email" value={profileData.email} onChange={handleInputChange} className={`${inputBaseClass} ${textAlignClass}`} />
                        </div>

                        {/* User Role */}
                        <div>
                            <label htmlFor="role" className={labelAlignClass}>{t('profilePage.userRole')}</label>
                            <input type="text" id="role" name="role" value={user?.role_name || t('profilePage.hotel')} className={`w-full px-4 py-2 bg-slate-200 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-md text-gray-500 dark:text-slate-400 ${textAlignClass}`} readOnly />
                        </div>
                    </div>

                    <div className={`flex ${language === 'ar' ? 'justify-start' : 'justify-start'} pt-4`}>
                        <button type="submit" disabled={loading} className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50">
                            <CheckCircleIcon className="w-5 h-5" />
                            <span>{loading ? t('common.saving') : t('profilePage.save')}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserProfilePage;