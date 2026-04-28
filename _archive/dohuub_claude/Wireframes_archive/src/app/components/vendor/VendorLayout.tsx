import { Outlet } from "react-router-dom";
import { VendorSuspensionProvider } from "../../contexts/VendorSuspensionContext";
import { VendorSuspensionOverlay } from "./VendorSuspensionOverlay";

export function VendorLayout() {
  return (
    <VendorSuspensionProvider>
      <VendorSuspensionOverlay />
      <Outlet />
    </VendorSuspensionProvider>
  );
}
