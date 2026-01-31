import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Deal } from '../types';
import dealsService from '../services/dealsService';
import toast from 'react-hot-toast';

interface DealsContextType {
  deals: Deal[];
  latestDeals: Deal[];
  specialOffers: Deal[];
  isLoading: boolean;
  error: string | null;
  fetchDeals: (params?: { category?: string; search?: string }) => Promise<void>;
  fetchLatestDeals: (limit?: number) => Promise<void>;
  fetchSpecialOffers: (limit?: number) => Promise<void>;
  refreshDeals: () => Promise<void>;
}

const DealsContext = createContext<DealsContextType | undefined>(undefined);

export const DealsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [latestDeals, setLatestDeals] = useState<Deal[]>([]);
  const [specialOffers, setSpecialOffers] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDeals = useCallback(async (params?: { category?: string; search?: string }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await dealsService.getDeals(params);
      setDeals(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'ไม่สามารถโหลดข้อมูลดีลได้';
      setError(errorMessage);
      console.error('Error fetching deals:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchLatestDeals = useCallback(async (limit: number = 5) => {
    try {
      const data = await dealsService.getLatestDeals(limit);
      setLatestDeals(data);
    } catch (err: any) {
      console.error('Error fetching latest deals:', err);
    }
  }, []);

  const fetchSpecialOffers = useCallback(async (limit: number = 5) => {
    try {
      const data = await dealsService.getSpecialOffers(limit);
      setSpecialOffers(data);
    } catch (err: any) {
      console.error('Error fetching special offers:', err);
    }
  }, []);

  const refreshDeals = useCallback(async () => {
    await Promise.all([
      fetchDeals(),
      fetchLatestDeals(),
      fetchSpecialOffers(),
    ]);
  }, [fetchDeals, fetchLatestDeals, fetchSpecialOffers]);

  return (
    <DealsContext.Provider
      value={{
        deals,
        latestDeals,
        specialOffers,
        isLoading,
        error,
        fetchDeals,
        fetchLatestDeals,
        fetchSpecialOffers,
        refreshDeals,
      }}
    >
      {children}
    </DealsContext.Provider>
  );
};

export const useDeals = () => {
  const context = useContext(DealsContext);
  if (context === undefined) {
    throw new Error('useDeals must be used within a DealsProvider');
  }
  return context;
};
