
import { useCallback } from "react";
import { useToast } from "./use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ListingMetrics } from "@/types/listing";

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
      // Generate a unique batch ID for this upload
      const importBatchId = crypto.randomUUID();

      // Prepare the data for upload
      const processedListings = listings.map(listing => ({
        user_id: userId,
        import_batch_id: importBatchId,
        ebay_item_id: listing.ebay_item_id,
        listing_title: listing.listing_title,
        data_start_date: listing.data_start_date,
        data_end_date: listing.data_end_date,
        total_impressions_ebay: listing.total_impressions_ebay,
        click_through_rate: listing.click_through_rate,
        quantity_sold: listing.quantity_sold,
        sales_conversion_rate: listing.sales_conversion_rate,
        total_page_views: listing.total_page_views,
        page_views_promoted_ebay: listing.page_views_promoted_ebay || 0,
        page_views_promoted_outside_ebay: listing.page_views_promoted_outside_ebay || 0,
        page_views_organic_ebay: listing.page_views_organic_ebay || 0,
        page_views_organic_outside_ebay: listing.page_views_organic_outside_ebay || 0
      }));

      // Insert into ebay_listing_history
      const { data: results, error } = await supabase
        .from('ebay_listing_history')
        .insert(processedListings)
        .select();

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      // Also update or insert into ebay_listings for current state
      const { error: listingsError } = await supabase
        .from('ebay_listings')
        .upsert(
          processedListings.map(({ ebay_item_id, listing_title }) => ({
            user_id: userId,
            ebay_item_id,
            listing_title
          })),
          { onConflict: 'user_id,ebay_item_id' }
        );

      if (listingsError) {
        console.error('Error updating ebay_listings:', listingsError);
      }

      return {
        successCount: results?.length || 0,
        errorCount: listings.length - (results?.length || 0),
        errors: []
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
