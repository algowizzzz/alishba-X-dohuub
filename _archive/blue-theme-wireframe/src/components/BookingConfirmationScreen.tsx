import { CheckCircle, Share2 } from 'lucide-react';

interface BookingConfirmationScreenProps {
  booking: any;
  onViewDetails: () => void;
  onHome: () => void;
}

export function BookingConfirmationScreen({ booking, onViewDetails, onHome }: BookingConfirmationScreenProps) {
  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />

      {/* Header */}
      <div
        className="px-6 py-6 relative z-10 flex justify-end"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.06)',
          borderBottom: '1px solid rgba(46, 122, 217, 0.08)',
          borderRadius: '0 0 24px 24px',
        }}
      >
        <button
          className="p-2 rounded-xl transition-all duration-300 hover:shadow-card"
          style={{ backgroundColor: 'var(--card)' }}
        >
          <Share2 className="w-5 h-5" style={{ color: 'var(--foreground)' }} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10">
        {/* Success Icon */}
        <div
          className="w-32 h-32 rounded-full flex items-center justify-center mb-6 shadow-premium-lg animate-scale-in"
          style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1))' }}
        >
          <CheckCircle className="w-20 h-20" style={{ color: 'rgb(34, 197, 94)' }} strokeWidth={1.5} />
        </div>

        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
          Booking Confirmed!
        </h2>
        <p className="mb-8" style={{ color: 'var(--muted-foreground)' }}>
          Booking reference: #{booking?.id || 'DOH12345'}
        </p>

        {/* Booking Summary Card */}
        <div
          className="w-full max-w-sm p-6 rounded-2xl shadow-premium-md space-y-4 mb-8"
          style={{ backgroundColor: 'var(--card)' }}
        >
          <div>
            <p className="text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>Service</p>
            <p className="font-medium" style={{ color: 'var(--foreground)' }}>{booking?.service || 'Cleaning Service'}</p>
          </div>
          <div>
            <p className="text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>Date & Time</p>
            <p className="font-medium" style={{ color: 'var(--foreground)' }}>{booking?.date} at {booking?.time}</p>
          </div>
          <div>
            <p className="text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>Address</p>
            <p className="font-medium" style={{ color: 'var(--foreground)' }}>{booking?.address}</p>
          </div>
          <div
            className="pt-4"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <p className="text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>Amount Paid</p>
            <p className="text-xl font-bold" style={{ color: 'var(--primary)' }}>{booking?.total}</p>
          </div>
        </div>

        <p
          className="text-center mb-8"
          style={{ color: 'var(--muted-foreground)' }}
        >
          You'll receive updates via notifications
        </p>

        {/* Action Buttons */}
        <div className="w-full max-w-sm space-y-3">
          <button
            onClick={onViewDetails}
            className="w-full py-4 rounded-xl font-semibold text-white shadow-premium-md transition-all duration-300 hover:shadow-premium-lg hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'var(--primary-gradient)' }}
          >
            View Booking Details
          </button>
          <button
            onClick={onHome}
            className="w-full py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-card"
            style={{
              backgroundColor: 'var(--card)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)'
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
