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

  // Calculate progress to next milestone
  const progressToNext = nextMilestone
    ? Math.min((currentStreak / nextMilestone.weeks) * 100, 100)
    : 100;

  if (compact) {
    // Compact version for HomeDashboard
    return (
      <button
        onClick={onViewDetails}
        className="flex items-center gap-2 px-3 py-2 rounded-full text-white shadow-premium-sm transition-all duration-300 hover:shadow-premium-md hover:scale-[1.02] active:scale-[0.98]"
        style={{ background: 'linear-gradient(90deg, rgb(249, 115, 22), rgb(239, 68, 68))' }}
      >
        <Flame className="w-4 h-4" />
        <span className="font-semibold">{currentStreak}</span>
        <span className="text-white/80 text-sm">week streak</span>
      </button>
    );
  }

  return (
    <div
      className="rounded-xl p-4 shadow-premium-sm"
      style={{
        background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(239, 68, 68, 0.1))',
        border: '1px solid rgba(249, 115, 22, 0.3)'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-premium-sm"
            style={{ background: 'linear-gradient(135deg, rgb(249, 115, 22), rgb(239, 68, 68))' }}
          >
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Activity Streak</h3>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Keep ordering to earn bonus points!</p>
          </div>
        </div>
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="transition-all duration-300 hover:opacity-70"
            style={{ color: 'rgb(249, 115, 22)' }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Current Streak Display */}
      <div className="flex items-center justify-center gap-6 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Flame className="w-8 h-8" style={{ color: 'rgb(249, 115, 22)' }} />
            <span className="text-4xl font-bold" style={{ color: 'var(--foreground)' }}>{currentStreak}</span>
          </div>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Current Streak</p>
        </div>
        <div className="h-12 w-px" style={{ backgroundColor: 'rgba(249, 115, 22, 0.3)' }} />
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Trophy className="w-6 h-6" style={{ color: 'rgb(245, 158, 11)' }} />
            <span className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{longestStreak}</span>
          </div>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Best Streak</p>
        </div>
      </div>

      {/* Progress to Next Milestone */}
      {nextMilestone && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span style={{ color: 'var(--muted-foreground)' }}>Progress to {nextMilestone.weeks} weeks</span>
            <span className="font-medium" style={{ color: 'rgb(249, 115, 22)' }}>+{nextMilestone.points} pts</span>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: 'rgba(249, 115, 22, 0.2)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressToNext}%`,
                background: 'linear-gradient(90deg, rgb(249, 115, 22), rgb(239, 68, 68))'
              }}
            />
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
            {nextMilestone.weeks - currentStreak} more week{nextMilestone.weeks - currentStreak !== 1 ? 's' : ''} to go
          </p>
        </div>
      )}

      {/* Milestone Badges */}
      <div className="flex items-center justify-between">
        {streakMilestones.map((milestone) => (
          <div key={milestone.weeks} className="flex flex-col items-center">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-card"
              style={{
                background: milestone.achieved
                  ? 'linear-gradient(135deg, rgb(249, 115, 22), rgb(239, 68, 68))'
                  : currentStreak >= milestone.weeks
                    ? 'rgba(249, 115, 22, 0.2)'
                    : 'var(--muted)',
                color: milestone.achieved
                  ? 'white'
                  : currentStreak >= milestone.weeks
                    ? 'rgb(194, 65, 12)'
                    : 'var(--muted-foreground)'
              }}
            >
              {milestone.weeks}w
            </div>
            <span
              className="text-xs mt-1"
              style={{
                color: milestone.achieved ? 'rgb(249, 115, 22)' : 'var(--muted-foreground)',
                fontWeight: milestone.achieved ? 500 : 400
              }}
            >
              {milestone.achieved ? `+${milestone.points}` : `${milestone.points} pts`}
            </span>
          </div>
        ))}
      </div>

      {/* Info */}
      <p className="text-xs text-center mt-4" style={{ color: 'var(--muted-foreground)' }}>
        Order from any Powered by DoHuub service each week to maintain your streak
      </p>
    </div>
  );
}
