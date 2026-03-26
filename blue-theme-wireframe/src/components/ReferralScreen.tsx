import { ArrowLeft, Copy, Share2, Users, Gift, CheckCircle, Clock } from 'lucide-react';
import { useState } from 'react';
import type { Screen } from '../App';

interface ReferralScreenProps {
  navigate: (screen: Screen, data?: any) => void;
  referralInfo: {
    referralCode: string;
    referralLink: string;
    totalReferrals: number;
    pendingReferrals: number;
    totalPointsFromReferrals: number;
    referrals: Array<{
      id: string;
      name: string;
      status: 'pending' | 'completed';
      pointsEarned: number;
      date: string;
    }>;
  };
}

export function ReferralScreen({ navigate, referralInfo }: ReferralScreenProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralInfo.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralInfo.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join DoHuub!',
          text: `Join DoHuub and get 35 bonus points! Use my referral code: ${referralInfo.referralCode}`,
          url: referralInfo.referralLink,
        });
      } catch (err) {
        // User cancelled or share failed, copy to clipboard instead
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const completedReferrals = referralInfo.referrals.filter(r => r.status === 'completed').length;

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
        <button onClick={() => navigate('rewardsWallet')} className="p-1 transition-all duration-200 hover:opacity-80 hover:-translate-x-1">
          <ArrowLeft className="w-6 h-6" style={{ color: 'var(--foreground)' }} />
        </button>
        <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Refer a Friend</h3>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-32 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-premium-lg animate-float" style={{ background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.2), rgba(126, 34, 206, 0.3))' }}>
            <Gift className="w-10 h-10" style={{ color: 'rgb(147, 51, 234)' }} />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
            Share & Earn Points
          </h2>
          <p style={{ color: 'var(--muted-foreground)' }}>
            Invite friends to DoHuub and you both earn rewards!
          </p>
        </div>

        {/* Referral Code Card */}
        <div className="rounded-2xl p-6 mb-6 shadow-premium-md" style={{ backgroundColor: 'var(--card)' }}>
          <p className="text-sm mb-2 text-center" style={{ color: 'var(--muted-foreground)' }}>Your Referral Code</p>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="text-2xl font-bold tracking-wider" style={{ color: 'var(--foreground)' }}>
              {referralInfo.referralCode}
            </div>
            <button
              onClick={handleCopyCode}
              className="p-2 rounded-lg shadow-card transition-all duration-200 hover:shadow-premium-sm hover:scale-105 active:scale-95"
              style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}
            >
              {copied ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Copy className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
              )}
            </button>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 py-3 text-white rounded-xl font-medium shadow-premium-md transition-all duration-300 hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, rgb(147, 51, 234), rgb(126, 34, 206))' }}
            >
              <Share2 className="w-5 h-5" />
              Share Link
            </button>
            <button
              onClick={handleCopyLink}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium shadow-card transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
            >
              <Copy className="w-5 h-5" />
              Copy Link
            </button>
          </div>
        </div>

        {/* How it Works */}
        <div className="rounded-xl p-5 mb-8 shadow-card" style={{ background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(126, 34, 206, 0.15))', border: '1px solid rgba(147, 51, 234, 0.2)' }}>
          <h4 className="font-semibold mb-4" style={{ color: 'rgb(126, 34, 206)' }}>How it Works</h4>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-premium-sm" style={{ background: 'rgba(147, 51, 234, 0.2)' }}>
                <Users className="w-4 h-4" style={{ color: 'rgb(126, 34, 206)' }} />
              </div>
              <div>
                <p className="font-medium" style={{ color: 'rgb(88, 28, 135)' }}>Share your code</p>
                <p className="text-sm" style={{ color: 'rgb(126, 34, 206)' }}>Send your unique code to friends</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-premium-sm" style={{ background: 'rgba(147, 51, 234, 0.2)' }}>
                <CheckCircle className="w-4 h-4" style={{ color: 'rgb(126, 34, 206)' }} />
              </div>
              <div>
                <p className="font-medium" style={{ color: 'rgb(88, 28, 135)' }}>They sign up & order</p>
                <p className="text-sm" style={{ color: 'rgb(126, 34, 206)' }}>Friend joins and completes their first order</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-premium-sm" style={{ background: 'rgba(147, 51, 234, 0.2)' }}>
                <Gift className="w-4 h-4" style={{ color: 'rgb(126, 34, 206)' }} />
              </div>
              <div>
                <p className="font-medium" style={{ color: 'rgb(88, 28, 135)' }}>You both get rewarded!</p>
                <p className="text-sm" style={{ color: 'rgb(126, 34, 206)' }}>
                  <span className="font-semibold">You get 60 pts</span> • <span className="font-semibold">They get 35 pts</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="rounded-xl p-4 text-center shadow-card" style={{ backgroundColor: 'var(--secondary)' }}>
            <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{referralInfo.totalReferrals}</div>
            <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Total Referrals</div>
          </div>
          <div className="rounded-xl p-4 text-center shadow-card" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
            <div className="text-2xl font-bold" style={{ color: 'rgb(217, 119, 6)' }}>{referralInfo.pendingReferrals}</div>
            <div className="text-xs" style={{ color: 'rgb(217, 119, 6)' }}>Pending</div>
          </div>
          <div className="rounded-xl p-4 text-center shadow-card" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
            <div className="text-2xl font-bold" style={{ color: 'rgb(22, 163, 74)' }}>{referralInfo.totalPointsFromReferrals}</div>
            <div className="text-xs" style={{ color: 'rgb(22, 163, 74)' }}>Points Earned</div>
          </div>
        </div>

        {/* Referral History */}
        <div>
          <h4 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Referral History</h4>
          {referralInfo.referrals.length > 0 ? (
            <div className="space-y-3">
              {referralInfo.referrals.map((referral, index) => (
                <div
                  key={referral.id}
                  className="flex items-center gap-4 p-4 rounded-xl shadow-card transition-all duration-300 hover:shadow-premium-sm"
                  style={{ backgroundColor: 'var(--card)' }}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-premium-sm" style={{ backgroundColor: 'var(--secondary)' }}>
                    <span className="font-medium" style={{ color: 'var(--primary)' }}>
                      {referral.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium" style={{ color: 'var(--foreground)' }}>{referral.name}</p>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{formatDate(referral.date)}</p>
                  </div>
                  {referral.status === 'completed' ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-green-600 font-semibold">+{referral.pointsEarned} pts</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" style={{ color: 'rgb(245, 158, 11)' }} />
                      <span className="font-medium" style={{ color: 'rgb(217, 119, 6)' }}>Pending</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--muted-foreground)', opacity: 0.5 }} />
              <p style={{ color: 'var(--muted-foreground)' }}>No referrals yet</p>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)', opacity: 0.7 }}>Share your code to start earning!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
