import { ArrowLeft, MapPin, FileText, Phone } from 'lucide-react';

interface BookingDetailsScreenProps {
  booking: any;
  onBack: () => void;
  onRate: () => void;
}

export function BookingDetailsScreen({ booking, onBack, onRate }: BookingDetailsScreenProps) {
  return (
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-4 border-b-2 border-gray-200">
        <div className="flex items-center gap-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
          </button>
          <h3 className="text-gray-900">Booking #{booking?.id || 'DOH12345'}</h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Status Timeline */}
        <div className="mb-8">
          <p className="text-gray-900 mb-4">Status</p>
          <div className="relative pl-8">
            {/* Confirmed */}
            <div className="mb-6 relative">
              <div className="absolute left-[-2rem] top-1 w-4 h-4 rounded-full bg-gray-700 border-4 border-white"></div>
              <p className="text-gray-900 mb-1">Confirmed</p>
              <p className="text-gray-600">Dec 1, 2025 at 3:30 PM</p>
            </div>

            {/* Accepted */}
            <div className="mb-6 relative">
              <div className="absolute left-[-2rem] top-1 w-4 h-4 rounded-full bg-gray-700 border-4 border-white"></div>
              <div className="absolute left-[-1.75rem] top-[-1.5rem] w-1 h-6 bg-gray-300"></div>
              <p className="text-gray-900 mb-1">Accepted</p>
              <p className="text-gray-600">Dec 1, 2025 at 4:15 PM</p>
            </div>

            {/* In Progress */}
            <div className="mb-6 relative">
              <div className="absolute left-[-2rem] top-1 w-4 h-4 rounded-full bg-gray-300 border-4 border-white"></div>
              <div className="absolute left-[-1.75rem] top-[-1.5rem] w-1 h-6 bg-gray-300"></div>
              <p className="text-gray-600 mb-1">In Progress</p>
              <p className="text-gray-500">Pending</p>
            </div>

            {/* Completed */}
            <div className="relative">
              <div className="absolute left-[-2rem] top-1 w-4 h-4 rounded-full bg-gray-300 border-4 border-white"></div>
              <div className="absolute left-[-1.75rem] top-[-1.5rem] w-1 h-6 bg-gray-300"></div>
              <p className="text-gray-600 mb-1">Completed</p>
              <p className="text-gray-500">Pending</p>
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="mb-6 p-4 border-2 border-gray-200 rounded-lg space-y-4">
          <div>
            <p className="text-gray-600 mb-1">Service</p>
            <p className="text-gray-900">
              {typeof booking?.service === 'string' 
                ? booking?.service 
                : booking?.service?.name || 'Cleaning Service'}
            </p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Provider</p>
            <p className="text-gray-900">
              {typeof booking?.vendor === 'string'
                ? booking?.vendor
                : booking?.vendor?.name || 'DoHuub Premium Cleaning'}
            </p>
            <div className="mt-1 inline-block px-3 py-1 bg-gray-800 text-white rounded-full">
              ✓ Powered by DoHuub
            </div>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Date & Time</p>
            <p className="text-gray-900">{booking?.date} at {booking?.time}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Address</p>
            <p className="text-gray-900">
              {typeof booking?.address === 'string'
                ? booking?.address
                : booking?.address?.street || 'Home Address'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-6 space-y-3">
          <button className="w-full p-4 border-2 border-gray-200 rounded-lg flex items-center gap-3">
            <MapPin className="w-5 h-5 text-gray-600" />
            <span className="text-gray-900">Get Directions</span>
          </button>
          <button className="w-full p-4 border-2 border-gray-800 bg-gray-100 rounded-lg flex items-center gap-3">
            <Phone className="w-5 h-5 text-gray-700" />
            <span className="text-gray-900">Contact AI Assistant</span>
          </button>
        </div>

        {/* Payment Receipt */}
        <div className="mb-6">
          <button className="w-full p-4 border-2 border-gray-200 rounded-lg text-left">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-900">Payment Receipt</p>
              <span className="text-gray-600">▼</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Service</span>
                <span>$89.00</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Service Fee</span>
                <span>$8.00</span>
              </div>
              <div className="h-px bg-gray-200 my-2"></div>
              <div className="flex justify-between text-gray-900">
                <span>Total Paid</span>
                <span>{booking?.total}</span>
              </div>
            </div>
          </button>
        </div>

        {/* Rate Experience (if completed) */}
        {booking?.status === 'Completed' && (
          <div className="p-6 border-2 border-gray-200 rounded-lg text-center">
            <p className="text-gray-900 mb-4">How was your experience?</p>
            <button
              onClick={onRate}
              className="px-8 py-3 bg-gray-800 text-white rounded-lg border-2 border-gray-800"
            >
              Rate Your Experience
            </button>
          </div>
        )}

        <button className="w-full text-gray-500 mt-6">
          Cancel Booking
        </button>
      </div>
    </div>
  );
}