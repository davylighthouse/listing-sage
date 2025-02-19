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
        .select()
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

      return data as AvailableListing[];
    },
    enabled: !!user?.id,
  });

  const { data: productListings, refetch: refetchProductListings } = useQuery({
    queryKey: ["product-listings", selectedProduct?.id],
    queryFn: async () => {
      if (!selectedProduct?.id) return [];

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
        .eq("product_id", selectedProduct.id);

      if (listingsError) throw listingsError;

      return listingsData as unknown as ProductListing[];
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
