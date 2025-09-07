
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";
import { products as mockProducts } from "@/data/products";

export function useProductsList() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [retryCount, setRetryCount] = useState(0);

  // Secure product fetching with proper error handling and retry logic
  useEffect(() => {
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => {
      if (!abortController.signal.aborted) {
        abortController.abort();
        setError("Die Anfrage hat zu lange gedauert. Bitte versuchen Sie es später erneut.");
        setIsLoading(false);
      }
    }, 15000);

    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log("Fetching products on Products page...");
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .abortSignal(abortController.signal);
        
        clearTimeout(timeoutId);
        if (abortController.signal.aborted) return;
        
        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }
        
        console.log(`Fetched ${data?.length || 0} products from Supabase`);
        
        if (data && data.length > 0) {
          // Map data safely with validation
          setProducts(data.map(product => ({
            id: product.id || "",
            name: product.name || "",
            description: product.description || "",
            shortDescription: product.short_description || "",
            price: typeof product.price === 'number' ? product.price : 0,
            imageUrl: product.image_url || "",
            category: product.category || "",
            stock: typeof product.stock === 'number' ? product.stock : 0,
            thcContent: product.thc_content || "",
            cbdContent: product.cbd_content || "",
            terpenes: Array.isArray(product.terpenes) ? product.terpenes : [],
            weight: product.weight || "",
            recommendedDosage: product.dosage || "",
            // Fix: Map origin to manufacturer since manufacturer doesn't exist in DB
            manufacturer: product.origin || "",
            countryOfOrigin: product.origin || "",
            pzn: product.pzn || "",
            createdAt: new Date(product.created_at || Date.now()),
            updatedAt: new Date(product.updated_at || Date.now()),
          })));
        } else {
          // Fallback to mock data when no products found in DB
          console.log("No products found in database, using mock data");
          setProducts(mockProducts);
        }
      } catch (error: any) {
        console.error("Error fetching products:", error);
        // More descriptive error messages
        if (error.code === 'PGRST301') {
          setError("Datenbank nicht erreichbar. Bitte versuchen Sie es später erneut.");
        } else if (error.code === '20') {
          setError("Netzwerkfehler. Bitte überprüfen Sie Ihre Verbindung.");
        } else {
          setError(error.message || "Fehler beim Laden der Produkte / Error loading products");
        }
        // Fallback to mock data on error in development
        if (process.env.NODE_ENV === 'development') {
          console.log("Using mock data due to error");
          setProducts(mockProducts);
        } else {
          setProducts([]); // Clear products on error in production
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchProducts();
    
    return () => {
      clearTimeout(timeoutId);
      abortController.abort();
    };
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  return {
    products,
    isLoading,
    error,
    handleRetry
  };
}
