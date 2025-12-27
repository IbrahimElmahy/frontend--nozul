import { apiClient } from '../apiClient';
import { CountryAPI } from '../types';

export const getHotelDetails = async (hotelId: string) => {
    return apiClient<any>(`/ar/hotel/api/hotels/${hotelId}/`);
};

export const updateHotelDetails = async (hotelId: string, formData: FormData) => {
    return apiClient(`/ar/hotel/api/hotels/${hotelId}/`, {
        method: 'PUT',
        body: formData
    });
};

export const listCountries = async () => {
    return apiClient<CountryAPI>('/ar/country/api/countries/');
};
