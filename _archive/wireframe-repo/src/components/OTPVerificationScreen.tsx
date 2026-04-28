import { ArrowLeft } from 'lucide-react';
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

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-4 border-b-2 border-gray-200">
        <button onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
        </button>
      </div>

      <div className="flex-1 px-8 pt-12">
        <h2 className="text-gray-900 mb-2">Verify Your Email</h2>
        <p className="text-gray-600 mb-8">
          Enter the 6-digit code sent to<br />
          <span className="text-gray-800">{email}</span>
        </p>

        <div className="flex gap-3 mb-6 justify-center">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              className={`w-12 h-14 text-center border-2 rounded-lg text-gray-900 ${
                error ? 'border-gray-600' : 'border-gray-300'
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-gray-600 text-center mb-4">{error}</p>
        )}

        <p className="text-center text-gray-500 mb-6">
          {timer > 0 ? (
            `Resend code in 0:${timer.toString().padStart(2, '0')}`
          ) : (
            <button className="underline text-gray-700" onClick={handleResend}>Resend OTP</button>
          )}
        </p>

        <button
          onClick={handleVerify}
          disabled={otp.join('').length !== 6}
          className={`w-full py-4 rounded-lg border-2 ${
            otp.join('').length === 6
              ? 'bg-gray-800 text-white border-gray-800'
              : 'bg-gray-200 text-gray-400 border-gray-200'
          }`}
        >
          Verify
        </button>
      </div>
    </div>
  );
}