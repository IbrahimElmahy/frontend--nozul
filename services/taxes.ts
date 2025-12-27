import { apiClient } from '../apiClient';
import { Tax } from '../types';

interface TaxListResponse {
    data: Tax[];
    recordsFiltered: number;
}

export const listTaxes = async (params?: URLSearchParams) => {
    const qs = params ? `?${params.toString()}` : '';
    return apiClient<TaxListResponse>(`/ar/tax/api/taxes/${qs}`);
};

export const createTax = async (formData: FormData) => {
    return apiClient('/ar/tax/api/taxes/', {
        method: 'POST',
        body: formData
    });
};

export const updateTax = async (id: string | number, formData: FormData) => {
    return apiClient(`/ar/tax/api/taxes/${id}/`, {
        method: 'PUT',
        body: formData
    });
};

export const deleteTax = async (id: string | number) => {
    return apiClient(`/ar/tax/api/taxes/${id}/`, { method: 'DELETE' });
};

export const toggleTaxStatus = async (id: string | number, isActive: boolean) => {
    const action = isActive ? 'active' : 'disable';
    return apiClient(`/ar/tax/api/taxes/${id}/${action}/`, { method: 'POST' });
};

export const getTaxNames = () =>
    apiClient<[string, string][]>('/ar/tax/api/taxes/names/');

export const getTaxApplies = () =>
    apiClient<[string, string][]>('/ar/tax/api/taxes/applies/');

export const getTaxTypes = () =>
    apiClient<[string, string][]>('/ar/tax/api/taxes/types/');
