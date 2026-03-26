import { ArrowLeft, Camera } from 'lucide-react';
import { useState } from 'react';
import profilePhoto from '../assets/profile photo (2).png';

interface EditProfileScreenProps {
  userName: string;
  onBack: () => void;
  onSave: (name: string) => void;
}

export function EditProfileScreen({ userName, onBack, onSave }: EditProfileScreenProps) {
  const [name, setName] = useState(userName);
  const [phone, setPhone] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const inputClass = (field: string) => `w-full px-4 py-4 rounded-xl outline-none transition-all duration-300 ${
    focusedField === field ? 'shadow-glow' : 'shadow-card'
  }`;

  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />

      {/* Header */}
      <div
        className="px-6 py-6 relative z-50"
        style={{
          background: 'rgba(255, 255, 255, 1)',
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
          <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Edit Profile</h3>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-12 relative z-10">
        {/* Profile Avatar */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <img src={profilePhoto} alt="Profile" className="w-48 h-48 rounded-full object-cover shadow-premium-lg" style={{ border: '3px solid var(--primary)' }} />
            <button
              className="absolute bottom-0 right-0 w-16 h-16 rounded-full flex items-center justify-center shadow-premium-md transition-all duration-300 hover:scale-110"
              style={{ background: 'var(--primary-gradient)' }}
            >
              <Camera className="w-8 h-8 text-white" />
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          {/* Full Name */}
          <div className="">
            <label className="block mb-2 font-medium" style={{ color: 'var(--foreground)' }}>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              className={inputClass('name')}
              style={{
                backgroundColor: 'var(--input-background)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)'
              }}
            />
          </div>

          {/* Phone Number */}
          <div className="">
            <label className="block mb-2 font-medium" style={{ color: 'var(--foreground)' }}>Phone Number</label>
            <div className="flex gap-3">
              <select
                className="px-4 py-4 rounded-xl shadow-card outline-none transition-all duration-300"
                style={{
                  backgroundColor: 'var(--input-background)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)'
                }}
              >
                <option>+1</option>
                <option>+44</option>
                <option>+971</option>
              </select>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField(null)}
                placeholder="(555) 123-4567"
                className={`flex-1 ${inputClass('phone')}`}
                style={{
                  backgroundColor: 'var(--input-background)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)'
                }}
              />
            </div>
          </div>

          {/* Email */}
          <div className="">
            <label className="block mb-2 font-medium" style={{ color: 'var(--foreground)' }}>Email</label>
            <input
              type="email"
              value="user@example.com"
              disabled
              className="w-full px-4 py-4 rounded-xl shadow-card"
              style={{
                backgroundColor: 'var(--muted)',
                color: 'var(--muted-foreground)',
                border: '1px solid var(--border)'
              }}
            />
            <p className="mt-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Email cannot be changed
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 glass relative z-10" style={{ borderTop: '1px solid rgba(46, 122, 217, 0.1)' }}>
        <button
          onClick={() => onSave(name)}
          className="w-full py-4 rounded-xl text-white font-semibold shadow-premium-md transition-all duration-300 hover:shadow-premium-lg hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: 'var(--primary-gradient)' }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
