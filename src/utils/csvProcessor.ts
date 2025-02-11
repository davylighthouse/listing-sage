
import { ListingMetrics } from "@/types/listing";

const cleanNumericValue = (value: string): number => {
  // Handle null/undefined/empty
  if (!value || value.trim() === "") {
    console.log('Empty value, returning 0');
    return 0;
  }

  try {
    // Handle numbers in parentheses (negative numbers)
    let cleanedValue = value.toString().trim();
    if (cleanedValue.startsWith('(') && cleanedValue.endsWith(')')) {
      cleanedValue = '-' + cleanedValue.slice(1, -1);
    }

    // Remove commas and any non-numeric characters except decimal points and minus signs
    const cleaned = cleanedValue.replace(/,/g, "").replace(/[^0-9.-]/g, "");
    console.log('Cleaned value:', cleaned);
    
    const parsed = cleaned ? parseFloat(cleaned) : 0;
    
    if (!isNaN(parsed) && isFinite(parsed)) {
      console.log('Successfully parsed:', parsed);
      return parsed;
    }
    
    console.log('Failed to parse, returning 0');
    return 0;
  } catch (error) {
    console.error('Error parsing value:', error);
    return 0;
  }
};

const cleanPercentage = (value: string): number => {
  if (!value || value.trim() === "") return 0;
  const cleaned = value.replace(/[^0-9.-]/g, "");
  const numericValue = cleaned ? parseFloat(cleaned) : null;
  return numericValue !== null ? numericValue / 100 : 0;
};

const parseDate = (dateStr: string): string => {
  if (!dateStr || dateStr.trim() === '') {
    return new Date().toISOString();
  }

  try {
    // Assuming input is in DD/MM/YYYY format
    const [day, month, year] = dateStr.trim().split(/[/-]/);
    if (!day || !month || !year) {
      return new Date().toISOString();
    }
    
    // Create date in YYYY-MM-DD format for ISO string
    const date = new Date(`${year}-${month}-${day}`);
    
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
  console.log('Processing CSV rows:', rows.length);
  const metrics: ListingMetrics[] = [];
  const dataRows = rows.slice(1); // Skip header row

  for (const row of dataRows) {
    const cleanRow = row.filter(cell => cell !== '');
    
    if (!validateRow(cleanRow)) {
      continue;
    }

    try {
      console.log('Processing impressions value:', cleanRow[4]);
      const impressions = cleanNumericValue(cleanRow[4]);
      console.log('Processed impressions value:', impressions);

      const metric: ListingMetrics = {
        data_start_date: parseDate(cleanRow[0]),
        data_end_date: parseDate(cleanRow[1]),
        listing_title: cleanRow[2].trim(),
        ebay_item_id: cleanRow[3].trim(),
        total_impressions_ebay: impressions,
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

      console.log('Created metric with impressions:', metric.total_impressions_ebay);
      metrics.push(metric);
    } catch (error) {
      console.error('Error processing row:', error);
      continue;
    }
  }

  console.log('Processed metrics:', metrics);
  return metrics;
};
