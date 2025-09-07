
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const ProductCard = ({ product, onEdit, onDelete }: ProductCardProps) => {
  return (
    <Card key={product.id} className="overflow-hidden">
      <div className="aspect-video relative overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="object-cover w-full h-full"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1 truncate">{product.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 truncate">
          {product.category} | €{product.price.toFixed(2)}
        </p>
        <p className="text-sm mb-4 line-clamp-2">{product.shortDescription}</p>
        <div className="flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(product)}
          >
            <Edit size={16} className="mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(product.id)}
          >
            <Trash size={16} className="mr-2" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
