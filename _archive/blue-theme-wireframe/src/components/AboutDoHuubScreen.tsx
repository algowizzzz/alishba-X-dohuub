import { ChevronLeft, Mail, Phone, Globe, Instagram } from 'lucide-react';
import { Broom, Wrench as PhWrench, ShoppingCart as PhShoppingCart, Scissors as PhScissors, House as PhHouse, HeartStraight } from '@phosphor-icons/react';
import Logo from '../assets/Logo.svg';
import type { Screen } from '../App';

interface AboutDoHuubScreenProps {
  onBack: () => void;
}

export function AboutDoHuubScreen({ onBack }: AboutDoHuubScreenProps) {
  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Background pattern */}
      <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />

      {/* Header */}
      <div
        className="px-6 py-6 relative z-10 flex items-center gap-4"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.06)',
          borderBottom: '1px solid rgba(46, 122, 217, 0.08)',
          borderRadius: '0 0 24px 24px',
        }}
      >
        <button onClick={onBack} className="p-2 -ml-2 transition-all duration-200 hover:opacity-80 hover:-translate-x-1">
          <ChevronLeft className="w-6 h-6" style={{ color: 'var(--foreground)' }} />
        </button>
        <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>About DoHuub</h3>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 relative z-10">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8 animate-scale-in">
          <img
            src={Logo}
            alt="DoHuub"
            className="w-40 h-40 mx-auto mb-4 object-contain rounded-2xl shadow-premium-lg"
          />
        </div>

        {/* About Section */}
        <div className="space-y-6 mb-8 text-center">
          <section className="">
            <h4 className="mb-3" style={{ color: 'var(--foreground)' }}>Our Mission</h4>
            <p style={{ color: 'var(--muted-foreground)' }}>
              DoHuub is your all-in-one lifestyle super-app, designed to simplify your daily life by connecting you with trusted service providers. From cleaning and handyman services to beauty treatments and caregiving support, we bring infinite services right to your fingertips.
            </p>
          </section>

          <section className="">
            <h4 className="mb-3" style={{ color: 'var(--foreground)' }}>What We Offer</h4>
            <div className="space-y-3">
              <div className="p-4 rounded-xl shadow-card transition-all duration-300 hover:shadow-premium-sm text-center" style={{ backgroundColor: 'var(--card)' }}>
                <p className="mb-1 flex items-center justify-center gap-2" style={{ color: 'var(--foreground)' }}><Broom size={20} weight="duotone" /> Cleaning Services</p>
                <p style={{ color: 'var(--muted-foreground)' }}>Professional home and office cleaning</p>
              </div>
              <div className="p-4 rounded-xl shadow-card transition-all duration-300 hover:shadow-premium-sm text-center" style={{ backgroundColor: 'var(--card)' }}>
                <p className="mb-1 flex items-center justify-center gap-2" style={{ color: 'var(--foreground)' }}><PhWrench size={20} weight="duotone" /> Handyman Services</p>
                <p style={{ color: 'var(--muted-foreground)' }}>Expert repairs and maintenance</p>
              </div>
              <div className="p-4 rounded-xl shadow-card transition-all duration-300 hover:shadow-premium-sm text-center" style={{ backgroundColor: 'var(--card)' }}>
                <p className="mb-1 flex items-center justify-center gap-2" style={{ color: 'var(--foreground)' }}><PhShoppingCart size={20} weight="duotone" /> Groceries & Food</p>
                <p style={{ color: 'var(--muted-foreground)' }}>Fresh groceries and meals delivered</p>
              </div>
              <div className="p-4 rounded-xl shadow-card transition-all duration-300 hover:shadow-premium-sm text-center" style={{ backgroundColor: 'var(--card)' }}>
                <p className="mb-1 flex items-center justify-center gap-2" style={{ color: 'var(--foreground)' }}><PhScissors size={20} weight="duotone" /> Beauty on Demand</p>
                <p style={{ color: 'var(--muted-foreground)' }}>Salon services at your location</p>
              </div>
              <div className="p-4 rounded-xl shadow-card transition-all duration-300 hover:shadow-premium-sm text-center" style={{ backgroundColor: 'var(--card)' }}>
                <p className="mb-1 flex items-center justify-center gap-2" style={{ color: 'var(--foreground)' }}><PhHouse size={20} weight="duotone" /> Rental Properties</p>
                <p style={{ color: 'var(--muted-foreground)' }}>Find your perfect home</p>
              </div>
              <div className="p-4 rounded-xl shadow-card transition-all duration-300 hover:shadow-premium-sm text-center" style={{ backgroundColor: 'var(--card)' }}>
                <p className="mb-1 flex items-center justify-center gap-2" style={{ color: 'var(--foreground)' }}><HeartStraight size={20} weight="duotone" /> Caregiving Services</p>
                <p style={{ color: 'var(--muted-foreground)' }}>Ride assistance and companionship</p>
              </div>
            </div>
          </section>

          <section className="">
            <h4 className="mb-3" style={{ color: 'var(--foreground)' }}>Why Choose DoHuub?</h4>
            <ul className="space-y-2">
              <li className="flex items-center justify-center gap-3">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--primary)' }}></span>
                <p style={{ color: 'var(--muted-foreground)' }}>Verified and trusted service providers</p>
              </li>
              <li className="flex items-center justify-center gap-3">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--primary)' }}></span>
                <p style={{ color: 'var(--muted-foreground)' }}>Secure and seamless payment processing</p>
              </li>
              <li className="flex items-center justify-center gap-3">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--primary)' }}></span>
                <p style={{ color: 'var(--muted-foreground)' }}>Real-time order tracking and updates</p>
              </li>
              <li className="flex items-center justify-center gap-3">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--primary)' }}></span>
                <p style={{ color: 'var(--muted-foreground)' }}>24/7 AI-powered customer support</p>
              </li>
              <li className="flex items-center justify-center gap-3">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--primary)' }}></span>
                <p style={{ color: 'var(--muted-foreground)' }}>Flexible scheduling and instant booking</p>
              </li>
              <li className="flex items-center justify-center gap-3">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--primary)' }}></span>
                <p style={{ color: 'var(--muted-foreground)' }}>Transparent pricing with no hidden fees</p>
              </li>
            </ul>
          </section>
        </div>

        {/* Contact Information */}
        <div className="rounded-xl p-5 mb-8 shadow-card text-center" style={{ backgroundColor: 'var(--card)' }}>
          <h4 className="mb-4" style={{ color: 'var(--foreground)' }}>Contact Us</h4>
          <div className="space-y-3">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-premium-sm" style={{ backgroundColor: 'var(--secondary)' }}>
                <Mail className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              </div>
              <p style={{ color: 'var(--foreground)' }}>support@dohuub.com</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-premium-sm" style={{ backgroundColor: 'var(--secondary)' }}>
                <Phone className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              </div>
              <div>
                <p style={{ color: 'var(--foreground)' }}>1-800-DOHUUB1</p>
                <p style={{ color: 'var(--muted-foreground)' }}>(1-800-364-8821)</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-premium-sm" style={{ backgroundColor: 'var(--secondary)' }}>
                <Globe className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              </div>
              <p style={{ color: 'var(--foreground)' }}>www.dohuub.com</p>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="mb-8 text-center">
          <h4 className="mb-4" style={{ color: 'var(--foreground)' }}>Follow Us</h4>
          <div className="flex gap-4 justify-center">
            <button className="w-12 h-12 rounded-full flex items-center justify-center shadow-card transition-all duration-300 hover:shadow-premium-sm hover:scale-110" style={{ backgroundColor: 'var(--secondary)' }}>
              <Instagram className="w-5 h-5" style={{ color: 'var(--primary)' }} />
            </button>
            <button className="w-12 h-12 rounded-full flex items-center justify-center shadow-card transition-all duration-300 hover:shadow-premium-sm hover:scale-110" style={{ backgroundColor: 'var(--secondary)' }}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--primary)' }}>
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Credits */}
        <div className="text-center pb-4">
          <p className="mb-2" style={{ color: 'var(--muted-foreground)' }}>Made with ❤️ for our community</p>
          <p style={{ color: 'var(--muted-foreground)', opacity: 0.7 }}>© 2025 DoHuub, Inc. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
