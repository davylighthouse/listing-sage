
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { ListingMetrics } from "@/types/listing";
import { processCSVData } from "@/utils/csvProcessor";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { UploadZone } from "@/components/csv/UploadZone";
import { CSVPreview } from "@/components/csv/CSVPreview";

const EXPECTED_COLUMNS = 24;
const REQUIRED_HEADERS = [
  "Data Start Date",
  "Data End Date",
  "Listing Title",
  "eBay Item ID",
  "Total Impressions on eBay Site"
  // ... We'll check the first few columns to validate the format
];

const UploadPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<string[][]>([]);
  const [processedData, setProcessedData] = useState<ListingMetrics[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const validateCSVFormat = (headers: string[]): boolean => {
    if (headers.length !== EXPECTED_COLUMNS) {
      throw new Error(`Expected ${EXPECTED_COLUMNS} columns but found ${headers.length}. Please ensure you're using the correct CSV template.`);
    }

    // Check at least the first few critical headers
    for (let i = 0; i < REQUIRED_HEADERS.length; i++) {
      if (!headers[i].toLowerCase().includes(REQUIRED_HEADERS[i].toLowerCase())) {
        throw new Error(`Invalid CSV format. Expected column "${REQUIRED_HEADERS[i]}" but found "${headers[i]}"`);
      }
    }
    return true;
  };

  const processCSV = async (file: File) => {
    try {
      setIsUploading(true);
      const text = await file.text();
      // Split by newline and filter out empty rows
      const rows = text.split('\n')
        .filter(row => row.trim() !== '')
        .map(row => row.split(',').map(cell => cell.trim()));
      
      const headers = rows[0];
      
      // Validate CSV format
      validateCSVFormat(headers);
      
      // Filter out rows that don't match header length
      const validData = rows.filter(row => row.length === headers.length);
      
      if (validData.length <= 1) {
        throw new Error('No valid data rows found in the CSV file');
      }
      
      // Show preview data
      setPreviewData([headers, ...validData.slice(1, 6)]); 
      
      // Process full dataset
      const metrics = processCSVData(validData);
      setProcessedData(metrics);
      
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Map the data to match database schema
      const dbData = metrics.map(metric => ({
        user_id: user.id,
        item_id: metric.itemId,
        listing_title: metric.listingTitle,
        promoted_status: metric.promotedStatus,
        total_impressions: metric.totalImpressions,
        organic_impressions: metric.organicImpressions,
        promoted_impressions: metric.promotedImpressions,
        click_through_rate: metric.clickThroughRate,
        quantity_sold: metric.quantitySold,
        sales_conversion_rate: metric.salesConversionRate,
        top20_search_slot_impressions: metric.top20SearchSlotImpressions,
        top20_search_slot_impressions_change: metric.top20SearchSlotImpressionsChange,
        top20_organic_search_slot_impressions: metric.top20OrganicSearchSlotImpressions,
        top20_organic_search_slot_impressions_change: metric.top20OrganicSearchSlotImpressionsChange,
        rest_search_slot_impressions: metric.restSearchSlotImpressions,
        non_search_promoted_impressions: metric.nonSearchPromotedImpressions,
        non_search_promoted_impressions_change: metric.nonSearchPromotedImpressionsChange,
        non_search_organic_impressions: metric.nonSearchOrganicImpressions,
        non_search_organic_impressions_change: metric.nonSearchOrganicImpressionsChange,
        total_page_views: metric.totalPageViews,
        page_views_promoted: metric.pageViewsPromoted,
        page_views_promoted_external: metric.pageViewsPromotedExternal,
        page_views_organic: metric.pageViewsOrganic,
        page_views_organic_external: metric.pageViewsOrganicExternal
      }));

      // Insert data into Supabase
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

      // Redirect to dashboard after 2 seconds
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

  return (
    <div className="max-w-4xl mx-auto animate-slide-up">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Upload CSV</h2>
        <p className="mt-1 text-gray-500">
          Import your eBay listing data by uploading a CSV file
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Your CSV file should contain the following columns in order:
        </p>
        <ul className="mt-2 text-sm text-gray-500 list-disc list-inside">
          <li>Data Start Date</li>
          <li>Data End Date</li>
          <li>Listing Title</li>
          <li>eBay Item ID</li>
          <li>And other metrics...</li>
        </ul>
      </div>

      <UploadZone
        isDragging={isDragging}
        isUploading={isUploading}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onFileInput={handleFileInput}
      />

      {file && (
        <div className="mt-6 p-4 bg-white rounded-lg border animate-fade-in">
          <h3 className="font-medium text-gray-900">Selected file</h3>
          <p className="mt-1 text-gray-500">{file.name}</p>
          <p className="mt-1 text-sm text-gray-500">
            Processed {processedData.length} listings
          </p>
        </div>
      )}

      <CSVPreview previewData={previewData} />
    </div>
  );
};

export default UploadPage;
