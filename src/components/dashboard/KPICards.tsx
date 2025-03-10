
import { Card } from "@/components/ui/card";

interface KPICardsProps {
  avgCTR: number;
  avgConversion: number;
  totalPageViews: number;
  totalSales: number;
  totalImpressions: number;
}

export const KPICards = ({
  avgCTR,
  avgConversion,
  totalPageViews,
  totalSales,
  totalImpressions,
}: KPICardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
        <p className="text-2xl font-bold">{totalSales.toLocaleString()}</p>
      </Card>
      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-500">Total Page Views</h3>
        <p className="text-2xl font-bold">{totalPageViews.toLocaleString()}</p>
      </Card>
      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-500">Avg Click-Through Rate</h3>
        <p className="text-2xl font-bold">{avgCTR.toFixed(4)}%</p>
      </Card>
      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-500">Total Impressions</h3>
        <p className="text-2xl font-bold">{totalImpressions.toLocaleString()}</p>
      </Card>
      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-500">Avg Conversion Rate</h3>
        <p className="text-2xl font-bold">{avgConversion.toFixed(2)}%</p>
      </Card>
    </div>
  );
};
