import { ArrowLeft, Calendar, Users, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
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
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b-2 border-gray-200 flex items-center gap-4">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
        </button>
        <h1 className="text-gray-900">Stay Details</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-6">
          {/* Property Summary */}
          <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-xl">
            <div className="flex gap-3">
              <div className="w-20 h-20 bg-gray-300 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-gray-500 text-3xl">🏠</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-gray-900 mb-1">{property.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{property.location}</p>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{duration}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Dates */}
          <div className="p-4 border-2 border-gray-200 rounded-xl">
            <h3 className="text-gray-900 mb-3">Your Dates</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Check-in</span>
                <span className="text-gray-900">{formatDate(checkInDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-out</span>
                <span className="text-gray-900">{formatDate(checkOutDate)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t-2 border-gray-200">
                <span className="text-gray-900">Duration</span>
                <span className="text-gray-900">{duration}</span>
              </div>
            </div>
          </div>

          {/* Number of Guests */}
          <div className="p-4 border-2 border-gray-200 rounded-xl">
            <h3 className="text-gray-900 mb-4">Number of Guests</h3>
            
            {/* Adults */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-900">Adults</p>
                <p className="text-gray-600 text-sm">Age 13+</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                  disabled={adults <= 1}
                  className="w-10 h-10 border-2 border-gray-200 rounded-full flex items-center justify-center disabled:opacity-30"
                >
                  <Minus className="w-4 h-4 text-gray-900" strokeWidth={2} />
                </button>
                <span className="text-gray-900 w-8 text-center">{adults}</span>
                <button
                  onClick={() => setAdults(Math.min(property.maxGuests - children, adults + 1))}
                  disabled={totalGuests >= property.maxGuests}
                  className="w-10 h-10 border-2 border-gray-200 rounded-full flex items-center justify-center disabled:opacity-30"
                >
                  <Plus className="w-4 h-4 text-gray-900" strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Children */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900">Children</p>
                <p className="text-gray-600 text-sm">Age 2-12</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setChildren(Math.max(0, children - 1))}
                  disabled={children <= 0}
                  className="w-10 h-10 border-2 border-gray-200 rounded-full flex items-center justify-center disabled:opacity-30"
                >
                  <Minus className="w-4 h-4 text-gray-900" strokeWidth={2} />
                </button>
                <span className="text-gray-900 w-8 text-center">{children}</span>
                <button
                  onClick={() => setChildren(Math.min(property.maxGuests - adults, children + 1))}
                  disabled={totalGuests >= property.maxGuests}
                  className="w-10 h-10 border-2 border-gray-200 rounded-full flex items-center justify-center disabled:opacity-30"
                >
                  <Plus className="w-4 h-4 text-gray-900" strokeWidth={2} />
                </button>
              </div>
            </div>

            <p className="text-gray-600 text-sm mt-3">
              Maximum {property.maxGuests} guests allowed
            </p>
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-gray-900 mb-2">
              Special Requests <span className="text-gray-500">(Optional)</span>
            </label>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Any special requests or requirements?"
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 resize-none"
            />
          </div>

          {/* Price Breakdown */}
          <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-xl">
            <h3 className="text-gray-900 mb-4">Price Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">${property.pricePerNight} × {pricing.nights} {pricing.nights === 1 ? 'night' : 'nights'}</span>
                <span className="text-gray-900">${pricing.nightlyRate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cleaning fee</span>
                <span className="text-gray-900">${pricing.cleaningFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service fee</span>
                <span className="text-gray-900">${pricing.serviceFee}</span>
              </div>
              <div className="pt-3 border-t-2 border-gray-200 flex justify-between">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">${pricing.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="p-6 border-t-2 border-gray-200 bg-white">
        <button
          onClick={() => onContinue(totalGuests, specialRequests, pricing.total)}
          className="w-full py-3 bg-gray-900 text-white rounded-xl"
        >
          Continue to Booking
        </button>
      </div>
    </div>
  );
}
