
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./use-toast";
import { supabase } from "@/integrations/supabase/client";
import { processCSVData } from "@/utils/csvProcessor";
import { validateCSVFormat } from "@/utils/csvValidation";
import { ListingMetrics } from "@/types/listing";
import { useAuth } from "./useAuth";

export const useCSVUpload = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<string[][]>([]);
  const [processedData, setProcessedData] = useState<ListingMetrics[]>([]);
  const [isUploading, setIsUploading] = useState(false);

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
        .filter(row => row.length > 1); // Filter out empty rows
      
      const headers = rows[0];
      validateCSVFormat(headers);
      
      if (rows.length <= 1) {
        throw new Error('No valid data rows found in the CSV file');
      }
      
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
      setProcessedData(metrics);

      // Generate a unique batch ID for this import
      const importBatchId = crypto.randomUUID();

      // Process records in very small batches with delays
      const batchSize = 5; // Even smaller batch size
      let successCount = 0;

      for (let i = 0; i < metrics.length; i += batchSize) {
        try {
          const batch = metrics.slice(i, i + batchSize).map(metric => ({
            user_id: user.id,
            file_name: file.name,
            import_batch_id: importBatchId,
            ...metric,
            data_start_date: new Date(metric.data_start_date).toISOString(),
            data_end_date: new Date(metric.data_end_date).toISOString(),
          }));

          // Insert each record individually to avoid stack depth issues
          for (const record of batch) {
            const { error } = await supabase.rpc('upsert_ebay_listings_with_history', {
              listings: [record]
            });

            if (error) {
              console.error('Record insert error:', error);
              continue; // Continue with next record even if one fails
            }
            successCount++;
          }

          // Add a longer delay between batches
          await new Promise(resolve => setTimeout(resolve, 1000));

          console.log(`Processed ${successCount} of ${metrics.length} records`);
        } catch (error) {
          console.error('Batch processing error:', error);
          // Continue with next batch even if one fails
        }
      }

      if (successCount === 0) {
        throw new Error('Failed to process any records');
      }

      toast({
        title: "Upload Complete",
        description: `Successfully processed ${successCount} out of ${metrics.length} listings`,
      });

      // Navigate after successful upload
      navigate('/listings');
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
  }, [user, toast, navigate]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (!user?.id) {
      toast({
        title: "Error",
        description: "Please log in to upload files.",
        variant: "destructive",
      });
      return;
    }

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type !== "text/csv") {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      return;
    }

    setFile(droppedFile);
    await processCSV(droppedFile);
  }, [user, toast, processCSV]);

  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "Please log in to upload files.",
        variant: "destructive",
      });
      return;
    }

    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "text/csv") {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    await processCSV(selectedFile);
  }, [user, toast, processCSV]);

  return {
    isDragging,
    isUploading,
    file,
    previewData,
    processedData,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInput
  };
};
