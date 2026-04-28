// Shared business information for single vendor across all stores
export const vendorBusinessInfo = {
  owner: "John Smith",
  businessName: "John's Services",
  email: "john.smith@dohuub.com",
  phone: "+1 (555) 123-4567",
  taxId: "XX-XXXXXXX789",
  businessAddress: "789 Main Street, Suite 200, New York, NY 10001",
  businessType: "LLC",
  subscription: "Pro Plan",
  joined: "2024-03-15",
};

// Store category mapping with their unique store details
export const storeDataMap: Record<string, { 
  category: string; 
  name: string;
  description: string;
}> = {
  "1": { 
    category: "Cleaning Services", 
    name: "Sparkle Clean Co.",
    description: "Professional cleaning services for residential and commercial properties"
  },
  "2": { 
    category: "Handyman Services", 
    name: "Fix-It Pro Services",
    description: "Expert handyman services for all your home repair needs"
  },
  "3": { 
    category: "Groceries", 
    name: "Fresh Harvest Groceries",
    description: "Fresh, organic groceries delivered to your door"
  },
  "4": { 
    category: "Food", 
    name: "Mama's Kitchen",
    description: "Homemade meals and catering services"
  },
  "5": { 
    category: "Beauty Services", 
    name: "Glam Beauty Studio",
    description: "Premium beauty and spa services"
  },
  "6": { 
    category: "Beauty Products", 
    name: "Pure Skincare Boutique",
    description: "Curated selection of premium beauty products"
  },
  "7": { 
    category: "Rental Properties", 
    name: "Urban Stays Properties",
    description: "Comfortable short-term rental properties"
  },
  "8": { 
    category: "Ride Assistance", 
    name: "CareWheels Transportation",
    description: "Reliable transportation assistance services"
  },
  "9": { 
    category: "Companionship Support", 
    name: "Caring Companions",
    description: "Professional companionship and support services"
  },
};

// Product categories (for Groceries, Food, Beauty Products)
export const productCategories = ["Groceries", "Food", "Beauty Products"];

// Check if a category is a product category
export function isProductCategory(category: string): boolean {
  return productCategories.includes(category);
}

// Get button text based on category
export function getCreateButtonText(category: string): string {
  return isProductCategory(category) ? "Create New Product" : "Create New Service";
}