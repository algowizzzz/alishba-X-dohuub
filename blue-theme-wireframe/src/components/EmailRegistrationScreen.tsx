import { ArrowLeft, Mail } from 'lucide-react';
import { useState } from 'react';

interface EmailRegistrationScreenProps {
  onBack: () => void;
  onContinue: (email: string) => void;
}

export function EmailRegistrationScreen({ onBack, onContinue }: EmailRegistrationScreenProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleContinue = () => {
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    onContinue(email);
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Background pattern */}
      <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />

      <div className="px-6 py-4 border-b glass relative z-10" style={{ borderColor: 'rgba(46, 122, 217, 0.1)' }}>
        <button onClick={onBack} className="flex items-center gap-2 transition-all duration-200 hover:opacity-80 hover:-translate-x-1" style={{ color: 'var(--muted-foreground)' }}>
          <ArrowLeft className="w-6 h-6" strokeWidth={2} />
        </button>
      </div>

      <div className="flex-1 px-8 pt-12 relative z-10">
        {/* Icon */}
        <div className="flex justify-center mb-8 animate-scale-in">
          <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-premium-lg" style={{ backgroundColor: 'var(--secondary)' }}>
            <Mail className="w-10 h-10 animate-float" style={{ color: 'var(--primary)' }} strokeWidth={1.5} />
          </div>
        </div>

        <h2 className="mb-2 text-center" style={{ color: 'var(--foreground)' }}>Enter Your Email</h2>
        <p className="mb-8 text-center" style={{ color: 'var(--muted-foreground)' }}>We'll send you a verification code</p>

        <div className="mb-6">
          <div className={`relative rounded-xl transition-all duration-300 ${isFocused ? 'shadow-glow' : 'shadow-premium-sm'}`}>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="your.email@example.com"
              className="w-full px-4 py-4 border-2 rounded-xl outline-none transition-all duration-300"
              style={{
                backgroundColor: 'var(--input-background)',
                borderColor: error ? 'var(--destructive)' : isFocused ? 'var(--primary)' : 'var(--border)',
                color: 'var(--foreground)'
              }}
            />
          </div>
          {error && (
            <p className="mt-2" style={{ color: 'var(--destructive)' }}>{error}</p>
          )}
        </div>

        <button
          onClick={handleContinue}
          disabled={!email}
          className="w-full py-4 rounded-xl text-white shadow-premium-lg transition-all duration-300 hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
          style={{
            background: email ? 'var(--primary-gradient)' : 'var(--muted)',
            color: email ? 'white' : 'var(--muted-foreground)',
            
          }}
        >
          Send OTP
        </button>

        <p className="text-center mt-6" style={{ color: 'var(--muted-foreground)' }}>
          <button onClick={onBack} className="underline transition-all duration-200 hover:opacity-80 hover:scale-105" style={{ color: 'var(--primary)' }}>Use Google Instead</button>
        </p>
      </div>
    </div>
  );
}
