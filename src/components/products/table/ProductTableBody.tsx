
import React from "react";
import { TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Product } from "@/types";

interface ProductTableBodyProps {
  products: Product[];
  isLoading: boolean;
  translateCategory: (category: string) => string;
  formatPrice: (price: number) => string;
  loadingText: string;
  noResultsText: string;
  onProductSelect: (product: Product) => void;
}

const ProductTableBody: React.FC<ProductTableBodyProps> = ({
  products,
  isLoading,
  translateCategory,
  formatPrice,
  loadingText,
  noResultsText,
  onProductSelect
}) => {
  if (isLoading) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={5} className="text-center py-10">
            {loadingText}
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  if (products.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={5} className="text-center py-10">
            {noResultsText}
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {products.map((product) => (
        <TableRow 
          key={product.id} 
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={() => onProductSelect(product)}
        >
          <TableCell className="font-medium">
            {product.name.substring(0, 100)}
          </TableCell>
          <TableCell>
            {translateCategory(product.category)}
          </TableCell>
          <TableCell>{(product.thcContent || "N/A").substring(0, 20)}</TableCell>
          <TableCell>{(product.cbdContent || "N/A").substring(0, 20)}</TableCell>
          <TableCell className="text-right">
            {formatPrice(product.price)}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default ProductTableBody;
