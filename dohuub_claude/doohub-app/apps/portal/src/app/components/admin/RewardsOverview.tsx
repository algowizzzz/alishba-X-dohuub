import { Gift, TrendingUp, TrendingDown, Users, Clock, ArrowUpRight, ArrowDownRight, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebarRetractable } from './AdminSidebarRetractable';
import { AdminTopNav } from './AdminTopNav';
import api from '../../../services/api';

interface PointsTransaction {
  id: string;
  customerName: string;
  customerId: string;
  type: 'earned' | 'redeemed' | 'expired' | 'referral_bonus';
  amount: number;
  description: string;
  date: string;
  orderId?: string;
}

interface TopEarner {
  id: string;
  name: string;
  email: string;
  pointsThisMonth: number;
  lifetimePoints: number;
}

export function RewardsOverview() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    typeof window !== "undefined" && window.innerWidth >= 1024 ? false : true
  );

  const handleSidebarToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const [stats, setStats] = useState({
    totalPointsIssued: 0,
    totalPointsRedeemed: 0,
    activeParticipants: 0,
    expiringPoints: 0,
    issueGrowth: 0,
    redemptionGrowth: 0,
  });
  const [topEarners, setTopEarners] = useState<TopEarner[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<PointsTransaction[]>([]);

  useEffect(() => {
    Promise.all([
      api.get<{ success: boolean; data: any }>(`/api/v1/admin/rewards/summary?timeRange=${timeRange}`),
      api.get<{ success: boolean; data: any[] }>(`/api/v1/admin/rewards/transactions?limit=15`),
    ])
      .then(([sumRes, txRes]) => {
        const d = (sumRes as any)?.data;
        if (d) {
          setStats({
            totalPointsIssued: d.transactions?.totalEarned ?? 0,
            totalPointsRedeemed: d.transactions?.totalRedeemed ?? 0,
            activeParticipants: d.wallet?.activeWallets ?? 0,
            expiringPoints: d.wallet?.expiringPoints ?? 0,
            issueGrowth: d.period?.earnGrowthPct ?? 0,
            redemptionGrowth: d.period?.redeemGrowthPct ?? 0,
          });
          setTopEarners(
            (d.topEarners || []).map((e: any) => ({
              id: e.userId,
              name: e.name || e.email || "—",
              email: e.email || "—",
              pointsThisMonth: 0,
              lifetimePoints: e.totalPoints,
            }))
          );
        }
        const txData = (txRes as any)?.data || [];
        setRecentTransactions(
          txData.map((t: any) => {
            const customerName = t.user?.profile
              ? `${t.user.profile.firstName ?? ""} ${t.user.profile.lastName ?? ""}`.trim() || t.user.email
              : t.user?.email || "Customer";
            const typeLower = String(t.type || "").toLowerCase();
            const type: PointsTransaction["type"] =
              typeLower.includes("redeem") || t.amount < 0 ? "redeemed"
              : typeLower.includes("expire") ? "expired"
              : typeLower.includes("refer") ? "referral_bonus"
              : "earned";
            return {
              id: t.id,
              customerName,
              customerId: t.userId,
              type,
              amount: Math.abs(t.amount),
              description: t.description || "—",
              date: t.createdAt,
              orderId: t.orderId || t.bookingId || undefined,
            };
          })
        );
      })
      .catch(() => {});
  }, [timeRange]);


  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earned':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'redeemed':
        return <TrendingDown className="w-4 h-4 text-blue-500" />;
      case 'expired':
        return <Clock className="w-4 h-4 text-red-500" />;
      case 'referral_bonus':
        return <Users className="w-4 h-4 text-purple-500" />;
      default:
        return <Gift className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'earned':
      case 'referral_bonus':
        return 'text-green-600';
      case 'redeemed':
        return 'text-blue-600';
      case 'expired':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
      <AdminTopNav onMenuClick={handleSidebarToggle} />
      <AdminSidebarRetractable
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        activeMenu="rewards"
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Rewards Program Overview</h1>
          <p className="text-muted-foreground">Monitor and manage the DoHuub rewards system</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'year')}
            className="px-4 py-2 border border-border rounded-lg bg-white shadow-[0_4px_16px_rgba(46,122,217,0.18)]"
          >
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
            <option value="year">Last 12 months</option>
          </select>
          <button
            onClick={() => navigate('/admin/rewards/milestones')}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Settings className="w-4 h-4" />
            Configure Milestones
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-border p-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Gift className="w-6 h-6 text-amber-600" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${stats.issueGrowth >= 0 ? "text-green-600" : "text-red-600"}`}>
              {stats.issueGrowth >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{stats.issueGrowth >= 0 ? "+" : ""}{stats.issueGrowth}%</span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm mb-1">Total Points Issued</p>
          <p className="text-2xl font-bold text-foreground">{stats.totalPointsIssued.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl border border-border p-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${stats.redemptionGrowth >= 0 ? "text-green-600" : "text-red-600"}`}>
              {stats.redemptionGrowth >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{stats.redemptionGrowth >= 0 ? "+" : ""}{stats.redemptionGrowth}%</span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm mb-1">Points Redeemed</p>
          <p className="text-2xl font-bold text-foreground">{stats.totalPointsRedeemed.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl border border-border p-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-muted-foreground text-sm mb-1">Active Participants</p>
          <p className="text-2xl font-bold text-foreground">{stats.activeParticipants.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl border border-border p-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-muted-foreground text-sm mb-1">Points Expiring Soon</p>
          <p className="text-2xl font-bold text-foreground">{stats.expiringPoints.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Next 30 days</p>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-border shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Recent Points Activity</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {recentTransactions.length === 0 && (
              <div className="px-6 py-8 text-center text-sm text-muted-foreground">No recent activity yet.</div>
            )}
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="px-6 py-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                  {getTransactionIcon(transaction.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{transaction.customerName}</p>
                  <p className="text-sm text-muted-foreground truncate">{transaction.description}</p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                    {transaction.type === 'earned' || transaction.type === 'referral_bonus' ? '+' : '-'}
                    {transaction.amount} pts
                  </p>
                  <p className="text-sm text-muted-foreground">{transaction.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Earners */}
        <div className="bg-white rounded-xl border border-border shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Top Earners (Lifetime)</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {topEarners.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-muted-foreground">No participants yet.</div>
            ) : topEarners.map((earner, index) => (
              <div key={earner.id} className="px-6 py-4 flex items-center gap-4">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-bold">
                  {index + 1}
                </div>
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                  <span className="text-muted-foreground font-medium">{(earner.name || earner.email || "?").charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{earner.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{earner.email}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-amber-600">{earner.lifetimePoints.toLocaleString()} pts</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
        </div>
      </main>
    </div>
  );
}
