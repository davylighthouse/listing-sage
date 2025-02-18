
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
    batch: ListingMetrics[],
    userId: string,
    fileName: string,
    importBatchId: string
  ): Promise<UploadResult> => {
    try {
      const formattedBatch = batch.map(metric => ({
        user_id: userId,
        file_name: fileName,
        import_batch_id: importBatchId,
        ...metric,
        data_start_date: new Date(metric.data_start_date).toISOString(),
        data_end_date: new Date(metric.data_end_date).toISOString(),
      }));

      console.log('Uploading batch:', formattedBatch);

      const { data: results, error } = await supabase.rpc(
        'upsert_ebay_listings_with_history',
        { listings: formattedBatch }
      );

      if (error) {
        console.error('Batch upload error:', error);
        throw error;
      }

      if (!results || !Array.isArray(results)) {
        console.error('Unexpected results format:', results);
        return {
          successCount: 0,
          errorCount: batch.length,
          errors: ['Unexpected response format from server']
        };
      }

      console.log('Batch upload results:', results);

      const processedResults = results.reduce((acc, result) => ({
        successCount: acc.successCount + (result.success ? 1 : 0),
        errorCount: acc.errorCount + (result.success ? 0 : 1),
        errors: result.success ? acc.errors : [...acc.errors, `Error with item ${result.ebay_item_id}: ${result.message}`]
      }), { successCount: 0, errorCount: 0, errors: [] as string[] });

      return processedResults;
    } catch (error) {
      console.error('Upload batch error:', error);
      return {
        successCount: 0,
        errorCount: batch.length,
        errors: [error instanceof Error ? error.message : 'Unknown error occurred during upload']
      };
    }
  }, []);

  return { uploadBatch };
};
