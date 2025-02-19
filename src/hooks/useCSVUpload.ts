
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
      
      // Read and parse CSV
      const text = await file.text();
      const rows = text.split('\n')
        .map(row => row.split(',').map(cell => cell.trim()))
        .filter(row => row.length > 1 && row.some(cell => cell.trim() !== '')); 
      
      const headers = rows[0];
      validateCSVFormat(headers);
      
      if (rows.length <= 1) {
        throw new Error('No valid data rows found in the CSV file');
      }
      
      console.log('Processing CSV with rows:', rows.length);
      
      // Generate import batch ID
      const importBatchId = crypto.randomUUID();
      
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
      
      // Process the data
      setPreviewData([headers, ...rows.slice(1, 6)]); 
      const metrics = processCSVData(rows);
      console.log('Processed metrics:', metrics);
      setProcessedData(metrics);

      // Upload all data in one batch
      const { successCount, errorCount, errors } = await uploadBatch(metrics, user.id);

      // Show results
      const successMessage = `Successfully processed ${successCount} out of ${metrics.length} listings`;
      const errorSuffix = errorCount > 0 ? `. ${errorCount} records had errors.` : '';
      
      toast({
        title: successCount > 0 ? "Upload Complete" : "Upload Failed",
        description: successMessage + errorSuffix,
        variant: errorCount === metrics.length ? "destructive" : 
                errorCount > 0 ? "default" : "default"
      });

      if (errors.length > 0) {
        console.error('Processing errors:', errors);
      }

      if (successCount > 0) {
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
