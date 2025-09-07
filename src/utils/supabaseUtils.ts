import { Product, Order, OrderItem, Address } from "@/types";
import { Json } from "@/integrations/supabase/types";
import { toSnakeCase, toCamelCase } from "@/types/supabase";
import { Database } from "@/integrations/supabase/types";

/**
 * Converts a product from Supabase database format to application format
 */
export const convertProductFromDB = (item: any): Product => ({
  id: item.id,
  name: item.name,
  description: item.description,
  shortDescription: item.short_description,
  price: item.price,
  imageUrl: item.image_url,
  category: item.category,
  stock: item.stock,
  thcContent: item.thc_content,
  cbdContent: item.cbd_content,
  terpenes: item.terpenes,
  weight: item.weight,
  dosage: item.dosage,
  effects: item.effects,
  // Map origin to both manufacturer and countryOfOrigin for compatibility
  manufacturer: item.origin,
  countryOfOrigin: item.origin,
  recommendedDosage: item.dosage,
  pzn: item.pzn, // Added PZN field mapping
  createdAt: new Date(item.created_at),
  updatedAt: new Date(item.updated_at)
});

/**
 * Converts a product to Supabase database format for insertion
 */
export const convertProductToDB = (
  product: Omit<Product, "id" | "createdAt" | "updatedAt">
): Database['public']['Tables']['products']['Insert'] => {
  // Create the database-ready object with the correct type
  return {
    name: product.name,
    description: product.description,
    short_description: product.shortDescription,
    image_url: product.imageUrl || "/placeholder.svg", // Use placeholder if no image
    category: product.category,
    price: product.price,
    stock: product.stock || 0,
    thc_content: product.thcContent,
    cbd_content: product.cbdContent,
    terpenes: product.terpenes,
    weight: product.weight,
    dosage: product.dosage || product.recommendedDosage,
    effects: product.effects,
    // Store manufacturer as origin since there's no manufacturer field in DB
    origin: product.manufacturer || product.countryOfOrigin,
    pzn: product.pzn, // Added PZN field
  };
};

/**
 * Safely parse JSON from string or return the object if already parsed
 */
export const safeParseJson = <T>(jsonData: string | any): T => {
  if (typeof jsonData === 'string') {
    try {
      return JSON.parse(jsonData) as T;
    } catch (e) {
      console.error('Error parsing JSON:', e);
      return {} as T;
    }
  }
  return jsonData as T;
};

/**
 * Converts an order from Supabase database format to application format
 */
export const convertOrderFromDB = (item: any): Order => {
  const products = safeParseJson<OrderItem[]>(item.products);
  const shippingAddress = safeParseJson<Address>(item.shipping_address);
  const billingAddress = safeParseJson<Address>(item.billing_address);
  
  return {
    id: item.id,
    userId: item.user_id,
    products,
    totalAmount: item.total_amount,
    status: item.status as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
    trackingNumber: item.tracking_number,
    shippingAddress,
    billingAddress,
    paymentMethod: item.payment_method,
    notes: item.notes,
    createdAt: new Date(item.created_at),
    updatedAt: new Date(item.updated_at)
  };
};

/**
 * Prepares order updates for Supabase by converting camelCase to snake_case
 */
export const prepareOrderUpdates = (updates: Partial<Order>): Record<string, any> => {
  return toSnakeCase(updates);
};

/**
 * Converts a partial product update to database format
 */
export const convertProductUpdatesToDB = (updates: Partial<Product>): Record<string, any> => {
  const result: Record<string, any> = {};
  
  if (updates.name !== undefined) result.name = updates.name;
  if (updates.description !== undefined) result.description = updates.description;
  if (updates.shortDescription !== undefined) result.short_description = updates.shortDescription;
  if (updates.price !== undefined) result.price = updates.price;
  if (updates.imageUrl !== undefined) result.image_url = updates.imageUrl;
  if (updates.category !== undefined) result.category = updates.category;
  if (updates.stock !== undefined) result.stock = updates.stock;
  if (updates.thcContent !== undefined) result.thc_content = updates.thcContent;
  if (updates.cbdContent !== undefined) result.cbd_content = updates.cbdContent;
  if (updates.terpenes !== undefined) result.terpenes = updates.terpenes;
  if (updates.weight !== undefined) result.weight = updates.weight;
  if (updates.dosage !== undefined) result.dosage = updates.dosage;
  if (updates.recommendedDosage !== undefined) result.dosage = updates.recommendedDosage;
  if (updates.effects !== undefined) result.effects = updates.effects;
  // Map manufacturer and countryOfOrigin to origin field in DB
  if (updates.manufacturer !== undefined) result.origin = updates.manufacturer;
  if (updates.countryOfOrigin !== undefined && !result.origin) result.origin = updates.countryOfOrigin;
  if (updates.pzn !== undefined) result.pzn = updates.pzn;
  
  return result;
};
