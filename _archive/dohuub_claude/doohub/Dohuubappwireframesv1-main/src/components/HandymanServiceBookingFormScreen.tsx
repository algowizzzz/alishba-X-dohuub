import { ArrowLeft, Calendar, Clock, MapPin, CreditCard, ChevronRight } from 'lucide-react';
import { useState, useMemo } from 'react';
import type { HandymanService } from './HandymanVendorDetailScreen';
import type { HandymanVendor } from './HandymanVendorsListScreen';
import type { Address } from './AddAddressScreen';
import type { CardData } from './AddPaymentCardScreen';

interface HandymanServiceBookingFormScreenProps {
  service: HandymanService;
  vendor: HandymanVendor;
  addresses: Address[];
  paymentCards: CardData[];
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
}

export function HandymanServiceBookingFormScreen({
  service,
  vendor,
  addresses,
  paymentCards,
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
      referenceNumber: `HM${Date.now().toString().slice(-8)}`
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
        <h1 className="text-gray-900">Book Service</h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Service Summary */}
        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
          <div className="flex gap-3">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-3xl">🔧</span>
            </div>
            <div className="flex-1">
              <h3 className="text-gray-900 mb-1">{service.name}</h3>
              <p className="text-gray-600 mb-1">{vendor.name}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-gray-900">${totalPrice}</p>
                <p className="text-gray-600 text-sm">({selectedDuration} {selectedDuration === 1 ? 'hour' : 'hours'} × ${hourlyRate}/hour)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Select Date */}
        <div className="mb-6">
          <label className="block text-gray-900 mb-3">Select Date</label>
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl flex items-center gap-3 text-left"
          >
            <Calendar className="w-5 h-5 text-gray-600" />
            <span className={selectedDate ? "text-gray-900" : "text-gray-400"}>
              {selectedDate || 'Choose date'}
            </span>
            <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
          </button>
          {showDatePicker && (
            <div className="mt-3 p-4 border-2 border-gray-300 rounded-xl space-y-2">
              {dates.map((date) => (
                <button
                  key={date}
                  onClick={() => {
                    setSelectedDate(date);
                    setShowDatePicker(false);
                  }}
                  className={`w-full px-4 py-3 rounded-lg text-left ${
                    selectedDate === date
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {date}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Select Time */}
        <div className="mb-6">
          <label className="block text-gray-900 mb-3">Select Time</label>
          <button
            onClick={() => setShowTimePicker(!showTimePicker)}
            className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl flex items-center gap-3 text-left"
          >
            <Clock className="w-5 h-5 text-gray-600" />
            <span className={selectedTime ? "text-gray-900" : "text-gray-400"}>
              {selectedTime || 'Choose time'}
            </span>
            <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
          </button>
          {showTimePicker && (
            <div className="mt-3 p-4 border-2 border-gray-300 rounded-xl grid grid-cols-2 gap-2">
              {times.map((time) => (
                <button
                  key={time}
                  onClick={() => {
                    setSelectedTime(time);
                    setShowTimePicker(false);
                  }}
                  className={`px-4 py-3 rounded-lg ${
                    selectedTime === time
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Select Duration */}
        <div className="mb-6">
          <label className="block text-gray-900 mb-3">Select Duration</label>
          <button
            onClick={() => setShowDurationPicker(!showDurationPicker)}
            className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl flex items-center gap-3 text-left"
          >
            <Clock className="w-5 h-5 text-gray-600" />
            <span className={selectedDuration ? "text-gray-900" : "text-gray-400"}>
              {selectedDuration || 'Choose duration'}
            </span>
            <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
          </button>
          {showDurationPicker && (
            <div className="mt-3 p-4 border-2 border-gray-300 rounded-xl grid grid-cols-2 gap-2">
              {Array.from({ length: 5 }, (_, i) => i + 1).map((duration) => (
                <button
                  key={duration}
                  onClick={() => {
                    setSelectedDuration(duration);
                    setShowDurationPicker(false);
                  }}
                  className={`px-4 py-3 rounded-lg ${
                    selectedDuration === duration
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {duration} hour(s)
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Select Address */}
        <div className="mb-6">
          <label className="block text-gray-900 mb-3">Service Address</label>
          {addresses.length === 0 ? (
            <button
              onClick={onAddAddress}
              className="w-full px-4 py-4 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 text-gray-600 hover:border-gray-800"
            >
              <MapPin className="w-5 h-5" />
              <span>Add Address</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => setShowAddressPicker(!showAddressPicker)}
                className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl flex items-center gap-3 text-left"
              >
                <MapPin className="w-5 h-5 text-gray-600" />
                <div className="flex-1">
                  {selectedAddress ? (
                    <>
                      <p className="text-gray-900">{selectedAddress.type}</p>
                      <p className="text-gray-600 text-sm">{selectedAddress.street}</p>
                    </>
                  ) : (
                    <span className="text-gray-400">Choose address</span>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
              {showAddressPicker && (
                <div className="mt-3 p-4 border-2 border-gray-300 rounded-xl space-y-2">
                  {addresses.map((address) => (
                    <button
                      key={address.id}
                      onClick={() => {
                        setSelectedAddressId(address.id.toString());
                        setShowAddressPicker(false);
                      }}
                      className={`w-full px-4 py-3 rounded-lg text-left ${
                        selectedAddressId === address.id.toString()
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      <p className={selectedAddressId === address.id.toString() ? 'text-white' : 'text-gray-900'}>
                        {address.type}
                      </p>
                      <p className={`text-sm ${selectedAddressId === address.id.toString() ? 'text-gray-300' : 'text-gray-600'}`}>
                        {address.street}
                      </p>
                    </button>
                  ))}
                  <button
                    onClick={onAddAddress}
                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-800"
                  >
                    + Add New Address
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Additional Notes */}
        <div className="mb-6">
          <label className="block text-gray-900 mb-3">Additional Notes (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe the issue or any specific requirements..."
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 min-h-[100px]"
          />
        </div>

        {/* Payment Method */}
        <div className="mb-6">
          <label className="block text-gray-900 mb-3">Payment Method</label>
          {paymentCards.length === 0 ? (
            <button
              onClick={onAddPaymentCard}
              className="w-full px-4 py-4 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 text-gray-600 hover:border-gray-800"
            >
              <CreditCard className="w-5 h-5" />
              <span>Add Payment Card</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => setShowPaymentPicker(!showPaymentPicker)}
                className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl flex items-center gap-3 text-left"
              >
                <CreditCard className="w-5 h-5 text-gray-600" />
                <div className="flex-1">
                  {selectedCard ? (
                    <>
                      <p className="text-gray-900">•••• {selectedCard.cardNumber.slice(-4)}</p>
                      <p className="text-gray-600 text-sm">{selectedCard.cardholderName}</p>
                    </>
                  ) : (
                    <span className="text-gray-400">Choose payment method</span>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
              {showPaymentPicker && (
                <div className="mt-3 p-4 border-2 border-gray-300 rounded-xl space-y-2">
                  {paymentCards.map((card) => (
                    <button
                      key={card.id}
                      onClick={() => {
                        setSelectedCardId(card.id.toString());
                        setShowPaymentPicker(false);
                      }}
                      className={`w-full px-4 py-3 rounded-lg text-left ${
                        selectedCardId === card.id.toString()
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      <p className={selectedCardId === card.id.toString() ? 'text-white' : 'text-gray-900'}>
                        {card.cardType} •••• {card.lastFourDigits}
                      </p>
                      <p className={`text-sm ${selectedCardId === card.id.toString() ? 'text-gray-300' : 'text-gray-600'}`}>
                        {card.cardholderName}
                      </p>
                    </button>
                  ))}
                  <button
                    onClick={onAddPaymentCard}
                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-800"
                  >
                    + Add New Card
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-6 border-t-2 border-gray-200">
        <button
          onClick={handleConfirm}
          disabled={!isFormValid}
          className={`w-full py-4 rounded-xl ${
            isFormValid
              ? 'bg-gray-900 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}