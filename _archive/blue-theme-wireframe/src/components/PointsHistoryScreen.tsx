import { useState } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Clock, Users, Gift } from 'lucide-react';
import type { Screen } from '../App';
import { BottomNavigation } from './BottomNavigation';

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
        return <TrendingUp className="w-5 h-5" style={{ color: 'rgb(34, 197, 94)' }} />;
      case 'redeemed':
        return <TrendingDown className="w-5 h-5" style={{ color: 'var(--primary)' }} />;
      case 'expired':
        return <Clock className="w-5 h-5" style={{ color: 'var(--destructive)' }} />;
      case 'referral_bonus':
        return <Users className="w-5 h-5" style={{ color: 'rgb(147, 51, 234)' }} />;
      case 'signup_bonus':
        return <Gift className="w-5 h-5" style={{ color: 'rgb(245, 158, 11)' }} />;
      default:
        return <Gift className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'earned':
      case 'referral_bonus':
      case 'signup_bonus':
        return 'rgb(22, 163, 74)';
      case 'redeemed':
        return 'var(--primary)';
      case 'expired':
        return 'var(--destructive)';
      default:
        return 'var(--muted-foreground)';
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

  const getTransactionBadgeStyle = (type: string) => {
    switch (type) {
      case 'earned':
      case 'referral_bonus':
      case 'signup_bonus':
        return { backgroundColor: 'rgba(34, 197, 94, 0.1)', color: 'rgb(22, 163, 74)' };
      case 'redeemed':
        return { backgroundColor: 'rgba(46, 122, 217, 0.1)', color: 'var(--primary)' };
      case 'expired':
        return { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--destructive)' };
      default:
        return { backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' };
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
    <div className="h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Background Pattern */}
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
        <button
          onClick={() => navigate('rewardsWallet')}
          className="p-2 rounded-xl transition-all duration-300 hover:shadow-card"
          style={{ backgroundColor: 'var(--card)' }}
        >
          <ArrowLeft className="w-5 h-5" style={{ color: 'var(--foreground)' }} />
        </button>
        <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Points History</h3>
      </div>

      <div className="flex-1 overflow-y-auto pb-32 relative z-10">
        {/* Summary Stats */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-3 gap-3">
            <div
              className="text-center p-4 rounded-xl shadow-card"
              style={{ backgroundColor: 'var(--card)' }}
            >
              <div className="text-lg font-bold" style={{ color: 'rgb(22, 163, 74)' }}>+{totalEarned.toLocaleString()}</div>
              <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Total Earned</div>
            </div>
            <div
              className="text-center p-4 rounded-xl shadow-card"
              style={{ backgroundColor: 'var(--card)' }}
            >
              <div className="text-lg font-bold" style={{ color: 'var(--primary)' }}>-{totalRedeemed.toLocaleString()}</div>
              <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Total Redeemed</div>
            </div>
            <div
              className="text-center p-4 rounded-xl shadow-card"
              style={{ backgroundColor: 'var(--card)' }}
            >
              <div className="text-lg font-bold" style={{ color: 'var(--destructive)' }}>-{totalExpired.toLocaleString()}</div>
              <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Total Expired</div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-6 py-4">
          <div className="flex gap-2">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
                style={{
                  background: activeFilter === filter.key ? 'var(--primary-gradient)' : 'var(--chip-background)',
                  color: activeFilter === filter.key ? 'white' : 'var(--muted-foreground)',
                  boxShadow: activeFilter === filter.key ? '0 4px 12px rgba(46, 122, 217, 0.3)' : 'none'
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        <div className="px-6 py-4">
          {Object.entries(groupedTransactions).length > 0 ? (
            Object.entries(groupedTransactions).map(([monthYear, transactions], groupIndex) => (
              <div key={monthYear} className="mb-6" style={{ }}>
                <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--muted-foreground)' }}>{monthYear}</h4>
                <div className="space-y-3">
                  {transactions.map((transaction, index) => (
                    <div
                      key={transaction.id}
                      className="flex items-start gap-4 p-4 rounded-xl shadow-card transition-all duration-300 hover:shadow-premium-sm"
                      style={{
                        backgroundColor: 'var(--card)',
                                              }}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-premium-sm"
                        style={{ backgroundColor: 'var(--background)' }}
                      >
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="font-medium truncate" style={{ color: 'var(--foreground)' }}>
                            {transaction.description}
                          </p>
                          <span className="font-semibold whitespace-nowrap" style={{ color: getTransactionColor(transaction.type) }}>
                            {transaction.amount > 0 ? '+' : ''}{transaction.amount} pts
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                          <span
                            className="px-2 py-0.5 rounded text-xs font-medium"
                            style={getTransactionBadgeStyle(transaction.type)}
                          >
                            {getTransactionLabel(transaction.type)}
                          </span>
                          <span>•</span>
                          <span>{formatDate(transaction.date)}</span>
                        </div>
                        {transaction.vendorName && (
                          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
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
            <div className="text-center py-12">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center shadow-premium-md"
                style={{ backgroundColor: 'var(--card)' }}
              >
                <Gift className="w-8 h-8" style={{ color: 'var(--muted-foreground)' }} />
              </div>
              <p className="font-medium" style={{ color: 'var(--foreground)' }}>No transactions found</p>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                {activeFilter === 'all'
                  ? 'Start earning points on Powered by DoHuub services!'
                  : `No ${activeFilter} transactions yet`}
              </p>
            </div>
          )}
        </div>

        {/* Points Info */}
        <div className="px-6 pb-6">
          <div
            className="rounded-xl p-4 shadow-card"
            style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05))',
              border: '1px solid rgba(245, 158, 11, 0.2)'
            }}
          >
            <h4 className="font-semibold mb-2" style={{ color: 'rgb(180, 83, 9)' }}>Points Redemption Info</h4>
            <ul className="text-sm space-y-1" style={{ color: 'rgb(146, 64, 14)' }}>
              <li>• 100 points = $1 discount</li>
              <li>• Minimum 100 points to redeem</li>
              <li>• Points expire 12 months after earning</li>
              <li>• Only valid on "Powered by DoHuub" services</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="none" navigate={navigate} />
    </div>
  );
}
