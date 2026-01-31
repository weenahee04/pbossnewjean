import api from './api';

interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  latitude: number;
  longitude: number;
  distance?: number;
  image?: string;
}

interface StoresResponse {
  data: Store[];
  total: number;
}

export const storesService = {
  async getStores(params?: {
    search?: string;
    latitude?: number;
    longitude?: number;
    radius?: number;
  }): Promise<StoresResponse> {
    const response = await api.get('/stores', { params });
    return response.data;
  },

  async getNearbyStores(latitude: number, longitude: number, radius: number = 5): Promise<Store[]> {
    const response = await api.get('/stores/nearby', {
      params: { latitude, longitude, radius }
    });
    return response.data;
  },

  async getStoreById(id: string): Promise<Store> {
    const response = await api.get(`/stores/${id}`);
    return response.data;
  },
};

export default storesService;
