
export interface ListingMetrics {
  itemId: string;
  listingTitle: string;
  dataStartDate: string;
  dataEndDate: string;
  totalImpressionsEbay: number;
  clickThroughRate: number;
  quantitySold: number;
  salesConversionRate: number;
  top20SearchSlotPromotedImpressions: number;
  changeTop20SearchSlotPromotedImpressions: number;
  top20SearchSlotOrganicImpressions: number;
  changeTop20SearchSlotImpressions: number;
  restOfSearchSlotImpressions: number;
  nonSearchPromotedListingsImpressions: number;
  changeNonSearchPromotedListingsImpressions: number;
  nonSearchOrganicImpressions: number;
  changeNonSearchOrganicImpressions: number;
  totalPromotedListingsImpressions: number;
  totalOrganicImpressionsEbay: number;
  totalPageViews: number;
  pageViewsPromotedEbay: number;
  pageViewsPromotedOutsideEbay: number;
  pageViewsOrganicEbay: number;
  pageViewsOrganicOutsideEbay: number;
  importDate: string;
}

export interface ProcessedData {
  headers: string[];
  metrics: ListingMetrics[];
}
