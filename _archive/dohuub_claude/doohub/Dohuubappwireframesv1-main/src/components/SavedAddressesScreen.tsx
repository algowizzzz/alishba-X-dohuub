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
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-4 border-b-2 border-gray-200">
        <div className="flex items-center gap-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
          </button>
          <h3 className="text-gray-900">Saved Addresses</h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {addresses.length > 0 ? (
          <div className="space-y-4 mb-6">
            {addresses.map((addr) => {
              const Icon = getIcon(addr.type);
              return (
                <div key={addr.id} className={`p-4 border-2 rounded-lg ${addr.isDefault ? 'border-gray-800 bg-gray-50' : 'border-gray-200'}`}>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-gray-900">{addr.label}</p>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 bg-gray-800 text-white text-xs rounded-full">Default</span>
                        )}
                      </div>
                      <p className="text-gray-600">{addr.fullAddress}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button 
                        onClick={() => onEditAddress(addr)}
                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                      >
                        <Edit className="w-5 h-5 text-gray-600" />
                      </button>
                      <button 
                        onClick={() => onDeleteAddress(addr.id)}
                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                      >
                        <Trash2 className="w-5 h-5 text-gray-600" />
                      </button>
                      <button 
                        onClick={() => onSetDefault(addr.id)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          addr.isDefault ? 'bg-gray-800' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                        disabled={addr.isDefault}
                      >
                        <Star className={`w-5 h-5 ${addr.isDefault ? 'text-white fill-white' : 'text-gray-600'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No saved addresses yet</p>
            <p className="text-gray-500">Add your frequently used addresses for faster booking</p>
          </div>
        )}

        <button 
          onClick={onAddAddress}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center gap-3 hover:border-gray-800"
        >
          <Plus className="w-6 h-6 text-gray-600" />
          <span className="text-gray-700">Add New Address</span>
        </button>
      </div>
    </div>
  );
}