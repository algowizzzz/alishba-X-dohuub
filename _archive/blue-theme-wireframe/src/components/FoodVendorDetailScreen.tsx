import { ArrowLeft, Plus, Minus, Star, Clock, ShoppingCart, Image as ImageIcon, Gift } from 'lucide-react';
import { ForkKnife } from '@phosphor-icons/react';
import { PlaceholderImage } from './icons/PlaceholderImage';
import { useState, useEffect } from 'react';
import type { FoodVendor } from './FoodVendorsListScreen';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

interface FoodVendorDetailScreenProps {
  vendor: FoodVendor;
  initialCart: CartItem[];
  onBack: () => void;
  onAddToCart: (item: MenuItem) => void;
  onUpdateCart: (cart: CartItem[]) => void;
  onCheckout: () => void;
  onViewReviews: () => void;
}

// Function to generate menu items based on vendor cuisine
const getVendorMenu = (vendorId: number, vendorName: string): MenuItem[] => {
  const baseId = vendorId * 100;

  switch (vendorId) {
    case 1: // Pizza Palace - Italian, Pizza
      return [
        // Chef's Recommendations
        { id: baseId + 1, name: 'Signature Margherita Pizza', description: 'Our famous wood-fired pizza with fresh mozzarella', price: 16.99, category: "Chef's Recommendations" },
        { id: baseId + 2, name: 'Truffle Fettuccine Alfredo', description: 'Creamy alfredo with black truffle oil', price: 18.99, category: "Chef's Recommendations" },

        // Starters
        { id: baseId + 3, name: 'Garlic Knots', description: 'Soft bread knots with garlic butter and herbs', price: 6.99, category: 'Starters' },
        { id: baseId + 4, name: 'Bruschetta', description: 'Toasted bread with tomatoes, basil, and olive oil', price: 8.99, category: 'Starters' },
        { id: baseId + 5, name: 'Mozzarella Sticks', description: 'Breaded mozzarella with marinara sauce', price: 7.99, category: 'Starters' },
        { id: baseId + 6, name: 'Caprese Salad', description: 'Fresh mozzarella, tomatoes, and basil', price: 9.99, category: 'Starters' },

        // Mains
        { id: baseId + 7, name: 'Pepperoni Pizza', description: 'Loaded with pepperoni and cheese', price: 15.99, category: 'Mains' },
        { id: baseId + 8, name: 'BBQ Chicken Pizza', description: 'BBQ sauce, chicken, onions, and cilantro', price: 17.99, category: 'Mains' },
        { id: baseId + 9, name: 'Spaghetti Carbonara', description: 'Creamy carbonara with bacon and parmesan', price: 15.99, category: 'Mains' },
        { id: baseId + 10, name: 'Penne Arrabiata', description: 'Spicy tomato sauce with penne', price: 13.99, category: 'Mains' },
        { id: baseId + 11, name: 'Lasagna', description: 'Layers of pasta, meat sauce, and cheese', price: 16.99, category: 'Mains' },

        // Desserts
        { id: baseId + 12, name: 'Tiramisu', description: 'Classic Italian coffee-flavored dessert', price: 7.99, category: 'Desserts' },
        { id: baseId + 13, name: 'Cannoli', description: 'Crispy pastry filled with sweet ricotta', price: 6.99, category: 'Desserts' },

        // Ice Cream
        { id: baseId + 14, name: 'Gelato Trio', description: 'Three scoops of Italian gelato', price: 7.99, category: 'Ice Cream' },
        { id: baseId + 15, name: 'Affogato', description: 'Vanilla gelato with espresso', price: 6.99, category: 'Ice Cream' },

        // Beverages
        { id: baseId + 16, name: 'Italian Soda', description: 'Sparkling soda with fruit syrup', price: 3.99, category: 'Beverages' },
        { id: baseId + 17, name: 'Iced Tea', description: 'Fresh brewed iced tea', price: 2.99, category: 'Beverages' },
        { id: baseId + 18, name: 'San Pellegrino', description: 'Sparkling mineral water', price: 4.99, category: 'Beverages' }
      ];

    case 2: // Sushi Express - Japanese, Sushi
      return [
        { id: baseId + 1, name: 'Dragon Roll', description: 'Specialty roll with eel, avocado, and tobiko', price: 18.99, category: "Chef's Recommendations" },
        { id: baseId + 2, name: 'Chef\'s Sashimi Platter', description: 'Assorted fresh sashimi selection', price: 24.99, category: "Chef's Recommendations" },
        { id: baseId + 3, name: 'Edamame', description: 'Steamed soybeans with sea salt', price: 5.99, category: 'Starters' },
        { id: baseId + 4, name: 'Miso Soup', description: 'Traditional Japanese soybean soup', price: 4.99, category: 'Starters' },
        { id: baseId + 5, name: 'Gyoza', description: 'Pan-fried pork dumplings', price: 8.99, category: 'Starters' },
        { id: baseId + 6, name: 'California Roll', description: 'Crab, avocado, and cucumber roll', price: 10.99, category: 'Mains' },
        { id: baseId + 7, name: 'Spicy Tuna Roll', description: 'Spicy tuna with cucumber', price: 12.99, category: 'Mains' },
        { id: baseId + 8, name: 'Salmon Nigiri', description: 'Fresh salmon on seasoned rice', price: 14.99, category: 'Mains' },
        { id: baseId + 9, name: 'Teriyaki Chicken', description: 'Grilled chicken with teriyaki glaze', price: 15.99, category: 'Mains' },
        { id: baseId + 10, name: 'Mochi Ice Cream', description: 'Rice cake filled with ice cream', price: 6.99, category: 'Desserts' },
        { id: baseId + 11, name: 'Green Tea', description: 'Hot or iced Japanese green tea', price: 3.99, category: 'Beverages' }
      ];

    case 3: // Taco Fiesta - Mexican, Tacos
      return [
        { id: baseId + 1, name: 'Carne Asada Tacos', description: 'Grilled steak tacos with special marinade', price: 14.99, category: "Chef's Recommendations" },
        { id: baseId + 2, name: 'Chips & Guacamole', description: 'Fresh guacamole with tortilla chips', price: 8.99, category: 'Starters' },
        { id: baseId + 3, name: 'Queso Fundido', description: 'Melted cheese with chorizo', price: 9.99, category: 'Starters' },
        { id: baseId + 4, name: 'Beef Tacos', description: 'Seasoned beef with fresh toppings', price: 11.99, category: 'Mains' },
        { id: baseId + 5, name: 'Chicken Burrito', description: 'Large burrito with grilled chicken', price: 13.99, category: 'Mains' },
        { id: baseId + 6, name: 'Fish Tacos', description: 'Grilled fish with cabbage slaw', price: 13.99, category: 'Mains' },
        { id: baseId + 7, name: 'Churros', description: 'Fried dough with cinnamon sugar', price: 6.99, category: 'Desserts' },
        { id: baseId + 8, name: 'Horchata', description: 'Sweet rice milk with cinnamon', price: 4.99, category: 'Beverages' }
      ];

    case 4: // Biryani House - Indian, Biryani
      return [
        { id: baseId + 1, name: 'Hyderabadi Biryani', description: 'Traditional Hyderabad style biryani with lamb', price: 19.99, category: "Chef's Recommendations" },
        { id: baseId + 2, name: 'Samosas', description: 'Crispy pastries filled with spiced potatoes', price: 6.99, category: 'Starters' },
        { id: baseId + 3, name: 'Chicken Tikka', description: 'Marinated chicken in tandoor', price: 11.99, category: 'Starters' },
        { id: baseId + 4, name: 'Butter Chicken', description: 'Creamy tomato curry with chicken', price: 16.99, category: 'Mains' },
        { id: baseId + 5, name: 'Chicken Biryani', description: 'Fragrant basmati rice with spiced chicken', price: 15.99, category: 'Mains' },
        { id: baseId + 6, name: 'Palak Paneer', description: 'Cottage cheese in spinach gravy', price: 14.99, category: 'Mains' },
        { id: baseId + 7, name: 'Gulab Jamun', description: 'Sweet milk balls in syrup', price: 5.99, category: 'Desserts' },
        { id: baseId + 8, name: 'Mango Lassi', description: 'Yogurt drink with mango', price: 4.99, category: 'Beverages' }
      ];

    case 5: // Burger Paradise - American, Burgers
      return [
        { id: baseId + 1, name: 'Paradise Signature Burger', description: 'Double patty with special sauce and premium toppings', price: 16.99, category: "Chef's Recommendations" },
        { id: baseId + 2, name: 'Chicken Wings', description: 'Buffalo wings with ranch dressing', price: 11.99, category: 'Starters' },
        { id: baseId + 3, name: 'Onion Rings', description: 'Crispy beer-battered onion rings', price: 7.99, category: 'Starters' },
        { id: baseId + 4, name: 'Classic Burger', description: 'Beef patty with lettuce, tomato, and pickles', price: 12.99, category: 'Mains' },
        { id: baseId + 5, name: 'Bacon Cheeseburger', description: 'Double patty with bacon and cheese', price: 15.99, category: 'Mains' },
        { id: baseId + 6, name: 'Crispy Chicken Sandwich', description: 'Fried chicken with coleslaw', price: 13.99, category: 'Mains' },
        { id: baseId + 7, name: 'Milkshake', description: 'Thick shake - vanilla, chocolate, or strawberry', price: 5.99, category: 'Beverages' }
      ];

    case 6: // Thai Delight - Thai, Asian
      return [
        { id: baseId + 1, name: 'Royal Thai Curry', description: 'Premium curry with seafood and coconut', price: 19.99, category: "Chef's Recommendations" },
        { id: baseId + 2, name: 'Spring Rolls', description: 'Fresh vegetables wrapped in rice paper', price: 7.99, category: 'Starters' },
        { id: baseId + 3, name: 'Tom Yum Soup', description: 'Spicy and sour Thai soup', price: 8.99, category: 'Starters' },
        { id: baseId + 4, name: 'Pad Thai', description: 'Stir-fried rice noodles with shrimp', price: 14.99, category: 'Mains' },
        { id: baseId + 5, name: 'Green Curry', description: 'Coconut curry with chicken and vegetables', price: 15.99, category: 'Mains' },
        { id: baseId + 6, name: 'Basil Fried Rice', description: 'Spicy fried rice with Thai basil', price: 13.99, category: 'Mains' },
        { id: baseId + 7, name: 'Mango Sticky Rice', description: 'Sweet rice with fresh mango', price: 7.99, category: 'Desserts' },
        { id: baseId + 8, name: 'Thai Iced Tea', description: 'Sweet tea with condensed milk', price: 4.99, category: 'Beverages' }
      ];

    default:
      return [];
  }
};

