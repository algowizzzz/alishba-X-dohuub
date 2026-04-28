import { ArrowLeft } from 'lucide-react';
import { Car as PhCar, HandHeart } from '@phosphor-icons/react';
import rideAssistanceImg from '../assets/ride assistance.png';
import companionshipImg from '../assets/companionship.png';

interface CaregivingChoiceScreenProps {
  onBack: () => void;
  onSelectRideAssistance: () => void;
  onSelectCompanionship: () => void;
}

export function CaregivingChoiceScreen({
  onBack,
  onSelectRideAssistance,
  onSelectCompanionship
}: CaregivingChoiceScreenProps) {
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
          <h1 className="font-semibold" style={{ color: 'var(--foreground)' }}>Caregiving Services</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 relative z-10">
        <p className="mb-6" style={{ color: 'var(--muted-foreground)' }}>
          Choose the type of caregiving service you need
        </p>

        <div className="space-y-4">
          {/* Ride Assistance */}
          <button
            onClick={onSelectRideAssistance}
            className="w-full p-6 rounded-xl text-left shadow-card transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.01] active:scale-[0.99]"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-start gap-4">
              <img src={rideAssistanceImg} alt="Ride Assistance" className="w-16 h-16 object-contain flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Ride Assistance</h3>
                <p className="text-sm mb-3" style={{ color: 'var(--muted-foreground)' }}>
                  Professional transportation services with pickup and multiple stops (pharmacy, grocery, appointments)
                </p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgb(168, 85, 247)' }} />
                    <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Hourly rate booking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgb(168, 85, 247)' }} />
                    <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Multiple stops available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgb(168, 85, 247)' }} />
                    <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Round-trip option</span>
                  </div>
                </div>
              </div>
            </div>
          </button>

          {/* Companionship Support */}
          <button
            onClick={onSelectCompanionship}
            className="w-full p-6 rounded-xl text-left shadow-card transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.01] active:scale-[0.99]"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-start gap-4">
              <img src={companionshipImg} alt="Companionship" className="w-16 h-16 object-contain flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Companionship Support</h3>
                <p className="text-sm mb-3" style={{ color: 'var(--muted-foreground)' }}>
                  Professional caregivers providing conversation, activities, meal assistance, and daily living support
                </p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgb(236, 72, 153)' }} />
                    <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Flexible duration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgb(236, 72, 153)' }} />
                    <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Personalized care plans</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgb(236, 72, 153)' }} />
                    <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Certified caregivers</span>
                  </div>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
