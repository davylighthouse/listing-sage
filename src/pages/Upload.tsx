
import { useCSVUpload } from "@/hooks/useCSVUpload";
import { UploadZone } from "@/components/csv/UploadZone";
import { CSVPreview } from "@/components/csv/CSVPreview";
import FileInfo from "@/components/csv/FileInfo";
import UploadInstructions from "@/components/csv/UploadInstructions";
import { ColumnMappingsManager } from "@/components/ebay/ColumnMappingsManager";
import { TrackedListingsManager } from "@/components/ebay/TrackedListingsManager";
import TestUpload from "@/components/csv/TestUpload";

const UploadPage = () => {
  const {
    isDragging,
    isUploading,
    file,
    previewData,
    processedData,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInput
  } = useCSVUpload();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
      <div className="space-y-8">
        <div className="p-4 bg-white rounded-lg border">
          <h2 className="text-lg font-medium mb-4">Test Upload</h2>
          <TestUpload />
        </div>
        <ColumnMappingsManager />
        <TrackedListingsManager />
      </div>

      <div className="border-t pt-8">
        <UploadInstructions />

        <UploadZone
          isDragging={isDragging}
          isUploading={isUploading}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onFileInput={handleFileInput}
        />

        {file && (
          <FileInfo file={file} processedCount={processedData.length} />
        )}

        <CSVPreview previewData={previewData} />
      </div>
    </div>
  );
};

export default UploadPage;
