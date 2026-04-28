import { ArrowLeft, Send, Mic, Bot } from 'lucide-react';
import profilePhoto from '../assets/profile photo (2).png';
import { House as PhHouse, Buildings, SprayBottle, Wrench as PhWrench, Lightning, Screwdriver, Scissors as PhScissors, PaintBrush, Eyedropper } from '@phosphor-icons/react';
import { useState } from 'react';
import type { Screen } from '../App';
import { BottomNavigation } from './BottomNavigation';

const ServiceIcon = ({ iconType, size = 20 }: { iconType: string; size?: number }) => {
  const props = { size, weight: 'fill' as const, color: 'var(--foreground)' };
  switch (iconType) {
    case 'house': return <PhHouse {...props} />;
    case 'buildings': return <Buildings {...props} />;
    case 'spray-bottle': return <SprayBottle {...props} />;
    case 'wrench': return <PhWrench {...props} />;
    case 'lightning': return <Lightning {...props} />;
    case 'screwdriver': return <Screwdriver {...props} />;
    case 'scissors': return <PhScissors {...props} />;
    case 'paint-brush': return <PaintBrush {...props} />;
    case 'eyedropper': return <Eyedropper {...props} />;
    default: return <SprayBottle {...props} />;
  }
};

interface AIChatScreenProps {
  navigate: (screen: Screen, data?: any) => void;
  onServiceSelect: (service: any) => void;
}

interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  type?: 'text' | 'service-cards' | 'category-chips';
  services?: any[];
  categories?: string[];
}

