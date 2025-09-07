
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductSearch from "@/components/products/ProductSearch";
import { Product } from "@/types";
import { useAuthentication } from "@/hooks/useAuthentication";
import { useProductsList } from "@/hooks/useProductsList";
import { useProductFilters } from "@/hooks/useProductFilters";
import ProductsHeader from "@/components/products/ProductsHeader";
import ProductsContent from "@/components/products/ProductsContent";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ProductQuickView from "@/components/products/ProductQuickView";
import { useCartStore } from "@/stores/useCartStore";

const Products = () => {
  // Using only table view now
  const [viewMode] = useState<"grid" | "table">("table");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  
  const { isAdmin, isPharmacist } = useAuthentication();
  const { products, isLoading, error, handleRetry } = useProductsList();
  const navigate = useNavigate();
  const { toast } = useToast();
  const cartItemsCount = useCartStore(state => state.getTotalItems());
  
  // Custom hooks for product management
  const {
    filteredProducts,
    productsCount,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories
  } = useProductFilters(products);

  // Check access rights - allow all pharmacists for now
  const hasAccess = isAdmin || isPharmacist;
  
  useEffect(() => {
    if (!hasAccess && !isLoading) {
      toast({
        title: "Zugriff verweigert",
        description: "Sie benötigen Apothekerrechte, um auf diese Seite zuzugreifen.",
        variant: "destructive"
      });
      navigate("/dashboard");
    }
  }, [hasAccess, isLoading, navigate, toast]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleGoToCart = () => {
    navigate('/orders/cart');
  };

  // Show access denied if no access
  if (!hasAccess) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 pt-24 pb-12 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <Alert variant="destructive" className="my-8">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Zugriff verweigert</AlertTitle>
              <AlertDescription>
                Sie benötigen Apothekerrechte, um auf diese Seite zuzugreifen.
                <div className="mt-4">
                  <Button onClick={() => navigate("/dashboard")}>
                    Zurück zum Dashboard
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Button variant="outline" onClick={() => navigate("/dashboard")} className="mb-4">
              ← Zurück zum Dashboard
            </Button>
          </div>
          
          <ProductsHeader 
            productsCount={productsCount}
            isLoading={isLoading}
            viewMode={viewMode}
          />
          
          <div className="flex justify-end mb-4">
            <Button 
              onClick={handleGoToCart} 
              variant="default"
              className="bg-purple-600 hover:bg-purple-700"
            >
              Zum Warenkorb {cartItemsCount > 0 && `(${cartItemsCount})`}
            </Button>
          </div>
          
          <ProductSearch 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="Produkte suchen (Name, Beschreibung, PZN...)"
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            onSearch={handleSearch}
          />
          
          <ProductsContent
            isLoading={isLoading}
            error={error}
            filteredProducts={filteredProducts}
            viewMode={viewMode}
            handleRetry={handleRetry}
            handleProductSelect={handleProductSelect}
          />
          
          <ProductQuickView
            product={selectedProduct}
            open={isQuickViewOpen}
            onOpenChange={setIsQuickViewOpen}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Products;
