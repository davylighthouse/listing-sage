
import { Card } from "@/components/ui/card";
import { ListingMetrics } from "@/types/listing";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CTRLineChartProps {
  data: ListingMetrics[];
}

export const CTRLineChart = ({ data }: CTRLineChartProps) => {
  return (
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
  );
};

