
import * as z from "zod";

// Define form schema with Zod
export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  shortDescription: z.string().min(5, "Short description must be at least 5 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  imageUrl: z.string().optional().or(z.literal("")), // Made optional
  category: z.string().min(1, "Please select a category"),
  stock: z.coerce.number().int().nonnegative("Stock must be a non-negative integer"),
  thcContent: z.string().optional(),
  cbdContent: z.string().optional(),
  terpenes: z.string().optional(),
  weight: z.string().optional(),
  recommendedDosage: z.string().optional(),
  manufacturer: z.string().optional(),
  countryOfOrigin: z.string().optional(),
  pzn: z.string().optional(), // Added PZN field
});

export type ProductFormValues = z.infer<typeof productSchema>;
