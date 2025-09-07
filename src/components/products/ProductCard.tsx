
import React from "react";
import { Link } from "react-router-dom";
import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart, Info, Flower, Star, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    id,
    name,
    shortDescription,
    price,
    imageUrl,
    category,
    thcContent,
    cbdContent,
    terpenes,
  } = product;

  // Format price to EUR
  const formattedPrice = new Intl.NumberFormat(language === "de" ? "de-DE" : "en-US", {
    style: "currency",
    currency: "EUR",
  }).format(price);

  // Custom properties that might not exist in all products
  const isNew = false; // Default to false since it's not in the Product type
  const rating = null; // Default to null since it's not in the Product type
  
  // Funktion zum Hinzufügen zum Warenkorb
  const handleAddToCart = () => {
    try {
      // Bestehenden Warenkorb laden
      const existingCart = localStorage.getItem("cart");
      const cartItems = existingCart ? JSON.parse(existingCart) : [];
      
      // Prüfen, ob Produkt bereits im Warenkorb ist
      const existingItemIndex = cartItems.findIndex((item: any) => item.productId === id);
      
      if (existingItemIndex >= 0) {
        // Wenn Produkt bereits vorhanden, erhöhe Menge
        cartItems[existingItemIndex].quantity += 1;
      } else {
        // Neues Produkt zum Warenkorb hinzufügen
        cartItems.push({
          productId: id,
          quantity: 1
        });
      }
      
      // Warenkorb speichern
      localStorage.setItem("cart", JSON.stringify(cartItems));
      
      // Erfolgsmeldung anzeigen
      toast({
        title: language === "de" ? "Zum Warenkorb hinzugefügt" : "Added to cart",
        description: language === "de" 
          ? `${name} wurde zum Warenkorb hinzugefügt.` 
          : `${name} has been added to your cart.`,
      });
    } catch (error) {
      console.error("Fehler beim Hinzufügen zum Warenkorb:", error);
      toast({
        title: language === "de" ? "Fehler" : "Error",
        description: language === "de" 
          ? "Produkt konnte nicht zum Warenkorb hinzugefügt werden." 
          : "Failed to add product to cart.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl group">
      <div className="relative">
        <div className="aspect-square w-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
            <div className="p-6 w-full">
              <Link to={`/products/${id}`} className="w-full">
                <Button variant="secondary" size="lg" rounded="full" className="w-full">
                  <Info size={18} className="mr-2" />
                  <span>{language === "de" ? "Details anzeigen" : "View details"}</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <Badge variant="secondary" className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-sm rounded-full px-4 py-1.5 shadow-sm">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Badge>
          {isNew && (
            <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm rounded-full px-4 py-1.5 shadow-sm">
              {language === "de" ? "Neu" : "New"}
              <Sparkles className="h-3.5 w-3.5 ml-1" />
            </Badge>
          )}
        </div>
        {rating && (
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-medium shadow-sm">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span>{rating}</span>
            </div>
          </div>
        )}
      </div>
      
      <CardContent className="p-6">
        <div className="space-y-3">
          <h3 className="font-semibold text-xl text-gray-900 dark:text-white">
            {name}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 line-clamp-2 h-12 leading-6">
            {shortDescription}
          </p>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {thcContent && (
              <span className="inline-flex items-center rounded-full bg-purple-100 dark:bg-purple-900/30 px-3 py-1 text-sm font-medium text-purple-800 dark:text-purple-300">
                THC: {thcContent}
              </span>
            )}
            {cbdContent && (
              <span className="inline-flex items-center rounded-full bg-teal-100 dark:bg-teal-900/30 px-3 py-1 text-sm font-medium text-teal-800 dark:text-teal-300">
                CBD: {cbdContent}
              </span>
            )}
            {terpenes && terpenes[0] && (
              <span className="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-900/30 px-3 py-1 text-sm font-medium text-amber-800 dark:text-amber-300">
                <Flower className="h-4 w-4 mr-1" />
                {terpenes[0]}
              </span>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-6 pb-6 pt-0 flex flex-col gap-4">
        <div className="w-full flex justify-between items-center">
          <span className="font-bold text-2xl text-gray-900 dark:text-white bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {formattedPrice}
          </span>
        </div>
        
        <Button 
          variant="gradient" 
          rounded="full" 
          className="w-full gap-2 py-6"
          onClick={handleAddToCart}
        >
          <ShoppingCart size={18} />
          <span className="font-medium">{language === "de" ? "In den Warenkorb" : "Add to Cart"}</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
