import React, { useContext } from 'react';
import { IconProps } from './icons/Icon';
import { LanguageContext } from '../contexts/LanguageContext';

interface ProfileStatCardProps {
    title: string;
    subtitle: string;
    icon: React.ComponentType<IconProps>;
    iconBgColor: string;
}

const ProfileStatCard: React.FC<ProfileStatCardProps> = ({ title, subtitle, icon: Icon, iconBgColor }) => {
    const { language } = useContext(LanguageContext);
    
    return (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm flex items-center justify-between">
            <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                <p className="text-xl font-bold text-slate-800 dark:text-slate-200">{title}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{subtitle}</p>
            </div>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${iconBgColor}`}>
                <Icon className="w-7 h-7 text-white" />
            </div>
        </div>
    );
};

export default ProfileStatCard;
