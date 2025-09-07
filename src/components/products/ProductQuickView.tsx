
import React, { useState } from "react";
import { Product } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, ShoppingCart, Info } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { formatPrice } from "@/utils/productUtils";

interface ProductQuickViewProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductQuickView: React.FC<ProductQuickViewProps> = ({
  product,
  open,
  onOpenChange,
}) => {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();
  const { toast } = useToast();

  if (!product) return null;

  // Define package sizes based on product category (these are examples)
  const getPackageSize = (category: string): number => {
    switch (category.toLowerCase()) {
      case "blüten":
      case "flower":
        return 5; // 5g minimum order for flowers
      case "öl":
      case "oil":
        return 1; // 1 bottle minimum
      default:
        return 1; // Default 1 unit
    }
  };

  const packageSize = getPackageSize(product.category);
  
  const increaseQuantity = () => {
    setQuantity(q => q + packageSize);
  };

  const decreaseQuantity = () => {
    if (quantity > packageSize) {
      setQuantity(q => q - packageSize);
    } else {
      setQuantity(packageSize);
    }
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    
    toast({
      title: "Zum Warenkorb hinzugefügt",
      description: `${quantity}× ${product.name}`,
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-4 py-4">
          <div className="aspect-square rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
            ) : (
              <div className="text-gray-400 h-full w-full flex items-center justify-center bg-gray-100">
                Kein Bild
              </div>
            )}
          </div>
          
          <div className="flex flex-col">
            <div className="mb-2 flex flex-wrap gap-2">
              <Badge variant="outline">{product.category}</Badge>
              {product.thcContent && (
                <Badge variant="secondary">THC: {product.thcContent}</Badge>
              )}
              {product.cbdContent && (
                <Badge variant="secondary">CBD: {product.cbdContent}</Badge>
              )}
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {product.shortDescription || product.description.substring(0, 100) + (product.description.length > 100 ? "..." : "")}
            </p>

            <div className="mt-auto space-y-4">
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-500">Preis:</p>
                <p className="text-lg font-bold">{formatPrice(product.price)}</p>
              </div>
              
              <div className="flex flex-col">
                <label htmlFor="quantity" className="text-sm font-medium text-gray-500 mb-1">
                  Menge (Mindestbestellmenge: {packageSize})
                </label>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decreaseQuantity}
                    className="h-9 w-9"
                    disabled={quantity <= packageSize}
                  >
                    <Minus className="h-4 w-4" />
                    <span className="sr-only">Decrease quantity</span>
                  </Button>
                  <span className="mx-4 w-10 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={increaseQuantity}
                    className="h-9 w-9"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Increase quantity</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <Link to={`/products/${product.id}`}>
              <Info className="h-4 w-4 mr-2" />
              Produktdetails
            </Link>
          </Button>
          <Button onClick={handleAddToCart} className="w-full sm:w-auto">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Zum Warenkorb hinzufügen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductQuickView;
