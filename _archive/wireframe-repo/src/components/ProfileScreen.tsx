import { useState } from 'react';
import { ChevronRight, MapPin, CreditCard, Bell, HelpCircle, FileText, Shield, Info, LogOut, Trash2, Home, Calendar, MessageCircle, User, Gift, Users } from 'lucide-react';
import type { Screen } from '../App';
import { LogOutModal } from './LogOutModal';
import { DeleteAccountModal } from './DeleteAccountModal';

interface ProfileScreenProps {
  userName: string;
  userEmail: string;
  navigate: (screen: Screen, data?: any) => void;
  rewardsWallet?: {
    totalPoints: number;
    pendingPoints: number;
    expiringPoints: number;
    expiringDate: string | null;
  };
}

export function ProfileScreen({ userName, userEmail, navigate, rewardsWallet }: ProfileScreenProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showLogOutModal, setShowLogOutModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  const rewardsMenuItems = [
    {
      label: 'Rewards Wallet',
      icon: Gift,
      screen: 'rewardsWallet' as Screen,
      isToggle: false,
      badge: rewardsWallet && rewardsWallet.totalPoints > 0 ? `${rewardsWallet.totalPoints.toLocaleString()} pts` : undefined
    },
    {
      label: 'Refer a Friend',
      icon: Users,
      screen: 'referralScreen' as Screen,
      isToggle: false
    },
  ];

  const menuItems = [
    { label: 'Saved Addresses', icon: MapPin, screen: 'savedAddresses' as Screen, isToggle: false },
    { label: 'Payment Methods', icon: CreditCard, screen: 'paymentMethods' as Screen, isToggle: false },
    { label: 'Notifications', icon: Bell, screen: null, isToggle: true },
    { label: 'Help & Support', icon: HelpCircle, screen: 'helpSupport' as Screen, isToggle: false },
    { label: 'Terms of Service', icon: Shield, screen: 'termsOfService' as Screen, isToggle: false, isClickable: true },
    { label: 'Privacy Policy', icon: Shield, screen: 'privacyPolicy' as Screen, isToggle: false, isClickable: true },
    { label: 'About DoHuub', icon: Info, screen: 'aboutDoHuub' as Screen, isToggle: false, isClickable: true },
  ];

  const handleNotificationToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleLogOut = () => {
    // Perform logout logic here
    setShowLogOutModal(false);
    navigate('login');
  };

  const handleDeleteAccount = () => {
    // Perform account deletion logic here
    setShowDeleteAccountModal(false);
    navigate('login');
  };

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-4 border-b-2 border-gray-200">
        <h3 className="text-gray-900">Profile</h3>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
        {/* Profile Section */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-full bg-gray-300 flex-shrink-0"></div>
          <div className="flex-1">
            <p className="text-gray-900 mb-1">{userName || 'Guest User'}</p>
            <p className="text-gray-600 mb-2">{userEmail || 'user@example.com'}</p>
            <button
              onClick={() => navigate('editProfile')}
              className="text-gray-700 underline"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Rewards Section */}
        <div>
          <div className="space-y-0">
            {rewardsMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => item.screen && navigate(item.screen)}
                  className="w-full p-3 flex items-center gap-3 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="flex-1 text-left text-gray-900 font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-1 bg-gray-900 text-white text-xs rounded-full font-medium">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-0">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => {
                  if (item.isToggle && item.label === 'Notifications') {
                    handleNotificationToggle();
                  } else if (item.screen) {
                    // For Terms of Service and Privacy Policy, pass previousScreen
                    if (item.screen === 'termsOfService' || item.screen === 'privacyPolicy') {
                      navigate(item.screen, { previousScreen: 'profile' });
                    } else {
                      navigate(item.screen);
                    }
                  }
                }}
                className="w-full p-3 flex items-center gap-3 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-gray-600" />
                </div>
                <span className="flex-1 text-left text-gray-900 font-medium">{item.label}</span>
                {item.isToggle && item.label === 'Notifications' ? (
                  <div
                    className={`w-12 h-6 rounded-full relative flex-shrink-0 transition-colors ${
                      notificationsEnabled ? 'bg-gray-800' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${
                        notificationsEnabled ? 'right-0.5' : 'left-0.5'
                      }`}
                    ></div>
                  </div>
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
            );
          })}

          <button
            onClick={() => setShowLogOutModal(true)}
            className="w-full p-3 flex items-center gap-3 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <LogOut className="w-5 h-5 text-gray-600" />
            </div>
            <span className="flex-1 text-left text-gray-900 font-medium">Log Out</span>
          </button>

          <button
            onClick={() => setShowDeleteAccountModal(true)}
            className="w-full p-3 flex items-center gap-3 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <span className="flex-1 text-left text-red-600 font-medium">Delete Account</span>
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 px-6 py-4">
        <div className="flex justify-around">
          <button onClick={() => navigate('home')} className="flex flex-col items-center gap-1">
            <Home className="w-6 h-6 text-gray-400" strokeWidth={2} />
            <span className="text-gray-400">Home</span>
          </button>
          <button onClick={() => navigate('myBookings')} className="flex flex-col items-center gap-1">
            <Calendar className="w-6 h-6 text-gray-400" strokeWidth={2} />
            <span className="text-gray-400">Bookings</span>
          </button>
          <button onClick={() => navigate('aiChat')} className="flex flex-col items-center gap-1">
            <MessageCircle className="w-6 h-6 text-gray-400" strokeWidth={2} />
            <span className="text-gray-400">AI Assistant</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <User className="w-6 h-6 text-gray-800" strokeWidth={2} />
            <span className="text-gray-800">Profile</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <LogOutModal 
        isOpen={showLogOutModal}
        onClose={() => setShowLogOutModal(false)}
        onConfirm={handleLogOut}
      />
      <DeleteAccountModal 
        isOpen={showDeleteAccountModal}
        onClose={() => setShowDeleteAccountModal(false)}
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
}