import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Tax } from '../types';
import XMarkIcon from './icons-redesign/XMarkIcon';

interface TaxDetailsModalProps {
    tax: Tax | null;
    onClose: () => void;
}

const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
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

const TaxDetailsModal: React.FC<TaxDetailsModalProps> = ({ tax, onClose }) => {
    const { t } = useContext(LanguageContext);
    
    if (!tax) return null;

    const isOpen = !!tax;
    const formatDate = (dateString: string) => new Date(dateString).toLocaleString();

    return (
        <div className={`fixed inset-0 z-50 flex items-start justify-center p-4 transition-opacity duration-300 overflow-y-auto ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} role="dialog">
            <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden="true"></div>
            <div className={`relative w-full max-w-4xl my-8 bg-white dark:bg-slate-800 rounded-lg shadow-2xl flex flex-col transform transition-all duration-300 max-h-[90vh] ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <header className="flex items-center justify-between p-4 border-b dark:border-slate-700 flex-shrink-0 sticky top-0 bg-white dark:bg-slate-800 rounded-t-lg z-10">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">{t('taxes.detailsTitle')} - {tax.name}</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"><XMarkIcon className="w-6 h-6" /></button>
                </header>
                <div className="flex-grow p-6 overflow-y-auto">
                    <Section title={t('taxes.taxInfo')}>
                        <DetailItem label={t('taxes.th_name')} value={tax.name} />
                        <DetailItem label={t('taxes.th_tax')} value={`${tax.tax.toFixed(1)}%`} />
                        <DetailItem label={t('taxes.th_applyTo')} value={tax.applyTo} />
                        <DetailItem label={t('taxes.th_startDate')} value={formatDate(tax.startDate)} />
                        <DetailItem label={t('taxes.th_endDate')} value={formatDate(tax.endDate)} />
                         <DetailItem label={t('taxes.th_status')} value={
                             <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${tax.status === 'مفعل' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                {tax.status}
                            </span>
                         } />
                    </Section>
                    <Section title={t('taxes.additionalInfo')}>
                        <DetailItem label={t('taxes.th_addedToFees')} value={tax.addedToFees ? t('settings.enable') : t('settings.disable')} />
                        <DetailItem label={t('taxes.th_subjectToVat')} value={tax.subjectToVat ? t('settings.enable') : t('settings.disable')} />
                    </Section>
                    <Section title={t('bookings.details.timestamps')}>
                        <DetailItem label={t('taxes.th_createdAt')} value={formatDate(tax.createdAt)} />
                        <DetailItem label={t('taxes.th_updatedAt')} value={formatDate(tax.updatedAt)} />
                    </Section>
                </div>
            </div>
        </div>
    );
};

export default TaxDetailsModal;