import { Check, Phone } from 'lucide-react';

interface CaregivingConfirmationScreenProps {
  serviceType: 'ride' | 'companionship';
  bookingData: any;
  onViewTracking: () => void;
  onBackToHome: () => void;
}

export function CaregivingConfirmationScreen({
  serviceType,
  bookingData,
  onViewTracking,
  onBackToHome
}: CaregivingConfirmationScreenProps) {
  const referenceNumber = `CG${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  
  return (
    <div className="h-full bg-white flex flex-col">
      {/* Success Header */}
      <div className="px-6 py-8 text-center">
        <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-10 h-10 text-white" strokeWidth={3} />
        </div>
        <h1 className="text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600">
          {serviceType === 'ride' 
            ? 'Your ride service has been booked successfully'
            : 'Your companionship service has been booked successfully'
          }
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 pb-6 space-y-6">
          {/* Reference Number */}
          <div className="p-4 bg-gray-50 rounded-xl text-center">
            <p className="text-gray-600 text-sm mb-1">Reference Number</p>
            <p className="text-gray-900 text-2xl tracking-wide">{referenceNumber}</p>
          </div>

          {/* Provider/Companion Info */}
          {serviceType === 'ride' ? (
            <div className="p-4 border-2 border-gray-200 rounded-xl">
              <h3 className="text-gray-900 mb-3">Ride Provider</h3>
              <p className="text-gray-900 mb-2">{bookingData.provider.name}</p>
              <p className="text-gray-600 text-sm mb-3">
                Provider will contact you shortly to confirm driver assignment
              </p>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Phone className="w-5 h-5 text-gray-700" />
                <span className="text-gray-900">(555) 123-4567</span>
              </div>
            </div>
          ) : (
            <div className="p-4 border-2 border-gray-200 rounded-xl">
              <h3 className="text-gray-900 mb-3">Your Companion</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-600 text-xl">👤</span>
                </div>
                <div>
                  <p className="text-gray-900">{bookingData.companion.name}</p>
                  <p className="text-gray-600 text-sm">{bookingData.companion.yearsExperience} years experience</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Phone className="w-5 h-5 text-gray-700" />
                <span className="text-gray-900">(555) 987-6543</span>
              </div>
            </div>
          )}

          {/* Booking Details */}
          <div className="p-4 border-2 border-gray-200 rounded-xl">
            <h3 className="text-gray-900 mb-3">Booking Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Date</span>
                <span className="text-gray-900">{bookingData.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time</span>
                <span className="text-gray-900">{bookingData.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration</span>
                <span className="text-gray-900">{bookingData.duration} hours</span>
              </div>
              {serviceType === 'ride' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pickup Location</span>
                    <span className="text-gray-900 text-right">{bookingData.pickupAddress?.label}</span>
                  </div>
                  {bookingData.stops && bookingData.stops.length > 0 && (
                    <div className="pt-2">
                      <p className="text-gray-600 mb-2">Stops ({bookingData.stops.length})</p>
                      {bookingData.stops.map((stop: any, index: number) => (
                        <div key={stop.id} className="text-gray-900 text-sm ml-4 mb-1">
                          {index + 1}. {stop.purpose} - {stop.address}
                        </div>
                      ))}
                    </div>
                  )}
                  {bookingData.isRoundTrip && (
                    <div className="flex justify-between pt-2">
                      <span className="text-gray-600">Round Trip</span>
                      <span className="text-gray-900">Yes (Return: {bookingData.returnTime})</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vehicle Type</span>
                    <span className="text-gray-900">{bookingData.vehicleType}</span>
                  </div>
                </>
              )}
              {serviceType === 'companionship' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location</span>
                    <span className="text-gray-900 text-right">{bookingData.serviceLocation?.label}</span>
                  </div>
                  {bookingData.supportTypes && bookingData.supportTypes.length > 0 && (
                    <div className="pt-2">
                      <p className="text-gray-600 mb-2">Support Services</p>
                      {bookingData.supportTypes.map((type: string, index: number) => (
                        <div key={index} className="text-gray-900 text-sm ml-4 mb-1">
                          • {type}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div className="p-4 border-2 border-gray-200 rounded-xl">
            <h3 className="text-gray-900 mb-3">Payment</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="text-gray-900">{bookingData.paymentMethod?.type} •••• {bookingData.paymentMethod?.last4}</span>
              </div>
              <div className="h-px bg-gray-200 my-2" />
              <div className="flex justify-between">
                <span className="text-gray-900">Total Paid</span>
                <span className="text-gray-900 text-xl">${bookingData.total}</span>
              </div>
            </div>
          </div>

          {/* Bottom Spacing */}
          <div className="h-4" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 border-t-2 border-gray-200 bg-white space-y-3">
        <button
          onClick={onViewTracking}
          className="w-full py-3 bg-gray-900 text-white rounded-xl"
        >
          View Booking Status
        </button>
        <button
          onClick={onBackToHome}
          className="w-full py-3 border-2 border-gray-200 text-gray-900 rounded-xl"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
