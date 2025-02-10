
interface FileInfoProps {
  file: File;
  processedCount: number;
}

const FileInfo = ({ file, processedCount }: FileInfoProps) => {
  if (!file) return null;

  return (
    <div className="mt-6 p-4 bg-white rounded-lg border animate-fade-in">
      <h3 className="font-medium text-gray-900">Selected file</h3>
      <p className="mt-1 text-gray-500">{file.name}</p>
      <p className="mt-1 text-sm text-gray-500">
        Processed {processedCount} listings
      </p>
    </div>
  );
};

export default FileInfo;
