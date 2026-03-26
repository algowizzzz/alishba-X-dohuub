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
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-4 border-b-2 border-gray-200">
        <div className="flex items-center gap-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
          </button>
          <h3 className="text-gray-900">Notifications</h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-1">
          {notificationItems.map((item) => (
            <div key={item.key} className="p-4 flex items-center gap-4">
              <div className="flex-1">
                <p className="text-gray-900 mb-1">{item.label}</p>
                <p className="text-gray-600">{item.description}</p>
              </div>
              <button
                onClick={() => toggleSetting(item.key)}
                className={`w-14 h-7 rounded-full relative transition-colors flex-shrink-0 ${
                  settings[item.key] ? 'bg-gray-700' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                    settings[item.key] ? 'translate-x-7' : 'translate-x-0.5'
                  }`}
                ></div>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 border-t-2 border-gray-200">
        <button className="w-full py-4 bg-gray-800 text-white rounded-lg border-2 border-gray-800">
          Save Settings
        </button>
      </div>
    </div>
  );
}
