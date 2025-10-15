import React, { useState } from 'react';
import ProfileStatCard from './ProfileStatCard';
import InformationCircleIcon from './icons-redesign/InformationCircleIcon';
import DatePicker from './DatePicker';
import PhoneNumberInput from './PhoneNumberInput'; // Import the new component

// Icons for stat cards
import HeartIcon from './icons-redesign/HeartIcon';
import ArrowRightCircleIcon from './icons-redesign/ArrowRightCircleIcon';
import ArrowLeftCircleIcon from './icons-redesign/ArrowLeftCircleIcon';
import DesktopComputerIcon from './icons-redesign/DesktopComputerIcon';
import CheckCircleIcon from './icons-redesign/CheckCircleIcon';


const UserProfilePage: React.FC = () => {
    const [profileData, setProfileData] = useState({
        name: 'وليد',
        gender: 'ذكر',
        dob: '2000-02-29',
        notes: '',
        username: 'Demoan',
        phoneNumber: '+966567434321',
        email: 'a@yahoo.com',
    });

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

    return (
        <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <ProfileStatCard
                    title="الخطة A"
                    subtitle="الخطة"
                    icon={HeartIcon}
                    iconBgColor="bg-purple-500"
                />
                <ProfileStatCard
                    title="09 ديسمبر 2024"
                    subtitle="تاريخ الاشتراك"
                    icon={ArrowRightCircleIcon}
                    iconBgColor="bg-cyan-500"
                />
                <ProfileStatCard
                    title="09 ديسمبر 2025"
                    subtitle="تاريخ إنتهاء الاشتراك"
                    icon={ArrowLeftCircleIcon}
                    iconBgColor="bg-red-500"
                />
                <ProfileStatCard
                    title="131"
                    subtitle="رصيد الرسائل"
                    icon={DesktopComputerIcon}
                    iconBgColor="bg-slate-700"
                />
            </div>

            {/* User Info Form */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                <div className="p-4 border-b dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <InformationCircleIcon className="w-6 h-6 text-slate-500" />
                        <span>معلومات الحساب</span>
                    </h3>
                </div>
                <form className="p-6 space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-right">الاسم</label>
                            <input type="text" id="name" name="name" value={profileData.name} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right text-gray-900 dark:text-slate-200" />
                        </div>

                        {/* Gender */}
                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-right">الجنس</label>
                            <select id="gender" name="gender" value={profileData.gender} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right text-gray-900 dark:text-slate-200">
                                <option>الجنس</option>
                                <option>ذكر</option>
                                <option>أنثى</option>
                            </select>
                        </div>
                        
                        {/* Date of Birth */}
                        <div>
                            <label htmlFor="dob" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-right">تاريخ الميلاد</label>
                            <DatePicker value={profileData.dob} onChange={handleDateChange} />
                        </div>

                        {/* Photo */}
                        <div>
                             <label htmlFor="photo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-right">الصورة</label>
                             <input type="file" id="photo" className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:ml-2 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-500/10 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-500/20 cursor-pointer"/>
                        </div>
                    </div>
                    
                    {/* Notes */}
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-right">الملاحظات</label>
                        <textarea id="notes" name="notes" rows={4} placeholder="اكتب بعض الملاحظات ..." value={profileData.notes} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right text-gray-900 dark:text-slate-200"></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                         {/* Username */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-right">اسم المستخدم</label>
                            <input type="text" id="username" name="username" value={profileData.username} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right text-gray-900 dark:text-slate-200" />
                        </div>

                         {/* Mobile Number */}
                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-right">رقم الجوال</label>
                            <PhoneNumberInput value={profileData.phoneNumber} onChange={handlePhoneChange} />
                        </div>

                         {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-right">عنوان البريد الإلكتروني</label>
                            <input type="email" id="email" name="email" value={profileData.email} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right text-gray-900 dark:text-slate-200" />
                        </div>
                        
                         {/* User Role */}
                         <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-right">دور المستخدم</label>
                            <input type="text" id="role" name="role" defaultValue="الفندق" className="w-full px-4 py-2 bg-slate-200 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-md text-right text-gray-500 dark:text-slate-400" readOnly />
                        </div>
                    </div>
                    
                    <div className="flex justify-start pt-4">
                        <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
                            <CheckCircleIcon className="w-5 h-5" />
                            <span>حفظ</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserProfilePage;