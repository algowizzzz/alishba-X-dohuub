import { ArrowLeft, MapPin, Plus, Minus, Image as ImageIcon, Trash2, Gift } from 'lucide-react';
import { ForkKnife, ShoppingCart as PhShoppingCart } from '@phosphor-icons/react';
import foodImg from '../assets/food.png';
import groceryImg from '../assets/grocery.png';
import { useState } from 'react';
import type { CartItem } from './FoodVendorDetailScreen';
import type { GroceryCartItem } from './GroceryVendorDetailScreen';
import type { FoodVendor } from './FoodVendorsListScreen';
import type { GroceryVendor } from './GroceryVendorsListScreen';
import type { Address } from './AddAddressScreen';
import type { CardData } from './AddPaymentCardScreen';
import PointsRedemptionCard from './PointsRedemptionCard';

interface FoodGroceryCheckoutScreenProps {
  cart: CartItem[] | GroceryCartItem[];
  vendor: FoodVendor | GroceryVendor;
  orderType: 'food' | 'grocery';
  addresses: Address[];
  paymentCards: CardData[];
  availablePoints: number;
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
  availablePoints,
  onBack,
  onAddAddress,
  onAddPaymentCard,
  onProceedToPayment
}: FoodGroceryCheckoutScreenProps) {
  const [cartItems, setCartItems] = useState(cart);
  const [selectedAddress, setSelectedAddress] = useState<Address | undefined>(addresses.find(a => a.isDefault) || addresses[0]);
  const [selectedCard, setSelectedCard] = useState<CardData | undefined>(paymentCards.find(c => c.isDefault) || paymentCards[0]);

  // Points redemption state
  const [pointsRedemptionEnabled, setPointsRedemptionEnabled] = useState(false);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);

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
  const totalBeforeDiscount = subtotal + deliveryFee + tax;

  // Calculate max redeemable points and discount
  const maxRedeemablePoints = Math.floor(totalBeforeDiscount * 100);
  const discountAmount = pointsToRedeem / 100;
  const total = totalBeforeDiscount - discountAmount;

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
      totalBeforeDiscount,
      pointsRedeemed: pointsRedemptionEnabled ? pointsToRedeem : 0,
      status: 'placed',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      referenceNumber: `${orderType === 'food' ? 'FD' : 'GR'}${Math.floor(Math.random() * 10000)}`
    };
    onProceedToPayment(orderData);
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
          <div>
            <h1 className="font-semibold" style={{ color: 'var(--foreground)' }}>Checkout</h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{vendor.name}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-32 relative z-10">
        {/* Delivery Address */}
        {selectedAddress && (
          <div className="mb-6">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Delivery Address</h3>
            <div
              className="rounded-xl p-4 shadow-card"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: 'var(--primary)' }} />
                <div className="flex-1">
                  <p className="font-medium mb-1" style={{ color: 'var(--foreground)' }}>{selectedAddress.label}</p>
                  <p style={{ color: 'var(--muted-foreground)' }}>
                    {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Order Items</h3>
          <div className="space-y-3">
            {cartItems.map((item, index) => (
              <div
                key={item.id}
                className="rounded-xl p-4 shadow-card"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <div className="flex gap-3">
                  <img src={orderType === 'food' ? foodImg : groceryImg} alt={orderType === 'food' ? 'Food' : 'Grocery'} className="w-16 h-16 object-contain flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium mb-1" style={{ color: 'var(--foreground)' }}>{item.name}</h4>
                    <p className="text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>${item.price.toFixed(2)}</p>
                    <div
                      className="flex items-center gap-2 rounded-lg p-1 w-fit"
                      style={{ backgroundColor: 'var(--muted)' }}
                    >
                      <button
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        className="w-7 h-7 flex items-center justify-center rounded transition-all duration-300 hover:bg-white/50"
                      >
                        <Minus className="w-4 h-4" style={{ color: 'var(--foreground)' }} />
                      </button>
                      <span className="w-7 text-center font-medium" style={{ color: 'var(--foreground)' }}>{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                        className="w-7 h-7 flex items-center justify-center rounded transition-all duration-300 hover:bg-white/50"
                      >
                        <Plus className="w-4 h-4" style={{ color: 'var(--foreground)' }} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold" style={{ color: 'var(--primary)' }}>${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-2 rounded-lg transition-all duration-300 hover:bg-red-50"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Points Redemption - Only for Powered by DoHuub vendors */}
        {vendor.isPoweredByDoHuub && availablePoints > 0 && (
          <div className="mb-4">
            <PointsRedemptionCard
              availablePoints={availablePoints}
              selectedPoints={pointsToRedeem}
              onPointsChange={setPointsToRedeem}
              enabled={pointsRedemptionEnabled}
              onToggle={setPointsRedemptionEnabled}
              maxRedeemablePoints={maxRedeemablePoints}
            />
          </div>
        )}

        {/* Price Breakdown */}
        <div
          className="rounded-xl p-4 shadow-card"
          style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Price Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between" style={{ color: 'var(--muted-foreground)' }}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between" style={{ color: 'var(--muted-foreground)' }}>
              <span>Delivery Fee</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between" style={{ color: 'var(--muted-foreground)' }}>
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            {pointsRedemptionEnabled && pointsToRedeem > 0 && (
              <div className="flex justify-between" style={{ color: 'rgb(34, 197, 94)' }}>
                <span>Points Discount ({pointsToRedeem.toLocaleString()} pts)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="pt-2 mt-2" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="flex justify-between">
                <span className="font-semibold" style={{ color: 'var(--foreground)' }}>Total</span>
                <span className="font-semibold" style={{ color: 'var(--primary)' }}>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Points Preview - Only for Powered by DoHuub vendors */}
        {vendor.isPoweredByDoHuub && (
          <div
            className="mt-4 p-4 rounded-xl shadow-premium-sm"
            style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(249, 115, 22, 0.1))',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5" style={{ color: 'rgb(245, 158, 11)' }} />
                <span className="font-medium" style={{ color: 'rgb(180, 83, 9)' }}>Points you'll earn</span>
              </div>
              <span className="text-lg font-bold" style={{ color: 'rgb(245, 158, 11)' }}>
                +{Math.floor(total)} pts
              </span>
            </div>
            <p className="text-sm mt-1" style={{ color: 'rgb(217, 119, 6)' }}>1 point per $1 spent • Added after delivery</p>
          </div>
        )}
      </div>

      {/* Place Order Button */}
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
          onClick={handlePlaceOrder}
          disabled={cartItems.length === 0}
          className="w-full py-4 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{ background: 'var(--primary-gradient)', pointerEvents: 'auto' }}
        >
          Confirm Address and Payment
        </button>
      </div>
    </div>
  );
}
