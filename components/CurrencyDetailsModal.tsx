import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Currency } from '../types';
import XMarkIcon from './icons-redesign/XMarkIcon';

interface CurrencyDetailsModalProps {
    currency: Currency | null;
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

const CurrencyDetailsModal: React.FC<CurrencyDetailsModalProps> = ({ currency, onClose }) => {
    const { t } = useContext(LanguageContext);
    
    if (!currency) return null;
    const isOpen = !!currency;
    const formatDate = (dateString: string) => new Date(dateString).toLocaleString();

    return (
        <div className={`fixed inset-0 z-50 flex items-start justify-center p-4 transition-opacity duration-300 overflow-y-auto ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} role="dialog">
            <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden="true"></div>
            <div className={`relative w-full max-w-4xl my-8 bg-white dark:bg-slate-800 rounded-lg shadow-2xl flex flex-col transform transition-all duration-300 max-h-[90vh] ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <header className="flex items-center justify-between p-4 border-b dark:border-slate-700 flex-shrink-0 sticky top-0 bg-white dark:bg-slate-800 rounded-t-lg z-10">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">{t('currenciesPage.detailsTitle')} - {currency.name_ar}</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"><XMarkIcon className="w-6 h-6" /></button>
                </header>
                <div className="flex-grow p-6 overflow-y-auto">
                    <Section title={t('currenciesPage.currencyInfo')}>
                        <DetailItem label={t('currenciesPage.th_id')} value={`#${currency.id}`} />
                        <DetailItem label={t('currenciesPage.th_name_ar')} value={currency.name_ar} />
                        <DetailItem label={t('currenciesPage.th_name_en')} value={currency.name_en} />
                        <DetailItem label={t('currenciesPage.th_symbol_ar')} value={currency.symbol_ar} />
                        <DetailItem label={t('currenciesPage.th_symbol_en')} value={currency.symbol_en} />
                        <DetailItem label={t('currenciesPage.th_fraction_ar')} value={currency.fraction_ar} />
                        <DetailItem label={t('currenciesPage.th_fraction_en')} value={currency.fraction_en} />
                        <DetailItem label={t('currenciesPage.th_type')} value={<span className={`px-2 py-0.5 text-xs font-medium rounded-full ${currency.type === 'local' ? 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300' : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'}`}>{t(`currenciesPage.type_${currency.type}`)}</span>} />
                        <DetailItem label={t('currenciesPage.th_exchange')} value={currency.exchange_rate} />
                        <DetailItem label={t('currenciesPage.th_status')} value={
                             <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${currency.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                {t(`currenciesPage.status_${currency.status}`)}
                            </span>
                         } />
                    </Section>
                    <Section title={t('bookings.details.timestamps')}>
                        <DetailItem label={t('currenciesPage.th_createdAt')} value={formatDate(currency.createdAt)} />
                        <DetailItem label={t('currenciesPage.th_updatedAt')} value={formatDate(currency.updatedAt)} />
                    </Section>
                </div>
            </div>
        </div>
    );
};

export default CurrencyDetailsModal;