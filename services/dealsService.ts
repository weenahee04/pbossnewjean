import api from './api';
import { Deal } from '../types';

interface DealsResponse {
  data: Deal[];
  total: number;
  page: number;
  limit: number;
}

export const dealsService = {
  async getDeals(params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<DealsResponse> {
    const response = await api.get('/deals', { params });
    return response.data;
  },

  async getLatestDeals(limit: number = 5): Promise<Deal[]> {
    const response = await api.get('/deals/latest', { params: { limit } });
    return response.data;
  },

  async getSpecialOffers(limit: number = 5): Promise<Deal[]> {
    const response = await api.get('/deals/special', { params: { limit } });
    return response.data;
  },

  async getDealById(id: string): Promise<Deal> {
    const response = await api.get(`/deals/${id}`);
    return response.data;
  },
};

export default dealsService;
