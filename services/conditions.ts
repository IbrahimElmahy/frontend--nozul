import { apiClient } from '../apiClient';
import { Condition } from '../types';

// Verified: logic handles single object response by wrapping in array, consistent with component expectation.
// No replacement needed, just verifying comment.
export const listConditions = async (hotelId?: string) => {
    if (hotelId) {
        return apiClient<Condition>(`/ar/condition/api/conditions/${hotelId}/`).then(res => [res]);
    }
    return apiClient<Condition[]>('/ar/condition/api/conditions/');
};

export const createCondition = async (formData: FormData) => {
    return apiClient<Condition>('/ar/condition/api/conditions/', {
        method: 'POST',
        body: formData
    });
};

export const updateCondition = async (id: string | number, formData: FormData) => {
    return apiClient<Condition>(`/ar/condition/api/conditions/${id}/`, {
        method: 'PUT',
        body: formData
    });
};

export const deleteCondition = async (id: string | number) => {
    return apiClient(`/ar/condition/api/conditions/${id}/`, { method: 'DELETE' });
};
