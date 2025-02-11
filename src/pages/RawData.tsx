
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import ImportedFilesTable from "@/components/raw-data/ImportedFilesTable";
import RawDataTable from "@/components/raw-data/RawDataTable";

const RawDataPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);

  // Query for imported files summary
  const { data: importedFiles, isLoading: filesLoading, error: filesError, refetch: refetchFiles } = useQuery({
    queryKey: ["imported-files", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.error("User not authenticated");
        throw new Error("User not authenticated");
      }
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

      console.log("Raw files data:", data);

      // Group by import batch and count records
      const filesSummary = data.reduce((acc: Record<string, any>, curr) => {
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

      const result = Object.values(filesSummary);
      console.log("Processed files summary:", result);
      return result;
    },
    enabled: !!user?.id,
  });

  // Query for raw data entries
  const { data: rawData, isLoading: dataLoading, error: dataError, refetch: refetchData } = useQuery({
    queryKey: ["raw-data", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.error("User not authenticated");
        throw new Error("User not authenticated");
      }
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

      console.log("Raw data received:", data);
      if (data) {
        console.log("Sample total_impressions value:", data[0]?.total_impressions_ebay);
      }
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
      console.log("Deleting file with batch ID:", batchId);
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
      refetchData();
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
      console.log("Deleting selected entries:", selectedEntries);
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
      <ImportedFilesTable
        files={importedFiles}
        isLoading={filesLoading}
        onDeleteFile={handleDeleteFile}
      />
      <RawDataTable
        data={rawData}
        isLoading={dataLoading}
        selectedEntries={selectedEntries}
        onSelectEntry={handleSelectEntry}
        onSelectAll={handleSelectAll}
        onDeleteSelected={handleDeleteSelected}
      />
    </div>
  );
};

export default RawDataPage;
