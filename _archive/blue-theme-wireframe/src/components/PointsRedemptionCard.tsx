import React from 'react';
import { Coins } from 'lucide-react';

interface PointsRedemptionCardProps {
  availablePoints: number;
  selectedPoints: number;
  onPointsChange: (points: number) => void;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  maxRedeemablePoints?: number; // Optional cap based on order total
}

const PointsRedemptionCard: React.FC<PointsRedemptionCardProps> = ({
  availablePoints,
  selectedPoints,
  onPointsChange,
  enabled,
  onToggle,
  maxRedeemablePoints
}) => {
  // Calculate the maximum points that can be redeemed
  // Either the available points or the max redeemable (based on order total), whichever is lower
  const effectiveMaxPoints = maxRedeemablePoints !== undefined
    ? Math.min(availablePoints, maxRedeemablePoints)
    : availablePoints;

  // Calculate dollar value (100 points = $1)
  const discountAmount = (selectedPoints / 100).toFixed(2);
  const remainingBalance = availablePoints - selectedPoints;

  const handleToggle = () => {
    const newEnabled = !enabled;
    onToggle(newEnabled);
    if (!newEnabled) {
      onPointsChange(0);
    } else if (selectedPoints === 0) {
      // When enabling, default to max points
      onPointsChange(effectiveMaxPoints);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onPointsChange(value);
  };

  if (availablePoints <= 0) {
    return null;
  }

  return (
    <div
      className="rounded-xl overflow-hidden shadow-card"
      style={{
        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1))',
        border: '1px solid rgba(34, 197, 94, 0.3)'
      }}
    >
      {/* Header with toggle */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-premium-sm"
            style={{ background: 'linear-gradient(135deg, rgb(34, 197, 94), rgb(16, 185, 129))' }}
          >
            <Coins className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold" style={{ color: 'rgb(22, 101, 52)' }}>Redeem Points</p>
            <p className="text-sm" style={{ color: 'rgb(34, 197, 94)' }}>{availablePoints.toLocaleString()} pts available</p>
          </div>
        </div>

        {/* Toggle Switch */}
        <button
          onClick={handleToggle}
          className="relative w-12 h-6 rounded-full transition-all duration-300 shadow-card"
          style={{
            background: enabled
              ? 'linear-gradient(90deg, rgb(34, 197, 94), rgb(16, 185, 129))'
              : 'var(--muted)'
          }}
        >
          <span
            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-premium-sm transition-transform duration-300"
            style={{
              transform: enabled ? 'translateX(24px)' : 'translateX(0)'
            }}
          />
        </button>
      </div>

      {/* Slider section - only shown when enabled */}
      {enabled && (
        <div className="px-4 pb-4 space-y-3">
          {/* Slider */}
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max={effectiveMaxPoints}
              value={selectedPoints}
              onChange={handleSliderChange}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, rgb(34, 197, 94) ${(selectedPoints / effectiveMaxPoints) * 100}%, rgba(34, 197, 94, 0.2) ${(selectedPoints / effectiveMaxPoints) * 100}%)`
              }}
            />
            <div className="flex justify-between text-xs" style={{ color: 'rgb(34, 197, 94)' }}>
              <span>0 pts</span>
              <span>{effectiveMaxPoints.toLocaleString()} pts</span>
            </div>
          </div>

          {/* Summary */}
          <div
            className="rounded-lg p-3 space-y-1"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
          >
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: 'rgb(21, 128, 61)' }}>Using:</span>
              <div className="text-right">
                <span className="font-semibold" style={{ color: 'rgb(22, 101, 52)' }}>{selectedPoints.toLocaleString()} pts</span>
                <span className="ml-2 font-medium" style={{ color: 'rgb(34, 197, 94)' }}>-${discountAmount}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: 'rgb(21, 128, 61)' }}>Remaining balance:</span>
              <span className="text-sm" style={{ color: 'rgb(34, 197, 94)' }}>{remainingBalance.toLocaleString()} pts</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PointsRedemptionCard;
