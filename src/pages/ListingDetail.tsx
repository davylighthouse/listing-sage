
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ListingDetail = () => {
  const { itemId } = useParams();
  const { toast } = useToast();

  const { data: listingData, isLoading } = useQuery({
    queryKey: ["listing-detail", itemId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ebay_listings")
        .select("*")
        .eq("ebay_item_id", itemId)
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load listing details",
          variant: "destructive",
        });
        throw error;
      }

      return data;
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

  if (!listingData?.length) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold">No data found</h2>
          <p className="text-gray-500">This listing has no data points yet.</p>
        </div>
      </div>
    );
  }

  const latestData = listingData[0];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">{latestData.listing_title}</h1>
      <p className="text-gray-500 mb-6">Item ID: {latestData.ebay_item_id}</p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-medium mb-2">Performance Metrics</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Impressions</span>
              <span>{latestData.total_impressions_ebay}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Click Through Rate</span>
              <span>{latestData.click_through_rate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Quantity Sold</span>
              <span>{latestData.quantity_sold}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-medium mb-2">Search Performance</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Top 20 Search Promoted</span>
              <span>{latestData.top_20_search_slot_promoted_impressions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Top 20 Search Organic</span>
              <span>{latestData.top_20_search_slot_organic_impressions}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-medium mb-2">Page Views</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Views</span>
              <span>{latestData.total_page_views}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Organic eBay Views</span>
              <span>{latestData.page_views_organic_ebay}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Promoted eBay Views</span>
              <span>{latestData.page_views_promoted_ebay}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
