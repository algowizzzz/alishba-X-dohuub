import { Target, CheckCircle2, ChevronRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface Milestone {
  target: number;
  points: number;
  achieved: boolean;
}

interface CategoryMilestoneData {
  orderCount: number;
  milestones: Milestone[];
}

interface MilestoneProgressCardProps {
  category: string;
  categoryLabel: string;
  categoryIcon?: string;
  milestoneData: CategoryMilestoneData;
  compact?: boolean;
  onViewDetails?: () => void;
}

// Category display names and icons
const categoryConfig: { [key: string]: { label: string; icon: string } } = {
  cleaning: { label: 'Cleaning Services', icon: '🧹' },
  handyman: { label: 'Handyman Services', icon: '🔧' },
  food: { label: 'Food Delivery', icon: '🍔' },
  grocery: { label: 'Grocery Delivery', icon: '🛒' },
  beauty: { label: 'Beauty Services', icon: '💅' },
  rental: { label: 'Rental Properties', icon: '🏠' },
  caregiving: { label: 'Caregiving Services', icon: '❤️' }
};

export function MilestoneProgressCard({
  category,
  categoryLabel,
  categoryIcon,
  milestoneData,
  compact = false,
  onViewDetails
}: MilestoneProgressCardProps) {
  const { orderCount, milestones } = milestoneData;
  const config = categoryConfig[category] || { label: categoryLabel, icon: '📦' };
  const displayIcon = categoryIcon || config.icon;
  const displayLabel = categoryLabel || config.label;

  // Find next milestone
  const nextMilestone = milestones.find(m => !m.achieved);
  const achievedCount = milestones.filter(m => m.achieved).length;

  // Calculate progress to next milestone
  const progressToNext = nextMilestone
    ? Math.min((orderCount / nextMilestone.target) * 100, 100)
    : 100;

  if (compact) {
    // Compact version for lists
    return (
      <button
        onClick={onViewDetails}
        className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{displayIcon}</span>
          <div className="text-left">
            <p className="font-medium text-gray-900">{displayLabel}</p>
            <p className="text-sm text-gray-600">{orderCount} orders • {achievedCount}/4 milestones</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {nextMilestone && (
            <span className="text-sm text-amber-600 font-medium">
              {nextMilestone.target - orderCount} to next
            </span>
          )}
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </button>
    );
  }

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{displayIcon}</span>
          <div>
            <h4 className="font-semibold text-gray-900">{displayLabel}</h4>
            <p className="text-sm text-gray-600">{orderCount} orders completed</p>
          </div>
        </div>
        {achievedCount > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-xs font-medium text-green-700">{achievedCount}/4</span>
          </div>
        )}
      </div>

      {/* Progress to Next Milestone */}
      {nextMilestone && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">
              {orderCount}/{nextMilestone.target} orders
            </span>
            <span className="font-medium text-amber-600">+{nextMilestone.points} pts</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${progressToNext}%` }}
            />
          </div>
        </div>
      )}

      {/* Milestone Badges */}
      <div className="flex items-center justify-between">
        {milestones.map((milestone, index) => (
          <div key={milestone.target} className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
              milestone.achieved
                ? 'bg-gradient-to-br from-amber-400 to-orange-500 border-amber-500 text-white'
                : orderCount >= milestone.target
                  ? 'bg-amber-100 border-amber-300 text-amber-700'
                  : 'bg-gray-50 border-gray-200 text-gray-400'
            }`}>
              {milestone.achieved ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                milestone.target
              )}
            </div>
            <span className={`text-xs mt-1 ${
              milestone.achieved ? 'text-amber-600 font-medium' : 'text-gray-400'
            }`}>
              {milestone.achieved ? `+${milestone.points}` : `${milestone.points} pts`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Summary card for all milestones with expandable accordion
interface MilestoneSummaryCardProps {
  categoryMilestones: { [category: string]: CategoryMilestoneData };
}

export function MilestoneSummaryCard({
  categoryMilestones
}: MilestoneSummaryCardProps) {
  // Track which category is expanded (only one at a time)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Calculate totals
  const totalAchieved = Object.values(categoryMilestones).reduce(
    (sum, cat) => sum + cat.milestones.filter(m => m.achieved).length,
    0
  );
  const totalMilestones = Object.keys(categoryMilestones).length * 4;
  const totalPointsEarned = Object.values(categoryMilestones).reduce(
    (sum, cat) => sum + cat.milestones.filter(m => m.achieved).reduce((s, m) => s + m.points, 0),
    0
  );

  const toggleCategory = (key: string) => {
    setExpandedCategory(prev => prev === key ? null : key);
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
          <Target className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Category Milestones</h3>
          <p className="text-sm text-gray-600">Complete orders to earn bonus points</p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-around mb-4 p-3 bg-white/50 rounded-lg">
        <div className="text-center">
          <p className="text-2xl font-bold text-amber-600">{totalAchieved}</p>
          <p className="text-xs text-gray-600">Achieved</p>
        </div>
        <div className="h-8 w-px bg-amber-200" />
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-700">{totalMilestones - totalAchieved}</p>
          <p className="text-xs text-gray-600">Remaining</p>
        </div>
        <div className="h-8 w-px bg-amber-200" />
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">+{totalPointsEarned}</p>
          <p className="text-xs text-gray-600">Pts Earned</p>
        </div>
      </div>

      {/* Category Accordion List */}
      <div className="space-y-2">
        {Object.entries(categoryMilestones).map(([key, data]) => {
          const config = categoryConfig[key];
          const achieved = data.milestones.filter(m => m.achieved).length;
          const isExpanded = expandedCategory === key;
          const nextMilestone = data.milestones.find(m => !m.achieved);
          const progressToNext = nextMilestone
            ? Math.min((data.orderCount / nextMilestone.target) * 100, 100)
            : 100;

          return (
            <div key={key} className="overflow-hidden">
              {/* Category Header Row */}
              <button
                onClick={() => toggleCategory(key)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                  isExpanded
                    ? 'bg-white border border-amber-300'
                    : 'hover:bg-white/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{config?.icon}</span>
                  <span className="text-sm font-medium text-gray-900">{config?.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[0, 1, 2, 3].map(i => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < achieved ? 'bg-amber-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-amber-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="bg-white border border-t-0 border-amber-300 rounded-b-lg p-4 -mt-1">
                  {/* Order Count */}
                  <p className="text-sm text-gray-600 mb-3">
                    {data.orderCount} order{data.orderCount !== 1 ? 's' : ''} completed
                  </p>

                  {/* Progress to Next Milestone */}
                  {nextMilestone && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">
                          {data.orderCount}/{nextMilestone.target} orders
                        </span>
                        <span className="font-medium text-amber-600">+{nextMilestone.points} pts</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                          style={{ width: `${progressToNext}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {nextMilestone.target - data.orderCount} more order{nextMilestone.target - data.orderCount !== 1 ? 's' : ''} to unlock
                      </p>
                    </div>
                  )}

                  {/* All milestones completed */}
                  {!nextMilestone && (
                    <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-700">All milestones completed!</span>
                      </div>
                    </div>
                  )}

                  {/* Milestone Badges */}
                  <div className="flex items-center justify-between">
                    {data.milestones.map((milestone) => (
                      <div key={milestone.target} className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                          milestone.achieved
                            ? 'bg-gradient-to-br from-amber-400 to-orange-500 border-amber-500 text-white'
                            : data.orderCount >= milestone.target
                              ? 'bg-amber-100 border-amber-300 text-amber-700'
                              : 'bg-gray-50 border-gray-200 text-gray-400'
                        }`}>
                          {milestone.achieved ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            milestone.target
                          )}
                        </div>
                        <span className={`text-xs mt-1 ${
                          milestone.achieved ? 'text-amber-600 font-medium' : 'text-gray-400'
                        }`}>
                          {milestone.achieved ? `+${milestone.points}` : `${milestone.points} pts`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
