
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface ProductDetailDialogProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailDialog: React.FC<ProductDetailDialogProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!product) return null;

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    if (product.stock && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const addToCart = () => {
    try {
      // Get current cart from localStorage
      const existingCartJSON = localStorage.getItem("cart");
      let existingCart = existingCartJSON ? JSON.parse(existingCartJSON) : [];

      // Check if product is already in cart
      const existingItemIndex = existingCart.findIndex(
        (item: any) => item.productId === product.id
      );

      if (existingItemIndex >= 0) {
        // Update quantity if product already in cart
        existingCart[existingItemIndex].quantity += quantity;
      } else {
        // Add new item if not already in cart
        existingCart.push({
          productId: product.id,
          quantity: quantity,
        });
      }

      // Save updated cart to localStorage
      localStorage.setItem("cart", JSON.stringify(existingCart));

      toast({
        title: "In den Warenkorb gelegt",
        description: `${quantity}× ${product.name} wurde zum Warenkorb hinzugefügt.`,
      });

      onClose();
      setQuantity(1);
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast({
        title: "Fehler",
        description: "Produkt konnte nicht zum Warenkorb hinzugefügt werden.",
        variant: "destructive",
      });
    }
  };

  const viewCart = () => {
    onClose();
    navigate('/orders/cart');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
            <img
              src={product.imageUrl || "/placeholder.svg"}
              alt={product.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />
          </div>

          <div className="space-y-4">
            <div>
              <Badge variant="outline" className="mb-2">
                {product.category}
              </Badge>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(product.price)}
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {product.shortDescription}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">PZN:</span>
                <span>{product.pzn || "N/A"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">THC:</span>
                <span>{product.thcContent || "N/A"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">CBD:</span>
                <span>{product.cbdContent || "N/A"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Hersteller:</span>
                <span>{product.manufacturer || "N/A"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Lagerbestand:</span>
                <span>
                  {product.stock > 0 
                    ? `Auf Lager (${product.stock})` 
                    : "Nicht auf Lager"}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <span className="mr-3">Menge:</span>
                <div className="flex items-center border rounded-md">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleDecreaseQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                    <span className="sr-only">Verringern</span>
                  </Button>
                  <span className="w-10 text-center">{quantity}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleIncreaseQuantity}
                    disabled={product.stock !== undefined && quantity >= product.stock}
                  >
                    <Plus className="h-3 w-3" />
                    <span className="sr-only">Erhöhen</span>
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  className="flex-1" 
                  onClick={addToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  In den Warenkorb
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={viewCart}
                >
                  Zum Warenkorb
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-medium mb-2">Produktbeschreibung</h4>
          <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-line">
            {product.description}
          </p>

          {product.recommendedDosage && (
            <div className="mt-4">
              <h4 className="font-medium mb-1">Empfohlene Dosierung</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {product.recommendedDosage}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailDialog;
