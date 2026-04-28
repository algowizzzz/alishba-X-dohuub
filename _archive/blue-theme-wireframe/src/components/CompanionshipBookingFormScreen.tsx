import { ArrowLeft, MapPin, Check, Gift } from 'lucide-react';
import { User as PhUser } from '@phosphor-icons/react';
import { useState } from 'react';
import type { Companion } from './CompanionsListScreen';
import PointsRedemptionCard from './PointsRedemptionCard';

interface CompanionshipBookingFormScreenProps {
  companion: Companion;
  savedAddresses: Array<{ id: string; label: string; address: string }>;
  paymentMethods: Array<{ id: string; type: string; last4: string }>;
  availablePoints: number;
  onBack: () => void;
  onConfirmBooking: (bookingData: any) => void;
}

export function CompanionshipBookingFormScreen({
  companion,
  savedAddresses,
  paymentMethods,
  availablePoints,
  onBack,
  onConfirmBooking
}: CompanionshipBookingFormScreenProps) {
  const [serviceLocation, setServiceLocation] = useState(savedAddresses[0]?.id || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('2');
  const [supportTypes, setSupportTypes] = useState<string[]>([]);
  const [specialRequests, setSpecialRequests] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0]?.id || '');

  // Points redemption state
  const [pointsRedemptionEnabled, setPointsRedemptionEnabled] = useState(false);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);

  const durations = [
    { value: '1', label: '1 hour' },
    { value: '2', label: '2 hours' },
    { value: '4', label: '4 hours' },
    { value: '6', label: '6 hours' },
    { value: '8', label: '8 hours' },
    { value: '12', label: 'Full Day (12 hours)' }
  ];

  const supportOptions = [
    'Conversation & Social Interaction',
    'Light Activities & Games',
    'Meal Preparation Assistance',
    'Medication Reminders',
    'Light Housekeeping',
    'Errands & Shopping',
    'Accompaniment to Appointments',
    'Personal Care Assistance',
    'Other'
  ];

  const toggleSupportType = (type: string) => {
    setSupportTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const calculateTotal = () => {
    return companion.hourlyRate * parseInt(duration);
  };

  // Calculate max redeemable points and final price
  const totalBeforeDiscount = calculateTotal();
  const maxRedeemablePoints = Math.floor(totalBeforeDiscount * 100);
  const discountAmount = pointsToRedeem / 100;
  const finalPrice = totalBeforeDiscount - discountAmount;

  const handleConfirm = () => {
    const selectedAddress = savedAddresses.find(addr => addr.id === serviceLocation);
    const selectedPaymentMethod = paymentMethods.find(pm => pm.id === selectedPayment);

    onConfirmBooking({
      companion,
      serviceLocation: selectedAddress,
      date,
      time,
      duration,
      supportTypes,
      specialRequests,
      paymentMethod: selectedPaymentMethod,
      total: finalPrice,
      totalBeforeDiscount,
      pointsRedeemed: pointsRedemptionEnabled ? pointsToRedeem : 0
    });
  };

  const isFormValid = serviceLocation && date && time && supportTypes.length > 0 && selectedPayment;

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
          <h1 className="font-semibold" style={{ color: 'var(--foreground)' }}>Book Companion</h1>
        </div>
      </div>

      {/* Scrollable Form */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="px-6 py-6 space-y-6">
          {/* Companion Info */}
          <div
            className="p-4 rounded-xl flex items-center gap-4 shadow-card"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-premium-sm"
              style={{ background: 'linear-gradient(135deg, rgb(236, 72, 153), rgb(219, 39, 119))' }}
            >
              <PhUser size={24} weight="fill" color="#fff" />
            </div>
            <div className="flex-1">
              <p className="text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>Booking with</p>
              <p className="font-medium" style={{ color: 'var(--foreground)' }}>{companion.name}</p>
            </div>
          </div>

          {/* Service Location */}
          <div className="">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Service Location *</h3>
            <div className="space-y-2">
              {savedAddresses.map(addr => (
                <button
                  key={addr.id}
                  onClick={() => setServiceLocation(addr.id)}
                  className="w-full px-4 py-3 rounded-xl text-left transition-all duration-300"
                  style={{
                    backgroundColor: serviceLocation === addr.id ? 'rgba(236, 72, 153, 0.1)' : 'var(--card)',
                    border: serviceLocation === addr.id
                      ? '2px solid rgb(236, 72, 153)'
                      : '1px solid var(--border)'
                  }}
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: serviceLocation === addr.id ? 'rgb(236, 72, 153)' : 'var(--muted-foreground)' }} />
                    <div className="flex-1">
                      <p className="font-medium mb-1" style={{ color: 'var(--foreground)' }}>{addr.label}</p>
                      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{addr.address}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 focus:ring-2 focus:ring-pink-500/50"
                style={{
                  backgroundColor: 'var(--input-background)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)'
                }}
              />
            </div>
            <div>
              <label className="block text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>Time *</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 focus:ring-2 focus:ring-pink-500/50"
                style={{
                  backgroundColor: 'var(--input-background)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)'
                }}
              />
            </div>
          </div>

          {/* Duration */}
          <div className="">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Duration</h3>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 focus:ring-2 focus:ring-pink-500/50"
              style={{
                backgroundColor: 'var(--input-background)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)'
              }}
            >
              {durations.map(d => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>

          {/* Type of Support Needed */}
          <div className="">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Type of Support Needed *</h3>
            <p className="text-sm mb-3" style={{ color: 'var(--muted-foreground)' }}>Select all that apply</p>
            <div className="space-y-2">
              {supportOptions.map(option => (
                <button
                  key={option}
                  onClick={() => toggleSupportType(option)}
                  className="w-full px-4 py-3 rounded-xl text-left flex items-center gap-3 transition-all duration-300"
                  style={{
                    backgroundColor: supportTypes.includes(option) ? 'rgba(236, 72, 153, 0.1)' : 'var(--card)',
                    border: supportTypes.includes(option)
                      ? '2px solid rgb(236, 72, 153)'
                      : '1px solid var(--border)'
                  }}
                >
                  <div
                    className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all duration-300"
                    style={{
                      backgroundColor: supportTypes.includes(option) ? 'rgb(236, 72, 153)' : 'transparent',
                      border: supportTypes.includes(option) ? 'none' : '2px solid var(--border)'
                    }}
                  >
                    {supportTypes.includes(option) && (
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    )}
                  </div>
                  <span style={{ color: 'var(--foreground)' }}>{option}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Special Requests */}
          <div className="">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Special Requests / Medical Conditions</h3>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Please share any medical conditions, allergies, dietary restrictions, or special preferences we should be aware of..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 focus:ring-2 focus:ring-pink-500/50 resize-none"
              style={{
                backgroundColor: 'var(--input-background)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)'
              }}
            />
          </div>

          {/* Payment Method */}
          <div className="">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Payment Method *</h3>
            <div className="space-y-2">
              {paymentMethods.map(method => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className="w-full px-4 py-3 rounded-xl text-left transition-all duration-300"
                  style={{
                    backgroundColor: selectedPayment === method.id ? 'rgba(236, 72, 153, 0.1)' : 'var(--card)',
                    border: selectedPayment === method.id
                      ? '2px solid rgb(236, 72, 153)'
                      : '1px solid var(--border)'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--foreground)' }}>{method.type}</span>
                    <span style={{ color: 'var(--muted-foreground)' }}>•••• {method.last4}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Points Redemption - Only for Powered by DoHuub companions */}
          {companion.isPoweredByDoHuub && availablePoints > 0 && (
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
            className="p-4 rounded-xl shadow-card space-y-2"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <div className="flex justify-between">
              <span style={{ color: 'var(--muted-foreground)' }}>Hourly Rate</span>
              <span style={{ color: 'var(--foreground)' }}>${companion.hourlyRate}/hour</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--muted-foreground)' }}>Duration</span>
              <span style={{ color: 'var(--foreground)' }}>{duration} hours</span>
            </div>
            {pointsRedemptionEnabled && pointsToRedeem > 0 && (
              <div className="flex justify-between" style={{ color: 'rgb(34, 197, 94)' }}>
                <span>Points Discount ({pointsToRedeem.toLocaleString()} pts)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="my-2" style={{ height: '1px', backgroundColor: 'var(--border)' }} />
            <div className="flex justify-between">
              <span className="font-semibold" style={{ color: 'var(--foreground)' }}>Total</span>
              <span className="text-xl font-bold" style={{ color: 'rgb(236, 72, 153)' }}>${finalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Points Preview - Only for Powered by DoHuub companions */}
          {companion.isPoweredByDoHuub && (
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
              <p className="text-sm mt-1" style={{ color: 'rgb(217, 119, 6)' }}>1 point per $1 spent • Added after service completion</p>
            </div>
          )}

          {/* Bottom Spacing */}
          <div className="h-20" />
        </div>
      </div>

      {/* Sticky Bottom Button */}
      <div className="p-6 glass relative z-10" style={{ borderTop: '1px solid rgba(46, 122, 217, 0.1)' }}>
        <button
          onClick={handleConfirm}
          disabled={!isFormValid}
          className="w-full py-4 rounded-xl font-medium transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            background: isFormValid
              ? 'linear-gradient(135deg, rgb(236, 72, 153), rgb(219, 39, 119))'
              : 'var(--muted)',
            color: isFormValid ? 'white' : 'var(--muted-foreground)'
          }}
        >
          Confirm & Pay ${finalPrice.toFixed(2)}
        </button>
      </div>
    </div>
  );
}
