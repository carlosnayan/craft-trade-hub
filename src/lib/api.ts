import { SERVERS, type ServerKey } from "@/constants/api";

export interface PriceData {
  item_id: string;
  city: string;
  quality: number;
  sell_price_min: number;
  sell_price_min_date: string;
  sell_price_max: number;
  sell_price_max_date: string;
  buy_price_min: number;
  buy_price_min_date: string;
  buy_price_max: number;
  buy_price_max_date: string;
}

export const CITIES = [
  "Bridgewatch",
  "Martlock",
  "Lymhurst",
  "Fort Sterling",
  "Thetford",
  "Caerleon",
  "Brecilien",
  "Black Market",
] as const;

export type City = (typeof CITIES)[number];

export function formatSilver(value: number): string {
  if (!value || value === 0) return "-";
  return value.toLocaleString();
}

export function formatAge(dateStr: string): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "<1m";
  if (diffMin < 60) return `${diffMin}m`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD > 7) return "> 7d";
  return `${diffD}d`;
}

export function pricesFetcher(
  [itemIds, region, cities = CITIES] : [
  itemIds: string | string[],
  region: ServerKey,
  cities: readonly City[]]
): Promise<PriceData[]> {
  const ids = Array.isArray(itemIds) ? itemIds.join(",") : itemIds;
  const locations = cities.join(",");
  return fetch(
    `https://${SERVERS[region].e}.albion-online-data.com/api/v2/stats/prices
    /${ids}?locations=${locations}&qualities=1`,
  ).then(res=> res.json()) as Promise<PriceData[]>
}