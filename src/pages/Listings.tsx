import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Eye, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export interface ListingSummary {
  ebay_item_id: string;
  listing_title: string;
  total_records: number;
  image_url?: string;
}

const ListingsPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const { data: listings, isLoading, refetch } = useQuery({
    queryKey: ["listings-summary", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("ebay_listings")
        .select("ebay_item_id, listing_title, image_url")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching listings:", error);
        toast({
          title: "Error",
          description: "Failed to load listings",
          variant: "destructive",
        });
        throw error;
      }

      console.log("Fetched listings:", data);

      // Group by ebay_item_id and get latest listing_title
      const uniqueListings = data.reduce((acc: Record<string, ListingSummary>, curr) => {
        if (!acc[curr.ebay_item_id]) {
          acc[curr.ebay_item_id] = {
            ebay_item_id: curr.ebay_item_id,
            listing_title: curr.listing_title,
            image_url: curr.image_url,
            total_records: 1,
          };
        } else {
          acc[curr.ebay_item_id].total_records++;
        }
        return acc;
      }, {});

      return Object.values(uniqueListings);
    },
    enabled: !!user?.id,
  });

  const handleImageUpload = async (file: File, itemId: string) => {
    try {
      setUploadingId(itemId);
      const fileExt = file.name.split('.').pop();
      const filePath = `${itemId}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('product_images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product_images')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('ebay_listings')
        .update({ image_url: publicUrl })
        .eq('ebay_item_id', itemId);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });

      refetch();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploadingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="h-32 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!listings?.length) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">eBay Listings Database</h1>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No listings found</p>
          <Button asChild>
            <Link to="/upload">Upload Listings</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">eBay Listings Database</h1>
        <Button asChild>
          <Link to="/upload">Upload More Listings</Link>
        </Button>
      </div>
      <div className="grid gap-4">
        {listings.map((listing) => (
          <div
            key={listing.ebay_item_id}
            className="bg-white p-4 rounded-lg border shadow-sm flex items-center gap-4"
          >
            <div 
              className="relative w-24 h-24 rounded-lg border bg-gray-50 flex items-center justify-center overflow-hidden cursor-pointer group"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    handleImageUpload(file, listing.ebay_item_id);
                  }
                };
                input.click();
              }}
            >
              {listing.image_url ? (
                <img 
                  src={listing.image_url} 
                  alt={listing.listing_title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Upload className="w-6 h-6 text-gray-400" />
              )}
              {uploadingId === listing.ebay_item_id && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Upload className="w-6 h-6 text-white" />
              </div>
            </div>
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
