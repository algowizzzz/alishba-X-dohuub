// Utility functions for vendor business data

const PRODUCT_CATEGORIES = ["Food", "Beauty Products", "Products"];

export function isProductCategory(category: string): boolean {
  return PRODUCT_CATEGORIES.some(
    (cat) => category?.toLowerCase().includes(cat.toLowerCase())
  );
}

export function getCreateButtonText(category: string): string {
  if (isProductCategory(category)) {
    return "+ Add Product";
  }
  return "+ Add Service";
}
