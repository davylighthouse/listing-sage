
export interface ListingMetrics {
  itemId: string;
  listingTitle: string;
  promotedStatus: string;
  // Impressions
  totalImpressions: number;
  organicImpressions: number;
  promotedImpressions: number;
  // Search Slots
  top20SearchSlotImpressions: number;
  top20SearchSlotImpressionsChange: number;
  top20OrganicSearchSlotImpressions: number;
  top20OrganicSearchSlotImpressionsChange: number;
  restSearchSlotImpressions: number;
  // Non-Search
  nonSearchPromotedImpressions: number;
  nonSearchPromotedImpressionsChange: number;
  nonSearchOrganicImpressions: number;
  nonSearchOrganicImpressionsChange: number;
  // Page Views
  totalPageViews: number;
  pageViewsPromoted: number;
  pageViewsPromotedExternal: number;
  pageViewsOrganic: number;
  pageViewsOrganicExternal: number;
  // Performance
  quantitySold: number;
  clickThroughRate: number;
  salesConversionRate: number;
  // Metadata
  importDate: string;
}

export interface ProcessedData {
  headers: string[];
  metrics: ListingMetrics[];
}
