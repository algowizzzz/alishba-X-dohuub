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

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-4 border-b-2 border-gray-200">
        <div className="flex items-center gap-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
          </button>
          <h3 className="text-gray-900">Add Address</h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-32">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Address Type Selection */}
          <div>
            <label className="text-gray-700 block mb-3">Address Type</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => {
                  setAddressType('Home');
                  if (label === addressType) setLabel('Home');
                }}
                className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 ${
                  addressType === 'Home' ? 'border-gray-800 bg-gray-50' : 'border-gray-300'
                }`}
              >
                <Home className="w-6 h-6 text-gray-600" />
                <span className="text-gray-700">Home</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAddressType('Work');
                  if (label === addressType) setLabel('Work');
                }}
                className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 ${
                  addressType === 'Work' ? 'border-gray-800 bg-gray-50' : 'border-gray-300'
                }`}
              >
                <Briefcase className="w-6 h-6 text-gray-600" />
                <span className="text-gray-700">Work</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAddressType('Other');
                  if (label === addressType) setLabel('Other');
                }}
                className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 ${
                  addressType === 'Other' ? 'border-gray-800 bg-gray-50' : 'border-gray-300'
                }`}
              >
                <MapPin className="w-6 h-6 text-gray-600" />
                <span className="text-gray-700">Other</span>
              </button>
            </div>
          </div>

          {/* Custom Label */}
          {addressType === 'Other' && (
            <div>
              <label className="text-gray-700 block mb-2">Label</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g., Mom's House, Gym"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-800 outline-none"
              />
            </div>
          )}

          {/* Country */}
          <div>
            <label className="text-gray-700 block mb-2">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="United States"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-800 outline-none"
            />
          </div>

          {/* Street Address */}
          <div>
            <label className="text-gray-700 block mb-2">Street Address</label>
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="123 Main Street, Apt 4B"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-800 outline-none"
            />
          </div>

          {/* City */}
          <div>
            <label className="text-gray-700 block mb-2">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="New York"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-800 outline-none"
            />
          </div>

          {/* State & Zip Code */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-700 block mb-2">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="NY"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-800 outline-none"
              />
            </div>
            <div>
              <label className="text-gray-700 block mb-2">Zip Code</label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="10001"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-800 outline-none"
              />
            </div>
          </div>

          {/* Additional Instructions */}
          <div>
            <label className="text-gray-700 block mb-2">Delivery Instructions (Optional)</label>
            <textarea
              placeholder="e.g., Ring doorbell twice, Leave at door"
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-800 outline-none resize-none"
            />
          </div>
        </form>
      </div>

      <div className="p-6 border-t-2 border-gray-200">
        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className="w-full py-4 rounded-lg border-2 bg-gray-800 text-white border-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Address
        </button>
      </div>
    </div>
  );
}