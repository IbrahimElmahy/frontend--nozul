import { apiClient } from '../apiClient';

export const activateZakatIntegration = async (otp: string) => {
    const response = await apiClient.post('/zakat/activate', { otp });
    return response.data;
};

export const checkZakatStatus = async () => {
    const response = await apiClient.get('/zakat/status');
    return response.data;
};
