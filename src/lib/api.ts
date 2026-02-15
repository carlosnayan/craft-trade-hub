const API_BASE = "https://west.albion-online-data.com/api/v2/stats/prices";

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

export async function fetchPrices(
  itemIds: string | string[],
  cities: readonly string[] = CITIES,
  baseUrl: string = API_BASE,
): Promise<PriceData[]> {
  const ids = Array.isArray(itemIds) ? itemIds.join(",") : itemIds;
  const locations = cities.join(",");
  const res = await fetch(
    `${baseUrl}/${ids}?locations=${locations}&qualities=1`,
  );
  if (!res.ok) throw new Error("Failed to fetch prices");
  return res.json();
}

export function formatSilver(value: number): string {
  if (!value || value === 0) return "-";
  return value.toLocaleString();
}

export function formatAge(dateStr: string): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "<1m";
  if (diffMin < 60) return `${diffMin}m`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD}d`;
}
