import { apiClient } from '../apiClient';
import { HotelUser, User } from '../types';

interface UserListResponse {
    data: HotelUser[];
    recordsFiltered: number;
}

export const listUsers = async (params?: URLSearchParams) => {
    const qs = params ? `?${params.toString()}` : '';
    return apiClient<UserListResponse>(`/ar/user/api/users/${qs}`);
};

export const createUser = async (formData: FormData) => {
    return apiClient('/ar/user/api/users/', {
        method: 'POST',
        body: formData
    });
};

export const updateUser = async (id: string | number, formData: FormData) => {
    return apiClient(`/ar/user/api/users/${id}/`, {
        method: 'PUT',
        body: formData
    });
};

export const deleteUser = async (id: string | number) => {
    return apiClient(`/ar/user/api/users/${id}/`, { method: 'DELETE' });
};

export const toggleUserStatus = async (id: string | number, isActive: boolean) => {
    const action = isActive ? 'active' : 'disable';
    return apiClient(`/ar/user/api/users/${id}/${action}/`, { method: 'POST' });
};

export const updateProfile = async (formData: FormData | URLSearchParams) => {
    return apiClient<User>('/ar/user/api/profile/', {
        method: 'PUT',
        body: formData,
    });
};
