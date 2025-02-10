import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./use-toast";
import { supabase } from "@/integrations/supabase/client";
import { processCSVData } from "@/utils/csvProcessor";
import { validateCSVFormat } from "@/utils/csvValidation";
import { ListingMetrics } from "@/types/listing";

export const useCSVUpload = (userId: string | undefined) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<string[][]>([]);
  const [processedData, setProcessedData] = useState<ListingMetrics[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const processCSV = async (file: File) => {
    try {
      setIsUploading(true);
      const text = await file.text();
      const rows = text.split('\n')
        .filter(row => row.trim() !== '')
        .map(row => row.split(',').map(cell => cell.trim()));
      
      const headers = rows[0];
      validateCSVFormat(headers);
      
      const validData = rows.filter(row => row.length === headers.length);
      
      if (validData.length <= 1) {
        throw new Error('No valid data rows found in the CSV file');
      }
      
      setPreviewData([headers, ...validData.slice(1, 6)]); 
      const metrics = processCSVData(validData);
      setProcessedData(metrics);
      
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const dbData = metrics.map(metric => ({
        user_id: userId,
        data_start_date: metric.dataStartDate,
        data_end_date: metric.dataEndDate,
        ebay_item_id: metric.itemId,
        listing_title: metric.listingTitle,
        total_impressions_ebay: metric.totalImpressionsEbay,
        click_through_rate: metric.clickThroughRate,
        quantity_sold: metric.quantitySold,
        sales_conversion_rate: metric.salesConversionRate,
        top_20_search_slot_promoted_impressions: metric.top20SearchSlotPromotedImpressions,
        change_top_20_search_slot_promoted_impressions: metric.changeTop20SearchSlotPromotedImpressions,
        top_20_search_slot_organic_impressions: metric.top20SearchSlotOrganicImpressions,
        change_top_20_search_slot_impressions: metric.changeTop20SearchSlotImpressions,
        rest_of_search_slot_impressions: metric.restOfSearchSlotImpressions,
        non_search_promoted_listings_impressions: metric.nonSearchPromotedListingsImpressions,
        change_non_search_promoted_listings_impressions: metric.changeNonSearchPromotedListingsImpressions,
        non_search_organic_impressions: metric.nonSearchOrganicImpressions,
        change_non_search_organic_impressions: metric.changeNonSearchOrganicImpressions,
        total_promoted_listings_impressions: metric.totalPromotedListingsImpressions,
        total_organic_impressions_ebay: metric.totalOrganicImpressionsEbay,
        total_page_views: metric.totalPageViews,
        page_views_promoted_ebay: metric.pageViewsPromotedEbay,
        page_views_promoted_outside_ebay: metric.pageViewsPromotedOutsideEbay,
        page_views_organic_ebay: metric.pageViewsOrganicEbay,
        page_views_organic_outside_ebay: metric.pageViewsOrganicOutsideEbay
      }));

      const { error } = await supabase
        .from('ebay_listings')
        .insert(dbData);

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
  };

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
  }, [toast]);

  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
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
  }, [toast]);

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
