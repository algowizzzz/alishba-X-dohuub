import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft, DollarSign, ShoppingBag, Star, Users, TrendingUp, Loader2,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { AdminSidebarRetractable } from "./AdminSidebarRetractable";
import { AdminTopNav } from "./AdminTopNav";
import api from "../../../services/api";

interface ProfileSummary {
  id: string;
  businessName: string;
}

interface ProfileAnalyticsData {
  profile: { id: string; businessName: string };
  metrics: {
    revenue: number;
    bookings: number;
    avgRating: number;
    reviewCount: number;
    activeListings: number;
  };
  revenueByMonth?: { month: string; revenue: number }[];
  bookingsByCategory?: { category: string; count: number }[];
}

function fmtMoney(n: number) { return `$${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`; }
function fmtNum(n: number) { return Number(n || 0).toLocaleString(); }

function MetricCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-5 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
      <div className="flex items-center gap-3 mb-3">
        <div className={`${color} text-white p-2.5 rounded-lg`}>{icon}</div>
        <p className="text-sm text-[#6B7280]">{label}</p>
      </div>
      <p className="text-2xl font-bold text-[#1A1A2E]">{value}</p>
    </div>
  );
}

export function ProfileAnalytics() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    typeof window !== "undefined" && window.innerWidth >= 1024 ? false : true
  );
  const handleSidebarToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) setSidebarCollapsed(!sidebarCollapsed);
    else setSidebarOpen(!sidebarOpen);
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get("profile") || "";

  const [profiles, setProfiles] = useState<ProfileSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string>(initialId);
  const [data, setData] = useState<ProfileAnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get<{ success: boolean; data: any[] }>("/api/v1/admin/michelle-profiles?limit=200")
      .then((r) => {
        const arr = ((r as any)?.data || []).map((v: any) => ({ id: v.id, businessName: v.businessName }));
        setProfiles(arr);
        if (!selectedId && arr.length > 0) {
          setSelectedId(arr[0].id);
          setSearchParams({ profile: arr[0].id });
        }
      })
      .catch((e: any) => toast.error(e?.response?.data?.error || e?.message || "Failed to load profiles"));
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    setLoading(true);
    api.get<{ success: boolean; data: any }>(`/api/v1/admin/michelle-profiles/${selectedId}/analytics`)
      .then((r) => setData((r as any)?.data || null))
      .catch((e: any) => {
        toast.error(e?.response?.data?.error || e?.message || "Failed to load analytics");
        setData(null);
      })
      .finally(() => setLoading(false));
  }, [selectedId]);

  const onSelect = (id: string) => {
    setSelectedId(id);
    setSearchParams({ profile: id });
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
      <AdminTopNav onMenuClick={handleSidebarToggle} />
      <AdminSidebarRetractable
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        activeMenu="michelle"
      />
      <main className={`mt-[72px] min-h-[calc(100vh-72px)] p-4 sm:p-6 lg:p-8 transition-all duration-300 ${sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[280px]"}`}>
        <div className="max-w-[1400px] mx-auto">
          <Link to="/admin/michelle-profiles" className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1A1A2E] mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Stores
          </Link>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1A1A2E] mb-2">Profile Analytics</h1>
              <p className="text-sm sm:text-[15px] text-[#6B7280]">Per-Michelle-profile performance metrics</p>
            </div>
            <Select value={selectedId} onValueChange={onSelect}>
              <SelectTrigger className="w-full sm:w-[280px]"><SelectValue placeholder="Pick a profile" /></SelectTrigger>
              <SelectContent>
                {profiles.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.businessName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-[#2E7AD9] animate-spin" /></div>
          ) : !data ? (
            <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-12 text-center">
              <p className="text-[#6B7280]">{profiles.length === 0 ? "No Michelle profiles yet." : "Select a profile to see analytics."}</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#1A1A2E]">{data.profile.businessName}</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <MetricCard icon={<DollarSign className="w-6 h-6" />} label="Revenue" value={fmtMoney(data.metrics.revenue)} color="bg-[#10B981]" />
                <MetricCard icon={<ShoppingBag className="w-6 h-6" />} label="Bookings" value={fmtNum(data.metrics.bookings)} color="bg-[#2E7AD9]" />
                <MetricCard icon={<Star className="w-6 h-6" />} label="Avg Rating" value={`${(data.metrics.avgRating || 0).toFixed(1)} ★`} color="bg-[#F59E0B]" />
                <MetricCard icon={<Users className="w-6 h-6" />} label="Reviews" value={fmtNum(data.metrics.reviewCount)} color="bg-[#8B5CF6]" />
                <MetricCard icon={<TrendingUp className="w-6 h-6" />} label="Active Listings" value={fmtNum(data.metrics.activeListings)} color="bg-[#EC4899]" />
              </div>

              {(data.revenueByMonth?.length || data.bookingsByCategory?.length) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {data.revenueByMonth?.length ? (
                    <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                      <h3 className="text-lg font-semibold text-[#1A1A2E] mb-4">Revenue by Month</h3>
                      <div className="h-[260px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={data.revenueByMonth}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#EEF2F7" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 12 }} />
                            <Tooltip formatter={(v: any) => fmtMoney(Number(v))} />
                            <Line type="monotone" dataKey="revenue" stroke="#2E7AD9" strokeWidth={2} dot={{ r: 3 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  ) : null}
                  {data.bookingsByCategory?.length ? (
                    <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                      <h3 className="text-lg font-semibold text-[#1A1A2E] mb-4">Bookings by Category</h3>
                      <div className="h-[260px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={data.bookingsByCategory}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#EEF2F7" />
                            <XAxis dataKey="category" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" height={70} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#2E7AD9" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
