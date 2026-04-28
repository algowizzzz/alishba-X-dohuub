import { ArrowLeft, Calendar, Clock, MapPin, FileText } from 'lucide-react';
import { useState } from 'react';

interface BookingCustomizationScreenProps {
  service: any;
  category: string;
  onBack: () => void;
  onContinue: () => void;
}

export function BookingCustomizationScreen({ service, category, onBack, onContinue }: BookingCustomizationScreenProps) {
  const [serviceType, setServiceType] = useState('Deep Cleaning');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [instructions, setInstructions] = useState('');

  const serviceTypes = ['Deep Cleaning', 'Laundry', 'Office Cleaning'];

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-4 border-b-2 border-gray-200">
        <div className="flex items-center gap-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
          </button>
          <h3 className="text-gray-900">Book Service</h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-32">
        <div className="mb-6">
          <p className="text-gray-900 mb-3">Service Type</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {serviceTypes.map((type) => (
              <button
                key={type}
                onClick={() => setServiceType(type)}
                className={`px-4 py-2 rounded-full whitespace-nowrap border-2 ${
                  serviceType === type
                    ? 'bg-gray-800 text-white border-gray-800'
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-900 mb-2">Date *</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-900 mb-2">Time *</label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-lg appearance-none"
            >
              <option value="">Select time</option>
              <option value="09:00">9:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="14:00">2:00 PM</option>
              <option value="15:00">3:00 PM</option>
              <option value="16:00">4:00 PM</option>
              <option value="17:00">5:00 PM</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-900 mb-2">Address *</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-lg appearance-none"
            >
              <option value="">Select address</option>
              <option value="home">Home - 123 Main St, New York</option>
              <option value="work">Work - 456 Office Blvd, New York</option>
              <option value="other">+ Add new address</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-900 mb-2">Special Instructions (Optional)</label>
          <div className="relative">
            <FileText className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g., We have pets, use eco-friendly products"
              rows={4}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg resize-none"
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 px-6 py-4">
        <div className="mb-4 p-4 bg-gray-100 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Service</span>
            <span className="text-gray-900">$89.00</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Service Fee</span>
            <span className="text-gray-900">$8.00</span>
          </div>
          <div className="h-px bg-gray-300 my-2"></div>
          <div className="flex justify-between">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">$97.00</span>
          </div>
        </div>
        <button
          onClick={onContinue}
          disabled={!date || !time || !address}
          className={`w-full py-4 rounded-lg border-2 ${
            date && time && address
              ? 'bg-gray-800 text-white border-gray-800'
              : 'bg-gray-200 text-gray-400 border-gray-200'
          }`}
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}