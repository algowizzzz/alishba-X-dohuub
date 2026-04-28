import { ArrowLeft, ChevronDown, Lock, CreditCard } from 'lucide-react';
import { useState } from 'react';

interface PaymentScreenProps {
  service: any;
  onBack: () => void;
  onComplete: (booking: any) => void;
}

export function PaymentScreen({ service, onBack, onComplete }: PaymentScreenProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  const handlePayment = () => {
    if (cardNumber && expiry && cvv && cardName) {
      onComplete({
        service: service.name,
        date: 'Dec 5, 2025',
        time: '10:00 AM',
        address: '123 Main St, New York',
        total: '$97.00',
        status: 'Accepted',
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
                <span>$89.00</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Service Fee</span>
                <span>$8.00</span>
              </div>
            </div>
          )}
        </button>

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
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-700">Total Amount</span>
          <span className="text-gray-900">$97.00</span>
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