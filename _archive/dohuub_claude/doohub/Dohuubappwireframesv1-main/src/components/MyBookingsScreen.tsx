import { Calendar, Sparkles, ChevronRight, Home, User, MessageCircle } from 'lucide-react';
import type { Screen } from '../App';
import { useState } from 'react';

interface MyBookingsScreenProps {
  bookings: any[];
  navigate: (screen: Screen, data?: any) => void;
  onBookingSelect: (booking: any) => void;
}

export function MyBookingsScreen({ bookings, navigate, onBookingSelect }: MyBookingsScreenProps) {
  const [activeTab, setActiveTab] = useState<string>('All');
  const tabs = ['All', 'Upcoming', 'In Progress', 'Completed'];

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Upcoming') return booking.status === 'accepted';
    if (activeTab === 'In Progress') return booking.status === 'in-progress';
    if (activeTab === 'Completed') return booking.status === 'completed';
    return true;
  });

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-4 border-b-2 border-gray-200">
        <h3 className="text-gray-900">My Bookings</h3>
      </div>

      <div className="px-6 py-4 border-b-2 border-gray-200 overflow-x-auto">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                tab === activeTab
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 pb-24">
        {filteredBookings.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <Calendar className="w-16 h-16 text-gray-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600 mb-8">Start exploring services</p>
            <button
              onClick={() => navigate('home')}
              className="px-8 py-4 bg-gray-800 text-white rounded-lg border-2 border-gray-800"
            >
              Browse Services
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <button
                key={booking.id}
                onClick={() => onBookingSelect(booking)}
                className="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-gray-800 text-left"
              >
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-8 h-8 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-gray-900 mb-1">
                      {typeof booking.service === 'string' ? booking.service : booking.service?.name || 'Service'}
                    </h4>
                    <p className="text-gray-600 mb-2">{booking.date} at {booking.time}</p>
                    <p className="text-gray-600 truncate">
                      {typeof booking.address === 'string' ? booking.address : booking.address?.street || 'Address'}
                    </p>
                    <div className="mt-2 inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                      {booking.status || 'Pending'}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 px-6 py-4">
        <div className="flex justify-around">
          <button onClick={() => navigate('home')} className="flex flex-col items-center gap-1">
            <Home className="w-6 h-6 text-gray-400" strokeWidth={2} />
            <span className="text-gray-400">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <Calendar className="w-6 h-6 text-gray-800" strokeWidth={2} />
            <span className="text-gray-800">Bookings</span>
          </button>
          <button onClick={() => navigate('aiChat')} className="flex flex-col items-center gap-1">
            <MessageCircle className="w-6 h-6 text-gray-400" strokeWidth={2} />
            <span className="text-gray-400">AI Assistant</span>
          </button>
          <button onClick={() => navigate('profile')} className="flex flex-col items-center gap-1">
            <User className="w-6 h-6 text-gray-400" strokeWidth={2} />
            <span className="text-gray-400">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}