import { ArrowLeft, Gift, Clock, Users, History, TrendingUp, TrendingDown, Flame, Target } from 'lucide-react';
import type { Screen } from '../App';
import StreakCard from './StreakCard';
import { MilestoneSummaryCard } from './MilestoneProgressCard';

interface StreakMilestone {
  weeks: number;
  points: number;
  achieved: boolean;
}

interface CategoryMilestoneData {
  orderCount: number;
  milestones: Array<{
    target: number;
    points: number;
    achieved: boolean;
  }>;
}

interface RewardsWalletScreenProps {
  navigate: (screen: Screen, data?: any) => void;
  rewardsWallet: {
    totalPoints: number;
    pendingPoints: number;
    expiringPoints: number;
    expiringDate: string | null;
  };
  pointsTransactions: Array<{
    id: string;
    type: 'earned' | 'redeemed' | 'expired' | 'referral_bonus' | 'signup_bonus' | 'streak_bonus' | 'milestone_bonus';
    amount: number;
    description: string;
    date: string;
    orderId?: string;
    vendorName?: string;
  }>;
  streakData?: {
    currentStreak: number;
    longestStreak: number;
    lastActiveWeek: string;
    streakMilestones: StreakMilestone[];
  };
  categoryMilestones?: {
    [category: string]: CategoryMilestoneData;
  };
}

export function RewardsWalletScreen({
  navigate,
  rewardsWallet,
  pointsTransactions,
  streakData,
  categoryMilestones
}: RewardsWalletScreenProps) {
  // Get recent transactions (last 5)
  const recentTransactions = pointsTransactions.slice(0, 5);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earned':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'redeemed':
        return <TrendingDown className="w-5 h-5 text-blue-500" />;
      case 'expired':
        return <Clock className="w-5 h-5 text-red-500" />;
      case 'referral_bonus':
        return <Users className="w-5 h-5 text-purple-500" />;
      case 'signup_bonus':
        return <Gift className="w-5 h-5 text-amber-500" />;
      case 'streak_bonus':
        return <Flame className="w-5 h-5 text-orange-500" />;
      case 'milestone_bonus':
        return <Target className="w-5 h-5 text-amber-500" />;
      default:
        return <Gift className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'earned':
      case 'referral_bonus':
      case 'signup_bonus':
      case 'streak_bonus':
      case 'milestone_bonus':
        return 'text-green-600';
      case 'redeemed':
        return 'text-blue-600';
      case 'expired':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Background pattern */}
      <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />

      {/* Header */}
      <div
        className="px-6 py-6 relative z-10 flex items-center gap-4"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.06)',
          borderBottom: '1px solid rgba(46, 122, 217, 0.08)',
          borderRadius: '0 0 24px 24px',
        }}
      >
        <button onClick={() => navigate('profile')} className="p-1 transition-all duration-200 hover:opacity-80 hover:-translate-x-1">
          <ArrowLeft className="w-6 h-6" style={{ color: 'var(--foreground)' }} />
        </button>
        <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Rewards Wallet</h3>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-32 relative z-10">
        {/* Points Balance Card */}
        <div className="rounded-2xl p-6 mb-6 shadow-premium-lg" style={{ background: 'var(--primary-gradient)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Gift className="w-6 h-6 text-white/80" />
            <span className="text-white/80">Available Points</span>
          </div>
          <div className="text-4xl font-bold mb-1 text-white">
            {rewardsWallet.totalPoints.toLocaleString()}
          </div>
          <div className="text-white/70">
            ≈ ${(rewardsWallet.totalPoints * 0.01).toFixed(2)} value
          </div>
        </div>

        {/* Points Breakdown */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="rounded-xl p-4 shadow-card" style={{ backgroundColor: 'var(--secondary)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
              <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Pending</span>
            </div>
            <div className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
              {rewardsWallet.pendingPoints}
            </div>
            <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>pts</div>
          </div>
          <div className="rounded-xl p-4 shadow-card" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4" style={{ color: 'var(--destructive)' }} />
              <span className="text-sm" style={{ color: 'var(--destructive)' }}>Expiring Soon</span>
            </div>
            <div className="text-xl font-semibold" style={{ color: 'var(--destructive)' }}>
              {rewardsWallet.expiringPoints}
            </div>
            <div className="text-xs" style={{ color: 'var(--destructive)' }}>
              {rewardsWallet.expiringDate
                ? `by ${new Date(rewardsWallet.expiringDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                : 'pts'
              }
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => navigate('referralScreen')}
            className="flex items-center justify-center gap-2 py-4 px-4 rounded-xl shadow-card transition-all duration-300 hover:shadow-premium-md hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: 'rgba(147, 51, 234, 0.1)', border: '1px solid rgba(147, 51, 234, 0.2)' }}
          >
            <Users className="w-5 h-5" style={{ color: 'rgb(147, 51, 234)' }} />
            <span className="font-medium" style={{ color: 'rgb(126, 34, 206)' }}>Refer & Earn</span>
          </button>
          <button
            onClick={() => navigate('pointsHistory')}
            className="flex items-center justify-center gap-2 py-4 px-4 rounded-xl shadow-card transition-all duration-300 hover:shadow-premium-md hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: 'var(--secondary)', border: '1px solid var(--border)' }}
          >
            <History className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
            <span className="font-medium" style={{ color: 'var(--foreground)' }}>View History</span>
          </button>
        </div>

        {/* Activity Streak */}
        {streakData && (
          <div className="mb-8">
            <StreakCard
              currentStreak={streakData.currentStreak}
              longestStreak={streakData.longestStreak}
              streakMilestones={streakData.streakMilestones}
            />
          </div>
        )}

        {/* Category Milestones */}
        {categoryMilestones && (
          <div className="mb-8">
            <MilestoneSummaryCard
              categoryMilestones={categoryMilestones}
            />
          </div>
        )}

        {/* How to Earn */}
        <div className="rounded-xl p-4 mb-8 shadow-card" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
          <h4 className="font-semibold mb-3" style={{ color: 'rgb(180, 83, 9)' }}>How to Earn Points</h4>
          <div className="space-y-2 text-sm" style={{ color: 'rgb(180, 83, 9)' }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgb(245, 158, 11)' }}></div>
              <span>Earn 1 point for every $1 spent on "Powered by DoHuub" services</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgb(245, 158, 11)' }}></div>
              <span>Get 60 bonus points when your referrals complete their first order</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgb(245, 158, 11)' }}></div>
              <span>100 points = $1 off your next order</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold" style={{ color: 'var(--foreground)' }}>Recent Activity</h4>
            <button
              onClick={() => navigate('pointsHistory')}
              className="text-sm font-medium transition-opacity hover:opacity-80"
              style={{ color: 'var(--primary)' }}
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentTransactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className="flex items-center gap-4 p-3 rounded-lg shadow-card transition-all duration-300 hover:shadow-premium-sm"
                style={{ backgroundColor: 'var(--card)' }}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-premium-sm" style={{ backgroundColor: 'var(--background)' }}>
                  {getTransactionIcon(transaction.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate" style={{ color: 'var(--foreground)' }}>
                    {transaction.description}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    {formatDate(transaction.date)}
                    {transaction.vendorName && ` • ${transaction.vendorName}`}
                  </p>
                </div>
                <div className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount} pts
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Points Expiry Notice */}
        <div className="rounded-xl p-4 text-center shadow-card" style={{ backgroundColor: 'var(--secondary)' }}>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Points expire 12 months after earning. Use them before they're gone!
          </p>
        </div>
      </div>
    </div>
  );
}
