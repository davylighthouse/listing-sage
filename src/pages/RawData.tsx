
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";

interface ImportedFile {
  import_batch_id: string;
  file_name: string;
  created_at: string;
  record_count: number;
}

const formatDate = (date: string) => {
  return format(new Date(date), 'dd-MM-yyyy');
};

const formatPercentage = (value: number) => {
  return `${(value * 100).toFixed(2)}%`;
};

const formatNumber = (value: number) => {
  return value.toLocaleString('en-US');
};

const RawDataPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);

  // Query for imported files summary
  const { data: importedFiles, isLoading: filesLoading, error: filesError, refetch: refetchFiles } = useQuery({
    queryKey: ["imported-files", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");
      console.log("Fetching files for user:", user.id);

      const { data, error } = await supabase
        .from('ebay_listings')
        .select('import_batch_id, file_name, created_at')
        .eq('user_id', user.id)
        .filter('import_batch_id', 'not.is', null)
        .filter('file_name', 'not.is', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching files:", error);
        throw error;
      }

      console.log("Received files data:", data);

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
  const { data: rawData, isLoading: dataLoading, error: dataError, refetch: refetchData } = useQuery({
    queryKey: ["raw-data", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");
      console.log("Fetching raw data for user:", user.id);

      const { data, error } = await supabase
        .from('ebay_listings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching raw data:", error);
        throw error;
      }

      console.log("Received raw data:", data);
      return data;
    },
    enabled: !!user?.id,
  });

  // Display any errors
  if (filesError || dataError) {
    const error = filesError || dataError;
    console.error("Query error:", error);
    toast({
      title: "Error loading data",
      description: error instanceof Error ? error.message : "Failed to load data",
      variant: "destructive",
    });
  }

  const handleDeleteFile = async (batchId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('ebay_listings')
        .delete()
        .eq('user_id', user.id)
        .eq('import_batch_id', batchId);

      if (error) {
        console.error('Error deleting file:', error);
        throw error;
      }

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

  const handleSelectEntry = (id: string) => {
    setSelectedEntries(prev => {
      if (prev.includes(id)) {
        return prev.filter(entryId => entryId !== id);
      }
      return [...prev, id];
    });
  };

  const handleSelectAll = () => {
    if (rawData) {
      if (selectedEntries.length === rawData.length) {
        setSelectedEntries([]);
      } else {
        setSelectedEntries(rawData.map(entry => entry.id));
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (!user?.id || selectedEntries.length === 0) return;

    try {
      const { error } = await supabase
        .from('ebay_listings')
        .delete()
        .eq('user_id', user.id)
        .in('id', selectedEntries);

      if (error) {
        console.error('Error deleting entries:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: `${selectedEntries.length} entries have been deleted`,
      });

      setSelectedEntries([]);
      refetchData();
      refetchFiles();
    } catch (error) {
      console.error('Error deleting entries:', error);
      toast({
        title: "Error",
        description: "Failed to delete entries",
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
            ) : importedFiles?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">No files imported yet</TableCell>
              </TableRow>
            ) : importedFiles?.map((file) => (
              <TableRow key={file.import_batch_id}>
                <TableCell>{file.file_name}</TableCell>
                <TableCell>{format(new Date(file.created_at), 'PPp')}</TableCell>
                <TableCell>{formatNumber(file.record_count)}</TableCell>
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
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Raw Data Entries</h2>
          {selectedEntries.length > 0 && (
            <Button
              variant="destructive"
              onClick={handleDeleteSelected}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected ({selectedEntries.length})
            </Button>
          )}
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={rawData?.length === selectedEntries.length && rawData?.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Date Imported</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Item ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Impressions</TableHead>
                <TableHead>CTR</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Conv. Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataLoading ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : rawData?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center">No data available</TableCell>
                </TableRow>
              ) : rawData?.map((entry) => (
                <TableRow key={`${entry.ebay_item_id}-${entry.created_at}`}>
                  <TableCell>
                    <Checkbox
                      checked={selectedEntries.includes(entry.id)}
                      onCheckedChange={() => handleSelectEntry(entry.id)}
                    />
                  </TableCell>
                  <TableCell>{format(new Date(entry.created_at), 'dd-MM-yyyy')}</TableCell>
                  <TableCell>{entry.file_name}</TableCell>
                  <TableCell>{entry.ebay_item_id}</TableCell>
                  <TableCell>{entry.listing_title}</TableCell>
                  <TableCell>{formatDate(entry.data_start_date)}</TableCell>
                  <TableCell>{formatDate(entry.data_end_date)}</TableCell>
                  <TableCell>{formatNumber(entry.total_impressions_ebay)}</TableCell>
                  <TableCell>{formatPercentage(entry.click_through_rate)}</TableCell>
                  <TableCell>{formatNumber(entry.quantity_sold)}</TableCell>
                  <TableCell>{formatPercentage(entry.sales_conversion_rate)}</TableCell>
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
