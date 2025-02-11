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
      column_mappings: {
        Row: {
          created_at: string
          id: string
          source_column: string
          target_field: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          source_column: string
          target_field: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          source_column?: string
          target_field?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      dashboard_preferences: {
        Row: {
          created_at: string
          date_range_end: string | null
          date_range_start: string | null
          default_sort_metric: string | null
          default_view: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date_range_end?: string | null
          date_range_start?: string | null
          default_sort_metric?: string | null
          default_view?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date_range_end?: string | null
          date_range_start?: string | null
          default_sort_metric?: string | null
          default_view?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ebay_column_mappings: {
        Row: {
          column_name: string
          column_position: number
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          column_name: string
          column_position: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          column_name?: string
          column_position?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ebay_listing_history: {
        Row: {
          change_non_search_organic_impressions: number | null
          change_non_search_promoted_listings_impressions: number | null
          change_top_20_search_slot_impressions: number | null
          change_top_20_search_slot_promoted_impressions: number | null
          click_through_rate: number | null
          created_at: string
          data_end_date: string
          data_start_date: string
          ebay_item_id: string
          file_name: string | null
          id: string
          import_batch_id: string | null
          non_search_organic_impressions: number | null
          non_search_promoted_listings_impressions: number | null
          page_views_organic_ebay: number | null
          page_views_organic_outside_ebay: number | null
          page_views_promoted_ebay: number | null
          page_views_promoted_outside_ebay: number | null
          quantity_sold: number | null
          rest_of_search_slot_impressions: number | null
          sales_conversion_rate: number | null
          top_20_search_slot_organic_impressions: number | null
          top_20_search_slot_promoted_impressions: number | null
          total_impressions_ebay: number | null
          total_organic_impressions_ebay: number | null
          total_page_views: number | null
          total_promoted_listings_impressions: number | null
          user_id: string
        }
        Insert: {
          change_non_search_organic_impressions?: number | null
          change_non_search_promoted_listings_impressions?: number | null
          change_top_20_search_slot_impressions?: number | null
          change_top_20_search_slot_promoted_impressions?: number | null
          click_through_rate?: number | null
          created_at?: string
          data_end_date: string
          data_start_date: string
          ebay_item_id: string
          file_name?: string | null
          id?: string
          import_batch_id?: string | null
          non_search_organic_impressions?: number | null
          non_search_promoted_listings_impressions?: number | null
          page_views_organic_ebay?: number | null
          page_views_organic_outside_ebay?: number | null
          page_views_promoted_ebay?: number | null
          page_views_promoted_outside_ebay?: number | null
          quantity_sold?: number | null
          rest_of_search_slot_impressions?: number | null
          sales_conversion_rate?: number | null
          top_20_search_slot_organic_impressions?: number | null
          top_20_search_slot_promoted_impressions?: number | null
          total_impressions_ebay?: number | null
          total_organic_impressions_ebay?: number | null
          total_page_views?: number | null
          total_promoted_listings_impressions?: number | null
          user_id: string
        }
        Update: {
          change_non_search_organic_impressions?: number | null
          change_non_search_promoted_listings_impressions?: number | null
          change_top_20_search_slot_impressions?: number | null
          change_top_20_search_slot_promoted_impressions?: number | null
          click_through_rate?: number | null
          created_at?: string
          data_end_date?: string
          data_start_date?: string
          ebay_item_id?: string
          file_name?: string | null
          id?: string
          import_batch_id?: string | null
          non_search_organic_impressions?: number | null
          non_search_promoted_listings_impressions?: number | null
          page_views_organic_ebay?: number | null
          page_views_organic_outside_ebay?: number | null
          page_views_promoted_ebay?: number | null
          page_views_promoted_outside_ebay?: number | null
          quantity_sold?: number | null
          rest_of_search_slot_impressions?: number | null
          sales_conversion_rate?: number | null
          top_20_search_slot_organic_impressions?: number | null
          top_20_search_slot_promoted_impressions?: number | null
          total_impressions_ebay?: number | null
          total_organic_impressions_ebay?: number | null
          total_page_views?: number | null
          total_promoted_listings_impressions?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_ebay_listing"
            columns: ["ebay_item_id"]
            isOneToOne: false
            referencedRelation: "ebay_listings"
            referencedColumns: ["ebay_item_id"]
          },
          {
            foreignKeyName: "fk_ebay_listing_history_ebay_item"
            columns: ["ebay_item_id"]
            isOneToOne: false
            referencedRelation: "ebay_listings"
            referencedColumns: ["ebay_item_id"]
          },
        ]
      }
      ebay_listings: {
        Row: {
          average_price: number | null
          created_at: string
          ebay_item_id: string
          id: string
          image_url: string | null
          last_rank_update: string | null
          listing_title: string
          performance_score: number | null
          previous_period_impressions: number | null
          previous_period_revenue: number | null
          previous_period_sales: number | null
          previous_rank: number | null
          rank_by_conversion: number | null
          rank_by_impressions: number | null
          rank_by_sales: number | null
          rank_change: number | null
          revenue: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          average_price?: number | null
          created_at?: string
          ebay_item_id: string
          id?: string
          image_url?: string | null
          last_rank_update?: string | null
          listing_title: string
          performance_score?: number | null
          previous_period_impressions?: number | null
          previous_period_revenue?: number | null
          previous_period_sales?: number | null
          previous_rank?: number | null
          rank_by_conversion?: number | null
          rank_by_impressions?: number | null
          rank_by_sales?: number | null
          rank_change?: number | null
          revenue?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          average_price?: number | null
          created_at?: string
          ebay_item_id?: string
          id?: string
          image_url?: string | null
          last_rank_update?: string | null
          listing_title?: string
          performance_score?: number | null
          previous_period_impressions?: number | null
          previous_period_revenue?: number | null
          previous_period_sales?: number | null
          previous_rank?: number | null
          rank_by_conversion?: number | null
          rank_by_impressions?: number | null
          rank_by_sales?: number | null
          rank_change?: number | null
          revenue?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ebay_tracked_listings: {
        Row: {
          created_at: string
          ebay_item_id: string
          id: string
          last_data_fetch: string | null
          listing_title: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          ebay_item_id: string
          id?: string
          last_data_fetch?: string | null
          listing_title?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          ebay_item_id?: string
          id?: string
          last_data_fetch?: string | null
          listing_title?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      listing_rank_history: {
        Row: {
          click_through_rate: number | null
          created_at: string
          id: string
          listing_id: string
          page_views_promoted_ebay: number | null
          page_views_promoted_outside_ebay: number | null
          quantity_sold: number | null
          rank: number
          rank_date: string | null
          sales_conversion_rate: number | null
          total_impressions_ebay: number | null
          total_page_views: number | null
          user_id: string
        }
        Insert: {
          click_through_rate?: number | null
          created_at?: string
          id?: string
          listing_id: string
          page_views_promoted_ebay?: number | null
          page_views_promoted_outside_ebay?: number | null
          quantity_sold?: number | null
          rank: number
          rank_date?: string | null
          sales_conversion_rate?: number | null
          total_impressions_ebay?: number | null
          total_page_views?: number | null
          user_id: string
        }
        Update: {
          click_through_rate?: number | null
          created_at?: string
          id?: string
          listing_id?: string
          page_views_promoted_ebay?: number | null
          page_views_promoted_outside_ebay?: number | null
          quantity_sold?: number | null
          rank?: number
          rank_date?: string | null
          sales_conversion_rate?: number | null
          total_impressions_ebay?: number | null
          total_page_views?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_listing"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "ebay_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_rank_history_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "ebay_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      metric_priorities: {
        Row: {
          created_at: string
          id: string
          metric: Database["public"]["Enums"]["metric_name"]
          priority: number
          updated_at: string
          user_id: string
          weight: number
        }
        Insert: {
          created_at?: string
          id?: string
          metric: Database["public"]["Enums"]["metric_name"]
          priority: number
          updated_at?: string
          user_id: string
          weight?: number
        }
        Update: {
          created_at?: string
          id?: string
          metric?: Database["public"]["Enums"]["metric_name"]
          priority?: number
          updated_at?: string
          user_id?: string
          weight?: number
        }
        Relationships: []
      }
      product_listings: {
        Row: {
          created_at: string
          ebay_item_id: string
          id: string
          product_id: string
        }
        Insert: {
          created_at?: string
          ebay_item_id: string
          id?: string
          product_id: string
        }
        Update: {
          created_at?: string
          ebay_item_id?: string
          id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_product_listings_ebay_listings"
            columns: ["ebay_item_id"]
            isOneToOne: false
            referencedRelation: "ebay_listings"
            referencedColumns: ["ebay_item_id"]
          },
          {
            foreignKeyName: "product_listings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          created_at: string
          id: string
          image_url: string | null
          name: string
          sku: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          sku?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          sku?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      raw_data: {
        Row: {
          created_at: string
          file_name: string
          headers: string[]
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          headers: string[]
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          headers?: string[]
          id?: string
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
      get_product_listing_count: {
        Args: {
          product_id: string
        }
        Returns: number
      }
      get_weighted_metrics: {
        Args: {
          listing_id: string
        }
        Returns: {
          metric_name: string
          raw_value: number
          priority: number
          weight: number
          weighted_value: number
        }[]
      }
      upsert_ebay_listings: {
        Args: {
          listings: Json[]
        }
        Returns: undefined
      }
      upsert_ebay_listings_with_history: {
        Args: {
          listings: Json[]
        }
        Returns: undefined
      }
    }
    Enums: {
      metric_name:
        | "quantity_sold"
        | "sales_conversion_rate"
        | "click_through_rate"
        | "total_impressions_ebay"
        | "top_20_search_slot_organic_impressions"
        | "total_page_views"
        | "top_20_search_slot_promoted_impressions"
        | "change_top_20_search_slot_impressions"
        | "total_promoted_listings_impressions"
        | "page_views_promoted_ebay"
        | "page_views_organic_ebay"
        | "change_top_20_search_slot_promoted_impressions"
        | "page_views_promoted_outside_ebay"
        | "page_views_organic_outside_ebay"
        | "total_organic_impressions_ebay"
        | "non_search_promoted_listings_impressions"
        | "change_non_search_promoted_listings_impressions"
        | "rest_of_search_slot_impressions"
        | "non_search_organic_impressions"
        | "change_non_search_organic_impressions"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
