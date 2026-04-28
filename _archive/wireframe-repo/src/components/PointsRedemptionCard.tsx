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
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl overflow-hidden">
      {/* Header with toggle */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Coins className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-green-800">Redeem Points</p>
            <p className="text-sm text-green-600">{availablePoints.toLocaleString()} pts available</p>
          </div>
        </div>

        {/* Toggle Switch */}
        <button
          onClick={handleToggle}
          className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
            enabled ? 'bg-green-500' : 'bg-gray-300'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
              enabled ? 'translate-x-6' : 'translate-x-0'
            }`}
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
              className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-500"
              style={{
                background: `linear-gradient(to right, #22c55e ${(selectedPoints / effectiveMaxPoints) * 100}%, #bbf7d0 ${(selectedPoints / effectiveMaxPoints) * 100}%)`
              }}
            />
            <div className="flex justify-between text-xs text-green-600">
              <span>0 pts</span>
              <span>{effectiveMaxPoints.toLocaleString()} pts</span>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white/60 rounded-lg p-3 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm text-green-700">Using:</span>
              <div className="text-right">
                <span className="font-semibold text-green-800">{selectedPoints.toLocaleString()} pts</span>
                <span className="ml-2 text-green-600 font-medium">-${discountAmount}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-green-700">Remaining balance:</span>
              <span className="text-sm text-green-600">{remainingBalance.toLocaleString()} pts</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PointsRedemptionCard;
