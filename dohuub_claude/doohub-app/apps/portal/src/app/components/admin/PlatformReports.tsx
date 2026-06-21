import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Store,
  Download, Calendar, Star, AlertCircle, Loader2,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { Button } from "../ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Checkbox } from "../ui/checkbox";
import { AdminSidebarRetractable } from "./AdminSidebarRetractable";
import { AdminTopNav } from "./AdminTopNav";
import api from "../../../services/api";
import { supabase } from "../../../lib/supabase";

interface KPI { value: number; change: number; }
interface PlatformReport {
  kpis: {
    revenue: KPI;
    bookings: KPI;
    newUsers: KPI;
    activeVendors: KPI;
  };
  charts: {
    revenueByMonth: { month: string; revenue: number }[];
    bookingsByCategory: { category: string; count: number }[];
  };
  topPerformers: {
    topVendor?: { businessName: string; revenue: number };
    topService?: { title: string; bookings: number };
    topCustomer?: { name: string; spent: number };
  };
  healthMetrics: {
    avgRating: number;
    vendorRetention: number;
    completionRate: number;
    disputeRate: number;
  };
}

const API_BASE =
  (import.meta as any).env?.VITE_API_URL ||
  (typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "https://alishba-x-dohuub-production.up.railway.app"
    : "http://localhost:3001");

function fmtMoney(n: number) {
  return `$${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function fmtNumber(n: number) {
  return Number(n || 0).toLocaleString();
}

function KPICard({ label, value, change, icon, color }: { label: string; value: string; change: number; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-5 hover:shadow-[0_8px_24px_rgba(46,122,217,0.25)] transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`${color} text-white p-2.5 rounded-lg`}>{icon}</div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${change >= 0 ? "bg-[#D1FAE5] text-[#065F46]" : "bg-[#FEE2E2] text-[#991B1B]"}`}>
          {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(change)}%
        </div>
      </div>
      <p className="text-sm text-[#6B7280] mb-1">{label}</p>
      <p className="text-2xl font-bold text-[#1A1A2E]">{value}</p>
    </div>
  );
}

const CUSTOM_METRICS = [
  { key: "revenue", label: "Revenue + order count" },
  { key: "bookings", label: "Bookings count" },
  { key: "users", label: "Users (new + total)" },
  { key: "vendors", label: "Vendors (new + approved)" },
  { key: "reviews", label: "Reviews (avg rating + count)" },
];

