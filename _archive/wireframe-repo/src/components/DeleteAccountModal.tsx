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
      className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b-2 border-gray-200 flex items-center justify-between">
          <h3 className="text-gray-900">Delete Account</h3>
          <button onClick={onClose} className="p-2 -mr-2">
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
          </div>
          
          <h4 className="text-gray-900 text-center mb-3">Delete Your Account?</h4>
          <p className="text-gray-600 text-center mb-4">
            This action cannot be undone. All your data will be permanently deleted.
          </p>

          {/* Warning Box */}
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 mb-2">You will lose:</p>
                <ul className="text-red-700 space-y-1">
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
              className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Yes, Delete My Account
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
