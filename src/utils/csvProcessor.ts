import { ListingMetrics } from "@/types/listing";

const cleanNumericValue = (value: string): number => {
  // Handle empty or whitespace-only values
  if (!value || value.trim() === '') {
    return 0;
  }

  // First remove any currency symbols and spaces
  const cleaned = value.trim().replace(/[$£€\s]/g, '');
  
  // Check if the string contains a percentage sign and handle accordingly
  if (cleaned.includes('%')) {
    return cleanPercentage(cleaned);
  }
  
  // Replace commas with empty string to handle numbers like "233,679"
  const noCommas = cleaned.replace(/,/g, '');
  
  // Validate that we have a proper numeric string
  if (!/^-?\d*\.?\d+$/.test(noCommas)) {
    console.warn('Invalid numeric string format:', { original: value, cleaned: noCommas });
    return 0;
  }

  const result = parseFloat(noCommas);
  
  if (isNaN(result)) {
    console.warn('Failed to parse numeric value:', value);
    return 0;
  }

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
  // Handle empty or whitespace-only values
  if (!value || value.trim() === '') {
    return 0;
  }

  // Remove spaces and percentage signs, keeping negative signs and decimals
  const cleaned = value.trim().replace(/[%\s]/g, '');
  
  // Validate that we have a proper percentage string
  if (!/^-?\d*\.?\d+$/.test(cleaned)) {
    console.warn('Invalid percentage string format:', { original: value, cleaned });
    return 0;
  }

  // Convert percentage to decimal (e.g., 15.5 -> 0.155)
  const parsed = parseFloat(cleaned);
  if (isNaN(parsed)) {
    console.warn('Failed to parse percentage value:', value);
    return 0;
  }

  const result = parsed / 100;

  console.log('Processing percentage:', { 
    original: value, 
    cleaned, 
    parsed,
    result,
    resultType: typeof result
  });
  
  return result;
};

const parseDate = (dateStr: string): string => {
  if (!dateStr || dateStr.trim() === '') {
    console.warn('Empty date string provided');
    return new Date().toISOString();
  }

  try {
    // Remove any extra whitespace
    const cleanedDate = dateStr.trim();
    const date = new Date(cleanedDate);
    
    if (isNaN(date.getTime())) {
      console.warn('Invalid date format:', dateStr);
      return new Date().toISOString();
    }
    
    return date.toISOString();
  } catch (error) {
    console.error('Error parsing date:', { dateStr, error });
    return new Date().toISOString();
  }
};

const validateRow = (row: string[]): boolean => {
  if (row.length < 24) {
    console.error('Invalid row length:', { expected: 24, received: row.length });
    return false;
  }

  // Check for required string fields
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

  console.log('Starting CSV processing with rows:', dataRows.length);

  for (const row of dataRows) {
    // Filter out empty values that might come from trailing commas
    const cleanRow = row.filter(cell => cell !== '');
    
    if (!validateRow(cleanRow)) {
      console.warn('Skipping invalid row:', cleanRow);
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

      // Final validation of all numeric fields
      Object.entries(metric).forEach(([key, value]) => {
        if (typeof value === 'number' && (isNaN(value) || !isFinite(value))) {
          console.error('Invalid numeric value detected:', { field: key, value });
          throw new Error(`Invalid numeric value for field: ${key}`);
        }
      });

      console.log('Successfully processed row:', {
        itemId: metric.ebay_item_id,
        title: metric.listing_title,
        impressions: metric.total_impressions_ebay,
        ctr: metric.click_through_rate,
        sales: metric.quantity_sold
      });

      metrics.push(metric);
    } catch (error) {
      console.error('Error processing row:', { row: cleanRow, error });
      continue;
    }
  }

  console.log(`Successfully processed ${metrics.length} rows from CSV`);
  return metrics;
};
