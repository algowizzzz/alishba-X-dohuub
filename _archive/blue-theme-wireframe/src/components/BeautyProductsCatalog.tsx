import { ArrowLeft, Plus, ShoppingCart, Minus, Gift } from 'lucide-react';
import { FlowerLotus } from '@phosphor-icons/react';
import { PlaceholderImage } from './icons/PlaceholderImage';
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
  isPoweredByDoHuub?: boolean;
  onBack: () => void;
  onAddToCart: (product: BeautyProduct) => void;
  onRemoveFromCart: (productId: number) => void;
  cartItems: Array<{ id: number; quantity: number }>;
  onViewCart: () => void;
}

export function BeautyProductsCatalog({
  vendorName,
  isPoweredByDoHuub,
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
            <h1 className="font-semibold" style={{ color: 'var(--foreground)' }}>{vendorName}</h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Browse products</p>
          </div>
          {isPoweredByDoHuub && (
            <div
              className="px-2 py-0.5 rounded-full text-xs flex items-center text-white shadow-premium-sm"
              style={{ background: 'var(--primary-gradient)' }}
            >
              Powered by DoHuub
            </div>
          )}
          {totalCartItems > 0 && (
            <button
              onClick={onViewCart}
              className="relative p-2 rounded-xl transition-all duration-300 hover:shadow-card"
              style={{ backgroundColor: 'var(--card)' }}
            >
              <ShoppingCart className="w-6 h-6" style={{ color: 'var(--foreground)' }} />
              <span
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center text-white shadow-premium-sm"
                style={{ background: 'var(--primary-gradient)' }}
              >
                {totalCartItems}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Category Tabs */}
      <div className="px-6 py-3 overflow-x-auto relative z-10 glass" style={{ borderBottom: '1px solid rgba(46, 122, 217, 0.1)' }}>
        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300"
              style={{
                background: selectedCategory === category ? 'var(--primary-gradient)' : 'var(--muted)',
                color: selectedCategory === category ? 'white' : 'var(--muted-foreground)',
                boxShadow: selectedCategory === category ? '0 4px 12px rgba(46, 122, 217, 0.3)' : 'none'
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products List */}
      <div className="flex-1 overflow-y-auto px-6 py-6 relative z-10">
        {/* Points Earning Banner */}
        {isPoweredByDoHuub && (
          <div
            className="p-4 rounded-xl shadow-premium-sm mb-6"
            style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(249, 115, 22, 0.1))',
              border: '1px solid rgba(245, 158, 11, 0.3)'
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)' }}
              >
                <Gift className="w-5 h-5" style={{ color: 'rgb(245, 158, 11)' }} />
              </div>
              <div>
                <p className="font-semibold" style={{ color: 'rgb(180, 83, 9)' }}>
                  Earn points on this purchase
                </p>
                <p className="text-sm" style={{ color: 'rgb(217, 119, 6)' }}>
                  1 point per $1 spent • Points added after delivery
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {filteredProducts.map((product, index) => {
            const quantity = getProductQuantity(product.id);
            return (
              <div
                key={product.id}
                className="p-4 rounded-xl shadow-card transition-all duration-300 hover:shadow-premium-sm"
                style={{
                  backgroundColor: 'var(--card)',
                                  }}
              >
                <div className="flex items-start gap-4">
                  {/* Product Image Placeholder */}
                  <PlaceholderImage variant="beauty-product" className="w-20 h-20 rounded-xl flex-shrink-0" iconSize={24} />

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium mb-1" style={{ color: 'var(--foreground)' }}>{product.name}</h4>
                    <p className="text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>{product.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold" style={{ color: 'var(--primary)' }}>${product.price.toFixed(2)}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{product.size}</p>
                      </div>

                      {quantity === 0 ? (
                        <button
                          onClick={() => onAddToCart(product)}
                          className="px-4 py-2 rounded-xl flex items-center gap-2 text-white transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.02] active:scale-[0.98]"
                          style={{ background: 'var(--primary-gradient)' }}
                        >
                          <Plus className="w-4 h-4" />
                          Add
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onRemoveFromCart(product.id)}
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-[1.1]"
                            style={{ background: 'var(--primary-gradient)' }}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-semibold" style={{ color: 'var(--foreground)' }}>{quantity}</span>
                          <button
                            onClick={() => onAddToCart(product)}
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-[1.1]"
                            style={{ background: 'var(--primary-gradient)' }}
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
