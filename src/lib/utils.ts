
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ListingMetrics } from "@/types/listing"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatMetricValue = (value: number, type: "percentage" | "number" = "number"): string => {
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
  return [...listings]
    .sort((a, b) => (b[criteria as keyof ListingMetrics] as number) - (a[criteria as keyof ListingMetrics] as number))
    .slice(0, limit)
}

