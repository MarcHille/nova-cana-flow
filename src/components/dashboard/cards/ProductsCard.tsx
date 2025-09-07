
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "@/hooks/useAuthentication";
import { useToast } from "@/hooks/use-toast";

const ProductsCard = () => {
  const navigate = useNavigate();
  const { isAdmin, isPharmacist } = useAuthentication();
  const { toast } = useToast();
  
  // Check if the user has access to products - allow all pharmacists for now
  const hasProductAccess = isAdmin || isPharmacist;

  const handleProductsNavigation = () => {
    if (hasProductAccess) {
      navigate('/products');
    } else {
      // Show message if access is denied
      toast({
        title: "Zugriff verweigert",
        description: "Sie benötigen Apothekerrechte, um auf Produkte zuzugreifen.",
        variant: "destructive"
      });
    }
  };

  const handleCartNavigation = () => {
    if (hasProductAccess) {
      navigate('/orders/cart');
    } else {
      // Show message if access is denied
      toast({
        title: "Zugriff verweigert",
        description: "Sie benötigen Apothekerrechte, um auf den Warenkorb zuzugreifen.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Produkte</CardTitle>
          <Package className="text-green-600 dark:text-green-400" size={24} />
        </div>
        <CardDescription>Durchsuchen Sie alle verfügbaren Produkte</CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        <Button 
          onClick={handleProductsNavigation} 
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          Zu den Produkten
        </Button>
        <Button 
          onClick={handleCartNavigation} 
          variant="outline" 
          className="w-full border-emerald-600 text-emerald-700 hover:bg-emerald-50"
        >
          <ShoppingCart size={18} className="mr-2" />
          Zum Warenkorb
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductsCard;
