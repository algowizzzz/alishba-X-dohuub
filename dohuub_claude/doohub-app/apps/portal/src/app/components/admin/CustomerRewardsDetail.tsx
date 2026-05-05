import { ArrowLeft, Gift, TrendingUp, TrendingDown, Clock, Users, Filter, Download, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminSidebarRetractable } from './AdminSidebarRetractable';
import { AdminTopNav } from './AdminTopNav';
import api from '../../../services/api';

interface PointsTransaction {
  id: string;
  type: 'earned' | 'redeemed' | 'expired' | 'referral_bonus' | 'signup_bonus' | 'milestone_bonus';
  amount: number;
  description: string;
  date: string;
  orderId?: string;
  vendorName?: string;
  category?: string;
}

interface Referral {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'completed';
  pointsEarned: number;
  date: string;
}

// Mock customer data
const mockCustomer = {
  id: '1',
  name: 'John Smith',
  email: 'john.smith@email.com',
  phone: '+1 (555) 123-4567',
  joinDate: '2024-06-15',
  currentBalance: 2450,
  lifetimeEarned: 5200,
  lifetimeRedeemed: 2750,
  pendingPoints: 150,
  expiringPoints: 200,
  expiringDate: '2025-02-15',
  referralCode: 'JOHN-ABC123',
  totalReferrals: 8,
  pendingReferrals: 2,
};


type FilterType = 'all' | 'earned' | 'redeemed' | 'expired' | 'bonus';

