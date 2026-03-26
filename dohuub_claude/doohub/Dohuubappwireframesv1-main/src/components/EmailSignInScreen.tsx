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
    <div className="h-full flex flex-col bg-white">
      <div className="p-6">
        <button onClick={onBack} className="text-gray-600 flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </div>

      <div className="flex-1 flex flex-col px-8 pt-12">
        <h2 className="text-gray-900 mb-2">Sign In</h2>
        <p className="text-gray-600 mb-8">Enter your credentials to continue</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-gray-700 block mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-lg focus:border-gray-800 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-700 block mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-lg focus:border-gray-800 outline-none"
              />
            </div>
          </div>

          <button className="text-gray-800 underline self-start">
            Forgot Password?
          </button>

          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-4 rounded-lg border-2 border-gray-800 disabled:opacity-50"
            disabled={!email || !password}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
