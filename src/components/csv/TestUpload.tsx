
import React from "react";
import { Button } from "@/components/ui/button";
import { useCSVUpload } from "@/hooks/useCSVUpload";
import { useToast } from "@/hooks/use-toast";

const TestUpload = () => {
  const { handleDrop, handleFileInput, isUploading, previewData } = useCSVUpload();
  const { toast } = useToast();

  // Create a small test CSV with 5 records
  const createTestCSV = () => {
    console.log("Creating test CSV file...");
    
    const headers = [
      "data_start_date",
      "data_end_date",
      "listing_title",
      "ebay_item_id",
      "total_impressions_ebay",
      "click_through_rate",
      "quantity_sold",
      "sales_conversion_rate",
      "top_20_search_slot_promoted_impressions",
      "change_top_20_search_slot_promoted_impressions",
      "top_20_search_slot_organic_impressions",
      "change_top_20_search_slot_impressions",
      "rest_of_search_slot_impressions",
      "non_search_promoted_listings_impressions",
      "change_non_search_promoted_listings_impressions",
      "non_search_organic_impressions",
      "change_non_search_organic_impressions",
      "total_promoted_listings_impressions",
      "total_organic_impressions_ebay",
      "total_page_views",
      "page_views_promoted_ebay",
      "page_views_promoted_outside_ebay",
      "page_views_organic_ebay",
      "page_views_organic_outside_ebay"
    ].join(",");

    // Generate test records with basic IDs
    const records = Array(5).fill(null).map((_, i) => [
      "2024-02-01",
      "2024-02-28",
      `Test Product ${i + 1}`,
      `ITEM${i + 1}`,
      "100",
      "0.02",
      "1",
      "0.01",
      "50",
      "10",
      "40",
      "5",
      "10",
      "20",
      "5",
      "30",
      "10",
      "70",
      "70",
      "20",
      "10",
      "5",
      "3",
      "2"
    ].join(","));

    const csvContent = [headers, ...records].join("\n");
    console.log("Generated CSV content:", csvContent);

    const blob = new Blob([csvContent], { type: "text/csv" });
    const file = new File([blob], "test_upload.csv", { type: "text/csv" });

    console.log("Created test file:", file);

    toast({
      title: "Test Upload Started",
      description: "Uploading 5 test records...",
    });

    // Trigger the file input handler
    handleFileInput({ target: { files: [file] } } as any);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button 
          onClick={createTestCSV}
          disabled={isUploading}
          variant="outline"
        >
          Run Test Upload (5 records)
        </Button>
        {isUploading && <span className="text-sm text-muted-foreground">Uploading...</span>}
      </div>

      {previewData.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium mb-2">Test Data Preview</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  {previewData[0].map((header, i) => (
                    <th key={i} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.slice(1).map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} className="px-4 py-2 text-sm">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestUpload;
