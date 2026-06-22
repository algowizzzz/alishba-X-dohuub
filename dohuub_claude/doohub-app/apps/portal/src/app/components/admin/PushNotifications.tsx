import { useEffect, useState } from "react";
import {
  Bell, Send, Clock, CheckCircle, Users, Plus, Smartphone,
} from "lucide-react";
import { toast } from "sonner";
import { AdminSidebarRetractable } from "./AdminSidebarRetractable";
import { AdminTopNav } from "./AdminTopNav";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../ui/select";
import api from "../../../services/api";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "../ui/dialog";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
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

  // Form state
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [targetType, setTargetType] = useState<"ALL" | "CUSTOMERS" | "VENDORS">("ALL");
  const [scheduledFor, setScheduledFor] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [audienceCounts, setAudienceCounts] = useState<{ total: number; customers: number; vendors: number; active: number }>({ total: 0, customers: 0, vendors: 0, active: 0 });
  const [historyLoading, setHistoryLoading] = useState(true);

  const handleSidebarToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const loadHistory = () => {
    setHistoryLoading(true);
    api
      .get<{ success: boolean; data: any[] }>("/api/v1/admin/scheduled-pushes")
      .then((r) => {
        const arr = (r as any)?.data || [];
        const mapped: Notification[] = arr.map((n: any) => ({
          id: n.id,
          title: n.title,
          message: n.body,
          audience:
            n.targetType === "CUSTOMERS" ? "Customers"
            : n.targetType === "VENDORS" ? "Vendors"
            : n.targetType === "SPECIFIC" ? `${(n.targetIds || []).length} users`
            : "All users",
          audienceCount: n.recipientCount || 0,
          status: n.status === "SENT" ? "sent" : n.status === "CANCELLED" ? "draft" : n.status === "FAILED" ? "draft" : "scheduled",
          sentAt: n.sentAt || (n.status === "SCHEDULED" ? undefined : n.createdAt),
          scheduledFor: n.scheduledFor || undefined,
          delivered: n.recipientCount || 0,
          opened: 0,
          clicked: 0,
          link: n.link || undefined,
        }));
        setNotifications(mapped);
      })
      .catch(() => setNotifications([]))
      .finally(() => setHistoryLoading(false));
  };

  useEffect(() => {
    loadHistory();
    api
      .get<{ success: boolean; data: any }>("/api/v1/admin/users/counts")
      .then((r) => {
        const d = (r as any)?.data;
        if (d) setAudienceCounts({ total: d.total || 0, customers: d.customers || 0, vendors: d.vendors || 0, active: d.active || 0 });
      })
      .catch(() => {});
  }, []);

  const handleSend = async () => {
    setSendError(null);
    setIsSending(true);
    try {
      // Use the scheduled-push endpoint for both immediate (scheduledFor=null)
      // AND scheduled sends; the cron picks both up on the next 60s tick.
      await api.post("/api/v1/admin/scheduled-pushes", {
        title,
        body: message,
        link: link || undefined,
        targetType,
        scheduledFor: scheduledFor ? new Date(scheduledFor).toISOString() : null,
      });
      setShowSuccessModal(true);
      toast.success(scheduledFor ? "Push scheduled" : "Push queued — will dispatch within 1 minute");
      setTimeout(() => {
        setTitle("");
        setMessage("");
        setLink("");
        setScheduledFor("");
        setShowSuccessModal(false);
        setActiveTab("history");
        loadHistory();
      }, 1500);
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || "Failed to send notification";
      setSendError(msg);
      toast.error(msg);
    } finally {
      setIsSending(false);
    }
  };

  const handleCancelScheduled = async (id: string) => {
    if (!window.confirm("Cancel this scheduled push?")) return;
    try {
      await api.delete(`/api/v1/admin/scheduled-pushes/${id}`);
      toast.success("Scheduled push cancelled");
      loadHistory();
    } catch (e: any) {
      toast.error(e?.response?.data?.error || e?.message || "Failed to cancel");
    }
  };

  const getAudienceCount = (audienceType: string) => {
    if (audienceType === "CUSTOMERS") return audienceCounts.customers;
    if (audienceType === "VENDORS") return audienceCounts.vendors;
    return audienceCounts.total;
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
    <div className="min-h-screen bg-[#F0F7FF]">
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
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1A1A2E] mb-2">
              Push Notifications
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">
              Send targeted notifications to your customers
            </p>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "compose" | "history")}>
            <TabsList className="w-full justify-start bg-white border border-[rgba(46,122,217,0.25)] rounded-t-2xl h-[52px] p-0 mb-0">
              <TabsTrigger
                value="compose"
                className="h-full px-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#2E7AD9] data-[state=active]:text-[#2E7AD9] data-[state=active]:bg-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Compose
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="h-full px-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#2E7AD9] data-[state=active]:text-[#2E7AD9] data-[state=active]:bg-white"
              >
                <Clock className="w-4 h-4 mr-2" />
                History
              </TabsTrigger>
            </TabsList>

            {/* Compose Tab */}
            <TabsContent value="compose" className="m-0">
              <div className="bg-white border border-[rgba(46,122,217,0.25)] border-t-0 rounded-b-2xl p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Form Section */}
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <Label htmlFor="title" className="text-sm font-medium text-[#1A1A2E] mb-2">
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
                      <Label htmlFor="message" className="text-sm font-medium text-[#1A1A2E] mb-2">
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
                      <Label htmlFor="audience" className="text-sm font-medium text-[#1A1A2E] mb-2">
                        Target Audience
                      </Label>
                      <Select value={targetType} onValueChange={(v) => setTargetType(v as any)}>
                        <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALL">All users ({audienceCounts.total.toLocaleString()})</SelectItem>
                          <SelectItem value="CUSTOMERS">Customers only ({audienceCounts.customers.toLocaleString()})</SelectItem>
                          <SelectItem value="VENDORS">Vendors only ({audienceCounts.vendors.toLocaleString()})</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="link" className="text-sm font-medium text-[#1A1A2E] mb-2">
                        Deep Link (optional)
                      </Label>
                      <Input
                        id="link"
                        placeholder="/offers or https://..."
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        className="h-11"
                      />
                      <p className="text-xs text-[#6B7280] mt-1">
                        Tapping the notification opens this URL or in-app route.
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="scheduledFor" className="text-sm font-medium text-[#1A1A2E] mb-2">
                        Schedule for later (optional)
                      </Label>
                      <Input
                        id="scheduledFor"
                        type="datetime-local"
                        value={scheduledFor}
                        onChange={(e) => setScheduledFor(e.target.value)}
                        className="h-11"
                      />
                      <p className="text-xs text-[#6B7280] mt-1">
                        Leave empty to send within 1 minute.
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 pt-4">
                      {sendError && (
                        <p className="text-sm text-[#DC2626]">{sendError}</p>
                      )}
                      <Button
                        onClick={handleSend}
                        disabled={!title || !message || isSending}
                        className="w-full bg-[#2E7AD9] hover:bg-[#1E5DB0] text-white"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {isSending ? "Sending..." : "Send Notification"}
                      </Button>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="space-y-4">
                    <div className="bg-[#F0F7FF] rounded-xl p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <Users className="w-5 h-5 text-[#1A1A2E] shrink-0 mt-0.5" />
                        <div>
                          <h3 className="text-sm font-semibold text-[#1A1A2E] mb-1">
                            Estimated Reach
                          </h3>
                          <p className="text-2xl font-bold text-[#1A1A2E]">
                            {getAudienceCount(targetType).toLocaleString()}
                          </p>
                          <p className="text-xs text-[#6B7280] mt-1">
                            {targetType === "VENDORS" ? "vendors" : targetType === "CUSTOMERS" ? "customers" : "users"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#F0F7FF] border border-[#C7DDF7] rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <Bell className="w-5 h-5 text-[#2E7AD9] shrink-0 mt-0.5" />
                        <div>
                          <h3 className="text-sm font-semibold text-[#1A1A2E] mb-1">
                            Best Practices
                          </h3>
                          <ul className="text-xs text-[#1A1A2E] space-y-1">
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
                          <h3 className="text-sm font-semibold text-[#1A1A2E] mb-1">
                            Delivery Info
                          </h3>
                          <p className="text-xs text-[#1A1A2E]">
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
              <div className="bg-white border border-[rgba(46,122,217,0.25)] border-t-0 rounded-b-2xl">
                {/* Notifications List */}
                <div className="divide-y divide-[rgba(46,122,217, 0.12)]">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="p-6 hover:bg-white transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#2E7AD9] flex items-center justify-center shrink-0">
                          <Bell className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-[#1A1A2E] mb-1">
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
                      <Bell className="w-12 h-12 text-[rgba(46,122,217, 0.18)] mx-auto mb-3" />
                      <p className="text-sm text-[#6B7280]">No notifications found</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-[400px]">
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-[#2E7AD9] shadow-[0_4px_12px_rgba(46,122,217,0.3)] flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-[#10B981]" />
            </div>
            <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">
              Notification Sent!
            </h3>
            <p className="text-sm text-[#6B7280]">
              {scheduledFor ? "Your notification has been scheduled and will dispatch at the specified time." : `Your notification has been queued. It will reach up to ${getAudienceCount(targetType).toLocaleString()} ${targetType === "VENDORS" ? "vendors" : targetType === "CUSTOMERS" ? "customers" : "users"} within 1 minute.`}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}