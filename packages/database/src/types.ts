export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: 'customer' | 'cashier' | 'washer' | 'ironer' | 'owner';
          name: string;
          phone: string;
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: 'customer' | 'cashier' | 'washer' | 'ironer' | 'owner';
          name: string;
          phone: string;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: 'customer' | 'cashier' | 'washer' | 'ironer' | 'owner';
          name?: string;
          phone?: string;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          name: string;
          category: 'kiloan' | 'satuan';
          price: number;
          min_weight_kg: number;
          estimated_duration_hours: number;
          icon_name: string | null;
          description: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: 'kiloan' | 'satuan';
          price: number;
          min_weight_kg?: number;
          estimated_duration_hours?: number;
          icon_name?: string | null;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          name?: string;
          category?: 'kiloan' | 'satuan';
          price?: number;
          min_weight_kg?: number;
          estimated_duration_hours?: number;
          icon_name?: string | null;
          description?: string | null;
          is_active?: boolean;
        };
      };
      racks: {
        Row: {
          id: string;
          code: string;
          name: string;
          capacity: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          capacity?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          code?: string;
          name?: string;
          capacity?: number;
          is_active?: boolean;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          tracking_code: string;
          customer_id: string | null;
          customer_name: string;
          customer_phone: string;
          status: 'received' | 'washing' | 'drying' | 'ironing' | 'packing_qc' | 'ready' | 'completed' | 'cancelled';
          payment_status: 'unpaid' | 'paid' | 'refunded';
          payment_channel: 'cash' | 'midtrans_qris' | 'midtrans_va';
          kiloan_weight_kg: number;
          kiloan_charged_weight_kg: number;
          kiloan_subtotal: number;
          satuan_subtotal: number;
          gross_amount: number;
          discount_amount: number;
          discount_explanation: string | null;
          final_amount: number;
          rack_location: string | null;
          cashier_id: string | null;
          notes: string | null;
          estimated_ready_at: string;
          actual_ready_at: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          tracking_code: string;
          customer_id?: string | null;
          customer_name: string;
          customer_phone: string;
          status?: 'received' | 'washing' | 'drying' | 'ironing' | 'packing_qc' | 'ready' | 'completed' | 'cancelled';
          payment_status?: 'unpaid' | 'paid' | 'refunded';
          payment_channel?: 'cash' | 'midtrans_qris' | 'midtrans_va';
          kiloan_weight_kg?: number;
          kiloan_charged_weight_kg?: number;
          kiloan_subtotal?: number;
          satuan_subtotal?: number;
          gross_amount?: number;
          discount_amount?: number;
          discount_explanation?: string | null;
          final_amount: number;
          rack_location?: string | null;
          cashier_id?: string | null;
          notes?: string | null;
          estimated_ready_at: string;
          actual_ready_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: 'received' | 'washing' | 'drying' | 'ironing' | 'packing_qc' | 'ready' | 'completed' | 'cancelled';
          payment_status?: 'unpaid' | 'paid' | 'refunded';
          payment_channel?: 'cash' | 'midtrans_qris' | 'midtrans_va';
          rack_location?: string | null;
          actual_ready_at?: string | null;
          completed_at?: string | null;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          service_id: string | null;
          service_name: string;
          category: 'kiloan' | 'satuan';
          quantity: number;
          price_per_unit: number;
          subtotal: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          service_id?: string | null;
          service_name: string;
          category: 'kiloan' | 'satuan';
          quantity: number;
          price_per_unit: number;
          subtotal: number;
          created_at?: string;
        };
        Update: {
          quantity?: number;
          price_per_unit?: number;
          subtotal?: number;
        };
      };
      order_qc_photos: {
        Row: {
          id: string;
          order_id: string;
          photo_url: string;
          issue_type: 'tear' | 'stain' | 'fade' | 'missing_button' | 'other';
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          photo_url: string;
          issue_type: 'tear' | 'stain' | 'fade' | 'missing_button' | 'other';
          description?: string | null;
          created_at?: string;
        };
        Update: {
          photo_url?: string;
          issue_type?: 'tear' | 'stain' | 'fade' | 'missing_button' | 'other';
          description?: string | null;
        };
      };
      app_settings: {
        Row: {
          key: string;
          category: 'payment' | 'outlet' | 'business_rules' | 'whatsapp';
          value: Json;
          description: string | null;
          is_secret: boolean;
          updated_at: string;
        };
        Insert: {
          key: string;
          category: 'payment' | 'outlet' | 'business_rules' | 'whatsapp';
          value: Json;
          description?: string | null;
          is_secret?: boolean;
          updated_at?: string;
        };
        Update: {
          value?: Json;
          description?: string | null;
          is_secret?: boolean;
          updated_at?: string;
        };
      };
      whatsapp_queue: {
        Row: {
          id: string;
          order_id: string | null;
          recipient_phone: string;
          message_body: string;
          message_type: 'order_received' | 'order_ready' | 'winback' | 'custom';
          status: 'pending' | 'sent' | 'failed';
          retry_count: number;
          error_message: string | null;
          created_at: string;
          sent_at: string | null;
        };
        Insert: {
          id?: string;
          order_id?: string | null;
          recipient_phone: string;
          message_body: string;
          message_type: 'order_received' | 'order_ready' | 'winback' | 'custom';
          status?: 'pending' | 'sent' | 'failed';
          retry_count?: number;
          error_message?: string | null;
          created_at?: string;
          sent_at?: string | null;
        };
        Update: {
          status?: 'pending' | 'sent' | 'failed';
          retry_count?: number;
          error_message?: string | null;
          sent_at?: string | null;
        };
      };
    };
  };
}
