import { ArrowLeft, Star, Award, Globe, ChevronRight, Gift } from 'lucide-react';
import { User as PhUser } from '@phosphor-icons/react';
import type { Companion } from './CompanionsListScreen';

interface CompanionDetailScreenProps {
  companion: Companion;
  onBack: () => void;
  onBookCompanion: () => void;
  onViewAllReviews?: () => void;
}

export function CompanionDetailScreen({
  companion,
  onBack,
  onBookCompanion,
  onViewAllReviews
}: CompanionDetailScreenProps) {
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
          <h1 className="font-semibold" style={{ color: 'var(--foreground)' }}>Companion Profile</h1>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="px-6 py-6 space-y-6">
          {/* Profile Info */}
          <div className="flex items-start gap-4">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center flex-shrink-0 shadow-premium-md"
              style={{ background: 'linear-gradient(135deg, rgb(236, 72, 153), rgb(219, 39, 119))' }}
            >
              <PhUser size={48} weight="fill" color="#fff" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-xl mb-1" style={{ color: 'var(--foreground)' }}>{companion.name}</h2>
              {companion.isPoweredByDoHuub && (
                <div
                  className="inline-block px-3 py-1 rounded-full text-sm mb-2 text-white shadow-premium-sm"
                  style={{ background: 'var(--primary-gradient)' }}
                >
                  Powered by DoHuub
                </div>
              )}
              <div className="flex items-center gap-2 mt-2 mb-2">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-current" style={{ color: 'rgb(250, 204, 21)' }} />
                  <span className="font-medium" style={{ color: 'var(--foreground)' }}>{companion.rating}</span>
                </div>
                <span style={{ color: 'var(--muted-foreground)' }}>({companion.reviews} reviews)</span>
              </div>
              <p style={{ color: 'var(--muted-foreground)' }}>{companion.yearsExperience} years of experience</p>
            </div>
          </div>

          {/* Pricing */}
          <div
            className="p-4 rounded-xl shadow-card"
            style={{
              background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(219, 39, 119, 0.1))',
              border: '1px solid rgba(236, 72, 153, 0.3)',
              
            }}
          >
            <div className="flex items-center justify-between">
              <span style={{ color: 'var(--muted-foreground)' }}>Hourly Rate</span>
              <span className="text-2xl font-bold" style={{ color: 'rgb(236, 72, 153)' }}>${companion.hourlyRate}/hour</span>
            </div>
          </div>

          {/* Points Earning Banner */}
          {companion.isPoweredByDoHuub && (
            <div
              className="p-4 rounded-xl shadow-premium-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(249, 115, 22, 0.1))',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shadow-premium-sm"
                  style={{ background: 'linear-gradient(135deg, rgb(245, 158, 11), rgb(249, 115, 22))' }}
                >
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold" style={{ color: 'rgb(180, 83, 9)' }}>
                    Earn {companion.hourlyRate} points per hour booked
                  </p>
                  <p className="text-sm" style={{ color: 'rgb(217, 119, 6)' }}>
                    1 point per $1 spent • Points added after service completion
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Bio */}
          <div className="">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>About</h3>
            <p style={{ color: 'var(--muted-foreground)' }}>{companion.bio}</p>
          </div>

          {/* Certifications */}
          <div className="">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Certifications & Training</h3>
            <div className="space-y-2">
              {companion.certifications.map((cert, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-xl shadow-card"
                  style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
                >
                  <Award className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'rgb(236, 72, 153)' }} />
                  <span style={{ color: 'var(--foreground)' }}>{cert}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Specialties */}
          <div className="">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {companion.specialties.map(specialty => (
                <span
                  key={specialty}
                  className="px-3 py-2 rounded-xl text-sm"
                  style={{ backgroundColor: 'rgba(236, 72, 153, 0.1)', color: 'rgb(219, 39, 119)' }}
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Languages</h3>
            <div
              className="flex items-start gap-3 p-4 rounded-xl shadow-card"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <Globe className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'rgb(236, 72, 153)' }} />
              <span style={{ color: 'var(--foreground)' }}>{companion.languages.join(', ')}</span>
            </div>
          </div>

          {/* Reviews */}
          <div className="">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Reviews</h3>
              <button
                onClick={onViewAllReviews}
                className="flex items-center gap-1 text-sm transition-all duration-300 hover:opacity-70"
                style={{ color: 'rgb(236, 72, 153)' }}
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Review 1 */}
              <div
                className="p-4 rounded-xl shadow-card"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium" style={{ color: 'var(--foreground)' }}>Emily R.</span>
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>1 week ago</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-current" style={{ color: 'rgb(250, 204, 21)' }} />
                  ))}
                </div>
                <p className="text-sm mb-3" style={{ color: 'var(--muted-foreground)' }}>
                  {companion.name} is wonderful! Very caring and attentive to my mother's needs. Highly recommend.
                </p>
                {/* Review Images */}
                <div className="flex gap-2">
                  <div className="w-20 h-20 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--muted)' }}>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Photo</span>
                  </div>
                  <div className="w-20 h-20 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--muted)' }}>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Photo</span>
                  </div>
                </div>
              </div>

              {/* Review 2 */}
              <div
                className="p-4 rounded-xl shadow-card"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium" style={{ color: 'var(--foreground)' }}>David L.</span>
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>2 weeks ago</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-current" style={{ color: 'rgb(250, 204, 21)' }} />
                  ))}
                </div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Professional and compassionate. My father really enjoys the time spent together.
                </p>
              </div>

              {/* Review 3 */}
              <div
                className="p-4 rounded-xl shadow-card"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium" style={{ color: 'var(--foreground)' }}>Carol B.</span>
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>3 weeks ago</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-current" style={{ color: 'rgb(250, 204, 21)' }} />
                  ))}
                  <Star className="w-4 h-4" style={{ color: 'var(--muted)' }} />
                </div>
                <p className="text-sm mb-3" style={{ color: 'var(--muted-foreground)' }}>
                  Very good service. Could improve on communication timing.
                </p>
                {/* Review Images */}
                <div className="flex gap-2">
                  <div className="w-20 h-20 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--muted)' }}>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Photo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Spacing */}
          <div className="h-20" />
        </div>
      </div>

      {/* Sticky Bottom Button */}
      <div className="p-6 glass relative z-10" style={{ borderTop: '1px solid rgba(46, 122, 217, 0.1)' }}>
        <button
          onClick={onBookCompanion}
          className="w-full py-4 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, rgb(236, 72, 153), rgb(219, 39, 119))' }}
        >
          Book Companion
        </button>
      </div>
    </div>
  );
}
