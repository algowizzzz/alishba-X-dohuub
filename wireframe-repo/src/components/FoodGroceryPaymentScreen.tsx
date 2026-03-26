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
      <div className="h-full bg-white flex flex-col items-center justify-center px-6">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-16 h-16 text-green-600" strokeWidth={2} />
        </div>
        <h1 className="text-gray-900 mb-2 text-center">Payment Successful!</h1>
        <p className="text-gray-600 text-center">Processing your order...</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-gray-900" disabled={isProcessing}>
            <ArrowLeft className="w-6 h-6" strokeWidth={2} />
          </button>
          <div>
            <h1 className="text-gray-900">Payment</h1>
            <p className="text-gray-600">Confirm payment details</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-32">
        {/* Amount */}
        <div className="mb-6 text-center">
          <p className="text-gray-600 mb-2">Amount to Pay</p>
          <h2 className="text-gray-900">${total.toFixed(2)}</h2>
        </div>

        {/* Payment Card */}
        <div className="mb-6">
          <h3 className="text-gray-900 mb-3">Payment Method</h3>
          <div className="bg-gray-900 text-white rounded-2xl p-6">
            <div className="flex items-start justify-between mb-8">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-white/80 text-sm">{selectedCard.cardType || 'Card'}</p>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-white text-xl tracking-widest">
                •••• •••• •••• {selectedCard.lastFourDigits || selectedCard.cardNumber.slice(-4)}
              </p>
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-white/60 text-xs mb-1">Cardholder Name</p>
                <p className="text-white">{selectedCard.cardholderName}</p>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-xs mb-1">Expires</p>
                <p className="text-white">{selectedCard.expiryDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* CVV Input */}
        <div className="mb-6">
          <label className="block text-gray-900 mb-2">CVV / Security Code</label>
          <input
            type="password"
            maxLength={4}
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter CVV"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-900 outline-none"
            disabled={isProcessing}
          />
          <p className="text-gray-500 text-sm mt-2">
            3 or 4 digit code on the back of your card
          </p>
        </div>

        {/* Security Notice */}
        <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
          <p className="text-gray-600 text-sm">
            🔒 Your payment information is encrypted and secure. We never store your CVV.
          </p>
        </div>
      </div>

      {/* Confirm Payment Button */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 px-6 py-4">
        <button
          onClick={handleConfirmPayment}
          disabled={cvv.length < 3 || isProcessing}
          className="w-full bg-gray-900 text-white rounded-xl py-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing Payment...' : `Confirm Payment • $${total.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
}
