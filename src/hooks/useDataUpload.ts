
import { useCallback } from "react";
import { useToast } from "./use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ListingMetrics } from "@/types/listing";
import { Json } from "@/integrations/supabase/types";

interface UploadResult {
  successCount: number;
  errorCount: number;
  errors: string[];
}

export const useDataUpload = () => {
  const { toast } = useToast();

  const uploadBatch = useCallback(async (
    listings: ListingMetrics[],
    userId: string,
  ): Promise<UploadResult> => {
    console.log('Starting upload process for', listings.length, 'listings');

    try {
      // Convert ListingMetrics array to a format compatible with Json type
      const jsonListings = listings.map(listing => ({
        ebay_item_id: listing.ebay_item_id,
        listing_title: listing.listing_title,
        data_start_date: listing.data_start_date,
        data_end_date: listing.data_end_date,
        total_impressions_ebay: listing.total_impressions_ebay,
        click_through_rate: listing.click_through_rate,
        quantity_sold: listing.quantity_sold,
        sales_conversion_rate: listing.sales_conversion_rate,
        top_20_search_slot_promoted_impressions: listing.top_20_search_slot_promoted_impressions,
        change_top_20_search_slot_promoted_impressions: listing.change_top_20_search_slot_promoted_impressions,
        top_20_search_slot_organic_impressions: listing.top_20_search_slot_organic_impressions,
        change_top_20_search_slot_impressions: listing.change_top_20_search_slot_impressions,
        rest_of_search_slot_impressions: listing.rest_of_search_slot_impressions,
        non_search_promoted_listings_impressions: listing.non_search_promoted_listings_impressions,
        change_non_search_promoted_listings_impressions: listing.change_non_search_promoted_listings_impressions,
        non_search_organic_impressions: listing.non_search_organic_impressions,
        change_non_search_organic_impressions: listing.change_non_search_organic_impressions,
        total_promoted_listings_impressions: listing.total_promoted_listings_impressions,
        total_organic_impressions_ebay: listing.total_organic_impressions_ebay,
        total_page_views: listing.total_page_views,
        page_views_promoted_ebay: listing.page_views_promoted_ebay,
        page_views_promoted_outside_ebay: listing.page_views_promoted_outside_ebay,
        page_views_organic_ebay: listing.page_views_organic_ebay,
        page_views_organic_outside_ebay: listing.page_views_organic_outside_ebay
      })) as Json[];

      const { data: results, error } = await supabase.rpc(
        'upsert_ebay_listing_data',
        { 
          p_listings: jsonListings,
          p_user_id: userId
        }
      );

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      if (!results) {
        console.error('No results returned from upload');
        return {
          successCount: 0,
          errorCount: listings.length,
          errors: ['No response from server']
        };
      }

      console.log('Upload results:', results);

      const successCount = results.filter(r => r.success).length;
      const errorCount = results.filter(r => !r.success).length;
      const errors = results
        .filter(r => !r.success)
        .map(r => `Error with item ${r.ebay_item_id}: ${r.message}`);

      return {
        successCount,
        errorCount,
        errors
      };
    } catch (error) {
      console.error('Upload error:', error);
      return {
        successCount: 0,
        errorCount: listings.length,
        errors: [error instanceof Error ? error.message : 'Unknown error occurred during upload']
      };
    }
  }, []);

  return { uploadBatch };
};
