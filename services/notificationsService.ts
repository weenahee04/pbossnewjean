import api from './api';
import { Notification } from '../types';

interface NotificationsResponse {
  data: Notification[];
  total: number;
  unreadCount: number;
}

export const notificationsService = {
  async getNotifications(params?: {
    category?: string;
    unreadOnly?: boolean;
  }): Promise<NotificationsResponse> {
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  async markAsRead(notificationId: string): Promise<void> {
    await api.put(`/notifications/${notificationId}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await api.put('/notifications/read-all');
  },

  async deleteNotification(notificationId: string): Promise<void> {
    await api.delete(`/notifications/${notificationId}`);
  },

  async getUnreadCount(): Promise<{ count: number }> {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },
};

export default notificationsService;
