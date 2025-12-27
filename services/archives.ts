import { apiClient } from '../apiClient';
import { ArchiveLog } from '../types';

export interface ArchiveLogResponse {
    data: ArchiveLog[];
    recordsFiltered: number;
}

export const listArchiveLogs = async (params?: URLSearchParams) => {
    const qs = params ? `?${params.toString()}` : '';
    return apiClient<ArchiveLogResponse>(`/ar/archive/api/archive/${qs}`);
};
