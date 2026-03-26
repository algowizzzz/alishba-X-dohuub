import { ArrowLeft, Star, SlidersHorizontal, Heart, X, Gift } from 'lucide-react';
import { UsersThree } from '@phosphor-icons/react';
import { IconContainer } from './icons/IconContainer';
import caregivingImg from '../assets/caregiving.png';
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
    <div className="h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />

      {/* Header */}
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
          <button
            onClick={onBack}
            className="p-2 rounded-xl transition-all duration-300 hover:shadow-card"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: 'var(--foreground)' }} strokeWidth={2} />
          </button>
          <h1 className="font-semibold flex-1" style={{ color: 'var(--foreground)' }}>Companions</h1>
          <button
            onClick={() => setShowFilters(true)}
            className="p-2 rounded-xl transition-all duration-300 hover:shadow-card"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <SlidersHorizontal className="w-5 h-5" style={{ color: 'var(--foreground)' }} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Companions List */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="p-6 space-y-4">
          {sortedCompanions.map((companion, index) => (
            <button
              key={companion.id}
              onClick={() => onSelectCompanion(companion)}
              className="w-full p-4 rounded-xl text-left shadow-card transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.01] active:scale-[0.99]"
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                              }}
            >
              <div className="flex items-start gap-4">
                <img src={caregivingImg} alt="Companionship" className="w-12 h-12 object-contain flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>{companion.name}</h3>
                    {companion.isPoweredByDoHuub && (
                      <div
                        className="px-2 py-1 rounded-full text-xs whitespace-nowrap text-white shadow-premium-sm flex-shrink-0"
                        style={{ background: 'var(--primary-gradient)' }}
                      >
                        Powered by DoHuub
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current" style={{ color: 'rgb(250, 204, 21)' }} />
                      <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{companion.rating}</span>
                    </div>
                    <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>({companion.reviews} reviews)</span>
                  </div>
                  <p className="text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>
                    {companion.yearsExperience} years experience
                  </p>
                  <p className="font-semibold mb-2" style={{ color: 'rgb(236, 72, 153)' }}>${companion.hourlyRate}/hour</p>
                  <div className="flex flex-wrap gap-2">
                    {companion.specialties.slice(0, 2).map(specialty => (
                      <span
                        key={specialty}
                        className="px-2 py-1 rounded-full text-xs"
                        style={{ backgroundColor: 'rgba(236, 72, 153, 0.1)', color: 'rgb(219, 39, 119)' }}
                      >
                        {specialty}
                      </span>
                    ))}
                    {companion.specialties.length > 2 && (
                      <span
                        className="px-2 py-1 rounded-full text-xs"
                        style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}
                      >
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
        <div className="absolute inset-0 z-50 flex items-end">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}
            onClick={() => setShowFilters(false)}
          />
          <div
            className="relative w-full rounded-t-3xl max-h-[80vh] overflow-y-auto animate-slide-up glass"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <div
              className="px-6 py-4 flex items-center justify-between sticky top-0 glass"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 rounded-xl transition-all duration-300 hover:shadow-card"
                style={{ backgroundColor: 'var(--muted)' }}
              >
                <X className="w-5 h-5" style={{ color: 'var(--foreground)' }} strokeWidth={2} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Specialties */}
              <div>
                <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Specialties</h3>
                <div className="space-y-2">
                  {allSpecialties.map(specialty => (
                    <button
                      key={specialty}
                      onClick={() => toggleSpecialty(specialty)}
                      className="w-full px-4 py-3 rounded-xl text-left transition-all duration-300"
                      style={{
                        backgroundColor: selectedSpecialties.includes(specialty)
                          ? 'rgba(236, 72, 153, 0.1)'
                          : 'var(--muted)',
                        border: selectedSpecialties.includes(specialty)
                          ? '2px solid rgb(236, 72, 153)'
                          : '2px solid var(--border)',
                        color: 'var(--foreground)'
                      }}
                    >
                      {specialty}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Experience Level</h3>
                <div className="space-y-2">
                  {['3', '5', '8', '10'].map(years => (
                    <button
                      key={years}
                      onClick={() => setSelectedExperience(years)}
                      className="w-full px-4 py-3 rounded-xl text-left transition-all duration-300"
                      style={{
                        backgroundColor: selectedExperience === years
                          ? 'rgba(236, 72, 153, 0.1)'
                          : 'var(--muted)',
                        border: selectedExperience === years
                          ? '2px solid rgb(236, 72, 153)'
                          : '2px solid var(--border)',
                        color: 'var(--foreground)'
                      }}
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
                  className="flex-1 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-card"
                  style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 py-3 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, rgb(236, 72, 153), rgb(219, 39, 119))' }}
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
