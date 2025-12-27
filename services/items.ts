import { apiClient } from '../apiClient';
import { Item } from '../types'; // Item interface seems to cover both Service and Category in ItemsPage usage

interface ItemListResponse {
    data: any[]; // ItemsPage mapped data manually, response was { data: any[], recordsFiltered: number }
    recordsFiltered: number;
}

// --- Services ---
export const listServices = async (params?: URLSearchParams) => {
    const qs = params ? `?${params.toString()}` : '';
    return apiClient<ItemListResponse>(`/ar/service/api/services/${qs}`);
};

export const createService = async (formData: FormData) => {
    return apiClient<Item>('/ar/service/api/services/', {
        method: 'POST',
        body: formData
    });
};

export const updateService = async (id: string | number, formData: FormData) => {
    return apiClient<Item>(`/ar/service/api/services/${id}/`, {
        method: 'PUT',
        body: formData
    });
};

export const deleteService = async (id: string | number) => {
    return apiClient(`/ar/service/api/services/${id}/`, { method: 'DELETE' });
};

export const toggleServiceStatus = async (id: string | number, isActive: boolean) => {
    const action = isActive ? 'active' : 'disable';
    return apiClient(`/ar/service/api/services/${id}/${action}/`, { method: 'POST' });
};

// --- Categories ---
export const listCategories = async (params?: URLSearchParams) => {
    const qs = params ? `?${params.toString()}` : '';
    return apiClient<ItemListResponse>(`/ar/category/api/categories/${qs}`);
};

export const createCategory = async (formData: FormData) => {
    return apiClient<Item>('/ar/category/api/categories/', {
        method: 'POST',
        body: formData
    });
};

export const updateCategory = async (id: string | number, formData: FormData) => {
    return apiClient<Item>(`/ar/category/api/categories/${id}/`, {
        method: 'PUT',
        body: formData
    });
};

export const deleteCategory = async (id: string | number) => {
    return apiClient(`/ar/category/api/categories/${id}/`, { method: 'DELETE' });
};

export const toggleCategoryStatus = async (id: string | number, isActive: boolean) => {
    const action = isActive ? 'active' : 'disable';
    return apiClient(`/ar/category/api/categories/${id}/${action}/`, { method: 'POST' });
};
