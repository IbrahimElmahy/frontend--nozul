import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Expense } from '../types';
import XMarkIcon from './icons-redesign/XMarkIcon';

interface ExpenseDetailsModalProps {
    expense: Expense | null;
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

const ExpenseDetailsModal: React.FC<ExpenseDetailsModalProps> = ({ expense, onClose }) => {
    const { t } = useContext(LanguageContext);
    
    if (!expense) return null;
    const isOpen = !!expense;
    const formatDate = (dateString: string) => new Date(dateString).toLocaleString();

    return (
        <div className={`fixed inset-0 z-50 flex items-start justify-center p-4 transition-opacity duration-300 overflow-y-auto ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} role="dialog">
            <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden="true"></div>
            <div className={`relative w-full max-w-4xl my-8 bg-white dark:bg-slate-800 rounded-lg shadow-2xl flex flex-col transform transition-all duration-300 max-h-[90vh] ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <header className="flex items-center justify-between p-4 border-b dark:border-slate-700 flex-shrink-0 sticky top-0 bg-white dark:bg-slate-800 rounded-t-lg z-10">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">{t('expensesPage.detailsTitle')} - {expense.name_ar}</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"><XMarkIcon className="w-6 h-6" /></button>
                </header>
                <div className="flex-grow p-6 overflow-y-auto">
                    <Section title={t('expensesPage.expenseInfo')}>
                        <DetailItem label={t('expensesPage.th_id')} value={`#${expense.id}`} />
                        <DetailItem label={t('expensesPage.th_name_ar')} value={expense.name_ar} />
                        <DetailItem label={t('expensesPage.th_name_en')} value={expense.name_en} />
                        <DetailItem label={t('expensesPage.th_status')} value={
                             <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${expense.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                {t(`expensesPage.status_${expense.status}`)}
                            </span>
                         } />
                    </Section>
                    <Section title={t('bookings.details.timestamps')}>
                        <DetailItem label={t('expensesPage.th_createdAt')} value={formatDate(expense.created_at)} />
                        <DetailItem label={t('expensesPage.th_updatedAt')} value={formatDate(expense.updated_at)} />
                    </Section>
                </div>
            </div>
        </div>
    );
};

export default ExpenseDetailsModal;