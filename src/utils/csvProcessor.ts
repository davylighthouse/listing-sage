import { ListingMetrics } from "@/types/listing";

const cleanNumericValue = (value: string): number => {
  // Remove any currency symbols and spaces, keep commas
  const cleaned = value.replace(/[^0-9,.-]/g, '');
  // Replace commas with empty string to handle numbers like "233,679"
  const noCommas = cleaned.replace(/,/g, '');
  return noCommas ? parseFloat(noCommas) : 0;
};

const cleanPercentage = (value: string): number => {
  // Remove any non-numeric characters except decimal point, minus sign and remove %
  const cleaned = value.replace(/[^0-9.-]/g, '');
  // Convert percentage to decimal (e.g., 15.5% -> 0.155)
  return cleaned ? parseFloat(cleaned) / 100 : 0;
};

const parseDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    console.warn('Invalid date:', dateStr);
    return dateStr;
  }
  return date.toISOString();
};

export const processCSVData = (rows: string[][]): ListingMetrics[] => {
  const metrics: ListingMetrics[] = [];
  const dataRows = rows.slice(1); // Skip header row

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

      metrics.push(metric);
    } catch (error) {
      console.error('Error processing row:', cleanRow, error);
      continue;
    }
  }

  if (metrics.length === 0) {
    console.warn('No valid rows were processed from the CSV file');
  } else {
    console.log(`Successfully processed ${metrics.length} rows from CSV`);
  }

  return metrics;
};
