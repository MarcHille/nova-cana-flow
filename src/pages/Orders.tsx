import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CartItem, Product } from "@/types";
import { products as mockProducts } from "@/data/products";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import OrderForm from "@/components/orders/OrderForm";
import EmptyCart from "@/components/orders/EmptyCart";
import LoadingSpinner from "@/components/ui/loading-spinner";
import CartView from "@/components/orders/CartView";
import { useCartStore } from "@/stores/useCartStore";

const Orders = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Use the Cart Store for consistent cart management
  const { items: cartItems, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();
  
  // Authentication check using AuthContext
  const { isAdmin, isPharmacist, isVerifiedPharmacist, user, loading } = useAuth();

  // Check access permissions
  useEffect(() => {
    // Wait for auth to complete
    if (loading) return;
    
    // Check if user has access
    if (!user) {
      toast({
        title: "Anmeldung erforderlich",
        description: "Sie müssen angemeldet sein, um auf diese Seite zuzugreifen.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    // Redirect admin to admin portal
    if (isAdmin) {
      navigate('/admin');
      return;
    }
    
    // Check pharmacist permissions
    if (!isPharmacist) {
      toast({
        title: "Zugriff verweigert",
        description: "Sie haben keine Berechtigung, auf diese Seite zuzugreifen.",
        variant: "destructive"
      });
      navigate('/dashboard');
      return;
    }
    
    if (!isVerifiedPharmacist) {
      toast({
        title: "Verifizierung erforderlich",
        description: "Ihr Apothekerkonto muss verifiziert sein, um auf diese Seite zuzugreifen.",
        variant: "destructive"
      });
      navigate('/dashboard');
      return;
    }

    // Load products from Supabase
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          // Transform data safely with validation
          const transformedProducts = data.map(product => ({
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
            manufacturer: product.origin || "",
            countryOfOrigin: product.origin || "",
            pzn: product.pzn || "",
            createdAt: new Date(product.created_at || Date.now()),
            updatedAt: new Date(product.updated_at || Date.now()),
          }));
          setProducts(transformedProducts);
        } else {
          // Fallback to mock data if no products found in DB
          console.log("No products found in database, using mock data");
          setProducts(mockProducts);
        }
      } catch (error) {
        console.error("Error loading products:", error);
        // Fallback to mock data on error
        setProducts(mockProducts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [toast, navigate, isAdmin, isPharmacist, isVerifiedPharmacist, loading, user]);

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
    toast({
      title: "Artikel entfernt",
      description: "Der Artikel wurde aus dem Warenkorb entfernt.",
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      handleRemoveItem(productId);
      return;
    }
    
    updateQuantity(productId, quantity);
  };

  const handleClearCart = () => {
    clearCart();
    toast({
      title: "Warenkorb geleert",
      description: "Alle Artikel wurden aus dem Warenkorb entfernt.",
    });
  };

  const getCartTotal = () => {
    return getTotalPrice();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const handleGoToProducts = () => {
    navigate('/products');
  };

  // Show loading while auth is being checked
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link to="/orders/cart" className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm">
              <ArrowLeft size={16} className="mr-1" />
              <span>Zurück zum Warenkorb</span>
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Bestellung abschließen
          </h1>
          
          {isLoading ? (
            <LoadingSpinner />
          ) : cartItems.length === 0 ? (
            <EmptyCart onGoToProducts={handleGoToProducts} />
          ) : (
            <OrderForm 
              cartItems={cartItems}
              products={products}
              onRemoveItem={handleRemoveItem}
              onUpdateQuantity={handleUpdateQuantity}
              onClearCart={handleClearCart}
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Orders;
