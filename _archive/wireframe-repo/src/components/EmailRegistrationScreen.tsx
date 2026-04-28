import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

interface EmailRegistrationScreenProps {
  onBack: () => void;
  onContinue: (email: string) => void;
}

export function EmailRegistrationScreen({ onBack, onContinue }: EmailRegistrationScreenProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    onContinue(email);
  };

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-4 border-b-2 border-gray-200">
        <button onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
        </button>
      </div>

      <div className="flex-1 px-8 pt-12">
        <h2 className="text-gray-900 mb-2">Enter Your Email</h2>
        <p className="text-gray-600 mb-8">We'll send you a verification code</p>

        <div className="mb-6">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            placeholder="your.email@example.com"
            className={`w-full px-4 py-4 border-2 rounded-lg ${
              error ? 'border-gray-600' : 'border-gray-300'
            }`}
          />
          {error && (
            <p className="text-gray-600 mt-2">{error}</p>
          )}
        </div>

        <button
          onClick={handleContinue}
          disabled={!email}
          className={`w-full py-4 rounded-lg border-2 ${
            email
              ? 'bg-gray-800 text-white border-gray-800'
              : 'bg-gray-200 text-gray-400 border-gray-200'
          }`}
        >
          Send OTP
        </button>

        <p className="text-center mt-6 text-gray-600">
          <button onClick={onBack} className="underline">Use Google Instead</button>
        </p>
      </div>
    </div>
  );
}
