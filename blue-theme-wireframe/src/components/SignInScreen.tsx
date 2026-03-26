import { Mail, ArrowLeft } from 'lucide-react';
import Logo from '../assets/logo-tt.png';

interface SignInScreenProps {
  onEmail: () => void;
  onGoogle: () => void;
  onBack: () => void;
}

export function SignInScreen({ onEmail, onGoogle, onBack }: SignInScreenProps) {
  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #4CA6FA 0%, #1D4ADD 100%)' }}>
      <div className="p-6 relative z-10">
        <button onClick={onBack} className="flex items-center gap-2 transition-all duration-200 hover:opacity-80 hover:scale-105 active:scale-95 text-white">
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10">
        <img src={Logo} alt="DoHuub Logo" className="w-[369px] h-[369px] mb-6 animate-scale-in rounded-[72px]" />

        <div className="w-full max-w-sm space-y-4">
          <button
            onClick={onGoogle}
            className="w-full py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 hover:bg-white hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#1D4ADD', border: 'none' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign In with Google
          </button>

          <button
            onClick={onEmail}
            className="w-full py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: 'transparent', color: 'white', border: '2px solid rgba(255, 255, 255, 0.5)' }}
          >
            <Mail className="w-6 h-6" />
            Sign In with Email
          </button>
        </div>

        <div className="mt-8 flex items-center gap-2">
          <span className="text-white">Don't have an account?</span>
          <button
            onClick={onBack}
            className="underline transition-all duration-200 hover:opacity-80 text-white"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
