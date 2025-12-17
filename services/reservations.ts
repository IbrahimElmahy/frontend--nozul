import { apiClient } from '../apiClient';
import {
    Apartment,
    CheckoutRequest,
    Country,
    DiscountType,
    Guest,
    GuestCategory,
    RentalCalculationRequest,
    RentalCalculationResponse,
    RentalType,
    Reservation,
    ReservationListResponse,
    ReservationReason,
    ReservationSource,
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

const RESERVATIONS_ENDPOINT = '/ar/reservation/api/reservations/';

export const listReservations = (query?: Query) =>
    apiClient<ReservationListResponse>(`${RESERVATIONS_ENDPOINT}${buildQueryString(query)}`);

export const getReservation = (id: number | string) =>
    apiClient<Reservation>(`${RESERVATIONS_ENDPOINT}${id}/`);

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

export const getRentalTypes = () =>
    apiClient<any>('/ar/reservation/api/reservations/rental-types/');

export const getReservationSources = (query?: Query) =>
    apiClient<any>(`/ar/reservation/api/reservation-sources/${buildQueryString(query)}`);

export const getReservationReasons = (query?: Query) =>
    apiClient<any>(`/ar/reservation/api/reservation-reasons/${buildQueryString(query)}`);

export const getReservationRelationships = (query?: Query) =>
    apiClient<{ data: any[] }>(`/ar/companion/api/relations/${buildQueryString(query)}`);

export const getDiscountTypes = () =>
    apiClient<any>('/ar/discount/api/discount-types/');

export const getCountries = () =>
    apiClient<Record<string, string>>('/ar/country/api/countries/');

export const getGuestCategories = () =>
    apiClient<any>('/ar/guest/api/guests/categories/');

export const searchAvailableApartments = (query: Query) =>
    apiClient<{ count: number; results: Apartment[] }>(`/apartment/api/apartments/${buildQueryString(query)}`);

export const searchGuests = (query: Query) =>
    apiClient<{ count: number; results: Guest[] }>(`/guest/api/guests/${buildQueryString(query)}`);

export const getGuestIdTypes = () =>
    apiClient<{ data: any[] }>('/ar/guest/api/ids/');
