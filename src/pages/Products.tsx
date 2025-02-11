
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Plus } from "lucide-react";
import { Product, ProductListing, AvailableListing } from "@/types/product";
import ProductForm from "@/components/products/ProductForm";
import ProductCard from "@/components/products/ProductCard";

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

      const { data, error } = await supabase
        .from("product_listings")
        .select(`
          *,
          ebay_listings (
            listing_title
          )
        `)
        .eq("product_id", selectedProduct.id);

      if (error) throw error;

      return data as ProductListing[];
    },
    enabled: !!selectedProduct?.id,
  });

  const handleAddListing = async (ebayItemId: string) => {
    if (!selectedProduct?.id || !user?.id) return;

    try {
      const { error } = await supabase
        .from("product_listings")
        .insert({
          product_id: selectedProduct.id,
          ebay_item_id: ebayItemId,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Listing added to product successfully",
      });
      refetchProductListings();
    } catch (error) {
      console.error("Error adding listing to product:", error);
      toast({
        title: "Error",
        description: "Failed to add listing to product",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Product</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <ProductForm onSuccess={refetch} onClose={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
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

      {/* Listing Selection Dialog */}
      <Dialog open={listingDialogOpen} onOpenChange={setListingDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Listing to {selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto">
            {availableListings?.map((listing) => (
              <div
                key={listing.ebay_item_id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="font-medium">{listing.ebay_item_id}</div>
                  <div className="text-sm text-gray-500">{listing.listing_title}</div>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    handleAddListing(listing.ebay_item_id);
                    setListingDialogOpen(false);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsPage;
