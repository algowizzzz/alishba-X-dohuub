import { ArrowLeft, FileText } from 'lucide-react';
import { Sparkle } from '@phosphor-icons/react';

interface OrderHistoryScreenProps {
  bookings: any[];
  onBack: () => void;
  onReorder: (service: any) => void;
}

export function OrderHistoryScreen({ bookings, onBack, onReorder }: OrderHistoryScreenProps) {
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
          <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Order History</h3>
        </div>
      </div>

      {/* Filter */}
      <div className="px-6 py-4 relative z-10">
        <select
          className="w-full px-4 py-3 rounded-xl shadow-card outline-none transition-all duration-300 focus:shadow-glow"
          style={{
            backgroundColor: 'var(--card)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)'
          }}
        >
          <option>All</option>
          <option>Last 30 Days</option>
          <option>Last 6 Months</option>
          <option>This Year</option>
        </select>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4 relative z-10">
        {bookings.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center mb-6 shadow-premium-lg"
              style={{ backgroundColor: 'var(--card)' }}
            >
              <FileText className="w-16 h-16" style={{ color: 'var(--muted-foreground)' }} strokeWidth={1.5} />
            </div>
            <p style={{ color: 'var(--muted-foreground)' }}>No order history yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, index) => (
              <div
                key={booking.id}
                className="p-4 rounded-xl shadow-card transition-all duration-300 hover:shadow-premium-sm"
                style={{
                  backgroundColor: 'var(--card)',
                                  }}
              >
                <div className="flex gap-4 mb-4">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 shadow-premium-sm"
                    style={{ background: 'var(--primary-gradient)' }}
                  >
                    <Sparkle size={32} weight="fill" color="#fff" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium mb-1" style={{ color: 'var(--foreground)' }}>{booking.service}</p>
                    <p className="text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>{booking.date}</p>
                    <div
                      className="inline-block px-3 py-1 rounded-full text-sm"
                      style={{
                        backgroundColor: booking.status === 'Completed' ? 'rgba(34, 197, 94, 0.1)' : 'var(--muted)',
                        color: booking.status === 'Completed' ? 'rgb(22, 163, 74)' : 'var(--muted-foreground)'
                      }}
                    >
                      {booking.status}
                    </div>
                  </div>
                  <p className="font-semibold flex-shrink-0" style={{ color: 'var(--foreground)' }}>{booking.total}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => onReorder(booking)}
                    className="flex-1 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: 'var(--primary-gradient)',
                      color: 'white'
                    }}
                  >
                    Book Again
                  </button>
                  <button
                    className="flex-1 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-card"
                    style={{
                      backgroundColor: 'var(--background)',
                      color: 'var(--foreground)',
                      border: '1px solid var(--border)'
                    }}
                  >
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
