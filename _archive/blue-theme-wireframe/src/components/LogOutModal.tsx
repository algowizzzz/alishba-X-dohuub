import { X, LogOut } from 'lucide-react';

interface LogOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogOutModal({ isOpen, onClose, onConfirm }: LogOutModalProps) {
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
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'rgba(46, 122, 217, 0.1)' }}>
          <h3 style={{ color: 'var(--foreground)' }}>Log Out</h3>
          <button onClick={onClose} className="p-2 -mr-2 transition-all duration-200 hover:scale-110 active:scale-95 hover:opacity-80">
            <X className="w-6 h-6" style={{ color: 'var(--muted-foreground)' }} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-premium-md animate-pulse-soft" style={{ backgroundColor: 'var(--secondary)' }}>
              <LogOut className="w-8 h-8" style={{ color: 'var(--primary)' }} />
            </div>
          </div>

          <h4 className="text-center mb-3" style={{ color: 'var(--foreground)' }}>Are you sure you want to log out?</h4>
          <p className="text-center mb-6" style={{ color: 'var(--muted-foreground)' }}>
            You will need to log in again to access your account and bookings.
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={onConfirm}
              className="w-full py-3 text-white rounded-xl shadow-premium-md transition-all duration-300 hover:shadow-premium-lg hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'var(--primary-gradient)' }}
            >
              Yes, Log Out
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
