import { MapPin } from 'lucide-react';

interface LocationPermissionScreenProps {
  onAllow: () => void;
  onManual: () => void;
}

export function LocationPermissionScreen({ onAllow, onManual }: LocationPermissionScreenProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-white px-8">
      <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-8">
        <MapPin className="w-16 h-16 text-gray-700" strokeWidth={1.5} />
      </div>
      
      <h2 className="text-gray-900 mb-4 text-center">Enable Location Services</h2>
      <p className="text-gray-600 text-center mb-12 max-w-sm">
        DoHuub uses your location to show nearby services and providers
      </p>
      
      <div className="w-full max-w-sm space-y-4">
        <button 
          onClick={onAllow}
          className="w-full bg-gray-800 text-white py-4 rounded-lg border-2 border-gray-800"
        >
          Allow Location Access
        </button>
      </div>
      
      <button 
        onClick={onAllow}
        className="mt-8 text-gray-500"
      >
        Skip
      </button>
    </div>
  );
}