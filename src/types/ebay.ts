
export interface ColumnMapping {
  id: string;
  column_name: string;
  column_position: number;
  created_at: string;
  updated_at: string;
}

export interface TrackedListing {
  id: string;
  ebay_item_id: string;
  listing_title: string | null;
  status: string;
  last_data_fetch: string | null;
  created_at: string;
  updated_at: string;
}
