import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ReceiptsPage from '../ReceiptsPage';
import { LanguageContext } from '../../contexts/LanguageContext';

// 1. Mock Services
const listTransactionsMock = vi.fn();
const listInvoicesMock = vi.fn();
const deleteTransactionMock = vi.fn();
const deleteInvoiceMock = vi.fn();

vi.mock('../../services/financials', () => ({
    listTransactions: (...args: any[]) => listTransactionsMock(...args),
    listInvoices: (...args: any[]) => listInvoicesMock(...args),
    deleteTransaction: (...args: any[]) => deleteTransactionMock(...args),
    deleteInvoice: (...args: any[]) => deleteInvoiceMock(...args),
    getExpenseCategories: vi.fn(),
    createTransaction: vi.fn(),
}));

// Mock Sub Components
vi.mock('../AddReceiptPanel', () => ({ default: () => <div data-testid="add-receipt-panel">Add Receipt Panel</div> }));
vi.mock('../ConfirmationModal', () => ({ default: () => <div /> }));
vi.mock('../ReceiptDetailsModal', () => ({ default: () => <div /> }));
vi.mock('../InvoiceDetailsModal', () => ({ default: () => <div /> }));

// Mock Language Context
const mockLanguageContext = {
    language: 'ar',
    t: (key: string) => {
        const tr: Record<string, string> = {
            'receipts.manageReceipts': 'إدارة سندات القبض',
            'receipts.managePaymentVouchers': 'إدارة سندات الصرف',
            'receipts.receiptVouchers': 'سندات قبض',
            'receipts.paymentVouchers': 'سندات صرف',
            'receipts.invoices': 'الفواتير',
            'receipts.addReceipt': 'إضافة سند قبض',
            'receipts.addPaymentVoucher': 'إضافة سند صرف',
            'units.showing': 'عرض',
            'common.unexpectedError': 'خطأ غير متوقع',
            'common.error': 'خطأ',
        };
        return tr[key] || key;
    },
    changeLanguage: vi.fn(),
    direction: 'rtl',
};

describe('ReceiptsPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default Mock Response
        listTransactionsMock.mockResolvedValue({
            transactions: [
                { id: '1', receiptNumber: 'REC-001', value: 100, type: 'receipt' }
            ],
            total: 1
        });
        listInvoicesMock.mockResolvedValue({ invoices: [], total: 0 });
    });

    const renderPage = () => render(
        <LanguageContext.Provider value={mockLanguageContext as any}>
            <ReceiptsPage user={{ id: '1', name: 'Test User', role: 'admin' } as any} />
        </LanguageContext.Provider>
    );

    it('should render Receipts (Receive Vouchers) by default', async () => {
        renderPage();

        // Check for Page Title
        await screen.findByText('إدارة سندات القبض', {}, { timeout: 3000 });

        // Check that listTransactions was called
        await waitFor(() => {
            expect(listTransactionsMock).toHaveBeenCalled();
        });

        // Check for specific text from mock
        await screen.findByText('REC-001');
    });

    it('should switch to Payment Vouchers', async () => {
        renderPage();

        // 1. Wait for load
        await screen.findByText('إدارة سندات القبض', {}, { timeout: 3000 });

        // 2. Click "Payment Vouchers" tab
        const paymentTab = screen.getByText('سندات صرف');
        fireEvent.click(paymentTab);

        // 3. Verify Title Changes
        await screen.findByText('إدارة سندات الصرف', {}, { timeout: 3000 });

        // 4. Verify "Add Payment Voucher" button appears
        expect(screen.getByText('إضافة سند صرف')).toBeInTheDocument();
    });

    it('should open Add Receipt panel', async () => {
        renderPage();

        await screen.findByText('إدارة سندات القبض', {}, { timeout: 3000 });

        const addButton = screen.getByText('إضافة سند قبض');
        fireEvent.click(addButton);

        await screen.findByTestId('add-receipt-panel', {}, { timeout: 3000 });
    });
});
