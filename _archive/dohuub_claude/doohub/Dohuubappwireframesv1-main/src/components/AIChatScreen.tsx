import { ArrowLeft, Send, Mic, Home, Calendar, MessageCircle, User, Bot } from 'lucide-react';
import { useState } from 'react';
import type { Screen } from '../App';

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
          { id: 1, name: 'Deep House Cleaning', vendor: 'DoHuub Official Store', rating: 4.9, reviews: 234, price: '$150', emoji: '🏠' },
          { id: 2, name: 'Office Cleaning', vendor: 'Sparkle Clean Co.', rating: 4.8, reviews: 189, price: '$200', emoji: '🏢' },
          { id: 3, name: 'Apartment Cleaning', vendor: 'Fresh Start Cleaning', rating: 4.7, reviews: 156, price: '$120', emoji: '🧹' },
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
          { id: 1, name: 'Plumbing Repair', vendor: 'DoHuub Official', rating: 4.9, reviews: 210, price: '$85/hr', emoji: '🔧' },
          { id: 2, name: 'Electrical Work', vendor: 'Home Repair Masters', rating: 4.8, reviews: 175, price: '$95/hr', emoji: '⚡' },
          { id: 3, name: 'Furniture Assembly', vendor: 'Expert Handyman Services', rating: 4.7, reviews: 142, price: '$65', emoji: '🪛' },
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
          { id: 1, name: 'Hair Styling & Cut', vendor: 'DoHuub Official', rating: 4.9, reviews: 320, price: '$45-80', emoji: '💇' },
          { id: 2, name: 'Manicure & Pedicure', vendor: 'Glamour Studio', rating: 4.8, reviews: 256, price: '$35-60', emoji: '💅' },
          { id: 3, name: 'Makeup Services', vendor: 'Beauty on Demand', rating: 4.7, reviews: 198, price: '$60-120', emoji: '💄' },
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
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-4 border-b-2 border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-900">AI Assistant</h3>
          <button onClick={handleNewChat} className="text-gray-700 px-3 py-1 border-2 border-gray-300 rounded-lg">
            New Chat
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-32">
        {messages.length === 1 && (
          <div className="mb-6">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
                <Bot className="w-12 h-12 text-gray-600" strokeWidth={1.5} />
              </div>
            </div>
            <p className="text-center text-gray-900 mb-6">How can I help you today?</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handlePromptClick(prompt)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full border-2 border-gray-200 hover:border-gray-800"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {messages.slice(1).map((message) => (
            <div key={message.id}>
              <div
                className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'ai' && (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-6 h-6 text-gray-600" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] p-4 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-gray-800 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                  }`}
                >
                  <p>{message.text}</p>
                </div>
                {message.sender === 'user' && (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0"></div>
                )}
              </div>

              {/* Service Cards */}
              {message.type === 'service-cards' && message.services && (
                <div className="mt-3 ml-13 space-y-2">
                  {message.services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => handleServiceClick(service)}
                      className="w-full p-4 border-2 border-gray-200 rounded-lg text-left hover:border-gray-800"
                    >
                      <div className="flex gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-xl flex-shrink-0">
                          {service.emoji}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 mb-1">{service.name}</p>
                          <p className="text-gray-600 text-sm mb-1">{service.vendor}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700 text-sm">★ {service.rating}</span>
                            <span className="text-gray-500 text-sm">({service.reviews} reviews)</span>
                            <span className="text-gray-900 ml-auto">{service.price}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={() => handleServiceClick(message.services![0])}
                    className="w-full py-3 text-gray-700 border-2 border-gray-300 rounded-lg hover:border-gray-800"
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
                      className="px-4 py-2 bg-white text-gray-700 rounded-full border-2 border-gray-300 hover:border-gray-800 hover:bg-gray-50"
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
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <Bot className="w-6 h-6 text-gray-600" />
              </div>
              <div className="max-w-[75%] p-4 rounded-2xl bg-gray-100 text-gray-900 rounded-bl-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 px-6 py-4">
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-full focus:outline-none focus:border-gray-500"
          />
          <button className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 hover:bg-gray-200">
            <Mic className="w-6 h-6 text-gray-600" />
          </button>
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
              input.trim() ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200'
            }`}
          >
            <Send className={`w-6 h-6 ${input.trim() ? 'text-white' : 'text-gray-400'}`} />
          </button>
        </div>

        {/* Bottom Navigation */}
        <div className="flex justify-around">
          <button onClick={() => navigate('home')} className="flex flex-col items-center gap-1">
            <Home className="w-6 h-6 text-gray-400" strokeWidth={2} />
            <span className="text-gray-400">Home</span>
          </button>
          <button onClick={() => navigate('myBookings')} className="flex flex-col items-center gap-1">
            <Calendar className="w-6 h-6 text-gray-400" strokeWidth={2} />
            <span className="text-gray-400">Bookings</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <MessageCircle className="w-6 h-6 text-gray-800" strokeWidth={2} />
            <span className="text-gray-800">AI Assistant</span>
          </button>
          <button onClick={() => navigate('profile')} className="flex flex-col items-center gap-1">
            <User className="w-6 h-6 text-gray-400" strokeWidth={2} />
            <span className="text-gray-400">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}