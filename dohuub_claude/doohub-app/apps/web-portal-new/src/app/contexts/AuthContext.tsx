import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "../../services/api";

interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "VENDOR" | "CUSTOMER";
  vendorId?: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
}

// Helper to normalize user data from API
const normalizeUser = (data: any): User | null => {
  if (!data) return null;

  const profile = data.profile || {};
  const name = profile.firstName && profile.lastName
    ? `${profile.firstName} ${profile.lastName}`
    : profile.firstName || profile.lastName || data.email?.split('@')[0] || 'User';

  return {
    id: data.id,
    email: data.email,
    name,
    role: data.role,
    vendorId: data.vendorId,
    profile: data.profile,
  };
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithOtp: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  sendOtp: (email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = api.getToken();
      console.log('[Auth] Checking session, token exists:', !!token);

      if (token) {
        try {
          const userData: any = await api.getCurrentUser();
          console.log('[Auth] Got user data:', userData);
          const normalized = normalizeUser(userData.user || userData);
          console.log('[Auth] Normalized user:', normalized);
          setUser(normalized);
        } catch (error: any) {
          console.error("[Auth] Failed to restore session:", error?.response?.status, error?.message);
          // Only clear tokens on 401 Unauthorized, not on network errors
          if (error?.response?.status === 401) {
            api.clearTokens();
          }
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('[Auth] Attempting login for:', email);
      const response: any = await api.login(email, password);
      console.log('[Auth] Login response:', response);

      if (response.success && response.data) {
        const normalized = normalizeUser(response.data.user);
        console.log('[Auth] Login successful, user:', normalized);
        setUser(normalized);
        return { success: true };
      }

      return { success: false, error: response.error || "Login failed" };
    } catch (error: any) {
      console.error("[Auth] Login error:", error?.response?.data || error?.message);
      return {
        success: false,
        error: error.response?.data?.error || "Invalid email or password"
      };
    }
  };

  const sendOtp = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response: any = await api.post('/auth/send-otp', { email });

      if (response.success) {
        return { success: true };
      }

      return { success: false, error: response.error || "Failed to send OTP" };
    } catch (error: any) {
      console.error("Send OTP error:", error);
      return {
        success: false,
        error: error.response?.data?.error || "Failed to send verification code"
      };
    }
  };

  const loginWithOtp = async (email: string, otp: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response: any = await api.post('/auth/verify-otp', { email, otp });

      if (response.success && response.data) {
        if (response.data.token) {
          api.setToken(response.data.token);
        }
        setUser(response.data.user);
        return { success: true };
      }

      return { success: false, error: response.error || "Invalid OTP" };
    } catch (error: any) {
      console.error("OTP verification error:", error);
      return {
        success: false,
        error: error.response?.data?.error || "Invalid verification code"
      };
    }
  };

  const logout = () => {
    api.clearTokens();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const userData: any = await api.getCurrentUser();
      const normalized = normalizeUser(userData.user || userData);
      setUser(normalized);
    } catch (error) {
      console.error("[Auth] Failed to refresh user:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithOtp,
        sendOtp,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
