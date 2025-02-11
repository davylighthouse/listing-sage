
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

      const { data, error } = await supabase
        .from('ebay_listing_history')
        .select('import_batch_id, file_name, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching files:", error);
        throw error;
      }

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

      return Object.values(filesSummary);
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

      // First get all ebay listings
      const { data: listings, error: listingsError } = await supabase
        .from('ebay_listings')
        .select('*')
        .eq('user_id', user.id);

      if (listingsError) throw listingsError;

      // Then get the history data
      const { data: history, error: historyError } = await supabase
        .from('ebay_listing_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (historyError) throw historyError;

      // Merge the data
      const mergedData = history.map(historyEntry => {
        const listing = listings.find(l => l.ebay_item_id === historyEntry.ebay_item_id);
        return {
          ...historyEntry,
          listing_title: listing?.listing_title || 'Unknown Listing'
        };
      });

      return mergedData;
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
        .from('ebay_listing_history')
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
        .from('ebay_listing_history')
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
