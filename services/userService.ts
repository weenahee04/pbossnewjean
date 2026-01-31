import apiClient from './api';
import { User, Transaction, Reward } from '../types';

export const userService = {
  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/user/profile');
    return response.data;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>('/user/profile', data);
    return response.data;
  },

  async getTransactions(): Promise<Transaction[]> {
    const response = await apiClient.get<Transaction[]>('/user/transactions');
    return response.data;
  },

  async getRewards(): Promise<Reward[]> {
    const response = await apiClient.get<Reward[]>('/rewards');
    return response.data;
  },

  async redeemReward(rewardId: string): Promise<void> {
    await apiClient.post(`/rewards/${rewardId}/redeem`);
  },

  async addPoints(amount: number): Promise<User> {
    const response = await apiClient.post<User>('/user/points/add', { amount });
    return response.data;
  },

  async topUpWallet(amount: number): Promise<User> {
    const response = await apiClient.post<User>('/user/wallet/topup', { amount });
    return response.data;
  },
};
