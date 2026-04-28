import { ArrowLeft, MapPin, Phone, Gift } from 'lucide-react';

interface BookingDetailsScreenProps {
  booking: any;
  onBack: () => void;
  onRate: () => void;
}

export function BookingDetailsScreen({ booking, onBack, onRate }: BookingDetailsScreenProps) {
  const timelineSteps = [
    { label: 'Confirmed', date: 'Dec 1, 2025 at 3:30 PM', completed: true },
    { label: 'Accepted', date: 'Dec 1, 2025 at 4:15 PM', completed: true },
    { label: 'In Progress', date: 'Pending', completed: false },
    { label: 'Completed', date: 'Pending', completed: false },
  ];

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
          <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Booking #{booking?.id || 'DOH12345'}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 relative z-10">
        {/* Status Timeline */}
        <div className="mb-8">
          <p className="font-medium mb-4" style={{ color: 'var(--foreground)' }}>Status</p>
          <div className="relative pl-8">
            {timelineSteps.map((step, index) => (
              <div key={step.label} className="mb-6 relative last:mb-0">
                {/* Dot */}
                <div
                  className={`absolute left-[-2rem] top-1 w-4 h-4 rounded-full border-4 transition-all duration-300 ${
                    step.completed ? 'shadow-premium-sm' : ''
                  }`}
                  style={{
                    backgroundColor: step.completed ? 'var(--primary)' : 'var(--muted)',
                    borderColor: 'var(--background)'
                  }}
                />
                {/* Line */}
                {index > 0 && (
                  <div
                    className="absolute left-[-1.75rem] top-[-1.5rem] w-1 h-6"
                    style={{ backgroundColor: timelineSteps[index - 1].completed ? 'var(--primary)' : 'var(--muted)' }}
                  />
                )}
                {/* Content */}
                <p
                  className="mb-1 font-medium"
                  style={{ color: step.completed ? 'var(--foreground)' : 'var(--muted-foreground)' }}
                >
                  {step.label}
                </p>
                <p style={{ color: 'var(--muted-foreground)' }}>{step.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Service Details Card */}
        <div
          className="mb-6 p-4 rounded-xl shadow-card space-y-4"
          style={{ backgroundColor: 'var(--card)' }}
        >
          <div>
            <p className="text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>Service</p>
            <p className="font-medium" style={{ color: 'var(--foreground)' }}>
              {typeof booking?.service === 'string'
                ? booking?.service
                : booking?.service?.name || 'Cleaning Service'}
            </p>
          </div>
          <div>
            <p className="text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>Provider</p>
            <p className="font-medium" style={{ color: 'var(--foreground)' }}>
              {typeof booking?.vendor === 'string'
                ? booking?.vendor
                : booking?.vendor?.name || 'DoHuub Premium Cleaning'}
            </p>
            <div
              className="mt-2 inline-block px-3 py-1 rounded-full text-sm text-white"
              style={{ background: 'var(--primary-gradient)' }}
            >
              ✓ Powered by DoHuub
            </div>
          </div>
          <div>
            <p className="text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>Date & Time</p>
            <p className="font-medium" style={{ color: 'var(--foreground)' }}>{booking?.date} at {booking?.time}</p>
          </div>
          <div>
            <p className="text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>Address</p>
            <p className="font-medium" style={{ color: 'var(--foreground)' }}>
              {typeof booking?.address === 'string'
                ? booking?.address
                : booking?.address?.street || 'Home Address'}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 space-y-3">
          <button
            className="w-full p-4 rounded-xl flex items-center gap-3 shadow-card transition-all duration-300 hover:shadow-premium-sm"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--muted)' }}
            >
              <MapPin className="w-5 h-5" style={{ color: 'var(--primary)' }} />
            </div>
            <span className="font-medium" style={{ color: 'var(--foreground)' }}>Get Directions</span>
          </button>
          <button
            className="w-full p-4 rounded-xl flex items-center gap-3 shadow-premium-sm transition-all duration-300 hover:shadow-premium-md"
            style={{ background: 'var(--primary-gradient)' }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <Phone className="w-5 h-5 text-white" />
            </div>
            <span className="font-medium text-white">Contact AI Assistant</span>
          </button>
        </div>

        {/* Payment Receipt */}
        <div
          className="mb-6 p-4 rounded-xl shadow-card"
          style={{ backgroundColor: 'var(--card)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="font-medium" style={{ color: 'var(--foreground)' }}>Payment Receipt</p>
            <span style={{ color: 'var(--muted-foreground)' }}>▼</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between" style={{ color: 'var(--muted-foreground)' }}>
              <span>Service</span>
              <span>$89.00</span>
            </div>
            <div className="flex justify-between" style={{ color: 'var(--muted-foreground)' }}>
              <span>Service Fee</span>
              <span>$8.00</span>
            </div>
            <div className="h-px my-2" style={{ backgroundColor: 'var(--border)' }} />
            <div className="flex justify-between font-semibold" style={{ color: 'var(--foreground)' }}>
              <span>Total Paid</span>
              <span>{booking?.total}</span>
            </div>
            {booking?.isPoweredByDoHuub && booking?.pointsEarned && (
              <div
                className="flex justify-between pt-3 mt-3"
                style={{ borderTop: '1px solid var(--border)', color: 'rgb(245, 158, 11)' }}
              >
                <span className="flex items-center gap-1">
                  <Gift className="w-4 h-4" />
                  Points Earned
                </span>
                <span className="font-semibold">+{booking?.pointsEarned} pts</span>
              </div>
            )}
          </div>
        </div>

        {/* Rate Experience (if completed) */}
        {booking?.status === 'Completed' && (
          <div
            className="p-6 rounded-xl text-center shadow-card"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <p className="mb-4 font-medium" style={{ color: 'var(--foreground)' }}>How was your experience?</p>
            <button
              onClick={onRate}
              className="px-8 py-3 rounded-xl font-semibold text-white shadow-premium-md transition-all duration-300 hover:shadow-premium-lg hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'var(--primary-gradient)' }}
            >
              Rate Your Experience
            </button>
          </div>
        )}

        <button
          className="w-full mt-6 py-3 transition-all duration-300"
          style={{ color: 'var(--destructive)' }}
        >
          Cancel Booking
        </button>
      </div>
    </div>
  );
}
