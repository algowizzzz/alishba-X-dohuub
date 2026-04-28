import { Calendar, ChevronRight, Gift, Award } from 'lucide-react';
import { Sparkle } from '@phosphor-icons/react';
import type { Screen } from '../App';
import { useState } from 'react';
import { BottomNavigation } from './BottomNavigation';

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
    <div className="h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
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
        <h1
          style={{
            color: 'var(--foreground)',
            fontSize: '20px',
            fontWeight: 600,
          }}
        >
          My Bookings
        </h1>
      </div>

      <div className="px-6 py-4 border-b overflow-x-auto" style={{ borderColor: 'rgba(46, 122, 217, 0.1)' }}>
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              className="px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 shadow-premium-sm hover:shadow-premium-md"
              style={tab === activeTab
                ? { background: 'var(--primary-gradient)', color: 'white', boxShadow: '0 0 12px rgba(76, 166, 250, 0.3)' }
                : { backgroundColor: 'var(--secondary)', color: 'var(--foreground)' }
              }
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 pb-32">
        {filteredBookings.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="w-32 h-32 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: 'var(--secondary)' }}>
              <Calendar className="w-16 h-16" style={{ color: 'var(--primary)' }} strokeWidth={1.5} />
            </div>
            <h3 className="mb-2" style={{ color: 'var(--foreground)' }}>No bookings yet</h3>
            <p className="mb-8" style={{ color: 'var(--muted-foreground)' }}>Start exploring services</p>
            <button
              onClick={() => navigate('home')}
              className="px-8 py-4 text-white rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'var(--primary-gradient)', boxShadow: '0 4px 14px 0 rgba(76, 166, 250, 0.39)' }}
            >
              Browse Services
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking, index) => (
              <button
                key={booking.id}
                onClick={() => onBookingSelect(booking)}
                className="w-full p-4 rounded-xl text-left shadow-card transition-all duration-300 hover:shadow-card-hover hover:scale-[1.01] active:scale-[0.99] accent-border-left"
                style={{ backgroundColor: 'var(--card)', border: '1px solid rgba(46, 122, 217, 0.08)', animationFillMode: 'backwards' }}
              >
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 shadow-premium-sm" style={{ backgroundColor: 'var(--secondary)' }}>
                    <Sparkle size={32} weight="fill" style={{ color: 'var(--primary)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 style={{ color: 'var(--foreground)' }}>
                        {typeof booking.service === 'string' ? booking.service : booking.service?.name || 'Service'}
                      </h4>
                      {booking.isPoweredByDoHuub && (
                        <span className="inline-block px-2 py-0.5 text-white text-xs rounded whitespace-nowrap" style={{ background: 'var(--primary-gradient)' }}>
                          Powered by DoHuub
                        </span>
                      )}
                    </div>
                    <p className="mb-2" style={{ color: 'var(--muted-foreground)' }}>{booking.date} at {booking.time}</p>
                    <p className="truncate" style={{ color: 'var(--muted-foreground)' }}>
                      {typeof booking.address === 'string' ? booking.address : booking.address?.street || 'Address'}
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="inline-block px-3 py-1 rounded-full text-sm" style={{ backgroundColor: 'var(--secondary)', color: 'var(--foreground)' }}>
                        {booking.status || 'Pending'}
                      </span>
                      {booking.isPoweredByDoHuub && booking.pointsEarned && (
                        <span className="inline-block px-3 py-1 rounded-full text-sm" style={{ backgroundColor: '#D1FAE5', color: '#10B981' }}>
                          +{booking.pointsEarned} pts
                        </span>
                      )}
                      {booking.pointsRedeemed && (
                        <span className="inline-block px-3 py-1 rounded-full text-sm" style={{ backgroundColor: '#FEF3C7', color: '#F59E0B' }}>
                          -{booking.pointsRedeemed} pts
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--muted-foreground)' }} />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="bookings" navigate={navigate} />
    </div>
  );
}