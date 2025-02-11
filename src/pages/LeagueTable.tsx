
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUp, ArrowDown, Minus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LeagueTableEntry {
  id: string;
  rank_by_sales: number;
  previous_rank: number | null;
  rank_change: number | null;
  listing_title: string;
  ebay_item_id: string;
  quantity_sold: number;
  total_impressions_ebay: number;
  click_through_rate: number;
  total_page_views: number;
  sales_conversion_rate: number;
  page_views_promoted_ebay: number;
  page_views_promoted_outside_ebay: number;
}

const LeagueTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rank_by_sales");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [timeframe, setTimeframe] = useState("week");
  const [rankCriteria, setRankCriteria] = useState("quantity_sold");

  const { data: listings, isLoading } = useQuery({
    queryKey: ["leagueTable", sortBy, sortOrder, timeframe, rankCriteria],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ebay_listings")
        .select("*")
        .order(rankCriteria, { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as LeagueTableEntry[];
    },
  });

  const formatValue = (value: number, type: "percentage" | "number" = "number") => {
    if (type === "percentage") {
      return `${(value * 100).toFixed(2)}%`;
    }
    return value.toLocaleString();
  };

  const getRankChangeIcon = (change: number | null) => {
    if (!change || change === 0) return <Minus className="w-4 h-4 text-gray-400" />;
    if (change > 0)
      return <ArrowUp className="w-4 h-4 text-green-500" />;
    return <ArrowDown className="w-4 h-4 text-red-500" />;
  };

  const getRankDisplay = (rank: number) => {
    switch (rank) {
      case 1:
        return "🏆";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return rank;
    }
  };

  const filteredListings = listings?.filter((listing) =>
    listing.listing_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.ebay_item_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">League Table</h1>
      </div>

      <div className="mb-6 flex flex-wrap gap-6 items-end">
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

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Change</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Item ID</TableHead>
              <TableHead>Quantity Sold</TableHead>
              <TableHead>Impressions</TableHead>
              <TableHead>CTR</TableHead>
              <TableHead>Page Views</TableHead>
              <TableHead>Conv. Rate</TableHead>
              <TableHead>Promoted Views (eBay)</TableHead>
              <TableHead>Promoted Views (External)</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={12} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredListings?.map((listing, index) => (
              <TableRow key={listing.id}>
                <TableCell>{getRankDisplay(index + 1)}</TableCell>
                <TableCell className="flex items-center gap-1">
                  {getRankChangeIcon(listing.rank_change)}
                  {listing.rank_change ? Math.abs(listing.rank_change) : "-"}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {listing.listing_title}
                </TableCell>
                <TableCell>{listing.ebay_item_id}</TableCell>
                <TableCell>{formatValue(listing.quantity_sold)}</TableCell>
                <TableCell>{formatValue(listing.total_impressions_ebay)}</TableCell>
                <TableCell>{formatValue(listing.click_through_rate, "percentage")}</TableCell>
                <TableCell>{formatValue(listing.total_page_views)}</TableCell>
                <TableCell>
                  {formatValue(listing.sales_conversion_rate, "percentage")}
                </TableCell>
                <TableCell>{formatValue(listing.page_views_promoted_ebay)}</TableCell>
                <TableCell>
                  {formatValue(listing.page_views_promoted_outside_ebay)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      // Handle analytics view
                    }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LeagueTable;
