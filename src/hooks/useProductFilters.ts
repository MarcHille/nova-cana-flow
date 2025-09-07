
import { useState, useEffect } from "react";
import { Product } from "@/types";
import { translateCategory, PRODUCT_CATEGORIES } from "@/utils/productUtils";
import { sanitizeString } from "@/utils/securityUtils";

export function useProductFilters(products: Product[]) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [productsCount, setProductsCount] = useState<number>(0);
  
  // Filter products based on search query and category
  useEffect(() => {
    let result = products;
    
    // Apply search filter with sanitized input
    if (searchQuery) {
      const query = sanitizeString(searchQuery).toLowerCase();
      
      // Only process searches with reasonable length
      if (query.length > 0 && query.length < 100) {
        result = result.filter(
          product => 
            (product.name && product.name.toLowerCase().includes(query)) || 
            (product.description && product.description.toLowerCase().includes(query)) ||
            (product.pzn && product.pzn.toLowerCase().includes(query))
        );
      }
    }
    
    // Apply category filter with validation
    if (selectedCategory && selectedCategory !== "all") {
      // Sanitize the category input
      const safeCategory = sanitizeString(selectedCategory);
      
      result = result.filter(product => {
        if (!product.category) return false;
        
        // Match exact category or translate if needed
        return product.category === safeCategory || 
               translateCategory(product.category, "de") === safeCategory;
      });
    }
    
    setFilteredProducts(result);
    setProductsCount(result.length);
  }, [searchQuery, selectedCategory, products]);
  
  // Get unique categories from products with validation
  const getUniqueCategories = () => {
    const categorySet = new Set<string>();
    
    // Add our predefined categories
    Object.values(PRODUCT_CATEGORIES).forEach(cat => {
      if (typeof cat === 'string') {
        categorySet.add(cat);
      }
    });
    
    // Add any categories from the products with validation
    products.forEach(product => {
      if (product.category && typeof product.category === 'string') {
        const displayCategory = translateCategory(product.category, "de");
        if (displayCategory) categorySet.add(displayCategory);
      }
    });
    
    return Array.from(categorySet).sort();
  };
  
  const categories = getUniqueCategories();
  
  return {
    filteredProducts,
    productsCount,
    searchQuery,
    setSearchQuery: (query: string) => setSearchQuery(sanitizeString(query)),
    selectedCategory,
    setSelectedCategory: (category: string) => setSelectedCategory(sanitizeString(category)),
    categories
  };
}
