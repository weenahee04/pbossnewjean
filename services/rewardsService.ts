import api from './api';
import { Reward } from '../types';

// API Response Types
interface RewardsResponse {
  data: Reward[];
  total: number;
  page: number;
  limit: number;
}

interface RedeemResponse {
  success: boolean;
  message: string;
  couponCode?: string;
  transactionId?: string;
  remainingPoints: number;
}

// Rewards Service
export const rewardsService = {
  // ดึงรายการของรางวัลทั้งหมด
  async getRewards(params?: {
    category?: string;
    search?: string;
    sortBy?: 'points_asc' | 'points_desc' | 'popular';
    page?: number;
    limit?: number;
  }): Promise<RewardsResponse> {
    const response = await api.get('/rewards', { params });
    return response.data;
  },

  // ดึงของรางวัลตาม ID
  async getRewardById(id: string): Promise<Reward> {
    const response = await api.get(`/rewards/${id}`);
    return response.data;
  },

  // ดึงของรางวัลยอดนิยม
  async getPopularRewards(limit: number = 5): Promise<Reward[]> {
    const response = await api.get('/rewards/popular', { params: { limit } });
    return response.data;
  },

  // ดึงของรางวัลตามหมวดหมู่
  async getRewardsByCategory(category: string): Promise<Reward[]> {
    const response = await api.get(`/rewards/category/${category}`);
    return response.data;
  },

  // แลกของรางวัล
  async redeemReward(rewardId: string): Promise<RedeemResponse> {
    const response = await api.post('/rewards/redeem', { rewardId });
    return response.data;
  },

  // ตรวจสอบคะแนนที่มี
  async checkPoints(): Promise<{ points: number }> {
    const response = await api.get('/user/points');
    return response.data;
  },

  // ดึงประวัติการแลกของรางวัล
  async getRedemptionHistory(params?: {
    page?: number;
    limit?: number;
  }): Promise<any> {
    const response = await api.get('/rewards/history', { params });
    return response.data;
  },
};

// Supabase Service (สำหรับกรณีใช้ Supabase)
export const supabaseRewardsService = {
  // ฟังก์ชันสำหรับ Supabase จะเพิ่มเมื่อได้ config
  // ตัวอย่าง:
  /*
  async getRewards(supabase: SupabaseClient) {
    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .order('points', { ascending: true });
    
    if (error) throw error;
    return data;
  },
  
  async redeemReward(supabase: SupabaseClient, rewardId: string, userId: string) {
    const { data, error } = await supabase
      .rpc('redeem_reward', { reward_id: rewardId, user_id: userId });
    
    if (error) throw error;
    return data;
  }
  */
};

export default rewardsService;
