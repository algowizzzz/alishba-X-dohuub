import { ArrowLeft, Calendar, Clock, MapPin, Phone, Mail, CheckCircle, Circle, Loader, Star, X, Image as ImageIcon } from 'lucide-react';
import { House as PhHouse, Scissors as PhScissors, SprayBottle } from '@phosphor-icons/react';
import { useState, useEffect } from 'react';
import type { BookingData } from './CleaningServiceBookingFormScreen';

interface OrderTrackingScreenProps {
  bookingData: BookingData;
  onBack: () => void;
  onViewInvoice?: () => void;
  onRequestReview: (bookingData: BookingData) => void;
  onReorder?: () => void;
}

type OrderStatus = 'accepted' | 'in-progress' | 'completed';

export function OrderTrackingScreen({
  bookingData,
  onBack,
  onViewInvoice,
  onRequestReview,
  onReorder
}: OrderTrackingScreenProps) {
  // For demo purposes, you can change this to see different statuses
  // If booking already has review, set status to completed, otherwise use bookingData.status or 'accepted'
  const initialStatus: OrderStatus = bookingData.hasReview ? 'completed' : (bookingData.status as OrderStatus || 'accepted');
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(initialStatus);

  // Handle status change with delay for completed
  const handleStatusChange = (status: OrderStatus) => {
    setCurrentStatus(status);

    // Only navigate to review if booking doesn't already have a review
    if (status === 'completed' && !bookingData.hasReview) {
      // Wait 2 seconds then navigate to review screen
      setTimeout(() => {
        onRequestReview(bookingData);
      }, 2000);
    }
  };

  const statusSteps = [
    {
      id: 'accepted',
      label: 'Accepted',
      description: (bookingData as any).type === 'rental'
        ? 'Booking confirmed, waiting for check-in date'
        : 'Your booking has been confirmed',
      time: 'Just now'
    },
    {
      id: 'in-progress',
      label: 'In Progress',
      description: (bookingData as any).type === 'rental'
        ? 'Currently staying at property'
        : 'Service provider is working on your request',
      time: ''
    },
    {
      id: 'completed',
      label: 'Completed',
      description: 'Service has been completed',
      time: ''
    }
  ];

  const getStatusIndex = (status: OrderStatus): number => {
    return statusSteps.findIndex(step => step.id === status);
  };

  const currentStatusIndex = getStatusIndex(currentStatus);

  const getStatusIcon = (stepIndex: number) => {
    if (stepIndex < currentStatusIndex) {
      return (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shadow-premium-sm"
          style={{ background: 'linear-gradient(135deg, rgb(34, 197, 94), rgb(22, 163, 74))' }}
        >
          <CheckCircle className="w-5 h-5 text-white" />
        </div>
      );
    } else if (stepIndex === currentStatusIndex) {
      return (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shadow-premium-sm"
          style={{ background: 'var(--primary-gradient)' }}
        >
          <Loader className="w-5 h-5 text-white animate-spin" />
        </div>
      );
    } else {
      return (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'var(--muted)', border: '2px solid var(--border)' }}
        >
          <Circle className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
        </div>
      );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

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
          <h1 className="font-semibold" style={{ color: 'var(--foreground)' }}>Order Status</h1>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 relative z-10">
        {/* Service Card */}
        <div
          className="mb-6 p-4 rounded-xl shadow-card"
          style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <div className="flex gap-3 mb-3">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 shadow-premium-sm"
              style={{ background: 'var(--primary-gradient)' }}
            >
              {(bookingData as any).type === 'rental'
                ? <PhHouse size={28} weight="fill" color="#fff" />
                : (bookingData as any).providerName
                  ? <PhScissors size={28} weight="fill" color="#fff" />
                  : <SprayBottle size={28} weight="fill" color="#fff" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold mb-1" style={{ color: 'var(--foreground)' }}>
                {(bookingData as any).type === 'rental'
                  ? (bookingData as any).property?.name || bookingData.service.name
                  : bookingData.service.name
                }
              </h3>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                {(bookingData as any).type === 'rental'
                  ? (bookingData as any).property?.location || 'Rental Property'
                  : (bookingData as any).vendor?.name || (bookingData as any).providerName
                }
              </p>
              {((bookingData as any).isPoweredByDoHuub && (bookingData as any).pointsEarned) || (bookingData as any).pointsRedeemed ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {(bookingData as any).isPoweredByDoHuub && (bookingData as any).pointsEarned && (
                    <span
                      className="inline-block px-3 py-1 rounded-full text-sm text-white shadow-premium-sm"
                      style={{ background: 'linear-gradient(135deg, rgb(245, 158, 11), rgb(249, 115, 22))' }}
                    >
                      +{(bookingData as any).pointsEarned} pts earned
                    </span>
                  )}
                  {(bookingData as any).pointsRedeemed && (
                    <span
                      className="inline-block px-3 py-1 rounded-full text-sm"
                      style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: 'rgb(22, 163, 74)' }}
                    >
                      -{(bookingData as any).pointsRedeemed} pts redeemed
                    </span>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="mb-6">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Order Timeline</h3>
          <div className="space-y-4">
            {statusSteps.map((step, index) => (
              <div key={step.id} className="flex gap-4">
                {/* Icon Column */}
                <div className="flex flex-col items-center">
                  <div className="flex-shrink-0">
                    {getStatusIcon(index)}
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div
                      className="w-0.5 h-12 mt-2 rounded-full"
                      style={{
                        backgroundColor: index < currentStatusIndex ? 'var(--primary)' : 'var(--border)'
                      }}
                    />
                  )}
                </div>

                {/* Content Column */}
                <div className="flex-1 pb-4">
                  <h4
                    className={`font-medium mb-1 ${index <= currentStatusIndex ? '' : 'opacity-50'}`}
                    style={{ color: 'var(--foreground)' }}
                  >
                    {step.label}
                  </h4>
                  <p
                    className={`text-sm mb-1 ${index <= currentStatusIndex ? '' : 'opacity-50'}`}
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    {step.description}
                  </p>
                  {step.time && index <= currentStatusIndex && (
                    <p className="text-sm" style={{ color: 'var(--primary)' }}>{step.time}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Service Details */}
        <div
          className="mb-6 p-4 rounded-xl shadow-card"
          style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Service Details</h3>

          <div className="space-y-3">
            {(bookingData as any).type === 'rental' ? (
              <>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                  <div>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Check-in / Check-out</p>
                    <p className="font-medium" style={{ color: 'var(--foreground)' }}>
                      {(bookingData as any).checkInDate || bookingData.date} - {(bookingData as any).checkOutDate || bookingData.date}
                    </p>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{(bookingData as any).duration || '1 night'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Property Location</p>
                    <p className="font-medium" style={{ color: 'var(--foreground)' }}>{(bookingData as any).property?.location || bookingData.address.label}</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                  <div>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Scheduled Date & Time</p>
                    <p className="font-medium" style={{ color: 'var(--foreground)' }}>{bookingData.date} at {bookingData.time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Service Address</p>
                    <p className="font-medium" style={{ color: 'var(--foreground)' }}>{bookingData.address.label}</p>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      {bookingData.address.street}, {bookingData.address.city}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Check-in Instructions (for rental properties) */}
        {(bookingData as any).type === 'rental' && (
          <div
            className="mb-6 p-4 rounded-xl shadow-card"
            style={{
              background: 'linear-gradient(135deg, rgba(46, 122, 217, 0.05), rgba(46, 122, 217, 0.1))',
              border: '1px solid rgba(46, 122, 217, 0.2)',
              
            }}
          >
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Check-in Instructions</h3>
            <p style={{ color: 'var(--muted-foreground)' }}>
              {(bookingData as any).property?.checkInInstructions}
            </p>
          </div>
        )}

        {/* Demo Status Changer (for testing) */}
        <div
          className="mb-6 p-4 rounded-xl shadow-card"
          style={{
            background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1))',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            
          }}
        >
          <p className="font-medium mb-3 text-sm" style={{ color: 'rgb(180, 83, 9)' }}>Demo: Change Status</p>
          <div className="flex gap-2">
            {['accepted', 'in-progress', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status as OrderStatus)}
                className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                style={{
                  backgroundColor: currentStatus === status ? 'var(--primary)' : 'var(--card)',
                  color: currentStatus === status ? 'white' : 'var(--foreground)',
                  border: `1px solid ${currentStatus === status ? 'var(--primary)' : 'var(--border)'}`
                }}
              >
                {status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* View Invoice (if completed) */}
        {currentStatus === 'completed' && onViewInvoice && (
          <button
            onClick={onViewInvoice}
            className="w-full py-4 rounded-xl font-medium mb-3 transition-all duration-300 hover:shadow-card"
            style={{
              backgroundColor: 'var(--muted)',
              color: 'var(--foreground)',
              
            }}
          >
            View Invoice
          </button>
        )}

        {/* Reorder Service (if completed) */}
        {currentStatus === 'completed' && onReorder && (
          <button
            onClick={onReorder}
            className="w-full py-4 rounded-xl text-white font-medium mb-3 transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'var(--primary-gradient)' }}
          >
            Reorder Service
          </button>
        )}

        {/* Leave a Review (if completed and no review yet) */}
        {currentStatus === 'completed' && !bookingData.hasReview && (
          <button
            onClick={() => onRequestReview(bookingData)}
            className="w-full py-4 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'var(--primary-gradient)' }}
          >
            Leave a Review
          </button>
        )}

        {/* Already Reviewed (if completed and has review) */}
        {currentStatus === 'completed' && bookingData.hasReview && (
          <div
            className="w-full py-4 rounded-xl text-center font-medium shadow-card"
            style={{
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              color: 'rgb(22, 163, 74)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              
            }}
          >
            ✓ Review Submitted
          </div>
        )}
      </div>
    </div>
  );
}
