import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Guest, GuestStatus, GuestType, IdType } from '../types';
import XMarkIcon from './icons-redesign/XMarkIcon';

interface GuestDetailsModalProps {
    guest: Guest | null;
    onClose: () => void;
}

const DetailItem: React.FC<{ label: string; value: string | number | undefined | null }> = ({ label, value }) => (
    <div>
        <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</dt>
        <dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-200">{value ?? '---'}</dd>
    </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="py-4 border-b dark:border-slate-700 last:border-b-0">
        <h3 className="text-base font-semibold text-blue-600 dark:text-blue-400 mb-3">{title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-4">
            {children}
        </div>
    </div>
);


const GuestDetailsModal: React.FC<GuestDetailsModalProps> = ({ guest, onClose }) => {
    const { t } = useContext(LanguageContext);
    
    if (!guest) return null;

    const isOpen = !!guest;
    const formatDate = (dateString: string | null | undefined) => dateString ? new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : '---';

    return (
        <div
            className={`fixed inset-0 z-50 flex items-start justify-center p-4 transition-opacity duration-300 overflow-y-auto ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="guest-details-title"
        >
            <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden="true"></div>

            <div className={`relative w-full max-w-4xl my-8 bg-white dark:bg-slate-800 rounded-lg shadow-2xl flex flex-col transform transition-all duration-300 max-h-[90vh] ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <header className="flex items-center justify-between p-4 border-b dark:border-slate-700 flex-shrink-0 sticky top-0 bg-white dark:bg-slate-800 rounded-t-lg z-10">
                    <h2 id="guest-details-title" className="text-lg font-bold text-slate-800 dark:text-slate-200">
                        {t('guests.detailsTitle')} - {guest.name}
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Close panel">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </header>

                <div className="flex-grow p-6 overflow-y-auto">
                    <Section title={t('guests.personalInfo')}>
                        <DetailItem label={t('guests.th_name')} value={guest.name} />
                        <DetailItem label={t('guests.gender')} value={guest.gender ? t(`guests.${guest.gender}` as any) : '---'} />
                        <DetailItem label={t('guests.th_nationality')} value={guest.nationality} />
                        <DetailItem label={t('guests.dob')} value={formatDate(guest.dob)} />
                    </Section>

                    <Section title={t('guests.contactInfo')}>
                        <DetailItem label={t('guests.th_mobileNumber')} value={guest.mobileNumber} />
                        <DetailItem label={t('guests.workNumber')} value={guest.workNumber} />
                        <DetailItem label={t('guests.email')} value={guest.email} />
                        <DetailItem label={t('guests.workLocation')} value={guest.workLocation} />
                    </Section>

                     <Section title={t('guests.addressInfo')}>
                        <DetailItem label={t('guests.country')} value={guest.country} />
                        <DetailItem label={t('guests.city')} value={guest.city} />
                        <DetailItem label={t('guests.district')} value={guest.district} />
                        <DetailItem label={t('guests.street')} value={guest.street} />
                        <DetailItem label={t('guests.postalCode')} value={guest.postalCode} />
                    </Section>
                    
                    <Section title={t('guests.guestSystemInfo')}>
                         <DetailItem label={t('guests.th_guestType')} value={t(`guests.guestType_${guest.guestType}` as any)} />
                         <DetailItem label={t('guests.th_idType')} value={t(`guests.idType_${guest.idType}` as any)} />
                         <DetailItem label={t('guests.th_idNumber')} value={guest.idNumber} />
                         <DetailItem label={t('guests.serialNumber')} value={guest.serialNumber} />
                         <DetailItem label={t('guests.th_issueDate')} value={formatDate(guest.issueDate)} />
                         <DetailItem label={t('guests.issueLocation')} value={guest.issueLocation} />
                         <DetailItem label={t('guests.th_expiryDate')} value={formatDate(guest.expiryDate)} />
                         <DetailItem label={t('guests.th_status')} value={t(`guests.status_${guest.status}` as any)} />
                    </Section>

                    <div className="py-4 border-b dark:border-slate-700 last:border-b-0">
                      <h3 className="text-base font-semibold text-blue-600 dark:text-blue-400 mb-3">{t('guests.notes')}</h3>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{guest.notes || '---'}</p>
                    </div>

                     <Section title={t('units.timestamps')}>
                        <DetailItem label={t('guests.th_createdAt')} value={new Date(guest.createdAt).toLocaleString()} />
                        <DetailItem label={t('guests.th_updatedAt')} value={new Date(guest.updatedAt).toLocaleString()} />
                    </Section>
                </div>
            </div>
        </div>
    );
};

export default GuestDetailsModal;