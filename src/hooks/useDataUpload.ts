
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
      // Prepare the data for upload
      const processedListings = listings.map(listing => ({
        ebay_item_id: listing.ebay_item_id,
        listing_title: listing.listing_title,
        data_start_date: listing.data_start_date,
        data_end_date: listing.data_end_date,
        total_impressions_ebay: listing.total_impressions_ebay,
        click_through_rate: listing.click_through_rate,
        quantity_sold: listing.quantity_sold,
        sales_conversion_rate: listing.sales_conversion_rate,
        total_page_views: listing.total_page_views
      }));

      const { data: results, error } = await supabase.rpc(
        'import_listing_data',
        { 
          p_user_id: userId,
          p_data: processedListings
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
