
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface MappingField {
  key: string;
  label: string;
  type: "text" | "number" | "percentage" | "currency" | "date";
}

const REQUIRED_FIELDS: MappingField[] = [
  { key: "item_id", label: "Item ID", type: "text" },
  { key: "title", label: "Title", type: "text" },
  { key: "start_date", label: "Start Date", type: "date" },
  { key: "end_date", label: "End Date", type: "date" },
  { key: "total_impressions", label: "Total Impressions", type: "number" },
  { key: "ctr", label: "CTR", type: "percentage" },
  { key: "quantity_sold", label: "Quantity Sold", type: "number" },
  { key: "conversion_rate", label: "Conv. Rate", type: "percentage" },
];

export const DataMappingForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);

  useEffect(() => {
    const fetchLatestHeaders = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from('raw_data')
        .select('headers')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching headers:', error);
        toast({
          title: "Error",
          description: "Failed to load column headers",
          variant: "destructive",
        });
        return;
      }

      if (data?.headers) {
        setAvailableColumns(data.headers);
      } else {
        // No data available yet
        setAvailableColumns([]);
        toast({
          title: "No Data",
          description: "Please upload a CSV file first to map columns",
          variant: "default",
        });
      }
    };

    fetchLatestHeaders();
  }, [user?.id, toast]);

  const handleSaveMapping = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to save mappings",
        variant: "destructive",
      });
      return;
    }

    try {
      // First, delete existing mappings for this user
      const { error: deleteError } = await supabase
        .from("column_mappings")
        .delete()
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      // Then insert new mappings
      const { error: insertError } = await supabase
        .from("column_mappings")
        .insert(
          Object.entries(mappings).map(([targetField, sourceColumn]) => ({
            user_id: user.id,
            target_field: targetField,
            source_column: sourceColumn,
            updated_at: new Date().toISOString(),
          }))
        );

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Column mappings saved successfully",
      });
    } catch (error) {
      console.error("Error saving mappings:", error);
      toast({
        title: "Error",
        description: "Failed to save mappings",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Map your CSV columns to the required fields. Select the corresponding column from your data for each field.
          </p>
          
          {REQUIRED_FIELDS.map((field) => (
            <div key={field.key} className="grid grid-cols-2 gap-4 items-center">
              <div>
                <p className="font-medium">{field.label}</p>
                <p className="text-sm text-gray-500">
                  Format: {field.type === "percentage" ? "%" : field.type === "currency" ? "£" : field.type}
                </p>
              </div>
              <Select
                value={mappings[field.key]}
                onValueChange={(value) => setMappings((prev) => ({ ...prev, [field.key]: value }))}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select a column" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-md">
                  {availableColumns.map((column) => (
                    <SelectItem key={column} value={column}>
                      {column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Button onClick={handleSaveMapping}>Save Mappings</Button>
        </div>
      </Card>
    </div>
  );
};
