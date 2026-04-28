import { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { SquaresFour, CalendarCheck, ChatCircleDots } from '@phosphor-icons/react';
import infinityDohuubSvg from '../assets/infinity-dohuub.svg';

interface OnboardingCarouselProps {
  onComplete: () => void;
}

export function OnboardingCarousel({ onComplete }: OnboardingCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: null,
      title: 'Welcome to DoHuub',
      description: 'Infinite Services - Your platform for cleaning, handyman, food, beauty, rentals, and caregiving',
    },
    {
      icon: SquaresFour,
      title: 'Everything You Need, One App',
      description: '6 service categories to simplify your daily life and help your loved ones',
    },
    {
      icon: CalendarCheck,
      title: 'Easy Booking Process',
      description: 'Select, customize, pay securely, and track your services in real-time',
    },
    {
      icon: ChatCircleDots,
      title: '24/7 AI Assistant & Secure Payments',
      description: 'Get instant help anytime. All payments processed securely through Stripe',
    }
  ];

  const currentIcon = slides[currentSlide].icon;

  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #4CA6FA 0%, #1D4ADD 100%)' }}>
      <div className="flex justify-end p-6 relative z-10">
        <button onClick={onComplete} className="text-white hover:opacity-80 transition-all duration-200 hover:scale-105 active:scale-95">
          Skip
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10">
        <div
          key={currentSlide}
          className="w-48 h-48 rounded-full flex items-center justify-center mb-8 transition-all duration-500 shadow-premium-lg animate-scale-in"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
        >
          {currentIcon ? (
            (() => { const Icon = currentIcon; return <Icon size={96} weight="duotone" color="#fff" />; })()
          ) : (
            <img src={infinityDohuubSvg} alt="DoHuub" className="w-24 h-24" />
          )}
        </div>

        <h2 key={`title-${currentSlide}`} className="mb-4 text-center text-white">
          {slides[currentSlide].title}
        </h2>

        <p key={`desc-${currentSlide}`} className="text-center max-w-sm mb-12 text-white">
          {slides[currentSlide].description}
        </p>

        <div className="flex gap-2 mb-12">
          {slides.map((_, index) => (
            <div
              key={index}
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: index === currentSlide ? '2rem' : '0.5rem',
                background: index === currentSlide ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.4)',
                boxShadow: index === currentSlide ? '0 0 8px rgba(255, 255, 255, 0.4)' : 'none'
              }}
            />
          ))}
        </div>
      </div>

      <div className="p-6 flex gap-4 relative z-10">
        {currentSlide > 0 && (
          <button
            onClick={() => setCurrentSlide(currentSlide - 1)}
            className="flex items-center gap-2 px-6 py-4 rounded-xl transition-all duration-300 hover:bg-white/30 hover:scale-105 active:scale-95"
            style={{ color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.2)', border: '2px solid rgba(255, 255, 255, 0.5)' }}
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
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl transition-all duration-300 hover:bg-white hover:scale-[1.02] active:scale-[0.98]"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#1D4ADD' }}
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
