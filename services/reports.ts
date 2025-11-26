import { apiClient } from '../apiClient';
import {
    DataTableResponse,
    PaymentMethodAPI,
    ReceiptType,
    Reservation,
} from '../types';

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

// Fund movement / statement account share the same endpoint + export
export const fetchStatementAccount = (query?: Query) =>
    apiClient<DataTableResponse<any>>(`/ar/report/api/statement-account/${buildQueryString(query)}`);

export const exportStatementAccount = (payload?: Record<string, any>) =>
    apiClient<Blob>('/ar/report/api/statement-account/export-excel-file/', {
        method: payload ? 'POST' : 'GET',
        body: payload ? toFormData(payload) : undefined,
    });

// Balady
export const fetchBalady = (query?: Query) =>
    apiClient<DataTableResponse<any>>(`/ar/report/api/balady/${buildQueryString(query)}`);

export const exportBalady = (payload?: Record<string, any>) =>
    apiClient<Blob>('/ar/report/api/balady/export-excel-file/', {
        method: payload ? 'POST' : 'GET',
        body: payload ? toFormData(payload) : undefined,
    });

// Daily reservation movements
export const fetchDailyReservationsMovements = (query?: Query) =>
    apiClient<DataTableResponse<Reservation>>(`/ar/report/api/daily_reservations_movements/${buildQueryString(query)}`);

export const fetchAllReservationsMovements = (query?: Query) =>
    apiClient<Reservation[]>(`/ar/report/api/daily_reservations_movements/get-all-reservation/${buildQueryString(query)}`);

export const exportReservationsMovements = (payload?: Record<string, any>) =>
    apiClient<Blob>('/ar/reservation/api/reservations/export-excel-file/', {
        method: payload ? 'POST' : 'GET',
        body: payload ? toFormData(payload) : undefined,
    });

// Helpers used by the report filters
export const fetchReceiptTypes = () =>
    apiClient<ReceiptType[]>('/ar/transaction/api/transactions/receipt-types/');

export const fetchPaymentMethods = () =>
    apiClient<PaymentMethodAPI[]>('/ar/payment/api/payments-methods/');

export const fetchReservationStatuses = () =>
    apiClient<string[]>('/ar/reservation/api/reservations/status/');

export const fetchRentalTypes = () =>
    apiClient<string[]>('/ar/reservation/api/reservations/rental-types/');
