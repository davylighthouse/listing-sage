
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
        dataStartDate: cleanRow[0],
        dataEndDate: cleanRow[1],
        listingTitle: cleanRow[2].trim(),
        itemId: cleanRow[3].trim(),
        totalImpressionsEbay: cleanNumericValue(cleanRow[4]),
        clickThroughRate: cleanPercentage(cleanRow[5]),
        quantitySold: cleanNumericValue(cleanRow[6]),
        salesConversionRate: cleanPercentage(cleanRow[7]),
        top20SearchSlotPromotedImpressions: cleanNumericValue(cleanRow[8]),
        changeTop20SearchSlotPromotedImpressions: cleanPercentage(cleanRow[9]),
        top20SearchSlotOrganicImpressions: cleanNumericValue(cleanRow[10]),
        changeTop20SearchSlotImpressions: cleanPercentage(cleanRow[11]),
        restOfSearchSlotImpressions: cleanNumericValue(cleanRow[12]),
        nonSearchPromotedListingsImpressions: cleanNumericValue(cleanRow[13]),
        changeNonSearchPromotedListingsImpressions: cleanPercentage(cleanRow[14]),
        nonSearchOrganicImpressions: cleanNumericValue(cleanRow[15]),
        changeNonSearchOrganicImpressions: cleanPercentage(cleanRow[16]),
        totalPromotedListingsImpressions: cleanNumericValue(cleanRow[17]),
        totalOrganicImpressionsEbay: cleanNumericValue(cleanRow[18]),
        totalPageViews: cleanNumericValue(cleanRow[19]),
        pageViewsPromotedEbay: cleanNumericValue(cleanRow[20]),
        pageViewsPromotedOutsideEbay: cleanNumericValue(cleanRow[21]),
        pageViewsOrganicEbay: cleanNumericValue(cleanRow[22]),
        pageViewsOrganicOutsideEbay: cleanNumericValue(cleanRow[23])
      };

      metrics.push(metric);
    } catch (error) {
      console.error('Error processing row:', cleanRow, error);
      continue;
    }
  }

  return metrics;
};
