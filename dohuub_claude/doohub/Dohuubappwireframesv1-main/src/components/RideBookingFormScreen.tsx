import { ArrowLeft, Plus, X, GripVertical, MapPin } from 'lucide-react';
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
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b-2 border-gray-200 flex items-center gap-4 bg-white sticky top-0 z-10">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
        </button>
        <h1 className="text-gray-900">Book Ride Service</h1>
      </div>

      {/* Scrollable Form */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6 space-y-6">
          {/* Provider Info */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-gray-600 text-sm mb-1">Booking with</p>
            <p className="text-gray-900">{provider.name}</p>
          </div>

          {/* Passenger Details */}
          <div>
            <h3 className="text-gray-900 mb-3">Passenger Details</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-gray-600 text-sm mb-2">Full Name *</label>
                <input
                  type="text"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  placeholder="Enter passenger name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={passengerPhone}
                  onChange={(e) => setPassengerPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Vehicle Type */}
          <div>
            <h3 className="text-gray-900 mb-3">Vehicle Type</h3>
            <div className="space-y-2">
              {provider.vehicleTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setVehicleType(type)}
                  className={`w-full px-4 py-3 rounded-xl border-2 text-left ${
                    vehicleType === type
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Pickup Address */}
          <div>
            <h3 className="text-gray-900 mb-3">Pickup Address *</h3>
            <div className="space-y-2">
              {savedAddresses.map(addr => (
                <button
                  key={addr.id}
                  onClick={() => setPickupAddress(addr.id)}
                  className={`w-full px-4 py-3 rounded-xl border-2 text-left ${
                    pickupAddress === addr.id
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200'
                  }`}
                >
                  <p className="text-gray-900 mb-1">{addr.label}</p>
                  <p className="text-gray-600 text-sm">{addr.address}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 text-sm mb-2">Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900"
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm mb-2">Time *</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900"
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <h3 className="text-gray-900 mb-3">Duration</h3>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900"
            >
              {durations.map(d => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>

          {/* Number of Passengers */}
          <div>
            <h3 className="text-gray-900 mb-3">Number of Passengers</h3>
            <input
              type="number"
              min="1"
              max="6"
              value={passengers}
              onChange={(e) => setPassengers(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900"
            />
          </div>

          {/* Stops */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-900">Stops (Optional)</h3>
              <button
                onClick={() => setShowAddStopModal(true)}
                className="flex items-center gap-2 text-gray-900"
              >
                <Plus className="w-5 h-5" />
                <span className="text-sm">Add Stop</span>
              </button>
            </div>
            {stops.length > 0 ? (
              <div className="space-y-2">
                {stops.map((stop, index) => (
                  <div key={stop.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <GripVertical className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-gray-900 text-sm">Stop {index + 1}</span>
                        <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs">
                          {stop.purpose}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{stop.address}</p>
                    </div>
                    <button onClick={() => removeStop(stop.id)}>
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">No stops added yet</p>
            )}
          </div>

          {/* Round Trip */}
          <div className="p-4 border-2 border-gray-200 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-gray-900">Round Trip</h3>
                <p className="text-gray-600 text-sm">Return to pickup location</p>
              </div>
              <button
                onClick={() => setIsRoundTrip(!isRoundTrip)}
                className={`w-14 h-8 rounded-full transition-colors ${
                  isRoundTrip ? 'bg-gray-900' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    isRoundTrip ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            {isRoundTrip && (
              <div className="mt-3">
                <label className="block text-gray-600 text-sm mb-2">Return Time</label>
                <input
                  type="time"
                  value={returnTime}
                  onChange={(e) => setReturnTime(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900"
                />
              </div>
            )}
          </div>

          {/* Special Requests */}
          <div>
            <h3 className="text-gray-900 mb-3">Special Requests (Optional)</h3>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Medical equipment, walker, oxygen tank, pet carrier, etc."
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 resize-none"
            />
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="text-gray-900 mb-3">Payment Method *</h3>
            <div className="space-y-2">
              {paymentMethods.map(method => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`w-full px-4 py-3 rounded-xl border-2 text-left ${
                    selectedPayment === method.id
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900">{method.type}</span>
                    <span className="text-gray-600">•••• {method.last4}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Price Summary */}
          <div className="p-4 bg-gray-50 rounded-xl space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Hourly Rate</span>
              <span className="text-gray-900">${provider.hourlyRate}/hour</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration</span>
              <span className="text-gray-900">{duration} hours</span>
            </div>
            <div className="h-px bg-gray-200 my-2" />
            <div className="flex justify-between">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900 text-xl">${calculateTotal()}</span>
            </div>
          </div>

          {/* Bottom Spacing */}
          <div className="h-20" />
        </div>
      </div>

      {/* Sticky Bottom Button */}
      <div className="p-6 border-t-2 border-gray-200 bg-white">
        <button
          onClick={handleConfirm}
          disabled={!isFormValid}
          className={`w-full py-3 rounded-xl ${
            isFormValid
              ? 'bg-gray-900 text-white'
              : 'bg-gray-300 text-gray-500'
          }`}
        >
          Confirm & Pay ${calculateTotal()}
        </button>
      </div>

      {/* Add Stop Modal */}
      {showAddStopModal && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-2xl">
            <div className="px-6 py-4 border-b-2 border-gray-200 flex items-center justify-between">
              <h2 className="text-gray-900">Add Stop</h2>
              <button onClick={() => setShowAddStopModal(false)}>
                <X className="w-6 h-6 text-gray-700" strokeWidth={2} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-gray-600 text-sm mb-2">Address</label>
                <input
                  type="text"
                  value={newStopAddress}
                  onChange={(e) => setNewStopAddress(e.target.value)}
                  placeholder="Enter stop address"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-2">Purpose</label>
                <select
                  value={newStopPurpose}
                  onChange={(e) => setNewStopPurpose(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900"
                >
                  {stopPurposes.map(purpose => (
                    <option key={purpose} value={purpose}>{purpose}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={addStop}
                disabled={!newStopAddress.trim()}
                className={`w-full py-3 rounded-xl ${
                  newStopAddress.trim()
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-300 text-gray-500'
                }`}
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
