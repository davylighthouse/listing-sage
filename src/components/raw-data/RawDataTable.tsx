import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";

interface RawDataEntry {
  id: string;
  created_at: string;
  file_name: string;
  ebay_item_id: string;
  listing_title: string;
  data_start_date: string;
  data_end_date: string;
  total_impressions_ebay: number;
  click_through_rate: number;
  quantity_sold: number;
  sales_conversion_rate: number;
  top_20_search_slot_promoted_impressions: number;
  change_top_20_search_slot_promoted_impressions: number;
  top_20_search_slot_organic_impressions: number;
  change_top_20_search_slot_impressions: number;
  rest_of_search_slot_impressions: number;
  non_search_promoted_listings_impressions: number;
  change_non_search_promoted_listings_impressions: number;
  non_search_organic_impressions: number;
  change_non_search_organic_impressions: number;
  total_promoted_listings_impressions: number;
  total_organic_impressions_ebay: number;
  total_page_views: number;
  page_views_promoted_ebay: number;
  page_views_promoted_outside_ebay: number;
  page_views_organic_ebay: number;
  page_views_organic_outside_ebay: number;
  import_batch_id: string;
}

interface RawDataTableProps {
  data: RawDataEntry[] | undefined;
  isLoading: boolean;
  selectedEntries: string[];
  onSelectEntry: (id: string) => void;
  onSelectAll: () => void;
  onDeleteSelected: () => void;
}

const formatDate = (date: string) => {
  return format(new Date(date), 'dd/MM/yyyy');
};

const formatPercentage = (value: number) => {
  return `${(value * 100).toFixed(2)}%`;
};

const formatNumber = (value: number) => {
  return value.toLocaleString('en-US');
};

const RawDataTable = ({
  data,
  isLoading,
  selectedEntries,
  onSelectEntry,
  onSelectAll,
  onDeleteSelected
}: RawDataTableProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Raw Data Entries</h2>
        {selectedEntries.length > 0 && (
          <Button
            variant="destructive"
            onClick={onDeleteSelected}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Selected ({selectedEntries.length})
          </Button>
        )}
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={data?.length === selectedEntries.length && data?.length > 0}
                  onCheckedChange={onSelectAll}
                />
              </TableHead>
              <TableHead>Date Imported</TableHead>
              <TableHead>File Name</TableHead>
              <TableHead>Item ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Total Impressions</TableHead>
              <TableHead>CTR</TableHead>
              <TableHead>Quantity Sold</TableHead>
              <TableHead>Conv. Rate</TableHead>
              <TableHead>Top 20 Promoted</TableHead>
              <TableHead>Top 20 Promoted Change</TableHead>
              <TableHead>Top 20 Organic</TableHead>
              <TableHead>Top 20 Organic Change</TableHead>
              <TableHead>Rest of Search</TableHead>
              <TableHead>Non-Search Promoted</TableHead>
              <TableHead>Non-Search Promoted Change</TableHead>
              <TableHead>Non-Search Organic</TableHead>
              <TableHead>Non-Search Organic Change</TableHead>
              <TableHead>Total Promoted</TableHead>
              <TableHead>Total Organic</TableHead>
              <TableHead>Total Page Views</TableHead>
              <TableHead>PV Promoted eBay</TableHead>
              <TableHead>PV Promoted Outside</TableHead>
              <TableHead>PV Organic eBay</TableHead>
              <TableHead>PV Organic Outside</TableHead>
              <TableHead>Import Batch ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={28} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={28} className="text-center">No data available</TableCell>
              </TableRow>
            ) : data?.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedEntries.includes(entry.id)}
                    onCheckedChange={() => onSelectEntry(entry.id)}
                  />
                </TableCell>
                <TableCell>{formatDate(entry.created_at)}</TableCell>
                <TableCell>{entry.file_name}</TableCell>
                <TableCell>{entry.ebay_item_id}</TableCell>
                <TableCell>{entry.listing_title}</TableCell>
                <TableCell>{formatDate(entry.data_start_date)}</TableCell>
                <TableCell>{formatDate(entry.data_end_date)}</TableCell>
                <TableCell>{formatNumber(entry.total_impressions_ebay)}</TableCell>
                <TableCell>{formatPercentage(entry.click_through_rate)}</TableCell>
                <TableCell>{formatNumber(entry.quantity_sold)}</TableCell>
                <TableCell>{formatPercentage(entry.sales_conversion_rate)}</TableCell>
                <TableCell>{formatNumber(entry.top_20_search_slot_promoted_impressions)}</TableCell>
                <TableCell>{formatNumber(entry.change_top_20_search_slot_promoted_impressions)}</TableCell>
                <TableCell>{formatNumber(entry.top_20_search_slot_organic_impressions)}</TableCell>
                <TableCell>{formatNumber(entry.change_top_20_search_slot_impressions)}</TableCell>
                <TableCell>{formatNumber(entry.rest_of_search_slot_impressions)}</TableCell>
                <TableCell>{formatNumber(entry.non_search_promoted_listings_impressions)}</TableCell>
                <TableCell>{formatNumber(entry.change_non_search_promoted_listings_impressions)}</TableCell>
                <TableCell>{formatNumber(entry.non_search_organic_impressions)}</TableCell>
                <TableCell>{formatNumber(entry.change_non_search_organic_impressions)}</TableCell>
                <TableCell>{formatNumber(entry.total_promoted_listings_impressions)}</TableCell>
                <TableCell>{formatNumber(entry.total_organic_impressions_ebay)}</TableCell>
                <TableCell>{formatNumber(entry.total_page_views)}</TableCell>
                <TableCell>{formatNumber(entry.page_views_promoted_ebay)}</TableCell>
                <TableCell>{formatNumber(entry.page_views_promoted_outside_ebay)}</TableCell>
                <TableCell>{formatNumber(entry.page_views_organic_ebay)}</TableCell>
                <TableCell>{formatNumber(entry.page_views_organic_outside_ebay)}</TableCell>
                <TableCell>{entry.import_batch_id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RawDataTable;
