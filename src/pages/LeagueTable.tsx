
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
import { LeagueTableEntry } from "@/types/listing";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const LeagueTable = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rank_by_sales");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [timeframe, setTimeframe] = useState("week");
  const [rankCriteria, setRankCriteria] = useState("quantity_sold");

  const { data: listings, isLoading } = useQuery({
    queryKey: ["leagueTable", sortBy, sortOrder, timeframe, rankCriteria, user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");

      // Get the latest metrics for each listing
      const { data: metrics, error } = await supabase
        .from("ebay_listing_history")
        .select(`
          id,
          ebay_item_id,
          listing_title,
          quantity_sold,
          total_impressions_ebay,
          click_through_rate,
          total_page_views,
          sales_conversion_rate,
          page_views_promoted_ebay,
          page_views_promoted_outside_ebay,
          rank_by_sales,
          previous_rank,
          rank_change,
          data_end_date
        `)
        .eq('user_id', user.id)
        .order('data_end_date', { ascending: false });

      if (error) {
        console.error("Error fetching metrics:", error);
        toast({
          title: "Error",
          description: "Failed to load league table data",
          variant: "destructive",
        });
        throw error;
      }

      // Group by ebay_item_id and take the latest entry for each
      const latestMetrics = metrics.reduce((acc: Record<string, any>, curr) => {
        if (!acc[curr.ebay_item_id] || 
            new Date(curr.data_end_date) > new Date(acc[curr.ebay_item_id].data_end_date)) {
          acc[curr.ebay_item_id] = curr;
        }
        return acc;
      }, {});

      // Convert to array and sort by the selected criteria
      const sortedMetrics = Object.values(latestMetrics)
        .sort((a: any, b: any) => {
          const aValue = a[rankCriteria] || 0;
          const bValue = b[rankCriteria] || 0;
          return sortOrder === "desc" ? bValue - aValue : aValue - bValue;
        })
        .map((metric: any, index: number) => ({
          ...metric,
          rank_by_sales: index + 1,
          previous_rank: metric.previous_rank || index + 1,
          rank_change: metric.previous_rank ? (index + 1) - metric.previous_rank : 0
        }));

      return sortedMetrics as LeagueTableEntry[];
    },
    enabled: !!user?.id,
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
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Rank</TableHead>
              <TableHead className="text-center">Change</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="text-center">Item ID</TableHead>
              <TableHead className="text-center">Quantity Sold</TableHead>
              <TableHead className="text-center">Impressions</TableHead>
              <TableHead className="text-center">CTR</TableHead>
              <TableHead className="text-center">Page Views</TableHead>
              <TableHead className="text-center">Conv. Rate</TableHead>
              <TableHead className="text-center">Promoted Views (eBay)</TableHead>
              <TableHead className="text-center">Promoted Views (External)</TableHead>
              <TableHead className="text-center">Actions</TableHead>
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
                <TableCell className="text-center">{getRankDisplay(index + 1)}</TableCell>
                <TableCell className="flex items-center justify-center gap-1">
                  {getRankChangeIcon(listing.rank_change)}
                  {listing.rank_change ? Math.abs(listing.rank_change) : "-"}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {listing.listing_title}
                </TableCell>
                <TableCell className="text-center">{listing.ebay_item_id}</TableCell>
                <TableCell className="text-center">{formatValue(listing.quantity_sold)}</TableCell>
                <TableCell className="text-center">{formatValue(listing.total_impressions_ebay)}</TableCell>
                <TableCell className="text-center">{formatValue(listing.click_through_rate, "percentage")}</TableCell>
                <TableCell className="text-center">{formatValue(listing.total_page_views)}</TableCell>
                <TableCell className="text-center">
                  {formatValue(listing.sales_conversion_rate, "percentage")}
                </TableCell>
                <TableCell className="text-center">{formatValue(listing.page_views_promoted_ebay)}</TableCell>
                <TableCell className="text-center">
                  {formatValue(listing.page_views_promoted_outside_ebay)}
                </TableCell>
                <TableCell className="text-center">
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
