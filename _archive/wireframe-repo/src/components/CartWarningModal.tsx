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
    <div className="h-full bg-white flex flex-col items-center justify-center px-6">
      {/* Icon */}
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8 text-gray-700" />
      </div>

      {/* Title */}
      <h2 className="text-gray-900 text-center mb-3">Replace cart items?</h2>

      {/* Message */}
      <p className="text-gray-600 text-center mb-8 max-w-sm">
        Your cart contains items from <span className="text-gray-900">{currentVendorName}</span>. 
        Do you want to discard them and add items from <span className="text-gray-900">{newVendorName}</span> instead?
      </p>

      {/* Actions */}
      <div className="w-full max-w-sm space-y-3">
        <button
          onClick={onConfirm}
          className="w-full py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800"
        >
          Yes, Replace Cart
        </button>
        <button
          onClick={onCancel}
          className="w-full py-4 bg-white text-gray-900 border-2 border-gray-200 rounded-xl hover:border-gray-800"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}