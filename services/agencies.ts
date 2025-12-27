import { apiClient } from '../apiClient';

interface AgencyListResponse {
    data: any[];
    recordsFiltered: number;
}

export const listAgencies = async (params?: URLSearchParams) => {
    const qs = params ? `?${params.toString()}` : '';
    return apiClient<AgencyListResponse>(`/ar/agency/api/agencies/${qs}`);
};

export const createAgency = async (formData: FormData) => {
    return apiClient('/ar/agency/api/agencies/', {
        method: 'POST',
        body: formData
    });
};

export const updateAgency = async (id: string | number, formData: FormData) => {
    return apiClient(`/ar/agency/api/agencies/${id}/`, {
        method: 'PUT',
        body: formData
    });
};

export const deleteAgency = async (id: string | number) => {
    return apiClient(`/ar/agency/api/agencies/${id}/`, { method: 'DELETE' });
};

export const toggleAgencyStatus = async (id: string | number, isActive: boolean) => {
    const action = isActive ? 'active' : 'disable';
    return apiClient(`/ar/agency/api/agencies/${id}/${action}/`, { method: 'POST' });
};
