// Helper functions for vendor business logic
// Note: All mock data objects have been removed and replaced with API calls

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
