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
      ebay_listings: {
        Row: {
          change_non_search_organic_impressions: number | null
          change_non_search_promoted_listings_impressions: number | null
          change_top_20_search_slot_impressions: number | null
          change_top_20_search_slot_promoted_impressions: number | null
          click_through_rate: number | null
          created_at: string
          data_end_date: string | null
          data_start_date: string | null
          ebay_item_id: string
          file_name: string | null
          id: string
          import_batch_id: string | null
          listing_title: string
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
          updated_at: string
          user_id: string
        }
        Insert: {
          change_non_search_organic_impressions?: number | null
          change_non_search_promoted_listings_impressions?: number | null
          change_top_20_search_slot_impressions?: number | null
          change_top_20_search_slot_promoted_impressions?: number | null
          click_through_rate?: number | null
          created_at?: string
          data_end_date?: string | null
          data_start_date?: string | null
          ebay_item_id: string
          file_name?: string | null
          id?: string
          import_batch_id?: string | null
          listing_title: string
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
          updated_at?: string
          user_id: string
        }
        Update: {
          change_non_search_organic_impressions?: number | null
          change_non_search_promoted_listings_impressions?: number | null
          change_top_20_search_slot_impressions?: number | null
          change_top_20_search_slot_promoted_impressions?: number | null
          click_through_rate?: number | null
          created_at?: string
          data_end_date?: string | null
          data_start_date?: string | null
          ebay_item_id?: string
          file_name?: string | null
          id?: string
          import_batch_id?: string | null
          listing_title?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
