
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product, AvailableListing } from "@/types/product";
import { useState } from "react";

interface AddListingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProduct: Product | null;
  availableListings: AvailableListing[] | undefined;
  onAddListings: (listings: string[]) => void;
}

const AddListingsDialog = ({
  open,
  onOpenChange,
  selectedProduct,
  availableListings,
  onAddListings,
}: AddListingsDialogProps) => {
  const [selectedListings, setSelectedListings] = useState<string[]>([]);

  const toggleListingSelection = (ebayItemId: string) => {
    setSelectedListings(prev =>
      prev.includes(ebayItemId)
        ? prev.filter(id => id !== ebayItemId)
        : [...prev, ebayItemId]
    );
  };

  const handleAddListings = () => {
    onAddListings(selectedListings);
    setSelectedListings([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Listings to {selectedProduct?.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {selectedListings.length} listing(s) selected
            </div>
            <Button
              onClick={handleAddListings}
              disabled={selectedListings.length === 0}
            >
              Add Selected Listings
            </Button>
          </div>
          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {availableListings?.map((listing) => (
              <div
                key={listing.ebay_item_id}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedListings.includes(listing.ebay_item_id)
                    ? "bg-primary/10"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => toggleListingSelection(listing.ebay_item_id)}
              >
                <div>
                  <div className="font-medium">{listing.ebay_item_id}</div>
                  <div className="text-sm text-gray-500">{listing.listing_title}</div>
                </div>
                <div className="w-5 h-5 rounded border flex items-center justify-center">
                  {selectedListings.includes(listing.ebay_item_id) && (
                    <div className="w-3 h-3 bg-primary rounded-sm" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddListingsDialog;
