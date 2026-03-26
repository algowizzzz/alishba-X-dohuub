import { createContext, useContext, useState, ReactNode } from "react";

interface VendorSuspensionContextType {
  isSuspended: boolean;
  toggleSuspension: () => void;
}

const VendorSuspensionContext = createContext<VendorSuspensionContextType | undefined>(undefined);

export function VendorSuspensionProvider({ children }: { children: ReactNode }) {
  const [isSuspended, setIsSuspended] = useState(false);

  const toggleSuspension = () => {
    setIsSuspended((prev) => !prev);
  };

  return (
    <VendorSuspensionContext.Provider value={{ isSuspended, toggleSuspension }}>
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
