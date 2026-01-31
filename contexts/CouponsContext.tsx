import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import couponsService from '../services/couponsService';
import toast from 'react-hot-toast';

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

interface CouponsContextType {
  coupons: Coupon[];
  availableCoupons: Coupon[];
  isLoading: boolean;
  error: string | null;
  fetchCoupons: (params?: { status?: 'available' | 'used' | 'expired'; category?: string }) => Promise<void>;
  fetchAvailableCoupons: () => Promise<void>;
  useCoupon: (couponId: string) => Promise<boolean>;
  refreshCoupons: () => Promise<void>;
}

const CouponsContext = createContext<CouponsContextType | undefined>(undefined);

export const CouponsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCoupons = useCallback(async (params?: { status?: 'available' | 'used' | 'expired'; category?: string }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await couponsService.getCoupons(params);
      setCoupons(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'ไม่สามารถโหลดข้อมูลคูปองได้';
      setError(errorMessage);
      console.error('Error fetching coupons:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAvailableCoupons = useCallback(async () => {
    try {
      const data = await couponsService.getAvailableCoupons();
      setAvailableCoupons(data);
    } catch (err: any) {
      console.error('Error fetching available coupons:', err);
    }
  }, []);

  const useCoupon = useCallback(async (couponId: string): Promise<boolean> => {
    try {
      const response = await couponsService.useCoupon(couponId);
      
      if (response.success) {
        toast.success(response.message || 'ใช้คูปองสำเร็จ!');
        await fetchCoupons();
        return true;
      } else {
        toast.error(response.message || 'ไม่สามารถใช้คูปองได้');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'เกิดข้อผิดพลาดในการใช้คูปอง';
      toast.error(errorMessage);
      console.error('Error using coupon:', err);
      return false;
    }
  }, [fetchCoupons]);

  const refreshCoupons = useCallback(async () => {
    await Promise.all([
      fetchCoupons(),
      fetchAvailableCoupons(),
    ]);
  }, [fetchCoupons, fetchAvailableCoupons]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  return (
    <CouponsContext.Provider
      value={{
        coupons,
        availableCoupons,
        isLoading,
        error,
        fetchCoupons,
        fetchAvailableCoupons,
        useCoupon,
        refreshCoupons,
      }}
    >
      {children}
    </CouponsContext.Provider>
  );
};

export const useCoupons = () => {
  const context = useContext(CouponsContext);
  if (context === undefined) {
    throw new Error('useCoupons must be used within a CouponsProvider');
  }
  return context;
};
