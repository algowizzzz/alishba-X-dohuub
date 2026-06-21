import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import api from "../../services/api";

interface VendorSuspensionContextType {
  isSuspended: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
}

const VendorSuspensionContext = createContext<VendorSuspensionContextType | undefined>(undefined);

export function VendorSuspensionProvider({ children }: { children: ReactNode }) {
  const [isSuspended, setIsSuspended] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res: any = await api.get(`/api/v1/vendors/me`);
      const v = res?.data?.data || res?.data || null;
      if (!v) {
        setIsSuspended(false);
      } else {
        const suspended =
          v.status === "SUSPENDED" ||
          v.status === "REJECTED" ||
          v.isActive === false;
        setIsSuspended(!!suspended);
      }
    } catch (e: any) {
      // 403 from requireActiveVendor would mean suspended too, but /vendors/me
      // is a read endpoint so it only 403s when the vendor profile is missing.
      // Treat any error as not-suspended to avoid locking out on transient
      // network issues; the API's middleware enforces the real check.
      setIsSuspended(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refresh]);

  return (
    <VendorSuspensionContext.Provider value={{ isSuspended, loading, refresh }}>
      {children}
    </VendorSuspensionContext.Provider>
  );
}

export function useVendorSuspension() {
  const context = useContext(VendorSuspensionContext);
  if (context === undefined) {
    throw new Error("useVendorSuspension must be used within a VendorSuspensionProvider");
  }
  return context;
}
