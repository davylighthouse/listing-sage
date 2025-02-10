
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  // In a full implementation, this would come from a store or database
  const data = localStorage.getItem("ebayData")
    ? JSON.parse(localStorage.getItem("ebayData")!)
    : [];

  // Calculate averages for KPI cards
  const calculateAverages = () => {
    if (!data.length) return { avgCTR: 0, avgConversion: 0, totalImpressions: 0 };
    
    return data.reduce(
      (acc, item) => ({
        avgCTR: acc.avgCTR + item.clickThroughRate,
        avgConversion: acc.avgConversion + item.salesConversionRate,
        totalImpressions: acc.totalImpressions + item.totalImpressions,
      }),
      { avgCTR: 0, avgConversion: 0, totalImpressions: 0 }
    );
  };

  const averages = calculateAverages();

  return (
    <div className="p-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Performance Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Avg Click-Through Rate</h3>
          <p className="text-2xl font-bold">
            {(averages.avgCTR / (data.length || 1)).toFixed(2)}%
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Avg Conversion Rate</h3>
          <p className="text-2xl font-bold">
            {(averages.avgConversion / (data.length || 1)).toFixed(2)}%
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Impressions</h3>
          <p className="text-2xl font-bold">
            {averages.totalImpressions.toLocaleString()}
          </p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6">
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
                  dataKey="listingTitle"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalImpressions" fill="#3b82f6" />
              </BarChart>
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
