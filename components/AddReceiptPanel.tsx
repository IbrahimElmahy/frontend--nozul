import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Receipt } from '../types';
import XMarkIcon from './icons-redesign/XMarkIcon';
import CheckCircleIcon from './icons-redesign/CheckCircleIcon';
import InformationCircleIcon from './icons-redesign/InformationCircleIcon';
import DatePicker from './DatePicker';
import SearchableSelect from './SearchableSelect';

interface AddReceiptPanelProps {
    initialData: Omit<Receipt, 'id' | 'createdAt' | 'updatedAt'>;
    isEditing: boolean;
    isOpen: boolean;
    onClose: () => void;
    onSave: (receipt: Omit<Receipt, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const SectionHeader: React.FC<{ title: string; }> = ({ title }) => (
    <div className="bg-slate-100 dark:bg-slate-700/50 p-3 my-4 rounded-md flex items-center gap-3">
        <InformationCircleIcon className="w-5 h-5 text-slate-500" />
        <h3 className="text-md font-semibold text-slate-700 dark:text-slate-300">{title}</h3>
    </div>
);

const FormRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 items-end">
        {children}
    </div>
);

const FormField: React.FC<{ label: string; children: React.ReactNode, className?: string }> = ({ label, children, className = '' }) => {
    const { language } = useContext(LanguageContext);
    const labelClass = `block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ${language === 'ar' ? 'text-right' : 'text-left'}`;
    return (
        <div className={className}>
            <label className={labelClass}>{label}</label>
            {children}
        </div>
    );
};

const AddReceiptPanel: React.FC<AddReceiptPanelProps> = ({ initialData, isEditing, isOpen, onClose, onSave }) => {
    const { t } = useContext(LanguageContext);
    const [formData, setFormData] = useState(initialData);
    const [paymentFrom, setPaymentFrom] = useState('');
    const [paymentTo, setPaymentTo] = useState('');

    useEffect(() => {
        if (isOpen) {
            setFormData(JSON.parse(JSON.stringify(initialData)));
            setPaymentFrom(t('receipts.addReceiptPanel.clients'));
            setPaymentTo(t('receipts.addReceiptPanel.funds'));
        }
    }, [isOpen, initialData, t]);

    const handleSaveClick = () => {
        onSave(formData);
    };

    const inputBaseClass = `w-full px-3 py-2 bg-white dark:bg-slate-900/50 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-slate-200 text-sm`;
    const readOnlyInputClass = `${inputBaseClass} bg-slate-100 dark:bg-slate-700 cursor-not-allowed`;
    
    const paymentMethods = [
        t('receipts.paymentMethod_cash'),
        t('receipts.paymentMethod_creditCard'),
        t('receipts.paymentMethod_bankTransfer'),
        t('receipts.paymentMethod_paidByCompany'),
        t('receipts.paymentMethod_digitalPayment'),
        t('receipts.paymentMethod_travelAgents'),
        t('receipts.paymentMethod_electronicChannel'),
        t('receipts.paymentMethod_unspecified'),
    ];

    return (
        <div
            className={`fixed inset-0 z-50 flex items-start justify-end transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            role="dialog" aria-modal="true" aria-labelledby="add-receipt-title"
        >
            <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden="true"></div>
            <div className={`relative h-full bg-slate-50 dark:bg-slate-800 shadow-2xl flex flex-col w-full max-w-4xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <header className="flex items-center justify-between p-4 border-b dark:border-slate-700 flex-shrink-0 sticky top-0 bg-white dark:bg-slate-900 z-10">
                    <h2 id="add-receipt-title" className="text-lg font-bold text-slate-800 dark:text-slate-200">{isEditing ? t('receipts.editReceiptTitle') : t('receipts.addReceiptPanel.title')}</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Close panel">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </header>

                <div className="flex-grow p-6 overflow-y-auto">
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                        {/* Section 1: Receipt Info */}
                        <section>
                            <SectionHeader title={t('receipts.addReceiptPanel.receiptInfo')} />
                            <div className="space-y-4">
                               <FormRow>
                                    <FormField label={t('receipts.addReceiptPanel.voucher')}><input type="text" value={t('receipts.addReceiptPanel.receiptVoucher')} className={readOnlyInputClass} readOnly /></FormField>
                                    <FormField label={t('receipts.addReceiptPanel.accountant')}><input type="text" value={t('receipts.addReceiptPanel.walid')} className={readOnlyInputClass} readOnly /></FormField>
                               </FormRow>
                                <FormRow>
                                    <FormField label={t('receipts.addReceiptPanel.date')} className="lg:col-span-2">
                                        <div className="flex gap-2">
                                            <DatePicker value={formData.date} onChange={date => setFormData(p => ({...p, date}))} />
                                            <input type="time" value={formData.time} onChange={e => setFormData(p => ({...p, time: e.target.value}))} className={inputBaseClass} />
                                        </div>
                                    </FormField>
                                    <FormField label={t('receipts.addReceiptPanel.paymentMethod')}><SearchableSelect id="paymentMethod" options={paymentMethods} value={formData.paymentMethod} onChange={val => setFormData(p => ({...p, paymentMethod: val}))} /></FormField>
                                </FormRow>
                                <FormRow>
                                    <FormField label={t('receipts.addReceiptPanel.currency')}><SearchableSelect id="currency" options={[t('receipts.currency_sar')]} value={t('receipts.currency_sar')} onChange={() => {}} /></FormField>
                                    <FormField label={t('receipts.addReceiptPanel.value')}><input type="number" value={formData.value} onChange={e => setFormData(p => ({...p, value: parseFloat(e.target.value) || 0}))} className={inputBaseClass} /></FormField>
                                </FormRow>
                            </div>
                        </section>

                        {/* Section 2: Account Info */}
                        <section>
                            <SectionHeader title={t('receipts.addReceiptPanel.financialAccountInfo')} />
                             <div className="space-y-4">
                                <FormRow>
                                    <FormField label={t('receipts.addReceiptPanel.paymentFrom')} className="lg:col-span-2">
                                      <SearchableSelect id="paymentFrom" options={[t('receipts.addReceiptPanel.clients')]} value={paymentFrom} onChange={setPaymentFrom} />
                                    </FormField>
                                    <FormField label={t('receipts.addReceiptPanel.paymentTo')} className="lg:col-span-2">
                                      <SearchableSelect id="paymentTo" options={[t('receipts.addReceiptPanel.funds'), t('receipts.addReceiptPanel.banks')]} value={paymentTo} onChange={setPaymentTo} />
                                    </FormField>
                                </FormRow>
                                <FormRow>
                                    <FormField label={t('receipts.addReceiptPanel.creditAccount')} className="lg:col-span-2"><SearchableSelect id="creditAccount" options={[]} value="" onChange={() => {}} /></FormField>
                                    <FormField label={t('receipts.addReceiptPanel.debitAccount')} className="lg:col-span-2"><SearchableSelect id="debitAccount" options={[]} value="" onChange={() => {}} /></FormField>
                                </FormRow>
                            </div>
                        </section>
                        
                        {/* Section 3: Description */}
                        <section>
                            <SectionHeader title={t('receipts.addReceiptPanel.description')} />
                            <textarea rows={4} placeholder={t('receipts.addReceiptPanel.writeDescription')} className={inputBaseClass}></textarea>
                        </section>
                    </form>
                </div>

                <footer className="flex items-center justify-start p-4 border-t dark:border-slate-700 flex-shrink-0 gap-3 sticky bottom-0 bg-white dark:bg-slate-900">
                    <button onClick={handleSaveClick} className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
                        <CheckCircleIcon className="w-5 h-5" />
                        <span>{t('receipts.addReceiptPanel.saveReceipt')}</span>
                    </button>
                     <button onClick={onClose} className="bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 font-semibold py-2 px-5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200">
                        {t('units.cancel')}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default AddReceiptPanel;