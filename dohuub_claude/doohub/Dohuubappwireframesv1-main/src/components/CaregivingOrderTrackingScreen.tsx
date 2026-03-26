import { ArrowLeft, Phone, MessageCircle, Check } from 'lucide-react';

interface CaregivingOrderTrackingScreenProps {
  serviceType: 'ride' | 'companionship';
  bookingData: any;
  onBack: () => void;
}

type OrderStatus = 'Accepted' | 'In Progress' | 'Completed';

export function CaregivingOrderTrackingScreen({
  serviceType,
  bookingData,
  onBack
}: CaregivingOrderTrackingScreenProps) {
  const currentStatus: OrderStatus = 'In Progress';

  const statuses: OrderStatus[] = ['Accepted', 'In Progress', 'Completed'];
  const currentStatusIndex = statuses.indexOf(currentStatus);

  const statusDescriptions = {
    'ride': {
      'Accepted': 'Your booking has been confirmed',
      'In Progress': 'Transportation service in progress',
      'Completed': 'Ride completed successfully'
    },
    'companionship': {
      'Accepted': 'Your booking has been confirmed',
      'In Progress': 'Companion is providing care',
      'Completed': 'Service completed successfully'
    }
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b-2 border-gray-200 flex items-center gap-4 bg-white sticky top-0 z-10">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
        </button>
        <h1 className="text-gray-900">Booking Status</h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6 space-y-6">
          {/* Status Timeline */}
          <div className="p-6 bg-gray-50 rounded-xl">
            <h3 className="text-gray-900 mb-6">Status</h3>
            <div className="space-y-4">
              {statuses.map((status, index) => {
                const isCompleted = index < currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                const isPending = index > currentStatusIndex;

                return (
                  <div key={status} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isCompleted || isCurrent
                            ? 'bg-gray-900'
                            : 'bg-gray-200'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-6 h-6 text-white" strokeWidth={3} />
                        ) : (
                          <div
                            className={`w-3 h-3 rounded-full ${
                              isCurrent ? 'bg-white' : 'bg-gray-400'
                            }`}
                          />
                        )}
                      </div>
                      {index < statuses.length - 1 && (
                        <div
                          className={`w-0.5 h-12 ${
                            isCompleted ? 'bg-gray-900' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <p
                        className={`mb-1 ${
                          isCompleted || isCurrent
                            ? 'text-gray-900'
                            : 'text-gray-500'
                        }`}
                      >
                        {status}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {statusDescriptions[serviceType][status]}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Provider/Companion Info */}
          {serviceType === 'ride' ? (
            <div className="p-4 border-2 border-gray-200 rounded-xl">
              <h3 className="text-gray-900 mb-3">Ride Provider</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-600 text-xl">🚗</span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-900">{bookingData.provider.name}</p>
                  <p className="text-gray-600 text-sm">Transportation Service</p>
                </div>
              </div>
              <button className="w-full py-3 bg-gray-900 text-white rounded-xl flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" />
                Contact Provider
              </button>
            </div>
          ) : (
            <div className="p-4 border-2 border-gray-200 rounded-xl">
              <h3 className="text-gray-900 mb-3">Your Companion</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-600 text-xl">👤</span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-900">{bookingData.companion.name}</p>
                  <p className="text-gray-600 text-sm">{bookingData.companion.yearsExperience} years experience</p>
                </div>
              </div>
              <button className="w-full py-3 bg-gray-900 text-white rounded-xl flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" />
                Contact Companion
              </button>
            </div>
          )}

          {/* Service Details */}
          <div className="p-4 border-2 border-gray-200 rounded-xl">
            <h3 className="text-gray-900 mb-3">Service Details</h3>
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
                    <span className="text-gray-600">Pickup</span>
                    <span className="text-gray-900 text-right">{bookingData.pickupAddress?.label}</span>
                  </div>
                  {bookingData.stops && bookingData.stops.length > 0 && (
                    <div className="pt-2">
                      <p className="text-gray-600 mb-2">Stops</p>
                      {bookingData.stops.map((stop: any, index: number) => (
                        <div key={stop.id} className="text-gray-900 text-sm ml-4 mb-1">
                          {index + 1}. {stop.purpose}
                        </div>
                      ))}
                    </div>
                  )}
                  {bookingData.isRoundTrip && (
                    <div className="flex justify-between pt-2">
                      <span className="text-gray-600">Round Trip</span>
                      <span className="text-gray-900">Yes</span>
                    </div>
                  )}
                </>
              )}
              {serviceType === 'companionship' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location</span>
                    <span className="text-gray-900 text-right">{bookingData.serviceLocation?.label}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Updates / Check-in Notes (for Companionship) */}
          {serviceType === 'companionship' && currentStatusIndex >= 1 && (
            <div className="p-4 border-2 border-gray-200 rounded-xl">
              <h3 className="text-gray-900 mb-3">Check-in Notes</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-900 text-sm">10:30 AM</span>
                    <span className="text-gray-600 text-sm">Session started</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Arrived on time. Beginning activities as planned.
                  </p>
                </div>
                {currentStatusIndex >= 2 && (
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-900 text-sm">12:15 PM</span>
                      <span className="text-gray-600 text-sm">Session completed</span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Session went well. Patient enjoyed activities and conversation.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Updates (for Ride) */}
          {serviceType === 'ride' && currentStatusIndex >= 1 && (
            <div className="p-4 border-2 border-gray-200 rounded-xl">
              <h3 className="text-gray-900 mb-3">Updates</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-900 text-sm">9:00 AM</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Service in progress. Currently en route to first stop.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Total Amount */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex justify-between">
              <span className="text-gray-900">Total Amount</span>
              <span className="text-gray-900 text-xl">${bookingData.total}</span>
            </div>
          </div>

          {/* Bottom Spacing */}
          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}
