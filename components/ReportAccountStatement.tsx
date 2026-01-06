import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { fetchAccountTree, fetchStatementAccount, exportStatementAccount } from '../services/reports';
import { listCurrencies, listUsers } from '../services/financials';
import { FundReportItem, ReportFilterOption } from '../types';
import MagnifyingGlassIcon from './icons-redesign/MagnifyingGlassIcon';
import PrinterIcon from './icons-redesign/PrinterIcon';
import ArrowDownTrayIcon from './icons-redesign/ArrowDownTrayIcon';
import DatePicker from './DatePicker';
import SearchableSelect from './SearchableSelect';
import ErrorModal from './ErrorModal';

interface AccountNode {
    id: string;
    name: string;
    name_ar?: string;
    name_en?: string;
    children?: AccountNode[];
    code?: string;
}

// Inline Modal for Print Preview
const PrintPreviewModal: React.FC<{ isOpen: boolean; onClose: () => void; url: string; t: any }> = ({ isOpen, onClose, url, t }) => {
    if (!isOpen) return null;

    const handlePrintFrame = () => {
        const iframe = document.getElementById('print-frame') as HTMLIFrameElement;
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.print();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden ring-1 ring-slate-900/5">
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t('reportsPage.labels.printPreview')}</h3>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrintFrame}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium"
                        >
                            <PrinterIcon className="w-4 h-4" />
                            {t('receipts.print')}
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                        >
                            {t('common.close')}
                        </button>
                    </div>
                </div>
                <div className="flex-1 bg-slate-200/50 dark:bg-slate-900/50 p-6 overflow-hidden relative flex justify-center">
                    <iframe
                        id="print-frame"
                        src={url}
                        className="w-full h-full max-w-[210mm] shadow-lg bg-white"
                        style={{ aspectRatio: '210/297' }}
                        title="Report Preview"
                    />
                </div>
            </div>
        </div>
    );
};

