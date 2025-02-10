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
      ebay_listings: {
        Row: {
          click_through_rate: number | null
          created_at: string
          id: string
          item_id: string
          listing_title: string
          non_search_organic_impressions: number | null
          non_search_organic_impressions_change: number | null
          non_search_promoted_impressions: number | null
          non_search_promoted_impressions_change: number | null
          organic_impressions: number | null
          page_views_organic: number | null
          page_views_organic_external: number | null
          page_views_promoted: number | null
          page_views_promoted_external: number | null
          promoted_impressions: number | null
          promoted_status: string | null
          quantity_sold: number | null
          rest_search_slot_impressions: number | null
          sales_conversion_rate: number | null
          top20_organic_search_slot_impressions: number | null
          top20_organic_search_slot_impressions_change: number | null
          top20_search_slot_impressions: number | null
          top20_search_slot_impressions_change: number | null
          total_impressions: number | null
          total_page_views: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          click_through_rate?: number | null
          created_at?: string
          id?: string
          item_id: string
          listing_title: string
          non_search_organic_impressions?: number | null
          non_search_organic_impressions_change?: number | null
          non_search_promoted_impressions?: number | null
          non_search_promoted_impressions_change?: number | null
          organic_impressions?: number | null
          page_views_organic?: number | null
          page_views_organic_external?: number | null
          page_views_promoted?: number | null
          page_views_promoted_external?: number | null
          promoted_impressions?: number | null
          promoted_status?: string | null
          quantity_sold?: number | null
          rest_search_slot_impressions?: number | null
          sales_conversion_rate?: number | null
          top20_organic_search_slot_impressions?: number | null
          top20_organic_search_slot_impressions_change?: number | null
          top20_search_slot_impressions?: number | null
          top20_search_slot_impressions_change?: number | null
          total_impressions?: number | null
          total_page_views?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          click_through_rate?: number | null
          created_at?: string
          id?: string
          item_id?: string
          listing_title?: string
          non_search_organic_impressions?: number | null
          non_search_organic_impressions_change?: number | null
          non_search_promoted_impressions?: number | null
          non_search_promoted_impressions_change?: number | null
          organic_impressions?: number | null
          page_views_organic?: number | null
          page_views_organic_external?: number | null
          page_views_promoted?: number | null
          page_views_promoted_external?: number | null
          promoted_impressions?: number | null
          promoted_status?: string | null
          quantity_sold?: number | null
          rest_search_slot_impressions?: number | null
          sales_conversion_rate?: number | null
          top20_organic_search_slot_impressions?: number | null
          top20_organic_search_slot_impressions_change?: number | null
          top20_search_slot_impressions?: number | null
          top20_search_slot_impressions_change?: number | null
          total_impressions?: number | null
          total_page_views?: number | null
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
