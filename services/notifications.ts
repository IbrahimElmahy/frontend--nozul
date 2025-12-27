import { apiClient } from '../apiClient';
import { Notification } from '../types';

export const listNotifications = async (): Promise<Notification[]> => {
    const response = await apiClient<{ data: Notification[] }>('/ar/notification/api/notifications/');
    return response.data;
};

export const markNotificationAsRead = async (id: string | number): Promise<void> => {
    // Assuming this endpoint exists based on standard practices, or placeholder.
    // Use proper error handling if endpoint is unknown.
    await apiClient(`/ar/notification/api/notifications/${id}/read/`, { method: 'POST' });
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
    await apiClient('/ar/notification/api/notifications/read-all/', { method: 'POST' });
};

export const deleteNotification = async (id: string | number): Promise<void> => {
    await apiClient(`/ar/notification/api/notifications/${id}/`, { method: 'DELETE' });
};
