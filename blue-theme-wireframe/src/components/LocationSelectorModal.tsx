import { MapPin, X, Plus } from 'lucide-react';
import type { Screen } from '../App';

export interface Address {
  id: string | number;
  label: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  type: 'home' | 'work' | 'other';
  isDefault: boolean;
}

interface LocationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: Address[];
  selectedAddressId: string;
  onSelectAddress: (addressId: string) => void;
  onAddAddress: () => void;
}

export function LocationSelectorModal({
  isOpen,
  onClose,
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddAddress
}: LocationSelectorModalProps) {
  if (!isOpen) return null;

  const handleSelectAddress = (addressId: string | number) => {
    onSelectAddress(addressId.toString());
    onClose();
  };

  return (
    <div className="absolute inset-0 backdrop-blur-modal flex items-end z-50">
      <div className="w-full rounded-t-3xl max-h-[80vh] flex flex-col glass shadow-premium-xl animate-slide-up" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.5)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'rgba(46, 122, 217, 0.1)' }}>
          <h2 style={{ color: 'var(--foreground)' }}>Select Service Location</h2>
          <button onClick={onClose} className="p-2 transition-all duration-200 hover:scale-110 active:scale-95 hover:opacity-80">
            <X className="w-6 h-6" style={{ color: 'var(--muted-foreground)' }} />
          </button>
        </div>

        {/* Address List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {addresses.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--primary)' }} />
              <p className="mb-2" style={{ color: 'var(--foreground)' }}>No saved addresses</p>
              <p className="mb-6" style={{ color: 'var(--muted-foreground)' }}>Add an address to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((address) => {
                const isSelected = selectedAddressId === address.id.toString();
                return (
                  <button
                    key={address.id}
                    onClick={() => handleSelectAddress(address.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all duration-300 shadow-premium-sm hover:shadow-premium-md ${isSelected ? 'accent-border-left' : ''}`}
                    style={{
                      border: isSelected ? '2px solid var(--primary)' : '1px solid rgba(46, 122, 217, 0.1)',
                      backgroundColor: isSelected ? 'var(--secondary)' : 'rgba(255, 255, 255, 0.5)'
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 mt-1" style={{ color: isSelected ? 'var(--primary)' : 'var(--muted-foreground)' }} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p style={{ color: 'var(--foreground)' }}>{address.label}</p>
                          {address.isDefault && (
                            <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}>
                              Default
                            </span>
                          )}
                          {isSelected && (
                            <span className="ml-auto" style={{ color: 'var(--primary)' }}>✓</span>
                          )}
                        </div>
                        <p style={{ color: 'var(--muted-foreground)' }}>
                          {address.street}
                          {address.apartment && `, ${address.apartment}`}
                        </p>
                        <p style={{ color: 'var(--muted-foreground)' }}>
                          {address.city}, {address.state} {address.zipCode}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Add New Address Button */}
        <div className="px-6 py-4 border-t" style={{ borderColor: 'rgba(46, 122, 217, 0.1)' }}>
          <button
            onClick={() => {
              onAddAddress();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl shadow-premium-md transition-all duration-300 hover:shadow-premium-lg hover:scale-[1.02] active:scale-[0.98] text-white"
            style={{ background: 'var(--primary-gradient)' }}
          >
            <Plus className="w-5 h-5" />
            <span>Add New Address</span>
          </button>
        </div>
      </div>
    </div>
  );
}