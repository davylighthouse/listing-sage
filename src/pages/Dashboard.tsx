
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ListingMetrics } from "@/types/listing";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { KPICards } from "@/components/dashboard/KPICards";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { ImpressionsBarChart } from "@/components/dashboard/ImpressionsBarChart";
import { ImpressionsPieChart } from "@/components/dashboard/ImpressionsPieChart";
import { CTRLineChart } from "@/components/dashboard/CTRLineChart";
import { TopListingsTable } from "@/components/dashboard/TopListingsTable";

const Dashboard = () => {
  const [data, setData] = useState<ListingMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [timeframe, setTimeframe] = useState("week");
  const [rankCriteria, setRankCriteria] = useState("quantity_sold");

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy');
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      try {
        // First get the basic listing info
        const { data: listings, error: listingsError } = await supabase
          .from('ebay_listings')
          .select('id, ebay_item_id, listing_title, user_id')
          .eq('user_id', user.id);

        if (listingsError) throw listingsError;

        // Then get the latest metrics for each listing
        const listingsWithMetrics = await Promise.all(
          listings.map(async (listing) => {
            const { data: metricsData, error: metricsError } = await supabase
              .from('ebay_listing_history')
              .select('*')
              .eq('ebay_item_id', listing.ebay_item_id)
              .order('data_end_date', { ascending: false })
              .limit(1);

            // If there's no history data or an error, return default values
            if (metricsError || !metricsData || metricsData.length === 0) {
              console.log('No history data for listing:', listing.ebay_item_id);
              return {
                ...listing,
                total_impressions_ebay: 0,
                click_through_rate: 0,
                quantity_sold: 0,
                sales_conversion_rate: 0,
                total_page_views: 0,
                total_organic_impressions_ebay: 0,
                total_promoted_listings_impressions: 0,
                page_views_promoted_ebay: 0,
                page_views_promoted_outside_ebay: 0,
                page_views_organic_ebay: 0,
                page_views_organic_outside_ebay: 0,
                top_20_search_slot_promoted_impressions: 0,
                top_20_search_slot_organic_impressions: 0,
                change_top_20_search_slot_promoted_impressions: 0,
                change_top_20_search_slot_impressions: 0,
                rest_of_search_slot_impressions: 0,
                non_search_promoted_listings_impressions: 0,
                change_non_search_promoted_listings_impressions: 0,
                non_search_organic_impressions: 0,
                change_non_search_organic_impressions: 0,
              } as ListingMetrics;
            }

            // Return the most recent metrics data
            return {
              ...listing,
              ...metricsData[0],
            } as ListingMetrics;
          })
        );

        setData(listingsWithMetrics);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

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
        avg_ctr: acc.avg_ctr + (item.click_through_rate || 0),
        avg_conversion: acc.avg_conversion + (item.sales_conversion_rate || 0),
        total_impressions: acc.total_impressions + (item.total_impressions_ebay || 0),
        total_page_views: acc.total_page_views + (item.total_page_views || 0),
        total_sales: acc.total_sales + (item.quantity_sold || 0),
        organic_impressions: acc.organic_impressions + (item.total_organic_impressions_ebay || 0),
        promoted_impressions: acc.promoted_impressions + (item.total_promoted_listings_impressions || 0),
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
        <DashboardFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          rankCriteria={rankCriteria}
          setRankCriteria={setRankCriteria}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
        />
      </div>

      <KPICards
        avgCTR={averages.avg_ctr / (data.length || 1)}
        avgConversion={averages.avg_conversion / (data.length || 1)}
        totalPageViews={averages.total_page_views}
        totalSales={averages.total_sales}
        totalImpressions={averages.total_impressions}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <TopListingsTable data={data} rankCriteria={rankCriteria} />
        <ImpressionsPieChart data={impressionsSplit} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ImpressionsBarChart data={data} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CTRLineChart data={data} />
        </div>
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
