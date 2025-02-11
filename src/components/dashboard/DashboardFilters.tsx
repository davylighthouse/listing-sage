
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DashboardFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  rankCriteria: string;
  setRankCriteria: (value: string) => void;
  timeframe: string;
  setTimeframe: (value: string) => void;
}

export const DashboardFilters = ({
  searchTerm,
  setSearchTerm,
  rankCriteria,
  setRankCriteria,
  timeframe,
  setTimeframe,
}: DashboardFiltersProps) => {
  return (
    <div className="flex gap-6 items-end">
      <div className="space-y-2">
        <Input
          placeholder="Search by title or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Ranking Filter</label>
        <Select value={rankCriteria} onValueChange={setRankCriteria}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Rank by" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="quantity_sold">Quantity Sold</SelectItem>
            <SelectItem value="total_impressions_ebay">Impressions</SelectItem>
            <SelectItem value="click_through_rate">CTR</SelectItem>
            <SelectItem value="total_page_views">Page Views</SelectItem>
            <SelectItem value="sales_conversion_rate">Conversion Rate</SelectItem>
            <SelectItem value="page_views_promoted_ebay">Promoted Views (eBay)</SelectItem>
            <SelectItem value="page_views_promoted_outside_ebay">Promoted Views (External)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Time Filter</label>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Timeframe" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="week">Weekly</SelectItem>
            <SelectItem value="month">Monthly</SelectItem>
            <SelectItem value="quarter">Quarterly</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

