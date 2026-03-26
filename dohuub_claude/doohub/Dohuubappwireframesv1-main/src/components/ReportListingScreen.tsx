import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface ReportListingScreenProps {
  onBack: () => void;
  onSubmit: () => void;
}

export function ReportListingScreen({ onBack, onSubmit }: ReportListingScreenProps) {
  const [selectedReason, setSelectedReason] = useState('');
  const [details, setDetails] = useState('');

  const reasons = [
    'Fraudulent or misleading',
    'Inappropriate content',
    'Duplicate listing',
    'Service not available',
    'Other',
  ];

  const handleSubmit = () => {
    if (selectedReason) {
      onSubmit();
    }
  };

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-4 border-b-2 border-gray-200">
        <div className="flex items-center gap-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
          </button>
          <h3 className="text-gray-900">Report Listing</h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="flex items-start gap-3 p-4 bg-gray-100 rounded-lg mb-6">
          <AlertCircle className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
          <p className="text-gray-600">Help us understand what's wrong with this listing. We'll review it within 24 hours.</p>
        </div>

        <div className="mb-6">
          <p className="text-gray-900 mb-3">Select a reason *</p>
          <div className="space-y-2">
            {reasons.map((reason) => (
              <button
                key={reason}
                onClick={() => setSelectedReason(reason)}
                className={`w-full p-4 rounded-lg border-2 text-left ${
                  selectedReason === reason
                    ? 'border-gray-800 bg-gray-100'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedReason === reason
                      ? 'border-gray-800'
                      : 'border-gray-300'
                  }`}>
                    {selectedReason === reason && (
                      <div className="w-3 h-3 rounded-full bg-gray-800"></div>
                    )}
                  </div>
                  <span className="text-gray-800">{reason}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-gray-900 mb-2">Additional details (optional)</label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Provide any additional information that might help us understand the issue..."
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg resize-none"
          />
          <p className="text-gray-500 mt-2">{details.length}/500</p>
        </div>
      </div>

      <div className="p-6 border-t-2 border-gray-200 space-y-3">
        <button
          onClick={handleSubmit}
          disabled={!selectedReason}
          className={`w-full py-4 rounded-lg border-2 ${
            selectedReason
              ? 'bg-gray-800 text-white border-gray-800'
              : 'bg-gray-200 text-gray-400 border-gray-200'
          }`}
        >
          Submit Report
        </button>
        <button onClick={onBack} className="w-full py-4 rounded-lg border-2 border-gray-300 text-gray-700">
          Cancel
        </button>
      </div>
    </div>
  );
}
