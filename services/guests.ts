import { apiClient } from '../apiClient';
import { Guest, GuestTypeAPI, IdTypeAPI, CountryAPI } from '../types';

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

const GUESTS_ENDPOINT = '/ar/guest/api/guests/';

export const listGuests = (params?: URLSearchParams) => {
    const qs = params ? `?${params.toString()}` : '';
    return apiClient<{ data: Guest[], recordsFiltered: number }>(`${GUESTS_ENDPOINT}${qs}`);
};

export const listCustomers = () => {
    return apiClient<{ data: Guest[] }>('/ar/guest/api/guests/?category=customer');
}

export const getGuest = (id: string) =>
    apiClient<Guest>(`${GUESTS_ENDPOINT}${id}/`);

export const createGuest = (formData: FormData) =>
    apiClient<Guest>(GUESTS_ENDPOINT, { method: 'POST', body: formData });

export const updateGuest = (id: string, formData: FormData) =>
    apiClient<Guest>(`${GUESTS_ENDPOINT}${id}/`, { method: 'PUT', body: formData });

export const deleteGuest = (id: string) =>
    apiClient<void>(`${GUESTS_ENDPOINT}${id}/`, { method: 'DELETE' });

export const activateGuest = (id: string) =>
    apiClient<void>(`${GUESTS_ENDPOINT}${id}/active/`, { method: 'POST' });

export const disableGuest = (id: string) =>
    apiClient<void>(`${GUESTS_ENDPOINT}${id}/disable/`, { method: 'POST' });

export const getGuestTypes = (category?: string) => {
    const qs = category ? `?category=${category}` : '';
    return apiClient<{ data: GuestTypeAPI[] }>(`/ar/guest/api/guests-types/${qs}`);
};

export const getIdTypes = (guestTypeId?: string) => {
    const qs = guestTypeId ? `?guests_types=${guestTypeId}` : '';
    return apiClient<{ data: IdTypeAPI[] }>(`/ar/guest/api/ids/${qs}`);
};

export const getCountries = () =>
    apiClient<CountryAPI>('/ar/country/api/countries/');

export const getDiscountTypes = () =>
    apiClient<[string, string][]>('/ar/discount/api/discount-types/');
