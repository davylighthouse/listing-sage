
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const ListingDetail = () => {
  const { itemId } = useParams();
  const { toast } = useToast();

  const { data: listingData, isLoading } = useQuery({
    queryKey: ["listing-detail", itemId],
    queryFn: async () => {
      // First get the base listing info
      const { data: listing, error: listingError } = await supabase
        .from("ebay_listings")
        .select("*")
        .eq("ebay_item_id", itemId)
        .single();

      if (listingError) {
        toast({
          title: "Error",
          description: "Failed to load listing details",
          variant: "destructive",
        });
        throw listingError;
      }

      // Then get the latest metrics
      const { data: metrics, error: metricsError } = await supabase
        .from("ebay_listing_history")
        .select("*")
        .eq("ebay_item_id", itemId)
        .order("data_end_date", { ascending: false })
        .limit(1)
        .single();

      if (metricsError) {
        toast({
          title: "Error",
          description: "Failed to load listing metrics",
          variant: "destructive",
        });
        throw metricsError;
      }

      return { ...listing, ...metrics };
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

  if (!listingData) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold">No data found</h2>
          <p className="text-gray-500">This listing has no data points yet.</p>
        </div>
      </div>
    );
  }

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy');
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString('en-US');
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">{listingData.listing_title}</h1>
      <p className="text-gray-500 mb-6">Item ID: {listingData.ebay_item_id}</p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-medium mb-2">Performance Metrics</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Impressions</span>
              <span>{formatNumber(listingData.total_impressions_ebay)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Click Through Rate</span>
              <span>{formatPercentage(listingData.click_through_rate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Quantity Sold</span>
              <span>{formatNumber(listingData.quantity_sold)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-medium mb-2">Search Performance</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Promoted Impressions</span>
              <span>{formatNumber(listingData.total_promoted_listings_impressions || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Organic Impressions</span>
              <span>{formatNumber(listingData.total_organic_impressions_ebay || 0)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-medium mb-2">Page Views</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Views</span>
              <span>{formatNumber(listingData.total_page_views)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Organic eBay Views</span>
              <span>{formatNumber(listingData.page_views_organic_ebay || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Promoted eBay Views</span>
              <span>{formatNumber(listingData.page_views_promoted_ebay || 0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
