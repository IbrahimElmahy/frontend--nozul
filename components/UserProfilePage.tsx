import React, { useState, useContext, useEffect } from 'react';
import { updateProfile, getProfile } from '../services/users';
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

const UserProfilePage: React.FC<UserProfilePageProps> = ({ user: initialUser }) => {
    const { t, language } = useContext(LanguageContext);

    // Internal state for the user to ensure we display the absolute latest data
    const [currentUser, setCurrentUser] = useState<User | null>(initialUser);

    const [profileData, setProfileData] = useState({
        name: '',
        gender: 'ذكر',
        dob: '2000-02-29',
        notes: '',
        username: '',
        phoneNumber: '',
        email: '',
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Force refresh timestamp
    const [imageRefreshKey, setImageRefreshKey] = useState(new Date().getTime());

    // Effect to fetch fresh user data on mount
    useEffect(() => {
        const fetchLatestProfile = async () => {
            // If we have an initial user, sync state first
            if (initialUser) {
                setCurrentUser(initialUser);
            }
            try {
                const freshProfile = await getProfile();
                console.log("Mounted & Fetched Profile:", freshProfile);
                if (freshProfile) {
                    setCurrentUser(prev => {
                        if (!prev) return freshProfile;
                        return { ...prev, ...freshProfile };
                    });
                    // Also update local storage to keep App.tsx in sync eventually
                    const stored = localStorage.getItem('user');
                    if (stored) {
                        const merged = { ...JSON.parse(stored), ...freshProfile };
                        localStorage.setItem('user', JSON.stringify(merged));
                    }
                }
            } catch (err) {
                console.error("Failed to fetch fresh profile on mount", err);
            }
        };

        fetchLatestProfile();
    }, [initialUser]);

    useEffect(() => {
        if (currentUser) {
            setProfileData({
                name: currentUser.name || '',
                gender: 'ذكر',
                dob: '2000-02-29',
                notes: '',
                username: currentUser.username || '',
                phoneNumber: currentUser.phone_number || '',
                email: currentUser.email || '',
            });
        }
    }, [currentUser]);

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
        if (!currentUser) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', profileData.name);
            formData.append('email', profileData.email);
            formData.append('phone_number', profileData.phoneNumber);
            // Mapping 'dob' to 'profile[birthdate]' as per docs
            if (profileData.dob) {
                formData.append('profile[birthdate]', profileData.dob);
            }
            if (profileData.gender) {
                // Map localized gender to API values 'M'/'F'
                const genderMap: { [key: string]: string } = {
                    'ذكر': 'M',
                    'أنثى': 'F',
                    'Male': 'M',
                    'Female': 'F'
                };
                formData.append('profile[gender]', genderMap[profileData.gender] || profileData.gender);
            }

            if (selectedFile) {
                // Docs specify 'profile[image]', but we'll send 'image' too just in case
                formData.append('profile[image]', selectedFile);
                formData.append('image', selectedFile);
            }

            // 1. Send Update
            const updateResponse = await updateProfile(formData);
            console.log("Update Response:", updateResponse);

            // 2. Fetch Fresh Profile to confirm
            // This ensures we get exactly what the server has stored
            const freshUser = await getProfile();
            console.log("Fresh Profile after Save:", freshUser);

            if (currentUser && freshUser) {
                // Merge existing user data (tokens etc) with fresh profile data
                const newUserData = { ...currentUser, ...freshUser };

                // Ensure image_url is populated
                if (!newUserData.image_url && newUserData.image) {
                    newUserData.image_url = newUserData.image;
                }

                // If nested profile exists and has image, prioritize it
                // @ts-ignore
                if (freshUser.profile && freshUser.profile.image) {
                    // @ts-ignore
                    newUserData.image = freshUser.profile.image;
                    // @ts-ignore
                    newUserData.image_url = freshUser.profile.image;
                } else if (updateResponse && updateResponse.image) {
                    // @ts-ignore
                    newUserData.image = updateResponse.image;
                    // @ts-ignore
                    newUserData.image_url = updateResponse.image;
                }

                // Update local component state
                setCurrentUser(newUserData);

                // Update Refresh Key to force image re-render if URL is same
                setImageRefreshKey(new Date().getTime());

                localStorage.setItem('user', JSON.stringify(newUserData));
            }

            alert(t('common.saveSuccess', 'Saved successfully'));
            // Remove reload to check if instant update works cleanly now
            // window.location.reload(); 

        } catch (error) {
            console.error("Failed to update profile:", error);
            alert("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

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
                    title="09 ديسمبر 2024"
                    subtitle={t('profilePage.subscriptionDate')}
                    icon={ArrowRightCircleIcon}
                    iconBgColor="bg-cyan-500"
                />
                <ProfileStatCard
                    title="09 ديسمبر 2025"
                    subtitle={t('profilePage.subscriptionEndDate')}
                    icon={ArrowLeftCircleIcon}
                    iconBgColor="bg-red-500"
                />
                <ProfileStatCard
                    title="131"
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
                                <option>{t('profilePage.genderSelect')}</option>
                                <option>{t('profilePage.male')}</option>
                                <option>{t('profilePage.female')}</option>
                            </select>
                        </div>

                        {/* Photo */}
                        <div className="relative">
                            <label htmlFor="photo" className={labelAlignClass}>{t('profilePage.photo')}</label>
                            <img
                                src={previewUrl || `${getImageUrl(currentUser?.image_url || currentUser?.image)}?t=${imageRefreshKey}`}
                                alt="Profile"
                                loading="lazy"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect width='150' height='150' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='48' fill='%2394a3b8'%3E%3F%3C/text%3E%3C/svg%3E";
                                }}
                                className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-lg mb-4"
                            />
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
                            <input type="text" id="role" name="role" value={currentUser?.role_name || t('profilePage.hotel')} className={`w-full px-4 py-2 bg-slate-200 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-md text-gray-500 dark:text-slate-400 ${textAlignClass}`} readOnly />
                        </div>
                    </div>

                    <div className={`flex ${language === 'ar' ? 'justify-start' : 'justify-start'} pt-4`}>
                        <button type="submit" disabled={loading} className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50">
                            <CheckCircleIcon className="w-5 h-5" />
                            <span>{loading ? 'Saving...' : t('profilePage.save')}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserProfilePage;