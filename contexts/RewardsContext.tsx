import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Reward } from '../types';
import rewardsService from '../services/rewardsService';
import toast from 'react-hot-toast';

interface RewardsContextType {
  rewards: Reward[];
  isLoading: boolean;
  error: string | null;
  fetchRewards: (params?: {
    category?: string;
    search?: string;
    sortBy?: 'points_asc' | 'points_desc' | 'popular';
  }) => Promise<void>;
  redeemReward: (rewardId: string) => Promise<boolean>;
  refreshRewards: () => Promise<void>;
}

const RewardsContext = createContext<RewardsContextType | undefined>(undefined);

export const RewardsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRewards = useCallback(async (params?: {
    category?: string;
    search?: string;
    sortBy?: 'points_asc' | 'points_desc' | 'popular';
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await rewardsService.getRewards(params);
      setRewards(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'ไม่สามารถโหลดข้อมูลของรางวัลได้';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching rewards:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const redeemReward = useCallback(async (rewardId: string): Promise<boolean> => {
    try {
      const response = await rewardsService.redeemReward(rewardId);
      
      if (response.success) {
        toast.success(response.message || 'แลกรางวัลสำเร็จ!');
        // Refresh rewards list after redemption
        await fetchRewards();
        return true;
      } else {
        toast.error(response.message || 'ไม่สามารถแลกรางวัลได้');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'เกิดข้อผิดพลาดในการแลกรางวัล';
      toast.error(errorMessage);
      console.error('Error redeeming reward:', err);
      return false;
    }
  }, [fetchRewards]);

  const refreshRewards = useCallback(async () => {
    await fetchRewards();
  }, [fetchRewards]);

  // Load rewards on mount
  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  return (
    <RewardsContext.Provider
      value={{
        rewards,
        isLoading,
        error,
        fetchRewards,
        redeemReward,
        refreshRewards,
      }}
    >
      {children}
    </RewardsContext.Provider>
  );
};

export const useRewards = () => {
  const context = useContext(RewardsContext);
  if (context === undefined) {
    throw new Error('useRewards must be used within a RewardsProvider');
  }
  return context;
};
