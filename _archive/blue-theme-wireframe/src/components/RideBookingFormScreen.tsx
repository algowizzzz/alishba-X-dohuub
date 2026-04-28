import { ArrowLeft, Plus, X, GripVertical, MapPin, Gift } from 'lucide-react';
import { useState } from 'react';
import type { RideProvider } from './RideProvidersListScreen';

interface RideBookingFormScreenProps {
  provider: RideProvider;
  savedAddresses: Array<{ id: string; label: string; address: string }>;
  paymentMethods: Array<{ id: string; type: string; last4: string }>;
  onBack: () => void;
  onConfirmBooking: (bookingData: any) => void;
}

interface Stop {
  id: string;
  address: string;
  purpose: string;
}

export function RideBookingFormScreen({
  provider,
  savedAddresses,
  paymentMethods,
  onBack,
  onConfirmBooking
}: RideBookingFormScreenProps) {
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [vehicleType, setVehicleType] = useState(provider.vehicleTypes[0]);
  const [pickupAddress, setPickupAddress] = useState(savedAddresses[0]?.id || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('2');
  const [passengers, setPassengers] = useState('1');
  const [stops, setStops] = useState<Stop[]>([]);
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [returnTime, setReturnTime] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0]?.id || '');
  const [showAddStopModal, setShowAddStopModal] = useState(false);
  const [newStopAddress, setNewStopAddress] = useState('');
  const [newStopPurpose, setNewStopPurpose] = useState('Pharmacy');

  const durations = [
    { value: '1', label: '1 hour' },
    { value: '2', label: '2 hours' },
    { value: '3', label: '3 hours' },
    { value: '4', label: '4 hours' },
    { value: '6', label: '6 hours' },
    { value: '8', label: '8 hours' },
    { value: '12', label: 'Full Day (12 hours)' }
  ];

  const stopPurposes = [
    'Pharmacy',
    'Grocery Store',
    'Doctor\'s Office',
    'Bank',
    'Post Office',
    'Shopping',
    'Other'
  ];

  const addStop = () => {
    if (newStopAddress.trim()) {
      const newStop: Stop = {
        id: Date.now().toString(),
        address: newStopAddress,
        purpose: newStopPurpose
      };
      setStops([...stops, newStop]);
      setNewStopAddress('');
      setNewStopPurpose('Pharmacy');
      setShowAddStopModal(false);
    }
  };

  const removeStop = (id: string) => {
    setStops(stops.filter(stop => stop.id !== id));
  };

  const calculateTotal = () => {
    return provider.hourlyRate * parseInt(duration);
  };

  const handleConfirm = () => {
    const selectedAddress = savedAddresses.find(addr => addr.id === pickupAddress);
    const selectedPaymentMethod = paymentMethods.find(pm => pm.id === selectedPayment);

    onConfirmBooking({
      provider,
      passengerName,
      passengerPhone,
      vehicleType,
      pickupAddress: selectedAddress,
      date,
      time,
      duration,
      passengers,
      stops,
      isRoundTrip,
      returnTime,
      specialRequests,
      paymentMethod: selectedPaymentMethod,
      total: calculateTotal()
    });
  };

  const isFormValid = passengerName && passengerPhone && pickupAddress && date && time && selectedPayment;

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
          <h1 className="font-semibold" style={{ color: 'var(--foreground)' }}>Book Ride Service</h1>
        </div>
      </div>

      {/* Scrollable Form */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="px-6 py-6 space-y-6">
          {/* Provider Info */}
          <div
            className="p-4 rounded-xl shadow-card"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <p className="text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>Booking with</p>
            <p className="font-medium" style={{ color: 'var(--foreground)' }}>{provider.name}</p>
          </div>

          {/* Passenger Details */}
          <div className="">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Passenger Details</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>Full Name *</label>
                <input
                  type="text"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  placeholder="Enter passenger name"
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 focus:ring-2 focus:ring-purple-500/50"
                  style={{
                    backgroundColor: 'var(--input-background)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--border)'
                  }}
                />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>Phone Number *</label>
                <input
                  type="tel"
                  value={passengerPhone}
                  onChange={(e) => setPassengerPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 focus:ring-2 focus:ring-purple-500/50"
                  style={{
                    backgroundColor: 'var(--input-background)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--border)'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Vehicle Type */}
          <div className="">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Vehicle Type</h3>
            <div className="space-y-2">
              {provider.vehicleTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setVehicleType(type)}
                  className="w-full px-4 py-3 rounded-xl text-left transition-all duration-300"
                  style={{
                    backgroundColor: vehicleType === type ? 'rgba(168, 85, 247, 0.1)' : 'var(--card)',
                    border: vehicleType === type
                      ? '2px solid rgb(168, 85, 247)'
                      : '1px solid var(--border)',
                    color: 'var(--foreground)'
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Pickup Address */}
          <div className="">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Pickup Address *</h3>
            <div className="space-y-2">
              {savedAddresses.map(addr => (
                <button
                  key={addr.id}
                  onClick={() => setPickupAddress(addr.id)}
                  className="w-full px-4 py-3 rounded-xl text-left transition-all duration-300"
                  style={{
                    backgroundColor: pickupAddress === addr.id ? 'rgba(168, 85, 247, 0.1)' : 'var(--card)',
                    border: pickupAddress === addr.id
                      ? '2px solid rgb(168, 85, 247)'
                      : '1px solid var(--border)'
                  }}
                >
                  <p className="font-medium mb-1" style={{ color: 'var(--foreground)' }}>{addr.label}</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{addr.address}</p>
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
                className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 focus:ring-2 focus:ring-purple-500/50"
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
                className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 focus:ring-2 focus:ring-purple-500/50"
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
              className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 focus:ring-2 focus:ring-purple-500/50"
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

          {/* Number of Passengers */}
          <div className="">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Number of Passengers</h3>
            <input
              type="number"
              min="1"
              max="6"
              value={passengers}
              onChange={(e) => setPassengers(e.target.value)}
              className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 focus:ring-2 focus:ring-purple-500/50"
              style={{
                backgroundColor: 'var(--input-background)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)'
              }}
            />
          </div>

          {/* Stops */}
          <div className="">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Stops (Optional)</h3>
              <button
                onClick={() => setShowAddStopModal(true)}
                className="flex items-center gap-2 transition-all duration-300 hover:opacity-70"
                style={{ color: 'rgb(168, 85, 247)' }}
              >
                <Plus className="w-5 h-5" />
                <span className="text-sm">Add Stop</span>
              </button>
            </div>
            {stops.length > 0 ? (
              <div className="space-y-2">
                {stops.map((stop, index) => (
                  <div
                    key={stop.id}
                    className="flex items-start gap-3 p-3 rounded-xl shadow-card"
                    style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
                  >
                    <GripVertical className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--muted-foreground)' }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Stop {index + 1}</span>
                        <span
                          className="px-2 py-0.5 rounded-full text-xs"
                          style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', color: 'rgb(139, 92, 246)' }}
                        >
                          {stop.purpose}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{stop.address}</p>
                    </div>
                    <button onClick={() => removeStop(stop.id)}>
                      <X className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-center py-4" style={{ color: 'var(--muted-foreground)' }}>No stops added yet</p>
            )}
          </div>

          {/* Round Trip */}
          <div
            className="p-4 rounded-xl shadow-card"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Round Trip</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Return to pickup location</p>
              </div>
              <button
                onClick={() => setIsRoundTrip(!isRoundTrip)}
                className="w-14 h-8 rounded-full transition-all duration-300 shadow-card"
                style={{
                  background: isRoundTrip
                    ? 'linear-gradient(135deg, rgb(168, 85, 247), rgb(139, 92, 246))'
                    : 'var(--muted)'
                }}
              >
                <div
                  className="w-6 h-6 bg-white rounded-full transition-transform shadow-premium-sm"
                  style={{
                    transform: isRoundTrip ? 'translateX(28px)' : 'translateX(4px)'
                  }}
                />
              </button>
            </div>
            {isRoundTrip && (
              <div className="mt-3">
                <label className="block text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>Return Time</label>
                <input
                  type="time"
                  value={returnTime}
                  onChange={(e) => setReturnTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 focus:ring-2 focus:ring-purple-500/50"
                  style={{
                    backgroundColor: 'var(--muted)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--border)'
                  }}
                />
              </div>
            )}
          </div>

          {/* Special Requests */}
          <div className="">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Special Requests (Optional)</h3>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Medical equipment, walker, oxygen tank, pet carrier, etc."
              rows={3}
              className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 focus:ring-2 focus:ring-purple-500/50 resize-none"
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
                    backgroundColor: selectedPayment === method.id ? 'rgba(168, 85, 247, 0.1)' : 'var(--card)',
                    border: selectedPayment === method.id
                      ? '2px solid rgb(168, 85, 247)'
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

          {/* Price Summary */}
          <div
            className="p-4 rounded-xl shadow-card space-y-2"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <div className="flex justify-between">
              <span style={{ color: 'var(--muted-foreground)' }}>Hourly Rate</span>
              <span style={{ color: 'var(--foreground)' }}>${provider.hourlyRate}/hour</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--muted-foreground)' }}>Duration</span>
              <span style={{ color: 'var(--foreground)' }}>{duration} hours</span>
            </div>
            <div className="my-2" style={{ height: '1px', backgroundColor: 'var(--border)' }} />
            <div className="flex justify-between">
              <span className="font-semibold" style={{ color: 'var(--foreground)' }}>Total</span>
              <span className="text-xl font-bold" style={{ color: 'rgb(168, 85, 247)' }}>${calculateTotal()}</span>
            </div>
          </div>

          {/* Points Preview - Only for Powered by DoHuub providers */}
          {provider.isPoweredByDoHuub && (
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
                  +{calculateTotal()} pts
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
              ? 'linear-gradient(135deg, rgb(168, 85, 247), rgb(139, 92, 246))'
              : 'var(--muted)',
            color: isFormValid ? 'white' : 'var(--muted-foreground)'
          }}
        >
          Confirm & Pay ${calculateTotal()}
        </button>
      </div>

      {/* Add Stop Modal */}
      {showAddStopModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}
            onClick={() => setShowAddStopModal(false)}
          />
          <div
            className="relative w-full max-w-md rounded-2xl shadow-premium-lg animate-scale-in glass"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Add Stop</h2>
              <button
                onClick={() => setShowAddStopModal(false)}
                className="p-2 rounded-xl transition-all duration-300 hover:shadow-card"
                style={{ backgroundColor: 'var(--muted)' }}
              >
                <X className="w-5 h-5" style={{ color: 'var(--foreground)' }} strokeWidth={2} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>Address</label>
                <input
                  type="text"
                  value={newStopAddress}
                  onChange={(e) => setNewStopAddress(e.target.value)}
                  placeholder="Enter stop address"
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 focus:ring-2 focus:ring-purple-500/50"
                  style={{
                    backgroundColor: 'var(--muted)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--border)'
                  }}
                />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>Purpose</label>
                <select
                  value={newStopPurpose}
                  onChange={(e) => setNewStopPurpose(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 focus:ring-2 focus:ring-purple-500/50"
                  style={{
                    backgroundColor: 'var(--muted)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--border)'
                  }}
                >
                  {stopPurposes.map(purpose => (
                    <option key={purpose} value={purpose}>{purpose}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={addStop}
                disabled={!newStopAddress.trim()}
                className="w-full py-4 rounded-xl font-medium transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  background: newStopAddress.trim()
                    ? 'linear-gradient(135deg, rgb(168, 85, 247), rgb(139, 92, 246))'
                    : 'var(--muted)',
                  color: newStopAddress.trim() ? 'white' : 'var(--muted-foreground)'
                }}
              >
                Add Stop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
