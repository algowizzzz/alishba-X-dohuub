import { Package, Mail, ArrowLeft } from 'lucide-react';

interface SignInScreenProps {
  onEmail: () => void;
  onGoogle: () => void;
  onBack: () => void;
}

export function SignInScreen({ onEmail, onGoogle, onBack }: SignInScreenProps) {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6">
        <button onClick={onBack} className="text-gray-600 flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <Package className="w-20 h-20 text-gray-800 mb-6" strokeWidth={1.5} />
        
        <h1 className="text-gray-900 mb-2">DoHuub</h1>
        <p className="text-gray-600 mb-2">Infinite Services</p>
        <h2 className="text-gray-700 mb-12">Sign In to Your Account</h2>
        
        <div className="w-full max-w-sm space-y-4">
          <button 
            onClick={onGoogle}
            className="w-full bg-white text-gray-800 py-4 rounded-lg border-2 border-gray-800 flex items-center justify-center gap-3"
          >
            <div className="w-6 h-6 rounded-full bg-gray-200"></div>
            Sign In with Google
          </button>
          
          <button 
            onClick={onEmail}
            className="w-full bg-gray-800 text-white py-4 rounded-lg border-2 border-gray-800 flex items-center justify-center gap-3"
          >
            <Mail className="w-6 h-6" />
            Sign In with Email
          </button>
        </div>
        
        <div className="mt-8 flex items-center gap-2">
          <span className="text-gray-600">Don't have an account?</span>
          <button 
            onClick={onBack}
            className="text-gray-800 underline"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
