import { apiClient } from '../apiClient';
import { Order, OrderCalculationRequest, OrderCalculationResponse, OrderListResponse } from '../types';

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
            if (Array.isArray(value)) {
                value.forEach((item, index) => {
                    if (typeof item === 'object' && item !== null) {
                        Object.entries(item).forEach(([itemKey, itemValue]) => {
                            formData.append(`${key}[${index}]${itemKey}`, itemValue as any);
                        });
                    } else {
                        formData.append(`${key}[]`, item as any);
                    }
                });
            } else {
                formData.append(key, value as any);
            }
        }
    });
    return formData;
};

const ORDERS_ENDPOINT = '/order/api/orders/';

export const calculateOrder = (payload: OrderCalculationRequest) =>
    apiClient<OrderCalculationResponse>(`${ORDERS_ENDPOINT}calculation/`, { method: 'POST', body: toFormData(payload) });

export const createOrder = (payload: OrderCalculationRequest) =>
    apiClient<Order>(ORDERS_ENDPOINT, { method: 'POST', body: toFormData(payload) });

export const listOrders = (query?: Query) =>
    apiClient<OrderListResponse>(`${ORDERS_ENDPOINT}${buildQueryString(query)}`);

export const updateOrder = (id: string, payload: Partial<OrderCalculationRequest>) =>
    apiClient<Order>(`${ORDERS_ENDPOINT}${id}/`, { method: 'PUT', body: toFormData(payload) });

export const deleteOrder = (id: string) =>
    apiClient<void>(`${ORDERS_ENDPOINT}${id}/`, { method: 'DELETE' });

export const activateOrder = (id: string) =>
    apiClient<void>(`${ORDERS_ENDPOINT}${id}/active/`, { method: 'POST' });

export const disableOrder = (id: string) =>
    apiClient<void>(`${ORDERS_ENDPOINT}${id}/disable/`, { method: 'POST' });
