
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
    if (row.length < 22) continue; // Skip invalid rows

    const metric: ListingMetrics = {
      itemId: row[1].trim(),
      listingTitle: row[0].trim(),
      promotedStatus: row[2].trim(),
      totalImpressions: cleanNumericValue(row[3]),
      clickThroughRate: cleanPercentage(row[4]),
      quantitySold: cleanNumericValue(row[5]),
      salesConversionRate: cleanPercentage(row[6]),
      top20SearchSlotImpressions: cleanNumericValue(row[7]),
      top20SearchSlotImpressionsChange: cleanPercentage(row[8]),
      top20OrganicSearchSlotImpressions: cleanNumericValue(row[9]),
      top20OrganicSearchSlotImpressionsChange: cleanPercentage(row[10]),
      restSearchSlotImpressions: cleanNumericValue(row[11]),
      nonSearchPromotedImpressions: cleanNumericValue(row[12]),
      nonSearchPromotedImpressionsChange: cleanPercentage(row[13]),
      nonSearchOrganicImpressions: cleanNumericValue(row[14]),
      nonSearchOrganicImpressionsChange: cleanPercentage(row[15]),
      promotedImpressions: cleanNumericValue(row[16]),
      organicImpressions: cleanNumericValue(row[17]),
      totalPageViews: cleanNumericValue(row[18]),
      pageViewsPromoted: cleanNumericValue(row[19]),
      pageViewsPromotedExternal: cleanNumericValue(row[20]),
      pageViewsOrganic: cleanNumericValue(row[21]),
      pageViewsOrganicExternal: cleanNumericValue(row[22]),
      importDate: new Date().toISOString(),
    };

    metrics.push(metric);
  }

  return metrics;
};
