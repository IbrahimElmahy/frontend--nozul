import { User } from './types';
import { API_BASE_URL } from './config/api';

export class ApiValidationError extends Error {
    errors: Record<string, string | string[]>;

    constructor(message: string, errors: Record<string, string | string[]>) {
        super(message);
        this.name = 'ApiValidationError';
        this.errors = errors;
    }
}

interface ApiClientOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: any;
    responseType?: 'json' | 'blob';
    headers?: HeadersInit;
    skipAuth?: boolean;
}

export const apiClient = async <T>(endpoint: string, options: ApiClientOptions = {}): Promise<T> => {
    const { method = 'GET', body = null, responseType = 'json', headers: customHeaders = {}, skipAuth = false } = options;
    const token = localStorage.getItem('accessToken');

    if (!token && !skipAuth) {
        throw new Error('Authentication token not found. Please log in again.');
    }

    const isFormData = body instanceof FormData;
    const isUrlSearchParams = body instanceof URLSearchParams;

    const headers: HeadersInit = {
        'Authorization': `JWT ${token}`,
        'Accept-Language': document.documentElement.lang || 'ar',
        ...customHeaders as any,
    };

    if (!isFormData && !isUrlSearchParams && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    const config: RequestInit = {
        method,
        headers,
    };

    if (body) {
        config.body = (isFormData || isUrlSearchParams) ? body : JSON.stringify(body);
    }

    // For GET request with body, we should not send it. Instead we handle it with query params.
    if (method === 'GET' && body) {
        delete config.body;
    }


    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        if (method === 'DELETE' && response.status === 204) {
            return Promise.resolve(null as unknown as T);
        }

        if (responseType === 'blob') {
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
            return await response.blob() as unknown as T;
        }

        const responseData = await response.json();

        if (!response.ok) {
            let errorMessage = 'An unknown API error occurred';
            let errors: Record<string, string | string[]> = {};

            if (responseData.detail) {
                errorMessage = responseData.detail;
            } else if (Array.isArray(responseData)) {
                errorMessage = responseData.join('; ');
                errors = { non_field_errors: responseData };
            } else if (typeof responseData === 'object' && responseData !== null) {
                // It's likely a validation error object
                errors = responseData;

                // Construct a summary message
                const parts = [];
                for (const [key, value] of Object.entries(responseData)) {
                    const valStr = Array.isArray(value)
                        ? value.map(v => typeof v === 'object' ? JSON.stringify(v) : v).join(', ')
                        : (typeof value === 'object' ? JSON.stringify(value) : String(value));
                    parts.push(`${key}: ${valStr}`);
                }
                if (parts.length > 0) errorMessage = parts.join('; ');
            }

            throw new ApiValidationError(errorMessage, errors);
        }

        return responseData as T;
    } catch (error: any) {
        // Dispatch Global Error Event
        const message = error.message || 'An unexpected error occurred.';
        // Avoid double dispatch if the error was already dispatched (e.g. nested calls if any - unlikely for fetch)
        // Check if it's a validation error, maybe we act differently, but for now show all as requested.

        window.dispatchEvent(new CustomEvent('global-error', {
            detail: {
                message: message,
                title: 'Error'
            }
        }));

        if (error instanceof ApiValidationError) {
            throw error;
        }
        if (error instanceof Error) {
            // Re-throw custom or network errors so callers can stop loading states
            throw new Error(error.message || 'A network error occurred.');
        }
        // Handle unexpected error types
        throw new Error('An unexpected error occurred during the API call.');
    }
};
