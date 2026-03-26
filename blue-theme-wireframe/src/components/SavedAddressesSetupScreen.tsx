import { Home, Briefcase, MapPin, Plus } from 'lucide-react';
import { useState } from 'react';

interface SavedAddressesSetupScreenProps {
  onDone: () => void;
  onSkip: () => void;
  onAddAddress: (type: 'Home' | 'Work' | 'Other') => void;
}

export function SavedAddressesSetupScreen({ onDone, onSkip, onAddAddress }: SavedAddressesSetupScreenProps) {
  const [addresses, setAddresses] = useState<string[]>([]);

  const addressTypes = [
    { type: 'Home' as const, icon: Home, title: 'Home', subtitle: 'Add your home address' },
    { type: 'Work' as const, icon: Briefcase, title: 'Work', subtitle: 'Add your work address' },
    { type: 'Other' as const, icon: MapPin, title: 'Other', subtitle: 'Add another location' },
  ];

  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Background pattern */}
      <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />

      <div className="px-6 py-4 border-b glass relative z-10" style={{ borderColor: 'rgba(46, 122, 217, 0.1)' }}>
        <p className="font-medium" style={{ color: 'var(--primary)' }}>Step 2 of 2</p>
      </div>

      <div className="flex-1 px-8 pt-12 overflow-y-auto relative z-10">
        <h2 className="mb-2" style={{ color: 'var(--foreground)' }}>Add Your Addresses</h2>
        <p className="mb-8" style={{ color: 'var(--muted-foreground)' }}>Save time by adding your frequent locations</p>

        <div className="space-y-3 mb-8">
          {addressTypes.map((addr, index) => {
            const Icon = addr.icon;
            return (
              <button
                key={addr.type}
                className="w-full p-4 rounded-xl flex items-center gap-4 shadow-premium-sm transition-all duration-300 hover:shadow-premium-md hover:scale-[1.02] hover:translate-x-1 active:scale-[0.98] group"
                style={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid rgba(46, 122, 217, 0.08)',
                                  }}
                onClick={() => onAddAddress(addr.type)}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-premium-sm transition-all duration-300 group-hover:shadow-premium-md" style={{ backgroundColor: 'var(--secondary)' }}>
                  <Icon className="w-6 h-6" style={{ color: 'var(--primary)' }} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium" style={{ color: 'var(--foreground)' }}>{addr.title}</p>
                  <p style={{ color: 'var(--muted-foreground)' }}>{addr.subtitle}</p>
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: 'var(--secondary)' }}>
                  <Plus className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6 border-t glass space-y-3 relative z-10" style={{ borderColor: 'rgba(46, 122, 217, 0.1)' }}>
        <button
          onClick={onDone}
          className="w-full py-4 rounded-xl text-white shadow-premium-lg transition-all duration-300 hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: 'var(--primary-gradient)' }}
        >
          Done
        </button>

        <button
          onClick={onSkip}
          className="w-full py-2 transition-all duration-200 hover:opacity-80 hover:scale-105 active:scale-95"
          style={{ color: 'var(--muted-foreground)' }}
        >
          Skip for Now
        </button>
      </div>
    </div>
  );
}