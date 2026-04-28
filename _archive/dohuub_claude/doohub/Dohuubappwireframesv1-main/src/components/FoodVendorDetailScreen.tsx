import { ArrowLeft, Plus, Minus, Star, Clock, ShoppingCart, Image as ImageIcon } from 'lucide-react';
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
        // Chef's Recommendations
        { id: baseId + 1, name: 'Dragon Roll', description: 'Specialty roll with eel, avocado, and tobiko', price: 18.99, category: "Chef's Recommendations" },
        { id: baseId + 2, name: 'Chef\'s Sashimi Platter', description: 'Assorted fresh sashimi selection', price: 24.99, category: "Chef's Recommendations" },
        
        // Starters
        { id: baseId + 3, name: 'Edamame', description: 'Steamed soybeans with sea salt', price: 5.99, category: 'Starters' },
        { id: baseId + 4, name: 'Miso Soup', description: 'Traditional Japanese soybean soup', price: 4.99, category: 'Starters' },
        { id: baseId + 5, name: 'Gyoza', description: 'Pan-fried pork dumplings', price: 8.99, category: 'Starters' },
        { id: baseId + 6, name: 'Seaweed Salad', description: 'Marinated wakame seaweed', price: 6.99, category: 'Starters' },
        
        // Mains
        { id: baseId + 7, name: 'California Roll', description: 'Crab, avocado, and cucumber roll', price: 10.99, category: 'Mains' },
        { id: baseId + 8, name: 'Spicy Tuna Roll', description: 'Spicy tuna with cucumber', price: 12.99, category: 'Mains' },
        { id: baseId + 9, name: 'Salmon Nigiri', description: 'Fresh salmon on seasoned rice', price: 14.99, category: 'Mains' },
        { id: baseId + 10, name: 'Rainbow Roll', description: 'California roll topped with assorted fish', price: 16.99, category: 'Mains' },
        { id: baseId + 11, name: 'Teriyaki Chicken', description: 'Grilled chicken with teriyaki glaze', price: 15.99, category: 'Mains' },
        { id: baseId + 12, name: 'Tempura Platter', description: 'Assorted tempura vegetables and shrimp', price: 17.99, category: 'Mains' },
        
        // Desserts
        { id: baseId + 13, name: 'Dorayaki', description: 'Japanese red bean pancake', price: 5.99, category: 'Desserts' },
        { id: baseId + 14, name: 'Green Tea Cheesecake', description: 'Creamy cheesecake with matcha', price: 7.99, category: 'Desserts' },
        
        // Ice Cream
        { id: baseId + 15, name: 'Mochi Ice Cream', description: 'Rice cake filled with ice cream', price: 6.99, category: 'Ice Cream' },
        { id: baseId + 16, name: 'Green Tea Ice Cream', description: 'Creamy matcha ice cream', price: 5.99, category: 'Ice Cream' },
        
        // Beverages
        { id: baseId + 17, name: 'Green Tea', description: 'Hot or iced Japanese green tea', price: 3.99, category: 'Beverages' },
        { id: baseId + 18, name: 'Ramune', description: 'Japanese marble soda', price: 4.99, category: 'Beverages' },
        { id: baseId + 19, name: 'Sake', description: 'Premium Japanese rice wine', price: 8.99, category: 'Beverages' }
      ];
      
    case 3: // Taco Fiesta - Mexican, Tacos
      return [
        // Chef's Recommendations
        { id: baseId + 1, name: 'Carne Asada Tacos', description: 'Grilled steak tacos with special marinade', price: 14.99, category: "Chef's Recommendations" },
        { id: baseId + 2, name: 'Molcajete for Two', description: 'Sizzling stone bowl with mixed meats', price: 28.99, category: "Chef's Recommendations" },
        
        // Starters
        { id: baseId + 3, name: 'Chips & Guacamole', description: 'Fresh guacamole with tortilla chips', price: 8.99, category: 'Starters' },
        { id: baseId + 4, name: 'Queso Fundido', description: 'Melted cheese with chorizo', price: 9.99, category: 'Starters' },
        { id: baseId + 5, name: 'Nachos Supreme', description: 'Loaded nachos with all the toppings', price: 12.99, category: 'Starters' },
        { id: baseId + 6, name: 'Elote', description: 'Mexican street corn', price: 6.99, category: 'Starters' },
        
        // Mains
        { id: baseId + 7, name: 'Beef Tacos', description: 'Seasoned beef with fresh toppings', price: 11.99, category: 'Mains' },
        { id: baseId + 8, name: 'Chicken Burrito', description: 'Large burrito with grilled chicken', price: 13.99, category: 'Mains' },
        { id: baseId + 9, name: 'Steak Fajitas', description: 'Sizzling steak with peppers and onions', price: 18.99, category: 'Mains' },
        { id: baseId + 10, name: 'Carnitas Bowl', description: 'Slow-cooked pork with rice and beans', price: 14.99, category: 'Mains' },
        { id: baseId + 11, name: 'Fish Tacos', description: 'Grilled fish with cabbage slaw', price: 13.99, category: 'Mains' },
        { id: baseId + 12, name: 'Enchiladas Verdes', description: 'Chicken enchiladas with green sauce', price: 14.99, category: 'Mains' },
        
        // Desserts
        { id: baseId + 13, name: 'Churros', description: 'Fried dough with cinnamon sugar', price: 6.99, category: 'Desserts' },
        { id: baseId + 14, name: 'Flan', description: 'Caramel custard dessert', price: 5.99, category: 'Desserts' },
        { id: baseId + 15, name: 'Tres Leches Cake', description: 'Three milk soaked cake', price: 7.99, category: 'Desserts' },
        
        // Ice Cream
        { id: baseId + 16, name: 'Fried Ice Cream', description: 'Crispy coated vanilla ice cream', price: 6.99, category: 'Ice Cream' },
        
        // Beverages
        { id: baseId + 17, name: 'Horchata', description: 'Sweet rice milk with cinnamon', price: 4.99, category: 'Beverages' },
        { id: baseId + 18, name: 'Jamaica', description: 'Hibiscus flower tea', price: 4.99, category: 'Beverages' },
        { id: baseId + 19, name: 'Tamarindo', description: 'Sweet and tangy tamarind drink', price: 4.99, category: 'Beverages' }
      ];
      
    case 4: // Biryani House - Indian, Biryani
      return [
        // Chef's Recommendations
        { id: baseId + 1, name: 'Hyderabadi Biryani', description: 'Traditional Hyderabad style biryani with lamb', price: 19.99, category: "Chef's Recommendations" },
        { id: baseId + 2, name: 'Tandoori Mixed Grill', description: 'Assorted meats from the tandoor', price: 22.99, category: "Chef's Recommendations" },
        
        // Starters
        { id: baseId + 3, name: 'Samosas', description: 'Crispy pastries filled with spiced potatoes', price: 6.99, category: 'Starters' },
        { id: baseId + 4, name: 'Pakoras', description: 'Mixed vegetable fritters', price: 7.99, category: 'Starters' },
        { id: baseId + 5, name: 'Chicken Tikka', description: 'Marinated chicken in tandoor', price: 11.99, category: 'Starters' },
        { id: baseId + 6, name: 'Paneer Tikka', description: 'Grilled cottage cheese cubes', price: 10.99, category: 'Starters' },
        
        // Mains
        { id: baseId + 7, name: 'Butter Chicken', description: 'Creamy tomato curry with chicken', price: 16.99, category: 'Mains' },
        { id: baseId + 8, name: 'Lamb Curry', description: 'Tender lamb in rich curry sauce', price: 19.99, category: 'Mains' },
        { id: baseId + 9, name: 'Palak Paneer', description: 'Cottage cheese in spinach gravy', price: 14.99, category: 'Mains' },
        { id: baseId + 10, name: 'Chicken Biryani', description: 'Fragrant basmati rice with spiced chicken', price: 15.99, category: 'Mains' },
        { id: baseId + 11, name: 'Vegetable Biryani', description: 'Mixed vegetables with basmati rice', price: 13.99, category: 'Mains' },
        { id: baseId + 12, name: 'Rogan Josh', description: 'Kashmiri lamb curry', price: 18.99, category: 'Mains' },
        
        // Desserts
        { id: baseId + 13, name: 'Gulab Jamun', description: 'Sweet milk balls in syrup', price: 5.99, category: 'Desserts' },
        { id: baseId + 14, name: 'Kheer', description: 'Rice pudding with cardamom', price: 5.99, category: 'Desserts' },
        { id: baseId + 15, name: 'Rasmalai', description: 'Cheese patties in sweet cream', price: 6.99, category: 'Desserts' },
        
        // Ice Cream
        { id: baseId + 16, name: 'Kulfi', description: 'Traditional Indian ice cream', price: 5.99, category: 'Ice Cream' },
        { id: baseId + 17, name: 'Mango Kulfi', description: 'Mango flavored kulfi', price: 6.99, category: 'Ice Cream' },
        
        // Beverages
        { id: baseId + 18, name: 'Mango Lassi', description: 'Yogurt drink with mango', price: 4.99, category: 'Beverages' },
        { id: baseId + 19, name: 'Masala Chai', description: 'Spiced Indian tea', price: 3.99, category: 'Beverages' },
        { id: baseId + 20, name: 'Sweet Lassi', description: 'Sweet yogurt drink', price: 4.49, category: 'Beverages' }
      ];
      
    case 5: // Burger Paradise - American, Burgers
      return [
        // Chef's Recommendations
        { id: baseId + 1, name: 'Paradise Signature Burger', description: 'Double patty with special sauce and premium toppings', price: 16.99, category: "Chef's Recommendations" },
        { id: baseId + 2, name: 'Smokehouse BBQ Platter', description: 'Ribs, pulled pork, and brisket combo', price: 24.99, category: "Chef's Recommendations" },
        
        // Starters
        { id: baseId + 3, name: 'Chicken Wings', description: 'Buffalo wings with ranch dressing', price: 11.99, category: 'Starters' },
        { id: baseId + 4, name: 'Onion Rings', description: 'Crispy beer-battered onion rings', price: 7.99, category: 'Starters' },
        { id: baseId + 5, name: 'Loaded Fries', description: 'Fries topped with cheese and bacon', price: 9.99, category: 'Starters' },
        { id: baseId + 6, name: 'Mozzarella Sticks', description: 'Fried cheese sticks with marinara', price: 8.99, category: 'Starters' },
        
        // Mains
        { id: baseId + 7, name: 'Classic Burger', description: 'Beef patty with lettuce, tomato, and pickles', price: 12.99, category: 'Mains' },
        { id: baseId + 8, name: 'Bacon Cheeseburger', description: 'Double patty with bacon and cheese', price: 15.99, category: 'Mains' },
        { id: baseId + 9, name: 'Mushroom Swiss Burger', description: 'Burger with sautéed mushrooms and swiss', price: 14.99, category: 'Mains' },
        { id: baseId + 10, name: 'Crispy Chicken Sandwich', description: 'Fried chicken with coleslaw', price: 13.99, category: 'Mains' },
        { id: baseId + 11, name: 'BBQ Pulled Pork Sandwich', description: 'Slow-cooked pork with BBQ sauce', price: 13.99, category: 'Mains' },
        { id: baseId + 12, name: 'Philly Cheesesteak', description: 'Thinly sliced steak with cheese', price: 14.99, category: 'Mains' },
        
        // Desserts
        { id: baseId + 13, name: 'Apple Pie', description: 'Warm apple pie', price: 6.99, category: 'Desserts' },
        { id: baseId + 14, name: 'Brownie Sundae', description: 'Warm brownie with ice cream', price: 7.99, category: 'Desserts' },
        
        // Ice Cream
        { id: baseId + 15, name: 'Milkshake', description: 'Thick shake - vanilla, chocolate, or strawberry', price: 5.99, category: 'Ice Cream' },
        { id: baseId + 16, name: 'Ice Cream Sundae', description: 'Three scoops with toppings', price: 6.99, category: 'Ice Cream' },
        
        // Beverages
        { id: baseId + 17, name: 'Root Beer Float', description: 'Root beer with vanilla ice cream', price: 4.99, category: 'Beverages' },
        { id: baseId + 18, name: 'Fresh Lemonade', description: 'House-made lemonade', price: 3.99, category: 'Beverages' },
        { id: baseId + 19, name: 'Iced Coffee', description: 'Cold brew coffee', price: 4.49, category: 'Beverages' }
      ];
      
    case 6: // Thai Delight - Thai, Asian
      return [
        // Chef's Recommendations
        { id: baseId + 1, name: 'Royal Thai Curry', description: 'Premium curry with seafood and coconut', price: 19.99, category: "Chef's Recommendations" },
        { id: baseId + 2, name: 'Chef\'s Special Pad Thai', description: 'Signature pad thai with tiger prawns', price: 18.99, category: "Chef's Recommendations" },
        
        // Starters
        { id: baseId + 3, name: 'Spring Rolls', description: 'Fresh vegetables wrapped in rice paper', price: 7.99, category: 'Starters' },
        { id: baseId + 4, name: 'Tom Yum Soup', description: 'Spicy and sour Thai soup', price: 8.99, category: 'Starters' },
        { id: baseId + 5, name: 'Satay Chicken', description: 'Grilled chicken skewers with peanut sauce', price: 10.99, category: 'Starters' },
        { id: baseId + 6, name: 'Thai Dumplings', description: 'Steamed pork dumplings', price: 9.99, category: 'Starters' },
        
        // Mains
        { id: baseId + 7, name: 'Pad Thai', description: 'Stir-fried rice noodles with shrimp', price: 14.99, category: 'Mains' },
        { id: baseId + 8, name: 'Green Curry', description: 'Coconut curry with chicken and vegetables', price: 15.99, category: 'Mains' },
        { id: baseId + 9, name: 'Massaman Curry', description: 'Rich curry with beef and peanuts', price: 16.99, category: 'Mains' },
        { id: baseId + 10, name: 'Basil Fried Rice', description: 'Spicy fried rice with Thai basil', price: 13.99, category: 'Mains' },
        { id: baseId + 11, name: 'Pineapple Fried Rice', description: 'Fried rice served in pineapple', price: 15.99, category: 'Mains' },
        { id: baseId + 12, name: 'Drunken Noodles', description: 'Wide rice noodles with basil', price: 14.99, category: 'Mains' },
        
        // Desserts
        { id: baseId + 13, name: 'Mango Sticky Rice', description: 'Sweet rice with fresh mango', price: 7.99, category: 'Desserts' },
        { id: baseId + 14, name: 'Fried Banana', description: 'Crispy banana with honey', price: 5.99, category: 'Desserts' },
        
        // Ice Cream
        { id: baseId + 15, name: 'Coconut Ice Cream', description: 'Fresh coconut ice cream', price: 5.99, category: 'Ice Cream' },
        { id: baseId + 16, name: 'Thai Tea Ice Cream', description: 'Creamy Thai tea flavored ice cream', price: 6.99, category: 'Ice Cream' },
        
        // Beverages
        { id: baseId + 17, name: 'Thai Iced Tea', description: 'Sweet tea with condensed milk', price: 4.99, category: 'Beverages' },
        { id: baseId + 18, name: 'Coconut Water', description: 'Fresh young coconut water', price: 5.99, category: 'Beverages' },
        { id: baseId + 19, name: 'Lychee Juice', description: 'Sweet lychee fruit juice', price: 4.99, category: 'Beverages' }
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
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-gray-900">
            <ArrowLeft className="w-6 h-6" strokeWidth={2} />
          </button>
          <div className="flex-1">
            <h1 className="text-gray-900">{vendor.name}</h1>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-gray-700 fill-gray-700" />
                <span className="text-gray-700">{vendor.rating}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{vendor.deliveryTime}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onViewReviews} 
            className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200"
          >
            View Reviews
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border-b-2 border-gray-200 px-6 py-4 overflow-x-auto">
        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-32">
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const quantity = getItemQuantity(item.id);
            return (
              <div key={item.id} className="bg-white rounded-xl border-2 border-gray-200 p-4">
                <div className="flex gap-4">
                  {/* Item Image */}
                  <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <ImageIcon className="w-10 h-10 text-gray-400" />
                  </div>

                  {/* Item Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                    <p className="text-gray-900">${item.price.toFixed(2)}</p>
                  </div>

                  {/* Add/Quantity Control */}
                  <div className="flex items-center">
                    {quantity === 0 ? (
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-gray-900">{quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded"
                        >
                          <Plus className="w-4 h-4" />
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
        <div className="absolute bottom-0 left-0 right-0 bg-gray-900 text-white px-6 py-4">
          <button
            onClick={onCheckout}
            className="w-full flex items-center justify-between"
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