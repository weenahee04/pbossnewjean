import api from './api';

interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  discount: string;
  expiryDate: string;
  image?: string;
  category: string;
  isUsed: boolean;
  usedAt?: string;
}

interface CouponsResponse {
  data: Coupon[];
  total: number;
  page: number;
  limit: number;
}

export const couponsService = {
  async getCoupons(params?: {
    status?: 'available' | 'used' | 'expired';
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<CouponsResponse> {
    const response = await api.get('/coupons', { params });
    return response.data;
  },

  async getCouponById(id: string): Promise<Coupon> {
    const response = await api.get(`/coupons/${id}`);
    return response.data;
  },

  async useCoupon(couponId: string): Promise<{ success: boolean; message: string }> {
    const response = await api.post(`/coupons/${couponId}/use`);
    return response.data;
  },

  async getAvailableCoupons(): Promise<Coupon[]> {
    const response = await api.get('/coupons/available');
    return response.data;
  },
};

export default couponsService;
