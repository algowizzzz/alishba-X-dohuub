import { ArrowLeft, Calendar, Users, CreditCard, ChevronDown, ChevronRight, Gift } from 'lucide-react';
import { House as PhHouse } from '@phosphor-icons/react';
import { useState } from 'react';
import rentalListImg1 from '../assets/rental listing/rental listing (1).png';
import type { Property } from './RentalPropertiesListScreen';
import type { Address } from './AddAddressScreen';
import type { CardData } from './AddPaymentCardScreen';
import PointsRedemptionCard from './PointsRedemptionCard';

export interface PropertyBookingData {
  type: 'rental';
  property: Property;
  service: { name: string }; // For compatibility with OrderTrackingScreen
  checkInDate: string;
  checkOutDate: string;
  date: string; // For compatibility with OrderTrackingScreen
  time: string; // For compatibility with OrderTrackingScreen
  duration: string;
  guests: number;
  specialRequests: string;
  address: Address;
  paymentCard: CardData;
  totalPrice: number;
  referenceNumber: string;
  hasReview?: boolean;
  status?: string;
  id?: number;
  pointsRedeemed?: number;
  finalPrice?: number;
}

interface PropertyBookingScreenProps {
  property: Property;
  checkInDate: string;
  checkOutDate: string;
  duration: string;
  guests: number;
  specialRequests: string;
  totalPrice: number;
  addresses: Address[];
  paymentCards: CardData[];
  availablePoints: number;
  onBack: () => void;
  onConfirm: (bookingData: PropertyBookingData) => void;
  onAddAddress: () => void;
  onAddPaymentCard: () => void;
}

