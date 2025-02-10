
import { useAuth } from "@/hooks/useAuth";
import { useCSVUpload } from "@/hooks/useCSVUpload";
import { UploadZone } from "@/components/csv/UploadZone";
import { CSVPreview } from "@/components/csv/CSVPreview";
import FileInfo from "@/components/csv/FileInfo";
import UploadInstructions from "@/components/csv/UploadInstructions";
import { ColumnMappingsManager } from "@/components/ebay/ColumnMappingsManager";
import { TrackedListingsManager } from "@/components/ebay/TrackedListingsManager";
import AuthGuard from "@/components/AuthGuard";

const UploadPage = () => {
  const { user } = useAuth();
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
  } = useCSVUpload(user?.id);

  return (
    <AuthGuard>
      <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
        <div className="space-y-8">
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
    </AuthGuard>
  );
};

export default UploadPage;
