import { ArrowLeft, Gift, Clock, Users, History, TrendingUp, TrendingDown, Home, Calendar, MessageCircle, User, Flame, Target } from 'lucide-react';
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
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b-2 border-gray-200 flex items-center gap-4">
        <button onClick={() => navigate('profile')} className="p-1">
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </button>
        <h3 className="text-gray-900">Rewards Wallet</h3>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
        {/* Points Balance Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="w-6 h-6 text-gray-900" />
            <span className="text-gray-600">Available Points</span>
          </div>
          <div className="text-4xl font-bold mb-1 text-gray-900">
            {rewardsWallet.totalPoints.toLocaleString()}
          </div>
          <div className="text-gray-600">
            ≈ ${(rewardsWallet.totalPoints * 0.01).toFixed(2)} value
          </div>
        </div>

        {/* Points Breakdown */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">Pending</span>
            </div>
            <div className="text-xl font-semibold text-gray-900">
              {rewardsWallet.pendingPoints}
            </div>
            <div className="text-xs text-gray-500">pts</div>
          </div>
          <div className="bg-red-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-500">Expiring Soon</span>
            </div>
            <div className="text-xl font-semibold text-red-600">
              {rewardsWallet.expiringPoints}
            </div>
            <div className="text-xs text-red-500">
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
            className="flex items-center justify-center gap-2 py-4 px-4 bg-purple-50 rounded-xl border border-purple-200 hover:bg-purple-100 transition-colors"
          >
            <Users className="w-5 h-5 text-purple-600" />
            <span className="text-purple-700 font-medium">Refer & Earn</span>
          </button>
          <button
            onClick={() => navigate('pointsHistory')}
            className="flex items-center justify-center gap-2 py-4 px-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <History className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700 font-medium">View History</span>
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
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
          <h4 className="font-semibold text-amber-800 mb-3">How to Earn Points</h4>
          <div className="space-y-2 text-sm text-amber-700">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span>Earn 1 point for every $1 spent on "Powered by DoHuub" services</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span>Get 60 bonus points when your referrals complete their first order</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span>100 points = $1 off your next order</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-900">Recent Activity</h4>
            <button
              onClick={() => navigate('pointsHistory')}
              className="text-sm text-amber-600 font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  {getTransactionIcon(transaction.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-medium truncate">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-gray-500">
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
        <div className="bg-gray-100 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-600">
            Points expire 12 months after earning. Use them before they're gone!
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 px-6 py-4">
        <div className="flex justify-around">
          <button onClick={() => navigate('home')} className="flex flex-col items-center gap-1">
            <Home className="w-6 h-6 text-gray-400" strokeWidth={2} />
            <span className="text-gray-400">Home</span>
          </button>
          <button onClick={() => navigate('myBookings')} className="flex flex-col items-center gap-1">
            <Calendar className="w-6 h-6 text-gray-400" strokeWidth={2} />
            <span className="text-gray-400">Bookings</span>
          </button>
          <button onClick={() => navigate('aiChat')} className="flex flex-col items-center gap-1">
            <MessageCircle className="w-6 h-6 text-gray-400" strokeWidth={2} />
            <span className="text-gray-400">AI Assistant</span>
          </button>
          <button onClick={() => navigate('profile')} className="flex flex-col items-center gap-1">
            <User className="w-6 h-6 text-gray-400" strokeWidth={2} />
            <span className="text-gray-400">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
