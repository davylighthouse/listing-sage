import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProductListing } from "@/types/product";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ProductDashboard = () => {
  const { productId } = useParams();

  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      if (!productId) throw new Error("No product ID provided");

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!productId,
  });

  const { data: listings, isLoading: isLoadingListings } = useQuery({
    queryKey: ["product-listings", productId],
    queryFn: async () => {
      if (!productId) throw new Error("No product ID provided");

      const { data: listingsData, error: listingsError } = await supabase
        .from("product_listings")
        .select(`
          id,
          product_id,
          ebay_item_id,
          created_at,
          ebay_listing:ebay_listings!inner(
            listing_title,
            ebay_item_id,
            total_impressions_ebay,
            total_page_views,
            quantity_sold,
            click_through_rate
          )
        `)
        .eq("product_id", productId);

      if (listingsError) throw listingsError;

      return listingsData as unknown as ProductListing[];
    },
    enabled: !!productId,
  });

  const totalImpressions = listings?.reduce(
    (sum, listing) => sum + (listing.ebay_listings?.total_impressions_ebay || 0),
    0
  );

  const totalPageViews = listings?.reduce(
    (sum, listing) => sum + (listing.ebay_listings?.total_page_views || 0),
    0
  );

  const totalSales = listings?.reduce(
    (sum, listing) => sum + (listing.ebay_listings?.quantity_sold || 0),
    0
  );

  const avgCTR =
    listings?.reduce(
      (sum, listing) => sum + (listing.ebay_listings?.click_through_rate || 0),
      0
    ) / (listings?.length || 1);

  if (isLoadingProduct || isLoadingListings) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">{product?.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Impressions</CardTitle>
            <CardDescription>Across all listings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalImpressions?.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Page Views</CardTitle>
            <CardDescription>Across all listings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalPageViews?.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
            <CardDescription>Across all listings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalSales?.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average CTR</CardTitle>
            <CardDescription>Across all listings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{avgCTR?.toFixed(2)}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Associated Listings</h2>
        {listings?.map((listing) => (
          <Card key={listing.ebay_item_id}>
            <CardHeader>
              <CardTitle>{listing.ebay_listings.listing_title}</CardTitle>
              <CardDescription>{listing.ebay_item_id}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Impressions</p>
                  <p className="font-medium">
                    {listing.ebay_listings.total_impressions_ebay?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Page Views</p>
                  <p className="font-medium">
                    {listing.ebay_listings.total_page_views?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sales</p>
                  <p className="font-medium">
                    {listing.ebay_listings.quantity_sold?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">CTR</p>
                  <p className="font-medium">
                    {listing.ebay_listings.click_through_rate?.toFixed(2)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductDashboard;
