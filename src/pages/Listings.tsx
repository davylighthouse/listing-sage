
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ListingSummary {
  ebay_item_id: string;
  listing_title: string;
  total_records: number;
}

const ListingsPage = () => {
  const { toast } = useToast();

  const { data: listings, isLoading } = useQuery({
    queryKey: ["listings-summary"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ebay_listings")
        .select("ebay_item_id, listing_title")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load listings",
          variant: "destructive",
        });
        throw error;
      }

      // Group by ebay_item_id and get latest listing_title
      const uniqueListings = data.reduce((acc: Record<string, ListingSummary>, curr) => {
        if (!acc[curr.ebay_item_id]) {
          acc[curr.ebay_item_id] = {
            ebay_item_id: curr.ebay_item_id,
            listing_title: curr.listing_title,
            total_records: 1,
          };
        } else {
          acc[curr.ebay_item_id].total_records++;
        }
        return acc;
      }, {});

      return Object.values(uniqueListings);
    },
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="h-32 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">eBay Listings Database</h1>
      <div className="grid gap-4">
        {listings?.map((listing) => (
          <div
            key={listing.ebay_item_id}
            className="bg-white p-4 rounded-lg border shadow-sm flex items-center justify-between"
          >
            <div className="flex-1">
              <div className="font-medium">{listing.ebay_item_id}</div>
              <div className="text-sm text-gray-500">{listing.listing_title}</div>
              <div className="text-xs text-gray-400 mt-1">
                {listing.total_records} data points
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              asChild
            >
              <Link to={`/listings/${listing.ebay_item_id}`}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListingsPage;
