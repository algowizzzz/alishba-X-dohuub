import { ArrowLeft, Calendar, Clock, MapPin, CreditCard, ChevronDown, Gift } from 'lucide-react';
import { useState } from 'react';
import type { Address } from './AddAddressScreen';
import type { CardData } from './AddPaymentCardScreen';
import PointsRedemptionCard from './PointsRedemptionCard';

interface BeautyService {
  id: number;
  name: string;
  category: string;
  price: string;
  duration: string;
  rating: number;
  reviews: number;
}

export interface BeautyBookingData {
  service: BeautyService;
  providerName: string;
  date: string;
  time: string;
  address: Address;
  paymentCard: CardData;
  estimatedPrice: string;
  referenceNumber: string;
  hasReview?: boolean;
  status?: string;
  id?: number;
  pointsRedeemed?: number;
  finalPrice?: string;
}

interface BeautyServiceBookingScreenProps {
  service: BeautyService;
  providerName: string;
  isPoweredByDoHuub?: boolean;
  availablePoints: number;
  onBack: () => void;
  onConfirmBooking: (bookingData: BeautyBookingData) => void;
  addresses: Address[];
  paymentCards: CardData[];
  onAddPaymentCard: () => void;
}

export function BeautyServiceBookingScreen({
  service,
  providerName,
  isPoweredByDoHuub,
  availablePoints,
  onBack,
  onConfirmBooking,
  addresses,
  paymentCards,
  onAddPaymentCard
}: BeautyServiceBookingScreenProps) {
  // Pre-select default address and payment method (find the one with isDefault: true, or first one)
  const defaultAddress = addresses.find(a => a.isDefault) || addresses[0];
  const defaultCard = paymentCards.find(c => c.isDefault) || paymentCards[0];

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedCardId, setSelectedCardId] = useState<string>(defaultCard?.id.toString() || '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showPaymentPicker, setShowPaymentPicker] = useState(false);

  // Points redemption state
  const [pointsRedemptionEnabled, setPointsRedemptionEnabled] = useState(false);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);

  // Helper function to get card type from card number
  const getCardType = (number: string) => {
    const cleanNumber = number.replace(/\s/g, '');
    if (cleanNumber.startsWith('4')) return 'Visa';
    if (cleanNumber.startsWith('5')) return 'Mastercard';
    if (cleanNumber.startsWith('3')) return 'Amex';
    return 'Card';
  };

  // Helper function to format expiry date
  const formatExpiry = (month: string, year: string) => {
    return `${month.padStart(2, '0')}/${year}`;
  };

  // Generate next 7 days
  const getNextSevenDays = () => {
    const days = [];
    const today = new Date();
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = weekdays[date.getDay()];
      const monthName = months[date.getMonth()];
      const dayNum = date.getDate();
      days.push({
        display: `${dayName}, ${monthName} ${dayNum}`,
        value: date.toISOString().split('T')[0]
      });
    }
    return days;
  };

  const availableDates = getNextSevenDays();

  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
    '4:00 PM', '5:00 PM'
  ];

  const selectedCard = paymentCards.find(c => c.id.toString() === selectedCardId);

  const handleConfirm = () => {
    if (selectedDate && selectedTime && defaultAddress && selectedCard) {
      onConfirmBooking({
        service,
        providerName,
        date: selectedDate,
        time: selectedTime,
        address: defaultAddress,
        paymentCard: selectedCard,
        estimatedPrice: service.price,
        referenceNumber: `BS${Date.now().toString().slice(-8)}`,
        pointsRedeemed: pointsRedemptionEnabled ? pointsToRedeem : 0,
        finalPrice: `$${finalPrice.toFixed(2)}`
      });
    }
  };

  const isFormValid = selectedDate && selectedTime && defaultAddress && selectedCard;

  // Extract numeric price from string like "$80.00"
  const priceValue = parseFloat(service.price.replace('$', ''));

  // Calculate max redeemable points and final price
  const maxRedeemablePoints = Math.floor(priceValue * 100);
  const discountAmount = pointsToRedeem / 100;
  const finalPrice = priceValue - discountAmount;

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
          <div className="flex-1">
            <h1 className="font-semibold" style={{ color: 'var(--foreground)' }}>Book Service</h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{providerName}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 relative z-10">
        {/* Service Details Section */}
        <div
          className="p-4 rounded-xl shadow-card mb-6"
          style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <h3 className="font-medium mb-2" style={{ color: 'var(--foreground)' }}>{service.name}</h3>
          <div className="flex items-center gap-4 text-sm">
            <span style={{ color: 'var(--muted-foreground)' }}>{service.duration}</span>
            <span className="font-semibold" style={{ color: 'var(--primary)' }}>{service.price}</span>
          </div>
        </div>

        {/* Booking Options */}
        <div className="space-y-4">
          {/* Select Date */}
          <div className="" style={{ position: 'relative', zIndex: showDatePicker ? 50 : 1 }}>
            <label className="block font-medium mb-2" style={{ color: 'var(--foreground)' }}>Select Date</label>
            <div className="relative">
              <button
                onClick={() => {
                  setShowDatePicker(!showDatePicker);
                  setShowTimePicker(false);
                  setShowPaymentPicker(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-300 hover:shadow-card"
                style={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)'
                }}
              >
                <Calendar className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                <span className="flex-1 text-left" style={{ color: selectedDate ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                  {selectedDate ? availableDates.find(d => d.value === selectedDate)?.display : 'Choose a date'}
                </span>
                <ChevronDown className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
              </button>

              {/* Date Dropdown */}
              {showDatePicker && (
                <div
                  className="absolute top-full left-0 right-0 mt-2 rounded-xl shadow-premium-md max-h-64 overflow-y-auto"
                  style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', zIndex: 50 }}
                >
                  {availableDates.map((date) => (
                    <button
                      key={date.value}
                      onClick={() => {
                        setSelectedDate(date.value);
                        setShowDatePicker(false);
                      }}
                      className="w-full text-left px-4 py-3 transition-all duration-200"
                      style={{
                        backgroundColor: selectedDate === date.value ? 'var(--muted)' : 'transparent',
                        color: 'var(--foreground)'
                      }}
                    >
                      {date.display}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Select Time */}
          <div className="" style={{ position: 'relative', zIndex: showTimePicker ? 50 : 1 }}>
            <label className="block font-medium mb-2" style={{ color: 'var(--foreground)' }}>Select Time</label>
            <div className="relative">
              <button
                onClick={() => {
                  setShowTimePicker(!showTimePicker);
                  setShowDatePicker(false);
                  setShowPaymentPicker(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-300 hover:shadow-card"
                style={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)'
                }}
              >
                <Clock className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                <span className="flex-1 text-left" style={{ color: selectedTime ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                  {selectedTime || 'Choose a time'}
                </span>
                <ChevronDown className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
              </button>

              {/* Time Dropdown */}
              {showTimePicker && (
                <div
                  className="absolute top-full left-0 right-0 mt-2 p-4 rounded-xl shadow-premium-md"
                  style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', zIndex: 50 }}
                >
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => {
                          setSelectedTime(time);
                          setShowTimePicker(false);
                        }}
                        className="py-3 text-center rounded-lg transition-all duration-300"
                        style={{
                          background: selectedTime === time ? 'var(--primary-gradient)' : 'transparent',
                          color: selectedTime === time ? 'white' : 'var(--foreground)',
                          border: selectedTime === time ? 'none' : '1px solid var(--border)'
                        }}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Service Address - Not editable */}
          <div className="">
            <label className="block font-medium mb-2" style={{ color: 'var(--foreground)' }}>Service Address</label>
            <div
              className="w-full p-4 rounded-xl shadow-card"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <MapPin className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                <div className="text-left flex-1 min-w-0">
                  {defaultAddress ? (
                    <>
                      <p style={{ color: 'var(--foreground)' }}>{defaultAddress.label}</p>
                      <p className="text-sm truncate" style={{ color: 'var(--muted-foreground)' }}>
                        {defaultAddress.street}, {defaultAddress.city}
                      </p>
                    </>
                  ) : (
                    <span style={{ color: 'var(--muted-foreground)' }}>No address available</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method - Editable with dropdown */}
          <div className="" style={{ position: 'relative', zIndex: showPaymentPicker ? 50 : 1 }}>
            <label className="block font-medium mb-2" style={{ color: 'var(--foreground)' }}>Payment Method</label>
            <div className="relative">
              <button
                onClick={() => {
                  setShowPaymentPicker(!showPaymentPicker);
                  setShowDatePicker(false);
                  setShowTimePicker(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-300 hover:shadow-card"
                style={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)'
                }}
              >
                <CreditCard className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                <span className="flex-1 text-left" style={{ color: selectedCard ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                  {selectedCard ? `${getCardType(selectedCard.cardNumber)} •••• ${selectedCard.cardNumber.replace(/\s/g, '').slice(-4)}` : 'Choose payment method'}
                </span>
                <ChevronDown className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
              </button>

              {/* Payment Dropdown */}
              {showPaymentPicker && (
                <div
                  className="absolute top-full left-0 right-0 mt-2 rounded-xl shadow-premium-md overflow-hidden"
                  style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', zIndex: 50 }}
                >
                  {paymentCards.length > 0 && (
                    <div className="max-h-64 overflow-y-auto">
                      {paymentCards.map((card) => (
                        <button
                          key={card.id}
                          onClick={() => {
                            setSelectedCardId(card.id.toString());
                            setShowPaymentPicker(false);
                          }}
                          className="w-full text-left px-4 py-3 transition-all duration-200"
                          style={{
                            backgroundColor: selectedCardId === card.id.toString() ? 'var(--muted)' : 'transparent',
                            borderBottom: '1px solid var(--border)'
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <CreditCard className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                            <div>
                              <p style={{ color: 'var(--foreground)' }}>{getCardType(card.cardNumber)} •••• {card.cardNumber.replace(/\s/g, '').slice(-4)}</p>
                              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Expires {formatExpiry(card.expiryMonth, card.expiryYear)}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setShowPaymentPicker(false);
                      onAddPaymentCard();
                    }}
                    className="w-full px-4 py-3 transition-all duration-300"
                    style={{
                      backgroundColor: 'var(--muted)',
                      color: 'var(--primary)'
                    }}
                  >
                    + Add New Card
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Points Redemption - Only for Powered by DoHuub providers */}
          {isPoweredByDoHuub && availablePoints > 0 && (
            <div className="mt-6">
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

          {/* Service Price */}
          <div
            className="rounded-xl p-4 mt-6 shadow-card"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <div className="flex items-center justify-between">
              <span style={{ color: 'var(--foreground)' }}>Service Price</span>
              <span style={{ color: 'var(--foreground)' }}>{service.price}</span>
            </div>
            {pointsRedemptionEnabled && pointsToRedeem > 0 && (
              <>
                <div className="flex items-center justify-between mt-2" style={{ color: 'rgb(34, 197, 94)' }}>
                  <span>Points Discount ({pointsToRedeem.toLocaleString()} pts)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                  <span className="font-semibold" style={{ color: 'var(--foreground)' }}>Total</span>
                  <span className="font-semibold" style={{ color: 'var(--primary)' }}>${finalPrice.toFixed(2)}</span>
                </div>
              </>
            )}
            <p className="text-sm mt-2" style={{ color: 'var(--muted-foreground)' }}>Final price will be confirmed by the service provider</p>
          </div>

          {/* Points Preview - Only for Powered by DoHuub providers */}
          {isPoweredByDoHuub && (
            <div
              className="mt-4 p-4 rounded-xl shadow-premium-sm"
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
                <span className="text-lg font-bold" style={{ color: 'rgb(217, 119, 6)' }}>
                  +{Math.floor(finalPrice)} pts
                </span>
              </div>
              <p className="text-sm mt-1" style={{ color: 'rgb(217, 119, 6)' }}>1 point per $1 spent • Added after service completion</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-6 glass relative z-10" style={{ borderTop: '1px solid rgba(46, 122, 217, 0.1)' }}>
        <button
          onClick={handleConfirm}
          disabled={!isFormValid}
          className="w-full py-4 rounded-xl font-medium transition-all duration-300"
          style={{
            background: isFormValid ? 'var(--primary-gradient)' : 'var(--muted)',
            color: isFormValid ? 'white' : 'var(--muted-foreground)',
            cursor: isFormValid ? 'pointer' : 'not-allowed',
            boxShadow: isFormValid ? '0 4px 12px rgba(46, 122, 217, 0.3)' : 'none'
          }}
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
}
