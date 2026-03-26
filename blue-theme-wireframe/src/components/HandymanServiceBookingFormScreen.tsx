import { ArrowLeft, Calendar, Clock, MapPin, CreditCard, ChevronDown, Gift } from 'lucide-react';
import { Wrench as PhWrench } from '@phosphor-icons/react';
import { useState, useMemo } from 'react';
import type { HandymanService } from './HandymanVendorDetailScreen';
import type { HandymanVendor } from './HandymanVendorsListScreen';
import type { Address } from './AddAddressScreen';
import type { CardData } from './AddPaymentCardScreen';
import PointsRedemptionCard from './PointsRedemptionCard';

interface HandymanServiceBookingFormScreenProps {
  service: HandymanService;
  vendor: HandymanVendor;
  addresses: Address[];
  paymentCards: CardData[];
  availablePoints: number;
  onBack: () => void;
  onConfirm: (bookingData: HandymanBookingData) => void;
  onAddAddress: () => void;
  onAddPaymentCard: () => void;
}

export interface HandymanBookingData {
  service: HandymanService;
  vendor: HandymanVendor;
  date: string;
  time: string;
  duration: number;
  address: Address;
  paymentCard: CardData;
  estimatedPrice: string;
  referenceNumber: string;
  hasReview?: boolean;
  status?: string;
  pointsRedeemed?: number;
  finalPrice?: string;
}

