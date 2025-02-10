
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

const UploadPage = () => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
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
    toast({
      title: "File uploaded",
      description: "Your CSV file has been uploaded successfully",
    });
  }, [toast]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
    toast({
      title: "File uploaded",
      description: "Your CSV file has been uploaded successfully",
    });
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
        </div>
      )}
    </div>
  );
};

export default UploadPage;
