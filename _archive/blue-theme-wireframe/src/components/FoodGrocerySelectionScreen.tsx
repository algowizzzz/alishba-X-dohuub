import { ArrowLeft } from 'lucide-react';
import { ForkKnife, ShoppingCart as PhShoppingCart } from '@phosphor-icons/react';
import foodImg from '../assets/food.png';
import groceryImg from '../assets/grocery.png';

interface FoodGrocerySelectionScreenProps {
  onBack: () => void;
  onFood: () => void;
  onGrocery: () => void;
}

export function FoodGrocerySelectionScreen({
  onBack,
  onFood,
  onGrocery
}: FoodGrocerySelectionScreenProps) {
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
          <div>
            <h1 className="font-semibold" style={{ color: 'var(--foreground)' }}>Groceries & Food</h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Choose your category</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8 flex flex-col gap-6 relative z-10">
        {/* Food Tile */}
        <button
          onClick={onFood}
          className="flex-1 rounded-2xl p-8 shadow-card transition-all duration-300 hover:shadow-premium-md hover:scale-[1.02] active:scale-[0.98] flex flex-col items-center justify-center gap-4"
          style={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)'
          }}
        >
          <img src={foodImg} alt="Food" className="object-contain" style={{ width: 98, height: 98 }} />
          <div className="text-center">
            <h2 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Food</h2>
            <p style={{ color: 'var(--muted-foreground)' }}>
              Order from restaurants and get food delivered to your door
            </p>
          </div>
        </button>

        {/* Grocery Tile */}
        <button
          onClick={onGrocery}
          className="flex-1 rounded-2xl p-8 shadow-card transition-all duration-300 hover:shadow-premium-md hover:scale-[1.02] active:scale-[0.98] flex flex-col items-center justify-center gap-4"
          style={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            
          }}
        >
          <img src={groceryImg} alt="Grocery" className="object-contain" style={{ width: 98, height: 98 }} />
          <div className="text-center">
            <h2 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Grocery</h2>
            <p style={{ color: 'var(--muted-foreground)' }}>
              Shop fresh groceries and household essentials
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
