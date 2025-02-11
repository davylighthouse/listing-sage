
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

interface ImportedFile {
  import_batch_id: string;
  file_name: string;
  created_at: string;
  record_count: number;
}

const RawDataPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);

  // Query for imported files summary
  const { data: importedFiles, isLoading: filesLoading, refetch: refetchFiles } = useQuery({
    queryKey: ["imported-files", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('ebay_listings')
        .select('import_batch_id, file_name, created_at')
        .eq('user_id', user.id)
        .filter('import_batch_id', 'not.is', null)
        .filter('file_name', 'not.is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group by import batch and count records
      const filesSummary = data.reduce((acc: Record<string, ImportedFile>, curr) => {
        if (!acc[curr.import_batch_id]) {
          acc[curr.import_batch_id] = {
            import_batch_id: curr.import_batch_id,
            file_name: curr.file_name,
            created_at: curr.created_at,
            record_count: 1,
          };
        } else {
          acc[curr.import_batch_id].record_count++;
        }
        return acc;
      }, {});

      return Object.values(filesSummary);
    },
    enabled: !!user?.id,
  });

  // Query for raw data entries
  const { data: rawData, isLoading: dataLoading } = useQuery({
    queryKey: ["raw-data", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('ebay_listings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const handleDeleteFile = async (batchId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('ebay_listings')
        .delete()
        .eq('user_id', user.id)
        .eq('import_batch_id', batchId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "File data has been deleted",
      });

      refetchFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Error",
        description: "Failed to delete file data",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-8 space-y-8">
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
            {filesLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : importedFiles?.map((file) => (
              <TableRow key={file.import_batch_id}>
                <TableCell>{file.file_name}</TableCell>
                <TableCell>{format(new Date(file.created_at), 'PPp')}</TableCell>
                <TableCell>{file.record_count}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteFile(file.import_batch_id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Raw Data Entries</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date Imported</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Item ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Impressions</TableHead>
                <TableHead>Page Views</TableHead>
                <TableHead>Sales</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : rawData?.map((entry) => (
                <TableRow key={`${entry.ebay_item_id}-${entry.created_at}`}>
                  <TableCell>{format(new Date(entry.created_at), 'PPp')}</TableCell>
                  <TableCell>{entry.file_name}</TableCell>
                  <TableCell>{entry.ebay_item_id}</TableCell>
                  <TableCell>{entry.listing_title}</TableCell>
                  <TableCell>{format(new Date(entry.data_start_date), 'PP')}</TableCell>
                  <TableCell>{format(new Date(entry.data_end_date), 'PP')}</TableCell>
                  <TableCell>{entry.total_impressions_ebay}</TableCell>
                  <TableCell>{entry.total_page_views}</TableCell>
                  <TableCell>{entry.quantity_sold}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default RawDataPage;
