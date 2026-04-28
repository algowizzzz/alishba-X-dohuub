import { MapPin, Search, Bell, User } from 'lucide-react';
import { SprayBottle, Wrench, ForkKnife, Scissors, House, HeartHalf, Gift, Flame } from '@phosphor-icons/react';
import { useState } from 'react';
import type { Screen } from '../App';
import { LocationSelectorModal, Address } from './LocationSelectorModal';
import { NotificationsPanel, Notification } from './NotificationsPanel';
import { BottomNavigation } from './BottomNavigation';
import { IconContainer } from './icons/IconContainer';
import cleaningServiceImg from '../assets/cleaningservice.png';
import foodGroceryImg from '../assets/foodandgrocery.png';
import beautyServicesImg from '../assets/beauty products and services.png';
import rentalImg from '../assets/rental.png';
import caregivingImg from '../assets/caregiving.png';
import handymanImg from '../assets/handyman.png';

interface StreakMilestone {
  weeks: number;
  points: number;
  achieved: boolean;
}

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
  rewardsWallet?: {
    totalPoints: number;
    pendingPoints: number;
    expiringPoints: number;
    expiringDate: string | null;
  };
  streakData?: {
    currentStreak: number;
    longestStreak: number;
    lastActiveWeek: string;
    streakMilestones: StreakMilestone[];
  };
}

const categories = [
  { id: 'cleaning', name: 'Cleaning Services', icon: SprayBottle, available: true, gradient: ['#4CA6FA', '#1D4AAD'] as [string, string] },
  { id: 'handyman', name: 'Handyman Services', icon: Wrench, available: true, gradient: ['#F59E0B', '#B45309'] as [string, string] },
  { id: 'groceries', name: 'Groceries & Food', icon: ForkKnife, available: true, gradient: ['#FB923C', '#EA580C'] as [string, string] },
  { id: 'beauty', name: 'Beauty Services and Products', icon: Scissors, available: true, gradient: ['#F472B6', '#DB2777'] as [string, string] },
  { id: 'rentals', name: 'Rental Properties', icon: House, available: true, gradient: ['#34D399', '#059669'] as [string, string] },
  { id: 'caregiving', name: 'Caregiving Services', icon: HeartHalf, available: true, restrictedForWork: true, gradient: ['#A78BFA', '#7C3AED'] as [string, string] },
];

