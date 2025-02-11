import { ListingMetrics } from "@/types/listing";

const cleanNumericValue = (value: string): number => {
  // Return 0 for empty/null values
  if (!value || value.trim() === '') {
    return 0;
  }

  // Clean up the string and handle special cases
  const cleanedValue = value.trim();
  if (cleanedValue.toLowerCase() === 'n/a' || cleanedValue === '-') {
    return 0;
  }

  try {
    // Remove any currency symbols and spaces
    const withoutCurrency = cleanedValue.replace(/[$£€\s]/g, '');
    
    // Parse the number keeping commas for thousands
    const parsedValue = parseFloat(withoutCurrency.replace(/,/g, ''));
    
    if (!isNaN(parsedValue) && isFinite(parsedValue)) {
      return parsedValue;
    }
    
    return 0;
  } catch (error) {
    return 0;
  }
};

const cleanPercentage = (value: string): number => {
  // Return 0 for empty/null values
  if (!value || value.trim() === '') {
    return 0;
  }

  const cleaned = value.trim().replace(/[%\s]/g, '');
  if (cleaned.toLowerCase() === 'n/a' || cleaned === '-') {
    return 0;
  }

  try {
    const parsed = parseFloat(cleaned);
    if (!isNaN(parsed) && isFinite(parsed)) {
      return parsed / 100;
    }
    return 0;
  } catch {
    return 0;
  }
};

const parseDate = (dateStr: string): string => {
  if (!dateStr || dateStr.trim() === '') {
    return new Date().toISOString();
  }

  try {
    const cleanedDate = dateStr.trim();
    const date = new Date(cleanedDate);
    
    if (isNaN(date.getTime())) {
      return new Date().toISOString();
    }
    
    return date.toISOString();
  } catch {
    return new Date().toISOString();
  }
};

const validateRow = (row: string[]): boolean => {
  if (row.length < 24) {
    console.error('Invalid row length:', { expected: 24, received: row.length });
    return false;
  }

  if (!row[2]?.trim() || !row[3]?.trim()) {
    console.error('Missing required fields:', { 
      listing_title: row[2], 
      ebay_item_id: row[3] 
    });
    return false;
  }

  return true;
};

export const processCSVData = (rows: string[][]): ListingMetrics[] => {
  const metrics: ListingMetrics[] = [];
  const dataRows = rows.slice(1); // Skip header row

  for (const row of dataRows) {
    const cleanRow = row.filter(cell => cell !== '');
    
    if (!validateRow(cleanRow)) {
      continue;
    }

    try {
      const metric: ListingMetrics = {
        data_start_date: parseDate(cleanRow[0]),
        data_end_date: parseDate(cleanRow[1]),
        listing_title: cleanRow[2].trim(),
        ebay_item_id: cleanRow[3].trim(),
        total_impressions_ebay: cleanNumericValue(cleanRow[4]),
        click_through_rate: cleanPercentage(cleanRow[5]),
        quantity_sold: cleanNumericValue(cleanRow[6]),
        sales_conversion_rate: cleanPercentage(cleanRow[7]),
        top_20_search_slot_promoted_impressions: cleanNumericValue(cleanRow[8]),
        change_top_20_search_slot_promoted_impressions: cleanNumericValue(cleanRow[9]),
        top_20_search_slot_organic_impressions: cleanNumericValue(cleanRow[10]),
        change_top_20_search_slot_impressions: cleanNumericValue(cleanRow[11]),
        rest_of_search_slot_impressions: cleanNumericValue(cleanRow[12]),
        non_search_promoted_listings_impressions: cleanNumericValue(cleanRow[13]),
        change_non_search_promoted_listings_impressions: cleanNumericValue(cleanRow[14]),
        non_search_organic_impressions: cleanNumericValue(cleanRow[15]),
        change_non_search_organic_impressions: cleanNumericValue(cleanRow[16]),
        total_promoted_listings_impressions: cleanNumericValue(cleanRow[17]),
        total_organic_impressions_ebay: cleanNumericValue(cleanRow[18]),
        total_page_views: cleanNumericValue(cleanRow[19]),
        page_views_promoted_ebay: cleanNumericValue(cleanRow[20]),
        page_views_promoted_outside_ebay: cleanNumericValue(cleanRow[21]),
        page_views_organic_ebay: cleanNumericValue(cleanRow[22]),
        page_views_organic_outside_ebay: cleanNumericValue(cleanRow[23])
      };

      metrics.push(metric);
    } catch (error) {
      console.error('Error processing row:', error);
      continue;
    }
  }

  return metrics;
};
