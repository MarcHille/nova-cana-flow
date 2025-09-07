
import React from "react";
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ProductFormValues } from "./ProductFormTypes";

interface ProductFormDetailsProps {
  form: UseFormReturn<ProductFormValues>;
}

const ProductFormDetails = ({ form }: ProductFormDetailsProps) => {
  return (
    <div className="space-y-6">
      {/* PZN field added first - important for pharmacies */}
      <FormField
        control={form.control}
        name="pzn"
        render={({ field }) => (
          <FormItem>
            <FormLabel>PZN (Pharmazentralnummer)</FormLabel>
            <FormControl>
              <Input placeholder="z.B. 12345678" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="thcContent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>THC Content</FormLabel>
              <FormControl>
                <Input placeholder="z.B. 18%" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="cbdContent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CBD Content</FormLabel>
              <FormControl>
                <Input placeholder="z.B. 0.2%" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="terpenes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Terpenes</FormLabel>
            <FormControl>
              <Input placeholder="Kommagetrennt, z.B.: Myrcene, Pinene" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weight</FormLabel>
              <FormControl>
                <Input placeholder="z.B. 10g" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="recommendedDosage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recommended Dosage</FormLabel>
              <FormControl>
                <Input placeholder="z.B. 0.1g - 0.3g" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="manufacturer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Manufacturer</FormLabel>
              <FormControl>
                <Input placeholder="Hersteller eingeben" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="countryOfOrigin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country of Origin</FormLabel>
              <FormControl>
                <Input placeholder="z.B. Germany" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {/* Image URL moved to the bottom as optional field */}
      <FormField
        control={form.control}
        name="imageUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Image URL (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="https://example.com/image.jpg" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ProductFormDetails;
