import { useState, useEffect } from "react";
import {
  Bell,
  Send,
  Clock,
  CheckCircle,
  Users,
  Smartphone,
  Plus,
} from "lucide-react";
import { api } from "../../../services/api";
import { AdminSidebarRetractable } from "./AdminSidebarRetractable";
import { AdminTopNav } from "./AdminTopNav";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs";

interface Notification {
  id: string;
  title: string;
  message: string;
  audience: string;
  audienceCount: number;
  status: "sent" | "scheduled" | "draft";
  sentAt?: string;
  scheduledFor?: string;
  delivered: number;
  opened: number;
  clicked: number;
  link?: string;
}

export function PushNotifications() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    typeof window !== "undefined" && window.innerWidth >= 1024 ? false : true
  );
  const [activeTab, setActiveTab] = useState<"compose" | "history">("compose");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audienceCount, setAudienceCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const handleSidebarToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  // Fetch notification history and customer count from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch notification history
        const notificationsResponse: any = await api.get('/notifications');
        const mappedNotifications: Notification[] = (notificationsResponse.notifications || notificationsResponse || []).map((notif: any) => ({
          id: notif.id,
          title: notif.title,
          message: notif.message || notif.body,
          audience: notif.audience || "All Customers",
          audienceCount: notif.audienceCount || notif.recipientCount || 0,
          status: notif.status || "sent",
          sentAt: notif.sentAt || notif.createdAt,
          scheduledFor: notif.scheduledFor,
          delivered: notif.delivered || notif.deliveredCount || 0,
          opened: notif.opened || notif.openedCount || 0,
          clicked: notif.clicked || notif.clickedCount || 0,
          link: notif.link || notif.actionUrl,
        }));
        setNotifications(mappedNotifications);

        // Fetch total customer count
        const customersResponse: any = await api.getCustomers();
        const totalCustomers = customersResponse.totalCount || customersResponse.length || 0;
        setAudienceCount(totalCustomers);
      } catch (err: any) {
        console.error("Failed to fetch notifications:", err);
        setError(err.response?.data?.error || "Failed to load notifications. Please try again later.");
        setNotifications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSend = async () => {
    if (!title || !message) return;

    try {
      setIsSending(true);
      await api.post('/notifications', {
        title,
        message,
        audience: "all",
      });

      setShowSuccessModal(true);
      // Reset form and refresh history
      setTimeout(async () => {
        setTitle("");
        setMessage("");
        setShowSuccessModal(false);
        setActiveTab("history");
        
        // Refresh notifications list
        try {
          const notificationsResponse: any = await api.get('/notifications');
          const mappedNotifications: Notification[] = (notificationsResponse.notifications || notificationsResponse || []).map((notif: any) => ({
            id: notif.id,
            title: notif.title,
            message: notif.message || notif.body,
            audience: notif.audience || "All Customers",
            audienceCount: notif.audienceCount || notif.recipientCount || 0,
            status: notif.status || "sent",
            sentAt: notif.sentAt || notif.createdAt,
            scheduledFor: notif.scheduledFor,
            delivered: notif.delivered || notif.deliveredCount || 0,
            opened: notif.opened || notif.openedCount || 0,
            clicked: notif.clicked || notif.clickedCount || 0,
            link: notif.link || notif.actionUrl,
          }));
          setNotifications(mappedNotifications);
        } catch (err) {
          console.error("Failed to refresh notifications:", err);
        }
      }, 2000);
    } catch (err: any) {
      console.error("Failed to send notification:", err);
      setError(err.response?.data?.error || "Failed to send notification. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const getAudienceCount = (audienceType: string) => {
    return audienceCount;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const calculateRate = (value: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  return (
    <div className="min-h-screen bg-white">
      <AdminTopNav onMenuClick={handleSidebarToggle} />
      <AdminSidebarRetractable
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        activeMenu="notifications"
      />

      {/* Main Content */}
      <main
        className={`
          mt-[72px] min-h-[calc(100vh-72px)] p-4 sm:p-6 lg:p-8
          transition-all duration-300
          ${sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[280px]"}
        `}
      >
        <div className="max-w-[1400px] mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1F2937] mb-2">
              Push Notifications
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">
              Send targeted notifications to your customers
            </p>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "compose" | "history")}>
            <TabsList className="w-full justify-start bg-white border border-[#E5E7EB] rounded-t-2xl h-[52px] p-0 mb-0">
              <TabsTrigger
                value="compose"
                className="h-full px-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#1F2937] data-[state=active]:bg-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Compose
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="h-full px-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#1F2937] data-[state=active]:bg-white"
              >
                <Clock className="w-4 h-4 mr-2" />
                History
              </TabsTrigger>
            </TabsList>

            {/* Compose Tab */}
            <TabsContent value="compose" className="m-0">
              <div className="bg-white border border-[#E5E7EB] border-t-0 rounded-b-2xl p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Form Section */}
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <Label htmlFor="title" className="text-sm font-medium text-[#374151] mb-2">
                        Notification Title *
                      </Label>
                      <Input
                        id="title"
                        placeholder="Enter notification title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={50}
                        className="h-11"
                      />
                      <p className="text-xs text-[#6B7280] mt-1">
                        {title.length}/50 characters
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-sm font-medium text-[#374151] mb-2">
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Enter your message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        maxLength={150}
                        rows={4}
                        className="resize-none"
                      />
                      <p className="text-xs text-[#6B7280] mt-1">
                        {message.length}/150 characters
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="audience" className="text-sm font-medium text-[#374151] mb-2">
                        Target Audience
                      </Label>
                      <div className="h-11 px-4 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] flex items-center text-[#6B7280]">
                        <Users className="w-4 h-4 mr-2" />
                        <span>All Customers ({getAudienceCount("all").toLocaleString()})</span>
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <p className="text-sm text-red-800">{error}</p>
                      </div>
                    )}

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleSend}
                        disabled={!title || !message || isSending}
                        className="w-full bg-[#1F2937] hover:bg-[#111827] text-white"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {isSending ? "Sending..." : "Send Notification"}
                      </Button>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="space-y-4">
                    <div className="bg-[#F3F4F6] rounded-xl p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <Users className="w-5 h-5 text-[#1F2937] shrink-0 mt-0.5" />
                        <div>
                          <h3 className="text-sm font-semibold text-[#1F2937] mb-1">
                            Estimated Reach
                          </h3>
                          <p className="text-2xl font-bold text-[#1F2937]">
                            {getAudienceCount("all").toLocaleString()}
                          </p>
                          <p className="text-xs text-[#6B7280] mt-1">customers</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <Bell className="w-5 h-5 text-[#3B82F6] shrink-0 mt-0.5" />
                        <div>
                          <h3 className="text-sm font-semibold text-[#1F2937] mb-1">
                            Best Practices
                          </h3>
                          <ul className="text-xs text-[#374151] space-y-1">
                            <li>• Keep titles under 40 characters</li>
                            <li>• Messages should be clear and actionable</li>
                            <li>• Test with preview before sending</li>
                            <li>• Avoid sending too frequently</li>
                            <li>• Include relevant links when applicable</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <Smartphone className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
                        <div>
                          <h3 className="text-sm font-semibold text-[#1F2937] mb-1">
                            Delivery Info
                          </h3>
                          <p className="text-xs text-[#374151]">
                            Notifications are delivered instantly to all devices where customers have enabled push notifications.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="m-0">
              <div className="bg-white border border-[#E5E7EB] border-t-0 rounded-b-2xl">
                {isLoading && (
                  <div className="p-12 text-center">
                    <p className="text-[#6B7280]">Loading notifications...</p>
                  </div>
                )}

                {error && !isLoading && (
                  <div className="p-6">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-red-800">{error}</p>
                    </div>
                  </div>
                )}

                {!isLoading && !error && (
                  <>
                    {/* Notifications List */}
                    <div className="divide-y divide-[#E5E7EB]">
                      {notifications.map((notif) => (
                    <div key={notif.id} className="p-6 hover:bg-[#F9FAFB] transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#1F2937] flex items-center justify-center shrink-0">
                          <Bell className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-[#1F2937] mb-1">
                            {notif.title}
                          </h3>
                          <p className="text-sm text-[#6B7280] mb-2">
                            {notif.message}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B7280]">
                            <div className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5" />
                              <span>{notif.audience}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{formatDate(notif.sentAt!)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                      {notifications.length === 0 && (
                        <div className="p-12 text-center">
                          <Bell className="w-12 h-12 text-[#D1D5DB] mx-auto mb-3" />
                          <p className="text-sm text-[#6B7280]">No notifications found</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-[400px]">
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-[#D1FAE5] flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-[#10B981]" />
            </div>
            <h3 className="text-xl font-bold text-[#1F2937] mb-2">
              Notification Sent!
            </h3>
            <p className="text-sm text-[#6B7280]">
              Your notification has been successfully sent to {getAudienceCount("all").toLocaleString()} customers
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}