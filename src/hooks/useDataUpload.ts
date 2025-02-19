
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
      const { data: results, error } = await supabase.rpc(
        'upsert_ebay_listing_data',
        { 
          p_listings: listings,
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
