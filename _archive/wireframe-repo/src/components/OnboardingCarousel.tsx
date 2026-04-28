import { useState } from 'react';
import { Sparkles, Grid3x3, Calendar, MessageCircle, ChevronRight, ChevronLeft } from 'lucide-react';

interface OnboardingCarouselProps {
  onComplete: () => void;
}

export function OnboardingCarousel({ onComplete }: OnboardingCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: Sparkles,
      title: 'Welcome to DoHuub',
      description: 'Infinite Services - Your platform for cleaning, handyman, food, beauty, rentals, and caregiving'
    },
    {
      icon: Grid3x3,
      title: 'Everything You Need, One App',
      description: '6 service categories to simplify your daily life and help your loved ones'
    },
    {
      icon: Calendar,
      title: 'Easy Booking Process',
      description: 'Select, customize, pay securely, and track your services in real-time'
    },
    {
      icon: MessageCircle,
      title: '24/7 AI Assistant & Secure Payments',
      description: 'Get instant help anytime. All payments processed securely through Stripe'
    }
  ];

  const CurrentIcon = slides[currentSlide].icon;

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="flex justify-end p-6">
        <button onClick={onComplete} className="text-gray-600">
          Skip
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="w-48 h-48 rounded-full bg-gray-100 flex items-center justify-center mb-8">
          <CurrentIcon className="w-24 h-24 text-gray-700" strokeWidth={1.5} />
        </div>

        <h2 className="text-gray-900 mb-4 text-center">
          {slides[currentSlide].title}
        </h2>
        
        <p className="text-gray-600 text-center max-w-sm mb-12">
          {slides[currentSlide].description}
        </p>

        <div className="flex gap-2 mb-12">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? 'w-8 bg-gray-800' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-6 flex gap-4">
        {currentSlide > 0 && (
          <button
            onClick={() => setCurrentSlide(currentSlide - 1)}
            className="flex items-center gap-2 px-6 py-4 rounded-lg text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
        )}
        
        <button
          onClick={() => {
            if (currentSlide < slides.length - 1) {
              setCurrentSlide(currentSlide + 1);
            } else {
              onComplete();
            }
          }}
          className="flex-1 flex items-center justify-center gap-2 bg-gray-800 text-white py-4 rounded-lg border-2 border-gray-800"
        >
          {currentSlide < slides.length - 1 ? (
            <>
              Next
              <ChevronRight className="w-5 h-5" />
            </>
          ) : (
            'Get Started'
          )}
        </button>
      </div>
    </div>
  );
}