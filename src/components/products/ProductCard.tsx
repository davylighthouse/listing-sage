
import { Button } from "@/components/ui/button";
import { Upload, Plus } from "lucide-react";
import { Product, ProductListing } from "@/types/product";
import ProductListings from "./ProductListings";

interface ProductCardProps {
  product: Product;
  productListings: ProductListing[] | undefined;
  selectedProductId: string | null;
  onAddListing: (product: Product) => void;
}

const ProductCard = ({ 
  product, 
  productListings, 
  selectedProductId,
  onAddListing 
}: ProductCardProps) => {
  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
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
          onClick={() => onAddListing(product)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Listings
        </Button>
      </div>

      {selectedProductId === product.id && productListings && productListings.length > 0 && (
        <ProductListings listings={productListings} />
      )}
    </div>
  );
};

export default ProductCard;
