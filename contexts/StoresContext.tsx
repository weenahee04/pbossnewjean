import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import storesService from '../services/storesService';

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

interface StoresContextType {
  stores: Store[];
  nearbyStores: Store[];
  isLoading: boolean;
  error: string | null;
  fetchStores: (params?: { search?: string; latitude?: number; longitude?: number }) => Promise<void>;
  fetchNearbyStores: (latitude: number, longitude: number, radius?: number) => Promise<void>;
  refreshStores: () => Promise<void>;
}

const StoresContext = createContext<StoresContextType | undefined>(undefined);

export const StoresProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [nearbyStores, setNearbyStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStores = useCallback(async (params?: { search?: string; latitude?: number; longitude?: number }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await storesService.getStores(params);
      setStores(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'ไม่สามารถโหลดข้อมูลร้านค้าได้';
      setError(errorMessage);
      console.error('Error fetching stores:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchNearbyStores = useCallback(async (latitude: number, longitude: number, radius: number = 5) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await storesService.getNearbyStores(latitude, longitude, radius);
      setNearbyStores(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'ไม่สามารถโหลดข้อมูลร้านค้าใกล้เคียงได้';
      setError(errorMessage);
      console.error('Error fetching nearby stores:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshStores = useCallback(async () => {
    await fetchStores();
  }, [fetchStores]);

  return (
    <StoresContext.Provider
      value={{
        stores,
        nearbyStores,
        isLoading,
        error,
        fetchStores,
        fetchNearbyStores,
        refreshStores,
      }}
    >
      {children}
    </StoresContext.Provider>
  );
};

export const useStores = () => {
  const context = useContext(StoresContext);
  if (context === undefined) {
    throw new Error('useStores must be used within a StoresProvider');
  }
  return context;
};
