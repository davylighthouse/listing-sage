
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ListingMetrics } from "@/types/listing";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const [data, setData] = useState<ListingMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date(),
  });
  const [sortMetric, setSortMetric] = useState("performance_score");
  const { user } = useAuth();

  const formatDate = (date: string | Date) => {
    return format(new Date(date), 'dd/MM/yyyy');
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      try {
        const { data: listings, error } = await supabase
          .from('ebay_listings')
          .select('*')
          .eq('user_id', user.id)
          .gte('data_start_date', dateRange.start.toISOString())
          .lte('data_end_date', dateRange.end.toISOString())
          .order(sortMetric, { ascending: false });

        if (error) {
          throw error;
        }

        setData(listings || []);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id, dateRange, sortMetric]);

  const calculateAverages = () => {
    if (!data.length) return { 
      avg_ctr: 0, 
      avg_conversion: 0, 
      total_impressions: 0,
      total_page_views: 0,
      total_sales: 0,
      total_revenue: 0,
      organic_impressions: 0,
      promoted_impressions: 0
    };
    
    return data.reduce(
      (acc, item) => ({
        avg_ctr: acc.avg_ctr + item.click_through_rate,
        avg_conversion: acc.avg_conversion + item.sales_conversion_rate,
        total_impressions: acc.total_impressions + item.total_impressions_ebay,
        total_page_views: acc.total_page_views + item.total_page_views,
        total_sales: acc.total_sales + item.quantity_sold,
        total_revenue: acc.total_revenue + (item.revenue || 0),
        organic_impressions: acc.organic_impressions + item.total_organic_impressions_ebay,
        promoted_impressions: acc.promoted_impressions + item.total_promoted_listings_impressions,
      }),
      { 
        avg_ctr: 0, 
        avg_conversion: 0, 
        total_impressions: 0,
        total_page_views: 0,
        total_sales: 0,
        total_revenue: 0,
        organic_impressions: 0,
        promoted_impressions: 0
      }
    );
  };

  const averages = calculateAverages();
  
  const impressionsSplit = [
    {
      name: "Organic",
      value: averages.organic_impressions,
    },
    {
      name: "Promoted",
      value: averages.promoted_impressions,
    },
  ];

  const COLORS = ["#3b82f6", "#10b981"];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Performance Dashboard</h1>
        <div className="flex gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.start ? (
                  formatDate(dateRange.start)
                ) : (
                  <span>Pick a date</span>
                )}
                {" - "}
                {dateRange.end ? (
                  formatDate(dateRange.end)
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.start}
                selected={{
                  from: dateRange.start,
                  to: dateRange.end,
                }}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    setDateRange({ start: range.from, end: range.to });
                  }
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          <Select
            value={sortMetric}
            onValueChange={(value) => setSortMetric(value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="performance_score">Performance Score</SelectItem>
              <SelectItem value="quantity_sold">Sales Volume</SelectItem>
              <SelectItem value="revenue">Revenue</SelectItem>
              <SelectItem value="click_through_rate">Click-through Rate</SelectItem>
              <SelectItem value="sales_conversion_rate">Conversion Rate</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Avg Click-Through Rate</h3>
          <p className="text-2xl font-bold">
            {(averages.avg_ctr / (data.length || 1)).toFixed(4)}%
          </p>
          <div className="flex items-center mt-2 text-sm">
            {averages.avg_ctr > 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={averages.avg_ctr > 0 ? "text-green-500" : "text-red-500"}>
              {Math.abs(averages.avg_ctr).toFixed(2)}% vs previous
            </span>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-bold">
            ${averages.total_revenue.toLocaleString()}
          </p>
          <div className="flex items-center mt-2 text-sm">
            {averages.total_revenue > 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={averages.total_revenue > 0 ? "text-green-500" : "text-red-500"}>
              {Math.abs(averages.total_revenue).toFixed(2)}% vs previous
            </span>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
          <p className="text-2xl font-bold">
            {averages.total_sales.toLocaleString()}
          </p>
          <div className="flex items-center mt-2 text-sm">
            {averages.total_sales > 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={averages.total_sales > 0 ? "text-green-500" : "text-red-500"}>
              {Math.abs(averages.total_sales).toFixed(2)}% vs previous
            </span>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Avg Conversion Rate</h3>
          <p className="text-2xl font-bold">
            {(averages.avg_conversion / (data.length || 1)).toFixed(2)}%
          </p>
          <div className="flex items-center mt-2 text-sm">
            {averages.avg_conversion > 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={averages.avg_conversion > 0 ? "text-green-500" : "text-red-500"}>
              {Math.abs(averages.avg_conversion).toFixed(2)}% vs previous
            </span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Impressions by Listing</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="listing_title"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total_impressions_ebay" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Organic vs Promoted Impressions</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={impressionsSplit}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {impressionsSplit.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 col-span-2">
          <h3 className="text-lg font-medium mb-4">Performance Score by Listing</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="listing_title"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="performance_score"
                  stroke="#10b981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {data.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No data available. Please upload your eBay listing data first.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

