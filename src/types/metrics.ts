
export type MetricName = 
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
  | "change_non_search_organic_impressions";

export interface MetricPriority {
  id: string;
  metric: MetricName;
  priority: number;
  weight: number;
  user_id: string;
}
