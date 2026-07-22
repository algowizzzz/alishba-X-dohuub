import { create } from 'zustand';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import api from '../services/api';

// Keep api client's stored token in sync with Supabase session.
// API's auth middleware validates Supabase JWTs via supabase.auth.getUser().
async function syncApiToken(session: Session | null) {
  if (session?.access_token) {
    await api.setToken(session.access_token);
    if (session.refresh_token) await api.setRefreshToken(session.refresh_token);
  } else {
    await api.clearTokens();
  }
}

interface User {
  id: string;
  email: string;
  phone?: string;
  role: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
  profile?: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  isEmailVerified: boolean;
}

interface Address {
  id: string;
  type: 'HOME' | 'WORK' | 'DOCTOR' | 'PHARMACY' | 'OTHER';
  label: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  addresses: Address[];
  selectedAddressId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;

  // Auth actions (Supabase)
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string) => Promise<User>;
  verifyOtp: (email: string, code: string, isRegistration: boolean) => Promise<User>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  setSession: (session: Session, options?: { refreshUser?: boolean }) => void;
  clearSession: () => void;

  // Profile actions
  updateProfile: (data: any) => Promise<void>;

  // Address actions
  setSelectedAddress: (addressId: string) => void;
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  updateAddress: (id: string, address: Partial<Address>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  fetchAddresses: () => Promise<void>;

  // Onboarding
  setOnboardingComplete: () => void;
}

// Helper: fetch user profile + role from the API (same path as profile updates).
// Falls back to Supabase only if the API is unreachable.
async function fetchUserFromDb(authUserId: string, email: string): Promise<User> {
  try {
    const response = await api.get<{ success: boolean; data?: any }>('/users/me');
    if (response?.success && response.data) {
      const dbUser = response.data;
      return {
        id: dbUser.id || authUserId,
        email: dbUser.email || email,
        phone: dbUser.phone || undefined,
        role: dbUser.role || 'CUSTOMER',
        isEmailVerified: true,
        profile: {
          firstName: dbUser.profile?.firstName || '',
          lastName: dbUser.profile?.lastName || '',
          avatar: dbUser.profile?.avatar || undefined,
        },
      };
    }
  } catch (err) {
    console.warn('[auth] GET /users/me failed, falling back to Supabase', err);
  }

  // Fallback: public tables via Supabase (may be empty under RLS)
  const { data: dbUser, error: dbError } = await supabase
    .from('User')
    .select('id, email, phone, role, UserProfile(firstName, lastName, avatar)')
    .eq('id', authUserId)
    .single();

  if (dbError || !dbUser) {
    return {
      id: authUserId,
      email,
      role: 'CUSTOMER' as const,
      isEmailVerified: false,
      profile: { firstName: '', lastName: '' },
    };
  }

  const profile = Array.isArray(dbUser.UserProfile) ? dbUser.UserProfile[0] : dbUser.UserProfile;
  return {
    id: dbUser.id,
    email: dbUser.email || email,
    phone: dbUser.phone || undefined,
    role: dbUser.role || 'CUSTOMER',
    isEmailVerified: true,
    profile: {
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      avatar: profile?.avatar || undefined,
    },
  };
}

