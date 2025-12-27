import { apiClient } from '../apiClient';
import { Unit } from '../types';
import { mapUnitToFormData } from '../components/data/apiMappers';

// Types for Options
export interface UnitTypeAPI {
    id: string;
    name: string;
}

export interface FeatureAPI {
    id: string;
    name_en: string;
    name_ar: string;
    type: 'common' | 'special';
}

export interface UnitsListResponse {
    data: any[];
    recordsFiltered: number;
}

// Option Fetchers
export const listUnitTypes = async (): Promise<UnitTypeAPI[]> => {
    const response = await apiClient<{ data: UnitTypeAPI[] }>('/apartment/api/apartments-types/');
    return response.data;
};

export const listCoolingTypes = async (): Promise<[string, string][]> => {
    return apiClient<[string, string][]>('/apartment/api/apartments/cooling-types/');
};

export const listFeatures = async (): Promise<FeatureAPI[]> => {
    const response = await apiClient<{ data: FeatureAPI[] }>('/feature/api/features/?length=50');
    return response.data;
};

// Unit Operations
export const listUnits = async (params: URLSearchParams): Promise<UnitsListResponse> => {
    return apiClient<UnitsListResponse>(`/apartment/api/apartments/?${params.toString()}`);
};

export const createUnit = async (unit: Unit): Promise<any> => {
    const formData = mapUnitToFormData(unit);
    return apiClient('/apartment/api/apartments/', {
        method: 'POST',
        body: formData,
    });
};

export const updateUnit = async (unit: Unit): Promise<any> => {
    const formData = mapUnitToFormData(unit);
    return apiClient(`/apartment/api/apartments/${unit.id}/`, {
        method: 'PUT',
        body: formData,
    });
};

export const deleteUnit = async (id: string): Promise<void> => {
    return apiClient(`/apartment/api/apartments/${id}/`, {
        method: 'DELETE',
    });
};
