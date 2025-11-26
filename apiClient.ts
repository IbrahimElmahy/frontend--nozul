import { User } from './types';

interface ApiClientOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: any;
}

export const apiClient = async <T>(endpoint: string, options: ApiClientOptions = {}): Promise<T> => {
    const { method = 'GET', body = null } = options;
    const token = localStorage.getItem('accessToken');
    if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
    }

    const isFormData = body instanceof FormData;

    const headers: HeadersInit = {
        'Authorization': `JWT ${token}`,
    };

    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    const config: RequestInit = {
        method,
        headers,
    };

    if (body) {
        config.body = isFormData ? body : JSON.stringify(body);
    }
    
    // For GET request with body, we should not send it. Instead we handle it with query params.
    if (method === 'GET' && body) {
        delete config.body;
    }


    try {
        const response = await fetch(`https://www.osusideas.online${endpoint}`, config);

        if (method === 'DELETE' && response.status === 204) {
            return Promise.resolve(null as unknown as T);
        }

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.detail || Object.values(responseData).flat().join(' ') || 'An unknown API error occurred');
        }

        return responseData as T;
    } catch (error) {
        if (error instanceof Error) {
            // Re-throw custom or network errors
            throw new Error(error.message || 'A network error occurred.');
        }
        // Handle unexpected error types
        throw new Error('An unexpected error occurred during the API call.');
    }
};