// Helper: load addresses from the API (same path as create/update/delete)
async function loadAddresses(userId: string): Promise<{ addresses: Address[]; selectedId: string | null }> {
  try {
    const response = await api.get<{ success: boolean; data?: any[] }>('/addresses');
    const rows = response?.data || [];
    const addresses: Address[] = rows.map((a: any) => ({
      id: a.id,
      type: a.type,
      label: a.label,
      street: a.street,
      apartment: a.apartment || undefined,
      city: a.city,
      state: a.state,
      zipCode: a.zipCode,
      country: a.country,
      latitude: a.latitude ?? undefined,
      longitude: a.longitude ?? undefined,
      isDefault: !!a.isDefault,
    }));

    const defaultAddr = addresses.find((a) => a.isDefault);
    return { addresses, selectedId: defaultAddr?.id || addresses[0]?.id || null };
  } catch (err) {
    console.warn('[auth] GET /addresses failed, falling back to Supabase', err);
    const { data } = await supabase
      .from('Address')
      .select('*')
      .eq('userId', userId)
      .order('isDefault', { ascending: false });

    const addresses: Address[] = (data || []).map((a: any) => ({
      id: a.id,
      type: a.type,
      label: a.label,
      street: a.street,
      apartment: a.apartment || undefined,
      city: a.city,
      state: a.state,
      zipCode: a.zipCode,
      country: a.country,
      latitude: a.latitude || undefined,
      longitude: a.longitude || undefined,
      isDefault: !!a.isDefault,
    }));

    const defaultAddr = addresses.find((a) => a.isDefault);
    return { addresses, selectedId: defaultAddr?.id || addresses[0]?.id || null };
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  addresses: [],
  selectedAddressId: null,
  isAuthenticated: false,
  isLoading: false,
  hasCompletedOnboarding: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      await syncApiToken(data.session);
      const user = await fetchUserFromDb(data.user.id, email);

      set({
        user,
        session: data.session,
        isAuthenticated: true,
      });

      // Load addresses in background
      loadAddresses(data.user.id).then(({ addresses, selectedId }) => {
        set({ addresses, selectedAddressId: selectedId });
      });

      return user;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (email: string, _password: string) => {
    set({ isLoading: true });
    try {
      // Use signInWithOtp — works for both new and existing users, sends OTP email
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      });

      if (error) throw error;

      // Return a placeholder user — real user is set after OTP verification
      return {
        id: '',
        email,
        role: 'CUSTOMER' as const,
        isEmailVerified: false,
        profile: { firstName: '', lastName: '' },
      };
    } finally {
      set({ isLoading: false });
    }
  },

  verifyOtp: async (email: string, code: string, isRegistration: boolean) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'email',
      });

      if (error) throw error;
      if (!data.session || !data.user) {
        throw new Error('Verification did not return a session');
      }

      await syncApiToken(data.session);
      const user = await fetchUserFromDb(data.user.id, data.user.email || email);

      set({
        user,
        session: data.session,
        isAuthenticated: true,
      });

      // Load addresses in background — new registrations won't have any yet
      loadAddresses(data.user.id).then(({ addresses, selectedId }) => {
        set({ addresses, selectedAddressId: selectedId });
      });

      return user;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // Ignore error
    }
    await syncApiToken(null);
    set({
      user: null,
      session: null,
      addresses: [],
      selectedAddressId: null,
      isAuthenticated: false,
    });
  },

  fetchUser: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        await syncApiToken(session);
        const user = await fetchUserFromDb(session.user.id, session.user.email || '');

        set({
          user,
          session,
          isAuthenticated: true,
        });

        // Load addresses
        const { addresses, selectedId } = await loadAddresses(session.user.id);
        set({ addresses, selectedAddressId: selectedId });
      } else {
        await syncApiToken(null);
        set({ isAuthenticated: false, user: null, session: null });
      }
    } catch (e) {
      set({ isAuthenticated: false, user: null, session: null });
    }
  },

  setSession: (session: Session, options?: { refreshUser?: boolean }) => {
    const refreshUser = options?.refreshUser !== false;

    // Set basic auth state immediately, then enrich from API
    set({
      session,
      isAuthenticated: true,
    });

    (async () => {
      await syncApiToken(session);

      if (!refreshUser && get().user) {
        // Token refresh only — keep existing profile in memory
        return;
      }

      const user = await fetchUserFromDb(session.user.id, session.user.email || '');
      set({ user });

      const { addresses, selectedId } = await loadAddresses(session.user.id);
      set({ addresses, selectedAddressId: selectedId });
    })().catch((err) => {
      console.warn('[auth] setSession enrichment failed', err);
    });
  },

  clearSession: () => {
    set({
      user: null,
      session: null,
      isAuthenticated: false,
      addresses: [],
      selectedAddressId: null,
    });
  },

  updateProfile: async (data: any) => {
    set({ isLoading: true });
    try {
      const response = await api.put<{ success: boolean; data: any; error?: string }>(
        '/users/me',
        {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          avatar: data.avatar,
        }
      );
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Profile update failed');
      }

      const updated = response.data;
      const currentUser = get().user;
      if (currentUser) {
        set({
          user: {
            ...currentUser,
            phone: updated.phone ?? data.phone ?? currentUser.phone,
            profile: {
              firstName: updated.profile?.firstName ?? data.firstName ?? '',
              lastName: updated.profile?.lastName ?? data.lastName ?? '',
              avatar: updated.profile?.avatar ?? data.avatar ?? currentUser.profile?.avatar,
            },
          },
        });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedAddress: (addressId: string) => {
    set({ selectedAddressId: addressId });
  },

  addAddress: async (address: Omit<Address, 'id'>) => {
    set({ isLoading: true });
    try {
      const response = await api.post<{ success: boolean; data: Address; error?: string }>(
        '/addresses',
        address
      );
      if (!response.success || !response.data) throw new Error(response.error || 'Add address failed');
      const newAddress = response.data;
      set((state) => ({
        addresses: newAddress.isDefault
          ? [...state.addresses.map((a) => ({ ...a, isDefault: false })), newAddress]
          : [...state.addresses, newAddress],
        selectedAddressId: newAddress.isDefault ? newAddress.id : state.selectedAddressId || newAddress.id,
      }));
    } finally {
      set({ isLoading: false });
    }
  },

  updateAddress: async (id: string, address: Partial<Address>) => {
    set({ isLoading: true });
    try {
      const response = await api.put<{ success: boolean; data: Address; error?: string }>(
        `/addresses/${id}`,
        address
      );
      if (!response.success || !response.data) throw new Error(response.error || 'Update address failed');
      const updated = response.data;
      set((state) => ({
        addresses: state.addresses.map((a) =>
          a.id === id ? updated : updated.isDefault ? { ...a, isDefault: false } : a
        ),
      }));
    } finally {
      set({ isLoading: false });
    }
  },

  deleteAddress: async (id: string) => {
    set({ isLoading: true });
    try {
      await api.delete(`/addresses/${id}`);
      set((state) => ({
        addresses: state.addresses.filter((a) => a.id !== id),
        selectedAddressId: state.selectedAddressId === id ? state.addresses[0]?.id || null : state.selectedAddressId,
      }));
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAddresses: async () => {
    const userId = get().user?.id;
    if (!userId) return;
    const { addresses, selectedId } = await loadAddresses(userId);
    set({ addresses, selectedAddressId: get().selectedAddressId || selectedId });
  },

  setOnboardingComplete: () => {
    set({ hasCompletedOnboarding: true });
  },
}));
