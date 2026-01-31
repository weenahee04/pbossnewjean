import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import brandsService from '../services/brandsService';

interface Brand {
  id: string;
  name: string;
  logo: string;
  category?: string;
}

interface BrandsContextType {
  brands: Brand[];
  recommendedBrands: Brand[];
  isLoading: boolean;
  error: string | null;
  fetchBrands: (params?: { category?: string; search?: string }) => Promise<void>;
  fetchRecommendedBrands: (limit?: number) => Promise<void>;
  refreshBrands: () => Promise<void>;
}

const BrandsContext = createContext<BrandsContextType | undefined>(undefined);

export const BrandsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [recommendedBrands, setRecommendedBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBrands = useCallback(async (params?: { category?: string; search?: string }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await brandsService.getBrands(params);
      setBrands(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'ไม่สามารถโหลดข้อมูลแบรนด์ได้';
      setError(errorMessage);
      console.error('Error fetching brands:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchRecommendedBrands = useCallback(async (limit: number = 8) => {
    try {
      const data = await brandsService.getRecommendedBrands(limit);
      setRecommendedBrands(data);
    } catch (err: any) {
      console.error('Error fetching recommended brands:', err);
    }
  }, []);

  const refreshBrands = useCallback(async () => {
    await Promise.all([
      fetchBrands(),
      fetchRecommendedBrands(),
    ]);
  }, [fetchBrands, fetchRecommendedBrands]);

  return (
    <BrandsContext.Provider
      value={{
        brands,
        recommendedBrands,
        isLoading,
        error,
        fetchBrands,
        fetchRecommendedBrands,
        refreshBrands,
      }}
    >
      {children}
    </BrandsContext.Provider>
  );
};

export const useBrands = () => {
  const context = useContext(BrandsContext);
  if (context === undefined) {
    throw new Error('useBrands must be used within a BrandsProvider');
  }
  return context;
};
