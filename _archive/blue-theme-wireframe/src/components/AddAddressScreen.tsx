import { useState } from 'react';
import { ArrowLeft, Home, Briefcase, MapPin } from 'lucide-react';

export interface Address {
  id: number;
  type: 'Home' | 'Work' | 'Other';
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  fullAddress: string;
  isDefault?: boolean;
}

interface AddAddressScreenProps {
  onBack: () => void;
  onSave: (address: Omit<Address, 'id'>) => void;
  defaultType?: 'Home' | 'Work' | 'Other';
}

export function AddAddressScreen({ onBack, onSave, defaultType }: AddAddressScreenProps) {
  const [addressType, setAddressType] = useState<'Home' | 'Work' | 'Other'>(defaultType || 'Home');
  const [label, setLabel] = useState(defaultType || 'Home');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (street && city && state && zipCode && country) {
      const fullAddress = `${street}, ${city}, ${state} ${zipCode}, ${country}`;
      onSave({
        type: addressType,
        label,
        street,
        city,
        state,
        zipCode,
        country,
        fullAddress
      });
    }
  };

  const isFormValid = street && city && state && zipCode && country;

  const inputClass = (field: string) => `w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 ${
    focusedField === field ? 'shadow-glow' : 'shadow-card'
  }`;

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
          <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Add Address</h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-32 relative z-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Address Type Selection */}
          <div className="">
            <label className="block mb-3" style={{ color: 'var(--foreground)' }}>Address Type</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => {
                  setAddressType('Home');
                  if (label === addressType) setLabel('Home');
                }}
                className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all duration-300 ${
                  addressType === 'Home' ? 'shadow-glow' : 'shadow-card hover:shadow-premium-sm'
                }`}
                style={{
                  backgroundColor: addressType === 'Home' ? 'var(--secondary)' : 'var(--card)',
                  border: addressType === 'Home' ? '2px solid var(--primary)' : '2px solid var(--border)'
                }}
              >
                <Home className="w-6 h-6" style={{ color: addressType === 'Home' ? 'var(--primary)' : 'var(--muted-foreground)' }} />
                <span style={{ color: addressType === 'Home' ? 'var(--primary)' : 'var(--muted-foreground)' }}>Home</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAddressType('Work');
                  if (label === addressType) setLabel('Work');
                }}
                className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all duration-300 ${
                  addressType === 'Work' ? 'shadow-glow' : 'shadow-card hover:shadow-premium-sm'
                }`}
                style={{
                  backgroundColor: addressType === 'Work' ? 'var(--secondary)' : 'var(--card)',
                  border: addressType === 'Work' ? '2px solid var(--primary)' : '2px solid var(--border)'
                }}
              >
                <Briefcase className="w-6 h-6" style={{ color: addressType === 'Work' ? 'var(--primary)' : 'var(--muted-foreground)' }} />
                <span style={{ color: addressType === 'Work' ? 'var(--primary)' : 'var(--muted-foreground)' }}>Work</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAddressType('Other');
                  if (label === addressType) setLabel('Other');
                }}
                className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all duration-300 ${
                  addressType === 'Other' ? 'shadow-glow' : 'shadow-card hover:shadow-premium-sm'
                }`}
                style={{
                  backgroundColor: addressType === 'Other' ? 'var(--secondary)' : 'var(--card)',
                  border: addressType === 'Other' ? '2px solid var(--primary)' : '2px solid var(--border)'
                }}
              >
                <MapPin className="w-6 h-6" style={{ color: addressType === 'Other' ? 'var(--primary)' : 'var(--muted-foreground)' }} />
                <span style={{ color: addressType === 'Other' ? 'var(--primary)' : 'var(--muted-foreground)' }}>Other</span>
              </button>
            </div>
          </div>

          {/* Custom Label */}
          {addressType === 'Other' && (
            <div className="">
              <label className="block mb-2" style={{ color: 'var(--foreground)' }}>Label</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g., Mom's House, Gym"
                onFocus={() => setFocusedField('label')}
                onBlur={() => setFocusedField(null)}
                className={inputClass('label')}
                style={{
                  backgroundColor: 'var(--input-background)',
                  border: focusedField === 'label' ? '2px solid var(--primary)' : '2px solid var(--border)',
                  color: 'var(--foreground)'
                }}
              />
            </div>
          )}

          {/* Country */}
          <div className="">
            <label className="block mb-2" style={{ color: 'var(--foreground)' }}>Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="United States"
              onFocus={() => setFocusedField('country')}
              onBlur={() => setFocusedField(null)}
              className={inputClass('country')}
              style={{
                backgroundColor: 'var(--input-background)',
                border: focusedField === 'country' ? '2px solid var(--primary)' : '2px solid var(--border)',
                color: 'var(--foreground)'
              }}
            />
          </div>

          {/* Street Address */}
          <div className="">
            <label className="block mb-2" style={{ color: 'var(--foreground)' }}>Street Address</label>
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="123 Main Street, Apt 4B"
              onFocus={() => setFocusedField('street')}
              onBlur={() => setFocusedField(null)}
              className={inputClass('street')}
              style={{
                backgroundColor: 'var(--input-background)',
                border: focusedField === 'street' ? '2px solid var(--primary)' : '2px solid var(--border)',
                color: 'var(--foreground)'
              }}
            />
          </div>

          {/* City */}
          <div className="">
            <label className="block mb-2" style={{ color: 'var(--foreground)' }}>City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="New York"
              onFocus={() => setFocusedField('city')}
              onBlur={() => setFocusedField(null)}
              className={inputClass('city')}
              style={{
                backgroundColor: 'var(--input-background)',
                border: focusedField === 'city' ? '2px solid var(--primary)' : '2px solid var(--border)',
                color: 'var(--foreground)'
              }}
            />
          </div>

          {/* State & Zip Code */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2" style={{ color: 'var(--foreground)' }}>State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="NY"
                onFocus={() => setFocusedField('state')}
                onBlur={() => setFocusedField(null)}
                className={inputClass('state')}
                style={{
                  backgroundColor: 'var(--input-background)',
                  border: focusedField === 'state' ? '2px solid var(--primary)' : '2px solid var(--border)',
                  color: 'var(--foreground)'
                }}
              />
            </div>
            <div>
              <label className="block mb-2" style={{ color: 'var(--foreground)' }}>Zip Code</label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="10001"
                onFocus={() => setFocusedField('zipCode')}
                onBlur={() => setFocusedField(null)}
                className={inputClass('zipCode')}
                style={{
                  backgroundColor: 'var(--input-background)',
                  border: focusedField === 'zipCode' ? '2px solid var(--primary)' : '2px solid var(--border)',
                  color: 'var(--foreground)'
                }}
              />
            </div>
          </div>

          {/* Additional Instructions */}
          <div className="">
            <label className="block mb-2" style={{ color: 'var(--foreground)' }}>Delivery Instructions (Optional)</label>
            <textarea
              placeholder="e.g., Ring doorbell twice, Leave at door"
              rows={3}
              onFocus={() => setFocusedField('instructions')}
              onBlur={() => setFocusedField(null)}
              className={`${inputClass('instructions')} resize-none`}
              style={{
                backgroundColor: 'var(--input-background)',
                border: focusedField === 'instructions' ? '2px solid var(--primary)' : '2px solid var(--border)',
                color: 'var(--foreground)'
              }}
            />
          </div>
        </form>
      </div>

      <div className="p-6 glass relative z-10" style={{ borderTop: '1px solid rgba(46, 122, 217, 0.1)' }}>
        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className="w-full py-4 rounded-xl text-white shadow-premium-lg transition-all duration-300 hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
          style={{
            background: isFormValid ? 'var(--primary-gradient)' : 'var(--muted)',
            color: isFormValid ? 'white' : 'var(--muted-foreground)'
          }}
        >
          Save Address
        </button>
      </div>
    </div>
  );
}
