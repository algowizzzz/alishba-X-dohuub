import { ArrowLeft, Camera } from 'lucide-react';
import { useState } from 'react';

interface EditProfileScreenProps {
  userName: string;
  onBack: () => void;
  onSave: (name: string) => void;
}

export function EditProfileScreen({ userName, onBack, onSave }: EditProfileScreenProps) {
  const [name, setName] = useState(userName);
  const [phone, setPhone] = useState('');

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-4 border-b-2 border-gray-200">
        <div className="flex items-center gap-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
          </button>
          <h3 className="text-gray-900">Edit Profile</h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-300"></div>
            <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-gray-800 border-4 border-white flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-900 mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-900 mb-2">Phone Number</label>
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

          <div>
            <label className="block text-gray-900 mb-2">Email</label>
            <input
              type="email"
              value="user@example.com"
              disabled
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-500"
            />
          </div>
        </div>
      </div>

      <div className="p-6 border-t-2 border-gray-200">
        <button
          onClick={() => onSave(name)}
          className="w-full py-4 bg-gray-800 text-white rounded-lg border-2 border-gray-800"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
