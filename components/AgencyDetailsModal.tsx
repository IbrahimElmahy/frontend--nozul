import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { BookingAgency, AgencyStatus, AgencyType, AgencyIdType } from '../types';
import XMarkIcon from './icons-redesign/XMarkIcon';

interface AgencyDetailsModalProps {
    agency: BookingAgency | null;
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


const AgencyDetailsModal: React.FC<AgencyDetailsModalProps> = ({ agency, onClose }) => {
    const { t } = useContext(LanguageContext);
    
    if (!agency) return null;

    const isOpen = !!agency;
    const formatDate = (dateString: string | null | undefined) => dateString ? new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : '---';

    return (
        <div
            className={`fixed inset-0 z-50 flex items-start justify-center p-4 transition-opacity duration-300 overflow-y-auto ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="agency-details-title"
        >
            <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden="true"></div>

            <div className={`relative w-full max-w-4xl my-8 bg-white dark:bg-slate-800 rounded-lg shadow-2xl flex flex-col transform transition-all duration-300 max-h-[90vh] ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <header className="flex items-center justify-between p-4 border-b dark:border-slate-700 flex-shrink-0 sticky top-0 bg-white dark:bg-slate-800 rounded-t-lg z-10">
                    <h2 id="agency-details-title" className="text-lg font-bold text-slate-800 dark:text-slate-200">
                        {t('agencies.detailsTitle')} - {agency.name}
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Close panel">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </header>

                <div className="flex-grow p-6 overflow-y-auto">
                    <Section title={t('agencies.agencyInfo')}>
                        <DetailItem label={t('agencies.th_name')} value={agency.name} />
                        <DetailItem label={t('agencies.th_agencyType')} value={t(`agencies.agencyType_${agency.agencyType}` as any)} />
                        <DetailItem label={t('agencies.th_status')} value={t(`agencies.status_${agency.status}` as any)} />
                    </Section>

                    <Section title={t('agencies.contactInfo')}>
                        <DetailItem label={t('agencies.th_mobileNumber')} value={agency.mobileNumber} />
                        <DetailItem label={t('agencies.th_country')} value={agency.country} />
                    </Section>
                    
                    <Section title={t('agencies.idInfo')}>
                        <DetailItem label={t('agencies.th_idType')} value={t(`agencies.idType_${agency.idType}` as any)} />
                        <DetailItem label={t('agencies.th_idNumber')} value={agency.idNumber} />
                        <DetailItem label={t('agencies.th_issueDate')} value={formatDate(agency.issueDate)} />
                        <DetailItem label={t('agencies.th_expiryDate')} value={formatDate(agency.expiryDate)} />
                    </Section>
                    
                     {/* FIX: Changed translation key from 'units.timestamps' to 'bookings.details.timestamps' to match a valid TranslationKey. */}
                     <Section title={t('bookings.details.timestamps')}>
                        <DetailItem label={t('agencies.th_createdAt')} value={new Date(agency.createdAt).toLocaleString()} />
                        <DetailItem label={t('agencies.th_updatedAt')} value={new Date(agency.updatedAt).toLocaleString()} />
                    </Section>
                </div>
            </div>
        </div>
    );
};

export default AgencyDetailsModal;