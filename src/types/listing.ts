
export interface ListingMetrics {
  id?: string;
  user_id?: string;
  data_start_date: string;
  data_end_date: string;
  listing_title: string;
  ebay_item_id: string;
  total_impressions_ebay: number;
  click_through_rate: number;
  quantity_sold: number;
  sales_conversion_rate: number;
  top_20_search_slot_promoted_impressions: number;
  change_top_20_search_slot_promoted_impressions: number;
  top_20_search_slot_organic_impressions: number;
  change_top_20_search_slot_impressions: number;
  rest_of_search_slot_impressions: number;
  non_search_promoted_listings_impressions: number;
  change_non_search_promoted_listings_impressions: number;
  non_search_organic_impressions: number;
  change_non_search_organic_impressions: number;
  total_promoted_listings_impressions: number;
  total_organic_impressions_ebay: number;
  total_page_views: number;
  page_views_promoted_ebay: number;
  page_views_promoted_outside_ebay: number;
  page_views_organic_ebay: number;
  page_views_organic_outside_ebay: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProcessedData {
  headers: string[];
  metrics: ListingMetrics[];
}
