import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

interface NotificationsSettingsScreenProps {
  onBack: () => void;
}

export function NotificationsSettingsScreen({ onBack }: NotificationsSettingsScreenProps) {
  const [settings, setSettings] = useState({
    pushNotifications: true,
    bookingUpdates: true,
    promotions: false,
    aiAssistant: true,
    payments: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const notificationItems = [
    { key: 'pushNotifications' as const, label: 'Push Notifications', description: 'Enable all notifications' },
    { key: 'bookingUpdates' as const, label: 'Booking Updates', description: 'Status changes and reminders' },
    { key: 'promotions' as const, label: 'Promotional Offers', description: 'Discounts and special deals' },
    { key: 'aiAssistant' as const, label: 'AI Assistant Messages', description: 'Responses and suggestions' },
    { key: 'payments' as const, label: 'Payment Confirmations', description: 'Receipts and transaction alerts' },
  ];

  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Background pattern */}
      <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />

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
          <button onClick={onBack} className="transition-all duration-200 hover:opacity-80 hover:-translate-x-1">
            <ArrowLeft className="w-6 h-6" style={{ color: 'var(--foreground)' }} strokeWidth={2} />
          </button>
          <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Notifications</h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 relative z-10">
        <div className="space-y-1">
          {notificationItems.map((item, index) => (
            <div
              key={item.key}
              className="p-4 flex items-center gap-4 rounded-xl transition-all duration-300 hover:shadow-card"
              style={{ }}
            >
              <div className="flex-1">
                <p className="mb-1" style={{ color: 'var(--foreground)' }}>{item.label}</p>
                <p style={{ color: 'var(--muted-foreground)' }}>{item.description}</p>
              </div>
              <button
                onClick={() => toggleSetting(item.key)}
                className={`w-14 h-7 rounded-full relative transition-all duration-300 flex-shrink-0 shadow-card ${
                  settings[item.key] ? '' : ''
                }`}
                style={{
                  background: settings[item.key] ? 'var(--primary-gradient)' : 'var(--muted)'
                }}
              >
                <div
                  className={`absolute top-0.5 w-6 h-6 bg-white rounded-full transition-transform shadow-premium-sm ${
                    settings[item.key] ? 'translate-x-7' : 'translate-x-0.5'
                  }`}
                ></div>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 glass relative z-10" style={{ borderTop: '1px solid rgba(46, 122, 217, 0.1)' }}>
        <button
          className="w-full py-4 rounded-xl text-white shadow-premium-lg transition-all duration-300 hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: 'var(--primary-gradient)' }}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
