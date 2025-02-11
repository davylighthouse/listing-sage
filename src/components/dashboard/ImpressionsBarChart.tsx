
import { Card } from "@/components/ui/card";
import { ListingMetrics } from "@/types/listing";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ImpressionsBarChartProps {
  data: ListingMetrics[];
}

export const ImpressionsBarChart = ({ data }: ImpressionsBarChartProps) => {
  return (
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
  );
};

