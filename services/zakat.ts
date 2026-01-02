import { apiClient } from '../apiClient';

export interface ZakatStatusResponse {
    zatca_subscription: boolean;
    zatca_environment: string;
    zatca_onboarding_status: string;
    is_ready: boolean;
    last_icv: number;
}

export interface ZakatOnboardResponse {
    status: string;
    message: string;
    csr?: string;
    certificate?: string;
}

export const activateZakatIntegration = async (otp: string, lang: string = 'ar'): Promise<ZakatOnboardResponse> => {
    return apiClient<ZakatOnboardResponse>(`/${lang}/hotel/api/zatca/onboard/`, {
        method: 'POST',
        body: { otp }
    });
};

export const checkZakatStatus = async (lang: string = 'ar'): Promise<ZakatStatusResponse> => {
    return apiClient<ZakatStatusResponse>(`/${lang}/hotel/api/zatca/status/`);
};

export const testZakatReport = async (invoiceId?: number, lang: string = 'ar') => {
    return apiClient(`/${lang}/hotel/api/zatca/test-report/`, {
        method: 'POST',
        body: { invoice_id: invoiceId }
    });
};
