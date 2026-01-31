import api from './api';

interface Brand {
  id: string;
  name: string;
  logo: string;
  category?: string;
}

interface BrandsResponse {
  data: Brand[];
  total: number;
}

export const brandsService = {
  async getBrands(params?: {
    category?: string;
    search?: string;
    limit?: number;
  }): Promise<BrandsResponse> {
    const response = await api.get('/brands', { params });
    return response.data;
  },

  async getRecommendedBrands(limit: number = 8): Promise<Brand[]> {
    const response = await api.get('/brands/recommended', { params: { limit } });
    return response.data;
  },

  async getBrandById(id: string): Promise<Brand> {
    const response = await api.get(`/brands/${id}`);
    return response.data;
  },
};

export default brandsService;
