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
    suppressGlobalError?: boolean;
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
        'X-Requested-With': 'XMLHttpRequest', // Required for many Django JSON views
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

        if (response.status === 401 && !skipAuth) {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    // Try to refresh token
                    // Use raw fetch to avoid circular dependency with auth service
                    const refreshResponse = await fetch(`${API_BASE_URL}/auth/api/token/refresh/`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ refresh: refreshToken })
                    });

                    if (refreshResponse.ok) {
                        const refreshData = await refreshResponse.json();
                        localStorage.setItem('accessToken', refreshData.access_token);
                        // If new refresh token is returned, update it too
                        if (refreshData.refresh) {
                            localStorage.setItem('refreshToken', refreshData.refresh);
                        }

                        // Retry original request with new token
                        const newHeaders = { ...headers, 'Authorization': `JWT ${refreshData.access_token}` };
                        const retryConfig = { ...config, headers: newHeaders };
                        const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, retryConfig);

                        // Handle retry response
                        if (method === 'DELETE' && retryResponse.status === 204) {
                            return Promise.resolve(null as unknown as T);
                        }

                        // Recurse or just return result? Let's just return result to avoid deep nesting complexity for now
                        // Ideally we'd recursively call apiClient but config is already built. 
                        // Let's just process the retryResponse like a normal one.
                        if (responseType === 'blob') {
                            if (!retryResponse.ok) throw new Error(`API Error: ${retryResponse.status} ${retryResponse.statusText}`);
                            return await retryResponse.blob() as unknown as T;
                        }

                        // Check OK before parsing JSON to avoid syntax error on empty body
                        if (!retryResponse.ok) {
                            // Let it fall through to error handling below if retry fails too
                            const errData = await retryResponse.json();
                            // Quick re-throw to match outer structure or just let it fall through
                            // If we fall through, we need 'response' to be 'retryResponse'.
                            // Re-assigning const is not allowed.
                            // Let's return the parsed data directly if OK.
                            return await retryResponse.json() as T;
                        }

                        return await retryResponse.json() as T;
                    } else {
                        // Refresh failed (token expired or invalid)
                        // Clear tokens and let error propagate (or redirect to login)
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        localStorage.removeItem('user');
                        window.location.href = '/'; // Redirect to login
                        throw new Error('Session expired. Please login again.');
                    }
                } catch (refreshErr) {
                    // Network error or other issue during refresh
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/';
                    throw refreshErr;
                }
            }
        }

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

        if (!options.suppressGlobalError) {
            window.dispatchEvent(new CustomEvent('global-error', {
                detail: {
                    message: message,
                    title: 'Error'
                }
            }));
        }

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
