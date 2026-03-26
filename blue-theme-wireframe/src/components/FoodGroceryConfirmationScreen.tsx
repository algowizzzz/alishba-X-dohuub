import { ArrowLeft, MapPin, CreditCard, CheckCircle2, Gift } from 'lucide-react';
import { useState } from 'react';
import type { Address } from './AddAddressScreen';
import type { CardData } from './AddPaymentCardScreen';
import type { Screen } from '../App';

interface FoodGroceryConfirmationScreenProps {
  orderData: any;
  addresses: Address[];
  paymentCards: CardData[];
  isPoweredByDoHuub?: boolean;
  onBack: () => void;
  onChangeAddress: () => void;
  onChangePayment: () => void;
  onOrderPlaced: (orderData: any) => void;
  navigate?: (screen: Screen) => void;
}

export function FoodGroceryConfirmationScreen({
  orderData,
  addresses,
  paymentCards,
  isPoweredByDoHuub,
  onBack,
  onChangeAddress,
  onChangePayment,
  onOrderPlaced,
  navigate
}: FoodGroceryConfirmationScreenProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const selectedAddress = orderData.address;
  const selectedCard = orderData.paymentCard;

  // Points redemption calculation
  const pointsRedeemed = orderData.pointsRedeemed || 0;
  const discountAmount = pointsRedeemed / 100;
  const pointsToEarn = Math.floor(orderData.total);

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
      <div className="h-full flex items-center justify-center px-6 relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
        <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />
        <div className="text-center relative z-10">
          <div
            className="w-20 h-20 rounded-full animate-spin mx-auto mb-6"
            style={{
              border: '4px solid var(--muted)',
              borderTopColor: 'var(--primary)'
            }}
          />
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Processing Payment...</h2>
          <p style={{ color: 'var(--muted-foreground)' }}>Please wait while we confirm your order</p>
        </div>
      </div>
    );
  }

  // Payment confirmed animation
  if (isConfirmed) {
    return (
      <div className="h-full flex items-center justify-center px-6 relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
        <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />
        <div className="text-center relative z-10 animate-scale-in">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce shadow-premium-md"
            style={{ background: 'linear-gradient(135deg, rgb(34, 197, 94), rgb(22, 163, 74))' }}
          >
            <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={2} />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Payment Confirmed!</h2>
          <p style={{ color: 'var(--muted-foreground)' }}>Your order has been placed successfully</p>
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
            className="p-2 rounded-xl transition-all duration-300 hover:shadow-card"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: 'var(--foreground)' }} strokeWidth={2} />
          </button>
          <h1 className="font-semibold" style={{ color: 'var(--foreground)' }}>Confirm Order</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 relative z-10">
        {/* Delivery Address */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Delivery Address</h3>
            <button
              onClick={onChangeAddress}
              className="text-sm transition-all duration-300 hover:opacity-70"
              style={{ color: 'var(--primary)' }}
            >
              Change
            </button>
          </div>
          {selectedAddress ? (
            <div
              className="rounded-xl p-4 shadow-card"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: 'var(--primary)' }} />
                <div className="flex-1">
                  <p className="font-medium mb-1" style={{ color: 'var(--foreground)' }}>{selectedAddress.label}</p>
                  <p style={{ color: 'var(--muted-foreground)' }}>
                    {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="rounded-xl p-4 shadow-card text-center"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <p style={{ color: 'var(--muted-foreground)' }}>No address selected</p>
            </div>
          )}
        </div>

        {/* Payment Method */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Payment Method</h3>
            <button
              onClick={onChangePayment}
              className="text-sm transition-all duration-300 hover:opacity-70"
              style={{ color: 'var(--primary)' }}
            >
              Change
            </button>
          </div>
          {selectedCard ? (
            <div
              className="rounded-xl p-4 shadow-card"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 shadow-premium-sm"
                  style={{ background: 'var(--primary-gradient)' }}
                >
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium" style={{ color: 'var(--foreground)' }}>{selectedCard.cardType || 'Card'} •••• {selectedCard.lastFourDigits || selectedCard.cardNumber.slice(-4)}</p>
                  <p style={{ color: 'var(--muted-foreground)' }}>{selectedCard.cardholderName}</p>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="rounded-xl p-4 shadow-card text-center"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <p style={{ color: 'var(--muted-foreground)' }}>No payment method selected</p>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div
          className="rounded-xl p-4 shadow-card mb-6"
          style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Order Summary</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between" style={{ color: 'var(--muted-foreground)' }}>
              <span>Vendor</span>
              <span style={{ color: 'var(--foreground)' }}>{orderData.vendorName}</span>
            </div>
            <div className="flex justify-between" style={{ color: 'var(--muted-foreground)' }}>
              <span>Items</span>
              <span style={{ color: 'var(--foreground)' }}>{orderData.items.length} item(s)</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between" style={{ color: 'var(--muted-foreground)' }}>
              <span>Subtotal</span>
              <span>${orderData.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between" style={{ color: 'var(--muted-foreground)' }}>
              <span>Delivery Fee</span>
              <span>${orderData.deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between" style={{ color: 'var(--muted-foreground)' }}>
              <span>Tax</span>
              <span>${orderData.tax.toFixed(2)}</span>
            </div>
            {pointsRedeemed > 0 && (
              <div className="flex justify-between" style={{ color: 'rgb(34, 197, 94)' }}>
                <span>Points Discount ({pointsRedeemed.toLocaleString()} pts)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="pt-2 mt-2" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="flex justify-between">
                <span className="font-semibold" style={{ color: 'var(--foreground)' }}>Total</span>
                <span className="font-semibold" style={{ color: 'var(--primary)' }}>${orderData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Points Preview - Only for Powered by DoHuub vendors */}
        {isPoweredByDoHuub && (
          <div
            className="mb-6 p-4 rounded-xl shadow-premium-sm"
            style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(249, 115, 22, 0.1))',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5" style={{ color: 'rgb(245, 158, 11)' }} />
                <span className="font-medium" style={{ color: 'rgb(180, 83, 9)' }}>Points you'll earn</span>
              </div>
              <span className="text-lg font-bold" style={{ color: 'rgb(245, 158, 11)' }}>
                +{pointsToEarn} pts
              </span>
            </div>
            <p className="text-sm mt-1" style={{ color: 'rgb(217, 119, 6)' }}>1 point per $1 spent • Added after delivery</p>
            {navigate && (
              <button
                onClick={() => navigate('rewardsWallet')}
                className="mt-3 w-full py-2 rounded-lg font-medium transition-all duration-300 hover:opacity-80"
                style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', color: 'rgb(180, 83, 9)' }}
              >
                View My Rewards
              </button>
            )}
          </div>
        )}
      </div>

      {/* Place Order Button */}
      <div className="px-6 py-4 glass relative z-10" style={{ borderTop: '1px solid rgba(46, 122, 217, 0.1)' }}>
        <button
          onClick={handlePlaceOrder}
          disabled={!selectedAddress || !selectedCard}
          className="w-full py-4 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{ background: 'var(--primary-gradient)' }}
        >
          Place Order • ${orderData.total.toFixed(2)}
        </button>
      </div>
    </div>
  );
}
