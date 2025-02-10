
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { TrackedListing } from "@/types/ebay";

export const TrackedListingsManager = () => {
  const { toast } = useToast();
  const [listings, setListings] = useState<TrackedListing[]>([]);
  const [newItemId, setNewItemId] = useState("");

  const addListing = async () => {
    if (!newItemId) {
      toast({
        title: "Error",
        description: "Please enter an eBay item ID",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("ebay_tracked_listings")
        .insert({
          ebay_item_id: newItemId,
        })
        .select()
        .single();

      if (error) throw error;

      setListings([...listings, data]);
      setNewItemId("");
      
      toast({
        title: "Success",
        description: "Listing added for tracking",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add listing",
        variant: "destructive",
      });
    }
  };

  const deleteListing = async (id: string) => {
    try {
      const { error } = await supabase
        .from("ebay_tracked_listings")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setListings(listings.filter(l => l.id !== id));
      
      toast({
        title: "Success",
        description: "Listing removed from tracking",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove listing",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Tracked eBay Listings</h3>
      
      <div className="flex gap-4">
        <Input
          placeholder="eBay Item ID (e.g., 154434252000)"
          value={newItemId}
          onChange={(e) => setNewItemId(e.target.value)}
        />
        <Button onClick={addListing}>
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>

      <div className="space-y-2">
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="flex items-center justify-between p-3 bg-white rounded-lg border"
          >
            <div>
              <span className="font-medium">{listing.ebay_item_id}</span>
              {listing.listing_title && (
                <span className="ml-2 text-gray-500">{listing.listing_title}</span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteListing(listing.id)}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
