import { Home, Briefcase, MapPin, Plus } from 'lucide-react';
import { useState } from 'react';

interface SavedAddressesSetupScreenProps {
  onDone: () => void;
  onSkip: () => void;
  onAddAddress: (type: 'Home' | 'Work' | 'Other') => void;
}

export function SavedAddressesSetupScreen({ onDone, onSkip, onAddAddress }: SavedAddressesSetupScreenProps) {
  const [addresses, setAddresses] = useState<string[]>([]);

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-4 border-b-2 border-gray-200">
        <p className="text-gray-600">Step 2 of 2</p>
      </div>

      <div className="flex-1 px-8 pt-12 overflow-y-auto">
        <h2 className="text-gray-900 mb-2">Add Your Addresses</h2>
        <p className="text-gray-600 mb-8">Save time by adding your frequent locations</p>

        <div className="space-y-3 mb-8">
          <button className="w-full p-4 rounded-lg border-2 border-gray-300 flex items-center gap-4 hover:border-gray-400" onClick={() => onAddAddress('Home')}>
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Home className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-gray-900">Home</p>
              <p className="text-gray-500">Add your home address</p>
            </div>
            <Plus className="w-6 h-6 text-gray-400" />
          </button>

          <button className="w-full p-4 rounded-lg border-2 border-gray-300 flex items-center gap-4 hover:border-gray-400" onClick={() => onAddAddress('Work')}>
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-gray-900">Work</p>
              <p className="text-gray-500">Add your work address</p>
            </div>
            <Plus className="w-6 h-6 text-gray-400" />
          </button>

          <button className="w-full p-4 rounded-lg border-2 border-gray-300 flex items-center gap-4 hover:border-gray-400" onClick={() => onAddAddress('Other')}>
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-gray-900">Other</p>
              <p className="text-gray-500">Add another location</p>
            </div>
            <Plus className="w-6 h-6 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="p-6 border-t-2 border-gray-200 space-y-3">
        <button
          onClick={onDone}
          className="w-full py-4 rounded-lg border-2 bg-gray-800 text-white border-gray-800"
        >
          Done
        </button>

        <button onClick={onSkip} className="w-full text-gray-600">
          Skip for Now
        </button>
      </div>
    </div>
  );
}