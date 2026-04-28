import { Camera } from 'lucide-react';
import { useState } from 'react';
import profilePhoto from '../assets/profile photo (2).png';

interface ProfileSetupScreenProps {
  onContinue: (name: string) => void;
}

export function ProfileSetupScreen({ onContinue }: ProfileSetupScreenProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [nameFocused, setNameFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);

  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Background pattern */}
      <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />

      <div className="px-6 py-4 border-b glass relative z-10" style={{ borderColor: 'rgba(46, 122, 217, 0.1)' }}>
        <p className="font-medium" style={{ color: 'var(--primary)' }}>Step 1 of 2</p>
      </div>

      <div className="flex-1 px-8 pt-12 relative z-10">
        <h2 className="mb-2" style={{ color: 'var(--foreground)' }}>Complete Your Profile</h2>
        <p className="mb-8" style={{ color: 'var(--muted-foreground)' }}>Tell us a bit about yourself</p>

        <div className="flex justify-center mb-8 animate-scale-in">
          <div className="relative">
            {/* Gradient ring around avatar */}
            <img src={profilePhoto} alt="Profile" className="w-24 h-24 rounded-full object-cover shadow-premium-lg" style={{ border: '3px solid var(--primary)' }} />
            <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shadow-premium-md transition-all duration-300 hover:scale-110 cursor-pointer" style={{ background: 'var(--primary-gradient)' }}>
              <Camera className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="">
            <label className="block mb-2 font-medium" style={{ color: 'var(--foreground)' }}>Full Name *</label>
            <div className={`relative rounded-xl transition-all duration-300 ${nameFocused ? 'shadow-glow' : 'shadow-premium-sm'}`}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
                placeholder="Enter your full name"
                className="w-full px-4 py-4 border-2 rounded-xl outline-none transition-all duration-300"
                style={{
                  backgroundColor: 'var(--input-background)',
                  borderColor: nameFocused ? 'var(--primary)' : 'var(--border)',
                  color: 'var(--foreground)'
                }}
              />
            </div>
          </div>

          <div className="">
            <label className="block mb-2 font-medium" style={{ color: 'var(--foreground)' }}>Phone Number</label>
            <div className="flex gap-2">
              <select
                className="px-3 py-4 border-2 rounded-xl outline-none shadow-premium-sm transition-all duration-300 focus:shadow-glow focus:border-[var(--primary)]"
                style={{ backgroundColor: 'var(--input-background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                <option>+1</option>
                <option>+44</option>
                <option>+971</option>
              </select>
              <div className={`flex-1 relative rounded-xl transition-all duration-300 ${phoneFocused ? 'shadow-glow' : 'shadow-premium-sm'}`}>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onFocus={() => setPhoneFocused(true)}
                  onBlur={() => setPhoneFocused(false)}
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-4 border-2 rounded-xl outline-none transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--input-background)',
                    borderColor: phoneFocused ? 'var(--primary)' : 'var(--border)',
                    color: 'var(--foreground)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => name && onContinue(name)}
          disabled={!name}
          className="w-full py-4 rounded-xl text-white shadow-premium-lg transition-all duration-300 hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none mb-4"
          style={{
            background: name ? 'var(--primary-gradient)' : 'var(--muted)',
            color: name ? 'white' : 'var(--muted-foreground)',
            
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}