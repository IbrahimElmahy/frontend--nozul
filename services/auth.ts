import { apiClient } from '../apiClient';
import { User } from '../types';

interface LoginResponse {
    access_token: string;
    // user might be included or not, based on LoginPage trace it seems it is.
    // However, LoginPage says: localStorage.setItem('user', JSON.stringify(data)); 
    // implying 'data' is the whole response and it *contains* user info or IS the user info merged with token.
    // Let's type it loosely first to match current behavior, or refine if possible.
    // Looking at LoginPage: const data = await response.json(); ... localStorage.setItem('accessToken', data.access_token);
    [key: string]: any;
}

export const login = async (credentials: FormData): Promise<LoginResponse> => {
    // Note: The backend seems to require specific language prefixes for Auth sometimes, 
    // but apiClient handles Accept-Language. 
    // Original code used `${API_BASE_URL}/ar/auth/api/sessions/login/`.
    // We will try to use the generic path if possible, or preserve the /ar/ if it's a hard requirement regardless of header.
    // Let's assume /ar/ was hardcoded; we'll try to rely on apiClient's header logic or just use a relative path.
    // However, apiClient prepends API_BASE_URL.
    // The original code used `fetch` directly.
    // We'll use apiClient but we need to pass the FormData.

    // Using '/auth/api/sessions/login/' (standard Django pattern normally)
    // If it fails with 404, we might need the language prefix. 
    // For now, let's Stick to the existing pattern but via apiClient? 
    // Actually, apiClient usually takes a path relative to BASE_URL.

    // We will use the non-prefixed path and let Nginx/Backend handle language via header if configured,
    // OR we might need to manually handle it. 
    // Given the previous code had `/ar/` hardcoded, let's try to be cleaner.
    // But to be safe and match `LoginPage` logic exactly for now (EXECUTION phase):

    return apiClient<LoginResponse>('/ar/auth/api/sessions/login/', {
        method: 'POST',
        body: credentials // apiClient handles FormData
    });
};

export const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberedUser');
    // If backend has logout endpoint:
    // await apiClient('/auth/api/sessions/logout/', { method: 'POST' });
};

export const getCurrentUser = (): User | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
};
