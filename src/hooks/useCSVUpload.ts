
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
      
      setPreviewData([headers, ...rows.slice(1, 6)]); 
      const metrics = processCSVData(rows);
      setProcessedData(metrics);

      // Insert the processed data into Supabase
      const { error } = await supabase
        .from('ebay_listings')
        .insert(
          metrics.map(metric => ({
            user_id: user.id,
            ...metric
          }))
        );

      if (error) {
        console.error('Supabase insertion error:', error);
        throw new Error('Failed to save data to database');
      }

      toast({
        title: "Success",
        description: `Successfully processed ${metrics.length} listings. Redirecting to dashboard...`,
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
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
  }, [user, toast, processCSV, setIsDragging]);

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
