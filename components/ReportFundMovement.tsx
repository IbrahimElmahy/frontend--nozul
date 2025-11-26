
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { apiClient } from '../apiClient';
import { FundReportItem, ReportFilterOption } from '../types';
import MagnifyingGlassIcon from './icons-redesign/MagnifyingGlassIcon';
import PrinterIcon from './icons-redesign/PrinterIcon';
import ArrowDownTrayIcon from './icons-redesign/ArrowDownTrayIcon';
import DatePicker from './DatePicker';
import SearchableSelect from './SearchableSelect';

const ReportFundMovement: React.FC = () => {
    const { t, language } = useContext(LanguageContext);
    const [data, setData] = useState<FundReportItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState({ totalDebit: 0, totalCredit: 0, netBalance: 0 });

    // Filter Options State
    const [accountTypes, setAccountTypes] = useState<ReportFilterOption[]>([]);
    const [cashAccounts, setCashAccounts] = useState<ReportFilterOption[]>([]);
    const [currencies, setCurrencies] = useState<ReportFilterOption[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<ReportFilterOption[]>([]);
    const [users, setUsers] = useState<ReportFilterOption[]>([]);

    // Form State
    const [filters, setFilters] = useState({
        accountType: '',
        account: '', // Cash/Fund Account ID
        currency: '',
        paymentMethod: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        userId: '',
        reservationNumber: '',
    });

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [typesRes, cashRes, currRes, payRes, userRes] = await Promise.all([
                    apiClient<{ data: any[] }>('/ar/transaction/api/transactions/receipt-types/'),
                    apiClient<{ data: any[] }>('/ar/cash/api/cash/'),
                    apiClient<{ data: any[] }>('/ar/currency/api/currencies/'),
                    apiClient<{ data: any[] }>('/ar/payment/api/payments-methods/'),
                    apiClient<{ data: any[] }>('/ar/user/api/users/'),
                ]);

                // Helper to map name based on language
                const mapOptions = (list: any) => {
                    const arr = Array.isArray(list) ? list : Array.isArray(list?.data) ? list.data : [];
                    return arr.map(item => ({
                        id: item.id?.toString() || item.account?.toString(),
                        name: language === 'ar' ? (item.name_ar || item.name) : (item.name_en || item.name)
                    }));
                };

                setAccountTypes(mapOptions(typesRes.data));
                setCashAccounts(mapOptions(cashRes.data));
                setCurrencies(mapOptions(currRes.data));
                setPaymentMethods(mapOptions(payRes.data));
                setUsers(mapOptions(userRes.data));

            } catch (error) {
                console.error("Failed to fetch report options", error);
            }
        };
        fetchOptions();
    }, [language]);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.account) params.append('account', filters.account);
            if (filters.currency) params.append('currency', filters.currency);
            if (filters.startDate) params.append('start_date', filters.startDate);
            if (filters.endDate) params.append('end_date', filters.endDate);
            if (filters.userId) params.append('created_by', filters.userId);
            if (filters.reservationNumber) params.append('reservation', filters.reservationNumber);
            if (filters.paymentMethod) params.append('payment_method', filters.paymentMethod);
            if (filters.accountType) params.append('payment_type', filters.accountType);

            const response = await apiClient<any>('/ar/report/api/statement-account/?' + params.toString());
            
            // Map response to FundReportItem
            const raw = Array.isArray(response) ? response : Array.isArray(response?.data) ? response.data : Array.isArray(response?.results) ? response.results : [];
            const mappedData: FundReportItem[] = raw.map((item: any) => ({
                id: item.id,
                date: item.date,
                type: item.type_display || item.type, // e.g. Receipt, Payment
                number: item.number,
                description: item.description,
                debit: parseFloat(item.debit || 0),
                credit: parseFloat(item.credit || 0),
                balance: parseFloat(item.balance || 0),
                payment_method: item.payment_method_display || item.payment_method
            }));

            setData(mappedData);

            // Calculate Summary
            const totalDebit = mappedData.reduce((sum, item) => sum + item.debit, 0);
            const totalCredit = mappedData.reduce((sum, item) => sum + item.credit, 0);
            const netBalance = totalDebit - totalCredit; 

            setSummary({ totalDebit, totalCredit, netBalance });

        } catch (error) {
            console.error("Search failed", error);
            setData([]);
            setSummary({ totalDebit: 0, totalCredit: 0, netBalance: 0 });
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        const params = new URLSearchParams();
        if (filters.startDate) params.append('start_date', filters.startDate);
        if (filters.endDate) params.append('end_date', filters.endDate);
        if (filters.account) params.append('account', filters.account);
        // Add other filters...
        
        const url = `https://www.osusideas.online/ar/report/api/statement-account/export-excel-file/?${params.toString()}`;
        window.open(url, '_blank');
    };

    const handlePrint = () => {
        window.open('https://www.osusideas.online/ar/hpanel/reports/fund_movement/print/', '_blank', 'width=800,height=600');
    };

    const labelClass = `block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ${language === 'ar' ? 'text-right' : 'text-left'}`;
    const inputClass = `w-full px-3 py-2 bg-slate-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-200 text-sm`;

    return (
        <div className="space-y-6">
            {/* Filter Section */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm">
                <h3 className={`text-lg font-bold text-slate-700 dark:text-slate-200 mb-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>{t('receipts.searchInfo')}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className={labelClass}>{t('receipts.addReceiptPanel.voucher')}</label>
                        <SearchableSelect 
                            id="accountType" 
                            options={accountTypes.map(o => o.name)} 
                            value={accountTypes.find(o => o.id === filters.accountType)?.name || ''} 
                            onChange={val => { const f = accountTypes.find(o => o.name === val); if(f) setFilters(p => ({...p, accountType: f.id})) }} 
                            placeholder="Select Type"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>{t('receipts.addReceiptPanel.paymentTo')}</label>
                        <SearchableSelect 
                            id="account" 
                            options={cashAccounts.map(o => o.name)} 
                            value={cashAccounts.find(o => o.id === filters.account)?.name || ''} 
                            onChange={val => { const f = cashAccounts.find(o => o.name === val); if(f) setFilters(p => ({...p, account: f.id})) }} 
                            placeholder="Select Account"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>{t('receipts.addReceiptPanel.currency')}</label>
                        <SearchableSelect 
                            id="currency" 
                            options={currencies.map(o => o.name)} 
                            value={currencies.find(o => o.id === filters.currency)?.name || ''} 
                            onChange={val => { const f = currencies.find(o => o.name === val); if(f) setFilters(p => ({...p, currency: f.id})) }} 
                            placeholder="Select Currency"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>{t('receipts.addReceiptPanel.paymentMethod')}</label>
                        <SearchableSelect 
                            id="paymentMethod" 
                            options={paymentMethods.map(o => o.name)} 
                            value={paymentMethods.find(o => o.id === filters.paymentMethod)?.name || ''} 
                            onChange={val => { const f = paymentMethods.find(o => o.name === val); if(f) setFilters(p => ({...p, paymentMethod: f.id})) }} 
                            placeholder="Select Method"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>{t('bookings.from')}</label>
                        <DatePicker value={filters.startDate} onChange={d => setFilters(p => ({...p, startDate: d}))} />
                    </div>
                    <div>
                        <label className={labelClass}>{t('bookings.to')}</label>
                        <DatePicker value={filters.endDate} onChange={d => setFilters(p => ({...p, endDate: d}))} />
                    </div>
                    <div>
                        <label className={labelClass}>{t('receipts.addReceiptPanel.accountant')}</label>
                        <SearchableSelect 
                            id="user" 
                            options={users.map(o => o.name)} 
                            value={users.find(o => o.id === filters.userId)?.name || ''} 
                            onChange={val => { const f = users.find(o => o.name === val); if(f) setFilters(p => ({...p, userId: f.id})) }} 
                            placeholder="Select User"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>{t('bookings.bookingNumber')}</label>
                        <input 
                            type="text" 
                            value={filters.reservationNumber} 
                            onChange={e => setFilters(p => ({...p, reservationNumber: e.target.value}))} 
                            className={inputClass} 
                            placeholder="Reservation No."
                        />
                    </div>
                </div>

                <div className={`flex gap-3 ${language === 'ar' ? 'justify-end' : 'justify-end'}`}>
                    <button onClick={handleSearch} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                        <MagnifyingGlassIcon className="w-5 h-5" />
                        {t('phone.search')}
                    </button>
                    <button onClick={handlePrint} className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2">
                        <PrinterIcon className="w-5 h-5" />
                        {t('receipts.print')}
                    </button>
                    <button onClick={handleExport} className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-2">
                        <ArrowDownTrayIcon className="w-5 h-5" />
                        {t('units.export')}
                    </button>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-center text-slate-500 dark:text-slate-400 border-collapse">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-100 dark:bg-slate-700 dark:text-slate-300 border-b dark:border-slate-600">
                            <tr>
                                <th className="px-4 py-3 border-r dark:border-slate-600">#</th>
                                <th className="px-4 py-3 border-r dark:border-slate-600">{t('receipts.th_date')}</th>
                                <th className="px-4 py-3 border-r dark:border-slate-600">{t('receipts.addReceiptPanel.voucher')}</th>
                                <th className="px-4 py-3 border-r dark:border-slate-600">{t('receipts.th_transactionNumber')}</th>
                                <th className="px-4 py-3 border-r dark:border-slate-600">{t('receipts.addReceiptPanel.description')}</th>
                                <th className="px-4 py-3 border-r dark:border-slate-600">{t('receipts.addReceiptPanel.debitAccount')}</th>
                                <th className="px-4 py-3 border-r dark:border-slate-600">{t('receipts.addReceiptPanel.creditAccount')}</th>
                                <th className="px-4 py-3 border-r dark:border-slate-600">{t('bookings.balance')}</th>
                                <th className="px-4 py-3">{t('receipts.th_paymentMethod')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={9} className="py-8 text-center">Loading...</td></tr>
                            ) : data.length === 0 ? (
                                <tr><td colSpan={9} className="py-8 text-center">{t('orders.noData')}</td></tr>
                            ) : data.map((item, idx) => (
                                <tr key={item.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    <td className="px-4 py-2 border-r dark:border-slate-600">{idx + 1}</td>
                                    <td className="px-4 py-2 border-r dark:border-slate-600" dir="ltr">{item.date}</td>
                                    <td className="px-4 py-2 border-r dark:border-slate-600">{item.type}</td>
                                    <td className="px-4 py-2 border-r dark:border-slate-600">{item.number}</td>
                                    <td className="px-4 py-2 border-r dark:border-slate-600 max-w-xs truncate" title={item.description}>{item.description}</td>
                                    <td className="px-4 py-2 border-r dark:border-slate-600 font-mono">{item.debit.toFixed(2)}</td>
                                    <td className="px-4 py-2 border-r dark:border-slate-600 font-mono">{item.credit.toFixed(2)}</td>
                                    <td className="px-4 py-2 border-r dark:border-slate-600 font-bold">{item.balance.toFixed(2)}</td>
                                    <td className="px-4 py-2">{item.payment_method}</td>
                                </tr>
                            ))}
                        </tbody>
                                                {!loading && data.length > 0 && (
                            <tfoot className="bg-slate-50 dark:bg-slate-700 font-bold text-slate-800 dark:text-slate-200">
                                <tr>
                                    <td colSpan={5} className="px-4 py-3 text-end border-r dark:border-slate-600">Total debit</td>
                                    <td className="px-4 py-3 border-r dark:border-slate-600">{summary.totalDebit.toFixed(2)}</td>
                                    <td colSpan={3}></td>
                                </tr>
                                <tr>
                                    <td colSpan={5} className="px-4 py-3 text-end border-r dark:border-slate-600">Total credit</td>
                                    <td className="px-4 py-3 border-r dark:border-slate-600">{summary.totalCredit.toFixed(2)}</td>
                                    <td colSpan={3}></td>
                                </tr>
                                <tr className="bg-blue-50 dark:bg-blue-900/20">
                                    <td colSpan={5} className="px-4 py-3 text-end border-r dark:border-slate-600">Net balance</td>
                                    <td colSpan={3} className="px-4 py-3 text-center border-r dark:border-slate-600">{summary.netBalance.toFixed(2)}</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReportFundMovement;
