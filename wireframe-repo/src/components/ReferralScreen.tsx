import { ArrowLeft, Copy, Share2, Users, Gift, CheckCircle, Clock, Home, Calendar, MessageCircle, User } from 'lucide-react';
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
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b-2 border-gray-200 flex items-center gap-4">
        <button onClick={() => navigate('rewardsWallet')} className="p-1">
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </button>
        <h3 className="text-gray-900">Refer a Friend</h3>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-10 h-10 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Share & Earn Points
          </h2>
          <p className="text-gray-600">
            Invite friends to DoHuub and you both earn rewards!
          </p>
        </div>

        {/* Referral Code Card */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-6">
          <p className="text-sm text-gray-500 mb-2 text-center">Your Referral Code</p>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="text-2xl font-bold text-gray-900 tracking-wider">
              {referralInfo.referralCode}
            </div>
            <button
              onClick={handleCopyCode}
              className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              {copied ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Copy className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              Share Link
            </button>
            <button
              onClick={handleCopyLink}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              <Copy className="w-5 h-5" />
              Copy Link
            </button>
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 mb-8">
          <h4 className="font-semibold text-purple-800 mb-4">How it Works</h4>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-purple-700" />
              </div>
              <div>
                <p className="font-medium text-purple-900">Share your code</p>
                <p className="text-sm text-purple-700">Send your unique code to friends</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-purple-700" />
              </div>
              <div>
                <p className="font-medium text-purple-900">They sign up & order</p>
                <p className="text-sm text-purple-700">Friend joins and completes their first order</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center flex-shrink-0">
                <Gift className="w-4 h-4 text-purple-700" />
              </div>
              <div>
                <p className="font-medium text-purple-900">You both get rewarded!</p>
                <p className="text-sm text-purple-700">
                  <span className="font-semibold">You get 60 pts</span> • <span className="font-semibold">They get 35 pts</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{referralInfo.totalReferrals}</div>
            <div className="text-xs text-gray-500">Total Referrals</div>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">{referralInfo.pendingReferrals}</div>
            <div className="text-xs text-amber-600">Pending</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{referralInfo.totalPointsFromReferrals}</div>
            <div className="text-xs text-green-600">Points Earned</div>
          </div>
        </div>

        {/* Referral History */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Referral History</h4>
          {referralInfo.referrals.length > 0 ? (
            <div className="space-y-3">
              {referralInfo.referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                >
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {referral.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{referral.name}</p>
                    <p className="text-sm text-gray-500">{formatDate(referral.date)}</p>
                  </div>
                  {referral.status === 'completed' ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-green-600 font-semibold">+{referral.pointsEarned} pts</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span className="text-amber-600 font-medium">Pending</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No referrals yet</p>
              <p className="text-sm">Share your code to start earning!</p>
            </div>
          )}
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
