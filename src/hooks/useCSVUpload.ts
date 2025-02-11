
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./use-toast";
import { supabase } from "@/integrations/supabase/client";
import { processCSVData } from "@/utils/csvProcessor";
import { validateCSVFormat } from "@/utils/csvValidation";
import { ListingMetrics } from "@/types/listing";
import { useAuth } from "./useAuth";
import { useFileHandling } from "./useFileHandling";
import { useDataUpload } from "./useDataUpload";

export const useCSVUpload = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [previewData, setPreviewData] = useState<string[][]>([]);
  const [processedData, setProcessedData] = useState<ListingMetrics[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { uploadBatch } = useDataUpload();

  const processCSV = useCallback(async (file: File) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "User ID not found. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      const text = await file.text();
      const rows = text.split('\n')
        .map(row => row.split(',').map(cell => cell.trim()))
        .filter(row => row.length > 1 && row.some(cell => cell.trim() !== '')); // Skip empty rows
      
      const headers = rows[0];
      validateCSVFormat(headers);
      
      if (rows.length <= 1) {
        throw new Error('No valid data rows found in the CSV file');
      }
      
      console.log('Processing CSV with rows:', rows.length);
      
      // Store headers in raw_data table
      const { error: headerError } = await supabase
        .from('raw_data')
        .insert({
          user_id: user.id,
          headers: headers,
          file_name: file.name,
        });

      if (headerError) {
        console.error('Error storing headers:', headerError);
        throw new Error('Failed to store CSV headers');
      }
      
      setPreviewData([headers, ...rows.slice(1, 6)]); 
      const metrics = processCSVData(rows);
      console.log('Processed metrics:', metrics.length);
      setProcessedData(metrics);

      const importBatchId = crypto.randomUUID();
      const batchSize = 5;
      let totalSuccessCount = 0;
      let totalErrorCount = 0;
      let allErrors: string[] = [];

      for (let i = 0; i < metrics.length; i += batchSize) {
        const batch = metrics.slice(i, i + batchSize);
        console.log(`Processing batch ${i / batchSize + 1} of ${Math.ceil(metrics.length / batchSize)}`);
        
        const { successCount, errorCount, errors } = await uploadBatch(
          batch,
          user.id,
          file.name,
          importBatchId
        );

        totalSuccessCount += successCount;
        totalErrorCount += errorCount;
        allErrors.push(...errors);

        console.log(`Batch results - Success: ${successCount}, Errors: ${errorCount}`);
        console.log(`Total progress - Success: ${totalSuccessCount}, Errors: ${totalErrorCount}`);

        if (errors.length > 0) {
          console.log('Batch errors:', errors);
        }

        // Add a small delay between batches
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Only throw error if no records were processed successfully
      if (totalSuccessCount === 0 && totalErrorCount > 0) {
        throw new Error('Failed to process any records successfully');
      }

      toast({
        title: "Upload Complete",
        description: `Successfully processed ${totalSuccessCount} out of ${metrics.length} listings${
          totalErrorCount > 0 ? `. ${totalErrorCount} records had errors.` : ''
        }`,
        variant: totalErrorCount > 0 ? "destructive" : "default"
      });

      if (allErrors.length > 0) {
        console.error('Processing errors:', allErrors);
      }

      if (totalSuccessCount > 0) {
        navigate('/listings');
      }
    } catch (error) {
      console.error('CSV Processing error:', error);
      toast({
        title: "Error processing file",
        description: error instanceof Error ? error.message : "Failed to process CSV file. Please ensure it matches the expected format.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [user, toast, navigate, uploadBatch]);

  const fileHandling = useFileHandling(user);

  return {
    ...fileHandling,
    isUploading,
    previewData,
    processedData,
    handleDrop: (e: React.DragEvent) => fileHandling.handleDrop(e, processCSV),
    handleFileInput: (e: React.ChangeEvent<HTMLInputElement>) => fileHandling.handleFileInput(e, processCSV)
  };
};
