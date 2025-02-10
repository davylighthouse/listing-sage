
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ListingMetrics } from "@/types/listing";
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

const Dashboard = () => {
  const [data, setData] = useState<ListingMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: listings, error } = await supabase
          .from('ebay_listings')
          .select('*');

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
  }, []);

  // Calculate averages for KPI cards
  const calculateAverages = () => {
    if (!data.length) return { 
      avg_ctr: 0, 
      avg_conversion: 0, 
      total_impressions: 0,
      total_page_views: 0,
      total_sales: 0,
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
        organic_impressions: acc.organic_impressions + item.total_organic_impressions_ebay,
        promoted_impressions: acc.promoted_impressions + item.total_promoted_listings_impressions,
      }),
      { 
        avg_ctr: 0, 
        avg_conversion: 0, 
        total_impressions: 0,
        total_page_views: 0,
        total_sales: 0,
        organic_impressions: 0,
        promoted_impressions: 0
      }
    );
  };

  const averages = calculateAverages();
  
  // Prepare data for organic vs promoted pie chart
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
      <h1 className="text-2xl font-bold mb-6">Performance Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Avg Click-Through Rate</h3>
          <p className="text-2xl font-bold">
            {(averages.avg_ctr / (data.length || 1)).toFixed(2)}%
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Avg Conversion Rate</h3>
          <p className="text-2xl font-bold">
            {(averages.avg_conversion / (data.length || 1)).toFixed(2)}%
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Page Views</h3>
          <p className="text-2xl font-bold">
            {averages.total_page_views.toLocaleString()}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
          <p className="text-2xl font-bold">
            {averages.total_sales.toLocaleString()}
          </p>
        </Card>
      </div>

      {/* Charts */}
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
          <h3 className="text-lg font-medium mb-4">Click-Through Rate by Listing</h3>
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
                  dataKey="click_through_rate"
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
