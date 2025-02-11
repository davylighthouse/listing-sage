
import { ListingMetrics } from "@/types/listing";

const cleanNumericValue = (value: string): number => {
  // Handle empty or whitespace-only values
  if (!value || value.trim() === '') {
    console.log('Empty value detected, returning 0');
    return 0;
  }

  // First, let's clean up the string and log the original value
  const cleanedValue = value.trim();
  console.log('Processing numeric value:', { original: value, cleaned: cleanedValue });
  
  // Handle N/A and dash cases
  if (cleanedValue.toLowerCase() === 'n/a' || cleanedValue === '-') {
    console.log('N/A or dash value detected, returning 0');
    return 0;
  }

  // Remove any currency symbols and spaces
  const withoutCurrency = cleanedValue.replace(/[$£€\s]/g, '');
  
  // Handle percentage values separately
  if (withoutCurrency.includes('%')) {
    return cleanPercentage(withoutCurrency);
  }

  try {
    // Remove commas and parse as float
    const normalizedNumber = withoutCurrency.replace(/,/g, '');
    const parsed = parseFloat(normalizedNumber);
    console.log('Parsed numeric value:', { 
      original: value,
      withoutCurrency,
      normalizedNumber,
      parsed 
    });

    // Check if we got a valid number
    if (!isNaN(parsed) && isFinite(parsed)) {
      return parsed;
    }

    console.warn('Failed to parse numeric value:', { original: value, parsed });
    return 0;
  } catch (error) {
    console.error('Error parsing numeric value:', { value, error });
    return 0;
  }
};

const cleanPercentage = (value: string): number => {
  // Handle empty or whitespace-only values
  if (!value || value.trim() === '') {
    return 0;
  }

  // Remove spaces and percentage signs
  const cleaned = value.trim().replace(/[%\s]/g, '');
  
  // Handle N/A and dash cases
  if (cleaned.toLowerCase() === 'n/a' || cleaned === '-') {
    return 0;
  }

  try {
    const parsed = parseFloat(cleaned);
    if (!isNaN(parsed) && isFinite(parsed)) {
      return parsed / 100;
    }
    return 0;
  } catch (error) {
    console.error('Error parsing percentage:', { value, error });
    return 0;
  }
};

const parseDate = (dateStr: string): string => {
  if (!dateStr || dateStr.trim() === '') {
    console.warn('Empty date string provided');
    return new Date().toISOString();
  }

  try {
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

  for (const row of dataRows) {
    // Filter out empty values that might come from trailing commas
    const cleanRow = row.filter(cell => cell !== '');
    
    if (!validateRow(cleanRow)) {
      console.warn('Skipping invalid row:', cleanRow);
      continue;
    }

    try {
      // Log the raw total_impressions_ebay value before processing
      console.log('Raw total_impressions_ebay:', {
        value: cleanRow[4],
        position: 4
      });

      // Create the metric object with all fields
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

      // Log the processed values for debugging
      console.log('Processed metric:', {
        title: metric.listing_title,
        impressions: metric.total_impressions_ebay,
        raw_impressions: cleanRow[4]
      });

      // Validate numeric fields explicitly
      const numericFields = [
        'total_impressions_ebay',
        'click_through_rate',
        'quantity_sold',
        'sales_conversion_rate'
      ];

      // Check for any NaN or invalid values
      for (const field of numericFields) {
        const value = metric[field as keyof ListingMetrics];
        if (typeof value === 'number' && (isNaN(value) || !isFinite(value))) {
          throw new Error(`Invalid numeric value for ${field}: ${value}`);
        }
      }

      metrics.push(metric);
    } catch (error) {
      console.error('Error processing row:', { row: cleanRow, error });
      continue;
    }
  }

  // Log the final processed metrics for verification
  console.log('Final processed metrics:', metrics.map(m => ({
    title: m.listing_title,
    impressions: m.total_impressions_ebay
  })));

  return metrics;
};
