
export interface ListingMetrics {
  id?: string;
  user_id?: string;
  ebay_item_id: string;
  listing_title: string;
  data_start_date?: string;
  data_end_date?: string;
  total_impressions_ebay: number;
  click_through_rate: number;
  quantity_sold: number;
  sales_conversion_rate: number;
  total_page_views: number;
  created_at?: string;
}

export interface ProcessedData {
  headers: string[];
  metrics: ListingMetrics[];
}
