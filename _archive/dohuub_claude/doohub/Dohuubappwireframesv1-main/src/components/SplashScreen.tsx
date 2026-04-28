import { useEffect } from 'react';
import { Package } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-100 px-8">
      <Package className="w-24 h-24 text-gray-800 mb-6" strokeWidth={1.5} />
      <h1 className="text-gray-900 mb-2">DoHuub</h1>
      <p className="text-gray-600 text-center">Infinite Services</p>
      <div className="mt-12">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
      </div>
    </div>
  );
}