export function CustomerRewardsDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'transactions' | 'referrals'>('transactions');
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [customer, setCustomer] = useState<any>(mockCustomer);
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);

  useEffect(() => {
    if (!id) return;
    api.get<{ success: boolean; data: any }>(`/api/v1/admin/customers/${id}/rewards`)
      .then((r) => {
        const d = (r as any)?.data;
        if (!d) return;
        const u = d.user;
        const w = d.wallet || {};
        const refMade = d.referrals || [];
        setCustomer({
          id: u.id,
          name: u.profile ? `${u.profile.firstName ?? ''} ${u.profile.lastName ?? ''}`.trim() || u.email : u.email,
          email: u.email,
          phone: u.phone || '—',
          joinDate: u.createdAt,
          currentBalance: w.totalPoints ?? 0,
          lifetimeEarned: 0,
          lifetimeRedeemed: 0,
          pendingPoints: w.pendingPoints ?? 0,
          expiringPoints: w.expiringPoints ?? 0,
          expiringDate: w.expiringDate,
          referralCode: refMade[0]?.referralCode || '—',
          totalReferrals: refMade.length,
          pendingReferrals: refMade.filter((r: any) => r.status === 'pending').length,
        });
        const txMap = (d.transactions || []).map((t: any) => ({
          id: t.id,
          type: String(t.type || '').toLowerCase().includes('redeem') ? 'redeemed'
            : String(t.type || '').toLowerCase().includes('expire') ? 'expired'
            : String(t.type || '').toLowerCase().includes('refer') ? 'referral_bonus'
            : String(t.type || '').toLowerCase().includes('milestone') ? 'milestone_bonus'
            : String(t.type || '').toLowerCase().includes('signup') ? 'signup_bonus'
            : 'earned',
          amount: Math.abs(t.amount),
          description: t.description || '—',
          date: t.createdAt,
          orderId: t.orderId || t.bookingId || undefined,
          vendorName: t.vendorName || undefined,
        }));
        setTransactions(txMap);
        setReferrals(
          refMade.map((r: any) => ({
            id: r.id,
            name: r.refereeUserId || r.referralCode,
            email: '—',
            status: (r.status === 'completed' ? 'completed' : 'pending'),
            pointsEarned: r.pointsEarned || 0,
            date: r.createdAt,
          }))
        );
      })
      .catch(() => {});
  }, [id]);

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

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true;
    if (filter === 'earned') return tx.type === 'earned';
    if (filter === 'redeemed') return tx.type === 'redeemed';
    if (filter === 'expired') return tx.type === 'expired';
    if (filter === 'bonus') return tx.type === 'referral_bonus' || tx.type === 'signup_bonus' || tx.type === 'milestone_bonus';
    return true;
  }).filter(tx => {
    if (!searchQuery) return true;
    return tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
           tx.vendorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           tx.orderId?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getTransactionIcon = (type: PointsTransaction['type']) => {
    switch (type) {
      case 'earned':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'redeemed':
        return <TrendingDown className="w-4 h-4 text-blue-600" />;
      case 'expired':
        return <Clock className="w-4 h-4 text-muted-foreground" />;
      case 'referral_bonus':
      case 'signup_bonus':
      case 'milestone_bonus':
        return <Gift className="w-4 h-4 text-amber-500" />;
      default:
        return <Gift className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getTransactionColor = (type: PointsTransaction['type']) => {
    switch (type) {
      case 'earned':
      case 'referral_bonus':
      case 'signup_bonus':
      case 'milestone_bonus':
        return 'text-green-600';
      case 'redeemed':
        return 'text-blue-600';
      case 'expired':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTransactionLabel = (type: PointsTransaction['type']) => {
    switch (type) {
      case 'earned':
        return 'Earned';
      case 'redeemed':
        return 'Redeemed';
      case 'expired':
        return 'Expired';
      case 'referral_bonus':
        return 'Referral';
      case 'signup_bonus':
        return 'Signup';
      case 'milestone_bonus':
        return 'Milestone';
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
      <AdminTopNav onMenuClick={handleSidebarToggle} />
      <AdminSidebarRetractable
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        activeMenu="customers"
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
      <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/admin/customers')}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">Customer Rewards</h1>
              <p className="text-sm text-muted-foreground">{customer.name} - {customer.email}</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors">
              <Download className="w-4 h-4" />
              Export History
            </button>
          </div>
      </div>

      <div>
        {/* Points Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl p-5 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-5 h-5" />
              <span className="text-sm font-medium opacity-90">Current Balance</span>
            </div>
            <p className="text-3xl font-bold">{customer.currentBalance.toLocaleString()}</p>
            <p className="text-sm opacity-80 mt-1">= ${(customer.currentBalance * 0.01).toFixed(2)} value</p>
          </div>

          <div className="bg-white rounded-xl border border-border p-5 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-muted-foreground">Lifetime Earned</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{customer.lifetimeEarned.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground mt-1">pts</p>
          </div>

          <div className="bg-white rounded-xl border border-border p-5 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-muted-foreground">Lifetime Redeemed</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{customer.lifetimeRedeemed.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground mt-1">pts (${(customer.lifetimeRedeemed * 0.01).toFixed(2)} saved)</p>
          </div>

          <div className="bg-white rounded-xl border border-border p-5 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-muted-foreground">Expiring Soon</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{customer.expiringPoints.toLocaleString()}</p>
            <p className="text-sm text-red-500 mt-1">by {new Date(customer.expiringDate).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Referral Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-800">Referral Code: <span className="font-mono">{customer.referralCode}</span></p>
                <p className="text-xs text-blue-600">{customer.totalReferrals} successful referrals ({customer.pendingReferrals} pending)</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-blue-800">+{customer.totalReferrals * 60} pts</p>
              <p className="text-xs text-blue-600">from referrals</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-border overflow-hidden shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'transactions'
                  ? 'text-amber-600 border-b-2 border-amber-500 bg-amber-50'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              Transaction History
            </button>
            <button
              onClick={() => setActiveTab('referrals')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'referrals'
                  ? 'text-amber-600 border-b-2 border-amber-500 bg-amber-50'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              Referrals ({referrals.length})
            </button>
          </div>

          {activeTab === 'transactions' && (
            <>
              {/* Filters */}
              <div className="px-6 py-4 border-b border-border flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as FilterType)}
                    className="px-3 py-2 border border-border rounded-lg text-sm bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-[0_4px_16px_rgba(46,122,217,0.18)]"
                  >
                    <option value="all">All Transactions</option>
                    <option value="earned">Earned</option>
                    <option value="redeemed">Redeemed</option>
                    <option value="expired">Expired</option>
                    <option value="bonus">Bonuses</option>
                  </select>
                </div>
              </div>

              {/* Transactions List */}
              <div className="divide-y divide-gray-100">
                {filteredTransactions.map((tx) => (
                  <div key={tx.id} className="px-6 py-4 hover:bg-secondary transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                          {getTransactionIcon(tx.type)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{tx.description}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{new Date(tx.date).toLocaleDateString()}</span>
                            {tx.orderId && (
                              <>
                                <span>•</span>
                                <span className="font-mono text-xs">{tx.orderId}</span>
                              </>
                            )}
                            {tx.category && (
                              <>
                                <span>•</span>
                                <span className="px-2 py-0.5 bg-secondary rounded text-xs">{tx.category}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${getTransactionColor(tx.type)}`}>
                          {tx.type === 'redeemed' || tx.type === 'expired' ? '-' : '+'}
                          {tx.amount.toLocaleString()} pts
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          tx.type === 'earned' ? 'bg-green-100 text-green-700' :
                          tx.type === 'redeemed' ? 'bg-blue-100 text-blue-700' :
                          tx.type === 'expired' ? 'bg-secondary text-muted-foreground' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {getTransactionLabel(tx.type)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredTransactions.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No transactions found</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'referrals' && (
            <div className="divide-y divide-gray-100">
              {referrals.map((referral) => (
                <div key={referral.id} className="px-6 py-4 hover:bg-secondary transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground font-medium">
                        {referral.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{referral.name}</p>
                        <p className="text-sm text-muted-foreground">{referral.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {referral.status === 'completed' ? (
                        <>
                          <p className="font-bold text-green-600">+{referral.pointsEarned} pts</p>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                            Completed
                          </span>
                        </>
                      ) : (
                        <>
                          <p className="font-medium text-muted-foreground">Pending</p>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                            Awaiting first order
                          </span>
                        </>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(referral.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
        </div>
      </main>
    </div>
  );
}
