import { ArrowLeft, Calendar, Clock, MapPin, FileText } from 'lucide-react';
import { useState } from 'react';

interface BookingCustomizationScreenProps {
  service: any;
  category: string;
  onBack: () => void;
  onContinue: () => void;
}

export function BookingCustomizationScreen({ service, category, onBack, onContinue }: BookingCustomizationScreenProps) {
  const [serviceType, setServiceType] = useState('Deep Cleaning');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [instructions, setInstructions] = useState('');

  const serviceTypes = ['Deep Cleaning', 'Laundry', 'Office Cleaning'];

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
          <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Book Service</h3>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-56 relative z-10">
        {/* Service Type */}
        <div className="mb-6">
          <p className="font-medium mb-3" style={{ color: 'var(--foreground)' }}>Service Type</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {serviceTypes.map((type) => (
              <button
                key={type}
                onClick={() => setServiceType(type)}
                className="px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 shadow-card hover:shadow-premium-sm"
                style={{
                  background: serviceType === type ? 'var(--primary-gradient)' : 'var(--chip-background)',
                  color: serviceType === type ? 'white' : 'var(--foreground)',
                  border: serviceType === type ? 'none' : '1px solid var(--border)'
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div className="mb-6">
          <label className="block font-medium mb-2" style={{ color: 'var(--foreground)' }}>Date *</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl outline-none transition-all duration-300 shadow-card focus:shadow-premium-sm"
              style={{
                backgroundColor: 'var(--input-background)',
                border: '2px solid var(--border)',
                color: 'var(--foreground)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
        </div>

        {/* Time */}
        <div className="mb-6">
          <label className="block font-medium mb-2" style={{ color: 'var(--foreground)' }}>Time *</label>
          <div className="relative">
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl outline-none appearance-none transition-all duration-300 shadow-card focus:shadow-premium-sm"
              style={{
                backgroundColor: 'var(--input-background)',
                border: '2px solid var(--border)',
                color: 'var(--foreground)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            >
              <option value="">Select time</option>
              <option value="09:00">9:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="14:00">2:00 PM</option>
              <option value="15:00">3:00 PM</option>
              <option value="16:00">4:00 PM</option>
              <option value="17:00">5:00 PM</option>
            </select>
          </div>
        </div>

        {/* Address */}
        <div className="mb-6">
          <label className="block font-medium mb-2" style={{ color: 'var(--foreground)' }}>Address *</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
            <select
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl outline-none appearance-none transition-all duration-300 shadow-card focus:shadow-premium-sm"
              style={{
                backgroundColor: 'var(--input-background)',
                border: '2px solid var(--border)',
                color: 'var(--foreground)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            >
              <option value="">Select address</option>
              <option value="home">Home - 123 Main St, New York</option>
              <option value="work">Work - 456 Office Blvd, New York</option>
              <option value="other">+ Add new address</option>
            </select>
          </div>
        </div>

        {/* Special Instructions */}
        <div className="mb-6">
          <label className="block font-medium mb-2" style={{ color: 'var(--foreground)' }}>Special Instructions (Optional)</label>
          <div className="relative">
            <FileText className="absolute left-4 top-4 w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g., We have pets, use eco-friendly products"
              rows={4}
              className="w-full pl-12 pr-4 py-3 rounded-xl resize-none outline-none transition-all duration-300 shadow-card focus:shadow-premium-sm"
              style={{
                backgroundColor: 'var(--input-background)',
                border: '2px solid var(--border)',
                color: 'var(--foreground)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="absolute bottom-0 left-0 right-0 px-6 py-4 glass" style={{ borderTop: '1px solid rgba(46, 122, 217, 0.1)' }}>
        {/* Price Summary */}
        <div
          className="mb-4 p-4 rounded-xl shadow-card"
          style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <div className="flex justify-between mb-2">
            <span style={{ color: 'var(--muted-foreground)' }}>Service</span>
            <span style={{ color: 'var(--foreground)' }}>$89.00</span>
          </div>
          <div className="flex justify-between mb-2">
            <span style={{ color: 'var(--muted-foreground)' }}>Service Fee</span>
            <span style={{ color: 'var(--foreground)' }}>$8.00</span>
          </div>
          <div className="h-px my-2" style={{ backgroundColor: 'var(--border)' }}></div>
          <div className="flex justify-between">
            <span className="font-semibold" style={{ color: 'var(--foreground)' }}>Total</span>
            <span className="font-bold text-lg" style={{ color: 'var(--primary)' }}>$97.00</span>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={onContinue}
          disabled={!date || !time || !address}
          className="w-full py-4 rounded-xl font-medium transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
          style={{
            background: date && time && address ? 'var(--primary-gradient)' : 'var(--muted)',
            color: date && time && address ? 'white' : 'var(--muted-foreground)'
          }}
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}
