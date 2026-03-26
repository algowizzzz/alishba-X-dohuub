import { ArrowLeft, AlertCircle, Check } from 'lucide-react';
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
    <div className="h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />

      {/* Header */}
      <div
        className="px-6 py-6 relative z-10"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.06)',
          borderBottom: '1px solid rgba(46, 122, 217, 0.08)',
          borderRadius: '0 0 24px 24px',
        }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-xl transition-all duration-300 hover:shadow-card"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: 'var(--foreground)' }} strokeWidth={2} />
          </button>
          <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Report Listing</h3>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 relative z-10">
        {/* Info Banner */}
        <div
          className="flex items-start gap-3 p-4 rounded-xl mb-6 shadow-card"
          style={{
            background: 'linear-gradient(135deg, rgba(46, 122, 217, 0.1), rgba(76, 166, 250, 0.1))',
            border: '1px solid rgba(46, 122, 217, 0.2)'
          }}
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--primary)' }} />
          <p style={{ color: 'var(--muted-foreground)' }}>
            Help us understand what's wrong with this listing. We'll review it within 24 hours.
          </p>
        </div>

        {/* Reason Selection */}
        <div className="mb-6">
          <p className="font-medium mb-3" style={{ color: 'var(--foreground)' }}>Select a reason *</p>
          <div className="space-y-3">
            {reasons.map((reason, index) => {
              const isSelected = selectedReason === reason;
              return (
                <button
                  key={reason}
                  onClick={() => setSelectedReason(reason)}
                  className="w-full p-4 rounded-xl text-left shadow-card transition-all duration-300 hover:shadow-premium-sm"
                  style={{
                    backgroundColor: isSelected ? 'rgba(46, 122, 217, 0.1)' : 'var(--card)',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                                      }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300"
                      style={{
                        backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                        border: isSelected ? 'none' : '2px solid var(--border)'
                      }}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <span style={{ color: 'var(--foreground)' }}>{reason}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Additional Details */}
        <div className="">
          <label className="block font-medium mb-2" style={{ color: 'var(--foreground)' }}>
            Additional details (optional)
          </label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Provide any additional information that might help us understand the issue..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl resize-none outline-none transition-all duration-300 shadow-card focus:shadow-premium-sm"
            style={{
              backgroundColor: 'var(--input-background)',
              border: '2px solid var(--border)',
              color: 'var(--foreground)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
          />
          <p className="mt-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>{details.length}/500</p>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-6 space-y-3 glass relative z-10" style={{ borderTop: '1px solid rgba(46, 122, 217, 0.1)' }}>
        <button
          onClick={handleSubmit}
          disabled={!selectedReason}
          className="w-full py-4 rounded-xl font-medium transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
          style={{
            background: selectedReason ? 'var(--primary-gradient)' : 'var(--muted)',
            color: selectedReason ? 'white' : 'var(--muted-foreground)'
          }}
        >
          Submit Report
        </button>
        <button
          onClick={onBack}
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
  );
}
