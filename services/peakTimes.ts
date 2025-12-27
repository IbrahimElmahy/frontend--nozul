import { apiClient } from '../apiClient';
import { PeakTime } from '../types';

interface PeakTimeListResponse {
    data: PeakTime[];
    recordsFiltered: number;
}

export const listPeakTimes = async () => {
    // Current implementation doesn't use params, but we can support them if needed
    return apiClient<PeakTimeListResponse>('/ar/peak/api/peaks/');
};

export const createPeakTime = async (formData: FormData) => {
    return apiClient('/ar/peak/api/peaks/', {
        method: 'POST',
        body: formData
    });
};

export const updatePeakTime = async (id: string | number, formData: FormData) => {
    return apiClient(`/ar/peak/api/peaks/${id}/`, {
        method: 'PUT',
        body: formData
    });
};

export const deletePeakTime = async (id: string | number) => {
    return apiClient(`/ar/peak/api/peaks/${id}/`, { method: 'DELETE' });
};
