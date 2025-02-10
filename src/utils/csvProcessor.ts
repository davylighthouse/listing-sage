
import { ListingMetrics } from "@/types/listing";

const cleanNumericValue = (value: string): number => {
  const cleaned = value.replace(/[^0-9.-]/g, '');
  return cleaned ? parseFloat(cleaned) : 0;
};

const cleanPercentage = (value: string): number => {
  const cleaned = value.replace(/[^0-9.-]/g, '');
  return cleaned ? parseFloat(cleaned) / 100 : 0;
};

export const processCSVData = (rows: string[][]): ListingMetrics[] => {
  const metrics: ListingMetrics[] = [];
  const dataRows = rows.slice(1); // Skip header row

  for (const row of dataRows) {
    // Filter out empty values that might come from trailing commas
    const cleanRow = row.filter(cell => cell !== '');
    
    if (cleanRow.length !== 24) {
      console.warn('Skipping invalid row with incorrect number of columns:', cleanRow.length, 'columns found');
      continue;
    }

    try {
      const metric: ListingMetrics = {
        importDate: new Date().toISOString(),
        listingTitle: cleanRow[2].trim(),
        itemId: cleanRow[3].trim(),
        totalImpressions: cleanNumericValue(cleanRow[4]),
        clickThroughRate: cleanPercentage(cleanRow[5]),
        quantitySold: cleanNumericValue(cleanRow[6]),
        salesConversionRate: cleanPercentage(cleanRow[7]),
        top20SearchSlotImpressions: cleanNumericValue(cleanRow[8]),
        top20SearchSlotImpressionsChange: cleanPercentage(cleanRow[9]),
        top20OrganicSearchSlotImpressions: cleanNumericValue(cleanRow[10]),
        top20OrganicSearchSlotImpressionsChange: cleanPercentage(cleanRow[11]),
        restSearchSlotImpressions: cleanNumericValue(cleanRow[12]),
        nonSearchPromotedImpressions: cleanNumericValue(cleanRow[13]),
        nonSearchPromotedImpressionsChange: cleanPercentage(cleanRow[14]),
        nonSearchOrganicImpressions: cleanNumericValue(cleanRow[15]),
        nonSearchOrganicImpressionsChange: cleanPercentage(cleanRow[16]),
        promotedImpressions: cleanNumericValue(cleanRow[17]),
        organicImpressions: cleanNumericValue(cleanRow[18]),
        totalPageViews: cleanNumericValue(cleanRow[19]),
        pageViewsPromoted: cleanNumericValue(cleanRow[20]),
        pageViewsPromotedExternal: cleanNumericValue(cleanRow[21]),
        pageViewsOrganic: cleanNumericValue(cleanRow[22]),
        pageViewsOrganicExternal: cleanNumericValue(cleanRow[23]),
        promotedStatus: cleanNumericValue(cleanRow[17]) > 0 ? 'PROMOTED' : 'ORGANIC'
      };

      metrics.push(metric);
    } catch (error) {
      console.error('Error processing row:', cleanRow, error);
      continue;
    }
  }

  return metrics;
};
