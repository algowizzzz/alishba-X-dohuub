import { Camera } from 'lucide-react';
import { useState } from 'react';

interface ProfileSetupScreenProps {
  onContinue: (name: string) => void;
}

export function ProfileSetupScreen({ onContinue }: ProfileSetupScreenProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-4 border-b-2 border-gray-200">
        <p className="text-gray-600">Step 1 of 2</p>
      </div>

      <div className="flex-1 px-8 pt-12">
        <h2 className="text-gray-900 mb-2">Complete Your Profile</h2>
        <p className="text-gray-600 mb-8">Tell us a bit about yourself</p>

        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
              <Camera className="w-10 h-10 text-gray-400" />
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gray-800 border-2 border-white flex items-center justify-center">
              <Camera className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-gray-700 mb-2">Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Phone Number</label>
            <div className="flex gap-2">
              <select className="px-3 py-4 border-2 border-gray-300 rounded-lg">
                <option>+1</option>
                <option>+44</option>
                <option>+971</option>
              </select>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
                className="flex-1 px-4 py-4 border-2 border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        <button
          onClick={() => name && onContinue(name)}
          disabled={!name}
          className={`w-full py-4 rounded-lg border-2 mb-4 ${
            name
              ? 'bg-gray-800 text-white border-gray-800'
              : 'bg-gray-200 text-gray-400 border-gray-200'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}