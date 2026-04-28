import { Package, Mail } from 'lucide-react';

interface WelcomeAuthScreenProps {
  onEmail: () => void;
  onGoogle: () => void;
  onSignIn?: () => void;
  onTerms?: () => void;
  onPrivacy?: () => void;
}

export function WelcomeAuthScreen({ onEmail, onGoogle, onSignIn, onTerms, onPrivacy }: WelcomeAuthScreenProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-white px-8">
      <Package className="w-20 h-20 text-gray-800 mb-6" strokeWidth={1.5} />
      
      <h1 className="text-gray-900 mb-2">DoHuub</h1>
      <p className="text-gray-600 mb-2">Infinite Services</p>
      <h2 className="text-gray-700 mb-12">Create Your Account</h2>
      
      <div className="w-full max-w-sm space-y-4">
        <button 
          onClick={onGoogle}
          className="w-full bg-white text-gray-800 py-4 rounded-lg border-2 border-gray-800 flex items-center justify-center gap-3"
        >
          <div className="w-6 h-6 rounded-full bg-gray-200"></div>
          Sign Up with Google
        </button>
        
        <button 
          onClick={onEmail}
          className="w-full bg-gray-800 text-white py-4 rounded-lg border-2 border-gray-800 flex items-center justify-center gap-3"
        >
          <Mail className="w-6 h-6" />
          Sign Up with Email
        </button>
      </div>
      
      <div className="mt-8 flex items-center gap-2">
        <span className="text-gray-600">Already have an account?</span>
        <button 
          onClick={onSignIn || onEmail}
          className="text-gray-800 underline"
        >
          Sign In
        </button>
      </div>
      
      <p className="text-gray-500 text-center mt-8 max-w-xs">
        By continuing, you agree to our{' '}
        <button onClick={onTerms} className="underline text-gray-700">Terms of Service</button>
        {' '}and{' '}
        <button onClick={onPrivacy} className="underline text-gray-700">Privacy Policy</button>
      </p>
    </div>
  );
}