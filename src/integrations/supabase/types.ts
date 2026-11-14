export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          brand: string | null;
          category: string;
          category_id?: string;
          description: string | null;
          mrp: number;
          price: number;
          image: string | null;
          image_url?: string | null;
          inStock?: boolean;
          in_stock?: boolean;
          stockQuantity?: number;
          stock_quantity?: number;
          sameDay?: boolean;
          same_day_eligible?: boolean;
          tag: string | null;
          created_at?: string;
        };
        Insert: {
          id: string;
          name: string;
          brand?: string | null;
          category?: string;
          category_id?: string;
          description?: string | null;
          mrp: number;
          price: number;
          image?: string | null;
          image_url?: string | null;
          inStock?: boolean;
          in_stock?: boolean;
          stockQuantity?: number;
          stock_quantity?: number;
          sameDay?: boolean;
          same_day_eligible?: boolean;
          tag?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          total: number;
          total_amount?: number;
          subtotal: number;
          discount: number;
          discount_amount?: number;
          delivery_fee: number;
          tax: number;
          tax_amount?: number;
          status: string;
          payment_method: string;
          payment_status: string;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          slot?: string;
          delivery_slot?: string;
          shipping_address: Json;
          customer_notes?: string | null;
          created_at: string;
          updated_at?: string;
        };
        Insert: {
          id: string;
          user_id?: string | null;
          total?: number;
          total_amount?: number;
          subtotal?: number;
          discount?: number;
          discount_amount?: number;
          delivery_fee?: number;
          tax?: number;
          tax_amount?: number;
          status?: string;
          payment_method?: string;
          payment_status?: string;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          slot?: string;
          delivery_slot?: string;
          shipping_address?: Json;
          customer_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          kind: string;
          product_id: string | null;
          title: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          metadata: Json;
        };
        Insert: {
          id?: string;
          order_id: string;
          kind: string;
          product_id?: string | null;
          title: string;
          quantity?: number;
          unit_price: number;
          total_price: number;
          metadata?: Json;
        };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
        Relationships: [];
      };
      print_jobs: {
        Row: {
          id: string;
          order_id: string | null;
          user_id: string | null;
          file_name: string;
          file_url: string | null;
          file_size_bytes: number | null;
          total_pages: number;
          copies: number;
          color_mode: string;
          sides: string;
          paper_size: string;
          binding_type: string;
          delivery_type: string;
          estimated_cost: number;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id?: string | null;
          user_id?: string | null;
          file_name: string;
          file_url?: string | null;
          file_size_bytes?: number | null;
          total_pages?: number;
          copies?: number;
          color_mode?: string;
          sides?: string;
          paper_size?: string;
          binding_type?: string;
          delivery_type?: string;
          estimated_cost?: number;
          status?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["print_jobs"]["Insert"]>;
        Relationships: [];
      };
      bulk_quotes: {
        Row: {
          id: string;
          organization_name: string;
          contact_person: string;
          email: string;
          phone: string;
          requirements: string;
          estimated_units: number | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_name: string;
          contact_person: string;
          email: string;
          phone: string;
          requirements: string;
          estimated_units?: number | null;
          status?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["bulk_quotes"]["Insert"]>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          full_name: string;
          phone: string | null;
          role: string;
          avatar_url: string | null;
          school_or_college: string | null;
          class_or_branch: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string;
          phone?: string | null;
          role?: string;
          avatar_url?: string | null;
          school_or_college?: string | null;
          class_or_branch?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      [key: string]: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Row: Record<string, any>;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Insert: Record<string, any>;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Update: Record<string, any>;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Relationships: any[];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
