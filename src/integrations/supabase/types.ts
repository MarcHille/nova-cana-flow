export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      orders: {
        Row: {
          billing_address: Json
          created_at: string
          id: string
          notes: string | null
          payment_method: string
          products: Json
          shipping_address: Json
          status: string
          total_amount: number
          tracking_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_address: Json
          created_at?: string
          id?: string
          notes?: string | null
          payment_method: string
          products: Json
          shipping_address: Json
          status?: string
          total_amount: number
          tracking_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_address?: Json
          created_at?: string
          id?: string
          notes?: string | null
          payment_method?: string
          products?: Json
          shipping_address?: Json
          status?: string
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pharmacy_verification: {
        Row: {
          business_documents: string[]
          contact_details: Json
          id: string
          license_id: string
          notification_shown: boolean | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewer_id: string | null
          submitted_at: string
          user_id: string
          verification_status: string
        }
        Insert: {
          business_documents: string[]
          contact_details: Json
          id?: string
          license_id: string
          notification_shown?: boolean | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          submitted_at?: string
          user_id: string
          verification_status?: string
        }
        Update: {
          business_documents?: string[]
          contact_details?: Json
          id?: string
          license_id?: string
          notification_shown?: boolean | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          submitted_at?: string
          user_id?: string
          verification_status?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          cbd_content: string | null
          created_at: string
          description: string
          dosage: string | null
          effects: string[] | null
          id: string
          image_url: string
          name: string
          origin: string | null
          price: number
          pzn: string | null
          short_description: string
          stock: number
          terpenes: string[] | null
          thc_content: string | null
          updated_at: string
          weight: string | null
        }
        Insert: {
          category: string
          cbd_content?: string | null
          created_at?: string
          description: string
          dosage?: string | null
          effects?: string[] | null
          id?: string
          image_url: string
          name: string
          origin?: string | null
          price: number
          pzn?: string | null
          short_description: string
          stock?: number
          terpenes?: string[] | null
          thc_content?: string | null
          updated_at?: string
          weight?: string | null
        }
        Update: {
          category?: string
          cbd_content?: string | null
          created_at?: string
          description?: string
          dosage?: string | null
          effects?: string[] | null
          id?: string
          image_url?: string
          name?: string
          origin?: string | null
          price?: number
          pzn?: string | null
          short_description?: string
          stock?: number
          terpenes?: string[] | null
          thc_content?: string | null
          updated_at?: string
          weight?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_pharmacy_verification: {
        Args: {
          verification_id: string
          user_id_param: string
          admin_id: string
          review_time: string
        }
        Returns: undefined
      }
      assign_role_to_user: {
        Args: { _user_id: string; _role: string }
        Returns: boolean
      }
      create_admin: {
        Args: { new_admin_id: string }
        Returns: boolean
      }
      create_user: {
        Args: {
          email: string
          password: string
          user_role?: Database["public"]["Enums"]["app_role"]
        }
        Returns: string
      }
      get_all_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
          created_at: string
          updated_at: string
          roles: Database["public"]["Enums"]["app_role"][]
        }[]
      }
      get_user_roles: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"][]
      }
      get_user_roles_safely: {
        Args: { _user_id: string }
        Returns: string[]
      }
      get_users_with_roles: {
        Args: { _limit?: number; _offset?: number }
        Returns: {
          id: string
          email: string
          roles: string[]
          is_blocked: boolean
          created_at: string
          raw_user_meta_data: Json
          verification_status: string
        }[]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "pharmacist"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user", "pharmacist"],
    },
  },
} as const
