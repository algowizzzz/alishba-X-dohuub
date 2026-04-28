import { Flame, Trophy, ChevronRight } from 'lucide-react';

interface StreakMilestone {
  weeks: number;
  points: number;
  achieved: boolean;
}

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  streakMilestones: StreakMilestone[];
  compact?: boolean;
  onViewDetails?: () => void;
}

export default function StreakCard({
  currentStreak,
  longestStreak,
  streakMilestones,
  compact = false,
  onViewDetails
}: StreakCardProps) {
  // Find next milestone
  const nextMilestone = streakMilestones.find(m => !m.achieved);
  const achievedMilestones = streakMilestones.filter(m => m.achieved).length;

  // Calculate progress to next milestone
  const progressToNext = nextMilestone
    ? Math.min((currentStreak / nextMilestone.weeks) * 100, 100)
    : 100;

  if (compact) {
    // Compact version for HomeDashboard
    return (
      <button
        onClick={onViewDetails}
        className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-white"
      >
        <Flame className="w-4 h-4" />
        <span className="font-semibold">{currentStreak}</span>
        <span className="text-white/80 text-sm">week streak</span>
      </button>
    );
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Activity Streak</h3>
            <p className="text-sm text-gray-600">Keep ordering to earn bonus points!</p>
          </div>
        </div>
        {onViewDetails && (
          <button onClick={onViewDetails} className="text-orange-600">
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Current Streak Display */}
      <div className="flex items-center justify-center gap-6 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Flame className="w-8 h-8 text-orange-500" />
            <span className="text-4xl font-bold text-gray-900">{currentStreak}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Current Streak</p>
        </div>
        <div className="h-12 w-px bg-orange-200" />
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Trophy className="w-6 h-6 text-amber-500" />
            <span className="text-2xl font-bold text-gray-700">{longestStreak}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Best Streak</p>
        </div>
      </div>

      {/* Progress to Next Milestone */}
      {nextMilestone && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Progress to {nextMilestone.weeks} weeks</span>
            <span className="font-medium text-orange-600">+{nextMilestone.points} pts</span>
          </div>
          <div className="h-2 bg-orange-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-500"
              style={{ width: `${progressToNext}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {nextMilestone.weeks - currentStreak} more week{nextMilestone.weeks - currentStreak !== 1 ? 's' : ''} to go
          </p>
        </div>
      )}

      {/* Milestone Badges */}
      <div className="flex items-center justify-between">
        {streakMilestones.map((milestone, index) => (
          <div key={milestone.weeks} className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
              milestone.achieved
                ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white'
                : currentStreak >= milestone.weeks
                  ? 'bg-orange-200 text-orange-700'
                  : 'bg-gray-100 text-gray-400'
            }`}>
              {milestone.weeks}w
            </div>
            <span className={`text-xs mt-1 ${
              milestone.achieved ? 'text-orange-600 font-medium' : 'text-gray-400'
            }`}>
              {milestone.achieved ? `+${milestone.points}` : `${milestone.points} pts`}
            </span>
          </div>
        ))}
      </div>

      {/* Info */}
      <p className="text-xs text-gray-500 text-center mt-4">
        Order from any Powered by DoHuub service each week to maintain your streak
      </p>
    </div>
  );
}
