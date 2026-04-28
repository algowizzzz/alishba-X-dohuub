import { useState } from 'react';
import { ArrowLeft, Mail, Lock } from 'lucide-react';

interface EmailSignInScreenProps {
  onBack: () => void;
  onSignIn: (email: string) => void;
}

export function EmailSignInScreen({ onBack, onSignIn }: EmailSignInScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onSignIn(email);
    }
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="p-6 relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 transition-all duration-300 hover:opacity-70"
          style={{ color: 'var(--muted-foreground)' }}
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-8 pt-8 relative z-10">
        {/* Header Text */}
        <div className="">
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Sign In</h2>
          <p className="mb-8" style={{ color: 'var(--muted-foreground)' }}>Enter your credentials to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="">
            <label className="block mb-2 font-medium" style={{ color: 'var(--foreground)' }}>Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full pl-12 pr-4 py-4 rounded-xl outline-none transition-all duration-300 shadow-card focus:shadow-premium-sm"
                style={{
                  backgroundColor: 'var(--input-background)',
                  border: '2px solid var(--border)',
                  color: 'var(--foreground)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="">
            <label className="block mb-2 font-medium" style={{ color: 'var(--foreground)' }}>Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-12 pr-4 py-4 rounded-xl outline-none transition-all duration-300 shadow-card focus:shadow-premium-sm"
                style={{
                  backgroundColor: 'var(--input-background)',
                  border: '2px solid var(--border)',
                  color: 'var(--foreground)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          </div>

          {/* Forgot Password */}
          <button
            type="button"
            className="underline self-start transition-all duration-300 hover:opacity-70"
            style={{ color: 'var(--primary)' }}
          >
            Forgot Password?
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full text-white py-4 rounded-xl font-medium transition-all duration-300 hover:shadow-premium-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 shadow-premium-sm"
            style={{
              background: 'var(--primary-gradient)',
              
            }}
            disabled={!email || !password}
          >
            Sign In
          </button>
        </form>

        {/* Decorative Element */}
        <div className="flex-1 flex items-end justify-center pb-8">
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Don't have an account?{' '}
            <button className="font-medium underline transition-opacity hover:opacity-70" style={{ color: 'var(--primary)' }}>
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
