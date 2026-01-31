import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Notification } from '../types';
import notificationsService from '../services/notificationsService';
import toast from 'react-hot-toast';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  addNotification: (notification: Omit<Notification, 'id' | 'time'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAll: () => void;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await notificationsService.getNotifications();
      setNotifications(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'ไม่สามารถโหลดการแจ้งเตือนได้';
      setError(errorMessage);
      console.error('Error fetching notifications:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'time'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      time: 'เมื่อสักครู่',
      isUnread: true,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await notificationsService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isUnread: false } : n))
      );
    } catch (err: any) {
      console.error('Error marking notification as read:', err);
      toast.error('ไม่สามารถอัปเดตสถานะการแจ้งเตือนได้');
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
      toast.success('อ่านทั้งหมดแล้ว');
    } catch (err: any) {
      console.error('Error marking all as read:', err);
      toast.error('ไม่สามารถอัปเดตสถานะการแจ้งเตือนได้');
    }
  }, []);

  const clearNotification = useCallback(async (id: string) => {
    try {
      await notificationsService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.success('ลบการแจ้งเตือนแล้ว');
    } catch (err: any) {
      console.error('Error deleting notification:', err);
      toast.error('ไม่สามารถลบการแจ้งเตือนได้');
    }
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const refreshNotifications = useCallback(async () => {
    await fetchNotifications();
  }, [fetchNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        error,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAll,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
