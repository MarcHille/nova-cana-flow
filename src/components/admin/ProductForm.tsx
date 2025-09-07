
import React from "react";
import { 
  Form,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product } from "@/types";
import { productSchema, ProductFormValues } from "./ProductFormTypes";
import ProductFormBasicInfo from "./ProductFormBasicInfo";
import ProductFormDetails from "./ProductFormDetails";

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: any) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit }) => {
  // If product is provided, format the terpenes array to string for the form
  const defaultValues: Partial<ProductFormValues> = product
    ? {
        ...product,
        terpenes: product.terpenes ? product.terpenes.join(", ") : "",
        imageUrl: product.imageUrl || "/placeholder.svg", // Default placeholder
      }
    : {
        name: "",
        description: "",
        shortDescription: "",
        price: 0,
        imageUrl: "/placeholder.svg", // Default placeholder
        category: "",
        stock: 0,
        thcContent: "",
        cbdContent: "",
        terpenes: "",
        weight: "",
        recommendedDosage: "",
        manufacturer: "",
        countryOfOrigin: "",
        pzn: "",
      };

  // Setup form with validation
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  // Handle form submission
  const handleSubmit = (values: ProductFormValues) => {
    // Format terpenes back to array if provided
    const formattedValues = {
      ...values,
      // Use placeholder image if no image URL is provided
      imageUrl: values.imageUrl || "/placeholder.svg",
      terpenes: values.terpenes 
        ? values.terpenes.split(",").map(t => t.trim()).filter(t => t) 
        : [],
    };
    
    // If editing, include the ID
    if (product) {
      onSubmit({ id: product.id, ...formattedValues });
    } else {
      onSubmit([formattedValues]);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProductFormBasicInfo form={form} />
          <ProductFormDetails form={form} />
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            type="button"
            variant="outline"
            onClick={() => form.reset()}
          >
            Reset
          </Button>
          <Button type="submit">
            {product ? "Update Product" : "Add Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
