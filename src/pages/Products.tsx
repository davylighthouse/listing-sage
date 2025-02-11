
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Product, ProductListing, AvailableListing } from "@/types/product";
import ProductCard from "@/components/products/ProductCard";
import ProductFormDialog from "@/components/products/ProductFormDialog";
import AddListingsDialog from "@/components/products/AddListingsDialog";

const ProductsPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [listingDialogOpen, setListingDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data: products, refetch } = useQuery({
    queryKey: ["products", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        });
        throw error;
      }

      return data as Product[];
    },
    enabled: !!user?.id,
  });

  const { data: availableListings } = useQuery({
    queryKey: ["available-listings", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("ebay_listings")
        .select("ebay_item_id, listing_title")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const uniqueListings = data.reduce((acc: Record<string, AvailableListing>, curr) => {
        if (!acc[curr.ebay_item_id]) {
          acc[curr.ebay_item_id] = {
            ebay_item_id: curr.ebay_item_id,
            listing_title: curr.listing_title,
          };
        }
        return acc;
      }, {});

      return Object.values(uniqueListings);
    },
    enabled: !!user?.id,
  });

  const { data: productListings, refetch: refetchProductListings } = useQuery({
    queryKey: ["product-listings", selectedProduct?.id],
    queryFn: async () => {
      if (!selectedProduct?.id) return [];

      // First get the product listings and their basic info
      const { data: listingsData, error: listingsError } = await supabase
        .from("product_listings")
        .select(`
          *,
          ebay_listing:ebay_listings!inner(
            listing_title,
            ebay_item_id
          )
        `)
        .eq("product_id", selectedProduct.id);

      if (listingsError) throw listingsError;

      // Then get the aggregated metrics for each listing
      const listingsWithMetrics = await Promise.all(
        listingsData.map(async (listing) => {
          const { data: metricsData, error: metricsError } = await supabase
            .from("ebay_listing_history")
            .select("*")
            .eq("ebay_item_id", listing.ebay_item_id)
            .order("data_end_date", { ascending: false });

          if (metricsError) throw metricsError;

          // Calculate totals and averages
          const metrics = metricsData.reduce((acc, curr) => ({
            total_impressions_ebay: acc.total_impressions_ebay + (curr.total_impressions_ebay || 0),
            total_page_views: acc.total_page_views + (curr.total_page_views || 0),
            quantity_sold: acc.quantity_sold + (curr.quantity_sold || 0),
            click_through_rate: acc.click_through_rate + (curr.click_through_rate || 0),
            count: acc.count + 1
          }), {
            total_impressions_ebay: 0,
            total_page_views: 0,
            quantity_sold: 0,
            click_through_rate: 0,
            count: 0
          });

          return {
            ...listing,
            ebay_listings: {
              ...listing.ebay_listing,
              total_impressions_ebay: metrics.total_impressions_ebay,
              total_page_views: metrics.total_page_views,
              quantity_sold: metrics.quantity_sold,
              click_through_rate: metrics.count > 0 ? metrics.click_through_rate / metrics.count : 0
            }
          };
        })
      );

      return listingsWithMetrics as ProductListing[];
    },
    enabled: !!selectedProduct?.id,
  });

  const handleAddListings = async (selectedListings: string[]) => {
    if (!selectedProduct?.id || !user?.id || selectedListings.length === 0) return;

    try {
      const { error } = await supabase
        .from("product_listings")
        .insert(
          selectedListings.map(ebayItemId => ({
            product_id: selectedProduct.id,
            ebay_item_id: ebayItemId,
          }))
        );

      if (error) throw error;

      toast({
        title: "Success",
        description: `${selectedListings.length} listing(s) added to product successfully`,
      });
      refetchProductListings();
      setListingDialogOpen(false);
    } catch (error) {
      console.error("Error adding listings to product:", error);
      toast({
        title: "Error",
        description: "Failed to add listings to product",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <ProductFormDialog
          open={open}
          onOpenChange={setOpen}
          onSuccess={refetch}
        />
      </div>

      <div className="grid gap-4">
        {products?.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            productListings={selectedProduct?.id === product.id ? productListings : undefined}
            selectedProductId={selectedProduct?.id}
            onAddListing={(product) => {
              setSelectedProduct(product);
              setListingDialogOpen(true);
            }}
          />
        ))}
      </div>

      <AddListingsDialog
        open={listingDialogOpen}
        onOpenChange={setListingDialogOpen}
        selectedProduct={selectedProduct}
        availableListings={availableListings}
        onAddListings={handleAddListings}
      />
    </div>
  );
};

export default ProductsPage;
