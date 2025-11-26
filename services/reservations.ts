import { apiClient } from '../apiClient';
import {
    Apartment,
    CheckoutRequest,
    RentalCalculationRequest,
    RentalCalculationResponse,
    Reservation,
    ReservationListResponse,
    ReservationStatistics,
    StatusCountResponse,
    TimelineResponse,
} from '../types';

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

const toFormData = (payload: Record<string, any>) => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, value as any);
        }
    });
    return formData;
};

const RESERVATIONS_ENDPOINT = '/reservation/api/reservations/';

export const listReservations = (query?: Query) =>
    apiClient<ReservationListResponse>(`${RESERVATIONS_ENDPOINT}${buildQueryString(query)}`);

export const createReservation = (payload: Partial<Reservation>) =>
    apiClient<Reservation>(RESERVATIONS_ENDPOINT, { method: 'POST', body: toFormData(payload) });

export const updateReservation = (id: number, payload: Partial<Reservation>) =>
    apiClient<Reservation>(`${RESERVATIONS_ENDPOINT}${id}/`, { method: 'PATCH', body: toFormData(payload) });

export const deleteReservation = (id: number) =>
    apiClient<void>(`${RESERVATIONS_ENDPOINT}${id}/`, { method: 'DELETE' });

export const checkoutReservation = (payload: CheckoutRequest) =>
    apiClient<{ status: number; message: string }>(`${RESERVATIONS_ENDPOINT}checkout/`, {
        method: 'POST',
        body: toFormData(payload),
    });

export const calculateRental = (payload: RentalCalculationRequest) =>
    apiClient<RentalCalculationResponse>(`${RESERVATIONS_ENDPOINT}rental-calculation/`, {
        method: 'POST',
        body: toFormData(payload),
    });

export const getReservationStatistics = (query?: Query) =>
    apiClient<ReservationStatistics>(`/reservation/api/index/${buildQueryString(query)}`);

export const getReservationTimeline = (query?: Query) =>
    apiClient<TimelineResponse>(`/reservation/api/index/reservations/${buildQueryString(query)}`);

export const getReservationStatusCount = (query?: Query) =>
    apiClient<StatusCountResponse>(`/reservation/api/index/status-count/${buildQueryString(query)}`);

export const listApartments = (query?: Query) =>
    apiClient<{ count: number; results: Apartment[] }>(`/apartment/api/apartments/${buildQueryString(query)}`);
