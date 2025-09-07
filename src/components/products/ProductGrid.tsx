
import React from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

const ProductGrid = ({ products, isLoading = false }: ProductGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg overflow-hidden"
          >
            <div className="aspect-square w-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full mt-4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          No products found
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
