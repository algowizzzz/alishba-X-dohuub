import { ArrowLeft, Calendar, Users, CreditCard, ChevronDown, ChevronRight, Gift } from 'lucide-react';
import { useState } from 'react';
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
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b-2 border-gray-200 flex items-center gap-4">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
        </button>
        <h1 className="text-gray-900">Confirm Booking</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-6">
          {/* Property Summary */}
          <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-xl">
            <div className="flex gap-3 mb-3">
              <div className="w-20 h-20 bg-gray-300 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-gray-500 text-3xl">🏠</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-gray-900 mb-1">{property.name}</h3>
                <p className="text-gray-600 text-sm">{property.location}</p>
              </div>
            </div>
            
            <div className="space-y-2 pt-3 border-t-2 border-gray-200">
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(checkInDate)} - {formatDate(checkOutDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Users className="w-4 h-4" />
                <span>{guests} {guests === 1 ? 'guest' : 'guests'} • {duration}</span>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {specialRequests && (
            <div className="p-4 border-2 border-gray-200 rounded-xl">
              <h3 className="text-gray-900 mb-2">Special Requests</h3>
              <p className="text-gray-600">{specialRequests}</p>
            </div>
          )}

          {/* Billing Address (Auto-selected) */}
          <div>
            <h3 className="text-gray-900 mb-3">Billing Address</h3>
            {selectedAddress ? (
              <div className="p-4 border-2 border-gray-200 rounded-xl">
                <p className="text-gray-900 mb-1">{selectedAddress.label}</p>
                <p className="text-gray-600 text-sm">
                  {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}
                </p>
              </div>
            ) : (
              <button
                onClick={onAddAddress}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors"
              >
                + Add Address
              </button>
            )}
          </div>

          {/* Payment Method Selection */}
          <div>
            <h3 className="text-gray-900 mb-3">Payment Method</h3>
            {selectedCard ? (
              <button
                onClick={() => setShowCardSheet(true)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl flex items-center gap-3 hover:border-gray-900 transition-colors"
              >
                <CreditCard className="w-5 h-5 text-gray-700 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <p className="text-gray-900">•••• {selectedCard.cardNumber.slice(-4)}</p>
                  <p className="text-gray-600 text-sm">{selectedCard.cardholderName}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </button>
            ) : (
              <button
                onClick={onAddPaymentCard}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors"
              >
                + Add Payment Card
              </button>
            )}
          </div>

          {/* Points Redemption - Only for Powered by DoHuub properties */}
          {property.isPoweredByDoHuub && availablePoints > 0 && (
            <PointsRedemptionCard
              availablePoints={availablePoints}
              selectedPoints={pointsToRedeem}
              onPointsChange={setPointsToRedeem}
              enabled={pointsRedemptionEnabled}
              onToggle={setPointsRedemptionEnabled}
              maxRedeemablePoints={maxRedeemablePoints}
            />
          )}

          {/* Price Summary */}
          <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-xl">
            <h3 className="text-gray-900 mb-4">Total Amount</h3>
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">${totalPrice}</span>
              </div>
              {pointsRedemptionEnabled && pointsToRedeem > 0 && (
                <div className="flex items-baseline justify-between text-green-600">
                  <span>Points Discount ({pointsToRedeem.toLocaleString()} pts)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex items-baseline justify-between pt-2 border-t border-gray-200">
                <span className="text-gray-900 font-semibold">Total</span>
                <span className="text-gray-900 text-2xl">${finalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Points Preview - Only for Powered by DoHuub properties */}
          {property.isPoweredByDoHuub && (
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-amber-600" />
                  <span className="font-medium text-amber-800">Points you'll earn</span>
                </div>
                <span className="text-lg font-bold text-amber-600">
                  +{Math.floor(finalPrice)} pts
                </span>
              </div>
              <p className="text-sm text-amber-600 mt-1">1 point per $1 spent • Added after stay</p>
            </div>
          )}

          {/* Terms & Conditions */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 w-5 h-5 border-2 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="text-gray-600 text-sm flex-1">
              I agree to the Terms & Conditions and House Rules
            </label>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="p-6 border-t-2 border-gray-200 bg-white">
        <button
          onClick={handleConfirm}
          disabled={!selectedAddress || !selectedCard || !acceptedTerms}
          className="w-full py-3 bg-gray-900 text-white rounded-xl disabled:bg-gray-300 disabled:text-gray-500"
        >
          Confirm & Pay ${finalPrice.toFixed(2)}
        </button>
      </div>

      {/* Payment Card Selection Bottom Sheet */}
      {showCardSheet && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl max-h-[70vh] overflow-y-auto">
            <div className="px-6 py-4 border-b-2 border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-gray-900">Select Payment Card</h2>
              <button onClick={() => setShowCardSheet(false)}>
                <ChevronDown className="w-6 h-6 text-gray-700" strokeWidth={2} />
              </button>
            </div>
            <div className="px-6 py-6 space-y-3">
              {paymentCards.map(card => (
                <button
                  key={card.id}
                  onClick={() => {
                    setSelectedCard(card);
                    setShowCardSheet(false);
                  }}
                  className={`w-full p-4 border-2 rounded-xl text-left ${
                    selectedCard?.id === card.id
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200'
                  }`}
                >
                  <p className="text-gray-900 mb-1">•••• {card.cardNumber.slice(-4)}</p>
                  <p className="text-gray-600 text-sm">{card.cardholderName}</p>
                </button>
              ))}
              <button
                onClick={() => {
                  setShowCardSheet(false);
                  onAddPaymentCard();
                }}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600"
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