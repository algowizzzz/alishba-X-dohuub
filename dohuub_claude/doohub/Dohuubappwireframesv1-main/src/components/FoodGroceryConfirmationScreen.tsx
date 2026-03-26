import { ArrowLeft, MapPin, CreditCard, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import type { Address } from './AddAddressScreen';
import type { CardData } from './AddPaymentCardScreen';

interface FoodGroceryConfirmationScreenProps {
  orderData: any;
  addresses: Address[];
  paymentCards: CardData[];
  onBack: () => void;
  onChangeAddress: () => void;
  onChangePayment: () => void;
  onOrderPlaced: (orderData: any) => void;
}

export function FoodGroceryConfirmationScreen({
  orderData,
  addresses,
  paymentCards,
  onBack,
  onChangeAddress,
  onChangePayment,
  onOrderPlaced
}: FoodGroceryConfirmationScreenProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const selectedAddress = orderData.address;
  const selectedCard = orderData.paymentCard;

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsConfirmed(true);
      
      // Show confirmation for 2 seconds then proceed
      setTimeout(() => {
        onOrderPlaced(orderData);
      }, 2000);
    }, 2000);
  };

  // Payment processing animation
  if (isProcessing) {
    return (
      <div className="h-full bg-white flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-gray-900 mb-2">Processing Payment...</h2>
          <p className="text-gray-600">Please wait while we confirm your order</p>
        </div>
      </div>
    );
  }

  // Payment confirmed animation
  if (isConfirmed) {
    return (
      <div className="h-full bg-white flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={2} />
          </div>
          <h2 className="text-gray-900 mb-2">Payment Confirmed!</h2>
          <p className="text-gray-600">Your order has been placed successfully</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-gray-900">
            <ArrowLeft className="w-6 h-6" strokeWidth={2} />
          </button>
          <h1 className="text-gray-900">Confirm Order</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Delivery Address */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900">Delivery Address</h3>
            <button 
              onClick={onChangeAddress}
              className="text-gray-600 underline"
            >
              Change
            </button>
          </div>
          {selectedAddress ? (
            <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-700 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="text-gray-900 mb-1">{selectedAddress.label}</p>
                  <p className="text-gray-600">
                    {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
              <p className="text-gray-600 text-center">No address selected</p>
            </div>
          )}
        </div>

        {/* Payment Method */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900">Payment Method</h3>
            <button 
              onClick={onChangePayment}
              className="text-gray-600 underline"
            >
              Change
            </button>
          </div>
          {selectedCard ? (
            <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900">{selectedCard.cardType || 'Card'} •••• {selectedCard.lastFourDigits || selectedCard.cardNumber.slice(-4)}</p>
                  <p className="text-gray-600">{selectedCard.cardholderName}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
              <p className="text-gray-600 text-center">No payment method selected</p>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200 mb-6">
          <h3 className="text-gray-900 mb-3">Order Summary</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-gray-600">
              <span>Vendor</span>
              <span className="text-gray-900">{orderData.vendorName}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Items</span>
              <span className="text-gray-900">{orderData.items.length} item(s)</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${orderData.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span>${orderData.deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>${orderData.tax.toFixed(2)}</span>
            </div>
            <div className="border-t-2 border-gray-200 pt-2 mt-2">
              <div className="flex justify-between text-gray-900">
                <span>Total</span>
                <span>${orderData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Place Order Button */}
      <div className="bg-white border-t-2 border-gray-200 px-6 py-4">
        <button
          onClick={handlePlaceOrder}
          disabled={!selectedAddress || !selectedCard}
          className="w-full bg-gray-900 text-white rounded-xl py-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Place Order • ${orderData.total.toFixed(2)}
        </button>
      </div>
    </div>
  );
}
