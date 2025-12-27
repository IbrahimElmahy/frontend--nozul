import { apiClient } from '../apiClient';

export const listApartmentPrices = async (params?: URLSearchParams) => {
    const qs = params ? `?${params.toString()}` : '';
    // Based on ApartmentPricesPage usage
    return apiClient<{ data: any[], recordsFiltered: number }>(`/ar/start/api/prices/${qs}`);
};

export const updateApartmentPrice = async (id: string | number, formData: FormData) => {
    return apiClient(`/ar/start/api/prices/${id}/`, {
        method: 'PUT',
        body: formData
    });
};

// If there's a create, though typically prices might be pre-seeded or managed differently?
// Checking component usage will confirm.
