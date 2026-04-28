import { ChevronLeft, Mail, Phone, MapPin, Globe, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import type { Screen } from '../App';

interface AboutDoHuubScreenProps {
  onBack: () => void;
}

export function AboutDoHuubScreen({ onBack }: AboutDoHuubScreenProps) {
  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b-2 border-gray-200 flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h3 className="text-gray-900">About DoHuub</h3>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gray-800 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-white">DoHuub</span>
          </div>
          <h3 className="text-gray-900 mb-2">DoHuub</h3>
          <p className="text-gray-600">Infinite Services</p>
        </div>

        {/* About Section */}
        <div className="space-y-6 mb-8">
          <section>
            <h4 className="text-gray-900 mb-3">Our Mission</h4>
            <p className="text-gray-700">
              DoHuub is your all-in-one lifestyle super-app, designed to simplify your daily life by connecting you with trusted service providers. From cleaning and handyman services to beauty treatments and caregiving support, we bring infinite services right to your fingertips.
            </p>
          </section>

          <section>
            <h4 className="text-gray-900 mb-3">What We Offer</h4>
            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800 mb-1">🧹 Cleaning Services</p>
                <p className="text-gray-600">Professional home and office cleaning</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800 mb-1">🔧 Handyman Services</p>
                <p className="text-gray-600">Expert repairs and maintenance</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800 mb-1">🛒 Groceries & Food</p>
                <p className="text-gray-600">Fresh groceries and meals delivered</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800 mb-1">💅 Beauty on Demand</p>
                <p className="text-gray-600">Salon services at your location</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800 mb-1">🏠 Rental Properties</p>
                <p className="text-gray-600">Find your perfect home</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800 mb-1">❤️ Caregiving Services</p>
                <p className="text-gray-600">Ride assistance and companionship</p>
              </div>
            </div>
          </section>

          <section>
            <h4 className="text-gray-900 mb-3">Why Choose DoHuub?</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-gray-800 rounded-full mt-2 flex-shrink-0"></span>
                <p className="text-gray-700">Verified and trusted service providers</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-gray-800 rounded-full mt-2 flex-shrink-0"></span>
                <p className="text-gray-700">Secure and seamless payment processing</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-gray-800 rounded-full mt-2 flex-shrink-0"></span>
                <p className="text-gray-700">Real-time order tracking and updates</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-gray-800 rounded-full mt-2 flex-shrink-0"></span>
                <p className="text-gray-700">24/7 AI-powered customer support</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-gray-800 rounded-full mt-2 flex-shrink-0"></span>
                <p className="text-gray-700">Flexible scheduling and instant booking</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-gray-800 rounded-full mt-2 flex-shrink-0"></span>
                <p className="text-gray-700">Transparent pricing with no hidden fees</p>
              </li>
            </ul>
          </section>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 rounded-lg p-5 mb-8">
          <h4 className="text-gray-900 mb-4">Contact Us</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-600 flex-shrink-0" />
              <div>
                <p className="text-gray-700">support@dohuub.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-600 flex-shrink-0" />
              <div>
                <p className="text-gray-700">1-800-DOHUUB1</p>
                <p className="text-gray-500">(1-800-364-8821)</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-600 flex-shrink-0" />
              <div>
                <p className="text-gray-700">123 Service Lane, Suite 100</p>
                <p className="text-gray-700">San Francisco, CA 94105</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-600 flex-shrink-0" />
              <div>
                <p className="text-gray-700">www.dohuub.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="mb-8">
          <h4 className="text-gray-900 mb-4">Follow Us</h4>
          <div className="flex gap-4">
            <button className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
              <Facebook className="w-5 h-5 text-gray-700" />
            </button>
            <button className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
              <Twitter className="w-5 h-5 text-gray-700" />
            </button>
            <button className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
              <Instagram className="w-5 h-5 text-gray-700" />
            </button>
            <button className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
              <Linkedin className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Credits */}
        <div className="text-center pb-4">
          <p className="text-gray-500 mb-2">Made with ❤️ for our community</p>
          <p className="text-gray-400">© 2025 DoHuub, Inc. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}