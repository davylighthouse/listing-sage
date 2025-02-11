
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ListingMetrics } from "@/types/listing"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatMetricValue = (value: number | null | undefined, type: "percentage" | "number" = "number"): string => {
  if (value === null || value === undefined) return "0";
  
  if (type === "percentage") {
    return `${(value * 100).toFixed(2)}%`
  }
  return value.toLocaleString()
}

export const getTopListings = (
  listings: ListingMetrics[],
  criteria: string,
  limit: number = 10
): ListingMetrics[] => {
  if (!listings || listings.length === 0) return [];
  
  return [...listings]
    .sort((a, b) => {
      const valueA = (a[criteria as keyof ListingMetrics] as number) || 0;
      const valueB = (b[criteria as keyof ListingMetrics] as number) || 0;
      return valueB - valueA;
    })
    .slice(0, limit)
}
