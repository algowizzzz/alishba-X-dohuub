import { Home, Calendar, MessageCircle, User } from 'lucide-react';
import type { Screen } from '../App';

export type NavTab = 'home' | 'bookings' | 'aiChat' | 'profile' | 'none';

interface BottomNavigationProps {
  activeTab: NavTab;
  navigate: (screen: Screen) => void;
  /** If true, renders only the nav items without the container wrapper */
  embedded?: boolean;
}

const navItems: { id: NavTab; label: string; icon: typeof Home; screen: Screen }[] = [
  { id: 'home', label: 'Home', icon: Home, screen: 'home' },
  { id: 'bookings', label: 'Bookings', icon: Calendar, screen: 'myBookings' },
  { id: 'aiChat', label: 'AI Chat', icon: MessageCircle, screen: 'aiChat' },
  { id: 'profile', label: 'Profile', icon: User, screen: 'profile' },
];

export function BottomNavigation({ activeTab, navigate, embedded = false }: BottomNavigationProps) {
  const navContent = (
    <div className="flex justify-around items-end">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => !isActive && navigate(item.screen)}
            className="flex flex-col items-center transition-all duration-300 ease-out"
            style={{
              transform: isActive ? 'translateY(-8px)' : 'translateY(0)',
            }}
          >
            {/* Icon container with filled background for active */}
            <div
              className="relative flex items-center justify-center transition-all duration-300"
              style={{
                width: isActive ? '60px' : '48px',
                height: isActive ? '60px' : '48px',
                borderRadius: '18px',
                background: isActive
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'transparent',
                boxShadow: isActive
                  ? '0 4px 12px rgba(0, 0, 0, 0.15)'
                  : 'none',
              }}
            >
              <Icon
                className="transition-all duration-300"
                style={{
                  color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                  width: isActive ? '32px' : '30px',
                  height: isActive ? '32px' : '30px',
                }}
                strokeWidth={isActive ? 2.5 : 2}
                fill={isActive ? 'rgba(255,255,255,0.2)' : 'none'}
              />
            </div>

            {/* Label */}
            <span
              className="text-sm font-medium transition-all duration-300 mt-1.5"
              style={{
                color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                opacity: 1,
                fontWeight: isActive ? 600 : 500,
                fontSize: isActive ? '15px' : '14px',
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );

  if (embedded) {
    return navContent;
  }

  return (
    <div
      className="absolute bottom-0 left-0 right-0 px-0 pt-3 pb-0"
      style={{
        background: 'linear-gradient(135deg, #4CA6FA 0%, #1D4ADD 100%)',
        boxShadow: '0 -4px 30px rgba(29, 74, 221, 0.3)',
        borderRadius: '24px 24px 0 0',
        paddingBottom: 'env(safe-area-inset-bottom, 8px)',
      }}
    >
      {/* Dock content */}
      <div className="px-6 py-4">
        {navContent}
      </div>
    </div>
  );
}
