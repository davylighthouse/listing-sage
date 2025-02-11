
import { Card } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ImpressionsPieChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

export const ImpressionsPieChart = ({ data }: ImpressionsPieChartProps) => {
  const COLORS = ["#3b82f6", "#10b981"];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Organic vs Promoted Impressions</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

