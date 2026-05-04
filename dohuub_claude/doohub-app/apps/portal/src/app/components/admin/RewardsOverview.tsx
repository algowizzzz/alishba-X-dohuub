import { Gift, TrendingUp, TrendingDown, Users, Clock, ArrowUpRight, ArrowDownRight, Settings } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebarRetractable } from './AdminSidebarRetractable';
import { AdminTopNav } from './AdminTopNav';

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

  // Mock data
  const stats = {
    totalPointsIssued: 156430,
    totalPointsRedeemed: 42150,
    activeParticipants: 3421,
    expiringPoints: 8200,
    issueGrowth: 12.5,
    redemptionGrowth: 8.2
  };

  const recentTransactions: PointsTransaction[] = [
    {
      id: 'pt-001',
      customerName: 'John Smith',
      customerId: 'cust-001',
      type: 'earned',
      amount: 125,
      description: 'Deep House Cleaning',
      date: '2024-12-05',
      orderId: 'ORD-1001'
    },
    {
      id: 'pt-002',
      customerName: 'Sarah Jones',
      customerId: 'cust-002',
      type: 'redeemed',
      amount: 500,
      description: 'Discount on Food Order',
      date: '2024-12-05',
      orderId: 'ORD-1002'
    },
    {
      id: 'pt-003',
      customerName: 'Mike Brown',
      customerId: 'cust-003',
      type: 'referral_bonus',
      amount: 60,
      description: 'Referral bonus - Anna K. completed first order',
      date: '2024-12-04'
    },
    {
      id: 'pt-004',
      customerName: 'Emily Davis',
      customerId: 'cust-004',
      type: 'earned',
      amount: 89,
      description: 'Food Order',
      date: '2024-12-04',
      orderId: 'ORD-1003'
    },
    {
      id: 'pt-005',
      customerName: 'Chris Wilson',
      customerId: 'cust-005',
      type: 'expired',
      amount: 150,
      description: 'Points expired (12-month limit)',
      date: '2024-12-03'
    }
  ];

  const topEarners: TopEarner[] = [
    { id: 'cust-001', name: 'John Smith', email: 'john@example.com', pointsThisMonth: 1250, lifetimePoints: 8500 },
    { id: 'cust-002', name: 'Sarah Jones', email: 'sarah@example.com', pointsThisMonth: 980, lifetimePoints: 6200 },
    { id: 'cust-003', name: 'Mike Brown', email: 'mike@example.com', pointsThisMonth: 875, lifetimePoints: 5100 },
    { id: 'cust-004', name: 'Emily Davis', email: 'emily@example.com', pointsThisMonth: 720, lifetimePoints: 4800 },
    { id: 'cust-005', name: 'Chris Wilson', email: 'chris@example.com', pointsThisMonth: 650, lifetimePoints: 3900 }
  ];

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

      <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-lg px-4 py-2 mb-6 text-xs text-[#92400E]">
        Demo data &mdash; backend rewards endpoint pending
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-border p-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Gift className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <ArrowUpRight className="w-4 h-4" />
              <span>{stats.issueGrowth}%</span>
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
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <ArrowUpRight className="w-4 h-4" />
              <span>{stats.redemptionGrowth}%</span>
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

      {/* Program Info Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Gift className="w-5 h-5 text-amber-600" />
          <h3 className="font-semibold text-amber-800">Program Settings (Hardcoded)</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-amber-600">Earn Rate:</span>
            <span className="ml-2 font-medium text-amber-900">1 point per $1</span>
          </div>
          <div>
            <span className="text-amber-600">Redemption:</span>
            <span className="ml-2 font-medium text-amber-900">100 pts = $1</span>
          </div>
          <div>
            <span className="text-amber-600">Referrer Bonus:</span>
            <span className="ml-2 font-medium text-amber-900">60 pts</span>
          </div>
          <div>
            <span className="text-amber-600">New User Bonus:</span>
            <span className="ml-2 font-medium text-amber-900">35 pts</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-border shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Recent Points Activity</h2>
          </div>
          <div className="divide-y divide-gray-100">
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
            <h2 className="text-lg font-semibold text-foreground">Top Earners This Month</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {topEarners.map((earner, index) => (
              <div key={earner.id} className="px-6 py-4 flex items-center gap-4">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-bold">
                  {index + 1}
                </div>
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                  <span className="text-muted-foreground font-medium">{earner.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{earner.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{earner.email}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-amber-600">{earner.pointsThisMonth.toLocaleString()} pts</p>
                  <p className="text-xs text-muted-foreground">Lifetime: {earner.lifetimePoints.toLocaleString()}</p>
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
