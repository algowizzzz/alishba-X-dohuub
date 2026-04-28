import { MapPin } from 'lucide-react';

interface LocationPermissionScreenProps {
  onAllow: () => void;
  onManual: () => void;
}

export function LocationPermissionScreen({ onAllow, onManual }: LocationPermissionScreenProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-8 relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Background pattern */}
      <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />

      <div className="w-32 h-32 rounded-full flex items-center justify-center mb-8 shadow-premium-lg animate-scale-in relative z-10" style={{ backgroundColor: 'var(--icon-surface)' }}>
        <MapPin className="w-16 h-16 animate-float" style={{ color: 'var(--primary)' }} strokeWidth={1.5} />
      </div>

      <h2 className="mb-4 text-center relative z-10" style={{ color: 'var(--foreground)' }}>Enable Location Services</h2>
      <p className="text-center mb-12 max-w-sm relative z-10" style={{ color: 'var(--muted-foreground)' }}>
        DoHuub uses your location to show nearby services and providers
      </p>

      <div className="w-full max-w-sm space-y-4 relative z-10">
        <button
          onClick={onAllow}
          className="w-full text-white py-4 rounded-xl shadow-premium-lg transition-all duration-300 hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: 'var(--primary-gradient)' }}
        >
          Allow Location Access
        </button>
      </div>

      <button
        onClick={onAllow}
        className="mt-8 transition-all duration-200 hover:opacity-80 hover:scale-105 active:scale-95 relative z-10"
        style={{ color: 'var(--primary)' }}
      >
        Skip
      </button>
    </div>
  );
}