import { ArrowLeft, Star, Award, Globe, ChevronRight } from 'lucide-react';
import type { Companion } from './CompanionsListScreen';

interface CompanionDetailScreenProps {
  companion: Companion;
  onBack: () => void;
  onBookCompanion: () => void;
  onViewAllReviews?: () => void;
}

export function CompanionDetailScreen({
  companion,
  onBack,
  onBookCompanion,
  onViewAllReviews
}: CompanionDetailScreenProps) {
  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b-2 border-gray-200 flex items-center gap-4 bg-white sticky top-0 z-10">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
        </button>
        <h1 className="text-gray-900">Companion Profile</h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6 space-y-6">
          {/* Profile Info */}
          <div className="flex items-start gap-4">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-gray-600 text-4xl">👤</span>
            </div>
            <div className="flex-1">
              <h2 className="text-gray-900 mb-1">{companion.name}</h2>
              {companion.isPoweredByDoHuub && (
                <div className="inline-block bg-gray-900 text-white px-3 py-1 rounded-full text-sm mb-2">
                  Powered by DoHuub
                </div>
              )}
              <div className="flex items-center gap-2 mt-2 mb-2">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-gray-900 fill-gray-900" />
                  <span className="text-gray-900">{companion.rating}</span>
                </div>
                <span className="text-gray-600">({companion.reviews} reviews)</span>
              </div>
              <p className="text-gray-600">{companion.yearsExperience} years of experience</p>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Hourly Rate</span>
              <span className="text-gray-900 text-2xl">${companion.hourlyRate}/hour</span>
            </div>
          </div>

          {/* Bio */}
          <div>
            <h3 className="text-gray-900 mb-3">About</h3>
            <p className="text-gray-600">{companion.bio}</p>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="text-gray-900 mb-3">Certifications & Training</h3>
            <div className="space-y-2">
              {companion.certifications.map((cert, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <Award className="w-5 h-5 text-gray-700 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-900">{cert}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Specialties */}
          <div>
            <h3 className="text-gray-900 mb-3">Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {companion.specialties.map(specialty => (
                <span key={specialty} className="px-3 py-2 bg-gray-100 text-gray-900 rounded-xl text-sm">
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <h3 className="text-gray-900 mb-3">Languages</h3>
            <div className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-xl">
              <Globe className="w-5 h-5 text-gray-700 flex-shrink-0 mt-0.5" />
              <span className="text-gray-900">{companion.languages.join(', ')}</span>
            </div>
          </div>

          {/* Reviews */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900">Reviews</h3>
              <button 
                onClick={onViewAllReviews}
                className="flex items-center gap-1 text-gray-900 text-sm"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Review 1 */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-900">Emily R.</span>
                  <span className="text-gray-600 text-sm">1 week ago</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-gray-900 fill-gray-900" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  {companion.name} is wonderful! Very caring and attentive to my mother's needs. Highly recommend.
                </p>
                {/* Review Images */}
                <div className="flex gap-2">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-xs">Photo</span>
                  </div>
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-xs">Photo</span>
                  </div>
                </div>
              </div>

              {/* Review 2 */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-900">David L.</span>
                  <span className="text-gray-600 text-sm">2 weeks ago</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-gray-900 fill-gray-900" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm">
                  Professional and compassionate. My father really enjoys the time spent together.
                </p>
              </div>

              {/* Review 3 */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-900">Carol B.</span>
                  <span className="text-gray-600 text-sm">3 weeks ago</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4].map((star) => (
                    <Star key={star} className="w-4 h-4 text-gray-900 fill-gray-900" />
                  ))}
                  <Star className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Very good service. Could improve on communication timing.
                </p>
                {/* Review Images */}
                <div className="flex gap-2">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-xs">Photo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Spacing */}
          <div className="h-20" />
        </div>
      </div>

      {/* Sticky Bottom Button */}
      <div className="p-6 border-t-2 border-gray-200 bg-white">
        <button
          onClick={onBookCompanion}
          className="w-full py-3 bg-gray-900 text-white rounded-xl"
        >
          Book Companion
        </button>
      </div>
    </div>
  );
}