
import React from "react";
import { Upload } from "lucide-react";

interface UploadZoneProps {
  isDragging: boolean;
  isUploading: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UploadZone = ({
  isDragging,
  isUploading,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileInput,
}: UploadZoneProps) => {
  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-12 transition-colors ${
        isDragging
          ? "border-primary bg-primary/5"
          : "border-gray-300 hover:border-primary"
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <input
        type="file"
        accept=".csv"
        onChange={onFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isUploading}
      />
      <div className="text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-lg font-medium text-gray-900">
          {isUploading ? (
            "Uploading..."
          ) : (
            <>
              Drop your CSV file here, or{" "}
              <span className="text-primary">browse</span>
            </>
          )}
        </p>
        <p className="mt-1 text-gray-500">CSV files only, up to 10MB</p>
      </div>
    </div>
  );
};
