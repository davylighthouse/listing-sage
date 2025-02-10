
export const EXPECTED_COLUMNS = 24;
export const REQUIRED_HEADERS = [
  "data_start_date",
  "data_end_date",
  "listing_title",
  "ebay_item_id",
  "total_impressions_ebay",
  "click_through_rate",
  "quantity_sold",
  "sales_conversion_rate",
  "top_20_search_slot_promoted_impressions",
  "change_top_20_search_slot_promoted_impressions",
  "top_20_search_slot_organic_impressions",
  "change_top_20_search_slot_impressions",
  "rest_of_search_slot_impressions",
  "non_search_promoted_listings_impressions",
  "change_non_search_promoted_listings_impressions",
  "non_search_organic_impressions",
  "change_non_search_organic_impressions",
  "total_promoted_listings_impressions",
  "total_organic_impressions_ebay",
  "total_page_views",
  "page_views_promoted_ebay",
  "page_views_promoted_outside_ebay",
  "page_views_organic_ebay",
  "page_views_organic_outside_ebay"
];

export const validateCSVFormat = (headers: string[]): boolean => {
  if (headers.length !== EXPECTED_COLUMNS) {
    throw new Error(`Expected ${EXPECTED_COLUMNS} columns but found ${headers.length}. Please ensure you're using the correct CSV template.`);
  }

  // Check all headers match exactly
  const normalizedHeaders = headers.map(h => h.trim().toLowerCase());
  const normalizedRequired = REQUIRED_HEADERS.map(h => h.toLowerCase());
  
  for (let i = 0; i < normalizedRequired.length; i++) {
    if (normalizedHeaders[i] !== normalizedRequired[i]) {
      throw new Error(`Invalid CSV format. Expected column "${REQUIRED_HEADERS[i]}" but found "${headers[i]}"`);
    }
  }
  return true;
};
