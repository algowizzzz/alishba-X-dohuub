import { useState } from 'react';
import { ArrowLeft, CreditCard, Lock, AlertCircle } from 'lucide-react';

interface AddPaymentCardScreenProps {
  onBack: () => void;
  onSave: (card: CardData) => void;
}

export interface CardData {
  id: number;
  cardNumber: string;
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  isDefault: boolean;
}

export function AddPaymentCardScreen({ onBack, onSave }: AddPaymentCardScreenProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const limited = numbers.slice(0, 16);
    const formatted = limited.match(/.{1,4}/g)?.join(' ') || limited;
    return formatted;
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    setCardNumber(formatted);
    if (errors.cardNumber) {
      setErrors({ ...errors, cardNumber: '' });
    }
  };

  const handleExpiryMonthChange = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 2);
    if (numbers === '' || (parseInt(numbers) >= 1 && parseInt(numbers) <= 12)) {
      setExpiryMonth(numbers);
      if (errors.expiry) {
        setErrors({ ...errors, expiry: '' });
      }
    }
  };

  const handleExpiryYearChange = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 2);
    setExpiryYear(numbers);
    if (errors.expiry) {
      setErrors({ ...errors, expiry: '' });
    }
  };

  const handleCvvChange = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 4);
    setCvv(numbers);
    if (errors.cvv) {
      setErrors({ ...errors, cvv: '' });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    const cardNumberDigits = cardNumber.replace(/\s/g, '');
    if (!cardNumberDigits) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cardNumberDigits.length < 13 || cardNumberDigits.length > 16) {
      newErrors.cardNumber = 'Invalid card number';
    }

    if (!cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }

    if (!expiryMonth || !expiryYear) {
      newErrors.expiry = 'Expiry date is required';
    } else {
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      const yearNum = parseInt(expiryYear);
      const monthNum = parseInt(expiryMonth);

      if (monthNum < 1 || monthNum > 12) {
        newErrors.expiry = 'Invalid month';
      } else if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
        newErrors.expiry = 'Card has expired';
      }
    }

    if (!cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (cvv.length < 3) {
      newErrors.cvv = 'Invalid CVV';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const cardData: CardData = {
        id: Date.now(),
        cardNumber: cardNumber.replace(/\s/g, ''),
        cardholderName,
        expiryMonth,
        expiryYear,
        cvv,
        isDefault
      };
      onSave(cardData);
      onBack();
    }
  };

  const getCardType = (number: string) => {
    const digits = number.replace(/\s/g, '');
    if (digits.startsWith('4')) return 'Visa';
    if (digits.startsWith('5')) return 'Mastercard';
    if (digits.startsWith('3')) return 'Amex';
    return 'Card';
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b-2 border-gray-200">
        <div className="flex items-center gap-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
          </button>
          <h3 className="text-gray-900">Add Payment Card</h3>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Card Preview */}
        <div className="mb-6 p-6 bg-gradient-to-br from-gray-800 to-gray-600 rounded-2xl text-white">
          <div className="flex justify-between items-start mb-12">
            <CreditCard className="w-10 h-10" />
            <span className="text-white opacity-80">{getCardType(cardNumber)}</span>
          </div>
          <p className="text-white mb-6 tracking-wider">
            {cardNumber || '•••• •••• •••• ••••'}
          </p>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-white opacity-60 mb-1">Cardholder Name</p>
              <p className="text-white">{cardholderName || 'FULL NAME'}</p>
            </div>
            <div>
              <p className="text-white opacity-60 mb-1">Expires</p>
              <p className="text-white">
                {expiryMonth && expiryYear ? `${expiryMonth}/${expiryYear}` : 'MM/YY'}
              </p>
            </div>
          </div>
        </div>

        {/* Card Number */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Card Number *</label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => handleCardNumberChange(e.target.value)}
            placeholder="1234 5678 9012 3456"
            className={`w-full p-4 border-2 rounded-lg ${
              errors.cardNumber ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:border-gray-800`}
          />
          {errors.cardNumber && (
            <div className="flex items-center gap-2 mt-2 text-red-500">
              <AlertCircle className="w-4 h-4" />
              <span className="text-red-500">{errors.cardNumber}</span>
            </div>
          )}
        </div>

        {/* Cardholder Name */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Cardholder Name *</label>
          <input
            type="text"
            value={cardholderName}
            onChange={(e) => {
              setCardholderName(e.target.value.toUpperCase());
              if (errors.cardholderName) {
                setErrors({ ...errors, cardholderName: '' });
              }
            }}
            placeholder="JOHN DOE"
            className={`w-full p-4 border-2 rounded-lg ${
              errors.cardholderName ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:border-gray-800`}
          />
          {errors.cardholderName && (
            <div className="flex items-center gap-2 mt-2 text-red-500">
              <AlertCircle className="w-4 h-4" />
              <span className="text-red-500">{errors.cardholderName}</span>
            </div>
          )}
        </div>

        {/* Expiry Date and CVV */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Expiry Date *</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={expiryMonth}
                onChange={(e) => handleExpiryMonthChange(e.target.value)}
                placeholder="MM"
                className={`w-full p-4 border-2 rounded-lg ${
                  errors.expiry ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:border-gray-800`}
                maxLength={2}
              />
              <span className="flex items-center text-gray-500">/</span>
              <input
                type="text"
                value={expiryYear}
                onChange={(e) => handleExpiryYearChange(e.target.value)}
                placeholder="YY"
                className={`w-full p-4 border-2 rounded-lg ${
                  errors.expiry ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:border-gray-800`}
                maxLength={2}
              />
            </div>
            {errors.expiry && (
              <div className="flex items-center gap-2 mt-2 text-red-500">
                <AlertCircle className="w-4 h-4" />
                <span className="text-red-500">{errors.expiry}</span>
              </div>
            )}
          </div>
          <div>
            <label className="block text-gray-700 mb-2">CVV *</label>
            <input
              type="text"
              value={cvv}
              onChange={(e) => handleCvvChange(e.target.value)}
              placeholder="123"
              className={`w-full p-4 border-2 rounded-lg ${
                errors.cvv ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:border-gray-800`}
            />
            {errors.cvv && (
              <div className="flex items-center gap-2 mt-2 text-red-500">
                <AlertCircle className="w-4 h-4" />
                <span className="text-red-500">{errors.cvv}</span>
              </div>
            )}
          </div>
        </div>

        {/* Set as Default */}
        <div className="mb-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="w-5 h-5 rounded border-2 border-gray-300 text-gray-800 focus:ring-0 focus:ring-offset-0"
            />
            <span className="text-gray-700">Set as default payment method</span>
          </label>
        </div>

        {/* Security Notice */}
        <div className="flex items-center justify-center gap-2 p-4 bg-gray-100 rounded-lg mb-6">
          <Lock className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700">Secured by Stripe</span>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-4 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
        >
          Add Card
        </button>
      </div>
    </div>
  );
}