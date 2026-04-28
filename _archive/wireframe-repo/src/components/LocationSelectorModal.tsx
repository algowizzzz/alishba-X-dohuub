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
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end z-50">
      <div className="w-full bg-white rounded-t-3xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-gray-200">
          <h2 className="text-gray-800">Select Service Location</h2>
          <button onClick={onClose} className="p-2">
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Address List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {addresses.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No saved addresses</p>
              <p className="text-gray-400 mb-6">Add an address to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((address) => {
                const isSelected = selectedAddressId === address.id.toString();
                return (
                  <button
                    key={address.id}
                    onClick={() => handleSelectAddress(address.id)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      isSelected
                        ? 'border-gray-800 bg-gray-50'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className={`w-5 h-5 mt-1 ${
                        isSelected ? 'text-gray-800' : 'text-gray-600'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-gray-800">{address.label}</p>
                          {address.isDefault && (
                            <span className="px-2 py-1 bg-gray-200 rounded text-gray-700">
                              Default
                            </span>
                          )}
                          {isSelected && (
                            <span className="ml-auto text-gray-800">✓</span>
                          )}
                        </div>
                        <p className="text-gray-600">
                          {address.street}
                          {address.apartment && `, ${address.apartment}`}
                        </p>
                        <p className="text-gray-500">
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
        <div className="px-6 py-4 border-t-2 border-gray-200">
          <button
            onClick={() => {
              onAddAddress();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 border-2 border-gray-800 rounded-lg hover:bg-gray-50"
          >
            <Plus className="w-5 h-5 text-gray-800" />
            <span className="text-gray-800">Add New Address</span>
          </button>
        </div>
      </div>
    </div>
  );
}