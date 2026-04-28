import { CheckCircle, Share2 } from 'lucide-react';

interface BookingConfirmationScreenProps {
  booking: any;
  onViewDetails: () => void;
  onHome: () => void;
}

export function BookingConfirmationScreen({ booking, onViewDetails, onHome }: BookingConfirmationScreenProps) {
  return (
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-4 border-b-2 border-gray-200 flex justify-end">
        <button className="p-2">
          <Share2 className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <CheckCircle className="w-20 h-20 text-gray-700" strokeWidth={1.5} />
        </div>

        <h2 className="text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600 mb-8">Booking reference: #{booking?.id || 'DOH12345'}</p>

        <div className="w-full max-w-sm p-6 border-2 border-gray-200 rounded-lg space-y-4 mb-8">
          <div>
            <p className="text-gray-600 mb-1">Service</p>
            <p className="text-gray-900">{booking?.service || 'Cleaning Service'}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Date & Time</p>
            <p className="text-gray-900">{booking?.date} at {booking?.time}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Address</p>
            <p className="text-gray-900">{booking?.address}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Amount Paid</p>
            <p className="text-gray-900">{booking?.total}</p>
          </div>
        </div>

        <p className="text-gray-600 text-center mb-8">
          You'll receive updates via notifications
        </p>

        <div className="w-full max-w-sm space-y-3">
          <button
            onClick={onViewDetails}
            className="w-full py-4 bg-gray-800 text-white rounded-lg border-2 border-gray-800"
          >
            View Booking Details
          </button>
          <button
            onClick={onHome}
            className="w-full py-4 bg-white text-gray-800 rounded-lg border-2 border-gray-800"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
