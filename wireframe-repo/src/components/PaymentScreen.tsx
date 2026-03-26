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
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-4 border-b-2 border-gray-200">
        <div className="flex items-center gap-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
          </button>
          <h3 className="text-gray-900">Payment</h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-32">
        <button
          onClick={() => setShowSummary(!showSummary)}
          className="w-full p-4 mb-6 border-2 border-gray-200 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className="text-gray-900 mb-1">Order Summary</p>
              <p className="text-gray-600">{service.name}</p>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${showSummary ? 'rotate-180' : ''}`} />
          </div>
          {showSummary && (
            <div className="mt-4 pt-4 border-t-2 border-gray-200 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Date & Time</span>
                <span>Dec 5, 2025 at 10:00 AM</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Location</span>
                <span>123 Main St, New York</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Service</span>
                <span>${servicePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Service Fee</span>
                <span>${serviceFee.toFixed(2)}</span>
              </div>
              {isPoweredByDoHuub && (
                <div className="flex justify-between text-amber-600 pt-2 border-t border-gray-100">
                  <span className="flex items-center gap-1">
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
          <div className="mb-6 p-4 border-2 border-amber-200 bg-amber-50 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-600" />
                <span className="font-semibold text-gray-900">Use Reward Points</span>
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
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  usePoints ? 'bg-amber-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${
                    usePoints ? 'right-0.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {usePoints && (
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
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
                    className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>100 pts</span>
                    <span>{maxRedeemablePoints.toLocaleString()} pts</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-amber-200">
                  <div>
                    <span className="text-sm text-gray-600">Redeeming: </span>
                    <span className="font-semibold text-amber-700">{pointsToRedeem.toLocaleString()} pts</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    -${pointsDiscount.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Points Earning Info - Only for Powered by DoHuub */}
        {isPoweredByDoHuub && (
          <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-600" />
                <span className="font-medium text-gray-900">Points you'll earn</span>
              </div>
              <span className="text-lg font-bold text-amber-600">
                +{pointsToEarn} pts
              </span>
            </div>
            <p className="text-sm text-amber-600 mt-1">
              Added to your wallet after service completion
            </p>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-gray-900 mb-4">Payment Method</h3>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Card Number</label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Expiry Date</label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder="MM/YY"
                maxLength={5}
                className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">CVV</label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                maxLength={3}
                className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Cardholder Name</label>
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg"
            />
          </div>

          <div className="flex items-center gap-2 p-4 bg-gray-100 rounded-lg">
            <input type="checkbox" id="billingAddress" defaultChecked className="w-5 h-5" />
            <label htmlFor="billingAddress" className="text-gray-700">Same as service address</label>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 p-4 bg-gray-100 rounded-lg">
          <Lock className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700">Secured by Stripe</span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 px-6 py-4">
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-600">${subtotal.toFixed(2)}</span>
          </div>
          {pointsToRedeem > 0 && (
            <div className="flex items-center justify-between text-green-600">
              <span>Points Discount ({pointsToRedeem} pts)</span>
              <span>-${pointsDiscount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <span className="text-gray-900 font-semibold">Total Amount</span>
            <span className="text-gray-900 font-bold text-lg">${finalTotal.toFixed(2)}</span>
          </div>
        </div>
        <button
          onClick={handlePayment}
          disabled={!cardNumber || !expiry || !cvv || !cardName}
          className={`w-full py-4 rounded-lg border-2 ${
            cardNumber && expiry && cvv && cardName
              ? 'bg-gray-800 text-white border-gray-800'
              : 'bg-gray-200 text-gray-400 border-gray-200'
          }`}
        >
          Complete Payment
        </button>
      </div>
    </div>
  );
}
