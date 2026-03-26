import { ArrowLeft, MessageCircle, ChevronDown, Mail, Clock } from 'lucide-react';
import { useState } from 'react';

interface HelpSupportScreenProps {
  onBack: () => void;
  onAIChat: () => void;
}

export function HelpSupportScreen({ onBack, onAIChat }: HelpSupportScreenProps) {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: 'How do I book a service?',
      answer: 'Select a category from the home screen, browse providers, choose your preferred service, customize your booking details, and complete the secure payment through Stripe.',
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept all major credit and debit cards through our secure payment partner Stripe. You can save multiple cards for faster checkout.',
    },
    {
      question: 'How do I change my location?',
      answer: 'Tap the location dropdown at the top of the home screen, or go to Profile > Change Location to browse services in different areas.',
    },
    {
      question: 'What is the AI Assistant?',
      answer: 'Our AI Assistant is available 24/7 to help you find services, answer questions, and make bookings through natural conversation.',
    },
  ];

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-4 border-b-2 border-gray-200">
        <div className="flex items-center gap-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
          </button>
          <h3 className="text-gray-900">Help & Support</h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mb-6">
          <h4 className="text-gray-900 mb-4">Frequently Asked Questions</h4>
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <div key={index} className="border-2 border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between"
                >
                  <span className="text-gray-900">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-600 transition-transform flex-shrink-0 ${
                      expandedFAQ === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFAQ === index && (
                  <div className="px-4 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-gray-900 mb-4">Contact Us</h4>
          <div className="space-y-3">
            <div className="p-4 border-2 border-gray-200 rounded-lg flex items-center gap-3">
              <Mail className="w-6 h-6 text-gray-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-gray-900 mb-1">Email Support</p>
                <p className="text-gray-600">support@dohuub.com</p>
              </div>
            </div>
            <div className="p-4 border-2 border-gray-200 rounded-lg flex items-center gap-3">
              <Clock className="w-6 h-6 text-gray-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-gray-900 mb-1">AI Assistant Availability</p>
                <p className="text-gray-600">24/7 Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}