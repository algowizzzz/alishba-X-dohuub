import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabase";
import {
  LayoutDashboard,
  User,
  Building2,
  Flag,
  Users,
  Package,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  LucideIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

interface AdminSidebarProps {
  activeMenu: string;
}

export function AdminSidebar({ activeMenu }: AdminSidebarProps) {
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { id: "michelle", icon: User, label: "Michelle's Services", path: "/admin/michelle-profiles" },
    { id: "vendors", icon: Building2, label: "Vendors", path: "/admin/vendors" },
    { id: "listings", icon: Flag, label: "Listings", path: "/admin/listings" },
    { id: "moderation", icon: Flag, label: "Moderation", badge: "3", path: "/admin/moderation" },
    { id: "customers", icon: Users, label: "Customers", path: "/admin/customers" },
    { id: "orders", icon: Package, label: "Orders", path: "/admin/orders" },
    { id: "notifications", icon: Bell, label: "Push Notifications", path: "/admin/push-notifications" },
    { id: "reports", icon: BarChart3, label: "Reports", path: "/admin/reports" },
    { id: "settings", icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <>
      <div className="fixed left-0 top-[72px] w-[280px] h-[calc(100vh-72px)] bg-white border-r border-[rgba(46,122,217,0.25)] p-4 flex flex-col">
        <div className="space-y-1 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full h-11 flex items-center gap-3 px-4 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#2E7AD9] text-white shadow-[0_4px_12px_rgba(46,122,217,0.25)]'
                    : 'text-[#1A1A2E] hover:bg-[rgba(46,122,217,0.08)] hover:text-[#2E7AD9]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? '' : 'text-[#2E7AD9]'}`} />
                <span className="text-[15px] font-medium">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-[#DC2626] text-white text-xs px-1.5 py-0.5 rounded">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Logout Button */}
        <Button
          onClick={() => setShowLogoutDialog(true)}
          variant="outline"
          className="w-full h-11 flex items-center justify-center gap-3 border border-[rgba(46,122,217,0.25)] hover:bg-[#FEE2E2] hover:border-[#DC2626] hover:text-[#DC2626] transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[15px]">Logout</span>
        </Button>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
            <AlertDialogDescription>
              You will need to login again to access the admin panel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}