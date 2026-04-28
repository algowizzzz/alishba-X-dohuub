import { ArrowLeft, Calendar, Clock, MapPin, CreditCard, ChevronRight, Gift } from 'lucide-react';
import { SprayBottle } from '@phosphor-icons/react';
import cleanLogo1 from '../assets/cleaning/logos/cleaning logo  (1).png';
import { useState } from 'react';
import type { Service } from './VendorDetailScreen';
import type { Vendor } from './VendorsListScreen';
import type { Address } from './AddAddressScreen';
import type { CardData } from './AddPaymentCardScreen';
import PointsRedemptionCard from './PointsRedemptionCard';

interface CleaningServiceBookingFormScreenProps {
  service: Service;
  vendor: Vendor;
  addresses: Address[];
  paymentCards: CardData[];
  availablePoints: number;
  onBack: () => void;
  onConfirm: (bookingData: BookingData) => void;
  onAddAddress: () => void;
  onAddPaymentCard: () => void;
}

export interface BookingData {
  service: Service;
  vendor: Vendor;
  date: string;
  time: string;
  address: Address;
  paymentCard: CardData;
  estimatedPrice: string;
  referenceNumber: string;
  hasReview?: boolean;
  status?: string;
  pointsRedeemed?: number;
  finalPrice?: string;
}

