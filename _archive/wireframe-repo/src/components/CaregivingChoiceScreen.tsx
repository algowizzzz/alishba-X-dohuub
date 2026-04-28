import { ArrowLeft, Car, Heart } from 'lucide-react';

interface CaregivingChoiceScreenProps {
  onBack: () => void;
  onSelectRideAssistance: () => void;
  onSelectCompanionship: () => void;
}

export function CaregivingChoiceScreen({
  onBack,
  onSelectRideAssistance,
  onSelectCompanionship
}: CaregivingChoiceScreenProps) {
  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b-2 border-gray-200 flex items-center gap-4 bg-white sticky top-0 z-10">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
        </button>
        <h1 className="text-gray-900">Caregiving Services</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <p className="text-gray-600 mb-6">
          Choose the type of caregiving service you need
        </p>

        <div className="space-y-4">
          {/* Ride Assistance */}
          <button
            onClick={onSelectRideAssistance}
            className="w-full p-6 border-2 border-gray-200 rounded-xl text-left hover:border-gray-900 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Car className="w-8 h-8 text-gray-700" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-2">Ride Assistance</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Professional transportation services with pickup and multiple stops (pharmacy, grocery, appointments)
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-900 rounded-full" />
                  <span className="text-gray-600 text-sm">Hourly rate booking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-900 rounded-full" />
                  <span className="text-gray-600 text-sm">Multiple stops available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-900 rounded-full" />
                  <span className="text-gray-600 text-sm">Round-trip option</span>
                </div>
              </div>
            </div>
          </button>

          {/* Companionship Support */}
          <button
            onClick={onSelectCompanionship}
            className="w-full p-6 border-2 border-gray-200 rounded-xl text-left hover:border-gray-900 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Heart className="w-8 h-8 text-gray-700" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-2">Companionship Support</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Professional caregivers providing conversation, activities, meal assistance, and daily living support
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-900 rounded-full" />
                  <span className="text-gray-600 text-sm">Flexible duration</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-900 rounded-full" />
                  <span className="text-gray-600 text-sm">Personalized care plans</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-900 rounded-full" />
                  <span className="text-gray-600 text-sm">Certified caregivers</span>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
