import { User } from './types';

export const apiClient = async <T>(endpoint: string): Promise<T> => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
    }

    try {
        const response = await fetch(`https://www.osusideas.online${endpoint}`, {
            method: 'GET',
            headers: {
                'Authorization': `JWT ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                errorData = { detail: `Request failed with status: ${response.status}` };
            }
            throw new Error(errorData.detail || 'An unknown API error occurred');
        }

        return response.json() as Promise<T>;
    } catch (error) {
        if (error instanceof Error) {
            // Re-throw custom or network errors
            throw new Error(error.message || 'A network error occurred.');
        }
        // Handle unexpected error types
        throw new Error('An unexpected error occurred during the API call.');
    }
};
