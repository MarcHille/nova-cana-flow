
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types";
import { 
  convertProductFromDB, 
  convertProductToDB,
  convertProductUpdatesToDB 
} from "@/utils/supabaseUtils";

export const useProducts = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      console.log("Fetching products from Supabase...");
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
      
      console.log(`Fetched ${data?.length || 0} products`);
      const convertedData: Product[] = data?.map(convertProductFromDB) || [];
      
      setProducts(convertedData);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error fetching products",
        description: error.message || "Failed to load products",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData: Omit<Product, "id" | "createdAt" | "updatedAt">[]) => {
    try {
      // Handle both single product and array of products
      if (!Array.isArray(productData)) {
        productData = [productData];
      }
      
      if (productData.length > 0) {
        // Convert all products to database format
        const productsToInsert = productData.map(product => {
          // Ensure terpenes is always an array before conversion
          const productWithValidTerpenes = {
            ...product,
            terpenes: Array.isArray(product.terpenes) ? product.terpenes : 
                      (product.terpenes ? [product.terpenes] : [])
          };
          return convertProductToDB(productWithValidTerpenes);
        });
        
        // Validate all products have required fields
        for (const product of productsToInsert) {
          if (!product.name || !product.description || 
              !product.short_description || !product.image_url || 
              !product.category || product.price === undefined) {
            throw new Error("Missing required product fields");
          }
        }

        // Insert all products
        const { error } = await supabase
          .from('products')
          .insert(productsToInsert);

        if (error) throw error;
      }

      toast({
        title: "Product added",
        description: productData.length > 1 
          ? `${productData.length} products have been successfully added.`
          : "The product has been successfully added."
      });

      fetchProducts();
      return true;
    } catch (error: any) {
      console.error("Error adding product:", error);
      toast({
        title: "Error adding product",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>) => {
    try {
      const updatesToApply = convertProductUpdatesToDB(updates);
      
      const { error } = await supabase
        .from('products')
        .update(updatesToApply)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Product updated",
        description: "The product has been successfully updated."
      });

      fetchProducts();
      return true;
    } catch (error: any) {
      console.error("Error updating product:", error);
      toast({
        title: "Error updating product",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return false;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Product deleted",
        description: "The product has been successfully deleted."
      });

      fetchProducts();
      return true;
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error deleting product",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct
  };
};
