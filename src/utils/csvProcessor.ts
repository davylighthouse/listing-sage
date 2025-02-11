
import { ListingMetrics } from "@/types/listing";

const cleanNumericValue = (value: string): number => {
  // First remove any currency symbols, spaces, and percentage signs
  const cleaned = value.replace(/[^0-9,.-]/g, '');
  // Replace commas with empty string to handle numbers like "233,679"
  const noCommas = cleaned.replace(/,/g, '');
  const result = noCommas ? parseFloat(noCommas) : 0;
  console.log('Processing numeric value:', { 
    original: value, 
    cleaned, 
    noCommas, 
    result,
    resultType: typeof result 
  });
  return result;
};

const cleanPercentage = (value: string): number => {
  // Remove any non-numeric characters except decimal point and minus sign
  const cleaned = value.replace(/[^0-9.-]/g, '');
  // Convert percentage to decimal (e.g., 15.5 -> 0.155)
  const result = cleaned ? parseFloat(cleaned) / 100 : 0;
  console.log('Processing percentage:', { 
    original: value, 
    cleaned, 
    result,
    resultType: typeof result 
  });
  return result;
};

const parseDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      console.warn('Invalid date:', dateStr);
      return new Date().toISOString(); // Fallback to current date if invalid
    }
    return date.toISOString();
  } catch (error) {
    console.error('Error parsing date:', dateStr, error);
    return new Date().toISOString(); // Fallback to current date if error
  }
};

export const processCSVData = (rows: string[][]): ListingMetrics[] => {
  const metrics: ListingMetrics[] = [];
  const dataRows = rows.slice(1); // Skip header row

  console.log('Starting CSV processing with rows:', dataRows.length);

  for (const row of dataRows) {
    // Filter out empty values that might come from trailing commas
    const cleanRow = row.filter(cell => cell !== '');
    
    if (cleanRow.length < 24) {
      console.warn('Skipping row with insufficient columns:', cleanRow.length, 'columns found (minimum 24 required)');
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
        change_top_20_search_slot_promoted_impressions: cleanPercentage(cleanRow[9]),
        top_20_search_slot_organic_impressions: cleanNumericValue(cleanRow[10]),
        change_top_20_search_slot_impressions: cleanPercentage(cleanRow[11]),
        rest_of_search_slot_impressions: cleanNumericValue(cleanRow[12]),
        non_search_promoted_listings_impressions: cleanNumericValue(cleanRow[13]),
        change_non_search_promoted_listings_impressions: cleanPercentage(cleanRow[14]),
        non_search_organic_impressions: cleanNumericValue(cleanRow[15]),
        change_non_search_organic_impressions: cleanPercentage(cleanRow[16]),
        total_promoted_listings_impressions: cleanNumericValue(cleanRow[17]),
        total_organic_impressions_ebay: cleanNumericValue(cleanRow[18]),
        total_page_views: cleanNumericValue(cleanRow[19]),
        page_views_promoted_ebay: cleanNumericValue(cleanRow[20]),
        page_views_promoted_outside_ebay: cleanNumericValue(cleanRow[21]),
        page_views_organic_ebay: cleanNumericValue(cleanRow[22]),
        page_views_organic_outside_ebay: cleanNumericValue(cleanRow[23])
      };

      console.log('Processed row data:', {
        itemId: metric.ebay_item_id,
        title: metric.listing_title,
        impressions: metric.total_impressions_ebay,
        ctr: metric.click_through_rate,
        sales: metric.quantity_sold
      });

      metrics.push(metric);
    } catch (error) {
      console.error('Error processing row:', cleanRow, error);
      continue;
    }
  }

  console.log(`Successfully processed ${metrics.length} rows from CSV`);
  return metrics;
};
