import { ArrowLeft, Star } from 'lucide-react';
import { useState } from 'react';

interface BeautyService {
  id: number;
  name: string;
  category: string;
  price: string;
  duration: string;
  rating: number;
  reviews: number;
}

interface BeautyServicesListProps {
  providerName: string;
  onBack: () => void;
  onSelectService: (service: BeautyService) => void;
}

export function BeautyServicesList({
  providerName,
  onBack,
  onSelectService
}: BeautyServicesListProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const services: BeautyService[] = [
    {
      id: 1,
      name: 'Professional Makeup',
      category: 'Makeup',
      price: '$80.00',
      duration: '90 min',
      rating: 4.9,
      reviews: 342
    },
    {
      id: 2,
      name: 'Bridal Makeup',
      category: 'Makeup',
      price: '$200.00',
      duration: '180 min',
      rating: 4.9,
      reviews: 289
    },
    {
      id: 3,
      name: 'Hair Styling',
      category: 'Hair',
      price: '$60.00',
      duration: '60 min',
      rating: 4.8,
      reviews: 425
    },
    {
      id: 4,
      name: 'Hair Coloring',
      category: 'Hair',
      price: '$120.00',
      duration: '120 min',
      rating: 4.7,
      reviews: 198
    },
    {
      id: 5,
      name: 'Facial Treatment',
      category: 'Skincare',
      price: '$70.00',
      duration: '75 min',
      rating: 4.8,
      reviews: 267
    },
    {
      id: 6,
      name: 'Deep Cleansing Facial',
      category: 'Skincare',
      price: '$90.00',
      duration: '90 min',
      rating: 4.9,
      reviews: 312
    },
    {
      id: 7,
      name: 'Manicure',
      category: 'Nails',
      price: '$35.00',
      duration: '45 min',
      rating: 4.7,
      reviews: 453
    },
    {
      id: 8,
      name: 'Pedicure',
      category: 'Nails',
      price: '$40.00',
      duration: '60 min',
      rating: 4.8,
      reviews: 389
    },
    {
      id: 9,
      name: 'Gel Nail Extensions',
      category: 'Nails',
      price: '$65.00',
      duration: '90 min',
      rating: 4.9,
      reviews: 276
    },
    {
      id: 10,
      name: 'Full Body Massage',
      category: 'Spa',
      price: '$100.00',
      duration: '90 min',
      rating: 4.9,
      reviews: 521
    }
  ];

  // Generic categories for all beauty service providers
  const categories = ['All', 'Makeup', 'Hair', 'Skincare', 'Nails', 'Spa'];

  const filteredServices = selectedCategory === 'All' 
    ? services 
    : services.filter(s => s.category === selectedCategory);

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-gray-900">{providerName}</h1>
            <p className="text-sm text-gray-600">Browse services</p>
          </div>
        </div>
      </div>

      {/* Horizontal Category Tabs */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 overflow-x-auto">
        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Services List */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-3">
          {filteredServices.map((service) => (
            <button
              key={service.id}
              onClick={() => onSelectService(service)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-gray-900 transition-colors text-left"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex-1">
                  <h4 className="text-gray-900 mb-1">{service.name}</h4>
                  <p className="text-sm text-gray-600">{service.duration}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-900">{service.price}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-gray-900 fill-gray-900" />
                  <span className="text-sm text-gray-900">{service.rating}</span>
                </div>
                <span className="text-sm text-gray-600">({service.reviews} reviews)</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}