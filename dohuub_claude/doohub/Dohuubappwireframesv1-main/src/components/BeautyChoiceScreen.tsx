import { ArrowLeft, Scissors, ShoppingBag } from 'lucide-react';

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
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-gray-900">
            <ArrowLeft className="w-6 h-6" strokeWidth={2} />
          </button>
          <div className="flex-1">
            <h1 className="text-gray-900">Beauty Services and Products</h1>
            <p className="text-sm text-gray-600">Choose your preference</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-6">
          {/* Services Card */}
          <button
            onClick={onSelectServices}
            className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl p-8 hover:border-gray-900 transition-colors"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                <Scissors className="w-10 h-10 text-gray-900" strokeWidth={2} />
              </div>
              <div className="text-center">
                <h3 className="text-gray-900 mb-2">Beauty Services</h3>
                <p className="text-sm text-gray-600">
                  Book professional beauty services at your doorstep
                </p>
              </div>
            </div>
          </button>

          {/* Products Card */}
          <button
            onClick={onSelectProducts}
            className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl p-8 hover:border-gray-900 transition-colors"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-gray-900" strokeWidth={2} />
              </div>
              <div className="text-center">
                <h3 className="text-gray-900 mb-2">Beauty Products</h3>
                <p className="text-sm text-gray-600">
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