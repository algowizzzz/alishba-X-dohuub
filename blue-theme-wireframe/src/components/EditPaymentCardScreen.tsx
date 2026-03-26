import { useState } from 'react';
import { ArrowLeft, CreditCard, Lock, AlertCircle } from 'lucide-react';
import { CardData } from './AddPaymentCardScreen';

interface EditPaymentCardScreenProps {
  card: CardData;
  onBack: () => void;
  onSave: (card: CardData) => void;
}

export function EditPaymentCardScreen({ card, onBack, onSave }: EditPaymentCardScreenProps) {
  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const limited = numbers.slice(0, 16);
    const formatted = limited.match(/.{1,4}/g)?.join(' ') || limited;
    return formatted;
  };

  const [cardNumber, setCardNumber] = useState(formatCardNumber(card.cardNumber));
  const [cardholderName, setCardholderName] = useState(card.cardholderName);
  const [expiryMonth, setExpiryMonth] = useState(card.expiryMonth);
  const [expiryYear, setExpiryYear] = useState(card.expiryYear);
  const [cvv, setCvv] = useState(card.cvv);
  const [isDefault, setIsDefault] = useState(card.isDefault);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

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
      const updatedCard: CardData = {
        ...card,
        cardNumber: cardNumber.replace(/\s/g, ''),
        cardholderName,
        expiryMonth,
        expiryYear,
        cvv,
        isDefault
      };
      onSave(updatedCard);
    }
  };

  const getCardType = (number: string) => {
    const digits = number.replace(/\s/g, '');
    if (digits.startsWith('4')) return 'Visa';
    if (digits.startsWith('5')) return 'Mastercard';
    if (digits.startsWith('3')) return 'Amex';
    return 'Card';
  };

  const inputClass = (field: string, hasError: boolean) => `w-full p-4 rounded-xl outline-none transition-all duration-300 ${
    hasError ? 'border-2' : 'border'
  } ${focusedField === field ? 'shadow-glow' : 'shadow-card'}`;

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
          <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Edit Payment Card</h3>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-6 py-6 relative z-10">
        {/* Card Preview */}
        <div
          className="mb-6 p-6 rounded-2xl text-white shadow-premium-lg"
          style={{ background: 'var(--primary-gradient)' }}
        >
          <div className="flex justify-between items-start mb-12">
            <CreditCard className="w-10 h-10" />
            <span className="text-white opacity-80">{getCardType(cardNumber)}</span>
          </div>
          <p className="text-white mb-6 tracking-wider text-lg font-mono">
            {cardNumber || '•••• •••• •••• ••••'}
          </p>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-white opacity-60 mb-1 text-sm">Cardholder Name</p>
              <p className="text-white font-medium">{cardholderName || 'FULL NAME'}</p>
            </div>
            <div>
              <p className="text-white opacity-60 mb-1 text-sm">Expires</p>
              <p className="text-white font-medium">
                {expiryMonth && expiryYear ? `${expiryMonth}/${expiryYear}` : 'MM/YY'}
              </p>
            </div>
          </div>
        </div>

        {/* Card Number */}
        <div className="mb-4">
          <label className="block mb-2 font-medium" style={{ color: 'var(--foreground)' }}>Card Number *</label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => handleCardNumberChange(e.target.value)}
            onFocus={() => setFocusedField('cardNumber')}
            onBlur={() => setFocusedField(null)}
            placeholder="1234 5678 9012 3456"
            className={inputClass('cardNumber', !!errors.cardNumber)}
            style={{
              backgroundColor: 'var(--input-background)',
              color: 'var(--foreground)',
              borderColor: errors.cardNumber ? 'var(--destructive)' : 'var(--border)'
            }}
          />
          {errors.cardNumber && (
            <div className="flex items-center gap-2 mt-2" style={{ color: 'var(--destructive)' }}>
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{errors.cardNumber}</span>
            </div>
          )}
        </div>

        {/* Cardholder Name */}
        <div className="mb-4">
          <label className="block mb-2 font-medium" style={{ color: 'var(--foreground)' }}>Cardholder Name *</label>
          <input
            type="text"
            value={cardholderName}
            onChange={(e) => {
              setCardholderName(e.target.value.toUpperCase());
              if (errors.cardholderName) {
                setErrors({ ...errors, cardholderName: '' });
              }
            }}
            onFocus={() => setFocusedField('cardholderName')}
            onBlur={() => setFocusedField(null)}
            placeholder="JOHN DOE"
            className={inputClass('cardholderName', !!errors.cardholderName)}
            style={{
              backgroundColor: 'var(--input-background)',
              color: 'var(--foreground)',
              borderColor: errors.cardholderName ? 'var(--destructive)' : 'var(--border)'
            }}
          />
          {errors.cardholderName && (
            <div className="flex items-center gap-2 mt-2" style={{ color: 'var(--destructive)' }}>
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{errors.cardholderName}</span>
            </div>
          )}
        </div>

        {/* Expiry Date and CVV */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="">
            <label className="block mb-2 font-medium" style={{ color: 'var(--foreground)' }}>Expiry Date *</label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={expiryMonth}
                onChange={(e) => handleExpiryMonthChange(e.target.value)}
                onFocus={() => setFocusedField('expiryMonth')}
                onBlur={() => setFocusedField(null)}
                placeholder="MM"
                className={`w-full p-4 rounded-xl outline-none transition-all duration-300 ${focusedField === 'expiryMonth' ? 'shadow-glow' : 'shadow-card'}`}
                style={{
                  backgroundColor: 'var(--input-background)',
                  color: 'var(--foreground)',
                  borderWidth: errors.expiry ? '2px' : '1px',
                  borderStyle: 'solid',
                  borderColor: errors.expiry ? 'var(--destructive)' : 'var(--border)'
                }}
                maxLength={2}
              />
              <span style={{ color: 'var(--muted-foreground)' }}>/</span>
              <input
                type="text"
                value={expiryYear}
                onChange={(e) => handleExpiryYearChange(e.target.value)}
                onFocus={() => setFocusedField('expiryYear')}
                onBlur={() => setFocusedField(null)}
                placeholder="YY"
                className={`w-full p-4 rounded-xl outline-none transition-all duration-300 ${focusedField === 'expiryYear' ? 'shadow-glow' : 'shadow-card'}`}
                style={{
                  backgroundColor: 'var(--input-background)',
                  color: 'var(--foreground)',
                  borderWidth: errors.expiry ? '2px' : '1px',
                  borderStyle: 'solid',
                  borderColor: errors.expiry ? 'var(--destructive)' : 'var(--border)'
                }}
                maxLength={2}
              />
            </div>
            {errors.expiry && (
              <div className="flex items-center gap-2 mt-2" style={{ color: 'var(--destructive)' }}>
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{errors.expiry}</span>
              </div>
            )}
          </div>
          <div className="">
            <label className="block mb-2 font-medium" style={{ color: 'var(--foreground)' }}>CVV *</label>
            <input
              type="text"
              value={cvv}
              onChange={(e) => handleCvvChange(e.target.value)}
              onFocus={() => setFocusedField('cvv')}
              onBlur={() => setFocusedField(null)}
              placeholder="123"
              className={inputClass('cvv', !!errors.cvv)}
              style={{
                backgroundColor: 'var(--input-background)',
                color: 'var(--foreground)',
                borderColor: errors.cvv ? 'var(--destructive)' : 'var(--border)'
              }}
            />
            {errors.cvv && (
              <div className="flex items-center gap-2 mt-2" style={{ color: 'var(--destructive)' }}>
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{errors.cvv}</span>
              </div>
            )}
          </div>
        </div>

        {/* Set as Default */}
        <div className="mb-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setIsDefault(!isDefault)}
              className={`w-6 h-6 rounded-md flex items-center justify-center transition-all duration-300 ${isDefault ? '' : 'shadow-card'}`}
              style={{
                background: isDefault ? 'var(--primary-gradient)' : 'var(--card)',
                border: isDefault ? 'none' : '1px solid var(--border)'
              }}
            >
              {isDefault && (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span style={{ color: 'var(--foreground)' }}>Set as default payment method</span>
          </label>
        </div>

        {/* Security Notice */}
        <div
          className="flex items-center justify-center gap-2 p-4 rounded-xl mb-6"
          style={{
            background: 'var(--primary-gradient)',
            
          }}
        >
          <Lock className="w-5 h-5 text-white" />
          <span className="text-white font-medium">Secured by Stripe</span>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-4 rounded-xl text-white font-semibold shadow-premium-md transition-all duration-300 hover:shadow-premium-lg hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: 'var(--primary-gradient)' }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
