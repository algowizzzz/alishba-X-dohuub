import { useState } from 'react';
import { ChevronRight, MapPin, CreditCard, Bell, HelpCircle, FileText, Shield, Info, LogOut, Trash2, Gift, Users } from 'lucide-react';
import profilePhoto from '../assets/profile photo (2).png';
import type { Screen } from '../App';
import { LogOutModal } from './LogOutModal';
import { DeleteAccountModal } from './DeleteAccountModal';
import { BottomNavigation } from './BottomNavigation';

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
    <div className="h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
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
        <h1
          style={{
            color: 'var(--foreground)',
            fontSize: '20px',
            fontWeight: 600,
          }}
        >
          Profile
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-32">
        {/* Profile Section */}
        <div className="flex items-center gap-4 mb-8">
          <img src={profilePhoto} alt="Profile" className="w-20 h-20 rounded-full object-cover flex-shrink-0 shadow-premium-md" style={{ border: '3px solid var(--primary)' }} />
          <div className="flex-1">
            <p className="mb-1" style={{ color: 'var(--foreground)' }}>{userName || 'Guest User'}</p>
            <p className="mb-2" style={{ color: 'var(--muted-foreground)' }}>{userEmail || 'user@example.com'}</p>
            <button
              onClick={() => navigate('editProfile')}
              className="underline transition-all duration-200 hover:opacity-80"
              style={{ color: 'var(--primary)' }}
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Rewards Section */}
        <div>
          <div className="space-y-1">
            {rewardsMenuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => item.screen && navigate(item.screen)}
                  className="w-full p-3 flex items-center gap-3 rounded-xl transition-all duration-300 hover:translate-x-1 hover:shadow-premium-sm group"
                  style={{ backgroundColor: 'transparent', animationFillMode: 'backwards' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--secondary)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-premium-sm transition-all duration-300 group-hover:shadow-premium-md" style={{ backgroundColor: 'var(--secondary)' }}>
                    <Icon className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                  </div>
                  <span className="flex-1 text-left font-medium" style={{ color: 'var(--foreground)' }}>{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-1 text-white text-xs rounded-full font-medium shadow-premium-sm" style={{ background: 'var(--primary-gradient)' }}>
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1" style={{ color: 'var(--muted-foreground)' }} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-1">
          {menuItems.map((item, index) => {
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
                className="w-full p-3 flex items-center gap-3 rounded-xl transition-all duration-300 hover:translate-x-1 hover:shadow-premium-sm group"
                style={{ backgroundColor: 'transparent', animationFillMode: 'backwards' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--secondary)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-premium-sm transition-all duration-300 group-hover:shadow-premium-md" style={{ backgroundColor: 'var(--secondary)' }}>
                  <Icon className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                </div>
                <span className="flex-1 text-left font-medium" style={{ color: 'var(--foreground)' }}>{item.label}</span>
                {item.isToggle && item.label === 'Notifications' ? (
                  <div
                    className="w-12 h-6 rounded-full relative flex-shrink-0 transition-all duration-300 shadow-premium-sm"
                    style={{ background: notificationsEnabled ? 'var(--primary-gradient)' : 'var(--muted)' }}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-premium-sm ${
                        notificationsEnabled ? 'right-0.5' : 'left-0.5'
                      }`}
                    ></div>
                  </div>
                ) : (
                  <ChevronRight className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1" style={{ color: 'var(--muted-foreground)' }} />
                )}
              </button>
            );
          })}

          <button
            onClick={() => setShowLogOutModal(true)}
            className="w-full p-3 flex items-center gap-3 rounded-xl transition-all duration-300 hover:translate-x-1 hover:shadow-premium-sm group"
            style={{ backgroundColor: 'transparent' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--secondary)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-premium-sm transition-all duration-300 group-hover:shadow-premium-md" style={{ backgroundColor: 'var(--secondary)' }}>
              <LogOut className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
            </div>
            <span className="flex-1 text-left font-medium" style={{ color: 'var(--foreground)' }}>Log Out</span>
          </button>

          <button
            onClick={() => setShowDeleteAccountModal(true)}
            className="w-full p-3 flex items-center gap-3 rounded-xl transition-all duration-300 hover:translate-x-1 hover:shadow-premium-sm group"
            style={{ backgroundColor: 'transparent' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-premium-sm transition-all duration-300 group-hover:shadow-premium-md" style={{ backgroundColor: '#FEE2E2' }}>
              <Trash2 className="w-5 h-5" style={{ color: 'var(--destructive)' }} />
            </div>
            <span className="flex-1 text-left font-medium" style={{ color: 'var(--destructive)' }}>Delete Account</span>
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="profile" navigate={navigate} />

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