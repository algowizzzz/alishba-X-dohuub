import { ArrowLeft, ChevronDown, Lock, CreditCard, Gift } from 'lucide-react';
import { useState } from 'react';

interface PaymentScreenProps {
  service: any;
  onBack: () => void;
  onComplete: (booking: any) => void;
  isPoweredByDoHuub?: boolean;
  rewardsWallet?: {
    totalPoints: number;
    pendingPoints: number;
    expiringPoints: number;
    expiringDate: string | null;
  };
}

export function PaymentScreen({ service, onBack, onComplete, isPoweredByDoHuub = false, rewardsWallet }: PaymentScreenProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [usePoints, setUsePoints] = useState(false);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);

  const servicePrice = 89.00;
  const serviceFee = 8.00;
  const subtotal = servicePrice + serviceFee;

  // Points redemption calculations (100 pts = $1)
  const availablePoints = rewardsWallet?.totalPoints || 0;
  const maxRedeemablePoints = Math.min(availablePoints, Math.floor(subtotal * 100)); // Can't redeem more than order total
  const pointsDiscount = pointsToRedeem * 0.01;
  const finalTotal = subtotal - pointsDiscount;

  // Points to earn (1 pt per $1 spent after discount)
  const pointsToEarn = isPoweredByDoHuub ? Math.floor(finalTotal) : 0;

  const handlePointsSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.floor(Number(e.target.value) / 100) * 100; // Round to nearest 100
    setPointsToRedeem(value);
  };

  const handlePayment = () => {
    if (cardNumber && expiry && cvv && cardName) {
      onComplete({
        service: service.name,
        date: 'Dec 5, 2025',
        time: '10:00 AM',
        address: '123 Main St, New York',
        total: `$${finalTotal.toFixed(2)}`,
        status: 'Accepted',
        pointsEarned: pointsToEarn,
        pointsRedeemed: pointsToRedeem,
        isPoweredByDoHuub: isPoweredByDoHuub,
      });
    }
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />

      {/* Header */}
      <div
        className="px-6 py-6 relative z-10"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.06)',
          borderBottom: '1px solid rgba(46, 122, 217, 0.08)',
          borderRadius: '0 0 24px 24px',
        }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-xl transition-all duration-300 hover:shadow-card"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: 'var(--foreground)' }} strokeWidth={2} />
          </button>
          <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Payment</h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-48 relative z-10">
        {/* Order Summary */}
        <button
          onClick={() => setShowSummary(!showSummary)}
          className="w-full p-4 mb-6 rounded-xl shadow-card text-left transition-all duration-300 hover:shadow-premium-sm"
          style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className="font-medium mb-1" style={{ color: 'var(--foreground)' }}>Order Summary</p>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{service.name}</p>
            </div>
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-300 ${showSummary ? 'rotate-180' : ''}`}
              style={{ color: 'var(--muted-foreground)' }}
            />
          </div>
          {showSummary && (
            <div className="mt-4 pt-4 space-y-2" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="flex justify-between text-sm" style={{ color: 'var(--muted-foreground)' }}>
                <span>Date & Time</span>
                <span style={{ color: 'var(--foreground)' }}>Dec 5, 2025 at 10:00 AM</span>
              </div>
              <div className="flex justify-between text-sm" style={{ color: 'var(--muted-foreground)' }}>
                <span>Location</span>
                <span style={{ color: 'var(--foreground)' }}>123 Main St, New York</span>
              </div>
              <div className="flex justify-between text-sm" style={{ color: 'var(--muted-foreground)' }}>
                <span>Service</span>
                <span style={{ color: 'var(--foreground)' }}>${servicePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm" style={{ color: 'var(--muted-foreground)' }}>
                <span>Service Fee</span>
                <span style={{ color: 'var(--foreground)' }}>${serviceFee.toFixed(2)}</span>
              </div>
              {isPoweredByDoHuub && (
                <div className="flex justify-between pt-2" style={{ borderTop: '1px solid var(--border)', color: 'rgb(245, 158, 11)' }}>
                  <span className="flex items-center gap-1 text-sm">
                    <Gift className="w-4 h-4" />
                    Points you'll earn
                  </span>
                  <span className="font-semibold">+{pointsToEarn} pts</span>
                </div>
              )}
            </div>
          )}
        </button>

        {/* Points Redemption Section - Only for Powered by DoHuub */}
        {isPoweredByDoHuub && availablePoints >= 100 && (
          <div
            className="mb-6 p-4 rounded-xl shadow-card"
            style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(249, 115, 22, 0.1))',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5" style={{ color: 'rgb(245, 158, 11)' }} />
                <span className="font-semibold" style={{ color: 'var(--foreground)' }}>Use Reward Points</span>
              </div>
              <button
                onClick={() => {
                  setUsePoints(!usePoints);
                  if (!usePoints) {
                    setPointsToRedeem(Math.min(100, maxRedeemablePoints));
                  } else {
                    setPointsToRedeem(0);
                  }
                }}
                className="relative w-12 h-6 rounded-full transition-colors duration-300"
                style={{ backgroundColor: usePoints ? 'rgb(245, 158, 11)' : 'var(--muted)' }}
              >
                <div
                  className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300"
                  style={{ left: usePoints ? 'calc(100% - 22px)' : '2px' }}
                />
              </button>
            </div>

            {usePoints && (
              <div className="space-y-4">
                <div className="flex justify-between text-sm" style={{ color: 'rgb(180, 83, 9)' }}>
                  <span>Available: {availablePoints.toLocaleString()} pts</span>
                  <span>Max for this order: {maxRedeemablePoints.toLocaleString()} pts</span>
                </div>

                <div className="space-y-2">
                  <input
                    type="range"
                    min={100}
                    max={maxRedeemablePoints}
                    step={100}
                    value={pointsToRedeem}
                    onChange={handlePointsSliderChange}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, rgb(245, 158, 11) ${(pointsToRedeem / maxRedeemablePoints) * 100}%, var(--muted) ${(pointsToRedeem / maxRedeemablePoints) * 100}%)`
                    }}
                  />
                  <div className="flex justify-between text-xs" style={{ color: 'rgb(180, 83, 9)' }}>
                    <span>100 pts</span>
                    <span>{maxRedeemablePoints.toLocaleString()} pts</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3" style={{ borderTop: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  <div>
                    <span className="text-sm" style={{ color: 'rgb(180, 83, 9)' }}>Redeeming: </span>
                    <span className="font-semibold" style={{ color: 'rgb(180, 83, 9)' }}>{pointsToRedeem.toLocaleString()} pts</span>
                  </div>
                  <span className="text-lg font-bold" style={{ color: 'rgb(22, 163, 74)' }}>
                    -${pointsDiscount.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Points Earning Info - Only for Powered by DoHuub */}
        {isPoweredByDoHuub && (
          <div
            className="mb-6 p-4 rounded-xl shadow-card"
            style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(249, 115, 22, 0.1))',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              
            }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5" style={{ color: 'rgb(245, 158, 11)' }} />
                <span className="font-medium" style={{ color: 'var(--foreground)' }}>Points you'll earn</span>
              </div>
              <span className="text-lg font-bold" style={{ color: 'rgb(245, 158, 11)' }}>
                +{pointsToEarn} pts
              </span>
            </div>
            <p className="text-sm mt-1" style={{ color: 'rgb(217, 119, 6)' }}>
              Added to your wallet after service completion
            </p>
          </div>
        )}

        {/* Payment Method */}
        <div className="mb-6">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Payment Method</h3>

          <div className="mb-4">
            <label className="block font-medium mb-2" style={{ color: 'var(--foreground)' }}>Card Number</label>
            <div className="relative">
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className="w-full pl-12 pr-4 py-4 rounded-xl outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500/50"
                style={{
                  backgroundColor: 'var(--card)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)'
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-medium mb-2" style={{ color: 'var(--foreground)' }}>Expiry Date</label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder="MM/YY"
                maxLength={5}
                className="w-full px-4 py-4 rounded-xl outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500/50"
                style={{
                  backgroundColor: 'var(--card)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)'
                }}
              />
            </div>
            <div>
              <label className="block font-medium mb-2" style={{ color: 'var(--foreground)' }}>CVV</label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                maxLength={3}
                className="w-full px-4 py-4 rounded-xl outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500/50"
                style={{
                  backgroundColor: 'var(--card)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)'
                }}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2" style={{ color: 'var(--foreground)' }}>Cardholder Name</label>
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-4 rounded-xl outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500/50"
              style={{
                backgroundColor: 'var(--card)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)'
              }}
            />
          </div>

          <div
            className="flex items-center gap-2 p-4 rounded-xl shadow-card"
            style={{ backgroundColor: 'var(--muted)' }}
          >
            <input type="checkbox" id="billingAddress" defaultChecked className="w-5 h-5 accent-blue-500" />
            <label htmlFor="billingAddress" style={{ color: 'var(--foreground)' }}>Same as service address</label>
          </div>
        </div>

        {/* Security Notice */}
        <div
          className="flex items-center justify-center gap-2 p-4 rounded-xl shadow-card"
          style={{ backgroundColor: 'var(--muted)' }}
        >
          <Lock className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
          <span style={{ color: 'var(--muted-foreground)' }}>Secured by Stripe</span>
        </div>
      </div>

      {/* Bottom Payment Summary */}
      <div
        className="absolute bottom-0 left-0 right-0 px-6 py-4"
        style={{
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(46, 122, 217, 0.1)',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.08)',
          zIndex: 9999,
          pointerEvents: 'auto'
        }}
      >
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between" style={{ color: 'var(--muted-foreground)' }}>
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {pointsToRedeem > 0 && (
            <div className="flex items-center justify-between" style={{ color: 'rgb(22, 163, 74)' }}>
              <span>Points Discount ({pointsToRedeem} pts)</span>
              <span>-${pointsDiscount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid var(--border)' }}>
            <span className="font-semibold" style={{ color: 'var(--foreground)' }}>Total Amount</span>
            <span className="font-bold text-lg" style={{ color: 'var(--primary)' }}>${finalTotal.toFixed(2)}</span>
          </div>
        </div>
        <button
          onClick={handlePayment}
          disabled={!cardNumber || !expiry || !cvv || !cardName}
          className="w-full py-4 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{ background: 'var(--primary-gradient)', pointerEvents: 'auto' }}
        >
          Complete Payment
        </button>
      </div>
    </div>
  );
}
