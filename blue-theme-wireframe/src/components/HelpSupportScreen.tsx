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
    <div className="h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Background pattern */}
      <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />

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
          <button onClick={onBack} className="transition-all duration-200 hover:opacity-80 hover:-translate-x-1">
            <ArrowLeft className="w-6 h-6" style={{ color: 'var(--foreground)' }} strokeWidth={2} />
          </button>
          <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Help & Support</h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 relative z-10">
        <div className="mb-6">
          <h4 className="mb-4" style={{ color: 'var(--foreground)' }}>Frequently Asked Questions</h4>
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-xl overflow-hidden shadow-card transition-all duration-300 hover:shadow-premium-sm"
                style={{ backgroundColor: 'var(--card)' }}
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between"
                >
                  <span style={{ color: 'var(--foreground)' }}>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform flex-shrink-0 ${
                      expandedFAQ === index ? 'rotate-180' : ''
                    }`}
                    style={{ color: 'var(--muted-foreground)' }}
                  />
                </button>
                {expandedFAQ === index && (
                  <div className="px-4 pb-4">
                    <p style={{ color: 'var(--muted-foreground)' }}>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="mb-4" style={{ color: 'var(--foreground)' }}>Contact Us</h4>
          <div className="space-y-3">
            <div
              className="p-4 rounded-xl flex items-center gap-3 shadow-card transition-all duration-300 hover:shadow-premium-sm"
              style={{ backgroundColor: 'var(--card)' }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-premium-sm" style={{ backgroundColor: 'var(--secondary)' }}>
                <Mail className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              </div>
              <div className="flex-1">
                <p className="mb-1" style={{ color: 'var(--foreground)' }}>Email Support</p>
                <p style={{ color: 'var(--muted-foreground)' }}>support@dohuub.com</p>
              </div>
            </div>
            <div
              className="p-4 rounded-xl flex items-center gap-3 shadow-card transition-all duration-300 hover:shadow-premium-sm"
              style={{ backgroundColor: 'var(--card)' }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-premium-sm" style={{ backgroundColor: 'var(--secondary)' }}>
                <Clock className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              </div>
              <div className="flex-1">
                <p className="mb-1" style={{ color: 'var(--foreground)' }}>AI Assistant Availability</p>
                <p style={{ color: 'var(--muted-foreground)' }}>24/7 Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
