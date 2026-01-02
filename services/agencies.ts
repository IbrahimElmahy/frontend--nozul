import { apiClient } from '../apiClient';

interface AgencyListResponse {
    data: any[];
    recordsFiltered: number;
}

const ENDPOINT = '/ar/guest/api/guests/';

export const listAgencies = async (params?: URLSearchParams) => {
    const qs = params ? `?${params.toString()}` : '';
    return apiClient<AgencyListResponse>(`${ENDPOINT}${qs}`);
};

export const createAgency = async (formData: FormData) => {
    return apiClient(ENDPOINT, {
        method: 'POST',
        body: formData,
        suppressGlobalError: true
    });
};

export const updateAgency = async (id: string | number, formData: FormData) => {
    return apiClient(`${ENDPOINT}${id}/`, {
        method: 'PUT',
        body: formData,
        suppressGlobalError: true
    });
};

export const deleteAgency = async (id: string | number) => {
    return apiClient(`${ENDPOINT}${id}/`, { method: 'DELETE', suppressGlobalError: true });
};

export const toggleAgencyStatus = async (id: string | number, isActive: boolean) => {
    const action = isActive ? 'active' : 'disable';
    return apiClient(`${ENDPOINT}${id}/${action}/`, { method: 'POST', suppressGlobalError: true });
};
