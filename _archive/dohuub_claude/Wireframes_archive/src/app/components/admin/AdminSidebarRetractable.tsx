import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Building2,
  Flag,
  Users,
  Package,
  Bell,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { Button } from "../ui/button";

interface AdminSidebarRetractableProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  activeMenu?: string;
}

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: number;
  key: string;
}

export function AdminSidebarRetractable({
  isOpen,
  isCollapsed,
  onClose,
  activeMenu = "dashboard",
}: AdminSidebarRetractableProps) {
  const menuItems: MenuItem[] = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard", href: "/admin/dashboard", key: "dashboard" },
    { icon: <User className="w-5 h-5" />, label: "Michelle's Services", href: "/admin/michelle-profiles", key: "michelle" },
    { icon: <Building2 className="w-5 h-5" />, label: "Vendors", href: "/admin/vendors", key: "vendors" },
    { icon: <Flag className="w-5 h-5" />, label: "Moderation", href: "/admin/moderation", key: "moderation", badge: 3 },
    { icon: <Users className="w-5 h-5" />, label: "Customers", href: "/admin/customers", key: "customers" },
    { icon: <Package className="w-5 h-5" />, label: "Orders", href: "/admin/orders", key: "orders" },
    { icon: <Bell className="w-5 h-5" />, label: "Push Notifications", href: "/admin/push-notifications", key: "notifications" },
    { icon: <Settings className="w-5 h-5" />, label: "Settings", href: "/admin/settings", key: "settings" },
  ];

  return (
    <>
      {/* Backdrop for mobile/tablet overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-[72px] bottom-0 left-0 bg-white border-r border-[#E5E7EB] z-40
          transition-all duration-300 ease-in-out
          ${isCollapsed && !isOpen ? 'w-[72px]' : 'w-[280px]'}
          ${!isOpen && 'max-lg:-translate-x-full'}
          ${isOpen && 'translate-x-0'}
          lg:translate-x-0
        `}
      >
        <div className="h-full flex flex-col">
          {/* Close button (mobile only) */}
          <div className="lg:hidden flex items-center justify-end p-4 border-b border-[#E5E7EB]">
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F4F6] transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-[#6B7280]" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 py-6 overflow-y-auto">
            <ul className="space-y-1 px-3">
              {menuItems.map((item) => {
                const isActive = activeMenu === item.key;
                return (
                  <li key={item.key}>
                    <Link
                      to={item.href}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                        ${isActive
                          ? 'bg-[#1F2937] text-white'
                          : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#1F2937]'
                        }
                        ${isCollapsed && !isOpen ? 'justify-center' : ''}
                      `}
                      title={isCollapsed && !isOpen ? item.label : undefined}
                    >
                      <span className={isActive ? 'text-white' : ''}>{item.icon}</span>
                      {(!isCollapsed || isOpen) && (
                        <>
                          <span className="text-sm font-medium flex-1">{item.label}</span>
                          {item.badge && (
                            <span className={`
                              px-2 py-0.5 text-xs font-semibold rounded-full
                              ${isActive ? 'bg-white/20 text-white' : 'bg-[#DC2626] text-white'}
                            `}>
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                      {isCollapsed && !isOpen && item.badge && (
                        <span className="absolute top-2 right-2 w-2 h-2 bg-[#DC2626] rounded-full" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-3 border-t border-[#E5E7EB]">
            <Button
              variant="ghost"
              className={`
                w-full justify-start gap-3 text-[#6B7280] hover:text-[#DC2626] hover:bg-[#FEE2E2]
                ${isCollapsed && !isOpen ? 'justify-center' : ''}
              `}
              asChild
            >
              <Link to="/admin">
                <LogOut className="w-5 h-5" />
                {(!isCollapsed || isOpen) && <span className="text-sm font-medium">Logout</span>}
              </Link>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}