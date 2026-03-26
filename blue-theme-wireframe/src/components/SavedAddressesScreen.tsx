import { ArrowLeft, Home, Briefcase, MapPin, Edit, Trash2, Plus, Star } from 'lucide-react';
import { Address } from './AddAddressScreen';

interface SavedAddressesScreenProps {
  onBack: () => void;
  addresses: Address[];
  onAddAddress: () => void;
  onEditAddress: (address: Address) => void;
  onDeleteAddress: (id: number) => void;
  onSetDefault: (id: number) => void;
}

export function SavedAddressesScreen({ onBack, addresses, onAddAddress, onEditAddress, onDeleteAddress, onSetDefault }: SavedAddressesScreenProps) {
  const getIcon = (type: 'Home' | 'Work' | 'Other') => {
    switch (type) {
      case 'Home': return Home;
      case 'Work': return Briefcase;
      case 'Other': return MapPin;
    }
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Background pattern */}
      <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />

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
          <button onClick={onBack} className="transition-all duration-200 hover:opacity-80 hover:-translate-x-1">
            <ArrowLeft className="w-6 h-6" style={{ color: 'var(--foreground)' }} strokeWidth={2} />
          </button>
          <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Saved Addresses</h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 relative z-10">
        {addresses.length > 0 ? (
          <div className="space-y-4 mb-6">
            {addresses.map((addr, index) => {
              const Icon = getIcon(addr.type);
              return (
                <div
                  key={addr.id}
                  className={`p-4 rounded-xl shadow-card transition-all duration-300 hover:shadow-premium-sm ${addr.isDefault ? 'accent-border-left' : ''}`}
                  style={{
                    backgroundColor: 'var(--card)',
                                      }}
                >
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-premium-sm" style={{ backgroundColor: 'var(--secondary)' }}>
                      <Icon className="w-6 h-6" style={{ color: 'var(--primary)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p style={{ color: 'var(--foreground)' }}>{addr.label}</p>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 text-white text-xs rounded-full shadow-premium-sm" style={{ background: 'var(--primary-gradient)' }}>Default</span>
                        )}
                      </div>
                      <p style={{ color: 'var(--muted-foreground)' }}>{addr.fullAddress}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => onEditAddress(addr)}
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                        style={{ backgroundColor: 'var(--secondary)' }}
                      >
                        <Edit className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                      </button>
                      <button
                        onClick={() => onDeleteAddress(addr.id)}
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                        style={{ backgroundColor: 'var(--secondary)' }}
                      >
                        <Trash2 className="w-5 h-5" style={{ color: 'var(--destructive)' }} />
                      </button>
                      <button
                        onClick={() => onSetDefault(addr.id)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 ${
                          addr.isDefault ? '' : ''
                        }`}
                        style={{
                          background: addr.isDefault ? 'var(--primary-gradient)' : 'var(--secondary)',
                        }}
                        disabled={addr.isDefault}
                      >
                        <Star className={`w-5 h-5 ${addr.isDefault ? 'text-white fill-white' : ''}`} style={{ color: addr.isDefault ? 'white' : 'var(--muted-foreground)' }} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-premium-lg" style={{ backgroundColor: 'var(--secondary)' }}>
              <MapPin className="w-10 h-10" style={{ color: 'var(--muted-foreground)', opacity: 0.5 }} />
            </div>
            <p className="mb-2" style={{ color: 'var(--muted-foreground)' }}>No saved addresses yet</p>
            <p style={{ color: 'var(--muted-foreground)', opacity: 0.7 }}>Add your frequently used addresses for faster booking</p>
          </div>
        )}

        <button
          onClick={onAddAddress}
          className="w-full p-4 border-2 border-dashed rounded-xl flex items-center justify-center gap-3 transition-all duration-300 hover:border-[var(--primary)] hover:shadow-card"
          style={{ borderColor: 'var(--border)' }}
        >
          <Plus className="w-6 h-6" style={{ color: 'var(--primary)' }} />
          <span style={{ color: 'var(--foreground)' }}>Add New Address</span>
        </button>
      </div>
    </div>
  );
}
