import { ArrowLeft, Search, MapPin, Check } from 'lucide-react';
import { useState } from 'react';

interface ManualLocationScreenProps {
  onConfirm: (location: string) => void;
}

const locations = [
  { city: 'New York', country: 'USA', distance: null },
  { city: 'Los Angeles', country: 'USA', distance: null },
  { city: 'London', country: 'UK', distance: null },
  { city: 'Toronto', country: 'Canada', distance: null },
  { city: 'Sydney', country: 'Australia', distance: null },
  { city: 'Tokyo', country: 'Japan', distance: null },
  { city: 'Paris', country: 'France', distance: null },
  { city: 'Dubai', country: 'UAE', distance: null },
];

export function ManualLocationScreen({ onConfirm }: ManualLocationScreenProps) {
  const [selected, setSelected] = useState('');

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
        <div className="flex items-center gap-4 mb-4">
          <div
            className="p-2 rounded-xl"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: 'var(--foreground)' }} strokeWidth={2} />
          </div>
          <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Select Location</h3>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
          <input
            type="text"
            placeholder="Search city or region"
            className="w-full pl-12 pr-4 py-3 rounded-xl outline-none transition-all duration-300 shadow-card focus:shadow-premium-sm"
            style={{
              backgroundColor: 'var(--card)',
              border: '2px solid var(--border)',
              color: 'var(--foreground)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4 relative z-10">
        <div className="mb-4">
          <p className="mb-3" style={{ color: 'var(--muted-foreground)' }}>Popular Cities</p>
          <div className="space-y-3">
            {locations.map((loc, index) => {
              const isSelected = selected === `${loc.city}, ${loc.country}`;
              return (
                <button
                  key={`${loc.city}-${loc.country}`}
                  onClick={() => setSelected(`${loc.city}, ${loc.country}`)}
                  className="w-full p-4 rounded-xl text-left flex items-center gap-3 shadow-card transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.01] active:scale-[0.99]"
                  style={{
                    backgroundColor: isSelected ? 'rgba(46, 122, 217, 0.1)' : 'var(--card)',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                                      }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: isSelected ? 'var(--primary)' : 'rgba(46, 122, 217, 0.1)'
                    }}
                  >
                    {isSelected ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <MapPin className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--foreground)' }}>{loc.city}</p>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{loc.country}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="p-6 glass relative z-10" style={{ borderTop: '1px solid rgba(46, 122, 217, 0.1)' }}>
        <button
          onClick={() => selected && onConfirm(selected)}
          disabled={!selected}
          className="w-full py-4 rounded-xl font-medium transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
          style={{
            background: selected ? 'var(--primary-gradient)' : 'var(--muted)',
            color: selected ? 'white' : 'var(--muted-foreground)'
          }}
        >
          Confirm Location
        </button>
      </div>
    </div>
  );
}
