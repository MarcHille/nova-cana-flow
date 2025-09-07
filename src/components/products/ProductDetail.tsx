
import React, { useState } from "react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ShoppingCart, Plus, Minus, Info, Box, Leaf, ArrowDown, Flower } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProductDetailProps {
  product: Product;
}

const ProductDetail = ({ product }: ProductDetailProps) => {
  const { toast } = useToast();
  const { language, t } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTerpeneInfo, setShowTerpeneInfo] = useState(false);

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCart = () => {
    const successMessage = language === "de" 
      ? `${quantity} × ${product.name} zum Warenkorb hinzugefügt`
      : `${quantity} × ${product.name} added to your cart`;
      
    toast({
      title: language === "de" ? "Zum Warenkorb hinzugefügt" : "Added to cart",
      description: successMessage,
    });
  };

  // Format price to EUR
  const formattedPrice = new Intl.NumberFormat(language === "de" ? "de-DE" : "en-US", {
    style: "currency",
    currency: "EUR",
  }).format(product.price);

  // Total price based on quantity
  const totalPrice = new Intl.NumberFormat(language === "de" ? "de-DE" : "en-US", {
    style: "currency",
    currency: "EUR",
  }).format(product.price * quantity);

  // Terpene information mapping
  const terpeneInfo = {
    "Myrcene": {
      de: {
        description: "Myrcen ist das häufigste Terpen in Cannabis und zeichnet sich durch seinen erdigen, moschusartigen Geruch aus. Es hat entspannende und beruhigende Effekte.",
        effects: "Entspannend, Schmerzhemmend, Entzündungshemmend",
        aroma: "Erdig, Moschusartig, Kräuterartig"
      },
      en: {
        description: "Myrcene is the most abundant terpene in cannabis and is characterized by its earthy, musky aroma. It provides relaxing and sedative effects.",
        effects: "Relaxing, Analgesic, Anti-inflammatory",
        aroma: "Earthy, Musky, Herbal"
      }
    },
    "Limonene": {
      de: {
        description: "Limonen ist bekannt für seinen charakteristischen Zitrusduft und ist in Zitrusfrüchten und vielen Cannabis-Sorten zu finden. Es hat stimmungsaufhellende Eigenschaften.",
        effects: "Stimmungsaufhellend, Stressreduzierend, Antibakteriell",
        aroma: "Zitrusartig, Frisch, Fruchtig"
      },
      en: {
        description: "Limonene is known for its characteristic citrus scent and is found in citrus fruits and many cannabis strains. It has mood-elevating properties.",
        effects: "Mood-enhancing, Stress-reducing, Antibacterial",
        aroma: "Citrusy, Fresh, Fruity"
      }
    },
    "Pinene": {
      de: {
        description: "Pinen ist ein Terpen mit einem frischen, kiefernartigen Geruch und kommt in Nadelbäumen und vielen Heilkräutern vor. Es kann die Aufmerksamkeit und Konzentration fördern.",
        effects: "Konzentrationsfördernd, Entzündungshemmend, Bronchodilatator",
        aroma: "Kiefernartig, Waldig, Frisch"
      },
      en: {
        description: "Pinene is a terpene with a fresh, pine-like smell found in pine trees and many healing herbs. It can enhance alertness and concentration.",
        effects: "Focus-enhancing, Anti-inflammatory, Bronchodilator",
        aroma: "Pine-like, Woody, Fresh"
      }
    },
    "Linalool": {
      de: {
        description: "Linalool ist für seinen blumigen, lavendelartigen Duft bekannt und findet sich in Lavendel und bestimmten Cannabis-Sorten. Es hat beruhigende und angstlösende Eigenschaften.",
        effects: "Beruhigend, Angstlösend, Schlaffördernd",
        aroma: "Blumig, Lavendelartig, Süßlich"
      },
      en: {
        description: "Linalool is known for its floral, lavender-like scent and is found in lavender and certain cannabis strains. It has calming and anxiolytic properties.",
        effects: "Calming, Anxiolytic, Sleep-promoting",
        aroma: "Floral, Lavender-like, Sweet"
      }
    },
    "Caryophyllene": {
      de: {
        description: "Caryophyllen hat einen würzigen, pfeffrigen Geruch und ist in schwarzem Pfeffer und Nelken vorhanden. Als einziges Terpen bindet es direkt an CB2-Rezeptoren und hat entzündungshemmende Eigenschaften.",
        effects: "Entzündungshemmend, Angstlösend, Schmerzlindernd",
        aroma: "Würzig, Pfeffrig, Holzig"
      },
      en: {
        description: "Caryophyllene has a spicy, peppery smell and is present in black pepper and cloves. It's the only terpene that binds directly to CB2 receptors and has anti-inflammatory properties.",
        effects: "Anti-inflammatory, Anxiolytic, Pain-relieving",
        aroma: "Spicy, Peppery, Woody"
      }
    },
    "Terpinolene": {
      de: {
        description: "Terpinolen hat ein komplexes Aroma mit holzigen, krautigen und zitrusartigen Noten. Es kommt in geringen Mengen in vielen Cannabis-Sorten vor und hat antioxidative Eigenschaften.",
        effects: "Antioxidativ, Leicht Beruhigend, Antibakteriell",
        aroma: "Holzig, Krautig, Zitrusartig"
      },
      en: {
        description: "Terpinolene has a complex aroma with woody, herbal, and citrusy notes. It occurs in small amounts in many cannabis strains and has antioxidant properties.",
        effects: "Antioxidant, Mildly Sedative, Antibacterial",
        aroma: "Woody, Herbal, Citrusy"
      }
    }
  };

  return (
    <div className="container-content py-8">
      <div className="mb-6">
        <Link to="/products" className="flex items-center text-gray-600 dark:text-gray-300 hover:text-nova-600 dark:hover:text-nova-400 text-sm">
          <ArrowLeft size={16} className="mr-1" />
          <span>{language === "de" ? "Zurück zu Produkten" : "Back to Products"}</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {product.name}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              {product.shortDescription}
            </p>
            <div className="flex flex-wrap gap-3 mb-4">
              {product.thcContent && (
                <span className="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-900/30 px-3 py-1 text-sm font-medium text-amber-800 dark:text-amber-300">
                  THC: {product.thcContent}
                </span>
              )}
              {product.cbdContent && (
                <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-sm font-medium text-green-800 dark:text-green-300">
                  CBD: {product.cbdContent}
                </span>
              )}
              
              {/* Terpene Badges */}
              {product.terpenes && product.terpenes.map((terpene, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center rounded-full bg-purple-100 dark:bg-purple-900/30 px-3 py-1 text-sm font-medium text-purple-800 dark:text-purple-300 cursor-pointer"
                  onClick={() => setShowTerpeneInfo(true)}
                >
                  <Flower className="h-3.5 w-3.5 mr-1" />
                  {terpene}
                </span>
              ))}
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {formattedPrice}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {language === "de" ? "zzgl. MwSt." : "excl. VAT"}
              </span>
            </div>
          </div>

          <Separator />

          {/* Quantity Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {language === "de" ? "Menge" : "Quantity"}
            </label>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="icon"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="h-10 w-10"
              >
                <Minus size={16} />
                <span className="sr-only">{language === "de" ? "Menge verringern" : "Decrease quantity"}</span>
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={increaseQuantity}
                disabled={quantity >= product.stock}
                className="h-10 w-10"
              >
                <Plus size={16} />
                <span className="sr-only">{language === "de" ? "Menge erhöhen" : "Increase quantity"}</span>
              </Button>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                ({product.stock} {language === "de" ? "verfügbar" : "available"})
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {language === "de" ? "Gesamt:" : "Total:"} <span className="font-semibold">{totalPrice}</span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button 
            size="lg" 
            className="w-full" 
            onClick={addToCart}
          >
            <ShoppingCart size={18} className="mr-2" />
            {language === "de" ? "In den Warenkorb" : "Add to Cart"}
          </Button>

          {/* Terpene Information Section */}
          {product.terpenes && product.terpenes.length > 0 && (
            <div className="mt-6">
              <div 
                className="flex justify-between items-center cursor-pointer" 
                onClick={() => setShowTerpeneInfo(!showTerpeneInfo)}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Flower className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                  {language === "de" ? "Terpenprofil" : "Terpene Profile"}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 dark:text-gray-300"
                >
                  <ArrowDown 
                    size={16} 
                    className={`transition-transform ${showTerpeneInfo ? "rotate-180" : ""}`} 
                  />
                </Button>
              </div>
              
              {showTerpeneInfo && (
                <div className="mt-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 space-y-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {language === "de" 
                      ? "Terpene sind aromatische Verbindungen, die Cannabis seinen charakteristischen Duft und Geschmack verleihen. Sie spielen eine wichtige Rolle im therapeutischen Potenzial von Cannabis, bekannt als der \"Entourage-Effekt\"."
                      : "Terpenes are aromatic compounds that give cannabis its characteristic scent and flavor. They play an important role in the therapeutic potential of cannabis, known as the \"entourage effect\"."}
                  </p>
                  
                  <div className="space-y-4">
                    {product.terpenes.map((terpene, index) => {
                      const terp = terpeneInfo[terpene as keyof typeof terpeneInfo];
                      if (!terp) return null;
                      
                      const info = language === "de" ? terp.de : terp.en;
                      
                      return (
                        <div key={index} className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                          <h4 className="font-medium text-purple-700 dark:text-purple-400 mb-2 flex items-center">
                            <Flower className="h-4 w-4 mr-1" />
                            {terpene}
                          </h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{info.description}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="font-medium text-gray-700 dark:text-gray-200">
                                {language === "de" ? "Effekte: " : "Effects: "}
                              </span>
                              <span className="text-gray-600 dark:text-gray-400">{info.effects}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700 dark:text-gray-200">
                                {language === "de" ? "Aroma: " : "Aroma: "}
                              </span>
                              <span className="text-gray-600 dark:text-gray-400">{info.aroma}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-2">
                    {language === "de" 
                      ? "Bei Novacana legen wir großen Wert auf das Terpenprofil unserer Produkte, da es maßgeblich zur therapeutischen Wirkung beiträgt."
                      : "At Novacana, we place great importance on the terpene profile of our products as it significantly contributes to the therapeutic effect."}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Product Details */}
          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {language === "de" ? "Produktdetails" : "Product Details"}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-nova-600 dark:hover:text-nova-400"
              >
                {isExpanded 
                  ? (language === "de" ? "Weniger anzeigen" : "Show Less") 
                  : (language === "de" ? "Mehr anzeigen" : "Show More")}
                <ArrowDown size={16} className={`ml-1 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
              </Button>
            </div>
            
            <Card className="bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800">
              <CardContent className="p-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center">
                      <Info size={16} className="mr-2" />
                      {language === "de" ? "Kategorie" : "Category"}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                    </span>
                  </li>
                  {product.weight && (
                    <li className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center">
                        <Box size={16} className="mr-2" />
                        {language === "de" ? "Gewicht/Volumen" : "Weight/Volume"}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {product.weight}
                      </span>
                    </li>
                  )}
                  {product.manufacturer && (
                    <li className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center">
                        <Leaf size={16} className="mr-2" />
                        {language === "de" ? "Hersteller" : "Manufacturer"}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {product.manufacturer}
                      </span>
                    </li>
                  )}
                  {isExpanded && (
                    <>
                      {product.countryOfOrigin && (
                        <li className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            {language === "de" ? "Herkunftsland" : "Country of Origin"}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {product.countryOfOrigin}
                          </span>
                        </li>
                      )}
                      {product.recommendedDosage && (
                        <li className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            {language === "de" ? "Empfohlene Dosierung" : "Recommended Dosage"}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {product.recommendedDosage}
                          </span>
                        </li>
                      )}
                    </>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Product Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {language === "de" ? "Beschreibung" : "Description"}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
