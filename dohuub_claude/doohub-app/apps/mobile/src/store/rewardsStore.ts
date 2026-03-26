import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';

interface RewardsWallet {
  id: string;
  userId: string;
  totalPoints: number;
  pendingPoints: number;
  expiringPoints: number;
  expiringDate: string | null;
}

interface PointsTransaction {
  id: string;
  userId: string;
  type: 'EARNED' | 'REDEEMED' | 'EXPIRED' | 'BONUS' | 'REFERRAL';
  amount: number;
  description: string;
  bookingId: string | null;
  orderId: string | null;
  vendorName: string | null;
  createdAt: string;
}

interface UserStreak {
  id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveWeek: string | null;
}

interface CategoryMilestone {
  id: string;
  userId: string;
  category: string;
  orderCount: number;
  targetMilestone: number;
  pointsEarned: number;
  achieved: boolean;
  achievedDate: string | null;
}

interface Referral {
  id: string;
  referrerUserId: string;
  refereeUserId: string | null;
  referralCode: string;
  referralLink: string | null;
  status: string;
  pointsEarned: number;
  createdAt: string;
}

interface RewardsState {
  wallet: RewardsWallet | null;
  streak: UserStreak | null;
  milestones: CategoryMilestone[];
  transactions: PointsTransaction[];
  referrals: Referral[];
  isLoading: boolean;
  error: string | null;

  fetchWallet: () => Promise<void>;
  fetchStreak: () => Promise<void>;
  fetchMilestones: () => Promise<void>;
  fetchTransactions: (filter?: string) => Promise<void>;
  fetchReferrals: () => Promise<void>;
  clearError: () => void;
}

export const useRewardsStore = create<RewardsState>((set) => ({
  wallet: null,
  streak: null,
  milestones: [],
  transactions: [],
  referrals: [],
  isLoading: false,
  error: null,

  fetchWallet: async () => {
    set({ isLoading: true, error: null });
    try {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('RewardsWallet')
        .select('*')
        .eq('userId', userId)
        .single();

      if (error) throw error;
      set({ wallet: data as any, isLoading: false });
    } catch (error: any) {
      set({ wallet: null, isLoading: false, error: error.message });
    }
  },

  fetchStreak: async () => {
    set({ isLoading: true, error: null });
    try {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('UserStreak')
        .select('*')
        .eq('userId', userId)
        .single();

      if (error) throw error;
      set({ streak: data as any, isLoading: false });
    } catch (error: any) {
      set({ streak: null, isLoading: false, error: error.message });
    }
  },

  fetchMilestones: async () => {
    set({ isLoading: true, error: null });
    try {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('CategoryMilestone')
        .select('*')
        .eq('userId', userId)
        .order('category');

      if (error) throw error;
      set({ milestones: (data as any) || [], isLoading: false });
    } catch (error: any) {
      set({ milestones: [], isLoading: false, error: error.message });
    }
  },

  fetchTransactions: async (filter?: string) => {
    set({ isLoading: true, error: null });
    try {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) throw new Error('Not authenticated');

      let query = supabase
        .from('PointsTransaction')
        .select('*')
        .eq('userId', userId)
        .order('createdAt', { ascending: false });

      if (filter && filter !== 'All') {
        query = query.eq('type', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      set({ transactions: (data as any) || [], isLoading: false });
    } catch (error: any) {
      set({ transactions: [], isLoading: false, error: error.message });
    }
  },

  fetchReferrals: async () => {
    set({ isLoading: true, error: null });
    try {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('Referral')
        .select('*')
        .eq('referrerUserId', userId)
        .order('createdAt', { ascending: false });

      if (error) throw error;
      set({ referrals: (data as any) || [], isLoading: false });
    } catch (error: any) {
      set({ referrals: [], isLoading: false, error: error.message });
    }
  },

  clearError: () => set({ error: null }),
}));
