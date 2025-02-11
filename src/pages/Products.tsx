
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Upload, Eye, Plus } from "lucide-react";
import type { ListingSummary } from "./Listings";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  image_url?: string;
}

interface ProductListing {
  ebay_item_id: string;
  listing_title: string;
}

const ProductsPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [listingDialogOpen, setListingDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    image_url: "",
  });

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

      // Group by ebay_item_id to get unique listings
      const uniqueListings = data.reduce((acc: Record<string, ProductListing>, curr) => {
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
          ebay_item_id,
          ebay_listings!inner(listing_title)
        `)
        .eq("product_id", selectedProduct.id);

      if (error) throw error;

      return data.map(item => ({
        ebay_item_id: item.ebay_item_id,
        listing_title: item.ebay_listings.listing_title
      }));
    },
    enabled: !!selectedProduct?.id,
  });

  const handleImageUpload = async (file: File) => {
    try {
      setUploadingImage(true);
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('product_images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product_images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from("products")
        .insert({
          ...formData,
          user_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product created successfully",
      });
      setOpen(false);
      setFormData({ name: "", sku: "", category: "", image_url: "" });
      refetch();
    } catch (error) {
      console.error("Error creating product:", error);
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
    }
  };

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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, sku: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, category: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Image</Label>
                <div
                  className="relative w-full h-32 rounded-lg border bg-gray-50 flex items-center justify-center overflow-hidden cursor-pointer group"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        handleImageUpload(file);
                      }
                    };
                    input.click();
                  }}
                >
                  {formData.image_url ? (
                    <img
                      src={formData.image_url}
                      alt="Product"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Upload className="w-6 h-6 text-gray-400" />
                  )}
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <Button type="submit" className="w-full">
                Create Product
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {products?.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 rounded-lg border shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-lg border bg-gray-50 flex items-center justify-center overflow-hidden">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Upload className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium">{product.name}</div>
                {product.sku && (
                  <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                )}
                {product.category && (
                  <div className="text-xs text-gray-400 mt-1">
                    Category: {product.category}
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedProduct(product);
                  setListingDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Listing
              </Button>
            </div>

            {/* Display associated listings */}
            {selectedProduct?.id === product.id && productListings && productListings.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <h3 className="text-sm font-medium mb-2">Associated Listings:</h3>
                <div className="space-y-2">
                  {productListings.map((listing) => (
                    <div
                      key={listing.ebay_item_id}
                      className="text-sm text-gray-600 flex items-center justify-between"
                    >
                      <span>
                        {listing.ebay_item_id} - {listing.listing_title}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <a href={`/listings/${listing.ebay_item_id}`} target="_blank" rel="noopener noreferrer">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
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
