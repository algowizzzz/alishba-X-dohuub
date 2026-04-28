import { useState } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Clock, Users, Gift, Home, Calendar, MessageCircle, User } from 'lucide-react';
import type { Screen } from '../App';

interface PointsHistoryScreenProps {
  navigate: (screen: Screen, data?: any) => void;
  pointsTransactions: Array<{
    id: string;
    type: 'earned' | 'redeemed' | 'expired' | 'referral_bonus' | 'signup_bonus';
    amount: number;
    description: string;
    date: string;
    orderId?: string;
    vendorName?: string;
  }>;
  totalPoints: number;
}

type FilterType = 'all' | 'earned' | 'redeemed' | 'expired';

export function PointsHistoryScreen({ navigate, pointsTransactions, totalPoints }: PointsHistoryScreenProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'earned', label: 'Earned' },
    { key: 'redeemed', label: 'Redeemed' },
    { key: 'expired', label: 'Expired' },
  ];

  const filteredTransactions = pointsTransactions.filter((transaction) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'earned') {
      return ['earned', 'referral_bonus', 'signup_bonus'].includes(transaction.type);
    }
    if (activeFilter === 'redeemed') return transaction.type === 'redeemed';
    if (activeFilter === 'expired') return transaction.type === 'expired';
    return true;
  });

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
      default:
        return <Gift className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'earned':
      case 'referral_bonus':
      case 'signup_bonus':
        return 'text-green-600';
      case 'redeemed':
        return 'text-blue-600';
      case 'expired':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'earned':
        return 'Earned';
      case 'redeemed':
        return 'Redeemed';
      case 'expired':
        return 'Expired';
      case 'referral_bonus':
        return 'Referral Bonus';
      case 'signup_bonus':
        return 'Sign-up Bonus';
      default:
        return 'Transaction';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Group transactions by month
  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const date = new Date(transaction.date);
    const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    groups[monthYear].push(transaction);
    return groups;
  }, {} as Record<string, typeof filteredTransactions>);

  // Calculate summary stats
  const totalEarned = pointsTransactions
    .filter(t => ['earned', 'referral_bonus', 'signup_bonus'].includes(t.type))
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRedeemed = pointsTransactions
    .filter(t => t.type === 'redeemed')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalExpired = pointsTransactions
    .filter(t => t.type === 'expired')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b-2 border-gray-200 flex items-center gap-4">
        <button onClick={() => navigate('rewardsWallet')} className="p-1">
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </button>
        <h3 className="text-gray-900">Points History</h3>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {/* Summary Stats */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">+{totalEarned.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Total Earned</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">-{totalRedeemed.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Total Redeemed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">-{totalExpired.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Total Expired</div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex gap-2">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === filter.key
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        <div className="px-6 py-4">
          {Object.entries(groupedTransactions).length > 0 ? (
            Object.entries(groupedTransactions).map(([monthYear, transactions]) => (
              <div key={monthYear} className="mb-6">
                <h4 className="text-sm font-semibold text-gray-500 mb-3">{monthYear}</h4>
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="font-medium text-gray-900 truncate">
                            {transaction.description}
                          </p>
                          <span className={`font-semibold whitespace-nowrap ${getTransactionColor(transaction.type)}`}>
                            {transaction.amount > 0 ? '+' : ''}{transaction.amount} pts
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            transaction.type === 'earned' || transaction.type === 'referral_bonus' || transaction.type === 'signup_bonus'
                              ? 'bg-green-100 text-green-700'
                              : transaction.type === 'redeemed'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {getTransactionLabel(transaction.type)}
                          </span>
                          <span>•</span>
                          <span>{formatDate(transaction.date)}</span>
                        </div>
                        {transaction.vendorName && (
                          <p className="text-sm text-gray-500 mt-1">
                            {transaction.vendorName}
                            {transaction.orderId && ` • Order #${transaction.orderId}`}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Gift className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No transactions found</p>
              <p className="text-sm">
                {activeFilter === 'all'
                  ? 'Start earning points on Powered by DoHuub services!'
                  : `No ${activeFilter} transactions yet`}
              </p>
            </div>
          )}
        </div>

        {/* Points Info */}
        <div className="px-6 pb-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h4 className="font-semibold text-amber-800 mb-2">Points Redemption Info</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• 100 points = $1 discount</li>
              <li>• Minimum 100 points to redeem</li>
              <li>• Points expire 12 months after earning</li>
              <li>• Only valid on "Powered by DoHuub" services</li>
            </ul>
          </div>
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