export function AIChatScreen({ navigate, onServiceSelect }: AIChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'ai',
      text: "Hi! I'm your DoHuub assistant. How can I help you today?",
      type: 'text'
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const suggestedPrompts = [
    'Find cleaning service',
    'Book handyman',
    'Order groceries',
    'Beauty services near me',
  ];

  const handleSend = (message?: string) => {
    const messageToSend = message || input;
    if (messageToSend.trim()) {
      // Add user message
      const newMessages = [
        ...messages,
        { id: messages.length + 1, sender: 'user' as const, text: messageToSend, type: 'text' as const },
      ];
      setMessages(newMessages);
      setInput('');
      setIsTyping(true);

      // Simulate AI response with delay
      setTimeout(() => {
        const response = generateAIResponse(messageToSend.toLowerCase());
        setMessages([...newMessages, response]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const generateAIResponse = (userMessage: string): Message => {
    // Check for cleaning services
    if (userMessage.includes('clean') || userMessage.includes('cleaning')) {
      return {
        id: messages.length + 2,
        sender: 'ai',
        text: "I found 3 highly-rated cleaning services available in your area:",
        type: 'service-cards',
        services: [
          { id: 1, name: 'Deep House Cleaning', vendor: 'DoHuub Official Store', rating: 4.9, reviews: 234, price: '$150', iconType: 'house' },
          { id: 2, name: 'Office Cleaning', vendor: 'Sparkle Clean Co.', rating: 4.8, reviews: 189, price: '$200', iconType: 'buildings' },
          { id: 3, name: 'Apartment Cleaning', vendor: 'Fresh Start Cleaning', rating: 4.7, reviews: 156, price: '$120', iconType: 'spray-bottle' },
        ]
      };
    }
    // Check for handyman services
    else if (userMessage.includes('handyman') || userMessage.includes('repair') || userMessage.includes('fix')) {
      return {
        id: messages.length + 2,
        sender: 'ai',
        text: "Here are the best handyman services I found for you:",
        type: 'service-cards',
        services: [
          { id: 1, name: 'Plumbing Repair', vendor: 'DoHuub Official', rating: 4.9, reviews: 210, price: '$85/hr', iconType: 'wrench' },
          { id: 2, name: 'Electrical Work', vendor: 'Home Repair Masters', rating: 4.8, reviews: 175, price: '$95/hr', iconType: 'lightning' },
          { id: 3, name: 'Furniture Assembly', vendor: 'Expert Handyman Services', rating: 4.7, reviews: 142, price: '$65', iconType: 'screwdriver' },
        ]
      };
    }
    // Check for beauty services
    else if (userMessage.includes('beauty') || userMessage.includes('salon') || userMessage.includes('hair') || userMessage.includes('nails')) {
      return {
        id: messages.length + 2,
        sender: 'ai',
        text: "Here are popular beauty services near you:",
        type: 'service-cards',
        services: [
          { id: 1, name: 'Hair Styling & Cut', vendor: 'DoHuub Official', rating: 4.9, reviews: 320, price: '$45-80', iconType: 'scissors' },
          { id: 2, name: 'Manicure & Pedicure', vendor: 'Glamour Studio', rating: 4.8, reviews: 256, price: '$35-60', iconType: 'paint-brush' },
          { id: 3, name: 'Makeup Services', vendor: 'Beauty on Demand', rating: 4.7, reviews: 198, price: '$60-120', iconType: 'eyedropper' },
        ]
      };
    }
    // Check for food/groceries
    else if (userMessage.includes('food') || userMessage.includes('grocery') || userMessage.includes('groceries') || userMessage.includes('order')) {
      return {
        id: messages.length + 2,
        sender: 'ai',
        text: "I can help you with food delivery and groceries. What would you like to order?",
        type: 'category-chips',
        categories: ['Fresh Produce', 'Dairy & Eggs', 'Bakery', 'Snacks', 'Beverages', 'Ready-to-Eat']
      };
    }
    // Check for ride/caregiving
    else if (userMessage.includes('ride') || userMessage.includes('transport') || userMessage.includes('caregiv')) {
      return {
        id: messages.length + 2,
        sender: 'ai',
        text: "I can help you with transportation and caregiving services. Which service do you need?",
        type: 'category-chips',
        categories: ['Ride Assistance', 'Companionship Support', 'Medical Transport', 'Airport Transfer']
      };
    }
    // Check for rental properties
    else if (userMessage.includes('rent') || userMessage.includes('apartment') || userMessage.includes('house') || userMessage.includes('property')) {
      return {
        id: messages.length + 2,
        sender: 'ai',
        text: "I can help you find rental properties. What type of property are you looking for?",
        type: 'category-chips',
        categories: ['Apartments', 'Houses', 'Condos', 'Studios', 'Shared Rooms']
      };
    }
    // General help or greeting
    else if (userMessage.includes('hello') || userMessage.includes('hi') || userMessage.includes('hey')) {
      return {
        id: messages.length + 2,
        sender: 'ai',
        text: "Hello! I'm here to help you with all DoHuub services. What can I assist you with today?",
        type: 'category-chips',
        categories: ['Cleaning Services', 'Handyman Services', 'Groceries & Food', 'Beauty Services', 'Rentals', 'Caregiving']
      };
    }
    // Default response
    else {
      return {
        id: messages.length + 2,
        sender: 'ai',
        text: "I can help you with various services. Here are our main categories:",
        type: 'category-chips',
        categories: ['Cleaning Services', 'Handyman Services', 'Groceries & Food', 'Beauty Services', 'Rentals', 'Caregiving']
      };
    }
  };

  const handlePromptClick = (prompt: string) => {
    handleSend(prompt);
  };

  const handleServiceClick = (service: any) => {
    // Navigate to appropriate service category
    if (service.name.toLowerCase().includes('clean')) {
      navigate('vendorsList', { selectedCategory: 'Cleaning Services' });
    } else if (service.name.toLowerCase().includes('plumb') || service.name.toLowerCase().includes('electric') || service.name.toLowerCase().includes('repair') || service.name.toLowerCase().includes('furniture')) {
      navigate('handymanVendorsList', { selectedCategory: 'Handyman Services' });
    } else if (service.name.toLowerCase().includes('hair') || service.name.toLowerCase().includes('nail') || service.name.toLowerCase().includes('makeup') || service.name.toLowerCase().includes('beauty')) {
      navigate('beautyChoice', { selectedCategory: 'Beauty Services and Products' });
    } else {
      navigate('home');
    }
  };

  const handleCategoryClick = (category: string) => {
    // Navigate to appropriate category
    if (category === 'Cleaning Services') {
      navigate('vendorsList', { selectedCategory: category });
    } else if (category === 'Handyman Services') {
      navigate('handymanVendorsList', { selectedCategory: category });
    } else {
      navigate('serviceListings', { selectedCategory: category });
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: 1,
        sender: 'ai',
        text: "Hi! I'm your DoHuub assistant. How can I help you today?",
        type: 'text'
      },
    ]);
    setInput('');
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
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
        <div className="flex items-center justify-between">
          <h1
            style={{
              color: 'var(--foreground)',
              fontSize: '20px',
              fontWeight: 600,
            }}
          >
            AI Assistant
          </h1>
          <button
            onClick={handleNewChat}
            className="px-4 py-2 rounded-xl shadow-premium-sm transition-all duration-300 hover:shadow-premium-md hover:scale-105 active:scale-95"
            style={{ color: 'var(--primary)', backgroundColor: 'rgba(46, 122, 217, 0.1)', border: '1px solid rgba(46, 122, 217, 0.2)', fontWeight: 500 }}
          >
            New Chat
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-32">
        {messages.length === 1 && (
          <div className="mb-6">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full flex items-center justify-center shadow-premium-lg animate-pulse-soft" style={{ backgroundColor: 'var(--secondary)' }}>
                <Bot className="w-12 h-12" style={{ color: 'var(--primary)' }} strokeWidth={1.5} />
              </div>
            </div>
            <p className="text-center mb-6" style={{ color: 'var(--foreground)' }}>How can I help you today?</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={prompt}
                  onClick={() => handlePromptClick(prompt)}
                  className="px-4 py-2 rounded-full shadow-premium-sm transition-all duration-300 hover:shadow-premium-md hover:scale-105 active:scale-95"
                  style={{ backgroundColor: 'var(--secondary)', color: 'var(--foreground)', border: '1px solid rgba(46, 122, 217, 0.1)' }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {messages.slice(1).map((message) => (
            <div key={message.id} className="">
              <div
                className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'ai' && (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-premium-sm" style={{ backgroundColor: 'var(--secondary)' }}>
                    <Bot className="w-6 h-6" style={{ color: 'var(--primary)' }} />
                  </div>
                )}
                <div
                  className="max-w-[75%] p-4 rounded-2xl shadow-premium-md"
                  style={message.sender === 'user'
                    ? { background: 'var(--primary-gradient)', color: 'white', borderBottomRightRadius: '0.125rem' }
                    : { backgroundColor: 'var(--card)', color: 'var(--foreground)', borderBottomLeftRadius: '0.125rem', border: '1px solid rgba(46, 122, 217, 0.08)' }
                  }
                >
                  <p>{message.text}</p>
                </div>
                {message.sender === 'user' && (
                  <img src={profilePhoto} alt="You" className="w-10 h-10 rounded-full object-cover flex-shrink-0 shadow-premium-sm" />
                )}
              </div>

              {/* Service Cards */}
              {message.type === 'service-cards' && message.services && (
                <div className="mt-3 ml-13 space-y-2">
                  {message.services.map((service, index) => (
                    <button
                      key={service.id}
                      onClick={() => handleServiceClick(service)}
                      className="w-full p-4 rounded-xl text-left shadow-card transition-all duration-300 hover:shadow-card-hover hover:scale-[1.01] active:scale-[0.99]"
                      style={{ backgroundColor: 'var(--card)', border: '1px solid rgba(46, 122, 217, 0.08)' }}
                    >
                      <div className="flex gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--secondary)' }}>
                          <ServiceIcon iconType={service.iconType} size={24} />
                        </div>
                        <div className="flex-1">
                          <p className="mb-1" style={{ color: 'var(--foreground)' }}>{service.name}</p>
                          <p className="text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>{service.vendor}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-sm" style={{ color: '#F59E0B' }}>★ {service.rating}</span>
                            <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>({service.reviews} reviews)</span>
                            <span className="ml-auto" style={{ color: 'var(--primary)' }}>{service.price}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={() => handleServiceClick(message.services![0])}
                    className="w-full py-3 border-2 rounded-xl transition-colors hover:border-[var(--primary)]"
                    style={{ color: 'var(--primary)', borderColor: 'var(--border)' }}
                  >
                    View All Services
                  </button>
                </div>
              )}

              {/* Category Chips */}
              {message.type === 'category-chips' && message.categories && (
                <div className="mt-3 ml-13 flex flex-wrap gap-2">
                  {message.categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryClick(category)}
                      className="px-4 py-2 rounded-full border-2 transition-colors hover:border-[var(--primary)]"
                      style={{ backgroundColor: 'var(--chip-background)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--secondary)' }}>
                <Bot className="w-6 h-6" style={{ color: 'var(--primary)' }} />
              </div>
              <div className="max-w-[75%] p-4 rounded-2xl" style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)', borderBottomLeftRadius: '0.125rem' }}>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--primary)' }}></div>
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--primary)' }}></div>
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--primary)' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="absolute left-0 right-0 px-6 py-3" style={{ bottom: '120px', background: 'var(--background)' }}>
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-3 rounded-full outline-none transition-all duration-300 shadow-premium-sm focus-glow"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', color: 'var(--foreground)', border: '1px solid rgba(46, 122, 217, 0.1)' }}
          />
          <button
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-premium-sm transition-all duration-300 hover:shadow-premium-md hover:scale-105 active:scale-95"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
          >
            <Mic className="w-6 h-6" style={{ color: 'var(--muted-foreground)' }} />
          </button>
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-110 active:scale-95"
            style={{
              background: input.trim() ? 'var(--primary-gradient)' : 'var(--muted)',
              boxShadow: input.trim() ? '0 4px 14px 0 rgba(76, 166, 250, 0.39)' : 'none'
            }}
          >
            <Send className="w-6 h-6" style={{ color: input.trim() ? 'white' : 'var(--muted-foreground)' }} />
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="aiChat" navigate={navigate} />
    </div>
  );
}