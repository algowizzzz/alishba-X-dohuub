import { useState } from 'react';
import { ArrowLeft, Home, Briefcase, MapPin } from 'lucide-react';
import { Address } from './AddAddressScreen';

interface EditAddressScreenProps {
  address: Address;
  onBack: () => void;
  onSave: (address: Address) => void;
}

export function EditAddressScreen({ address, onBack, onSave }: EditAddressScreenProps) {
  const [addressType, setAddressType] = useState<'Home' | 'Work' | 'Other'>(address.type);
  const [label, setLabel] = useState(address.label);
  const [street, setStreet] = useState(address.street);
  const [city, setCity] = useState(address.city);
  const [state, setState] = useState(address.state);
  const [zipCode, setZipCode] = useState(address.zipCode);
  const [country, setCountry] = useState(address.country);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (street && city && state && zipCode && country) {
      const fullAddress = `${street}, ${city}, ${state} ${zipCode}, ${country}`;
      onSave({
        id: address.id,
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

  const typeButtons = [
    { type: 'Home' as const, icon: Home, label: 'Home' },
    { type: 'Work' as const, icon: Briefcase, label: 'Work' },
    { type: 'Other' as const, icon: MapPin, label: 'Other' }
  ];

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
          <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Edit Address</h3>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-32 relative z-10">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Address Type Selection */}
          <div className="">
            <label className="block mb-3 font-medium" style={{ color: 'var(--foreground)' }}>Address Type</label>
            <div className="grid grid-cols-3 gap-3">
              {typeButtons.map((btn, index) => {
                const Icon = btn.icon;
                const isSelected = addressType === btn.type;
                return (
                  <button
                    key={btn.type}
                    type="button"
                    onClick={() => {
                      setAddressType(btn.type);
                      if (label === addressType) setLabel(btn.type);
                    }}
                    className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all duration-300 ${
                      isSelected ? 'shadow-premium-md' : 'shadow-card hover:shadow-premium-sm'
                    }`}
                    style={{
                      backgroundColor: 'var(--card)',
                      border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                                          }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                      style={{
                        background: isSelected ? 'var(--primary-gradient)' : 'transparent'
                      }}
                    >
                      <Icon
                        className="w-5 h-5"
                        style={{ color: isSelected ? 'white' : 'var(--muted-foreground)' }}
                      />
                    </div>
                    <span style={{ color: isSelected ? 'var(--primary)' : 'var(--foreground)' }}>{btn.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Label */}
          {addressType === 'Other' && (
            <div className="">
              <label className="block mb-2 font-medium" style={{ color: 'var(--foreground)' }}>Label</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                onFocus={() => setFocusedField('label')}
                onBlur={() => setFocusedField(null)}
                placeholder="e.g., Mom's House, Gym"
                className={inputClass('label')}
                style={{
                  backgroundColor: 'var(--input-background)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)'
                }}
              />
            </div>
          )}

          {/* Country */}
          <div className="">
            <label className="block mb-2 font-medium" style={{ color: 'var(--foreground)' }}>Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              onFocus={() => setFocusedField('country')}
              onBlur={() => setFocusedField(null)}
              placeholder="United States"
              className={inputClass('country')}
              style={{
                backgroundColor: 'var(--input-background)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)'
              }}
            />
          </div>

          {/* Street Address */}
          <div className="">
            <label className="block mb-2 font-medium" style={{ color: 'var(--foreground)' }}>Street Address</label>
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              onFocus={() => setFocusedField('street')}
              onBlur={() => setFocusedField(null)}
              placeholder="123 Main Street, Apt 4B"
              className={inputClass('street')}
              style={{
                backgroundColor: 'var(--input-background)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)'
              }}
            />
          </div>

          {/* City */}
          <div className="">
            <label className="block mb-2 font-medium" style={{ color: 'var(--foreground)' }}>City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onFocus={() => setFocusedField('city')}
              onBlur={() => setFocusedField(null)}
              placeholder="New York"
              className={inputClass('city')}
              style={{
                backgroundColor: 'var(--input-background)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)'
              }}
            />
          </div>

          {/* State & Zip Code */}
          <div className="grid grid-cols-2 gap-4">
            <div className="">
              <label className="block mb-2 font-medium" style={{ color: 'var(--foreground)' }}>State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                onFocus={() => setFocusedField('state')}
                onBlur={() => setFocusedField(null)}
                placeholder="NY"
                className={inputClass('state')}
                style={{
                  backgroundColor: 'var(--input-background)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)'
                }}
              />
            </div>
            <div className="">
              <label className="block mb-2 font-medium" style={{ color: 'var(--foreground)' }}>Zip Code</label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                onFocus={() => setFocusedField('zipCode')}
                onBlur={() => setFocusedField(null)}
                placeholder="10001"
                className={inputClass('zipCode')}
                style={{
                  backgroundColor: 'var(--input-background)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)'
                }}
              />
            </div>
          </div>

          {/* Delivery Instructions */}
          <div className="">
            <label className="block mb-2 font-medium" style={{ color: 'var(--foreground)' }}>Delivery Instructions (Optional)</label>
            <textarea
              placeholder="e.g., Ring doorbell twice, Leave at door"
              rows={3}
              onFocus={() => setFocusedField('instructions')}
              onBlur={() => setFocusedField(null)}
              className={`w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 resize-none ${
                focusedField === 'instructions' ? 'shadow-glow' : 'shadow-card'
              }`}
              style={{
                backgroundColor: 'var(--input-background)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)'
              }}
            />
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="p-6 glass relative z-10" style={{ borderTop: '1px solid rgba(46, 122, 217, 0.1)' }}>
        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className="w-full py-4 rounded-xl text-white font-semibold shadow-premium-md transition-all duration-300 hover:shadow-premium-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{ background: 'var(--primary-gradient)' }}
        >
          Update Address
        </button>
      </div>
    </div>
  );
}
