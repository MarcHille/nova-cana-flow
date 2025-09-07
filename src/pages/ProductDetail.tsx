
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductDetailComponent from "@/components/products/ProductDetail";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { products as mockProducts } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Add abort controller for cleanup on unmount
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => {
      if (!abortController.signal.aborted) {
        abortController.abort();
        setError("Die Anfrage hat zu lange gedauert. Bitte versuchen Sie es später erneut.");
        setIsLoading(false);
      }
    }, 10000);

    const fetchProduct = async () => {
      if (!id) {
        navigate("/products", { replace: true });
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // First, try to fetch from Supabase with proper security
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        
        clearTimeout(timeoutId);
        if (abortController.signal.aborted) return;
        
        if (error) {
          // If supabase error, fall back to mock data in development
          if (process.env.NODE_ENV === 'development') {
            const foundProduct = mockProducts.find((p) => p.id === id);
            if (foundProduct) {
              setProduct(foundProduct);
            } else {
              navigate("/products", { replace: true });
            }
          } else {
            throw error;
          }
        } else if (data) {
          // Map data with validation and security checks
          setProduct({
            id: data.id || "",
            name: data.name || "",
            description: data.description || "",
            shortDescription: data.short_description || "",
            price: typeof data.price === 'number' ? data.price : 0,
            imageUrl: data.image_url || "",
            category: data.category || "",
            stock: typeof data.stock === 'number' ? data.stock : 0,
            thcContent: data.thc_content || "",
            cbdContent: data.cbd_content || "",
            terpenes: Array.isArray(data.terpenes) ? data.terpenes : [],
            weight: data.weight || "",
            recommendedDosage: data.dosage || "",
            manufacturer: "",
            countryOfOrigin: data.origin || "",
            pzn: data.pzn || "",
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at),
          });
        } else {
          // Fallback to mock data search
          const foundProduct = mockProducts.find((p) => p.id === id);
          if (foundProduct) {
            setProduct(foundProduct);
          } else {
            navigate("/products", { replace: true });
          }
        }
      } catch (error: any) {
        console.error("Error fetching product:", error);
        
        // Provide relevant error messages
        if (error.code === '23505') {
          setError("Datenbankfehler: Duplizierter Eintrag");
        } else if (error.code === 'PGRST116') {
          setError("Produkt nicht gefunden");
        } else {
          setError("Fehler beim Laden des Produkts: " + (error.message || "Unbekannter Fehler"));
        }
        
        // Try fallback to mock data in development
        if (process.env.NODE_ENV === 'development') {
          const foundProduct = mockProducts.find((p) => p.id === id);
          if (foundProduct) {
            setProduct(foundProduct);
            setError(null);
          }
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchProduct();
    
    return () => {
      clearTimeout(timeoutId);
      abortController.abort();
    };
  }, [id, navigate, retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        {error && (
          <div className="container-content py-4">
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Fehler</AlertTitle>
              <AlertDescription>
                {error}
                <div className="mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRetry}
                    className="flex items-center gap-1"
                  >
                    <RefreshCw className="h-4 w-4" /> Erneut versuchen
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}
        
        {isLoading ? (
          <div className="container-content py-8">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                
                <div className="space-y-4">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mt-4"></div>
                  
                  <div className="h-px bg-gray-200 dark:bg-gray-700 my-6"></div>
                  
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                  <div className="flex space-x-4">
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                  </div>
                  
                  <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-full mt-6"></div>
                </div>
              </div>
            </div>
          </div>
        ) : product ? (
          <ProductDetailComponent product={product} />
        ) : !error ? (
          <div className="container-content py-8 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Produkt nicht gefunden</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Das gesuchte Produkt konnte nicht gefunden werden.
            </p>
            <Button onClick={() => navigate('/products')}>
              Zurück zur Produktübersicht
            </Button>
          </div>
        ) : null}
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
