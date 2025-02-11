
export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  image_url?: string;
}

export interface ProductListing {
  id: string;
  ebay_item_id: string;
  ebay_listings: {
    listing_title: string;
    total_impressions_ebay?: number;
    total_page_views?: number;
    quantity_sold?: number;
    click_through_rate?: number;
  };
  product_id: string;
  created_at: string;
}

export interface AvailableListing {
  ebay_item_id: string;
  listing_title: string;
  selected?: boolean;
}
