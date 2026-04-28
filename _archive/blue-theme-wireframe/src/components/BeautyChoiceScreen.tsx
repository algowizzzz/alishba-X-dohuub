import { ArrowLeft } from 'lucide-react';
import { Scissors as PhScissors, FlowerLotus } from '@phosphor-icons/react';
import beautyServicesImg from '../assets/bueaty services.png';
import beautyProductsImg from '../assets/bueaty products.png';

interface BeautyChoiceScreenProps {
  onBack: () => void;
  onSelectServices: () => void;
  onSelectProducts: () => void;
}

export function BeautyChoiceScreen({
  onBack,
  onSelectServices,
  onSelectProducts
}: BeautyChoiceScreenProps) {
  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />

      {/* Header */}
      <div
        className="px-6 py-6 relative z-10"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.06)',
          borderBottom: '1px solid rgba(46, 122, 217, 0.08)',
          borderRadius: '0 0 24px 24px',
        }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-xl transition-all duration-300 hover:shadow-card"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: 'var(--foreground)' }} strokeWidth={2} />
          </button>
          <div className="flex-1">
            <h1 className="font-semibold" style={{ color: 'var(--foreground)' }}>Beauty Services and Products</h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Choose your preference</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 relative z-10">
        <div className="space-y-6">
          {/* Services Card */}
          <button
            onClick={onSelectServices}
            className="w-full rounded-2xl p-8 shadow-card transition-all duration-300 hover:shadow-premium-md hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <div className="flex flex-col items-center gap-4">
              <img src={beautyServicesImg} alt="Beauty Services" className="w-20 h-20 object-contain" />
              <div className="text-center">
                <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Beauty Services</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Book professional beauty services at your doorstep
                </p>
              </div>
            </div>
          </button>

          {/* Products Card */}
          <button
            onClick={onSelectProducts}
            className="w-full rounded-2xl p-8 shadow-card transition-all duration-300 hover:shadow-premium-md hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <div className="flex flex-col items-center gap-4">
              <img src={beautyProductsImg} alt="Beauty Products" className="w-20 h-20 object-contain" />
              <div className="text-center">
                <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Beauty Products</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Shop cosmetics, skincare and beauty essentials
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
