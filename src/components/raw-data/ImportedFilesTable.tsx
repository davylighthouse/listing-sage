
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface ImportedFile {
  import_batch_id: string;
  file_name: string;
  created_at: string;
  record_count: number;
}

interface ImportedFilesTableProps {
  files: ImportedFile[] | undefined;
  isLoading: boolean;
  onDeleteFile: (batchId: string) => void;
}

const ImportedFilesTable = ({ files, isLoading, onDeleteFile }: ImportedFilesTableProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Imported Files</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>File Name</TableHead>
            <TableHead>Import Date</TableHead>
            <TableHead>Records</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">Loading...</TableCell>
            </TableRow>
          ) : files?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">No files imported yet</TableCell>
            </TableRow>
          ) : files?.map((file) => (
            <TableRow key={file.import_batch_id}>
              <TableCell>{file.file_name}</TableCell>
              <TableCell>{format(new Date(file.created_at), 'PPp')}</TableCell>
              <TableCell>{file.record_count.toLocaleString('en-US')}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDeleteFile(file.import_batch_id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ImportedFilesTable;
