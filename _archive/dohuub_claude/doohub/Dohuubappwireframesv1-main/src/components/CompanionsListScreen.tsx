import { ArrowLeft, Star, SlidersHorizontal, Heart, X } from 'lucide-react';
import { useState } from 'react';

export interface Companion {
  id: string;
  name: string;
  photo: string;
  rating: number;
  reviews: number;
  hourlyRate: number;
  yearsExperience: number;
  specialties: string[];
  isPoweredByDoHuub: boolean;
  bio: string;
  certifications: string[];
  languages: string[];
}

interface CompanionsListScreenProps {
  onBack: () => void;
  onSelectCompanion: (companion: Companion) => void;
}

const mockCompanions: Companion[] = [
  {
    id: '1',
    name: 'Maria Garcia',
    photo: '',
    rating: 4.9,
    reviews: 187,
    hourlyRate: 35,
    yearsExperience: 8,
    specialties: ['Dementia Care', 'Mobility Assistance', 'Medication Management'],
    isPoweredByDoHuub: true,
    bio: 'Certified caregiver with extensive experience in senior care and companionship',
    certifications: ['Certified Nursing Assistant', 'CPR & First Aid', 'Dementia Care Specialist'],
    languages: ['English', 'Spanish']
  },
  {
    id: '2',
    name: 'Patricia Johnson',
    photo: '',
    rating: 4.8,
    reviews: 156,
    hourlyRate: 32,
    yearsExperience: 6,
    specialties: ['Personal Care', 'Meal Preparation', 'Light Housekeeping'],
    isPoweredByDoHuub: true,
    bio: 'Compassionate caregiver dedicated to improving quality of life for seniors',
    certifications: ['Certified Home Health Aide', 'CPR & First Aid'],
    languages: ['English']
  },
  {
    id: '3',
    name: 'Susan Williams',
    photo: '',
    rating: 4.7,
    reviews: 134,
    hourlyRate: 30,
    yearsExperience: 5,
    specialties: ['Companionship', 'Activities & Games', 'Transportation'],
    isPoweredByDoHuub: false,
    bio: 'Friendly and patient companion specializing in social engagement',
    certifications: ['CPR & First Aid', 'Senior Companion Certification'],
    languages: ['English']
  },
  {
    id: '4',
    name: 'Jennifer Martinez',
    photo: '',
    rating: 4.9,
    reviews: 201,
    hourlyRate: 38,
    yearsExperience: 10,
    specialties: ['Alzheimer\'s Care', 'End-of-Life Care', 'Physical Therapy Support'],
    isPoweredByDoHuub: false,
    bio: 'Experienced caregiver with special training in memory care and rehabilitation',
    certifications: ['Licensed Practical Nurse', 'Alzheimer\'s Care Specialist', 'CPR & First Aid'],
    languages: ['English', 'Spanish', 'French']
  }
];

export function CompanionsListScreen({
  onBack,
  onSelectCompanion
}: CompanionsListScreenProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string>('');

  const allSpecialties = Array.from(
    new Set(mockCompanions.flatMap(c => c.specialties))
  );

  const filteredCompanions = mockCompanions.filter(companion => {
    if (selectedSpecialties.length > 0) {
      const hasSpecialty = selectedSpecialties.some(specialty =>
        companion.specialties.includes(specialty)
      );
      if (!hasSpecialty) return false;
    }
    if (selectedExperience) {
      const minYears = parseInt(selectedExperience);
      if (companion.yearsExperience < minYears) return false;
    }
    return true;
  });

  const sortedCompanions = [...filteredCompanions].sort((a, b) => {
    if (a.isPoweredByDoHuub && !b.isPoweredByDoHuub) return -1;
    if (!a.isPoweredByDoHuub && b.isPoweredByDoHuub) return 1;
    return b.rating - a.rating;
  });

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties(prev =>
      prev.includes(specialty) ? prev.filter(s => s !== specialty) : [...prev, specialty]
    );
  };

  const clearFilters = () => {
    setSelectedSpecialties([]);
    setSelectedExperience('');
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b-2 border-gray-200 flex items-center gap-4 bg-white sticky top-0 z-10">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
        </button>
        <h1 className="text-gray-900 flex-1">Companions</h1>
        <button onClick={() => setShowFilters(true)}>
          <SlidersHorizontal className="w-6 h-6 text-gray-700" strokeWidth={2} />
        </button>
      </div>

      {/* Companions List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-4">
          {sortedCompanions.map(companion => (
            <button
              key={companion.id}
              onClick={() => onSelectCompanion(companion)}
              className="w-full p-4 border-2 border-gray-200 rounded-xl text-left hover:border-gray-900 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-600 text-2xl">👤</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-gray-900">{companion.name}</h3>
                    {companion.isPoweredByDoHuub && (
                      <div className="bg-gray-900 text-white px-2 py-1 rounded-full text-xs whitespace-nowrap">
                        Powered by DoHuub
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-gray-900 fill-gray-900" />
                      <span className="text-gray-900 text-sm">{companion.rating}</span>
                    </div>
                    <span className="text-gray-600 text-sm">({companion.reviews} reviews)</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    {companion.yearsExperience} years experience
                  </p>
                  <p className="text-gray-900 mb-2">${companion.hourlyRate}/hour</p>
                  <div className="flex flex-wrap gap-2">
                    {companion.specialties.slice(0, 2).map(specialty => (
                      <span key={specialty} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {specialty}
                      </span>
                    ))}
                    {companion.specialties.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        +{companion.specialties.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Filters Modal */}
      {showFilters && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b-2 border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-gray-900">Filters</h2>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-6 h-6 text-gray-700" strokeWidth={2} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Specialties */}
              <div>
                <h3 className="text-gray-900 mb-3">Specialties</h3>
                <div className="space-y-2">
                  {allSpecialties.map(specialty => (
                    <button
                      key={specialty}
                      onClick={() => toggleSpecialty(specialty)}
                      className={`w-full px-4 py-3 rounded-xl border-2 text-left ${
                        selectedSpecialties.includes(specialty)
                          ? 'border-gray-900 bg-gray-50'
                          : 'border-gray-200'
                      }`}
                    >
                      {specialty}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <h3 className="text-gray-900 mb-3">Experience Level</h3>
                <div className="space-y-2">
                  {['3', '5', '8', '10'].map(years => (
                    <button
                      key={years}
                      onClick={() => setSelectedExperience(years)}
                      className={`w-full px-4 py-3 rounded-xl border-2 text-left ${
                        selectedExperience === years
                          ? 'border-gray-900 bg-gray-50'
                          : 'border-gray-200'
                      }`}
                    >
                      {years}+ years experience
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={clearFilters}
                  className="flex-1 py-3 border-2 border-gray-200 text-gray-900 rounded-xl"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 py-3 bg-gray-900 text-white rounded-xl"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
