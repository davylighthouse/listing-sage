
import { ListingMetrics } from "@/types/listing";

const cleanNumericValue = (value: string): number | null => {
  if (!value || value.trim() === "") return null;
  
  try {
    // Handle numbers in parentheses (negative numbers)
    let cleanedValue = value.toString().trim();
    if (cleanedValue.startsWith('(') && cleanedValue.endsWith(')')) {
      cleanedValue = '-' + cleanedValue.slice(1, -1);
    }

    // Remove commas and any non-numeric characters except decimal points and minus signs
    const cleaned = cleanedValue.replace(/,/g, "").replace(/[^0-9.-]/g, "");
    const parsed = cleaned ? parseFloat(cleaned) : null;
    
    return !isNaN(parsed!) && isFinite(parsed!) ? parsed : null;
  } catch (error) {
    console.error('Error parsing numeric value:', error);
    return null;
  }
};

const cleanPercentage = (value: string): number | null => {
  if (!value || value.trim() === "") return null;
  const cleaned = value.replace(/%/g, "").replace(/,/g, "");
  const numericValue = cleaned ? parseFloat(cleaned) : null;
  return numericValue !== null ? numericValue / 100 : null;
};

const parseDate = (dateStr: string): string | null => {
  if (!dateStr || dateStr.trim() === '') {
    return null;
  }

  try {
    // Assuming input is in DD/MM/YYYY format
    const [day, month, year] = dateStr.trim().split(/[/-]/);
    if (!day || !month || !year) {
      return null;
    }
    
    // Ensure proper padding of day and month
    const paddedDay = day.padStart(2, '0');
    const paddedMonth = month.padStart(2, '0');
    
    const date = new Date(`${year}-${paddedMonth}-${paddedDay}`);
    return isNaN(date.getTime()) ? null : date.toISOString();
  } catch {
    return null;
  }
};

const validateRow = (row: string[]): boolean => {
  if (row.length < 24) {
    console.error('Invalid row length:', { expected: 24, received: row.length });
    return false;
  }

  // Check all required fields
  const requiredFields = [
    { index: 0, name: 'data_start_date' },
    { index: 1, name: 'data_end_date' },
    { index: 2, name: 'listing_title' },
    { index: 3, name: 'ebay_item_id' },
    { index: 4, name: 'total_impressions_ebay' },
    { index: 5, name: 'click_through_rate' },
    { index: 6, name: 'quantity_sold' },
    { index: 7, name: 'sales_conversion_rate' },
    { index: 8, name: 'total_page_views' }
  ];

  for (const field of requiredFields) {
    if (!row[field.index]?.trim()) {
      console.error(`Missing required field: ${field.name} at index ${field.index}`);
      return false;
    }
  }

  // Validate dates
  const startDate = parseDate(row[0]);
  const endDate = parseDate(row[1]);
  
  if (!startDate || !endDate) {
    console.error('Invalid date format. Expected DD/MM/YYYY', {
      startDate: row[0],
      endDate: row[1]
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
    if (!validateRow(row)) {
      continue;
    }

    try {
      const startDate = parseDate(row[0]);
      const endDate = parseDate(row[1]);
      
      if (!startDate || !endDate) {
        console.error('Invalid dates after validation:', { startDate: row[0], endDate: row[1] });
        continue;
      }

      const numericValues = row.slice(4).map(cleanNumericValue);
      const percentageValues = [row[5], row[7]].map(cleanPercentage);

      if (numericValues.some(v => v === null) || percentageValues.some(v => v === null)) {
        console.error('Invalid numeric or percentage values in row:', row);
        continue;
      }

      const metric: ListingMetrics = {
        ebay_item_id: row[3].trim(),
        listing_title: row[2].trim(),
        data_start_date: startDate,
        data_end_date: endDate,
        total_impressions_ebay: numericValues[0]!,
        click_through_rate: percentageValues[0]!,
        quantity_sold: numericValues[2]!,
        sales_conversion_rate: percentageValues[1]!,
        total_page_views: numericValues[4]!,
        top_20_search_slot_promoted_impressions: numericValues[5] ?? 0,
        change_top_20_search_slot_promoted_impressions: numericValues[6] ?? 0,
        top_20_search_slot_organic_impressions: numericValues[7] ?? 0,
        change_top_20_search_slot_impressions: numericValues[8] ?? 0,
        rest_of_search_slot_impressions: numericValues[9] ?? 0,
        non_search_promoted_listings_impressions: numericValues[10] ?? 0,
        change_non_search_promoted_listings_impressions: numericValues[11] ?? 0,
        non_search_organic_impressions: numericValues[12] ?? 0,
        change_non_search_organic_impressions: numericValues[13] ?? 0,
        total_promoted_listings_impressions: numericValues[14] ?? 0,
        total_organic_impressions_ebay: numericValues[15] ?? 0,
        page_views_promoted_ebay: numericValues[16] ?? 0,
        page_views_promoted_outside_ebay: numericValues[17] ?? 0,
        page_views_organic_ebay: numericValues[18] ?? 0,
        page_views_organic_outside_ebay: numericValues[19] ?? 0
      };

      console.log('Processed metric:', metric);
      metrics.push(metric);
    } catch (error) {
      console.error('Error processing row:', error, row);
      continue;
    }
  }

  console.log('Processed all metrics:', metrics);
  return metrics;
};
