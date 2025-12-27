import { apiClient } from '../apiClient';
import { Receipt, Invoice, Currency, PaymentMethodAPI } from '../types';

// Interfaces for response types to handle generic apiClient return
// Note: Some API endpoints might return { data: T[], recordsFiltered: number } while others might be generic
interface ListResponse<T> {
    data: T[];
    recordsFiltered: number;
}

// --- Transactions (Receipts & Payments) ---

export const listTransactions = async (params: URLSearchParams): Promise<{ transactions: Receipt[], total: number }> => {
    // API endpoint for transactions
    // params usually include 'type' (receipt/payment), 'start', 'length', 'search', etc.
    const response = await apiClient<ListResponse<any>>(`/ar/transaction/api/transactions/?${params.toString()}`);

    const mappedTransactions: Receipt[] = response.data.map((item: any) => ({
        id: item.id,
        receiptNumber: item.number || item.id,
        currency: item.currency?.name_ar || 'SAR',
        value: parseFloat(item.amount),
        date: item.date,
        time: item.time,
        paymentMethod: item.payment_method?.name_ar || '',
        paymentType: item.type,
        transactionNumber: item.id,
        bookingNumber: '', // Not always explicitly linked in list view
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        description: item.description
    }));

    return { transactions: mappedTransactions, total: response.recordsFiltered };
};

export const createTransaction = async (payload: FormData): Promise<void> => {
    // Payload should be pre-constructed FormData as it might contain file uploads or complex nested fields
    // However, if we standardize on JSON, we should convert.
    // Given the complexity of `credit_legs[0]account` syntax used in previous `AddReceiptPanel`, 
    // it was using FormData to support Django's form parsing or specific API expectations.
    // We will support FormData here passed from component.
    await apiClient('/ar/transaction/api/transactions/', {
        method: 'POST',
        body: payload
    });
};

export const updateTransaction = async (id: string, payload: FormData): Promise<void> => {
    // The previous implementation used PUT on /transactions/:id/
    await apiClient(`/ar/transaction/api/transactions/${id}/`, {
        method: 'PUT',
        body: payload
    });
};

export const deleteTransaction = async (id: string): Promise<void> => {
    await apiClient(`/ar/transaction/api/transactions/${id}/`, { method: 'DELETE' });
};


// --- Invoices ---

export const listInvoices = async (params: URLSearchParams): Promise<{ invoices: Invoice[], total: number }> => {
    const response = await apiClient<ListResponse<any>>(`/ar/invoice/api/invoices/?${params.toString()}`);

    // Invoices are often returned as is, but let's map to be safe
    const mappedInvoices: Invoice[] = response.data.map((item: any) => ({
        id: item.id,
        number: item.number,
        reservation: item.reservation,
        amount: parseFloat(item.amount),
        total: parseFloat(item.total),
        created_at: item.created_at,
        updated_at: item.updated_at,
        discount: parseFloat(item.discount || 0),
        subtotal: parseFloat(item.subtotal || 0),
        tax: parseFloat(item.tax || 0)
    }));

    return { invoices: mappedInvoices, total: response.recordsFiltered };
};

export const deleteInvoice = async (id: string): Promise<void> => {
    await apiClient(`/ar/invoice/api/invoices/${id}/`, { method: 'DELETE' });
};


// --- Helper / Dependencies ---

export const listCurrencies = async (): Promise<Currency[]> => {
    const response = await apiClient<{ data: any[] }>('/ar/currency/api/currencies/');
    // Map if necessary, but returning generic struct for component to map is also fine for dropdowns
    return response.data;
};

// CRUD for CurrenciesPage
export const createCurrency = async (formData: FormData) => {
    return apiClient('/ar/currency/api/currencies/', {
        method: 'POST',
        body: formData
    });
};

export const updateCurrency = async (id: string | number, formData: FormData) => {
    return apiClient(`/ar/currency/api/currencies/${id}/`, {
        method: 'PUT',
        body: formData
    });
};

export const deleteCurrency = async (id: string | number) => {
    return apiClient(`/ar/currency/api/currencies/${id}/`, { method: 'DELETE' });
};

export const toggleCurrencyStatus = async (id: string | number, isActive: boolean) => {
    const action = isActive ? 'active' : 'disable';
    return apiClient(`/ar/currency/api/currencies/${id}/${action}/`, { method: 'POST' });
};