export function CleaningServiceBookingFormScreen({
  service,
  vendor,
  addresses,
  paymentCards,
  availablePoints,
  onBack,
  onConfirm,
  onAddAddress,
  onAddPaymentCard
}: CleaningServiceBookingFormScreenProps) {
  // Pre-select default address (find the one with isDefault: true, or first one)
  const defaultAddress = addresses.find(a => a.isDefault) || addresses[0];
  const defaultCard = paymentCards.find(c => c.isDefault) || paymentCards[0];

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedAddressId, setSelectedAddressId] = useState<string>(defaultAddress?.id.toString() || '');
  const [selectedCardId, setSelectedCardId] = useState<string>(defaultCard?.id.toString() || '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showAddressPicker, setShowAddressPicker] = useState(false);
  const [showPaymentPicker, setShowPaymentPicker] = useState(false);

  // Points redemption state
  const [pointsRedemptionEnabled, setPointsRedemptionEnabled] = useState(false);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);

  // Calculate price values
  const servicePrice = parseFloat(service.price.replace('$', '').replace(',', ''));
  const maxRedeemablePoints = Math.floor(servicePrice * 100); // Can't redeem more than the service costs
  const discountAmount = pointsToRedeem / 100;
  const finalPrice = servicePrice - discountAmount;

  const dates = [
    'Mon, Dec 2',
    'Tue, Dec 3',
    'Wed, Dec 4',
    'Thu, Dec 5',
    'Fri, Dec 6',
    'Sat, Dec 7',
    'Sun, Dec 8'
  ];

  const times = [
    '8:00 AM',
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM'
  ];

  const selectedAddress = addresses.find(a => a.id.toString() === selectedAddressId);
  const selectedCard = paymentCards.find(c => c.id.toString() === selectedCardId);

  const isFormValid = selectedDate && selectedTime && selectedAddressId && selectedCardId;

  const handleConfirm = () => {
    if (!isFormValid || !selectedAddress || !selectedCard) return;

    const bookingData: BookingData = {
      service,
      vendor,
      date: selectedDate,
      time: selectedTime,
      address: selectedAddress,
      paymentCard: selectedCard,
      estimatedPrice: service.price,
      referenceNumber: `CS${Date.now().toString().slice(-8)}`,
      pointsRedeemed: pointsRedemptionEnabled ? pointsToRedeem : 0,
      finalPrice: `$${finalPrice.toFixed(2)}`
    };

    onConfirm(bookingData);
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />

      {/* Header */}
      <div
        className="px-6 py-6 relative z-10 flex items-center gap-4"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.06)',
          borderBottom: '1px solid rgba(46, 122, 217, 0.08)',
          borderRadius: '0 0 24px 24px',
        }}
      >
        <button
          onClick={onBack}
          className="p-2 rounded-xl transition-all duration-300 hover:shadow-card"
          style={{ backgroundColor: 'var(--card)' }}
        >
          <ArrowLeft className="w-5 h-5" style={{ color: 'var(--foreground)' }} strokeWidth={2} />
        </button>
        <h1 className="font-semibold" style={{ color: 'var(--foreground)' }}>Book Service</h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4 relative z-10">
        {/* Service Summary */}
        <div
          className="mb-6 p-4 rounded-xl shadow-card"
          style={{ backgroundColor: 'var(--card)' }}
        >
          <div className="flex gap-3">
            <img src={cleanLogo1} alt={service.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0 shadow-premium-sm" />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium mb-1" style={{ color: 'var(--foreground)' }}>{service.name}</h3>
              <p className="text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>{vendor.name}</p>
              <p className="font-semibold" style={{ color: 'var(--primary)' }}>{service.price}</p>
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="mb-4">
          <label className="block font-medium mb-2" style={{ color: 'var(--foreground)' }}>Select Date</label>
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="w-full p-4 rounded-xl flex items-center justify-between shadow-card transition-all duration-300 hover:shadow-premium-sm"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              <span style={{ color: selectedDate ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                {selectedDate || 'Choose a date'}
              </span>
            </div>
            <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${showDatePicker ? 'rotate-90' : ''}`} style={{ color: 'var(--muted-foreground)' }} />
          </button>

          {showDatePicker && (
            <div
              className="mt-2 p-4 rounded-xl shadow-premium-sm space-y-2"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              {dates.map((date) => (
                <button
                  key={date}
                  onClick={() => {
                    setSelectedDate(date);
                    setShowDatePicker(false);
                  }}
                  className="w-full p-3 rounded-xl text-left transition-all duration-300"
                  style={{
                    background: selectedDate === date ? 'var(--primary-gradient)' : 'var(--muted)',
                    color: selectedDate === date ? 'white' : 'var(--foreground)'
                  }}
                >
                  {date}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Time Selection */}
        <div className="mb-4">
          <label className="block font-medium mb-2" style={{ color: 'var(--foreground)' }}>Select Time</label>
          <button
            onClick={() => setShowTimePicker(!showTimePicker)}
            className="w-full p-4 rounded-xl flex items-center justify-between shadow-card transition-all duration-300 hover:shadow-premium-sm"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              <span style={{ color: selectedTime ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                {selectedTime || 'Choose a time'}
              </span>
            </div>
            <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${showTimePicker ? 'rotate-90' : ''}`} style={{ color: 'var(--muted-foreground)' }} />
          </button>

          {showTimePicker && (
            <div
              className="mt-2 p-4 rounded-xl shadow-premium-sm grid grid-cols-2 gap-2"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              {times.map((time) => (
                <button
                  key={time}
                  onClick={() => {
                    setSelectedTime(time);
                    setShowTimePicker(false);
                  }}
                  className="p-3 rounded-xl transition-all duration-300"
                  style={{
                    background: selectedTime === time ? 'var(--primary-gradient)' : 'var(--muted)',
                    color: selectedTime === time ? 'white' : 'var(--foreground)'
                  }}
                >
                  {time}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Address Selection */}
        <div className="mb-4">
          <label className="block font-medium mb-2" style={{ color: 'var(--foreground)' }}>Service Address</label>
          <div
            className="w-full p-4 rounded-xl shadow-card"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--muted)' }}
              >
                <MapPin className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              </div>
              <div className="text-left flex-1 min-w-0">
                {selectedAddress ? (
                  <>
                    <p className="font-medium" style={{ color: 'var(--foreground)' }}>{selectedAddress.label}</p>
                    <p className="text-sm truncate" style={{ color: 'var(--muted-foreground)' }}>
                      {selectedAddress.street}, {selectedAddress.city}
                    </p>
                  </>
                ) : (
                  <span style={{ color: 'var(--muted-foreground)' }}>No address available</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-4">
          <label className="block font-medium mb-2" style={{ color: 'var(--foreground)' }}>Payment Method</label>
          <button
            onClick={() => setShowPaymentPicker(!showPaymentPicker)}
            className="w-full p-4 rounded-xl flex items-center justify-between shadow-card transition-all duration-300 hover:shadow-premium-sm"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--muted)' }}
              >
                <CreditCard className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              </div>
              <span style={{ color: selectedCard ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                {selectedCard ? `•••• ${selectedCard.cardNumber.slice(-4)}` : 'Choose payment method'}
              </span>
            </div>
            <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${showPaymentPicker ? 'rotate-90' : ''}`} style={{ color: 'var(--muted-foreground)' }} />
          </button>

          {showPaymentPicker && (
            <div
              className="mt-2 p-4 rounded-xl shadow-premium-sm space-y-2"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              {paymentCards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => {
                    setSelectedCardId(card.id.toString());
                    setShowPaymentPicker(false);
                  }}
                  className="w-full p-3 rounded-xl text-left transition-all duration-300"
                  style={{
                    background: selectedCardId === card.id.toString() ? 'var(--primary-gradient)' : 'var(--muted)',
                    color: selectedCardId === card.id.toString() ? 'white' : 'var(--foreground)'
                  }}
                >
                  <p style={{ color: selectedCardId === card.id.toString() ? 'white' : 'var(--foreground)' }}>
                    {card.cardType} •••• {card.last4}
                  </p>
                  <p className="text-sm" style={{ color: selectedCardId === card.id.toString() ? 'rgba(255,255,255,0.7)' : 'var(--muted-foreground)' }}>
                    Expires {card.expiryDate}
                  </p>
                </button>
              ))}
              <button
                onClick={onAddPaymentCard}
                className="w-full p-3 rounded-xl transition-all duration-300 hover:shadow-card"
                style={{ backgroundColor: 'var(--background)', color: 'var(--primary)', border: '1px solid var(--border)' }}
              >
                + Add New Card
              </button>
            </div>
          )}
        </div>

        {/* Points Redemption - Only for Powered by DoHuub vendors */}
        {vendor.isPoweredByDoHuub && availablePoints > 0 && (
          <div className="mb-4">
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

        {/* Points Preview - Only for Powered by DoHuub vendors */}
        {vendor.isPoweredByDoHuub && (
          <div
            className="mb-4 p-4 rounded-xl shadow-card"
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
            <p className="text-sm mt-1" style={{ color: 'rgb(180, 83, 9)' }}>1 point per $1 spent • Added after service completion</p>
          </div>
        )}

        {/* Price Summary */}
        <div
          className="mb-4 p-4 rounded-xl shadow-card"
          style={{ backgroundColor: 'var(--card)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span style={{ color: 'var(--muted-foreground)' }}>Service Price</span>
            <span className="font-medium" style={{ color: 'var(--foreground)' }}>{service.price}</span>
          </div>
          {pointsRedemptionEnabled && pointsToRedeem > 0 && (
            <div className="flex items-center justify-between mb-2" style={{ color: 'rgb(34, 197, 94)' }}>
              <span>Points Discount ({pointsToRedeem.toLocaleString()} pts)</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}
          {pointsRedemptionEnabled && pointsToRedeem > 0 && (
            <div className="flex items-center justify-between mb-2 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
              <span className="font-semibold" style={{ color: 'var(--foreground)' }}>Total</span>
              <span className="font-semibold" style={{ color: 'var(--primary)' }}>${finalPrice.toFixed(2)}</span>
            </div>
          )}
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Final price will be confirmed by the service provider</p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-6 glass relative z-10" style={{ borderTop: '1px solid rgba(46, 122, 217, 0.1)' }}>
        <button
          onClick={handleConfirm}
          disabled={!isFormValid}
          className="w-full py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-premium-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            background: isFormValid ? 'var(--primary-gradient)' : 'var(--muted)',
            color: isFormValid ? 'white' : 'var(--muted-foreground)'
          }}
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
}
