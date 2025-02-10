
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { ColumnMapping } from "@/types/ebay";

export const ColumnMappingsManager = () => {
  const { toast } = useToast();
  const [mappings, setMappings] = useState<ColumnMapping[]>([]);
  const [newMapping, setNewMapping] = useState({ name: "", position: "" });

  const addMapping = async () => {
    if (!newMapping.name || !newMapping.position) {
      toast({
        title: "Error",
        description: "Please fill in both column name and position",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("ebay_column_mappings")
        .insert({
          column_name: newMapping.name,
          column_position: parseInt(newMapping.position),
        })
        .select()
        .single();

      if (error) throw error;

      setMappings([...mappings, data]);
      setNewMapping({ name: "", position: "" });
      
      toast({
        title: "Success",
        description: "Column mapping added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add column mapping",
        variant: "destructive",
      });
    }
  };

  const deleteMapping = async (id: string) => {
    try {
      const { error } = await supabase
        .from("ebay_column_mappings")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setMappings(mappings.filter(m => m.id !== id));
      
      toast({
        title: "Success",
        description: "Column mapping deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete column mapping",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Column Mappings</h3>
      
      <div className="flex gap-4">
        <Input
          placeholder="Column Name"
          value={newMapping.name}
          onChange={(e) => setNewMapping({ ...newMapping, name: e.target.value })}
        />
        <Input
          placeholder="Position"
          type="number"
          value={newMapping.position}
          onChange={(e) => setNewMapping({ ...newMapping, position: e.target.value })}
        />
        <Button onClick={addMapping}>
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>

      <div className="space-y-2">
        {mappings.map((mapping) => (
          <div
            key={mapping.id}
            className="flex items-center justify-between p-3 bg-white rounded-lg border"
          >
            <div>
              <span className="font-medium">{mapping.column_name}</span>
              <span className="ml-2 text-gray-500">Position: {mapping.column_position}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteMapping(mapping.id)}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