export function FoodVendorDetailScreen({
  vendor,
  initialCart,
  onBack,
  onAddToCart,
  onUpdateCart,
  onCheckout,
  onViewReviews
}: FoodVendorDetailScreenProps) {
  const [cart, setCart] = useState<CartItem[]>(initialCart || []);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Sync cart with parent state
  useEffect(() => {
    setCart(initialCart || []);
  }, [initialCart]);

  const menuItems = getVendorMenu(vendor.id, vendor.name);
  const categories = ['All', "Chef's Recommendations", 'Starters', 'Mains', 'Desserts', 'Ice Cream', 'Beverages'];

  const filteredItems = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  const handleAddToCart = (item: MenuItem) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);

    // If item already exists in cart, just increment quantity
    if (existingItem) {
      const updatedCart = cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
      setCart(updatedCart);
      onUpdateCart(updatedCart);
    } else {
      // New item - check with parent first (for vendor validation)
      onAddToCart(item);
    }
  };

  const handleUpdateQuantity = (itemId: number, change: number) => {
    const updatedCart = cart.map(item => {
      if (item.id === itemId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0);
    setCart(updatedCart);
    onUpdateCart(updatedCart);
  };

  const getItemQuantity = (itemId: number) => {
    const item = cart.find(cartItem => cartItem.id === itemId);
    return item ? item.quantity : 0;
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

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
          <h1 className="flex-1 font-semibold" style={{ color: 'var(--foreground)' }}>{vendor.name}</h1>
          {vendor.isPoweredByDoHuub && (
            <div
              className="px-2 py-0.5 rounded-full text-xs flex items-center gap-1 text-white shadow-premium-sm"
              style={{ background: 'var(--primary-gradient)' }}
            >
              Powered by DoHuub
            </div>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="px-6 py-4 glass relative z-10 overflow-x-auto" style={{ borderBottom: '1px solid rgba(46, 122, 217, 0.1)' }}>
        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300"
              style={{
                background: selectedCategory === category ? 'var(--primary-gradient)' : 'var(--card)',
                color: selectedCategory === category ? 'white' : 'var(--foreground)',
                border: selectedCategory === category ? 'none' : '1px solid var(--border)'
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-32 relative z-10">
        {/* Points Earning Banner */}
        {vendor.isPoweredByDoHuub && (
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
                  Earn points on this service
                </p>
                <p className="text-sm" style={{ color: 'rgb(217, 119, 6)' }}>
                  1 point per $1 spent • Points added after delivery
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {filteredItems.map((item, index) => {
            const quantity = getItemQuantity(item.id);
            return (
              <div
                key={item.id}
                className="rounded-xl p-4 shadow-card"
                style={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                                  }}
              >
                <div className="flex gap-4">
                  {/* Item Image */}
                  <PlaceholderImage variant="food" className="w-20 h-20 rounded-lg flex-shrink-0" iconSize={28} />

                  {/* Item Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium mb-1" style={{ color: 'var(--foreground)' }}>{item.name}</h3>
                    <p className="text-sm mb-2 line-clamp-2" style={{ color: 'var(--muted-foreground)' }}>{item.description}</p>
                    <p className="font-semibold" style={{ color: 'var(--primary)' }}>${item.price.toFixed(2)}</p>
                  </div>

                  {/* Add/Quantity Control */}
                  <div className="flex items-center">
                    {quantity === 0 ? (
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="px-4 py-2 rounded-lg text-white transition-all duration-300 hover:shadow-premium-sm hover:scale-105 active:scale-95"
                        style={{ background: 'var(--primary-gradient)' }}
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    ) : (
                      <div
                        className="flex items-center gap-2 rounded-lg p-1"
                        style={{ backgroundColor: 'var(--muted)' }}
                      >
                        <button
                          onClick={() => handleUpdateQuantity(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center rounded transition-all duration-300 hover:bg-white/50"
                        >
                          <Minus className="w-4 h-4" style={{ color: 'var(--foreground)' }} />
                        </button>
                        <span className="w-8 text-center font-medium" style={{ color: 'var(--foreground)' }}>{quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center rounded transition-all duration-300 hover:bg-white/50"
                        >
                          <Plus className="w-4 h-4" style={{ color: 'var(--foreground)' }} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cart Footer */}
      {cart.length > 0 && (
        <div
          className="absolute bottom-0 left-0 right-0 px-6 py-4"
          style={{
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(46, 122, 217, 0.1)',
            boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.08)',
            zIndex: 9999,
            pointerEvents: 'auto'
          }}
        >
          <button
            onClick={onCheckout}
            className="w-full flex items-center justify-between py-4 px-6 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'var(--primary-gradient)', pointerEvents: 'auto' }}
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              <span>{getTotalItems()} items</span>
            </div>
            <span>View Cart • ${getTotalPrice().toFixed(2)}</span>
          </button>
        </div>
      )}
    </div>
  );
}
