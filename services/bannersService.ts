import api from './api';

interface Banner {
  id: string;
  image: string;
  title?: string;
  description?: string;
  link?: string;
  order: number;
}

export const bannersService = {
  async getBanners(): Promise<Banner[]> {
    const response = await api.get('/banners');
    return response.data;
  },

  async getActiveBanners(): Promise<Banner[]> {
    const response = await api.get('/banners/active');
    return response.data;
  },
};

export default bannersService;