export function HomeDashboard({ addresses, selectedAddressId, onSelectAddress, location, navigate, onCategorySelect, onLocationChange, onAddAddress, notifications, onMarkNotificationAsRead, onClearAllNotifications, rewardsWallet, streakData }: HomeDashboardProps) {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useState(false);

  // Get the currently selected address
  const selectedAddress = addresses.find(addr => addr.id.toString() === selectedAddressId);
  const displayLabel = selectedAddress ? selectedAddress.label : 'Location';

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
    <div className="h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header with glassmorphism */}
      <div
        className="px-6 py-6 relative overflow-hidden z-10"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.06)',
          borderBottom: '1px solid rgba(46, 122, 217, 0.08)',
          borderRadius: '0 0 24px 24px',
        }}
      >
        <div className="flex items-center justify-between mb-4 relative z-10">
          <button
            onClick={handleLocationChange}
            className="flex items-center gap-2 px-4 py-2 rounded-xl shadow-card transition-all duration-300 hover:shadow-card-hover hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: 'var(--card)', border: '1px solid rgba(46, 122, 217, 0.1)' }}
          >
            <MapPin className="w-5 h-5" style={{ color: 'var(--primary)' }} />
            <span style={{ color: 'var(--foreground)' }}>{displayLabel}</span>
            <span style={{ color: 'var(--muted-foreground)' }}>▼</span>
          </button>
          <div className="flex items-center gap-3">
            <button className="relative p-2 transition-all duration-200 hover:scale-110 active:scale-95" onClick={handleNotificationsPanelToggle}>
              <Bell className="w-6 h-6" style={{ color: 'var(--foreground)' }} strokeWidth={2} />
              {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full animate-pulse-soft" style={{ backgroundColor: 'var(--destructive)' }}></span>}
            </button>
            <button onClick={() => navigate('profile')} className="transition-all duration-200 hover:scale-110 active:scale-95">
              <User className="w-8 h-8" style={{ color: 'var(--foreground)' }} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Location Banner */}
        {selectedAddress && (
          <div className="flex items-center justify-between p-3 rounded-xl shadow-premium-sm accent-border-left relative z-10" style={{ backgroundColor: 'var(--secondary)' }}>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" style={{ color: 'var(--primary)' }} />
              <p style={{ color: 'var(--foreground)' }}>
                {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state}
              </p>
            </div>
            <button onClick={handleLocationChange} className="underline transition-all duration-200 hover:opacity-80" style={{ color: 'var(--primary)' }}>
              Change
            </button>
          </div>
        )}
        {!selectedAddress && addresses.length === 0 && (
          <div className="flex items-center justify-between p-3 rounded-xl border-2 shadow-premium-sm relative z-10" style={{ backgroundColor: '#FEF9C3', borderColor: '#FDE047' }}>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" style={{ color: '#CA8A04' }} />
              <p style={{ color: '#A16207' }}>Add an address to get started</p>
            </div>
            <button onClick={handleLocationChange} className="underline transition-all duration-200 hover:opacity-80" style={{ color: '#A16207' }}>
              Add
            </button>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="px-6 py-4">
        <button
          onClick={() => navigate('aiChat')}
          className="w-full flex items-center gap-3 px-4 py-4 rounded-xl shadow-card transition-all duration-300 hover:shadow-card-hover hover:scale-[1.01] active:scale-[0.99] focus-glow"
          style={{ backgroundColor: 'var(--card)', border: '1px solid rgba(46, 122, 217, 0.1)' }}
        >
          <Search className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
          <span style={{ color: 'var(--muted-foreground)' }}>What service do you need?</span>
        </button>
      </div>

      {/* Combined Rewards Banner */}
      {(rewardsWallet?.totalPoints > 0 || (streakData && streakData.currentStreak > 0)) && (
        <div className="px-6 pb-4">
          <button
            onClick={() => navigate('rewardsWallet')}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl shadow-premium-sm hover:shadow-premium-md transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
            style={{
              background: 'linear-gradient(to right, #FFFBEB, #FFF7ED)',
              border: '1px solid #FDE68A'
            }}
          >
            {rewardsWallet?.totalPoints > 0 && (
              <div className="flex items-center gap-2">
                <Gift size={20} weight="fill" color="#D97706" />
                <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{rewardsWallet.totalPoints.toLocaleString()} pts</span>
              </div>
            )}
            {streakData && streakData.currentStreak > 0 && (
              <div className="flex items-center gap-2">
                <Flame size={20} weight="fill" color="#F97316" />
                <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{streakData.currentStreak} week streak</span>
              </div>
            )}
          </button>
        </div>
      )}

      {/* Categories Grid */}
      <div className="flex-1 overflow-y-auto px-6 pb-32">
        <p className="mb-4" style={{ color: 'var(--foreground)' }}>Available Services</p>
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category, index) => {
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
                className={`p-6 rounded-xl flex flex-col items-center gap-3 transition-all duration-300 ${isAvailable ? 'premium-card-interactive' : ''}`}
                style={{
                  backgroundColor: isAvailable ? 'var(--card)' : 'var(--muted)',
                  opacity: isAvailable ? 1 : 0.6,
                                    animationFillMode: 'backwards'
                }}
              >
                {isAvailable ? (
                  category.id === 'cleaning' ? (
                    <img src={cleaningServiceImg} alt="Cleaning Services" className="w-16 h-16 object-contain" />
                  ) : category.id === 'handyman' ? (
                    <img src={handymanImg} alt="Handyman Services" className="w-16 h-16 object-contain" />
                  ) : category.id === 'groceries' ? (
                    <img src={foodGroceryImg} alt="Groceries & Food" className="w-16 h-16 object-contain" />
                  ) : category.id === 'beauty' ? (
                    <img src={beautyServicesImg} alt="Beauty Services and Products" className="w-16 h-16 object-contain" />
                  ) : category.id === 'rentals' ? (
                    <img src={rentalImg} alt="Rental Properties" className="w-16 h-16 object-contain" />
                  ) : category.id === 'caregiving' ? (
                    <img src={caregivingImg} alt="Caregiving Services" className="w-16 h-16 object-contain" />
                  ) : (
                    <IconContainer
                      size="md"
                      gradient={category.gradient}
                      glow
                    >
                      <Icon size={32} weight="fill" color="#fff" />
                    </IconContainer>
                  )
                ) : (
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-premium-sm"
                    style={{ backgroundColor: 'var(--muted)' }}
                  >
                    <Icon size={32} weight="regular" color="var(--muted-foreground)" />
                  </div>
                )}
                <p className="text-center" style={{ color: isAvailable ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                  {category.name}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="home" navigate={navigate} />

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