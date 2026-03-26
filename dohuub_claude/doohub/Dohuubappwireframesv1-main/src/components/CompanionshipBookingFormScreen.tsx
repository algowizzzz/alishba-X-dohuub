import { ArrowLeft, MapPin, Check } from 'lucide-react';
import { useState } from 'react';
import type { Companion } from './CompanionsListScreen';

interface CompanionshipBookingFormScreenProps {
  companion: Companion;
  savedAddresses: Array<{ id: string; label: string; address: string }>;
  paymentMethods: Array<{ id: string; type: string; last4: string }>;
  onBack: () => void;
  onConfirmBooking: (bookingData: any) => void;
}

export function CompanionshipBookingFormScreen({
  companion,
  savedAddresses,
  paymentMethods,
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
      total: calculateTotal()
    });
  };

  const isFormValid = serviceLocation && date && time && supportTypes.length > 0 && selectedPayment;

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b-2 border-gray-200 flex items-center gap-4 bg-white sticky top-0 z-10">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
        </button>
        <h1 className="text-gray-900">Book Companion</h1>
      </div>

      {/* Scrollable Form */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6 space-y-6">
          {/* Companion Info */}
          <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-gray-600 text-xl">👤</span>
            </div>
            <div className="flex-1">
              <p className="text-gray-600 text-sm mb-1">Booking with</p>
              <p className="text-gray-900">{companion.name}</p>
            </div>
          </div>

          {/* Service Location */}
          <div>
            <h3 className="text-gray-900 mb-3">Service Location *</h3>
            <div className="space-y-2">
              {savedAddresses.map(addr => (
                <button
                  key={addr.id}
                  onClick={() => setServiceLocation(addr.id)}
                  className={`w-full px-4 py-3 rounded-xl border-2 text-left ${
                    serviceLocation === addr.id
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-700 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-gray-900 mb-1">{addr.label}</p>
                      <p className="text-gray-600 text-sm">{addr.address}</p>
                    </div>
                  </div>
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

          {/* Type of Support Needed */}
          <div>
            <h3 className="text-gray-900 mb-3">Type of Support Needed *</h3>
            <p className="text-gray-600 text-sm mb-3">Select all that apply</p>
            <div className="space-y-2">
              {supportOptions.map(option => (
                <button
                  key={option}
                  onClick={() => toggleSupportType(option)}
                  className={`w-full px-4 py-3 rounded-xl border-2 text-left flex items-center gap-3 ${
                    supportTypes.includes(option)
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    supportTypes.includes(option)
                      ? 'border-gray-900 bg-gray-900'
                      : 'border-gray-300'
                  }`}>
                    {supportTypes.includes(option) && (
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    )}
                  </div>
                  <span className="text-gray-900">{option}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <h3 className="text-gray-900 mb-3">Special Requests / Medical Conditions</h3>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Please share any medical conditions, allergies, dietary restrictions, or special preferences we should be aware of..."
              rows={4}
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
              <span className="text-gray-900">${companion.hourlyRate}/hour</span>
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
    </div>
  );
}
