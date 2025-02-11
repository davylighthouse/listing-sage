
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ListingMetrics } from "@/types/listing";
import { formatMetricValue, getTopListings } from "@/lib/utils";

interface TopListingsTableProps {
  data: ListingMetrics[];
  rankCriteria: string;
}

export const TopListingsTable = ({ data, rankCriteria }: TopListingsTableProps) => {
  const topListings = getTopListings(data, rankCriteria);

  const getColumnLabel = (criteria: string): string => {
    switch (criteria) {
      case "quantity_sold":
        return "Sales";
      case "total_impressions_ebay":
        return "Impressions";
      case "click_through_rate":
        return "CTR";
      case "total_page_views":
        return "Page Views";
      case "sales_conversion_rate":
        return "Conversion Rate";
      default:
        return criteria;
    }
  };

  const formatValue = (value: number, criteria: string): string => {
    if (criteria === "click_through_rate" || criteria === "sales_conversion_rate") {
      return formatMetricValue(value, "percentage");
    }
    return formatMetricValue(value);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Top 10 Listings by {getColumnLabel(rankCriteria)}</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Listing Title</TableHead>
              <TableHead className="text-right">{getColumnLabel(rankCriteria)}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topListings.map((listing, index) => (
              <TableRow key={listing.ebay_item_id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{listing.listing_title}</TableCell>
                <TableCell className="text-right">
                  {formatValue(listing[rankCriteria as keyof ListingMetrics] as number, rankCriteria)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
