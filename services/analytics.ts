import { apiClient } from '../apiClient';

export interface NumericStatsResponse {
    reservations: number;
    arrivals: number;
    occupied: number;
    departures: number;
    departed: number;
}

export interface LabelValueResponse {
    label: string;
    value: number;
}

export interface TimeSeriesResponse {
    [key: string]: number[];
}

export const getNumericStats = async () => {
    return apiClient<NumericStatsResponse>('/ar/reservation/api/index/numeric-stats/');
};

export const getAvailabilityStats = async () => {
    return apiClient<LabelValueResponse[]>('/ar/apartment/api/index/availabilities/');
};

export const getApartmentStats = async () => {
    return apiClient<TimeSeriesResponse>('/ar/apartment/api/index/apartments/');
};

export const getReservationStats = async () => {
    return apiClient<TimeSeriesResponse>('/ar/reservation/api/index/reservations/');
};

export const getCleanlinessStats = async () => {
    return apiClient<LabelValueResponse[]>('/ar/apartment/api/index/cleanliness/');
};

export const getStatusCountStats = async () => {
    return apiClient<LabelValueResponse[]>('/ar/reservation/api/index/status-count/');
};
