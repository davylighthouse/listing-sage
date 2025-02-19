
import { DatabaseListing } from "@/types/listing";

const cleanNumericValue = (value: string): number => {
  if (!value || value.trim() === "") return 0;
  
  try {
    // Handle numbers in parentheses (negative numbers)
    let cleanedValue = value.toString().trim();
    if (cleanedValue.startsWith('(') && cleanedValue.endsWith(')')) {
      cleanedValue = '-' + cleanedValue.slice(1, -1);
    }

    // Remove commas and any non-numeric characters except decimal points and minus signs
    const cleaned = cleanedValue.replace(/,/g, "").replace(/[^0-9.-]/g, "");
    const parsed = cleaned ? parseFloat(cleaned) : 0;
    
    return !isNaN(parsed) && isFinite(parsed) ? parsed : 0;
  } catch (error) {
    console.error('Error parsing numeric value:', error);
    return 0;
  }
};

const cleanPercentage = (value: string): number => {
  if (!value || value.trim() === "") return 0;
  const cleaned = value.replace(/%/g, "").replace(/,/g, "");
  const numericValue = cleaned ? parseFloat(cleaned) : 0;
  return numericValue / 100;
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
    
    const date = new Date(`${year}-${month}-${day}`);
    return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
  } catch {
    return new Date().toISOString();
  }
};

const validateRow = (row: string[]): boolean => {
  if (row.length < 10) {
    console.error('Invalid row length:', { expected: 10, received: row.length });
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

export const processCSVData = (rows: string[][]): Partial<DatabaseListing>[] => {
  console.log('Processing CSV rows:', rows.length);
  const metrics: Partial<DatabaseListing>[] = [];
  const dataRows = rows.slice(1); // Skip header row

  for (const row of dataRows) {
    if (!validateRow(row)) {
      continue;
    }

    try {
      const metric: Partial<DatabaseListing> = {
        data_start_date: parseDate(row[0]),
        data_end_date: parseDate(row[1]),
        listing_title: row[2].trim(),
        ebay_item_id: row[3].trim(),
        total_impressions_ebay: cleanNumericValue(row[4]),
        click_through_rate: cleanPercentage(row[5]),
        quantity_sold: cleanNumericValue(row[6]),
        sales_conversion_rate: cleanPercentage(row[7]),
        total_page_views: cleanNumericValue(row[8]),
        page_views_promoted_ebay: 0,
        page_views_promoted_outside_ebay: 0,
        page_views_organic_ebay: 0,
        page_views_organic_outside_ebay: 0,
        total_promoted_listings_impressions: 0,
        total_organic_impressions_ebay: 0
      };

      metrics.push(metric);
    } catch (error) {
      console.error('Error processing row:', error);
      continue;
    }
  }

  console.log('Processed metrics:', metrics);
  return metrics;
};
