import { ArrowLeft, Calendar, Clock, MapPin, Phone, Mail, CheckCircle, Circle, Loader, Star, X, Image as ImageIcon } from 'lucide-react';
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
      return <CheckCircle className="w-8 h-8 text-gray-900" />;
    } else if (stepIndex === currentStatusIndex) {
      return <Loader className="w-8 h-8 text-gray-900" />;
    } else {
      return <Circle className="w-8 h-8 text-gray-300" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b-2 border-gray-200 flex items-center gap-4">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
        </button>
        <h1 className="text-gray-900">Order Status</h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Service Card */}
        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
          <div className="flex gap-3 mb-3">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-gray-400 text-2xl">
                {(bookingData as any).type === 'rental' ? '🏠' : (bookingData as any).providerName ? '💅' : '🧹'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-gray-900 mb-1">
                {(bookingData as any).type === 'rental' 
                  ? (bookingData as any).property?.name || bookingData.service.name
                  : bookingData.service.name
                }
              </h3>
              <p className="text-gray-600 text-sm">
                {(bookingData as any).type === 'rental'
                  ? (bookingData as any).property?.location || 'Rental Property'
                  : (bookingData as any).vendor?.name || (bookingData as any).providerName
                }
              </p>
            </div>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="mb-6">
          <h3 className="text-gray-900 mb-4">Order Timeline</h3>
          <div className="space-y-6">
            {statusSteps.map((step, index) => (
              <div key={step.id} className="flex gap-4">
                {/* Icon Column */}
                <div className="flex flex-col items-center">
                  <div className="flex-shrink-0">
                    {getStatusIcon(index)}
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div 
                      className={`w-0.5 h-12 mt-2 ${
                        index < currentStatusIndex ? 'bg-gray-900' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>

                {/* Content Column */}
                <div className="flex-1 pb-4">
                  <h4 className={`mb-1 ${index <= currentStatusIndex ? 'text-gray-900' : 'text-gray-500'}`}>
                    {step.label}
                  </h4>
                  <p className={`text-sm mb-1 ${index <= currentStatusIndex ? 'text-gray-600' : 'text-gray-400'}`}>
                    {step.description}
                  </p>
                  {step.time && index <= currentStatusIndex && (
                    <p className="text-gray-500 text-sm">{step.time}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Service Details */}
        <div className="mb-6 p-4 border-2 border-gray-200 rounded-xl">
          <h3 className="text-gray-900 mb-3">Service Details</h3>

          <div className="space-y-3">
            {(bookingData as any).type === 'rental' ? (
              <>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-700 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700">Check-in / Check-out</p>
                    <p className="text-gray-900">
                      {(bookingData as any).checkInDate || bookingData.date} - {(bookingData as any).checkOutDate || bookingData.date}
                    </p>
                    <p className="text-gray-600 text-sm">{(bookingData as any).duration || '1 night'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-700 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-700">Property Location</p>
                    <p className="text-gray-900">{(bookingData as any).property?.location || bookingData.address.label}</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-700 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700">Scheduled Date & Time</p>
                    <p className="text-gray-900">{bookingData.date} at {bookingData.time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-700 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-700">Service Address</p>
                    <p className="text-gray-900">{bookingData.address.label}</p>
                    <p className="text-gray-600 text-sm">
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
          <div className="mb-6 p-4 bg-gray-50 border-2 border-gray-200 rounded-xl">
            <h3 className="text-gray-900 mb-3">Check-in Instructions</h3>
            <p className="text-gray-600 leading-relaxed">
              {(bookingData as any).property?.checkInInstructions}
            </p>
          </div>
        )}

        {/* Demo Status Changer (for testing) */}
        <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
          <p className="text-gray-900 mb-2 text-sm">Demo: Change Status</p>
          <div className="flex gap-2">
            <button
              onClick={() => handleStatusChange('accepted')}
              className={`flex-1 py-2 rounded-lg text-sm ${
                currentStatus === 'accepted' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-white text-gray-900 border-2 border-gray-300'
              }`}
            >
              Accepted
            </button>
            <button
              onClick={() => handleStatusChange('in-progress')}
              className={`flex-1 py-2 rounded-lg text-sm ${
                currentStatus === 'in-progress' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-white text-gray-900 border-2 border-gray-300'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => handleStatusChange('completed')}
              className={`flex-1 py-2 rounded-lg text-sm ${
                currentStatus === 'completed' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-white text-gray-900 border-2 border-gray-300'
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* View Invoice (if completed) */}
        {currentStatus === 'completed' && onViewInvoice && (
          <button
            onClick={onViewInvoice}
            className="w-full py-4 bg-gray-100 text-gray-900 rounded-xl mb-3"
          >
            View Invoice
          </button>
        )}

        {/* Reorder Service (if completed) */}
        {currentStatus === 'completed' && onReorder && (
          <button
            onClick={onReorder}
            className="w-full py-4 bg-gray-900 text-white rounded-xl mb-3"
          >
            Reorder Service
          </button>
        )}

        {/* Leave a Review (if completed and no review yet) */}
        {currentStatus === 'completed' && !bookingData.hasReview && (
          <button
            onClick={() => onRequestReview(bookingData)}
            className="w-full py-4 bg-gray-900 text-white rounded-xl"
          >
            Leave a Review
          </button>
        )}

        {/* Already Reviewed (if completed and has review) */}
        {currentStatus === 'completed' && bookingData.hasReview && (
          <div className="w-full py-4 border-2 border-gray-300 text-gray-600 rounded-xl text-center">
            ✓ Review Submitted
          </div>
        )}
      </div>
    </div>
  );
}