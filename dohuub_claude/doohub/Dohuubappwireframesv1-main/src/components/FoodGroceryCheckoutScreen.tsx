import { ArrowLeft, MapPin, Plus, Minus, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { CartItem } from './FoodVendorDetailScreen';
import type { GroceryCartItem } from './GroceryVendorDetailScreen';
import type { FoodVendor } from './FoodVendorsListScreen';
import type { GroceryVendor } from './GroceryVendorsListScreen';
import type { Address } from './AddAddressScreen';
import type { CardData } from './AddPaymentCardScreen';

interface FoodGroceryCheckoutScreenProps {
  cart: CartItem[] | GroceryCartItem[];
  vendor: FoodVendor | GroceryVendor;
  orderType: 'food' | 'grocery';
  addresses: Address[];
  paymentCards: CardData[];
  onBack: () => void;
  onAddAddress: () => void;
  onAddPaymentCard: () => void;
  onProceedToPayment: (orderData: any) => void;
}

export function FoodGroceryCheckoutScreen({
  cart,
  vendor,
  orderType,
  addresses,
  paymentCards,
  onBack,
  onAddAddress,
  onAddPaymentCard,
  onProceedToPayment
}: FoodGroceryCheckoutScreenProps) {
  const [cartItems, setCartItems] = useState(cart);
  const [selectedAddress, setSelectedAddress] = useState<Address | undefined>(addresses.find(a => a.isDefault) || addresses[0]);
  const [selectedCard, setSelectedCard] = useState<CardData | undefined>(paymentCards.find(c => c.isDefault) || paymentCards[0]);

  const handleUpdateQuantity = (itemId: number, change: number) => {
    setCartItems(cartItems.map(item => {
      if (item.id === itemId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleRemoveItem = (itemId: number) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 4.99;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  const handlePlaceOrder = () => {
    const orderData = {
      items: cartItems,
      vendorName: vendor.name,
      orderType,
      address: selectedAddress,
      paymentCard: selectedCard,
      subtotal,
      deliveryFee,
      tax,
      total,
      status: 'placed',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      referenceNumber: `${orderType === 'food' ? 'FD' : 'GR'}${Math.floor(Math.random() * 10000)}`
    };
    onProceedToPayment(orderData);
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-gray-900">
            <ArrowLeft className="w-6 h-6" strokeWidth={2} />
          </button>
          <div>
            <h1 className="text-gray-900">Checkout</h1>
            <p className="text-gray-600">{vendor.name}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-32">
        {/* Delivery Address */}
        {selectedAddress && (
          <div className="mb-6">
            <h3 className="text-gray-900 mb-3">Delivery Address</h3>
            <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-700 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="text-gray-900 mb-1">{selectedAddress.label}</p>
                  <p className="text-gray-600">
                    {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="mb-6">
          <h3 className="text-gray-900 mb-3">Order Items</h3>
          <div className="space-y-3">
            {cartItems.map(item => (
              <div key={item.id} className="bg-white rounded-xl border-2 border-gray-200 p-4">
                <div className="flex gap-3">
                  <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-gray-900 mb-1">{item.name}</h4>
                    <p className="text-gray-600 mb-2">${item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 bg-gray-100 text-gray-900 rounded-lg p-1 w-fit">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-gray-200 rounded"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-7 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-gray-200 rounded"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-gray-500 hover:text-gray-900"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
          <h3 className="text-gray-900 mb-3">Price Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="border-t-2 border-gray-200 pt-2 mt-2">
              <div className="flex justify-between text-gray-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Place Order Button */}
      <div className="bg-white border-t-2 border-gray-200 px-6 py-4">
        <button
          onClick={handlePlaceOrder}
          disabled={cartItems.length === 0}
          className="w-full bg-gray-900 text-white rounded-xl py-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm Address and Payment
        </button>
      </div>
    </div>
  );
}
