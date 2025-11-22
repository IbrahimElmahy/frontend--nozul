
import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { HotelUser } from '../types';
import XMarkIcon from './icons-redesign/XMarkIcon';
import CheckIcon from './icons-redesign/CheckIcon';
import { translations } from '../translations';

interface UserDetailsModalProps {
    user: HotelUser | null;
    onClose: () => void;
}

const DetailItem: React.FC<{ label: string; value?: React.ReactNode; className?: string }> = ({ label, value, className }) => (
    <div className={className}>
        <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</dt>
        <dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-200">{value ?? '---'}</dd>
    </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode; gridCols?: string }> = ({ title, children, gridCols = 'md:grid-cols-3' }) => (
    <div className="py-4 border-b dark:border-slate-700 last:border-b-0">
        <h3 className="text-base font-semibold text-blue-600 dark:text-blue-400 mb-3">{title}</h3>
        <dl className={`grid grid-cols-2 ${gridCols} gap-x-4 gap-y-4`}>
            {children}
        </dl>
    </div>
);


const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ user, onClose }) => {
    const { t } = useContext(LanguageContext);
    
    if (!user) return null;

    const isOpen = !!user;
    const formatDate = (dateString: string | null | undefined) => dateString ? new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : '---';
    const formatDateTime = (dateString: string | null) => dateString ? new Date(dateString).toLocaleString() : '---';

    const permissionKeys = Object.keys(translations.ar.addUserPanel.permissionsList) as (keyof typeof translations.ar.addUserPanel.permissionsList)[];

    return (
        <div
            className={`fixed inset-0 z-50 flex items-start justify-center p-4 transition-opacity duration-300 overflow-y-auto ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            role="dialog" aria-modal="true"
        >
            <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden="true"></div>

            <div className={`relative w-full max-w-5xl my-8 bg-white dark:bg-slate-800 rounded-lg shadow-2xl flex flex-col transform transition-all duration-300 max-h-[90vh] ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <header className="flex items-center justify-between p-4 border-b dark:border-slate-700 flex-shrink-0 sticky top-0 bg-white dark:bg-slate-800 rounded-t-lg z-10">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                        {t('userDetailsModal.title')} - {user.name}
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Close panel">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </header>

                <div className="flex-grow p-6 overflow-y-auto">
                    <Section title={t('addUserPanel.supervisorInfo')}>
                        <DetailItem label={t('addUserPanel.name')} value={user.name} />
                        <DetailItem label={t('addUserPanel.gender')} value={user.profile?.gender_display || user.profile?.gender || '-'} />
                        <DetailItem label={t('addUserPanel.dob')} value={formatDate(user.profile?.birthdate)} />
                    </Section>

                    <Section title={t('addUserPanel.loginInfo')}>
                        <DetailItem label={t('addUserPanel.username')} value={user.username} />
                        <DetailItem label={t('addUserPanel.email')} value={user.email} />
                        <DetailItem label={t('addUserPanel.mobile')} value={<span dir="ltr">{user.phone_number}</span>} />
                        <DetailItem label={t('usersPage.th_role')} value={user.role_display} />
                        <DetailItem label={t('addUserPanel.isHotelManager')} value={user.isManager ? t('settings.enable') : t('settings.disable')} />
                         <DetailItem label={t('usersPage.th_status')} value={
                             <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${user.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                {t(`usersPage.status_${user.is_active ? 'active' : 'inactive'}`)}
                            </span>
                         } />
                    </Section>

                    <Section title={t('userDetailsModal.activity')}>
                        <DetailItem label={t('usersPage.th_createdAt')} value={formatDateTime(user.created_at)} />
                        <DetailItem label={t('usersPage.th_lastLogin')} value={formatDateTime(user.last_login)} />
                         <DetailItem label={t('usersPage.th_updatedAt')} value={formatDateTime(user.updated_at)} />
                    </Section>

                    {user.notes && (
                         <div className="py-4 border-b dark:border-slate-700 last:border-b-0">
                            <h3 className="text-base font-semibold text-blue-600 dark:text-blue-400 mb-3">{t('addUserPanel.notes')}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{user.notes}</p>
                        </div>
                    )}
                    
                    <div className="py-4">
                        <h3 className="text-base font-semibold text-blue-600 dark:text-blue-400 mb-3">{t('addUserPanel.permissions')}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2">
                            {permissionKeys.map(key => (
                                <div key={key} className="flex items-center gap-2 text-sm">
                                    {(user.permissions && user.permissions[key]) ? 
                                        <CheckIcon className="w-4 h-4 text-green-500" /> :
                                        <XMarkIcon className="w-4 h-4 text-red-500" />
                                    }
                                    <span className="text-slate-700 dark:text-slate-300">{t(`addUserPanel.permissionsList.${key}` as any)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default UserDetailsModal;
