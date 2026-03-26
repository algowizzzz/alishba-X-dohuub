import { X, Trash2, AlertTriangle } from 'lucide-react';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteAccountModal({ isOpen, onClose, onConfirm }: DeleteAccountModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="absolute inset-0 backdrop-blur-modal flex items-center justify-center z-50 p-6"
      onClick={onClose}
    >
      <div
        className="rounded-2xl w-full max-w-sm glass shadow-premium-xl animate-scale-in"
        style={{ border: '1px solid rgba(255, 255, 255, 0.5)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}>
          <h3 style={{ color: 'var(--foreground)' }}>Delete Account</h3>
          <button onClick={onClose} className="p-2 -mr-2 transition-all duration-200 hover:scale-110 active:scale-95 hover:opacity-80">
            <X className="w-6 h-6" style={{ color: 'var(--muted-foreground)' }} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-premium-md animate-pulse-soft" style={{ backgroundColor: '#FEE2E2' }}>
              <Trash2 className="w-8 h-8" style={{ color: 'var(--destructive)' }} />
            </div>
          </div>

          <h4 className="text-center mb-3" style={{ color: 'var(--foreground)' }}>Delete Your Account?</h4>
          <p className="text-center mb-4" style={{ color: 'var(--muted-foreground)' }}>
            This action cannot be undone. All your data will be permanently deleted.
          </p>

          {/* Warning Box */}
          <div className="rounded-xl p-4 mb-6 shadow-premium-sm" style={{ backgroundColor: 'rgba(254, 226, 226, 0.8)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--destructive)' }} />
              <div>
                <p className="mb-2" style={{ color: '#991B1B' }}>You will lose:</p>
                <ul className="space-y-1" style={{ color: '#B91C1C' }}>
                  <li>• All your saved addresses</li>
                  <li>• Payment methods</li>
                  <li>• Order history</li>
                  <li>• Bookings and preferences</li>
                  <li>• Account information</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={onConfirm}
              className="w-full py-3 text-white rounded-xl shadow-premium-md transition-all duration-300 hover:shadow-premium-lg hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: 'var(--destructive)' }}
            >
              Yes, Delete My Account
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl shadow-premium-sm transition-all duration-300 hover:shadow-premium-md hover:scale-[1.01] active:scale-[0.99]"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', color: 'var(--foreground)' }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
