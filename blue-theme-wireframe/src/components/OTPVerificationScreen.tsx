import { ArrowLeft, Shield } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface OTPVerificationScreenProps {
  email: string;
  onBack: () => void;
  onVerify: () => void;
}

export function OTPVerificationScreen({ email, onBack, onVerify }: OTPVerificationScreenProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(59);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleResend = () => {
    setTimer(59);
    setOtp(['', '', '', '', '', '']);
    setError('');
  };

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError('');

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length === 6) {
      onVerify();
    } else {
      setError('Invalid code. Please try again');
      setOtp(['', '', '', '', '', '']);
    }
  };

  const isComplete = otp.join('').length === 6;

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
            <Shield className="w-10 h-10 animate-pulse-soft" style={{ color: 'var(--primary)' }} strokeWidth={1.5} />
          </div>
        </div>

        <h2 className="mb-2 text-center" style={{ color: 'var(--foreground)' }}>Verify Your Email</h2>
        <p className="mb-8 text-center" style={{ color: 'var(--muted-foreground)' }}>
          Enter the 6-digit code sent to<br />
          <span className="font-medium" style={{ color: 'var(--primary)' }}>{email}</span>
        </p>

        <div className="flex gap-3 mb-6 justify-center">
          {otp.map((digit, index) => (
            <div
              key={index}
              className={`relative rounded-xl transition-all duration-300 ${focusedIndex === index ? 'shadow-glow' : 'shadow-premium-sm'}`}
            >
              <input
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
                className="w-12 h-14 text-center text-xl font-semibold border-2 rounded-xl outline-none transition-all duration-300"
                style={{
                  backgroundColor: 'var(--input-background)',
                  borderColor: error ? 'var(--destructive)' : focusedIndex === index ? 'var(--primary)' : 'var(--border)',
                  color: 'var(--foreground)'
                }}
              />
            </div>
          ))}
        </div>

        {error && (
          <p className="text-center mb-4" style={{ color: 'var(--destructive)' }}>{error}</p>
        )}

        <p className="text-center mb-6" style={{ color: 'var(--muted-foreground)' }}>
          {timer > 0 ? (
            <span>Resend code in <span className="font-medium" style={{ color: 'var(--primary)' }}>0:{timer.toString().padStart(2, '0')}</span></span>
          ) : (
            <button className="underline transition-all duration-200 hover:opacity-80 hover:scale-105" style={{ color: 'var(--primary)' }} onClick={handleResend}>Resend OTP</button>
          )}
        </p>

        <button
          onClick={handleVerify}
          disabled={!isComplete}
          className="w-full py-4 rounded-xl text-white shadow-premium-lg transition-all duration-300 hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
          style={{
            background: isComplete ? 'var(--primary-gradient)' : 'var(--muted)',
            color: isComplete ? 'white' : 'var(--muted-foreground)',
            
          }}
        >
          Verify
        </button>
      </div>
    </div>
  );
}