export const listPaymentMethods = async (): Promise<any[]> => {
    const response = await apiClient<{ data: any[] }>('/ar/payment/api/payments-methods/');
    return response.data;
};

// Funds lookup was previously listFunds, now getFundsLookup to avoid name collision or standardized
// But we can keep listFunds signature generic? 
// No, the new listFunds takes params. 
// We should check references to listFunds. 
// If listFunds was used as lookup, we should export getFundsLookup as listFunds for backward compat or update callers.
// Given strict refactoring, I will rename old usage.


export const listClientExpenses = () =>
    apiClient<{ data: any[] }>('/ar/cash/api/clients-expenses/');

export const listCashAccounts = (query?: string) =>
    apiClient<{ data: any[] }>(`/ar/cash/api/cash/${query ? `?${query}` : ''}`);

export const listUsers = (query?: string) =>
    apiClient<{ data: any[] }>(`/ar/user/api/users/${query ? `?${query}` : ''}`);

// --- Banks ---

export const listBanks = async (params?: URLSearchParams) => {
    const qs = params ? `?${params.toString()}` : '';
    return apiClient<ListResponse<any | number>>(`/ar/bank/api/banks/${qs}`);
};

// Existing simple lookup if needed, or reuse listBanks with no params
export const getBanksLookup = async () => {
    const res = await apiClient<{ data: any[] }>('/ar/bank/api/banks/');
    return res.data;
};

export const createBank = async (formData: FormData) => {
    return apiClient('/ar/bank/api/banks/', {
        method: 'POST',
        body: formData
    });
};

export const updateBank = async (id: string | number, formData: FormData) => {
    return apiClient(`/ar/bank/api/banks/${id}/`, {
        method: 'PUT',
        body: formData
    });
};

export const deleteBank = async (id: string | number) => {
    return apiClient(`/ar/bank/api/banks/${id}/`, { method: 'DELETE' });
};

export const toggleBankStatus = async (id: string | number, isActive: boolean) => {
    const action = isActive ? 'active' : 'disable';
    return apiClient(`/ar/bank/api/banks/${id}/${action}/`, { method: 'POST' });
};


// --- Funds (Safe/Cash) ---

export const listFunds = async (params?: URLSearchParams) => {
    const qs = params ? `?${params.toString()}` : '';
    return apiClient<ListResponse<any>>(`/ar/cash/api/funds/${qs}`); // Check endpoint? BanksPage used /ar/bank..., FundsPage likely /ar/cash...
};

// Existing lookup replacement
export const getFundsLookup = async () => {
    const res = await apiClient<{ data: any[] }>('/ar/cash/api/funds/');
    return res.data;
};

export const createFund = async (formData: FormData) => {
    return apiClient('/ar/cash/api/funds/', {
        method: 'POST',
        body: formData
    });
};

export const updateFund = async (id: string | number, formData: FormData) => {
    return apiClient(`/ar/cash/api/funds/${id}/`, {
        method: 'PUT',
        body: formData
    });
};

export const deleteFund = async (id: string | number) => {
    return apiClient(`/ar/cash/api/funds/${id}/`, { method: 'DELETE' });
};

export const toggleFundStatus = async (id: string | number, isActive: boolean) => {
    const action = isActive ? 'active' : 'disable';
    return apiClient(`/ar/cash/api/funds/${id}/${action}/`, { method: 'POST' });
};


// --- Expenses ---

export const listExpenses = async (params?: URLSearchParams) => {
    const qs = params ? `?${params.toString()}` : '';
    return apiClient<ListResponse<any>>(`/ar/expense/api/expenses/${qs}`);
};

export const getExpensesLookup = async () => {
    const res = await apiClient<{ data: any[] }>('/ar/expense/api/expenses/');
    return res.data;
};

export const createExpense = async (formData: FormData) => {
    return apiClient('/ar/expense/api/expenses/', {
        method: 'POST',
        body: formData
    });
};

export const updateExpense = async (id: string | number, formData: FormData) => {
    return apiClient(`/ar/expense/api/expenses/${id}/`, {
        method: 'PUT',
        body: formData
    });
};

export const deleteExpense = async (id: string | number) => {
    return apiClient(`/ar/expense/api/expenses/${id}/`, { method: 'DELETE' });
};

export const toggleExpenseStatus = async (id: string | number, isActive: boolean) => {
    const action = isActive ? 'active' : 'disable';
    return apiClient(`/ar/expense/api/expenses/${id}/${action}/`, { method: 'POST' });
};
