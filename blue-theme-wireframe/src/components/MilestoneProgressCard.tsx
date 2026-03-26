import { Target, CheckCircle2, ChevronRight, ChevronDown } from 'lucide-react';
import { Broom, Wrench as PhWrench, Hamburger, ShoppingCart as PhShoppingCart, Scissors as PhScissors, House as PhHouse, HeartStraight, Package } from '@phosphor-icons/react';
import { useState } from 'react';
import type { ReactNode } from 'react';

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
  categoryIcon?: ReactNode;
  milestoneData: CategoryMilestoneData;
  compact?: boolean;
  onViewDetails?: () => void;
}

// Category display names and icons
const categoryConfig: { [key: string]: { label: string; icon: ReactNode } } = {
  cleaning: { label: 'Cleaning Services', icon: <Broom size={20} weight="duotone" /> },
  handyman: { label: 'Handyman Services', icon: <PhWrench size={20} weight="duotone" /> },
  food: { label: 'Food Delivery', icon: <Hamburger size={20} weight="duotone" /> },
  grocery: { label: 'Grocery Delivery', icon: <PhShoppingCart size={20} weight="duotone" /> },
  beauty: { label: 'Beauty Services', icon: <PhScissors size={20} weight="duotone" /> },
  rental: { label: 'Rental Properties', icon: <PhHouse size={20} weight="duotone" /> },
  caregiving: { label: 'Caregiving Services', icon: <HeartStraight size={20} weight="duotone" /> }
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
  const config = categoryConfig[category] || { label: categoryLabel, icon: <Package size={20} weight="duotone" /> };
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
        className="w-full flex items-center justify-between p-4 rounded-xl shadow-card transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.01] active:scale-[0.99]"
        style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center">{displayIcon}</span>
          <div className="text-left">
            <p className="font-medium" style={{ color: 'var(--foreground)' }}>{displayLabel}</p>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{orderCount} orders • {achievedCount}/4 milestones</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {nextMilestone && (
            <span className="text-sm font-medium" style={{ color: 'rgb(245, 158, 11)' }}>
              {nextMilestone.target - orderCount} to next
            </span>
          )}
          <ChevronRight className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
        </div>
      </button>
    );
  }

  return (
    <div
      className="rounded-xl p-4 shadow-card"
      style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center">{displayIcon}</span>
          <div>
            <h4 className="font-semibold" style={{ color: 'var(--foreground)' }}>{displayLabel}</h4>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{orderCount} orders completed</p>
          </div>
        </div>
        {achievedCount > 0 && (
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-full"
            style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}
          >
            <CheckCircle2 className="w-4 h-4" style={{ color: 'rgb(34, 197, 94)' }} />
            <span className="text-xs font-medium" style={{ color: 'rgb(22, 163, 74)' }}>{achievedCount}/4</span>
          </div>
        )}
      </div>

      {/* Progress to Next Milestone */}
      {nextMilestone && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span style={{ color: 'var(--muted-foreground)' }}>
              {orderCount}/{nextMilestone.target} orders
            </span>
            <span className="font-medium" style={{ color: 'rgb(245, 158, 11)' }}>+{nextMilestone.points} pts</span>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: 'var(--muted)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressToNext}%`,
                background: 'linear-gradient(90deg, rgb(245, 158, 11), rgb(249, 115, 22))'
              }}
            />
          </div>
        </div>
      )}

      {/* Milestone Badges */}
      <div className="flex items-center justify-between">
        {milestones.map((milestone) => (
          <div key={milestone.target} className="flex flex-col items-center">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shadow-card"
              style={{
                background: milestone.achieved
                  ? 'linear-gradient(135deg, rgb(245, 158, 11), rgb(249, 115, 22))'
                  : orderCount >= milestone.target
                    ? 'rgba(245, 158, 11, 0.2)'
                    : 'var(--muted)',
                color: milestone.achieved
                  ? 'white'
                  : orderCount >= milestone.target
                    ? 'rgb(180, 83, 9)'
                    : 'var(--muted-foreground)',
                border: milestone.achieved ? 'none' : '2px solid var(--border)'
              }}
            >
              {milestone.achieved ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                milestone.target
              )}
            </div>
            <span
              className="text-xs mt-1"
              style={{
                color: milestone.achieved ? 'rgb(245, 158, 11)' : 'var(--muted-foreground)',
                fontWeight: milestone.achieved ? 500 : 400
              }}
            >
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
    <div
      className="rounded-xl p-4 shadow-premium-sm"
      style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(249, 115, 22, 0.1))',
        border: '1px solid rgba(245, 158, 11, 0.3)'
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shadow-premium-sm"
          style={{ background: 'linear-gradient(135deg, rgb(245, 158, 11), rgb(249, 115, 22))' }}
        >
          <Target className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Category Milestones</h3>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Complete orders to earn bonus points</p>
        </div>
      </div>

      {/* Stats */}
      <div
        className="flex items-center justify-around mb-4 p-3 rounded-lg"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
      >
        <div className="text-center">
          <p className="text-2xl font-bold" style={{ color: 'rgb(245, 158, 11)' }}>{totalAchieved}</p>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Achieved</p>
        </div>
        <div className="h-8 w-px" style={{ backgroundColor: 'rgba(245, 158, 11, 0.3)' }} />
        <div className="text-center">
          <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{totalMilestones - totalAchieved}</p>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Remaining</p>
        </div>
        <div className="h-8 w-px" style={{ backgroundColor: 'rgba(245, 158, 11, 0.3)' }} />
        <div className="text-center">
          <p className="text-2xl font-bold" style={{ color: 'rgb(34, 197, 94)' }}>+{totalPointsEarned}</p>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Pts Earned</p>
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
                className="w-full flex items-center justify-between p-3 rounded-lg transition-all duration-300"
                style={{
                  backgroundColor: isExpanded ? 'var(--card)' : 'transparent',
                  border: isExpanded ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid transparent'
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="flex items-center">{config?.icon}</span>
                  <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{config?.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[0, 1, 2, 3].map(i => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: i < achieved ? 'rgb(245, 158, 11)' : 'var(--muted)'
                        }}
                      />
                    ))}
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" style={{ color: 'rgb(245, 158, 11)' }} />
                  ) : (
                    <ChevronRight className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                  )}
                </div>
              </button>

              {/* Expanded Details */}
              {isExpanded && (
                <div
                  className="p-4 -mt-1 rounded-b-lg"
                  style={{
                    backgroundColor: 'var(--card)',
                    borderLeft: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRight: '1px solid rgba(245, 158, 11, 0.3)',
                    borderBottom: '1px solid rgba(245, 158, 11, 0.3)'
                  }}
                >
                  {/* Order Count */}
                  <p className="text-sm mb-3" style={{ color: 'var(--muted-foreground)' }}>
                    {data.orderCount} order{data.orderCount !== 1 ? 's' : ''} completed
                  </p>

                  {/* Progress to Next Milestone */}
                  {nextMilestone && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span style={{ color: 'var(--muted-foreground)' }}>
                          {data.orderCount}/{nextMilestone.target} orders
                        </span>
                        <span className="font-medium" style={{ color: 'rgb(245, 158, 11)' }}>+{nextMilestone.points} pts</span>
                      </div>
                      <div
                        className="h-2 rounded-full overflow-hidden"
                        style={{ backgroundColor: 'var(--muted)' }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${progressToNext}%`,
                            background: 'linear-gradient(90deg, rgb(245, 158, 11), rgb(249, 115, 22))'
                          }}
                        />
                      </div>
                      <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                        {nextMilestone.target - data.orderCount} more order{nextMilestone.target - data.orderCount !== 1 ? 's' : ''} to unlock
                      </p>
                    </div>
                  )}

                  {/* All milestones completed */}
                  {!nextMilestone && (
                    <div
                      className="mb-4 p-3 rounded-lg"
                      style={{
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid rgba(34, 197, 94, 0.3)'
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" style={{ color: 'rgb(34, 197, 94)' }} />
                        <span className="text-sm font-medium" style={{ color: 'rgb(22, 163, 74)' }}>All milestones completed!</span>
                      </div>
                    </div>
                  )}

                  {/* Milestone Badges */}
                  <div className="flex items-center justify-between">
                    {data.milestones.map((milestone) => (
                      <div key={milestone.target} className="flex flex-col items-center">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shadow-card"
                          style={{
                            background: milestone.achieved
                              ? 'linear-gradient(135deg, rgb(245, 158, 11), rgb(249, 115, 22))'
                              : data.orderCount >= milestone.target
                                ? 'rgba(245, 158, 11, 0.2)'
                                : 'var(--muted)',
                            color: milestone.achieved
                              ? 'white'
                              : data.orderCount >= milestone.target
                                ? 'rgb(180, 83, 9)'
                                : 'var(--muted-foreground)',
                            border: milestone.achieved ? 'none' : '2px solid var(--border)'
                          }}
                        >
                          {milestone.achieved ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            milestone.target
                          )}
                        </div>
                        <span
                          className="text-xs mt-1"
                          style={{
                            color: milestone.achieved ? 'rgb(245, 158, 11)' : 'var(--muted-foreground)',
                            fontWeight: milestone.achieved ? 500 : 400
                          }}
                        >
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
