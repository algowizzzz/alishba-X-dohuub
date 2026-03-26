import { MapPin, Search, Home, Calendar, MessageCircle, User, Sparkles, Wrench, ShoppingBag, Scissors, Building2, Heart, Bell } from 'lucide-react';
import { useState } from 'react';
import type { Screen } from '../App';
import { LocationSelectorModal, Address } from './LocationSelectorModal';
import { NotificationsPanel, Notification } from './NotificationsPanel';

interface HomeDashboardProps {
  addresses: Address[];
  selectedAddressId: string;
  onSelectAddress: (addressId: string) => void;
  location: string;
  navigate: (screen: Screen, data?: any) => void;
  onCategorySelect: (category: string) => void;
  onLocationChange: () => void;
  onAddAddress: () => void;
  notifications: Notification[];
  onMarkNotificationAsRead: (id: string) => void;
  onClearAllNotifications: () => void;
}

const categories = [
  { id: 'cleaning', name: 'Cleaning Services', icon: Sparkles, available: true },
  { id: 'handyman', name: 'Handyman Services', icon: Wrench, available: true },
  { id: 'groceries', name: 'Groceries & Food', icon: ShoppingBag, available: true },
  { id: 'beauty', name: 'Beauty Services and Products', icon: Scissors, available: true },
  { id: 'rentals', name: 'Rental Properties', icon: Building2, available: true },
  { id: 'caregiving', name: 'Caregiving Services', icon: Heart, available: true, restrictedForWork: true },
];

export function HomeDashboard({ addresses, selectedAddressId, onSelectAddress, location, navigate, onCategorySelect, onLocationChange, onAddAddress, notifications, onMarkNotificationAsRead, onClearAllNotifications }: HomeDashboardProps) {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useState(false);

  // Get the currently selected address
  const selectedAddress = addresses.find(addr => addr.id.toString() === selectedAddressId);
  const displayLabel = selectedAddress ? selectedAddress.label : 'Select Location';

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLocationChange = () => {
    setIsLocationModalOpen(true);
  };

  const handleLocationModalClose = () => {
    setIsLocationModalOpen(false);
  };

  const handleNotificationsPanelToggle = () => {
    setIsNotificationsPanelOpen(!isNotificationsPanelOpen);
  };

  const handleNotificationsPanelClose = () => {
    setIsNotificationsPanelOpen(false);
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b-2 border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={handleLocationChange}
            className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg"
          >
            <MapPin className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700">{displayLabel}</span>
            <span className="text-gray-500">▼</span>
          </button>
          <div className="flex items-center gap-3">
            <button className="relative p-2" onClick={handleNotificationsPanelToggle}>
              <Bell className="w-6 h-6 text-gray-700" strokeWidth={2} />
              {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
            </button>
            <button onClick={() => navigate('profile')}>
              <User className="w-8 h-8 text-gray-700" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Location Banner */}
        {selectedAddress && (
          <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-600" />
              <p className="text-gray-700">
                {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state}
              </p>
            </div>
            <button onClick={handleLocationChange} className="text-gray-700 underline">
              Change
            </button>
          </div>
        )}
        {!selectedAddress && addresses.length === 0 && (
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border-2 border-yellow-200">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-yellow-600" />
              <p className="text-yellow-700">Add an address to get started</p>
            </div>
            <button onClick={handleLocationChange} className="text-yellow-700 underline">
              Add
            </button>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="px-6 py-4">
        <button 
          onClick={() => navigate('aiChat')}
          className="w-full flex items-center gap-3 px-4 py-4 border-2 border-gray-300 rounded-lg"
        >
          <Search className="w-5 h-5 text-gray-400" />
          <span className="text-gray-400">What service do you need?</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="flex-1 overflow-y-auto px-6 pb-24">
        <p className="text-gray-700 mb-4">Available Services</p>
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            // Check if caregiving service is restricted for work addresses
            const isAvailable = category.restrictedForWork 
              ? selectedAddress?.type !== 'Work' 
              : category.available;
            
            return (
              <button
                key={category.id}
                onClick={() => isAvailable && onCategorySelect(category.name)}
                disabled={!isAvailable}
                className={`p-6 rounded-lg border-2 flex flex-col items-center gap-3 ${
                  isAvailable
                    ? 'border-gray-300 hover:border-gray-800 bg-white'
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  isAvailable ? 'bg-gray-200' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-8 h-8 ${isAvailable ? 'text-gray-700' : 'text-gray-400'}`} strokeWidth={1.5} />
                </div>
                <p className={`text-center ${isAvailable ? 'text-gray-800' : 'text-gray-400'}`}>
                  {category.name}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 px-6 py-4">
        <div className="flex justify-around">
          <button className="flex flex-col items-center gap-1">
            <Home className="w-6 h-6 text-gray-800" strokeWidth={2} />
            <span className="text-gray-800">Home</span>
          </button>
          <button onClick={() => navigate('myBookings')} className="flex flex-col items-center gap-1">
            <Calendar className="w-6 h-6 text-gray-400" strokeWidth={2} />
            <span className="text-gray-400">Bookings</span>
          </button>
          <button onClick={() => navigate('aiChat')} className="flex flex-col items-center gap-1">
            <MessageCircle className="w-6 h-6 text-gray-400" strokeWidth={2} />
            <span className="text-gray-400">AI Assistant</span>
          </button>
          <button onClick={() => navigate('profile')} className="flex flex-col items-center gap-1">
            <User className="w-6 h-6 text-gray-400" strokeWidth={2} />
            <span className="text-gray-400">Profile</span>
          </button>
        </div>
      </div>

      {/* Location Selector Modal */}
      <LocationSelectorModal
        isOpen={isLocationModalOpen}
        onClose={handleLocationModalClose}
        addresses={addresses}
        selectedAddressId={selectedAddressId}
        onSelectAddress={onSelectAddress}
        onAddAddress={onAddAddress}
      />

      {/* Notifications Panel */}
      <NotificationsPanel
        isOpen={isNotificationsPanelOpen}
        onClose={handleNotificationsPanelClose}
        notifications={notifications}
        onMarkNotificationAsRead={onMarkNotificationAsRead}
        onClearAllNotifications={onClearAllNotifications}
      />
    </div>
  );
}