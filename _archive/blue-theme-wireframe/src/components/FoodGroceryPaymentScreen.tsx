import { ArrowLeft, CreditCard, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import type { CardData } from './AddPaymentCardScreen';

interface FoodGroceryPaymentScreenProps {
  total: number;
  selectedCard: CardData;
  onBack: () => void;
  onPaymentSuccess: () => void;
}

export function FoodGroceryPaymentScreen({
  total,
  selectedCard,
  onBack,
  onPaymentSuccess
}: FoodGroceryPaymentScreenProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [cvv, setCvv] = useState('');

  const handleConfirmPayment = () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentComplete(true);

      // Show success briefly then call onPaymentSuccess
      setTimeout(() => {
        onPaymentSuccess();
      }, 1500);
    }, 2000);
  };

  if (paymentComplete) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-6 relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />

        <div className="relative z-10 text-center animate-scale-in">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mb-6 mx-auto shadow-premium-md"
            style={{ background: 'linear-gradient(135deg, rgb(34, 197, 94), rgb(22, 163, 74))' }}
          >
            <CheckCircle2 className="w-16 h-16 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Payment Successful!</h1>
          <p style={{ color: 'var(--muted-foreground)' }}>Processing your order...</p>
        </div>
      </div>
    );
  }

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
            disabled={isProcessing}
            className="p-2 rounded-xl transition-all duration-300 hover:shadow-card disabled:opacity-50"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: 'var(--foreground)' }} strokeWidth={2} />
          </button>
          <div>
            <h1 className="font-semibold" style={{ color: 'var(--foreground)' }}>Payment</h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Confirm payment details</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-32 relative z-10">
        {/* Amount */}
        <div className="mb-6 text-center">
          <p className="text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>Amount to Pay</p>
          <h2 className="text-4xl font-bold" style={{ color: 'var(--primary)' }}>${total.toFixed(2)}</h2>
        </div>

        {/* Payment Card */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Payment Method</h3>
          <div
            className="rounded-2xl p-6 text-white shadow-premium-md"
            style={{ background: 'var(--primary-gradient)' }}
          >
            <div className="flex items-start justify-between mb-8">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              >
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-white/80 text-sm">{selectedCard.cardType || 'Card'}</p>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-xl tracking-widest">
                •••• •••• •••• {selectedCard.lastFourDigits || selectedCard.cardNumber.slice(-4)}
              </p>
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-white/60 text-xs mb-1">Cardholder Name</p>
                <p>{selectedCard.cardholderName}</p>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-xs mb-1">Expires</p>
                <p>{selectedCard.expiryDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* CVV Input */}
        <div className="mb-6">
          <label className="block font-medium mb-2" style={{ color: 'var(--foreground)' }}>CVV / Security Code</label>
          <input
            type="password"
            maxLength={4}
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter CVV"
            className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500/50"
            style={{
              backgroundColor: 'var(--card)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)'
            }}
            disabled={isProcessing}
          />
          <p className="text-sm mt-2" style={{ color: 'var(--muted-foreground)' }}>
            3 or 4 digit code on the back of your card
          </p>
        </div>

        {/* Security Notice */}
        <div
          className="rounded-xl p-4 shadow-card"
          style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Your payment information is encrypted and secure. We never store your CVV.
          </p>
        </div>
      </div>

      {/* Confirm Payment Button */}
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
        <button
          onClick={handleConfirmPayment}
          disabled={cvv.length < 3 || isProcessing}
          className="w-full py-4 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{ background: 'var(--primary-gradient)', pointerEvents: 'auto' }}
        >
          {isProcessing ? 'Processing Payment...' : `Confirm Payment • $${total.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
}
