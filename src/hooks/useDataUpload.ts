
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
    const formattedBatch = batch.map(metric => ({
      user_id: userId,
      file_name: fileName,
      import_batch_id: importBatchId,
      ...metric,
      data_start_date: new Date(metric.data_start_date).toISOString(),
      data_end_date: new Date(metric.data_end_date).toISOString(),
    }));

    console.log('Uploading batch:', formattedBatch);

    // Add timeout configuration
    const { data: results, error } = await supabase.rpc('upsert_ebay_listings_with_history', {
      listings: formattedBatch
    }, {
      count: 'exact'
    });

    if (error) {
      console.error('Batch error:', error);
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

    console.log('Batch results:', results);

    const processedResults = results.reduce((acc, result) => {
      const isSuccess = result.success === true;
      return {
        successCount: acc.successCount + (isSuccess ? 1 : 0),
        errorCount: acc.errorCount + (isSuccess ? 0 : 1),
        errors: isSuccess ? acc.errors : [...acc.errors, `Error with item ${result.ebay_item_id}: ${result.message}`]
      };
    }, { successCount: 0, errorCount: 0, errors: [] as string[] });

    console.log('Processed results:', processedResults);
    return processedResults;
  }, []);

  return { uploadBatch };
};
