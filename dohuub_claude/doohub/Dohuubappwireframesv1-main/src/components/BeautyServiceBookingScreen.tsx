import { ArrowLeft, Calendar, Clock, MapPin, CreditCard, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { Address } from './AddAddressScreen';
import type { CardData } from './AddPaymentCardScreen';

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
}

interface BeautyServiceBookingScreenProps {
  service: BeautyService;
  providerName: string;
  onBack: () => void;
  onConfirmBooking: (bookingData: BeautyBookingData) => void;
  addresses: Address[];
  paymentCards: CardData[];
  onAddPaymentCard: () => void;
}

export function BeautyServiceBookingScreen({
  service,
  providerName,
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
        referenceNumber: `BS${Date.now().toString().slice(-8)}`
      });
    }
  };

  const isFormValid = selectedDate && selectedTime && defaultAddress && selectedCard;

  // Extract numeric price from string like "$80.00"
  const priceValue = parseFloat(service.price.replace('$', ''));

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-gray-900">Book Service</h1>
            <p className="text-sm text-gray-600">{providerName}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Service Details Section */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
          <h3 className="text-gray-900 mb-2">{service.name}</h3>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-600">{service.duration}</span>
            <span className="text-gray-900">{service.price}</span>
          </div>
        </div>

        {/* Booking Options */}
        <div className="space-y-4">
          {/* Select Date */}
          <div>
            <label className="block text-gray-900 mb-2">Select Date</label>
            <div className="relative">
              <button
                onClick={() => {
                  setShowDatePicker(!showDatePicker);
                  setShowTimePicker(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-4 bg-white border border-gray-200 rounded-xl hover:border-gray-900 transition-colors"
              >
                <Calendar className="w-5 h-5 text-gray-600" />
                <span className={`flex-1 text-left ${selectedDate ? 'text-gray-900' : 'text-gray-400'}`}>
                  {selectedDate ? availableDates.find(d => d.value === selectedDate)?.display : 'Choose a date'}
                </span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>
              
              {/* Date Dropdown */}
              {showDatePicker && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-64 overflow-y-auto">
                  {availableDates.map((date) => (
                    <button
                      key={date.value}
                      onClick={() => {
                        setSelectedDate(date.value);
                        setShowDatePicker(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                        selectedDate === date.value ? 'bg-gray-100' : ''
                      }`}
                    >
                      {date.display}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Select Time */}
          <div>
            <label className="block text-gray-900 mb-2">Select Time</label>
            <div className="relative">
              <button
                onClick={() => {
                  setShowTimePicker(!showTimePicker);
                  setShowDatePicker(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-4 bg-white border border-gray-200 rounded-xl hover:border-gray-900 transition-colors"
              >
                <Clock className="w-5 h-5 text-gray-600" />
                <span className={`flex-1 text-left ${selectedTime ? 'text-gray-900' : 'text-gray-400'}`}>
                  {selectedTime || 'Choose a time'}
                </span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>
              
              {/* Time Dropdown */}
              {showTimePicker && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 p-4">
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => {
                          setSelectedTime(time);
                          setShowTimePicker(false);
                        }}
                        className={`py-3 text-center rounded-lg border transition-colors ${
                          selectedTime === time
                            ? 'bg-gray-900 text-white border-gray-900'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-900'
                        }`}
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
          <div>
            <label className="block text-gray-900 mb-2">Service Address</label>
            <div className="w-full p-4 border-2 border-gray-300 rounded-xl bg-gray-50">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <MapPin className="w-5 h-5 text-gray-700 flex-shrink-0" />
                <div className="text-left flex-1 min-w-0">
                  {defaultAddress ? (
                    <>
                      <p className="text-gray-900">{defaultAddress.label}</p>
                      <p className="text-gray-600 text-sm truncate">
                        {defaultAddress.street}, {defaultAddress.city}
                      </p>
                    </>
                  ) : (
                    <span className="text-gray-500">No address available</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method - Editable with dropdown */}
          <div>
            <label className="block text-gray-900 mb-2">Payment Method</label>
            <div className="relative">
              <button
                onClick={() => {
                  setShowPaymentPicker(!showPaymentPicker);
                  setShowDatePicker(false);
                  setShowTimePicker(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-4 bg-white border border-gray-200 rounded-xl hover:border-gray-900 transition-colors"
              >
                <CreditCard className="w-5 h-5 text-gray-600" />
                <span className={`flex-1 text-left ${selectedCard ? 'text-gray-900' : 'text-gray-400'}`}>
                  {selectedCard ? `${getCardType(selectedCard.cardNumber)} •••• ${selectedCard.cardNumber.replace(/\s/g, '').slice(-4)}` : 'Choose payment method'}
                </span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>
              
              {/* Payment Dropdown */}
              {showPaymentPicker && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">{paymentCards.length > 0 && (
                    <div className="max-h-64 overflow-y-auto">
                      {paymentCards.map((card) => (
                        <button
                          key={card.id}
                          onClick={() => {
                            setSelectedCardId(card.id.toString());
                            setShowPaymentPicker(false);
                          }}
                          className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                            selectedCardId === card.id.toString() ? 'bg-gray-100' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <CreditCard className="w-5 h-5 text-gray-600" />
                            <div>
                              <p className="text-gray-900">{getCardType(card.cardNumber)} •••• {card.cardNumber.replace(/\s/g, '').slice(-4)}</p>
                              <p className="text-sm text-gray-500">Expires {formatExpiry(card.expiryMonth, card.expiryYear)}</p>
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
                    className="w-full px-4 py-3 bg-gray-50 text-gray-900 hover:bg-gray-100 transition-colors"
                  >
                    + Add New Card
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Service Price */}
          <div className="bg-gray-50 rounded-xl p-4 mt-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-900">Service Price</span>
              <span className="text-gray-900">{service.price}</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Final price will be confirmed by the service provider</p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-gray-200 p-6">
        <button
          onClick={handleConfirm}
          disabled={!isFormValid}
          className={`w-full py-4 rounded-xl transition-colors ${
            isFormValid
              ? 'bg-gray-900 text-white hover:bg-gray-800'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
}