const ReportAccountStatement: React.FC = () => {
    // ... existing setup ...
    const { t, language } = useContext(LanguageContext);
    const [data, setData] = useState<FundReportItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [summary, setSummary] = useState({ totalDebit: 0, totalCredit: 0, netBalance: 0 });
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [printUrl, setPrintUrl] = useState('');

    // ... (rest of state) ...
    // Filter Options State
    const [accountTree, setAccountTree] = useState<ReportFilterOption[]>([]);
    const [currencies, setCurrencies] = useState<ReportFilterOption[]>([]);
    const [users, setUsers] = useState<ReportFilterOption[]>([]);

    // Form State
    const [filters, setFilters] = useState({
        account: '', // Account ID from Tree
        currency: '',
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        userId: '',
        reservationNumber: '',
    });

    // ... hooks ...

    const handlePrint = async () => {
        if (!filters.account || !filters.currency) return;

        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filters.account) params.append('account', filters.account);
            if (filters.currency) params.append('currency', filters.currency);
            if (filters.startDate) params.append('start_date', filters.startDate);
            if (filters.endDate) params.append('end_date', filters.endDate);
            if (filters.userId) params.append('created_by', filters.userId);
            if (filters.reservationNumber) params.append('reservation', filters.reservationNumber);
            params.append('is_export', 'true');

            const response = await fetchStatementAccount(Object.fromEntries(params));

            const rawResponse: any = response;
            const responseData: any = rawResponse.data && rawResponse.data.legs ? rawResponse.data : rawResponse;
            const legs = responseData.legs || [];
            const summaryData = {
                debit: responseData.debit || 0,
                credit: responseData.credit || 0,
                balance: responseData.balance || 0
            };

            const printContent = `
                <!DOCTYPE html>
                <html dir="${language === 'ar' ? 'rtl' : 'ltr'}">
                <head>
                    <meta charset="UTF-8">
                    <title>${t('receipts.searchInfo')}</title>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; color: #1e293b; }
                        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
                        .header h1 { margin: 0; color: #0f172a; font-size: 24px; }
                        .meta { margin-top: 10px; font-size: 14px; color: #64748b; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
                        th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: ${language === 'ar' ? 'right' : 'left'}; }
                        th { background-color: #f8fafc; font-weight: 600; color: #475569; }
                        tr:nth-child(even) { background-color: #f8fafc; }
                        .amount { font-family: 'Courier New', monospace; font-weight: 600; }
                        .footer { margin-top: 30px; border-top: 2px solid #e2e8f0; padding-top: 20px; }
                        .summary-grid { display: flex; justify-content: flex-end; gap: 40px; }
                        .summary-item { text-align: center; }
                        .summary-label { display: block; font-size: 12px; color: #64748b; margin-bottom: 4px; }
                        .summary-value { font-size: 16px; font-weight: bold; color: #0f172a; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>${t('receipts.searchInfo')} Report</h1>
                        <div class="meta">
                            ${t('reportsPage.labels.startDate')}: ${filters.startDate} | ${t('reportsPage.labels.endDate')}: ${filters.endDate}
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>${t('receipts.th_date')}</th>
                                <th>${t('receipts.addReceiptPanel.voucher')}</th>
                                <th>${t('receipts.th_transactionNumber')}</th>
                                <th>${t('receipts.addReceiptPanel.description')}</th>
                                <th>${t('receipts.addReceiptPanel.debitAccount')}</th>
                                <th>${t('receipts.addReceiptPanel.creditAccount')}</th>
                                <th>${t('bookings.balance')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${legs.map((item: any, index: number) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td dir="ltr">${item.date}</td>
                                    <td>${item.type}</td>
                                    <td>${item.number}</td>
                                    <td>${item.description}</td>
                                    <td class="amount">${parseFloat(item.debit || 0).toFixed(2)}</td>
                                    <td class="amount">${parseFloat(item.credit || 0).toFixed(2)}</td>
                                    <td class="amount">${parseFloat(item.balance || 0).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div class="footer">
                         <div class="summary-grid">
                            <div class="summary-item">
                                <span class="summary-label">Total Debit</span>
                                <span class="summary-value">${parseFloat(summaryData.debit).toFixed(2)}</span>
                            </div>
                            <div class="summary-item">
                                <span class="summary-label">Total Credit</span>
                                <span class="summary-value">${parseFloat(summaryData.credit).toFixed(2)}</span>
                            </div>
                            <div class="summary-item">
                                <span class="summary-label">Net Balance</span>
                                <span class="summary-value">${parseFloat(summaryData.balance).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `;

            const blob = new Blob([printContent], { type: 'text/html' });
            const blobUrl = URL.createObjectURL(blob);
            setPrintUrl(blobUrl);
            setShowPrintModal(true);
        } catch (error) {
            console.error("Print preview failed", error);
            setErrorMessage("Failed to load print preview");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [treeRes, currRes, userRes] = await Promise.all([
                    fetchAccountTree(),
                    listCurrencies(),
                    listUsers(),
                ]);

                // ... keep flattenTree Logic ...

                const flattenTree = (nodes: AccountNode[], depth = 0): ReportFilterOption[] => {
                    let result: ReportFilterOption[] = [];
                    const list = Array.isArray(nodes) ? nodes : [];

                    list.forEach(node => {
                        const name = language === 'ar' ? (node.name_ar || node.name) : (node.name_en || node.name);
                        const prefix = '-'.repeat(depth * 2);
                        result.push({
                            id: node.id,
                            name: `${prefix} ${node.code ? `[${node.code}] ` : ''}${name}`
                        });
                        if (node.children && node.children.length > 0) {
                            result = result.concat(flattenTree(node.children, depth + 1));
                        }
                    });
                    return result;
                };

                const rawTree = (treeRes as any).data || (Array.isArray(treeRes) ? treeRes : []);
                setAccountTree(flattenTree(rawTree));

                const mapOptions = (list: any) => {
                    const arr = Array.isArray(list) ? list : Array.isArray(list?.data) ? list.data : [];
                    return arr.map(item => ({
                        id: item.id?.toString(),
                        name: language === 'ar' ? (item.name_ar || item.name) : (item.name_en || item.name)
                    }));
                };

                setCurrencies(mapOptions(currRes));
                setUsers(mapOptions(userRes));

            } catch (error) {
                console.error("Failed to fetch report options", error);
            }
        };
        fetchOptions();
    }, [language]);

    const handleSearch = async () => {
        setErrorMessage(null);
        if (!filters.account) {
            setErrorMessage(t('common.requiredField' as any) || "Account is required");
            return;
        }
        if (!filters.currency) {
            setErrorMessage(t('common.requiredField' as any) || "Currency is required");
            return;
        }

        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('account', filters.account);
            params.append('currency', filters.currency);
            params.append('start_date', filters.startDate);
            params.append('end_date', filters.endDate);
            if (filters.userId) params.append('created_by', filters.userId);
            if (filters.reservationNumber) params.append('reservation', filters.reservationNumber);

            const response = await fetchStatementAccount(Object.fromEntries(params));

            const rawResponse: any = response;
            const responseData: any = rawResponse.data && rawResponse.data.legs ? rawResponse.data : rawResponse;
            const rawLegs = responseData.legs || [];

            const mappedData: FundReportItem[] = rawLegs.map((item: any) => ({
                id: item.id || Math.random().toString(),
                date: item.date,
                type: item.type,
                number: item.number,
                description: item.description,
                debit: parseFloat(item.debit || 0),
                credit: parseFloat(item.credit || 0),
                balance: parseFloat(item.balance || 0),
                payment_method: item.category
            }));

            setData(mappedData);

            setSummary({
                totalDebit: parseFloat(responseData.debit || 0),
                totalCredit: parseFloat(responseData.credit || 0),
                netBalance: parseFloat(responseData.balance || 0)
            });

        } catch (error) {
            console.error("Search failed", error);
            setData([]);
            setSummary({ totalDebit: 0, totalCredit: 0, netBalance: 0 });
        } finally {
            setLoading(false);
        }
    };


    const fetchFullData = async () => {
        // Blob export used instead
        return {};
    };

    const handleExport = async () => {
        if (!filters.account || !filters.currency) return;
        try {
            setLoading(true);
            const params = new URLSearchParams();
            params.append('account', filters.account);
            params.append('currency', filters.currency);
            params.append('start_date', filters.startDate);
            params.append('end_date', filters.endDate);
            if (filters.userId) params.append('created_by', filters.userId);
            if (filters.reservationNumber) params.append('reservation', filters.reservationNumber);
            params.append('is_export', 'true');

            const response = await fetchStatementAccount(Object.fromEntries(params));
            const rawResponse: any = response;
            const responseData: any = rawResponse.data && rawResponse.data.legs ? rawResponse.data : rawResponse;
            const legs = responseData.legs || [];
            const summaryData = {
                debit: responseData.debit || 0,
                credit: responseData.credit || 0,
                balance: responseData.balance || 0
            };

            let csvContent = "\uFEFF";
            const headers = [
                '#',
                t('receipts.th_date'),
                t('receipts.addReceiptPanel.voucher'),
                t('receipts.th_transactionNumber'),
                t('receipts.addReceiptPanel.description'),
                t('receipts.addReceiptPanel.debitAccount'),
                t('receipts.addReceiptPanel.creditAccount'),
                t('bookings.balance'),
                t('receipts.th_paymentMethod')
            ];
            csvContent += headers.join(',') + "\n";

            legs.forEach((item: any, index: number) => {
                const row = [
                    index + 1,
                    item.date,
                    item.type,
                    item.number,
                    `"${(item.description || '').replace(/"/g, '""')}"`,
                    item.debit,
                    item.credit,
                    item.balance,
                    item.category || ''
                ];
                csvContent += row.join(',') + "\n";
            });

            csvContent += "\n";
            csvContent += `,,,,"${t('reportsPage.labels.totalDebit' as any)}",${summaryData.debit},,,\n`;
            csvContent += `,,,,"${t('reportsPage.labels.totalCredit' as any)}",${summaryData.credit},,,\n`;
            csvContent += `,,,,"${t('reportsPage.labels.netBalance' as any)}",${summaryData.balance},,,\n`;

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `account_statement_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error("Export failed", error);
            setErrorMessage(t('reportsPage.exportFailed') || "Export failed");
        } finally {
            setLoading(false);
        }
    };

    // Old handlePrint removed


    const labelClass = `block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ${language === 'ar' ? 'text-right' : 'text-left'}`;
    const inputClass = `w-full px-3 py-2 bg-slate-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-200 text-sm`;

    return (
        <div className="space-y-6">
            {/* Filter Section */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm">
                <h3 className={`text-lg font-bold text-slate-700 dark:text-slate-200 mb-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>{t('receipts.searchInfo')}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className={labelClass}>{t('receipts.addReceiptPanel.paymentTo')}</label>
                        <SearchableSelect
                            id="account"
                            options={accountTree.map(o => o.name)}
                            value={accountTree.find(o => String(o.id) === String(filters.account))?.name || ''}
                            onChange={val => { const f = accountTree.find(o => o.name === val); if (f) setFilters(p => ({ ...p, account: String(f.id) })) }}
                            placeholder="Select Account"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>{t('receipts.addReceiptPanel.currency')}</label>
                        <SearchableSelect
                            id="currency"
                            options={currencies.map(o => o.name)}
                            value={currencies.find(o => String(o.id) === String(filters.currency))?.name || ''}
                            onChange={val => { const f = currencies.find(o => o.name === val); if (f) setFilters(p => ({ ...p, currency: String(f.id) })) }}
                            placeholder="Select Currency"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>{t('bookings.from')}</label>
                        <DatePicker value={filters.startDate} onChange={d => setFilters(p => ({ ...p, startDate: d }))} />
                    </div>
                    <div>
                        <label className={labelClass}>{t('bookings.to')}</label>
                        <DatePicker value={filters.endDate} onChange={d => setFilters(p => ({ ...p, endDate: d }))} />
                    </div>
                    <div>
                        <label className={labelClass}>{t('receipts.addReceiptPanel.accountant')}</label>
                        <SearchableSelect
                            id="user"
                            options={users.map(o => o.name)}
                            value={users.find(o => String(o.id) === String(filters.userId))?.name || ''}
                            onChange={val => { const f = users.find(o => o.name === val); if (f) setFilters(p => ({ ...p, userId: String(f.id) })) }}
                            placeholder="Select User"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>{t('bookings.bookingNumber')}</label>
                        <input
                            type="text"
                            value={filters.reservationNumber}
                            onChange={e => setFilters(p => ({ ...p, reservationNumber: e.target.value }))}
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
                                    <td colSpan={5} className="px-4 py-3 text-end border-r dark:border-slate-600">{t('reportsPage.labels.totalDebit' as any)}</td>
                                    <td className="px-4 py-3 border-r dark:border-slate-600">{summary.totalDebit.toFixed(2)}</td>
                                    <td colSpan={3}></td>
                                </tr>
                                <tr>
                                    <td colSpan={5} className="px-4 py-3 text-end border-r dark:border-slate-600">{t('reportsPage.labels.totalCredit' as any)}</td>
                                    <td className="px-4 py-3 border-r dark:border-slate-600">{summary.totalCredit.toFixed(2)}</td>
                                    <td colSpan={3}></td>
                                </tr>
                                <tr className="bg-blue-50 dark:bg-blue-900/20">
                                    <td colSpan={5} className="px-4 py-3 text-end border-r dark:border-slate-600">{t('reportsPage.labels.netBalance' as any)}</td>
                                    <td colSpan={3} className="px-4 py-3 text-center border-r dark:border-slate-600">{summary.netBalance.toFixed(2)}</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>
            <ErrorModal
                isOpen={!!errorMessage}
                onClose={() => setErrorMessage(null)}
                message={errorMessage}
            />

            <PrintPreviewModal
                isOpen={showPrintModal}
                onClose={() => setShowPrintModal(false)}
                url={printUrl}
                t={t}
            />
        </div>
    );
};

export default ReportAccountStatement;
