
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import { ListingMetrics } from "@/types/listing";
import { processCSVData } from "@/utils/csvProcessor";
import { useNavigate } from "react-router-dom";

const UploadPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<string[][]>([]);
  const [processedData, setProcessedData] = useState<ListingMetrics[]>([]);

  const processCSV = async (file: File) => {
    try {
      const text = await file.text();
      const rows = text.split('\n').map(row => row.split(','));
      const headers = rows[0];
      const validData = rows.filter(row => row.length === headers.length);
      
      // Show preview data
      setPreviewData([headers, ...validData.slice(0, 5)]); 
      
      // Process full dataset
      const metrics = processCSVData(validData);
      setProcessedData(metrics);
      
      // Store in localStorage
      localStorage.setItem('ebayData', JSON.stringify(metrics));
      
      console.log('Processed metrics:', metrics);

      toast({
        title: "File processed",
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
        description: "Failed to parse CSV file. Please ensure it matches the expected format.",
        variant: "destructive",
      });
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
      </div>

      <div
        className={`relative border-2 border-dashed rounded-lg p-12 transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-primary"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-lg font-medium text-gray-900">
            Drop your CSV file here, or{" "}
            <span className="text-primary">browse</span>
          </p>
          <p className="mt-1 text-gray-500">CSV files only, up to 10MB</p>
        </div>
      </div>

      {file && (
        <div className="mt-6 p-4 bg-white rounded-lg border animate-fade-in">
          <h3 className="font-medium text-gray-900">Selected file</h3>
          <p className="mt-1 text-gray-500">{file.name}</p>
          <p className="mt-1 text-sm text-gray-500">
            Processed {processedData.length} listings
          </p>
        </div>
      )}

      {previewData.length > 0 && (
        <div className="mt-6 p-4 bg-white rounded-lg border animate-fade-in overflow-x-auto">
          <h3 className="font-medium text-gray-900 mb-4">Data Preview</h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {previewData[0].map((header, i) => (
                  <th
                    key={i}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {previewData.slice(1).map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
