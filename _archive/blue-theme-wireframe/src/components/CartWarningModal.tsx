import { AlertTriangle } from 'lucide-react';

interface CartWarningModalProps {
  currentVendorName: string;
  newVendorName: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function CartWarningModal({
  currentVendorName,
  newVendorName,
  onCancel,
  onConfirm
}: CartWarningModalProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-6 relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />

      <div className="relative z-10 text-center max-w-sm animate-scale-in">
        {/* Icon */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto shadow-premium-md"
          style={{ background: 'linear-gradient(135deg, rgb(251, 191, 36), rgb(245, 158, 11))' }}
        >
          <AlertTriangle className="w-10 h-10 text-white" strokeWidth={2} />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>Replace cart items?</h2>

        {/* Message */}
        <p className="mb-8" style={{ color: 'var(--muted-foreground)' }}>
          Your cart contains items from <span className="font-medium" style={{ color: 'var(--foreground)' }}>{currentVendorName}</span>.
          Do you want to discard them and add items from <span className="font-medium" style={{ color: 'var(--foreground)' }}>{newVendorName}</span> instead?
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onConfirm}
            className="w-full py-4 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'var(--primary-gradient)' }}
          >
            Yes, Replace Cart
          </button>
          <button
            onClick={onCancel}
            className="w-full py-4 rounded-xl font-medium transition-all duration-300 hover:shadow-card"
            style={{
              backgroundColor: 'var(--card)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
