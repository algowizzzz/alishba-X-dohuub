import { useState } from 'react';
import { Gift } from 'lucide-react';

interface ReferralCodeSetupScreenProps {
  onDone: (referralCode?: string) => void;
  onSkip: () => void;
}

export function ReferralCodeSetupScreen({ onDone, onSkip }: ReferralCodeSetupScreenProps) {
  const [referralCode, setReferralCode] = useState('');

  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Background pattern */}
      <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />

      <div className="px-6 py-4 border-b glass relative z-10" style={{ borderColor: 'rgba(46, 122, 217, 0.1)' }}>
        <p className="font-medium" style={{ color: 'var(--primary)' }}>Almost Done!</p>
      </div>

      <div className="flex-1 px-8 pt-12 overflow-y-auto relative z-10 flex flex-col items-center">
        {/* Icon */}
        <div
          className="w-32 h-32 rounded-full flex items-center justify-center mb-8 shadow-premium-lg"
          style={{ backgroundColor: '#FEF3C7' }}
        >
          <Gift
            className="w-16 h-16"
            style={{ color: '#F59E0B' }}
            strokeWidth={1.5}
          />
        </div>

        <h2 className="mb-2 text-center" style={{ color: 'var(--foreground)' }}>Have a Referral Code?</h2>
        <p className="mb-8 text-center max-w-sm" style={{ color: 'var(--muted-foreground)' }}>
          Enter your referral code to earn bonus rewards when you complete your first booking
        </p>

        {/* Referral Code Input */}
        <div className="w-full max-w-sm mb-4">
          <input
            type="text"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
            placeholder="Enter referral code"
            className="w-full px-4 py-4 rounded-xl text-center text-xl tracking-widest uppercase shadow-card transition-all duration-300 focus:shadow-premium-md focus:outline-none"
            style={{
              backgroundColor: 'var(--card)',
              color: 'var(--foreground)',
              border: '2px solid rgba(46, 122, 217, 0.2)',
            }}
            maxLength={10}
          />
        </div>

        {/* Bonus info */}
        <div className="w-full max-w-sm p-4 rounded-xl mb-8" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
          <p className="text-center text-sm" style={{ color: '#F59E0B' }}>
            🎉 Both you and your friend will earn <strong>500 bonus points</strong> when you complete your first booking!
          </p>
        </div>
      </div>

      <div className="p-6 border-t glass space-y-3 relative z-10" style={{ borderColor: 'rgba(46, 122, 217, 0.1)' }}>
        <button
          onClick={() => onDone(referralCode || undefined)}
          className="w-full py-4 rounded-xl text-white shadow-premium-lg transition-all duration-300 hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: 'var(--primary-gradient)' }}
        >
          {referralCode ? 'Apply & Continue' : 'Continue'}
        </button>

        <button
          onClick={onSkip}
          className="w-full py-2 transition-all duration-200 hover:opacity-80 hover:scale-105 active:scale-95"
          style={{ color: 'var(--muted-foreground)' }}
        >
          Skip for Now
        </button>
      </div>
    </div>
  );
}
