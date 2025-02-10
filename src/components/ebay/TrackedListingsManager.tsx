
import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { TrackedListing } from "@/types/ebay";
import { useAuth } from "@/hooks/useAuth";

export const TrackedListingsManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [listings, setListings] = useState<TrackedListing[]>([]);
  const [newItemId, setNewItemId] = useState("");

  useEffect(() => {
    if (user?.id) {
      loadListings();
    }
  }, [user?.id]);

  const loadListings = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from("ebay_tracked_listings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setListings(data || []);
    } catch (error) {
      console.error('Error loading listings:', error);
      toast({
        title: "Error",
        description: "Failed to load tracked listings",
        variant: "destructive",
      });
    }
  };

  const addListing = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to add listings",
        variant: "destructive",
      });
      return;
    }

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
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setListings([data, ...listings]);
      setNewItemId("");
      
      toast({
        title: "Success",
        description: "Listing added for tracking",
      });
    } catch (error) {
      console.error('Error adding listing:', error);
      toast({
        title: "Error",
        description: "Failed to add listing",
        variant: "destructive",
      });
    }
  };

  const deleteListing = async (id: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from("ebay_tracked_listings")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      setListings(listings.filter(l => l.id !== id));
      
      toast({
        title: "Success",
        description: "Listing removed from tracking",
      });
    } catch (error) {
      console.error('Error deleting listing:', error);
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
