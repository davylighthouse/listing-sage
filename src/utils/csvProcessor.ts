
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
    if (row.length < 24) {
      console.warn('Skipping invalid row with insufficient columns:', row);
      continue;
    }

    try {
      const metric: ListingMetrics = {
        importDate: new Date().toISOString(),
        listingTitle: row[2].trim(),
        itemId: row[3].trim(),
        totalImpressions: cleanNumericValue(row[4]),
        clickThroughRate: cleanPercentage(row[5]),
        quantitySold: cleanNumericValue(row[6]),
        salesConversionRate: cleanPercentage(row[7]),
        top20SearchSlotImpressions: cleanNumericValue(row[8]),
        top20SearchSlotImpressionsChange: cleanPercentage(row[9]),
        top20OrganicSearchSlotImpressions: cleanNumericValue(row[10]),
        top20OrganicSearchSlotImpressionsChange: cleanPercentage(row[11]),
        restSearchSlotImpressions: cleanNumericValue(row[12]),
        nonSearchPromotedImpressions: cleanNumericValue(row[13]),
        nonSearchPromotedImpressionsChange: cleanPercentage(row[14]),
        nonSearchOrganicImpressions: cleanNumericValue(row[15]),
        nonSearchOrganicImpressionsChange: cleanPercentage(row[16]),
        promotedImpressions: cleanNumericValue(row[17]),
        organicImpressions: cleanNumericValue(row[18]),
        totalPageViews: cleanNumericValue(row[19]),
        pageViewsPromoted: cleanNumericValue(row[20]),
        pageViewsPromotedExternal: cleanNumericValue(row[21]),
        pageViewsOrganic: cleanNumericValue(row[22]),
        pageViewsOrganicExternal: cleanNumericValue(row[23]),
        // Determine promoted status based on whether there are any promoted impressions
        promotedStatus: cleanNumericValue(row[17]) > 0 ? 'PROMOTED' : 'ORGANIC'
      };

      metrics.push(metric);
    } catch (error) {
      console.error('Error processing row:', row, error);
      continue;
    }
  }

  return metrics;
};
