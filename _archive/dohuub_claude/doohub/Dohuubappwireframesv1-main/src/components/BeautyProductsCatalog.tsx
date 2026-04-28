import { ArrowLeft, Plus, ShoppingCart, Minus } from 'lucide-react';
import { useState } from 'react';

interface BeautyProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  size: string;
  description: string;
}

interface BeautyProductsCatalogProps {
  vendorName: string;
  onBack: () => void;
  onAddToCart: (product: BeautyProduct) => void;
  onRemoveFromCart: (productId: number) => void;
  cartItems: Array<{ id: number; quantity: number }>;
  onViewCart: () => void;
}

export function BeautyProductsCatalog({
  vendorName,
  onBack,
  onAddToCart,
  onRemoveFromCart,
  cartItems,
  onViewCart
}: BeautyProductsCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const products: BeautyProduct[] = [
    // Makeup
    {
      id: 1,
      name: 'HD Foundation',
      category: 'Makeup',
      price: 35.99,
      size: '30ml',
      description: 'Full coverage liquid foundation'
    },
    {
      id: 2,
      name: 'Matte Lipstick',
      category: 'Makeup',
      price: 18.99,
      size: '3.5g',
      description: 'Long-lasting matte finish'
    },
    {
      id: 3,
      name: 'Eyeshadow Palette',
      category: 'Makeup',
      price: 45.00,
      size: '12 colors',
      description: 'Professional eye makeup palette'
    },
    {
      id: 4,
      name: 'Mascara',
      category: 'Makeup',
      price: 22.50,
      size: '10ml',
      description: 'Volumizing and lengthening'
    },
    // Skincare
    {
      id: 5,
      name: 'Vitamin C Serum',
      category: 'Skincare',
      price: 28.99,
      size: '30ml',
      description: 'Brightening face serum'
    },
    {
      id: 6,
      name: 'Hyaluronic Acid Moisturizer',
      category: 'Skincare',
      price: 32.00,
      size: '50ml',
      description: 'Deep hydration cream'
    },
    {
      id: 7,
      name: 'Daily Sunscreen SPF 50',
      category: 'Skincare',
      price: 24.99,
      size: '50ml',
      description: 'Broad spectrum UV protection'
    },
    {
      id: 8,
      name: 'Facial Cleanser',
      category: 'Skincare',
      price: 16.99,
      size: '150ml',
      description: 'Gentle foaming cleanser'
    },
    // Haircare
    {
      id: 9,
      name: 'Argan Oil Shampoo',
      category: 'Haircare',
      price: 19.99,
      size: '300ml',
      description: 'Nourishing hair cleanser'
    },
    {
      id: 10,
      name: 'Deep Conditioner',
      category: 'Haircare',
      price: 21.99,
      size: '250ml',
      description: 'Intensive hair treatment'
    },
    {
      id: 11,
      name: 'Hair Serum',
      category: 'Haircare',
      price: 26.50,
      size: '100ml',
      description: 'Anti-frizz shine serum'
    },
    // Fragrances
    {
      id: 12,
      name: 'Floral Eau de Parfum',
      category: 'Fragrances',
      price: 65.00,
      size: '50ml',
      description: 'Elegant floral scent'
    },
    {
      id: 13,
      name: 'Fresh Body Mist',
      category: 'Fragrances',
      price: 18.00,
      size: '100ml',
      description: 'Light refreshing spray'
    },
    // Tools & Brushes
    {
      id: 14,
      name: 'Makeup Brush Set',
      category: 'Tools & Brushes',
      price: 38.99,
      size: '10 pieces',
      description: 'Professional brush collection'
    },
    {
      id: 15,
      name: 'Beauty Blender',
      category: 'Tools & Brushes',
      price: 12.99,
      size: '1 piece',
      description: 'Makeup sponge applicator'
    },
    // Bath & Body
    {
      id: 16,
      name: 'Body Lotion',
      category: 'Bath & Body',
      price: 22.00,
      size: '200ml',
      description: 'Moisturizing body cream'
    },
    {
      id: 17,
      name: 'Exfoliating Scrub',
      category: 'Bath & Body',
      price: 18.50,
      size: '150ml',
      description: 'Gentle body exfoliator'
    }
  ];

  // Generic categories for all beauty product vendors
  const categories = ['All', 'Makeup', 'Skincare', 'Haircare', 'Fragrances', 'Tools & Brushes', 'Bath & Body'];

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const getProductQuantity = (productId: number) => {
    return cartItems.find(item => item.id === productId)?.quantity || 0;
  };

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-gray-900">{vendorName}</h1>
            <p className="text-sm text-gray-600">Browse products</p>
          </div>
          {totalCartItems > 0 && (
            <button
              onClick={onViewCart}
              className="relative p-2 text-gray-900"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 text-white rounded-full text-xs flex items-center justify-center">
                {totalCartItems}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Category Tabs */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 overflow-x-auto">
        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products List */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-3">
          {filteredProducts.map((product) => {
            const quantity = getProductQuantity(product.id);
            return (
              <div
                key={product.id}
                className="bg-gray-50 border border-gray-200 rounded-xl p-4"
              >
                <div className="flex items-start gap-4">
                  {/* Product Image Placeholder */}
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 border-2 border-gray-300">
                    <div className="w-16 h-16 bg-gray-400 rounded"></div>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-gray-900 mb-1">{product.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-900">${product.price.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">{product.size}</p>
                      </div>
                      
                      {quantity === 0 ? (
                        <button
                          onClick={() => onAddToCart(product)}
                          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onRemoveFromCart(product.id)}
                            className="w-8 h-8 bg-gray-900 text-white rounded-lg hover:bg-gray-800 flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-gray-900">{quantity}</span>
                          <button
                            onClick={() => onAddToCart(product)}
                            className="w-8 h-8 bg-gray-900 text-white rounded-lg hover:bg-gray-800 flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}