import { apiClient } from '../apiClient';
import { Invoice, InvoiceListResponse } from '../types';

type Query = Record<string, string | number | undefined | null>;

const buildQueryString = (query?: Query) => {
    if (!query) return '';
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value));
        }
    });
    const qs = params.toString();
    return qs ? `?${qs}` : '';
};

const toFormData = (payload: Record<string, any>) => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, value as any);
        }
    });
    return formData;
};

const INVOICES_ENDPOINT = '/ar/invoice/api/invoices/';

export const createInvoice = (payload: URLSearchParams | FormData) => {
    const isUrlEncoded = payload instanceof URLSearchParams;
    const headers = isUrlEncoded ? { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } : undefined;

    return apiClient<Invoice>(INVOICES_ENDPOINT, {
        method: 'POST',
        headers, // apiClient implementation should merge or respect this 
        body: payload
    });
};

export const listInvoices = (query?: Query) =>
    apiClient<InvoiceListResponse>(`${INVOICES_ENDPOINT}${buildQueryString(query)}`);
