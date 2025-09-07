
// Define specific German cannabis product categories
export const PRODUCT_CATEGORIES = {
  FLOWER: "Blüten",
  TINCTURE: "Tinkturen",
  EXTRACT: "Raffinierte Extrakte",
  OTHER: "Sonstiges"
};

export const translateCategory = (category: string, language: string = "de"): string => {
  // Define allowed translations for security
  const categories: Record<string, string> = {
    "flower": language === "de" ? "Blüten" : "Flower",
    "extract": language === "de" ? "Raffinierte Extrakte" : "Extract",
    "oil": language === "de" ? "Öl" : "Oil",
    "capsule": language === "de" ? "Kapsel" : "Capsule",
    "tincture": language === "de" ? "Tinkturen" : "Tincture",
    "other": language === "de" ? "Sonstiges" : "Other",
    // Map database values to display values
    "Blüten": "Blüten",
    "Tinkturen": "Tinkturen",
    "Raffinierte Extrakte": "Raffinierte Extrakte",
    "Sonstiges": "Sonstiges",
  };
  // Return only from predefined set or original as fallback
  return categories[category.toLowerCase()] || category;
};

// Safely format price with validation
export const formatPrice = (price: number): string => {
  if (typeof price !== 'number' || isNaN(price)) {
    return '€0.00';
  }
  return `€${price.toFixed(2)}`;
};

// Get translations for the products page
export const getProductTranslations = (language: string = "de") => {
  return {
    title: language === "de" 
      ? "Medizinische Cannabis Produkte" 
      : "Medical Cannabis Products",
    description: language === "de"
      ? "Durchsuchen Sie unser Sortiment an hochwertigen medizinischen Cannabis-Produkten für Ihre Apotheke."
      : "Browse our selection of high-quality medical cannabis products available for pharmacy order.",
    search: language === "de"
      ? "Produkte suchen..."
      : "Search products...",
    loading: language === "de"
      ? "Laden..."
      : "Loading...",
    noResults: language === "de"
      ? "Keine Produkte gefunden"
      : "No products found",
    productsFound: (count: number) => language === "de"
      ? `${count} Produkte gefunden`
      : `${count} products found`,
    category: language === "de" ? "Kategorie" : "Category",
    price: language === "de" ? "Preis" : "Price",
    errorTitle: language === "de" ? "Fehler" : "Error",
    retry: language === "de" ? "Erneut versuchen" : "Try again",
    gridView: language === "de" ? "Kachelansicht" : "Grid View",
    tableView: language === "de" ? "Tabellenansicht" : "Table View",
  };
};

// Function to get all unique category values
export const getCategoriesFromProducts = (products: any[]): string[] => {
  const categories = [...new Set(products.map(product => product.category))].filter(Boolean);
  return categories;
};

// Function to map database categories to display categories where needed
export const mapCategoryFromDatabase = (category: string): string => {
  const categoryMap: Record<string, string> = {
    // Map any database values that need translation
  };
  
  return categoryMap[category] || category;
};
