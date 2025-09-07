
import React from "react";
import { Product } from "@/types";
import { Table } from "@/components/ui/table";
import { useProductSort } from "./table/useProductSort";
import ProductTableHeader from "./table/ProductTableHeader";
import ProductTableBody from "./table/ProductTableBody";

export interface ProductTableViewProps {
  products: Product[];
  isLoading?: boolean;
  translateCategory?: (category: string) => string;
  formatPrice?: (price: number) => string;
  loadingText?: string;
  noResultsText?: string;
  categoryLabel?: string;
  priceLabel?: string;
  onProductSelect?: (product: Product) => void;
}

const ProductTableView: React.FC<ProductTableViewProps> = ({ 
  products, 
  isLoading = false, 
  translateCategory = (cat) => cat,
  formatPrice = (price) => `€${price.toFixed(2)}`,
  loadingText = "Produkte werden geladen...",
  noResultsText = "Keine Produkte gefunden",
  categoryLabel = "Kategorie",
  priceLabel = "Preis",
  onProductSelect = () => {}
}: ProductTableViewProps) => {
  const { sort, handleSort, getSortedProducts } = useProductSort(products, translateCategory);
  const sortedProducts = getSortedProducts();

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <ProductTableHeader 
          sortField={sort.field}
          sortDirection={sort.direction}
          onSort={handleSort}
          categoryLabel={categoryLabel}
          priceLabel={priceLabel}
        />
        <ProductTableBody 
          products={sortedProducts}
          isLoading={isLoading}
          translateCategory={translateCategory}
          formatPrice={formatPrice}
          loadingText={loadingText}
          noResultsText={noResultsText}
          onProductSelect={onProductSelect}
        />
      </Table>
    </div>
  );
};

export default ProductTableView;
