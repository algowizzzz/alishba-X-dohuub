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
      className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b-2 border-gray-200 flex items-center justify-between">
          <h3 className="text-gray-900">Log Out</h3>
          <button onClick={onClose} className="p-2 -mr-2">
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <LogOut className="w-8 h-8 text-gray-700" />
            </div>
          </div>
          
          <h4 className="text-gray-900 text-center mb-3">Are you sure you want to log out?</h4>
          <p className="text-gray-600 text-center mb-6">
            You will need to log in again to access your account and bookings.
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={onConfirm}
              className="w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
            >
              Yes, Log Out
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