export function PlatformReports() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    typeof window !== "undefined" && window.innerWidth >= 1024 ? false : true
  );
  const handleSidebarToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) setSidebarCollapsed(!sidebarCollapsed);
    else setSidebarOpen(!sidebarOpen);
  };

  const [dateRange, setDateRange] = useState<string>("30days");
  const [report, setReport] = useState<PlatformReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Custom report builder state
  const [customMetrics, setCustomMetrics] = useState<string[]>(["revenue", "bookings", "users", "vendors", "reviews"]);
  const [customRange, setCustomRange] = useState<string>("30days");
  const [customResult, setCustomResult] = useState<any>(null);
  const [customBusy, setCustomBusy] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .get<{ success: boolean; data: PlatformReport }>(`/api/v1/admin/reports/platform?dateRange=${dateRange}`)
      .then((r) => setReport((r as any)?.data || null))
      .catch((e: any) => {
        setError(e?.response?.data?.error || e?.message || "Failed to load report");
        setReport(null);
      })
      .finally(() => setLoading(false));
  }, [dateRange]);

  const handleExport = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      const resp = await fetch(`${API_BASE}/api/v1/admin/reports/platform/export?format=csv&dateRange=${dateRange}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `platform-report-${dateRange}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Report exported");
    } catch (e: any) {
      toast.error(e?.message || "Export failed");
    }
  };

  const handleRunCustom = async () => {
    setCustomBusy(true);
    try {
      const res: any = await api.post("/api/v1/admin/reports/custom", {
        dateRange: customRange,
        metrics: customMetrics,
      });
      setCustomResult(res?.data || null);
      toast.success("Custom report generated");
    } catch (e: any) {
      toast.error(e?.response?.data?.error || e?.message || "Custom report failed");
    } finally {
      setCustomBusy(false);
    }
  };

  const kpis = useMemo(() => {
    if (!report) return [];
    return [
      { label: "Revenue", value: fmtMoney(report.kpis.revenue.value), change: report.kpis.revenue.change, icon: <DollarSign className="w-6 h-6" />, color: "bg-[#10B981]" },
      { label: "Bookings", value: fmtNumber(report.kpis.bookings.value), change: report.kpis.bookings.change, icon: <ShoppingBag className="w-6 h-6" />, color: "bg-[#2E7AD9]" },
      { label: "New Users", value: fmtNumber(report.kpis.newUsers.value), change: report.kpis.newUsers.change, icon: <Users className="w-6 h-6" />, color: "bg-[#8B5CF6]" },
      { label: "Active Vendors", value: fmtNumber(report.kpis.activeVendors.value), change: report.kpis.activeVendors.change, icon: <Store className="w-6 h-6" />, color: "bg-[#F59E0B]" },
    ];
  }, [report]);

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
      <AdminTopNav onMenuClick={handleSidebarToggle} />
      <AdminSidebarRetractable
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        activeMenu="reports"
      />
      <main className={`mt-[72px] min-h-[calc(100vh-72px)] p-4 sm:p-6 lg:p-8 transition-all duration-300 ${sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[280px]"}`}>
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1A1A2E] mb-2">Reports & Analytics</h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">Platform-wide performance metrics and insights</p>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6 overflow-x-auto w-full justify-start">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="custom">Custom Report</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                  <Calendar className="w-5 h-5 text-[#6B7280] hidden sm:block" />
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-full sm:w-[200px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">Last 7 Days</SelectItem>
                      <SelectItem value="30days">Last 30 Days</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" className="w-full sm:w-auto" onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" /> Export CSV
                </Button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-[#2E7AD9] animate-spin" /></div>
              ) : error ? (
                <div className="bg-[#FEE2E2] border border-[#FECACA] text-[#991B1B] rounded-xl p-6 text-center">
                  <p className="font-semibold mb-1">Could not load report</p>
                  <p className="text-sm">{error}</p>
                </div>
              ) : report ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {kpis.map((k, i) => <KPICard key={i} {...k} />)}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                      <h3 className="text-lg font-semibold text-[#1A1A2E] mb-4">Revenue Trend (Last 6 Months)</h3>
                      <div className="h-[260px]">
                        {report.charts?.revenueByMonth?.length ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={report.charts.revenueByMonth}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#EEF2F7" />
                              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                              <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 12 }} />
                              <Tooltip formatter={(v: any) => fmtMoney(Number(v))} />
                              <Line type="monotone" dataKey="revenue" stroke="#2E7AD9" strokeWidth={2} dot={{ r: 3 }} />
                            </LineChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-full flex items-center justify-center text-[#6B7280]">No revenue data yet</div>
                        )}
                      </div>
                    </div>
                    <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                      <h3 className="text-lg font-semibold text-[#1A1A2E] mb-4">Bookings by Category</h3>
                      <div className="h-[260px]">
                        {report.charts?.bookingsByCategory?.length ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={report.charts.bookingsByCategory}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#EEF2F7" />
                              <XAxis dataKey="category" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" height={70} />
                              <YAxis tick={{ fontSize: 12 }} />
                              <Tooltip />
                              <Bar dataKey="count" fill="#2E7AD9" />
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-full flex items-center justify-center text-[#6B7280]">No booking data yet</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                    <h3 className="text-lg font-semibold text-[#1A1A2E] mb-4">Top Performers</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#10B981] rounded-full mt-2" />
                        <div>
                          <p className="text-sm text-[#6B7280] mb-1">Top Vendor</p>
                          <p className="text-sm font-semibold text-[#1A1A2E]">{report.topPerformers?.topVendor?.businessName || "—"}</p>
                          <p className="text-xs text-[#9CA3AF]">{fmtMoney(report.topPerformers?.topVendor?.revenue || 0)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#10B981] rounded-full mt-2" />
                        <div>
                          <p className="text-sm text-[#6B7280] mb-1">Top Service</p>
                          <p className="text-sm font-semibold text-[#1A1A2E]">{report.topPerformers?.topService?.title || "—"}</p>
                          <p className="text-xs text-[#9CA3AF]">{fmtNumber(report.topPerformers?.topService?.bookings || 0)} bookings</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#10B981] rounded-full mt-2" />
                        <div>
                          <p className="text-sm text-[#6B7280] mb-1">Top Customer</p>
                          <p className="text-sm font-semibold text-[#1A1A2E]">{report.topPerformers?.topCustomer?.name || "—"}</p>
                          <p className="text-xs text-[#9CA3AF]">{fmtMoney(report.topPerformers?.topCustomer?.spent || 0)} spent</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                    <h3 className="text-lg font-semibold text-[#1A1A2E] mb-4">Platform Health</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-start gap-3">
                        <Star className="w-5 h-5 text-[#10B981] mt-0.5" />
                        <div>
                          <p className="text-sm text-[#6B7280] mb-1">Avg Rating</p>
                          <p className="text-sm font-semibold text-[#1A1A2E]">{(report.healthMetrics?.avgRating || 0).toFixed(1)} ★</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Star className="w-5 h-5 text-[#10B981] mt-0.5" />
                        <div>
                          <p className="text-sm text-[#6B7280] mb-1">Vendor Retention</p>
                          <p className="text-sm font-semibold text-[#1A1A2E]">{Math.round(report.healthMetrics?.vendorRetention || 0)}%</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Star className="w-5 h-5 text-[#10B981] mt-0.5" />
                        <div>
                          <p className="text-sm text-[#6B7280] mb-1">Completion Rate</p>
                          <p className="text-sm font-semibold text-[#1A1A2E]">{Math.round(report.healthMetrics?.completionRate || 0)}%</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        {(report.healthMetrics?.disputeRate || 0) > 5 ? (
                          <AlertCircle className="w-5 h-5 text-[#F59E0B] mt-0.5" />
                        ) : (
                          <Star className="w-5 h-5 text-[#10B981] mt-0.5" />
                        )}
                        <div>
                          <p className="text-sm text-[#6B7280] mb-1">Dispute Rate</p>
                          <p className="text-sm font-semibold text-[#1A1A2E]">{(report.healthMetrics?.disputeRate || 0).toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </TabsContent>

            <TabsContent value="custom" className="space-y-6">
              <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                <h3 className="text-lg font-semibold text-[#1A1A2E] mb-4">Custom Report Builder</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-[#1A1A2E] mb-2">Date Range</p>
                    <Select value={customRange} onValueChange={setCustomRange}>
                      <SelectTrigger className="w-full sm:w-[240px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7days">Last 7 Days</SelectItem>
                        <SelectItem value="30days">Last 30 Days</SelectItem>
                        <SelectItem value="90days">Last 90 Days</SelectItem>
                        <SelectItem value="year">Last Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A2E] mb-2">Metrics</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {CUSTOM_METRICS.map((m) => {
                        const checked = customMetrics.includes(m.key);
                        return (
                          <label key={m.key} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(c) => {
                                setCustomMetrics((prev) =>
                                  c ? Array.from(new Set([...prev, m.key])) : prev.filter((k) => k !== m.key)
                                );
                              }}
                            />
                            <span className="text-sm text-[#1A1A2E]">{m.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  <Button onClick={handleRunCustom} disabled={customBusy || customMetrics.length === 0} className="bg-[#2E7AD9] hover:bg-[#1E5DB0]">
                    {customBusy ? "Generating..." : "Generate Report"}
                  </Button>
                </div>
              </div>

              {customResult && (
                <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                  <h3 className="text-lg font-semibold text-[#1A1A2E] mb-4">Result</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(customResult)
                      .filter(([k]) => !["dateRange", "startDate", "endDate"].includes(k))
                      .map(([k, v]) => (
                        <div key={k} className="bg-[#F0F7FF] rounded-lg p-4">
                          <p className="text-xs text-[#6B7280] mb-1">{k}</p>
                          <p className="text-lg font-bold text-[#1A1A2E]">
                            {typeof v === "number" ? (k.toLowerCase().includes("revenue") || k.toLowerCase().includes("spent") ? fmtMoney(v) : fmtNumber(v)) : String(v)}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
