
import { Database as OriginalDatabase } from '@/integrations/supabase/types';
import { Product, Order, Address, OrderItem } from '@/types';
import { Json } from '@/integrations/supabase/types';

// Extended Database Definition
export interface Database extends Omit<OriginalDatabase, 'public'> {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          short_description: string;
          price: number;
          image_url: string;
          category: string;
          stock: number;
          thc_content?: string;
          cbd_content?: string;
          terpenes?: string[];
          weight?: string;
          dosage?: string;
          effects?: string[];
          origin?: string;
          pzn?: string; // Added PZN field
          created_at: string;
          updated_at: string;
        };
        Insert: {
          category: string;
          cbd_content?: string | null;
          description: string;
          dosage?: string | null;
          effects?: string[] | null;
          id?: string;
          image_url: string;
          name: string;
          origin?: string | null;
          price: number;
          pzn?: string | null; // Added PZN field
          short_description: string;
          stock?: number;
          terpenes?: string[] | null;
          thc_content?: string | null;
          weight?: string | null;
        };
        Update: Partial<{
          category: string;
          cbd_content?: string | null;
          description: string;
          dosage?: string | null;
          effects?: string[] | null;
          image_url: string;
          name: string;
          origin?: string | null;
          price: number;
          pzn?: string | null; // Added PZN field
          short_description: string;
          stock: number;
          terpenes?: string[] | null;
          thc_content?: string | null;
          weight?: string | null;
        }>;
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          products: Json;
          total_amount: number;
          status: string;
          tracking_number?: string | null;
          shipping_address: Json;
          billing_address: Json;
          payment_method: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          products: Json;
          total_amount: number;
          status?: string;
          tracking_number?: string | null;
          shipping_address: Json;
          billing_address: Json;
          payment_method: string;
          notes?: string | null;
        };
        Update: Partial<{
          user_id: string;
          products: Json;
          total_amount: number;
          status: string;
          tracking_number?: string | null;
          shipping_address: Json;
          billing_address: Json;
          payment_method: string;
          notes?: string | null;
        }>;
        Relationships: [];
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<{
          user_id: string;
          role: string;
          created_at: string;
          updated_at: string;
        }>;
        Relationships: [];
      };
      pharmacy_verification: {
        Row: {
          id: string;
          user_id: string;
          license_id: string;
          business_documents: string[];
          contact_details: Json;
          verification_status: string;
          submitted_at: string;
          reviewed_at: string | null;
          reviewer_id: string | null;
          rejection_reason: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          license_id: string;
          business_documents: string[];
          contact_details: Json;
          verification_status?: string;
          submitted_at?: string;
          reviewed_at?: string | null;
          reviewer_id?: string | null;
          rejection_reason?: string | null;
        };
        Update: Partial<{
          user_id: string;
          license_id: string;
          business_documents: string[];
          contact_details: Json;
          verification_status: string;
          submitted_at: string;
          reviewed_at: string | null;
          reviewer_id: string | null;
          rejection_reason: string | null;
        }>;
        Relationships: [];
      };
    };
    Views: OriginalDatabase['public']['Views'];
    Functions: OriginalDatabase['public']['Functions'];
    Enums: OriginalDatabase['public']['Enums'];
    CompositeTypes: OriginalDatabase['public']['CompositeTypes'];
  };
}

// Utility function to convert camelCase to snake_case for Supabase
export const toSnakeCase = (obj: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {};
  
  Object.keys(obj).forEach(key => {
    const snakeCaseKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
    
    if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      result[snakeCaseKey] = toSnakeCase(obj[key]);
    } else {
      result[snakeCaseKey] = obj[key];
    }
  });
  
  return result;
};

// Utility function to convert snake_case to camelCase for Supabase
export const toCamelCase = (obj: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {};
  
  Object.keys(obj).forEach(key => {
    const camelCaseKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    
    if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      result[camelCaseKey] = toCamelCase(obj[key]);
    } else {
      result[camelCaseKey] = obj[key];
    }
  });
  
  return result;
};
