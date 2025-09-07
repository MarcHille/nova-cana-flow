
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/useCartStore";
import CartTable from "@/components/orders/CartTable";
import EmptyCart from "@/components/orders/EmptyCart";
import CartSummary from "@/components/orders/CartSummary";
import CartActions from "@/components/orders/CartActions";
import PaymentSummary from "@/components/orders/PaymentSummary";
import { useToast } from "@/hooks/use-toast";
import { useAuthentication } from "@/hooks/authentication/useAuthentication";
import CartView from "@/components/orders/CartView";

const Cart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();
  const { isVerifiedPharmacist, isAdmin, authChecked, loading } = useAuthentication(false, true, true);
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  const handleGoToProducts = () => {
    navigate("/products");
  };
  
  const handleGoToCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Leerer Warenkorb",
        description: "Ihr Warenkorb ist leer. Bitte fügen Sie Produkte hinzu, bevor Sie fortfahren.",
        variant: "destructive",
      });
      return;
    }

    // Check if the user is an admin or a verified pharmacist
    if (!(isVerifiedPharmacist || isAdmin) && authChecked && !loading) {
      toast({
        title: "Verifizierung erforderlich",
        description: "Nur verifizierte Apotheker können eine Bestellung aufgeben.",
        variant: "destructive",
      });
      return;
    }

    // Navigate to the orders page for checkout
    navigate("/orders");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR"
    }).format(amount);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Button variant="outline" onClick={handleGoBack}>
              ← Zurück
            </Button>
          </div>
          
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Warenkorb</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Überprüfen Sie Ihre Produkte, bevor Sie fortfahren
            </p>
          </div>
          
          {items.length === 0 ? (
            <EmptyCart onGoToProducts={handleGoToProducts} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <CartTable
                  cartProducts={items}
                  onRemoveItem={removeItem}
                  onUpdateQuantity={updateQuantity}
                />
              </div>
              
              <div>
                <div className="sticky top-24 space-y-6">
                  <CartSummary 
                    totalAmount={getTotalPrice()} 
                    formatCurrency={formatCurrency} 
                  />
                  
                  <PaymentSummary />
                  
                  <CartActions
                    onContinueShopping={handleGoToProducts}
                    onProceedToCheckout={handleGoToCheckout}
                    onClearCart={() => {
                      clearCart();
                      toast({
                        title: "Warenkorb geleert",
                        description: "Alle Produkte wurden aus dem Warenkorb entfernt."
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
