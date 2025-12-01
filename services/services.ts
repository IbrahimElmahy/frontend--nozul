import { apiClient } from '../apiClient';
import { Service, ServiceListResponse } from '../types';

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

const SERVICES_ENDPOINT = '/service/api/services/';

export const listServices = (query?: Query) =>
    apiClient<ServiceListResponse>(`${SERVICES_ENDPOINT}${buildQueryString(query)}`);

export const createService = (payload: Partial<Service>) =>
    apiClient<Service>(SERVICES_ENDPOINT, { method: 'POST', body: toFormData(payload) });

export const updateService = (id: string, payload: Partial<Service>) =>
    apiClient<Service>(`${SERVICES_ENDPOINT}${id}/`, { method: 'PUT', body: toFormData(payload) });

export const deleteService = (id: string) =>
    apiClient<void>(`${SERVICES_ENDPOINT}${id}/`, { method: 'DELETE' });

export const activateService = (id: string) =>
    apiClient<void>(`${SERVICES_ENDPOINT}${id}/active/`, { method: 'POST' });

export const disableService = (id: string) =>
    apiClient<void>(`${SERVICES_ENDPOINT}${id}/disable/`, { method: 'POST' });
