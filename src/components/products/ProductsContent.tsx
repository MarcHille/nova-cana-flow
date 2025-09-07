
import React from "react";
import { Product } from "@/types";
import ProductGrid from "./ProductGrid";
import ProductTableView from "./ProductTableView";
import ProductError from "./ProductError";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { translateCategory, formatPrice } from "@/utils/productUtils";

interface ProductsContentProps {
  isLoading: boolean;
  error: string | null;
  filteredProducts: Product[];
  viewMode: "grid" | "table";
  handleRetry: () => void;
  handleProductSelect: (product: Product) => void;
}

const ProductsContent: React.FC<ProductsContentProps> = ({
  isLoading,
  error,
  filteredProducts,
  viewMode,
  handleRetry,
  handleProductSelect
}) => {
  if (isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <ProductError 
        error={error}
        onRetry={handleRetry}
        title="Fehler beim Laden der Produkte"
        retryLabel="Erneut laden"
      />
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8 text-center my-8">
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Keine Produkte gefunden</h3>
        <p className="text-gray-600 dark:text-gray-300">
          Es wurden keine Produkte gefunden, die Ihren Filterkriterien entsprechen.
        </p>
      </div>
    );
  }

  return viewMode === "grid" ? (
    <ProductGrid products={filteredProducts} />
  ) : (
    <ProductTableView 
      products={filteredProducts} 
      isLoading={isLoading}
      translateCategory={(cat) => translateCategory(cat, "de")}
      formatPrice={formatPrice}
      loadingText="Produkte werden geladen..."
      noResultsText="Keine Produkte gefunden"
      categoryLabel="Kategorie"
      priceLabel="Preis"
      onProductSelect={handleProductSelect}
    />
  );
};

export default ProductsContent;
