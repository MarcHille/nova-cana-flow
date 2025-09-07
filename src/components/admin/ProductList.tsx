
import React from "react";
import { Product } from "@/types";
import ProductCard from "./ProductCard";

interface ProductListProps {
  products: Product[];
  searchTerm: string;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const ProductList = ({ products, searchTerm, onEdit, onDelete }: ProductListProps) => {
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          No products found
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          {searchTerm ? "Try adjusting your search term." : "Add a new product to get started."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProducts.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
};

export default ProductList;
