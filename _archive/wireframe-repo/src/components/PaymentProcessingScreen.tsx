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
    <div className="h-full bg-white flex flex-col items-center justify-center px-6">
      <div className="text-center">
        {status === 'processing' ? (
          <>
            <div className="mb-6 flex justify-center">
              <Loader className="w-20 h-20 text-gray-900 animate-spin" strokeWidth={2} />
            </div>
            <h2 className="text-gray-900 mb-2">Processing Payment</h2>
            <p className="text-gray-600">Please wait while we process your payment...</p>
          </>
        ) : (
          <>
            <div className="mb-6 flex justify-center">
              <CheckCircle className="w-20 h-20 text-gray-900" strokeWidth={2} />
            </div>
            <h2 className="text-gray-900 mb-2">Payment Successful</h2>
            <p className="text-gray-600">Your booking has been confirmed</p>
          </>
        )}
      </div>
    </div>
  );
}
