import { ArrowLeft, Calendar, Users, Plus, Minus } from 'lucide-react';
import { House as PhHouse } from '@phosphor-icons/react';
import { useState } from 'react';
import rentalListImg1 from '../assets/rental listing/rental listing (1).png';
import type { Property } from './RentalPropertiesListScreen';

interface PropertyStayDetailsScreenProps {
  property: Property;
  checkInDate: string;
  checkOutDate: string;
  duration: string;
  onBack: () => void;
  onContinue: (guests: number, specialRequests: string, totalPrice: number) => void;
}

export function PropertyStayDetailsScreen({
  property,
  checkInDate,
  checkOutDate,
  duration,
  onBack,
  onContinue
}: PropertyStayDetailsScreenProps) {
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [specialRequests, setSpecialRequests] = useState('');

  const totalGuests = adults + children;

  // Calculate pricing based on duration
  const calculatePricing = () => {
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const nightlyRate = property.pricePerNight * nights;
    const cleaningFee = 50;
    const serviceFee = Math.round(nightlyRate * 0.1);
    const total = nightlyRate + cleaningFee + serviceFee;

    return { nights, nightlyRate, cleaningFee, serviceFee, total };
  };

  const pricing = calculatePricing();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

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
          <h1 className="font-semibold" style={{ color: 'var(--foreground)' }}>Stay Details</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 relative z-10">
        <div className="space-y-6">
          {/* Property Summary */}
          <div
            className="p-4 rounded-xl shadow-card"
            style={{
              background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1), rgba(6, 148, 162, 0.1))',
              border: '1px solid rgba(20, 184, 166, 0.3)'
            }}
          >
            <div className="flex gap-3">
              <img src={rentalListImg1} alt={property.name} className="w-20 h-20 rounded-lg object-cover flex-shrink-0 shadow-premium-sm" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold mb-1" style={{ color: 'var(--foreground)' }}>{property.name}</h3>
                <p className="text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>{property.location}</p>
                <div className="flex items-center gap-2 text-sm" style={{ color: 'rgb(13, 148, 136)' }}>
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">{duration}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Dates */}
          <div
            className="p-4 rounded-xl shadow-card"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Your Dates</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span style={{ color: 'var(--muted-foreground)' }}>Check-in</span>
                <span className="font-medium" style={{ color: 'var(--foreground)' }}>{formatDate(checkInDate)}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--muted-foreground)' }}>Check-out</span>
                <span className="font-medium" style={{ color: 'var(--foreground)' }}>{formatDate(checkOutDate)}</span>
              </div>
              <div className="pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="flex justify-between">
                  <span className="font-medium" style={{ color: 'var(--foreground)' }}>Duration</span>
                  <span className="font-semibold" style={{ color: 'rgb(20, 184, 166)' }}>{duration}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Number of Guests */}
          <div
            className="p-4 rounded-xl shadow-card"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Number of Guests</h3>

            {/* Adults */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-medium" style={{ color: 'var(--foreground)' }}>Adults</p>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Age 13+</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                  disabled={adults <= 1}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-30"
                  style={{ backgroundColor: 'var(--muted)' }}
                >
                  <Minus className="w-4 h-4" style={{ color: 'var(--foreground)' }} strokeWidth={2} />
                </button>
                <span className="w-8 text-center font-semibold" style={{ color: 'var(--foreground)' }}>{adults}</span>
                <button
                  onClick={() => setAdults(Math.min(property.maxGuests - children, adults + 1))}
                  disabled={totalGuests >= property.maxGuests}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-30"
                  style={{ background: 'linear-gradient(135deg, rgb(20, 184, 166), rgb(6, 148, 162))' }}
                >
                  <Plus className="w-4 h-4 text-white" strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Children */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium" style={{ color: 'var(--foreground)' }}>Children</p>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Age 2-12</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setChildren(Math.max(0, children - 1))}
                  disabled={children <= 0}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-30"
                  style={{ backgroundColor: 'var(--muted)' }}
                >
                  <Minus className="w-4 h-4" style={{ color: 'var(--foreground)' }} strokeWidth={2} />
                </button>
                <span className="w-8 text-center font-semibold" style={{ color: 'var(--foreground)' }}>{children}</span>
                <button
                  onClick={() => setChildren(Math.min(property.maxGuests - adults, children + 1))}
                  disabled={totalGuests >= property.maxGuests}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-30"
                  style={{ background: 'linear-gradient(135deg, rgb(20, 184, 166), rgb(6, 148, 162))' }}
                >
                  <Plus className="w-4 h-4 text-white" strokeWidth={2} />
                </button>
              </div>
            </div>

            <p className="text-sm mt-3" style={{ color: 'var(--muted-foreground)' }}>
              Maximum {property.maxGuests} guests allowed
            </p>
          </div>

          {/* Special Requests */}
          <div className="">
            <label className="block font-medium mb-2" style={{ color: 'var(--foreground)' }}>
              Special Requests <span style={{ color: 'var(--muted-foreground)' }}>(Optional)</span>
            </label>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Any special requests or requirements?"
              rows={4}
              className="w-full px-4 py-3 rounded-xl resize-none outline-none transition-all duration-300 focus:ring-2 focus:ring-teal-500/50"
              style={{
                backgroundColor: 'var(--card)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)'
              }}
            />
          </div>

          {/* Price Breakdown */}
          <div
            className="p-4 rounded-xl shadow-card"
            style={{
              background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1), rgba(6, 148, 162, 0.1))',
              border: '1px solid rgba(20, 184, 166, 0.3)',
              
            }}
          >
            <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Price Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span style={{ color: 'var(--muted-foreground)' }}>
                  ${property.pricePerNight} × {pricing.nights} {pricing.nights === 1 ? 'night' : 'nights'}
                </span>
                <span className="font-medium" style={{ color: 'var(--foreground)' }}>${pricing.nightlyRate}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--muted-foreground)' }}>Cleaning fee</span>
                <span className="font-medium" style={{ color: 'var(--foreground)' }}>${pricing.cleaningFee}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--muted-foreground)' }}>Service fee</span>
                <span className="font-medium" style={{ color: 'var(--foreground)' }}>${pricing.serviceFee}</span>
              </div>
              <div className="pt-3 flex justify-between" style={{ borderTop: '1px solid rgba(20, 184, 166, 0.3)' }}>
                <span className="font-semibold" style={{ color: 'var(--foreground)' }}>Total</span>
                <span className="text-xl font-bold" style={{ color: 'rgb(20, 184, 166)' }}>${pricing.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="px-6 py-4 glass relative z-10" style={{ borderTop: '1px solid rgba(46, 122, 217, 0.1)' }}>
        <button
          onClick={() => onContinue(totalGuests, specialRequests, pricing.total)}
          className="w-full py-4 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, rgb(20, 184, 166), rgb(6, 148, 162))' }}
        >
          Continue to Booking
        </button>
      </div>
    </div>
  );
}
