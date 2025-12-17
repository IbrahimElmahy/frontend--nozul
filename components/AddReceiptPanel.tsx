
import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Receipt, User } from '../types';
import XMarkIcon from './icons-redesign/XMarkIcon';
import CheckCircleIcon from './icons-redesign/CheckCircleIcon';
import InformationCircleIcon from './icons-redesign/InformationCircleIcon';
import DatePicker from './DatePicker';
import SearchableSelect from './SearchableSelect';
import { apiClient } from '../apiClient';

type VoucherType = 'receipt' | 'payment';

interface AddReceiptPanelProps {
    initialData: Omit<Receipt, 'id' | 'createdAt' | 'updatedAt'>;
    isEditing: boolean;
    isOpen: boolean;
    onClose: () => void;
    onSave: (receipt: Omit<Receipt, 'id' | 'createdAt' | 'updatedAt'>) => void;
    user: User | null;
    voucherType: VoucherType;
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

interface Option { value: string; label: string; }

const AddReceiptPanel: React.FC<AddReceiptPanelProps> = ({ initialData, isEditing, isOpen, onClose, onSave, voucherType, user }) => {
    const { t, language } = useContext(LanguageContext);
    const [formData, setFormData] = useState(initialData);

    // Account Selections
    const [selectedPaymentFrom, setSelectedPaymentFrom] = useState<string>('');
    const [selectedPaymentTo, setSelectedPaymentTo] = useState<string>('');
    const [selectedCurrency, setSelectedCurrency] = useState<string>('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');

    // Fetched Data
    const [currencies, setCurrencies] = useState<Option[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<Option[]>([]);
    const [fundsAndBanks, setFundsAndBanks] = useState<Option[]>([]);
    const [expenses, setExpenses] = useState<Option[]>([]);
    const [customers, setCustomers] = useState<Option[]>([]);
    const [loadingData, setLoadingData] = useState(false);

    const isPaymentView = voucherType === 'payment';

    useEffect(() => {
        const fetchDependencies = async () => {
            setLoadingData(true);
            try {
                const [currRes, pmRes, fundsRes, banksRes, expRes, custRes] = await Promise.all([
                    apiClient<{ data: any[] }>('/ar/currency/api/currencies/'),
                    apiClient<{ data: any[] }>('/ar/payment/api/payments-methods/'),
                    apiClient<{ data: any[] }>('/ar/cash/api/cash/'),
                    apiClient<{ data: any[] }>('/ar/bank/api/banks/'),
                    apiClient<{ data: any[] }>('/ar/expense/api/expenses/'),
                    apiClient<{ data: any[] }>('/ar/guest/api/guests/?category=customer'),
                ]);

                const mapOption = (item: any) => ({ value: item.account || item.id, label: language === 'ar' ? (item.name_ar || item.name) : (item.name_en || item.name) });
                const mapGuestOption = (item: any) => ({ value: item.account, label: item.name }); // Guest uses 'account' field for transaction leg

                setCurrencies(currRes.data.map(c => ({ value: c.id, label: language === 'ar' ? c.name_ar : c.name_en })));
                setPaymentMethods(pmRes.data.map(mapOption));

                const combinedFundsBanks = [
                    ...fundsRes.data.map(f => ({ value: f.account, label: `${t('receipts.addReceiptPanel.funds')} - ${language === 'ar' ? f.name_ar : f.name_en}` })),
                    ...banksRes.data.map(b => ({ value: b.account, label: `${t('receipts.addReceiptPanel.banks')} - ${language === 'ar' ? b.name_ar : b.name_en}` }))
                ].filter(o => o.value); // Filter out items without account IDs

                setFundsAndBanks(combinedFundsBanks);
                setExpenses(expRes.data.filter(e => e.account).map(e => ({ value: e.account, label: language === 'ar' ? e.name_ar : e.name_en })));
                setCustomers(custRes.data.filter(c => c.account).map(mapGuestOption));

                // Set default currency if available
                if (currRes.data.length > 0 && !formData.currency) {
                    const defaultCurr = currRes.data[0].id;
                    setFormData(prev => ({ ...prev, currency: defaultCurr }));
                    setSelectedCurrency(defaultCurr);
                }

            } catch (error) {
                console.error("Error fetching dependencies:", error);
            } finally {
                setLoadingData(false);
            }
        };

        if (isOpen) {
            fetchDependencies();
            setFormData(JSON.parse(JSON.stringify(initialData)));
            // Reset selections
            setSelectedPaymentFrom('');
            setSelectedPaymentTo('');
            setSelectedCurrency(initialData.currency || '');
            setSelectedPaymentMethod('');
        }
    }, [isOpen, initialData, language, t]);

    // Determine Dropdown Options based on Voucher Type
    // Receipt (Money In): From Customer -> To Fund/Bank
    // Payment (Money Out): From Fund/Bank -> To Expense
    const fromOptions = isPaymentView ? fundsAndBanks : customers;
    const toOptions = isPaymentView ? expenses : fundsAndBanks;

    const handleSaveClick = async () => {
        // Validation
        if (!formData.value || !selectedCurrency || !selectedPaymentMethod || !selectedPaymentFrom || !selectedPaymentTo) {
            alert("Please fill all required fields.");
            return;
        }

        try {
            const payload = new FormData();
            payload.append('type', isPaymentView ? 'payment' : 'receipt');
            payload.append('date', formData.date);
            // Ensure time is in HH:MM format
            payload.append('time', formData.time.length === 5 ? formData.time : formData.time.substring(0, 5));
            payload.append('currency', selectedCurrency);
            payload.append('amount', formData.value.toString());
            payload.append('payment_method', selectedPaymentMethod);
            payload.append('description', formData.description || '');

            if (isPaymentView) {
                payload.append('paid_to', 'expense'); // Fixed for expense payments
                // Payment: Credit Fund (Money leaving), Debit Expense
                payload.append('credit_legs[0]account', selectedPaymentFrom);
                payload.append('debit_legs[0]account', selectedPaymentTo);
            } else {
                payload.append('paid_from', 'customer'); // Fixed for receipt from customer
                // Receipt: Debit Fund (Money entering), Credit Customer
                payload.append('debit_legs[0]account', selectedPaymentTo);
                payload.append('credit_legs[0]account', selectedPaymentFrom);
            }

            let endpoint = '/ar/transaction/api/transactions/';
            let method: 'POST' | 'PUT' = 'POST';

            // Edit mode is complex because we are editing a transaction which implies journal entry changes.
            // For this simplified panel, we assume create mode mostly, or basic edit.
            // If editing, we need the transaction ID.
            if (isEditing && (initialData as any).id) {
                endpoint += `${(initialData as any).id}/`;
                method = 'PUT';
            }

            await apiClient(endpoint, { method, body: payload });
            onSave(formData);

        } catch (error) {
            alert(`Error saving transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const inputBaseClass = `w-full px-3 py-2 bg-white dark:bg-slate-900/50 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-slate-200 text-sm`;
    const readOnlyInputClass = `${inputBaseClass} bg-slate-100 dark:bg-slate-700 cursor-not-allowed`;

    const title = isEditing
        ? isPaymentView ? t('receipts.editPaymentVoucherTitle') : t('receipts.editReceiptTitle')
        : isPaymentView ? t('receipts.addPaymentVoucherPanel.title') : t('receipts.addReceiptPanel.title');

    const saveButtonText = isPaymentView ? t('receipts.addPaymentVoucherPanel.saveVoucher') : t('receipts.addReceiptPanel.saveReceipt');

    return (
        <div
            className={`fixed inset-0 z-50 flex items-start justify-end transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            role="dialog" aria-modal="true" aria-labelledby="add-receipt-title"
        >
            <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden="true"></div>
            <div className={`relative h-full bg-slate-50 dark:bg-slate-800 shadow-2xl flex flex-col w-full max-w-4xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <header className="flex items-center justify-between p-4 border-b dark:border-white/10 flex-shrink-0 sticky top-0 bg-white dark:bg-slate-900 z-10">
                    <h2 id="add-receipt-title" className="text-lg font-bold text-slate-800 dark:text-slate-200">{title}</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Close panel">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </header>

                <div className="flex-grow p-6 overflow-y-auto">
                    {loadingData ? (
                        <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div></div>
                    ) : (
                        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                            <section>
                                <SectionHeader title={isPaymentView ? t('receipts.addPaymentVoucherPanel.paymentVoucherInfo') : t('receipts.addReceiptPanel.receiptInfo')} />
                                <div className="space-y-4">
                                    <FormRow>
                                        <FormField label={t('receipts.addReceiptPanel.date')} className="lg:col-span-2">
                                            <div className="flex gap-2">
                                                <DatePicker value={formData.date} onChange={date => setFormData(p => ({ ...p, date }))} />
                                                <input type="time" value={formData.time} onChange={e => setFormData(p => ({ ...p, time: e.target.value }))} className={inputBaseClass} />
                                            </div>
                                        </FormField>
                                        <FormField label={t('receipts.addReceiptPanel.voucher')}><input type="text" value={isPaymentView ? t('receipts.paymentVouchers') : t('receipts.receiptVouchers')} className={readOnlyInputClass} readOnly /></FormField>
                                        <FormField label={t('receipts.addReceiptPanel.currency')}>
                                            <SearchableSelect
                                                id="currency"
                                                options={currencies.map(c => c.label)}
                                                value={currencies.find(c => c.value === selectedCurrency)?.label || ''}
                                                onChange={val => { const found = currencies.find(c => c.label === val); if (found) setSelectedCurrency(found.value); }}
                                            />
                                        </FormField>
                                    </FormRow>
                                    <FormRow>
                                        <FormField label={t('receipts.addReceiptPanel.value')}><input type="number" value={formData.value} onChange={e => setFormData(p => ({ ...p, value: parseFloat(e.target.value) || 0 }))} className={inputBaseClass} /></FormField>
                                        <FormField label={t('receipts.addReceiptPanel.accountant')}><input type="text" value={user?.name || ''} className={readOnlyInputClass} readOnly /></FormField>
                                        <FormField label={t('receipts.addReceiptPanel.paymentMethod')} className="lg:col-span-2">
                                            <SearchableSelect
                                                id="paymentMethod"
                                                options={paymentMethods.map(p => p.label)}
                                                value={paymentMethods.find(p => p.value === selectedPaymentMethod)?.label || ''}
                                                onChange={val => { const found = paymentMethods.find(p => p.label === val); if (found) setSelectedPaymentMethod(found.value); }}
                                            />
                                        </FormField>
                                    </FormRow>
                                </div>
                            </section>

                            <section>
                                <SectionHeader title={t('receipts.addReceiptPanel.financialAccountInfo')} />
                                <div className="space-y-4">
                                    <FormRow>
                                        <FormField label={t('receipts.addReceiptPanel.paymentFrom')} className="lg:col-span-2">
                                            <SearchableSelect
                                                id="paymentFrom"
                                                options={fromOptions.map(o => o.label)}
                                                value={fromOptions.find(o => o.value === selectedPaymentFrom)?.label || ''}
                                                onChange={val => { const found = fromOptions.find(o => o.label === val); if (found) setSelectedPaymentFrom(found.value); }}
                                                placeholder={isPaymentView ? "Select Fund/Bank" : "Select Customer"}
                                            />
                                        </FormField>
                                        <FormField label={t('receipts.addReceiptPanel.paymentTo')} className="lg:col-span-2">
                                            <SearchableSelect
                                                id="paymentTo"
                                                options={toOptions.map(o => o.label)}
                                                value={toOptions.find(o => o.value === selectedPaymentTo)?.label || ''}
                                                onChange={val => { const found = toOptions.find(o => o.label === val); if (found) setSelectedPaymentTo(found.value); }}
                                                placeholder={isPaymentView ? "Select Expense" : "Select Fund/Bank"}
                                            />
                                        </FormField>
                                    </FormRow>
                                    {/* Visual Confirmation of Accounting Legs (Read Only) */}
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-xs text-slate-600 dark:text-slate-300 grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="font-bold block">{t('receipts.addReceiptPanel.debitAccount')}:</span>
                                            {isPaymentView ? toOptions.find(o => o.value === selectedPaymentTo)?.label || '-' : toOptions.find(o => o.value === selectedPaymentTo)?.label || '-'}
                                        </div>
                                        <div>
                                            <span className="font-bold block">{t('receipts.addReceiptPanel.creditAccount')}:</span>
                                            {isPaymentView ? fromOptions.find(o => o.value === selectedPaymentFrom)?.label || '-' : fromOptions.find(o => o.value === selectedPaymentFrom)?.label || '-'}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <SectionHeader title={t('receipts.addReceiptPanel.description')} />
                                <textarea
                                    rows={4}
                                    value={formData.description || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder={t('receipts.addReceiptPanel.writeDescription')}
                                    className={inputBaseClass}
                                ></textarea>
                            </section>
                        </form>
                    )}
                </div>

                <footer className="flex items-center justify-start p-4 border-t dark:border-white/10 flex-shrink-0 gap-3 sticky bottom-0 bg-white dark:bg-slate-900">
                    <button onClick={handleSaveClick} className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
                        <CheckCircleIcon className="w-5 h-5" />
                        <span>{saveButtonText}</span>
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
