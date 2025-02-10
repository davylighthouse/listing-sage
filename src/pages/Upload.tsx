
import { useAuth } from "@/hooks/useAuth";
import { useCSVUpload } from "@/hooks/useCSVUpload";
import { UploadZone } from "@/components/csv/UploadZone";
import { CSVPreview } from "@/components/csv/CSVPreview";
import FileInfo from "@/components/csv/FileInfo";
import UploadInstructions from "@/components/csv/UploadInstructions";

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
    <div className="max-w-4xl mx-auto animate-slide-up">
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
  );
};

export default UploadPage;
