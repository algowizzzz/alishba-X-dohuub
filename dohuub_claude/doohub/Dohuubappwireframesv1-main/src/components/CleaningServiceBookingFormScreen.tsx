import { ArrowLeft, Calendar, Clock, MapPin, CreditCard, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { Service } from './VendorDetailScreen';
import type { Vendor } from './VendorsListScreen';
import type { Address } from './AddAddressScreen';
import type { CardData } from './AddPaymentCardScreen';

interface CleaningServiceBookingFormScreenProps {
  service: Service;
  vendor: Vendor;
  addresses: Address[];
  paymentCards: CardData[];
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
}

export function CleaningServiceBookingFormScreen({
  service,
  vendor,
  addresses,
  paymentCards,
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
      referenceNumber: `CS${Date.now().toString().slice(-8)}`
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
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {/* Service Summary */}
        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
          <div className="flex gap-3">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-gray-400 text-2xl">🧹</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-gray-900 mb-1">{service.name}</h3>
              <p className="text-gray-600 text-sm mb-1">{vendor.name}</p>
              <p className="text-gray-700">{service.price}</p>
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="mb-4">
          <label className="block text-gray-900 mb-2">Select Date</label>
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="w-full p-4 border-2 border-gray-300 rounded-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-700" />
              <span className={selectedDate ? 'text-gray-900' : 'text-gray-500'}>
                {selectedDate || 'Choose a date'}
              </span>
            </div>
            <ChevronRight className={`w-5 h-5 text-gray-700 transition-transform ${showDatePicker ? 'rotate-90' : ''}`} />
          </button>

          {showDatePicker && (
            <div className="mt-2 p-4 border-2 border-gray-300 rounded-xl space-y-2">
              {dates.map((date) => (
                <button
                  key={date}
                  onClick={() => {
                    setSelectedDate(date);
                    setShowDatePicker(false);
                  }}
                  className={`w-full p-3 rounded-lg text-left ${
                    selectedDate === date 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {date}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Time Selection */}
        <div className="mb-4">
          <label className="block text-gray-900 mb-2">Select Time</label>
          <button
            onClick={() => setShowTimePicker(!showTimePicker)}
            className="w-full p-4 border-2 border-gray-300 rounded-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-700" />
              <span className={selectedTime ? 'text-gray-900' : 'text-gray-500'}>
                {selectedTime || 'Choose a time'}
              </span>
            </div>
            <ChevronRight className={`w-5 h-5 text-gray-700 transition-transform ${showTimePicker ? 'rotate-90' : ''}`} />
          </button>

          {showTimePicker && (
            <div className="mt-2 p-4 border-2 border-gray-300 rounded-xl grid grid-cols-2 gap-2">
              {times.map((time) => (
                <button
                  key={time}
                  onClick={() => {
                    setSelectedTime(time);
                    setShowTimePicker(false);
                  }}
                  className={`p-3 rounded-lg ${
                    selectedTime === time 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Address Selection */}
        <div className="mb-4">
          <label className="block text-gray-900 mb-2">Service Address</label>
          <div className="w-full p-4 border-2 border-gray-300 rounded-xl bg-gray-50">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <MapPin className="w-5 h-5 text-gray-700 flex-shrink-0" />
              <div className="text-left flex-1 min-w-0">
                {selectedAddress ? (
                  <>
                    <p className="text-gray-900">{selectedAddress.label}</p>
                    <p className="text-gray-600 text-sm truncate">
                      {selectedAddress.street}, {selectedAddress.city}
                    </p>
                  </>
                ) : (
                  <span className="text-gray-500">No address available</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-4">
          <label className="block text-gray-900 mb-2">Payment Method</label>
          <button
            onClick={() => setShowPaymentPicker(!showPaymentPicker)}
            className="w-full p-4 border-2 border-gray-300 rounded-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-gray-700" />
              <span className={selectedCard ? 'text-gray-900' : 'text-gray-500'}>
                {selectedCard ? `•••• ${selectedCard.cardNumber.slice(-4)}` : 'Choose payment method'}
              </span>
            </div>
            <ChevronRight className={`w-5 h-5 text-gray-700 transition-transform ${showPaymentPicker ? 'rotate-90' : ''}`} />
          </button>

          {showPaymentPicker && (
            <div className="mt-2 p-4 border-2 border-gray-300 rounded-xl space-y-2">
              {paymentCards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => {
                    setSelectedCardId(card.id.toString());
                    setShowPaymentPicker(false);
                  }}
                  className={`w-full p-3 rounded-lg text-left ${
                    selectedCardId === card.id.toString()
                      ? 'bg-gray-900 text-white' 
                      : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <p className={selectedCardId === card.id.toString() ? 'text-white' : 'text-gray-900'}>
                    {card.cardType} •••• {card.last4}
                  </p>
                  <p className={`text-sm ${selectedCardId === card.id.toString() ? 'text-gray-300' : 'text-gray-600'}`}>
                    Expires {card.expiryDate}
                  </p>
                </button>
              ))}
              <button
                onClick={onAddPaymentCard}
                className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200"
              >
                + Add New Card
              </button>
            </div>
          )}
        </div>

        {/* Price Summary */}
        <div className="mb-4 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-700">Service Price</span>
            <span className="text-gray-900">{service.price}</span>
          </div>
          <p className="text-gray-600 text-sm">Final price will be confirmed by the service provider</p>
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
          Confirm Booking
        </button>
      </div>
    </div>
  );
}