export function PropertyBookingScreen({
  property,
  checkInDate,
  checkOutDate,
  duration,
  guests,
  specialRequests,
  totalPrice,
  addresses,
  paymentCards,
  availablePoints,
  onBack,
  onConfirm,
  onAddAddress,
  onAddPaymentCard
}: PropertyBookingScreenProps) {
  const [selectedAddress] = useState<Address | null>(
    addresses.find(a => a.isDefault) || addresses[0] || null
  );
  const [selectedCard, setSelectedCard] = useState<CardData | null>(
    paymentCards.find(c => c.isDefault) || paymentCards[0] || null
  );
  const [showCardSheet, setShowCardSheet] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Points redemption state
  const [pointsRedemptionEnabled, setPointsRedemptionEnabled] = useState(false);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);

  // Calculate max redeemable points and final price
  const maxRedeemablePoints = Math.floor(totalPrice * 100);
  const discountAmount = pointsToRedeem / 100;
  const finalPrice = totalPrice - discountAmount;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleConfirm = () => {
    if (!selectedAddress || !selectedCard || !acceptedTerms) return;

    const referenceNumber = `RP${Date.now().toString().slice(-8)}`;

    const bookingData: PropertyBookingData = {
      type: 'rental',
      property,
      service: { name: property.name }, // For compatibility with OrderTrackingScreen
      checkInDate,
      checkOutDate,
      date: checkInDate, // For compatibility with OrderTrackingScreen
      time: '3:00 PM', // Default check-in time
      duration,
      guests,
      specialRequests,
      address: selectedAddress,
      paymentCard: selectedCard,
      totalPrice,
      referenceNumber,
      pointsRedeemed: pointsRedemptionEnabled ? pointsToRedeem : 0,
      finalPrice
    };

    onConfirm(bookingData);
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
          <h1 className="font-semibold" style={{ color: 'var(--foreground)' }}>Confirm Booking</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 relative z-10">
        <div className="space-y-6">
          {/* Property Summary */}
          <div
            className="p-4 rounded-xl shadow-card"
            style={{
              background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1), rgba(6, 148, 162, 0.1))',
              border: '1px solid rgba(20, 184, 166, 0.3)'
            }}
          >
            <div className="flex gap-3 mb-3">
              <img src={rentalListImg1} alt={property.name} className="w-20 h-20 rounded-lg object-cover flex-shrink-0 shadow-premium-sm" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold mb-1" style={{ color: 'var(--foreground)' }}>{property.name}</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{property.location}</p>
                {property.isPoweredByDoHuub && (
                  <span
                    className="inline-flex items-center gap-1 mt-2 px-2 py-1 text-white text-xs font-medium rounded-full shadow-premium-sm"
                    style={{ background: 'var(--primary-gradient)' }}
                  >
                    Powered by DoHuub
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2 pt-3" style={{ borderTop: '1px solid rgba(20, 184, 166, 0.3)' }}>
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                <Calendar className="w-4 h-4" style={{ color: 'rgb(20, 184, 166)' }} />
                <span>{formatDate(checkInDate)} - {formatDate(checkOutDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                <Users className="w-4 h-4" style={{ color: 'rgb(20, 184, 166)' }} />
                <span>{guests} {guests === 1 ? 'guest' : 'guests'} • {duration}</span>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {specialRequests && (
            <div
              className="p-4 rounded-xl shadow-card"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Special Requests</h3>
              <p style={{ color: 'var(--muted-foreground)' }}>{specialRequests}</p>
            </div>
          )}

          {/* Billing Address (Auto-selected) */}
          <div className="">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Billing Address</h3>
            {selectedAddress ? (
              <div
                className="p-4 rounded-xl shadow-card"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <p className="font-medium mb-1" style={{ color: 'var(--foreground)' }}>{selectedAddress.label}</p>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}
                </p>
              </div>
            ) : (
              <button
                onClick={onAddAddress}
                className="w-full p-4 rounded-xl transition-all duration-300 hover:shadow-card"
                style={{
                  backgroundColor: 'var(--card)',
                  border: '2px dashed var(--border)',
                  color: 'var(--muted-foreground)'
                }}
              >
                + Add Address
              </button>
            )}
          </div>

          {/* Payment Method Selection */}
          <div className="">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Payment Method</h3>
            {selectedCard ? (
              <button
                onClick={() => setShowCardSheet(true)}
                className="w-full p-4 rounded-xl flex items-center gap-3 shadow-card transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.01] active:scale-[0.99]"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 shadow-premium-sm"
                  style={{ background: 'linear-gradient(135deg, rgb(20, 184, 166), rgb(6, 148, 162))' }}
                >
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium" style={{ color: 'var(--foreground)' }}>•••• {selectedCard.cardNumber.slice(-4)}</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{selectedCard.cardholderName}</p>
                </div>
                <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--muted-foreground)' }} />
              </button>
            ) : (
              <button
                onClick={onAddPaymentCard}
                className="w-full p-4 rounded-xl transition-all duration-300 hover:shadow-card"
                style={{
                  backgroundColor: 'var(--card)',
                  border: '2px dashed var(--border)',
                  color: 'var(--muted-foreground)'
                }}
              >
                + Add Payment Card
              </button>
            )}
          </div>

          {/* Points Redemption - Only for Powered by DoHuub properties */}
          {property.isPoweredByDoHuub && availablePoints > 0 && (
            <div className="">
              <PointsRedemptionCard
                availablePoints={availablePoints}
                selectedPoints={pointsToRedeem}
                onPointsChange={setPointsToRedeem}
                enabled={pointsRedemptionEnabled}
                onToggle={setPointsRedemptionEnabled}
                maxRedeemablePoints={maxRedeemablePoints}
              />
            </div>
          )}

          {/* Price Summary */}
          <div
            className="p-4 rounded-xl shadow-card"
            style={{
              background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1), rgba(6, 148, 162, 0.1))',
              border: '1px solid rgba(20, 184, 166, 0.3)',
              
            }}
          >
            <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Total Amount</h3>
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span style={{ color: 'var(--muted-foreground)' }}>Subtotal</span>
                <span className="font-medium" style={{ color: 'var(--foreground)' }}>${totalPrice}</span>
              </div>
              {pointsRedemptionEnabled && pointsToRedeem > 0 && (
                <div className="flex items-baseline justify-between" style={{ color: 'rgb(34, 197, 94)' }}>
                  <span>Points Discount ({pointsToRedeem.toLocaleString()} pts)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex items-baseline justify-between pt-2" style={{ borderTop: '1px solid rgba(20, 184, 166, 0.3)' }}>
                <span className="font-semibold" style={{ color: 'var(--foreground)' }}>Total</span>
                <span className="text-2xl font-bold" style={{ color: 'rgb(20, 184, 166)' }}>${finalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Points Preview - Only for Powered by DoHuub properties */}
          {property.isPoweredByDoHuub && (
            <div
              className="p-4 rounded-xl shadow-premium-sm"
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
                  +{Math.floor(finalPrice)} pts
                </span>
              </div>
              <p className="text-sm mt-1" style={{ color: 'rgb(217, 119, 6)' }}>1 point per $1 spent • Added after stay</p>
            </div>
          )}

          {/* Terms & Conditions */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 w-5 h-5 rounded accent-teal-500"
              style={{ accentColor: 'rgb(20, 184, 166)' }}
            />
            <label htmlFor="terms" className="text-sm flex-1" style={{ color: 'var(--muted-foreground)' }}>
              I agree to the Terms & Conditions and House Rules
            </label>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="px-6 py-4 glass relative z-10" style={{ borderTop: '1px solid rgba(46, 122, 217, 0.1)' }}>
        <button
          onClick={handleConfirm}
          disabled={!selectedAddress || !selectedCard || !acceptedTerms}
          className="w-full py-4 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{ background: 'linear-gradient(135deg, rgb(20, 184, 166), rgb(6, 148, 162))' }}
        >
          Confirm & Pay ${finalPrice.toFixed(2)}
        </button>
      </div>

      {/* Payment Card Selection Bottom Sheet */}
      {showCardSheet && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
          <div
            className="w-full rounded-t-3xl max-h-[70vh] overflow-y-auto animate-slide-up shadow-premium-lg"
            style={{ backgroundColor: 'var(--background)' }}
          >
            <div
              className="px-6 py-4 flex items-center justify-between sticky top-0 glass"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Select Payment Card</h2>
              <button
                onClick={() => setShowCardSheet(false)}
                className="p-2 rounded-xl transition-all duration-300 hover:shadow-card"
                style={{ backgroundColor: 'var(--card)' }}
              >
                <ChevronDown className="w-5 h-5" style={{ color: 'var(--foreground)' }} strokeWidth={2} />
              </button>
            </div>
            <div className="px-6 py-6 space-y-3">
              {paymentCards.map((card, index) => (
                <button
                  key={card.id}
                  onClick={() => {
                    setSelectedCard(card);
                    setShowCardSheet(false);
                  }}
                  className="w-full p-4 rounded-xl text-left shadow-card transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.01] active:scale-[0.99]"
                  style={{
                    backgroundColor: selectedCard?.id === card.id ? 'rgba(20, 184, 166, 0.1)' : 'var(--card)',
                    border: selectedCard?.id === card.id ? '2px solid rgb(20, 184, 166)' : '1px solid var(--border)',
                                      }}
                >
                  <p className="font-medium mb-1" style={{ color: 'var(--foreground)' }}>•••• {card.cardNumber.slice(-4)}</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{card.cardholderName}</p>
                </button>
              ))}
              <button
                onClick={() => {
                  setShowCardSheet(false);
                  onAddPaymentCard();
                }}
                className="w-full p-4 rounded-xl transition-all duration-300 hover:shadow-card"
                style={{
                  backgroundColor: 'var(--card)',
                  border: '2px dashed var(--border)',
                  color: 'var(--muted-foreground)'
                }}
              >
                + Add New Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
