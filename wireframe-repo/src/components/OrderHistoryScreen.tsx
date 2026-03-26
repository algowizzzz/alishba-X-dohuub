import { ArrowLeft, Sparkles, FileText } from 'lucide-react';

interface OrderHistoryScreenProps {
  bookings: any[];
  onBack: () => void;
  onReorder: (service: any) => void;
}

export function OrderHistoryScreen({ bookings, onBack, onReorder }: OrderHistoryScreenProps) {
  return (
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-4 border-b-2 border-gray-200">
        <div className="flex items-center gap-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
          </button>
          <h3 className="text-gray-900">Order History</h3>
        </div>
      </div>

      <div className="px-6 py-4 border-b-2 border-gray-200">
        <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg">
          <option>All</option>
          <option>Last 30 Days</option>
          <option>Last 6 Months</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {bookings.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <FileText className="w-16 h-16 text-gray-400" strokeWidth={1.5} />
            </div>
            <p className="text-gray-600">No order history yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="p-4 border-2 border-gray-200 rounded-lg">
                <div className="flex gap-4 mb-4">
                  <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-8 h-8 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 mb-1">{booking.service}</p>
                    <p className="text-gray-600 mb-2">{booking.date}</p>
                    <div className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                      {booking.status}
                    </div>
                  </div>
                  <p className="text-gray-900 flex-shrink-0">{booking.total}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onReorder(booking)}
                    className="flex-1 py-3 border-2 border-gray-800 text-gray-800 rounded-lg"
                  >
                    Book Again
                  </button>
                  <button className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg">
                    View Receipt
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
