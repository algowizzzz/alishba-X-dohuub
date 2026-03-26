import { ArrowLeft, Plus, Minus, Star, Clock, ShoppingCart, Image as ImageIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { GroceryVendor } from './GroceryVendorsListScreen';

export interface GroceryItem {
  id: number;
  name: string;
  description: string;
  price: number;
  size: string;
  category: string;
}

export interface GroceryCartItem extends GroceryItem {
  quantity: number;
}

interface GroceryVendorDetailScreenProps {
  vendor: GroceryVendor;
  initialCart: GroceryCartItem[];
  onBack: () => void;
  onAddToCart: (item: GroceryItem) => void;
  onUpdateCart: (cart: GroceryCartItem[]) => void;
  onCheckout: () => void;
  onViewReviews: () => void;
}

// Function to generate grocery items based on vendor type
const getVendorGroceries = (vendorId: number, vendorName: string): GroceryItem[] => {
  const baseId = vendorId * 100;
  
  switch (vendorId) {
    case 1: // FreshMart - General Groceries
      return [
        // Fruits & Vegetables
        { id: baseId + 1, name: 'Fresh Bananas', description: 'Ripe yellow bananas', price: 2.99, size: '1 lb', category: 'Fruits & Vegetables' },
        { id: baseId + 2, name: 'Red Apples', description: 'Crisp and sweet apples', price: 4.99, size: '2 lbs', category: 'Fruits & Vegetables' },
        { id: baseId + 3, name: 'Baby Carrots', description: 'Pre-washed baby carrots', price: 3.49, size: '1 lb bag', category: 'Fruits & Vegetables' },
        { id: baseId + 4, name: 'Cherry Tomatoes', description: 'Sweet cherry tomatoes', price: 4.49, size: '1 pint', category: 'Fruits & Vegetables' },
        
        // Dairy & Eggs
        { id: baseId + 5, name: 'Whole Milk', description: 'Fresh whole milk', price: 4.99, size: '1 gallon', category: 'Dairy & Eggs' },
        { id: baseId + 6, name: 'Large Eggs', description: 'Grade A large eggs', price: 5.99, size: '12 count', category: 'Dairy & Eggs' },
        { id: baseId + 7, name: 'Cheddar Cheese', description: 'Sharp cheddar cheese', price: 6.99, size: '8 oz', category: 'Dairy & Eggs' },
        
        // Bakery
        { id: baseId + 8, name: 'White Bread', description: 'Soft white sandwich bread', price: 3.49, size: '20 oz', category: 'Bakery' },
        { id: baseId + 9, name: 'Bagels', description: 'Plain bagels', price: 4.99, size: '6 pack', category: 'Bakery' },
        
        // Pantry Essentials
        { id: baseId + 10, name: 'White Rice', description: 'Long grain white rice', price: 11.99, size: '5 lbs', category: 'Pantry Essentials' },
        { id: baseId + 11, name: 'Vegetable Oil', description: 'All-purpose cooking oil', price: 7.99, size: '48 oz', category: 'Pantry Essentials' },
        { id: baseId + 12, name: 'Spaghetti', description: 'Traditional spaghetti pasta', price: 2.99, size: '16 oz', category: 'Pantry Essentials' },
        
        // Snacks & Beverages
        { id: baseId + 13, name: 'Potato Chips', description: 'Classic salted chips', price: 3.99, size: '8 oz', category: 'Snacks & Beverages' },
        { id: baseId + 14, name: 'Orange Juice', description: '100% pure orange juice', price: 6.99, size: '64 oz', category: 'Snacks & Beverages' },
        
        // Household Items
        { id: baseId + 15, name: 'Paper Towels', description: 'Multi-purpose paper towels', price: 8.99, size: '6 rolls', category: 'Household Items' },
        { id: baseId + 16, name: 'Dish Soap', description: 'Lemon scented dish soap', price: 3.99, size: '24 oz', category: 'Household Items' }
      ];
      
    case 2: // QuickShop Express - Convenience Store
      return [
        // Fruits & Vegetables
        { id: baseId + 1, name: 'Snacking Apples', description: 'Small snack-size apples', price: 3.99, size: '4 pack', category: 'Fruits & Vegetables' },
        { id: baseId + 2, name: 'Pre-cut Fruit Bowl', description: 'Mixed fresh fruit bowl', price: 5.99, size: '12 oz', category: 'Fruits & Vegetables' },
        { id: baseId + 3, name: 'Mini Carrots', description: 'Individual carrot packs', price: 2.49, size: '3 oz', category: 'Fruits & Vegetables' },
        
        // Dairy & Eggs
        { id: baseId + 4, name: '2% Milk', description: 'Reduced fat milk', price: 3.49, size: 'Half gallon', category: 'Dairy & Eggs' },
        { id: baseId + 5, name: 'String Cheese', description: 'Mozzarella string cheese', price: 5.49, size: '8 pack', category: 'Dairy & Eggs' },
        { id: baseId + 6, name: 'Yogurt Cups', description: 'Assorted flavors', price: 4.99, size: '4 pack', category: 'Dairy & Eggs' },
        
        // Bakery
        { id: baseId + 7, name: 'Muffins', description: 'Blueberry muffins', price: 4.99, size: '4 pack', category: 'Bakery' },
        { id: baseId + 8, name: 'Donuts', description: 'Glazed donuts', price: 5.99, size: '6 pack', category: 'Bakery' },
        
        // Pantry Essentials
        { id: baseId + 9, name: 'Instant Noodles', description: 'Quick ramen noodles', price: 1.99, size: '3 oz', category: 'Pantry Essentials' },
        { id: baseId + 10, name: 'Canned Soup', description: 'Chicken noodle soup', price: 3.49, size: '10.5 oz', category: 'Pantry Essentials' },
        { id: baseId + 11, name: 'Cereal', description: 'Breakfast cereal', price: 5.99, size: '12 oz', category: 'Pantry Essentials' },
        
        // Snacks & Beverages
        { id: baseId + 12, name: 'Energy Bars', description: 'Protein energy bars', price: 6.99, size: '5 pack', category: 'Snacks & Beverages' },
        { id: baseId + 13, name: 'Soda', description: 'Assorted soda flavors', price: 5.99, size: '6 pack', category: 'Snacks & Beverages' },
        { id: baseId + 14, name: 'Candy Bars', description: 'Chocolate candy bars', price: 4.99, size: '4 pack', category: 'Snacks & Beverages' },
        
        // Household Items
        { id: baseId + 15, name: 'Tissues', description: 'Facial tissues', price: 2.99, size: 'Single box', category: 'Household Items' },
        { id: baseId + 16, name: 'Hand Sanitizer', description: 'Antibacterial gel', price: 4.99, size: '8 oz', category: 'Household Items' }
      ];
      
    case 3: // Healthy Harvest - Organic Foods
      return [
        // Fruits & Vegetables
        { id: baseId + 1, name: 'Organic Bananas', description: 'Certified organic bananas', price: 3.99, size: '1 lb', category: 'Fruits & Vegetables' },
        { id: baseId + 2, name: 'Organic Kale', description: 'Fresh organic kale', price: 4.99, size: '1 bunch', category: 'Fruits & Vegetables' },
        { id: baseId + 3, name: 'Organic Avocados', description: 'Ripe Hass avocados', price: 6.99, size: '3 pack', category: 'Fruits & Vegetables' },
        { id: baseId + 4, name: 'Organic Spinach', description: 'Baby spinach leaves', price: 4.49, size: '5 oz', category: 'Fruits & Vegetables' },
        
        // Dairy & Eggs
        { id: baseId + 5, name: 'Organic Milk', description: 'Grass-fed organic milk', price: 6.99, size: 'Half gallon', category: 'Dairy & Eggs' },
        { id: baseId + 6, name: 'Organic Eggs', description: 'Free-range organic eggs', price: 7.99, size: '12 count', category: 'Dairy & Eggs' },
        { id: baseId + 7, name: 'Greek Yogurt', description: 'Organic Greek yogurt', price: 5.99, size: '32 oz', category: 'Dairy & Eggs' },
        
        // Bakery
        { id: baseId + 8, name: 'Whole Grain Bread', description: '100% whole grain bread', price: 5.99, size: '24 oz', category: 'Bakery' },
        { id: baseId + 9, name: 'Organic Bagels', description: 'Whole wheat bagels', price: 6.99, size: '6 pack', category: 'Bakery' },
        
        // Pantry Essentials
        { id: baseId + 10, name: 'Quinoa', description: 'Organic tri-color quinoa', price: 9.99, size: '16 oz', category: 'Pantry Essentials' },
        { id: baseId + 11, name: 'Coconut Oil', description: 'Virgin coconut oil', price: 12.99, size: '16 oz', category: 'Pantry Essentials' },
        { id: baseId + 12, name: 'Almond Butter', description: 'Raw almond butter', price: 10.99, size: '12 oz', category: 'Pantry Essentials' },
        
        // Snacks & Beverages
        { id: baseId + 13, name: 'Trail Mix', description: 'Organic mixed nuts', price: 8.99, size: '10 oz', category: 'Snacks & Beverages' },
        { id: baseId + 14, name: 'Kombucha', description: 'Probiotic tea drink', price: 4.99, size: '16 oz', category: 'Snacks & Beverages' },
        
        // Household Items
        { id: baseId + 15, name: 'Eco Paper Towels', description: 'Recycled paper towels', price: 9.99, size: '6 rolls', category: 'Household Items' },
        { id: baseId + 16, name: 'Natural Dish Soap', description: 'Plant-based dish soap', price: 5.99, size: '16 oz', category: 'Household Items' }
      ];
      
    case 4: // Organic Valley - Organic, Health Foods
      return [
        // Fruits & Vegetables
        { id: baseId + 1, name: 'Organic Strawberries', description: 'Sweet organic berries', price: 5.99, size: '1 lb', category: 'Fruits & Vegetables' },
        { id: baseId + 2, name: 'Organic Broccoli', description: 'Fresh broccoli crowns', price: 3.99, size: '1 lb', category: 'Fruits & Vegetables' },
        { id: baseId + 3, name: 'Organic Bell Peppers', description: 'Mixed color peppers', price: 5.49, size: '3 pack', category: 'Fruits & Vegetables' },
        { id: baseId + 4, name: 'Organic Cucumbers', description: 'Garden fresh cucumbers', price: 2.99, size: '2 pack', category: 'Fruits & Vegetables' },
        
        // Dairy & Eggs
        { id: baseId + 5, name: 'Almond Milk', description: 'Unsweetened almond milk', price: 4.99, size: '64 oz', category: 'Dairy & Eggs' },
        { id: baseId + 6, name: 'Organic Butter', description: 'Grass-fed organic butter', price: 7.99, size: '1 lb', category: 'Dairy & Eggs' },
        { id: baseId + 7, name: 'Vegan Cheese', description: 'Plant-based cheese', price: 6.99, size: '8 oz', category: 'Dairy & Eggs' },
        
        // Bakery
        { id: baseId + 8, name: 'Sourdough Bread', description: 'Artisan sourdough', price: 6.99, size: '24 oz', category: 'Bakery' },
        { id: baseId + 9, name: 'Gluten-Free Muffins', description: 'Blueberry muffins', price: 7.99, size: '4 pack', category: 'Bakery' },
        
        // Pantry Essentials
        { id: baseId + 10, name: 'Brown Rice', description: 'Organic brown rice', price: 8.99, size: '3 lbs', category: 'Pantry Essentials' },
        { id: baseId + 11, name: 'Chia Seeds', description: 'Organic chia seeds', price: 9.99, size: '12 oz', category: 'Pantry Essentials' },
        { id: baseId + 12, name: 'Hemp Hearts', description: 'Shelled hemp seeds', price: 11.99, size: '8 oz', category: 'Pantry Essentials' },
        
        // Snacks & Beverages
        { id: baseId + 13, name: 'Protein Bars', description: 'Plant-based protein bars', price: 9.99, size: '6 pack', category: 'Snacks & Beverages' },
        { id: baseId + 14, name: 'Green Juice', description: 'Cold-pressed vegetable juice', price: 6.99, size: '16 oz', category: 'Snacks & Beverages' },
        
        // Household Items
        { id: baseId + 15, name: 'Bamboo Paper Towels', description: 'Sustainable bamboo towels', price: 11.99, size: '6 rolls', category: 'Household Items' },
        { id: baseId + 16, name: 'Castile Soap', description: 'Multi-purpose liquid soap', price: 8.99, size: '32 oz', category: 'Household Items' }
      ];
      
    case 5: // City Supermart - Supermarket, Household
      return [
        // Fruits & Vegetables
        { id: baseId + 1, name: 'Oranges', description: 'Juicy navel oranges', price: 5.99, size: '3 lbs', category: 'Fruits & Vegetables' },
        { id: baseId + 2, name: 'Potatoes', description: 'Russet potatoes', price: 4.49, size: '5 lbs', category: 'Fruits & Vegetables' },
        { id: baseId + 3, name: 'Onions', description: 'Yellow cooking onions', price: 3.99, size: '3 lbs', category: 'Fruits & Vegetables' },
        { id: baseId + 4, name: 'Lettuce', description: 'Iceberg lettuce head', price: 2.49, size: '1 head', category: 'Fruits & Vegetables' },
        
        // Dairy & Eggs
        { id: baseId + 5, name: 'Skim Milk', description: 'Fat-free milk', price: 4.49, size: '1 gallon', category: 'Dairy & Eggs' },
        { id: baseId + 6, name: 'Extra Large Eggs', description: 'Grade AA extra large', price: 6.99, size: '18 count', category: 'Dairy & Eggs' },
        { id: baseId + 7, name: 'Mozzarella Cheese', description: 'Part-skim mozzarella', price: 5.99, size: '16 oz', category: 'Dairy & Eggs' },
        
        // Bakery
        { id: baseId + 8, name: 'Wheat Bread', description: 'Honey wheat bread', price: 3.99, size: '24 oz', category: 'Bakery' },
        { id: baseId + 9, name: 'Dinner Rolls', description: 'Soft dinner rolls', price: 4.49, size: '12 pack', category: 'Bakery' },
        
        // Pantry Essentials
        { id: baseId + 10, name: 'Flour', description: 'All-purpose flour', price: 5.99, size: '5 lbs', category: 'Pantry Essentials' },
        { id: baseId + 11, name: 'Sugar', description: 'Granulated white sugar', price: 4.99, size: '4 lbs', category: 'Pantry Essentials' },
        { id: baseId + 12, name: 'Canned Beans', description: 'Black beans', price: 1.99, size: '15 oz', category: 'Pantry Essentials' },
        
        // Snacks & Beverages
        { id: baseId + 13, name: 'Pretzels', description: 'Salted pretzel twists', price: 3.49, size: '16 oz', category: 'Snacks & Beverages' },
        { id: baseId + 14, name: 'Apple Juice', description: '100% apple juice', price: 4.99, size: '64 oz', category: 'Snacks & Beverages' },
        
        // Household Items
        { id: baseId + 15, name: 'Toilet Paper', description: 'Ultra soft toilet paper', price: 14.99, size: '12 mega rolls', category: 'Household Items' },
        { id: baseId + 16, name: 'Laundry Detergent', description: 'Fresh scent detergent', price: 12.99, size: '100 oz', category: 'Household Items' }
      ];
      
    case 6: // Green Grocers - Fruits & Vegetables
      return [
        // Fruits & Vegetables
        { id: baseId + 1, name: 'Organic Blueberries', description: 'Fresh organic blueberries', price: 6.99, size: '1 pint', category: 'Fruits & Vegetables' },
        { id: baseId + 2, name: 'Mangoes', description: 'Sweet tropical mangoes', price: 3.99, size: '2 pack', category: 'Fruits & Vegetables' },
        { id: baseId + 3, name: 'Asparagus', description: 'Fresh green asparagus', price: 5.99, size: '1 lb', category: 'Fruits & Vegetables' },
        { id: baseId + 4, name: 'Mixed Salad Greens', description: 'Spring mix salad', price: 4.99, size: '5 oz', category: 'Fruits & Vegetables' },
        { id: baseId + 5, name: 'Sweet Potatoes', description: 'Orange sweet potatoes', price: 3.49, size: '2 lbs', category: 'Fruits & Vegetables' },
        { id: baseId + 6, name: 'Zucchini', description: 'Fresh green zucchini', price: 2.99, size: '1 lb', category: 'Fruits & Vegetables' },
        
        // Dairy & Eggs
        { id: baseId + 7, name: 'Fresh Mozzarella', description: 'Handmade mozzarella', price: 7.99, size: '8 oz', category: 'Dairy & Eggs' },
        { id: baseId + 8, name: 'Farm Fresh Eggs', description: 'Local farm eggs', price: 6.99, size: '12 count', category: 'Dairy & Eggs' },
        
        // Bakery
        { id: baseId + 9, name: 'Artisan Baguette', description: 'Fresh-baked baguette', price: 4.99, size: '12 oz', category: 'Bakery' },
        { id: baseId + 10, name: 'Fruit Danish', description: 'Assorted fruit pastries', price: 6.99, size: '4 pack', category: 'Bakery' },
        
        // Pantry Essentials
        { id: baseId + 11, name: 'Wild Rice', description: 'Premium wild rice blend', price: 13.99, size: '2 lbs', category: 'Pantry Essentials' },
        { id: baseId + 12, name: 'Balsamic Vinegar', description: 'Aged balsamic vinegar', price: 11.99, size: '16 oz', category: 'Pantry Essentials' },
        
        // Snacks & Beverages
        { id: baseId + 13, name: 'Fresh Smoothie', description: 'Made-to-order fruit smoothie', price: 6.99, size: '16 oz', category: 'Snacks & Beverages' },
        { id: baseId + 14, name: 'Mixed Nuts', description: 'Roasted mixed nuts', price: 9.99, size: '12 oz', category: 'Snacks & Beverages' },
        
        // Household Items
        { id: baseId + 15, name: 'Beeswax Wraps', description: 'Reusable food wraps', price: 14.99, size: '3 pack', category: 'Household Items' },
        { id: baseId + 16, name: 'Compostable Bags', description: 'Kitchen compost bags', price: 7.99, size: '25 count', category: 'Household Items' }
      ];
      
    default:
      return [];
  }
};

export function GroceryVendorDetailScreen({
  vendor,
  initialCart,
  onBack,
  onAddToCart,
  onUpdateCart,
  onCheckout,
  onViewReviews
}: GroceryVendorDetailScreenProps) {
  const [cart, setCart] = useState<GroceryCartItem[]>(initialCart || []);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Sync cart with parent state
  useEffect(() => {
    setCart(initialCart || []);
  }, [initialCart]);

  const groceryItems = getVendorGroceries(vendor.id, vendor.name);
  const categories = ['All', 'Fruits & Vegetables', 'Dairy & Eggs', 'Bakery', 'Pantry Essentials', 'Snacks & Beverages', 'Household Items'];

  const filteredItems = selectedCategory === 'All' 
    ? groceryItems 
    : groceryItems.filter(item => item.category === selectedCategory);

  const handleAddToCart = (item: GroceryItem) => {
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

      {/* Grocery Items */}
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
                    <p className="text-gray-600 text-sm mb-1">{item.description}</p>
                    <p className="text-gray-500 text-sm mb-2">{item.size}</p>
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