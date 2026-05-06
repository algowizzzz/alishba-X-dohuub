import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  CreditCard,
  User,
  Settings,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface VendorSidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  activeMenu?: string;
}

export function VendorSidebar({
  isOpen,
  isCollapsed,
  onClose,
  activeMenu = "overview",
}: VendorSidebarProps) {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard, path: "/vendor/dashboard" },
    { id: "services", label: "My Services", icon: Package, path: "/vendor/services" },
    { id: "orders", label: "Orders", icon: ShoppingCart, path: "/vendor/orders" },
    { id: "subscription", label: "Subscription", icon: CreditCard, path: "/vendor/subscription-management" },
    { id: "profile", label: "Profile", icon: User, path: "/vendor/profile" },
    { id: "settings", label: "Settings", icon: Settings, path: "/vendor/settings" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const handleLogout = () => {
    navigate("/vendor/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-[72px] bottom-0 left-0 z-40
          bg-white border-r border-[rgba(46,122,217,0.25)]
          transition-all duration-300 ease-in-out
          ${isMobile 
            ? `${isOpen ? "translate-x-0" : "-translate-x-full"} w-[280px]`
            : `${isCollapsed ? "w-[72px]" : "w-[280px]"}`
          }
        `}
      >
        {/* Mobile Close Button */}
        {isMobile && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[#F0F7FF] lg:hidden"
          >
            <X className="w-5 h-5 text-[#6B7280]" />
          </button>
        )}

        {/* Menu Items */}
        <nav className="flex flex-col h-full py-4">
          <div className="flex-1 px-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-3 rounded-lg
                    transition-all duration-200
                    ${isActive
                      ? "bg-[#2E7AD9] text-white shadow-[0_4px_12px_rgba(46,122,217,0.25)]"
                      : "text-[#1A1A2E] hover:bg-[rgba(46,122,217,0.08)] hover:text-[#2E7AD9]"
                    }
                    ${isCollapsed && !isMobile ? "justify-center" : ""}
                  `}
                  title={isCollapsed && !isMobile ? item.label : undefined}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "" : "text-[#2E7AD9]"}`} />
                  {(!isCollapsed || isMobile) && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Logout Button */}
          <div className="px-3 pt-4 border-t border-[rgba(46,122,217,0.25)]">
            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center gap-3 px-3 py-3 rounded-lg
                text-[#DC2626] hover:bg-[#FEE2E2]
                transition-all duration-200
                ${isCollapsed && !isMobile ? "justify-center" : ""}
              `}
              title={isCollapsed && !isMobile ? "Logout" : undefined}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {(!isCollapsed || isMobile) && (
                <span className="text-sm font-medium">Logout</span>
              )}
            </button>
          </div>
        </nav>

        {/* Desktop Collapse Toggle */}
        {!isMobile && (
          <button
            onClick={onClose}
            className="absolute -right-3 top-6 w-6 h-6 bg-white border border-[rgba(46,122,217,0.25)] rounded-full flex items-center justify-center hover:bg-[#F0F7FF] transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-3 h-3 text-[#6B7280]" />
            ) : (
              <ChevronLeft className="w-3 h-3 text-[#6B7280]" />
            )}
          </button>
        )}
      </aside>
    </>
  );
}