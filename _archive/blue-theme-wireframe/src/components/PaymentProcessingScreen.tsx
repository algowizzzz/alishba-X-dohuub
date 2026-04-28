import { Loader, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PaymentProcessingScreenProps {
  onComplete: () => void;
}

export function PaymentProcessingScreen({ onComplete }: PaymentProcessingScreenProps) {
  const [status, setStatus] = useState<'processing' | 'success'>('processing');

  useEffect(() => {
    // Show processing for 2 seconds
    const timer = setTimeout(() => {
      setStatus('success');
      // Then navigate after showing success for 1 second
      setTimeout(() => {
        onComplete();
      }, 1000);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="h-full flex flex-col items-center justify-center px-6 relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />

      <div className="text-center relative z-10">
        {status === 'processing' ? (
          <div className="">
            <div className="mb-8 flex justify-center">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center shadow-premium-md"
                style={{ background: 'var(--primary-gradient)' }}
              >
                <Loader className="w-12 h-12 text-white animate-spin" strokeWidth={2} />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Processing Payment</h2>
            <p style={{ color: 'var(--muted-foreground)' }}>Please wait while we process your payment...</p>
          </div>
        ) : (
          <div className="animate-scale-in">
            <div className="mb-8 flex justify-center">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center shadow-premium-md animate-bounce"
                style={{ background: 'linear-gradient(135deg, rgb(34, 197, 94), rgb(22, 163, 74))' }}
              >
                <CheckCircle className="w-12 h-12 text-white" strokeWidth={2} />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Payment Successful</h2>
            <p style={{ color: 'var(--muted-foreground)' }}>Your booking has been confirmed</p>
          </div>
        )}
      </div>
    </div>
  );
}
