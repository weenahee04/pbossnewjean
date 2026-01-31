import apiClient from './api';
import { User } from '../types';

export interface LoginCredentials {
  phone: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterCredentials {
  name: string;
  phone: string;
  password: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
  message: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>('/auth/register', credentials);
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async forgotPassword(phone: string): Promise<void> {
    await apiClient.post('/auth/forgot-password', { phone });
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/reset-password', { token, newPassword });
  },

  async refreshToken(): Promise<{ token: string }> {
    const response = await apiClient.post<{ token: string }>('/auth/refresh');
    return response.data;
  },
};
