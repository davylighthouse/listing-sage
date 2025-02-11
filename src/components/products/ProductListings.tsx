
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { ProductListing } from "@/types/product";

interface ProductListingsProps {
  listings: ProductListing[];
}

const ProductListings = ({ listings }: ProductListingsProps) => {
  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="text-sm font-medium mb-2">Associated Listings:</h3>
      <div className="space-y-2">
        {listings.map((listing) => (
          <div
            key={listing.ebay_item_id}
            className="text-sm text-gray-600 flex items-center justify-between"
          >
            <span>
              {listing.ebay_item_id} - {listing.ebay_listings.listing_title}
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
  );
};

export default ProductListings;
