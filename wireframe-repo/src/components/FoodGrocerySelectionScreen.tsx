import { ArrowLeft, ShoppingBag, UtensilsCrossed } from 'lucide-react';

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
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-gray-900">
            <ArrowLeft className="w-6 h-6" strokeWidth={2} />
          </button>
          <div>
            <h1 className="text-gray-900">Groceries & Food</h1>
            <p className="text-gray-600">Choose your category</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8 flex flex-col gap-6">
        {/* Food Tile */}
        <button
          onClick={onFood}
          className="flex-1 bg-gray-100 rounded-2xl p-8 border-2 border-gray-200 hover:border-gray-800 transition-colors flex flex-col items-center justify-center gap-4"
        >
          <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
            <UtensilsCrossed className="w-12 h-12 text-gray-700" strokeWidth={2} />
          </div>
          <div className="text-center">
            <h2 className="text-gray-900 mb-2">Food</h2>
            <p className="text-gray-600">
              Order from restaurants and get food delivered to your door
            </p>
          </div>
        </button>

        {/* Grocery Tile */}
        <button
          onClick={onGrocery}
          className="flex-1 bg-gray-100 rounded-2xl p-8 border-2 border-gray-200 hover:border-gray-800 transition-colors flex flex-col items-center justify-center gap-4"
        >
          <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-gray-700" strokeWidth={2} />
          </div>
          <div className="text-center">
            <h2 className="text-gray-900 mb-2">Grocery</h2>
            <p className="text-gray-600">
              Shop fresh groceries and household essentials
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}