export function HandymanServiceBookingFormScreen({
  service,
  vendor,
  addresses,
  paymentCards,
  availablePoints,
  onBack,
  onConfirm,
  onAddAddress,
  onAddPaymentCard
}: HandymanServiceBookingFormScreenProps) {
  // Pre-select default address and card
  const defaultAddress = addresses.find(a => a.isDefault) || addresses[0];
  const defaultCard = paymentCards.find(c => c.isDefault) || paymentCards[0];

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<number>(1);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(defaultAddress?.id.toString() || '');
  const [selectedCardId, setSelectedCardId] = useState<string>(defaultCard?.id.toString() || '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const [showAddressPicker, setShowAddressPicker] = useState(false);
  const [showPaymentPicker, setShowPaymentPicker] = useState(false);
  const [notes, setNotes] = useState('');

  // Points redemption state
  const [pointsRedemptionEnabled, setPointsRedemptionEnabled] = useState(false);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);

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

  // Calculate total price based on hourly rate and duration
  const hourlyRate = useMemo(() => {
    // Extract hourly rate from service.price (e.g., "$85/hour" -> 85)
    const match = service.price.match(/\$(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }, [service.price]);

  const totalPrice = useMemo(() => {
    return hourlyRate * selectedDuration;
  }, [hourlyRate, selectedDuration]);

  // Calculate max redeemable points and final price
  const maxRedeemablePoints = Math.floor(totalPrice * 100);
  const discountAmount = pointsToRedeem / 100;
  const finalPrice = totalPrice - discountAmount;

  const isFormValid = selectedDate && selectedTime && selectedAddressId && selectedCardId;

  const handleConfirm = () => {
    if (!isFormValid || !selectedAddress || !selectedCard) return;

    const bookingData: HandymanBookingData = {
      service,
      vendor,
      date: selectedDate,
      time: selectedTime,
      duration: selectedDuration,
      address: selectedAddress,
      paymentCard: selectedCard,
      estimatedPrice: `$${totalPrice}`,
      referenceNumber: `HM${Date.now().toString().slice(-8)}`,
      pointsRedeemed: pointsRedemptionEnabled ? pointsToRedeem : 0,
      finalPrice: `$${finalPrice.toFixed(2)}`
    };

    onConfirm(bookingData);
  };

  const closeAllPickers = () => {
    setShowDatePicker(false);
    setShowTimePicker(false);
    setShowDurationPicker(false);
    setShowAddressPicker(false);
    setShowPaymentPicker(false);
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
          <h1 className="font-semibold" style={{ color: 'var(--foreground)' }}>Book Service</h1>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 relative z-10">
        {/* Service Summary */}
        <div
          className="mb-6 p-4 rounded-xl shadow-card"
          style={{ backgroundColor: 'var(--card)' }}
        >
          <div className="flex gap-3">
            <div
              className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 shadow-premium-sm"
              style={{ background: 'linear-gradient(135deg, rgb(59, 130, 246), rgb(37, 99, 235))' }}
            >
              <PhWrench size={32} weight="fill" color="#fff" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium mb-1" style={{ color: 'var(--foreground)' }}>{service.name}</h3>
              <p className="text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>{vendor.name}</p>
              <div className="flex items-baseline gap-2">
                <p className="font-semibold" style={{ color: 'var(--primary)' }}>${totalPrice}</p>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>({selectedDuration} {selectedDuration === 1 ? 'hour' : 'hours'} × ${hourlyRate}/hour)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Select Date */}
        <div className="mb-6" style={{ position: 'relative', zIndex: showDatePicker ? 50 : 1 }}>
          <label className="block font-medium mb-3" style={{ color: 'var(--foreground)' }}>Select Date</label>
          <div className="relative">
            <button
              onClick={() => {
                closeAllPickers();
                setShowDatePicker(!showDatePicker);
              }}
              className="w-full px-4 py-4 rounded-xl flex items-center gap-3 text-left transition-all duration-300 hover:shadow-card"
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)'
              }}
            >
              <Calendar className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              <span className="flex-1" style={{ color: selectedDate ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                {selectedDate || 'Choose date'}
              </span>
              <ChevronDown className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
            </button>
            {showDatePicker && (
              <div
                className="absolute top-full left-0 right-0 mt-2 p-2 rounded-xl shadow-premium-md max-h-64 overflow-y-auto"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', zIndex: 50 }}
              >
                {dates.map((date) => (
                  <button
                    key={date}
                    onClick={() => {
                      setSelectedDate(date);
                      setShowDatePicker(false);
                    }}
                    className="w-full px-4 py-3 rounded-lg text-left transition-all duration-200"
                    style={{
                      background: selectedDate === date ? 'var(--primary-gradient)' : 'transparent',
                      color: selectedDate === date ? 'white' : 'var(--foreground)'
                    }}
                  >
                    {date}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Select Time */}
        <div className="mb-6" style={{ position: 'relative', zIndex: showTimePicker ? 50 : 1 }}>
          <label className="block font-medium mb-3" style={{ color: 'var(--foreground)' }}>Select Time</label>
          <div className="relative">
            <button
              onClick={() => {
                closeAllPickers();
                setShowTimePicker(!showTimePicker);
              }}
              className="w-full px-4 py-4 rounded-xl flex items-center gap-3 text-left transition-all duration-300 hover:shadow-card"
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)'
              }}
            >
              <Clock className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              <span className="flex-1" style={{ color: selectedTime ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                {selectedTime || 'Choose time'}
              </span>
              <ChevronDown className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
            </button>
            {showTimePicker && (
              <div
                className="absolute top-full left-0 right-0 mt-2 p-4 rounded-xl shadow-premium-md"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', zIndex: 50 }}
              >
                <div className="grid grid-cols-2 gap-2">
                  {times.map((time) => (
                    <button
                      key={time}
                      onClick={() => {
                        setSelectedTime(time);
                        setShowTimePicker(false);
                      }}
                      className="px-4 py-3 rounded-lg transition-all duration-200"
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

        {/* Select Duration */}
        <div className="mb-6" style={{ position: 'relative', zIndex: showDurationPicker ? 50 : 1 }}>
          <label className="block font-medium mb-3" style={{ color: 'var(--foreground)' }}>Select Duration</label>
          <div className="relative">
            <button
              onClick={() => {
                closeAllPickers();
                setShowDurationPicker(!showDurationPicker);
              }}
              className="w-full px-4 py-4 rounded-xl flex items-center gap-3 text-left transition-all duration-300 hover:shadow-card"
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)'
              }}
            >
              <Clock className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              <span className="flex-1" style={{ color: 'var(--foreground)' }}>
                {selectedDuration} hour(s)
              </span>
              <ChevronDown className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
            </button>
            {showDurationPicker && (
              <div
                className="absolute top-full left-0 right-0 mt-2 p-4 rounded-xl shadow-premium-md"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', zIndex: 50 }}
              >
                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: 5 }, (_, i) => i + 1).map((duration) => (
                    <button
                      key={duration}
                      onClick={() => {
                        setSelectedDuration(duration);
                        setShowDurationPicker(false);
                      }}
                      className="px-4 py-3 rounded-lg transition-all duration-200"
                      style={{
                        background: selectedDuration === duration ? 'var(--primary-gradient)' : 'transparent',
                        color: selectedDuration === duration ? 'white' : 'var(--foreground)',
                        border: selectedDuration === duration ? 'none' : '1px solid var(--border)'
                      }}
                    >
                      {duration} hour(s)
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Select Address */}
        <div className="mb-6" style={{ position: 'relative', zIndex: showAddressPicker ? 50 : 1 }}>
          <label className="block font-medium mb-3" style={{ color: 'var(--foreground)' }}>Service Address</label>
          {addresses.length === 0 ? (
            <button
              onClick={onAddAddress}
              className="w-full px-4 py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-card"
              style={{
                backgroundColor: 'var(--card)',
                border: '2px dashed var(--border)',
                color: 'var(--muted-foreground)'
              }}
            >
              <MapPin className="w-5 h-5" />
              <span>Add Address</span>
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => {
                  closeAllPickers();
                  setShowAddressPicker(!showAddressPicker);
                }}
                className="w-full px-4 py-4 rounded-xl flex items-center gap-3 text-left transition-all duration-300 hover:shadow-card"
                style={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)'
                }}
              >
                <MapPin className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                <div className="flex-1">
                  {selectedAddress ? (
                    <>
                      <p style={{ color: 'var(--foreground)' }}>{selectedAddress.type}</p>
                      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{selectedAddress.street}</p>
                    </>
                  ) : (
                    <span style={{ color: 'var(--muted-foreground)' }}>Choose address</span>
                  )}
                </div>
                <ChevronDown className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
              </button>
              {showAddressPicker && (
                <div
                  className="absolute top-full left-0 right-0 mt-2 p-2 rounded-xl shadow-premium-md"
                  style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', zIndex: 50 }}
                >
                  {addresses.map((address) => (
                    <button
                      key={address.id}
                      onClick={() => {
                        setSelectedAddressId(address.id.toString());
                        setShowAddressPicker(false);
                      }}
                      className="w-full px-4 py-3 rounded-lg text-left transition-all duration-200"
                      style={{
                        background: selectedAddressId === address.id.toString() ? 'var(--primary-gradient)' : 'transparent',
                        color: selectedAddressId === address.id.toString() ? 'white' : 'var(--foreground)'
                      }}
                    >
                      <p className={selectedAddressId === address.id.toString() ? 'text-white' : ''}>
                        {address.type}
                      </p>
                      <p className={`text-sm ${selectedAddressId === address.id.toString() ? 'text-white/70' : ''}`} style={{ color: selectedAddressId !== address.id.toString() ? 'var(--muted-foreground)' : undefined }}>
                        {address.street}
                      </p>
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setShowAddressPicker(false);
                      onAddAddress();
                    }}
                    className="w-full px-4 py-3 rounded-lg transition-all duration-300"
                    style={{
                      backgroundColor: 'var(--muted)',
                      color: 'var(--primary)'
                    }}
                  >
                    + Add New Address
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Additional Notes */}
        <div className="mb-6">
          <label className="block font-medium mb-3" style={{ color: 'var(--foreground)' }}>Additional Notes (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe the issue or any specific requirements..."
            className="w-full px-4 py-3 rounded-xl min-h-[100px] transition-all duration-300 focus:shadow-card"
            style={{
              backgroundColor: 'var(--input-background)',
              border: '1px solid var(--border)',
              color: 'var(--foreground)'
            }}
          />
        </div>

        {/* Payment Method */}
        <div className="mb-6" style={{ position: 'relative', zIndex: showPaymentPicker ? 50 : 1 }}>
          <label className="block font-medium mb-3" style={{ color: 'var(--foreground)' }}>Payment Method</label>
          {paymentCards.length === 0 ? (
            <button
              onClick={onAddPaymentCard}
              className="w-full px-4 py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-card"
              style={{
                backgroundColor: 'var(--card)',
                border: '2px dashed var(--border)',
                color: 'var(--muted-foreground)'
              }}
            >
              <CreditCard className="w-5 h-5" />
              <span>Add Payment Card</span>
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => {
                  closeAllPickers();
                  setShowPaymentPicker(!showPaymentPicker);
                }}
                className="w-full px-4 py-4 rounded-xl flex items-center gap-3 text-left transition-all duration-300 hover:shadow-card"
                style={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)'
                }}
              >
                <CreditCard className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                <div className="flex-1">
                  {selectedCard ? (
                    <>
                      <p style={{ color: 'var(--foreground)' }}>•••• {selectedCard.cardNumber.slice(-4)}</p>
                      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{selectedCard.cardholderName}</p>
                    </>
                  ) : (
                    <span style={{ color: 'var(--muted-foreground)' }}>Choose payment method</span>
                  )}
                </div>
                <ChevronDown className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
              </button>
              {showPaymentPicker && (
                <div
                  className="absolute top-full left-0 right-0 mt-2 p-2 rounded-xl shadow-premium-md"
                  style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', zIndex: 50 }}
                >
                  {paymentCards.map((card) => (
                    <button
                      key={card.id}
                      onClick={() => {
                        setSelectedCardId(card.id.toString());
                        setShowPaymentPicker(false);
                      }}
                      className="w-full px-4 py-3 rounded-lg text-left transition-all duration-200"
                      style={{
                        background: selectedCardId === card.id.toString() ? 'var(--primary-gradient)' : 'transparent',
                        color: selectedCardId === card.id.toString() ? 'white' : 'var(--foreground)'
                      }}
                    >
                      <p className={selectedCardId === card.id.toString() ? 'text-white' : ''}>
                        {card.cardType} •••• {card.lastFourDigits}
                      </p>
                      <p className={`text-sm ${selectedCardId === card.id.toString() ? 'text-white/70' : ''}`} style={{ color: selectedCardId !== card.id.toString() ? 'var(--muted-foreground)' : undefined }}>
                        {card.cardholderName}
                      </p>
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setShowPaymentPicker(false);
                      onAddPaymentCard();
                    }}
                    className="w-full px-4 py-3 rounded-lg transition-all duration-300"
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
          )}
        </div>

        {/* Points Redemption - Only for Powered by DoHuub vendors */}
        {vendor.isPoweredByDoHuub && availablePoints > 0 && (
          <div className="mb-6">
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
              <span className="text-lg font-bold" style={{ color: 'rgb(217, 119, 6)' }}>
                +{Math.floor(finalPrice)} pts
              </span>
            </div>
            <p className="text-sm mt-1" style={{ color: 'rgb(217, 119, 6)' }}>1 point per $1 spent • Added after service completion</p>
          </div>
        )}

        {/* Price Summary */}
        {pointsRedemptionEnabled && pointsToRedeem > 0 && (
          <div
            className="mb-6 p-4 rounded-xl shadow-card"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span style={{ color: 'var(--foreground)' }}>Service Price</span>
              <span style={{ color: 'var(--foreground)' }}>${totalPrice}</span>
            </div>
            <div className="flex items-center justify-between mb-2" style={{ color: 'rgb(34, 197, 94)' }}>
              <span>Points Discount ({pointsToRedeem.toLocaleString()} pts)</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid var(--border)' }}>
              <span className="font-semibold" style={{ color: 'var(--foreground)' }}>Total</span>
              <span className="font-semibold" style={{ color: 'var(--primary)' }}>${finalPrice.toFixed(2)}</span>
            </div>
          </div>
        )}
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
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}
