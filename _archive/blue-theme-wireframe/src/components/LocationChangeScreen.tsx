import { ArrowLeft, Search, MapPin, Navigation } from 'lucide-react';

interface LocationChangeScreenProps {
  currentLocation: string;
  onBack: () => void;
  onSelect: (location: string) => void;
}

const locations = [
  { city: 'New York', country: 'USA', distance: 'Current' },
  { city: 'Los Angeles', country: 'USA', distance: '2,789 km' },
  { city: 'Miami', country: 'USA', distance: '1,759 km' },
  { city: 'London', country: 'UK', distance: '5,585 km' },
  { city: 'Toronto', country: 'Canada', distance: '550 km' },
  { city: 'Sydney', country: 'Australia', distance: '16,014 km' },
];

export function LocationChangeScreen({ currentLocation, onBack, onSelect }: LocationChangeScreenProps) {
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
          <button
            onClick={onBack}
            className="p-2 rounded-xl transition-all duration-300 hover:shadow-card"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: 'var(--foreground)' }} strokeWidth={2} />
          </button>
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
        {/* Current Location Button */}
        <button
          className="w-full p-4 rounded-xl flex items-center gap-3 mb-6 shadow-premium-sm transition-all duration-300 hover:shadow-premium-md hover:scale-[1.01] active:scale-[0.99]"
          style={{
            background: 'linear-gradient(135deg, rgba(46, 122, 217, 0.1), rgba(76, 166, 250, 0.1))',
            border: '2px solid var(--primary)'
          }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-premium-sm"
            style={{ background: 'var(--primary-gradient)' }}
          >
            <Navigation className="w-5 h-5 text-white" />
          </div>
          <p className="font-medium" style={{ color: 'var(--foreground)' }}>Use Current Location</p>
        </button>

        {/* Recent Locations */}
        <p className="mb-3" style={{ color: 'var(--muted-foreground)' }}>
          Recent Locations
        </p>
        <div className="space-y-3">
          {locations.map((loc, index) => (
            <button
              key={`${loc.city}-${loc.country}`}
              onClick={() => onSelect(`${loc.city}, ${loc.country}`)}
              className="w-full p-4 rounded-xl text-left flex items-center gap-3 shadow-card transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.01] active:scale-[0.99]"
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(46, 122, 217, 0.1)' }}
              >
                <MapPin className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              </div>
              <div className="flex-1">
                <p className="font-medium" style={{ color: 'var(--foreground)' }}>{loc.city}</p>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{loc.country}</p>
              </div>
              <p
                className="text-sm px-2 py-1 rounded-full"
                style={{
                  color: loc.distance === 'Current' ? 'rgb(34, 197, 94)' : 'var(--muted-foreground)',
                  backgroundColor: loc.distance === 'Current' ? 'rgba(34, 197, 94, 0.1)' : 'transparent'
                }}
              >
                {loc.distance}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
