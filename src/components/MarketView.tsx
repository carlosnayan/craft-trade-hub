import { useQuery } from "@tanstack/react-query";
import { fetchPrices, formatSilver, formatAge, CITIES, PriceData } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";

interface Props {
  itemId: string;
}

export function MarketView({ itemId }: Props) {
  const { t } = useLanguage();

  const { data, isLoading, error } = useQuery({
    queryKey: ["market-prices", itemId],
    queryFn: () => fetchPrices(itemId, CITIES),
    enabled: !!itemId,
    staleTime: 60_000,
  });

  if (!itemId) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
        {t("selectItem")}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">{t("loading")}</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-16 text-destructive text-sm">
        Error fetching prices
      </div>
    );
  }

  const priceMap = new Map<string, PriceData>();
  data.forEach((d) => priceMap.set(d.city, d));

  const sellPrices = CITIES.map((city) => ({
    city,
    price: priceMap.get(city)?.sell_price_min ?? 0,
    date: priceMap.get(city)?.sell_price_min_date ?? "",
  })).filter((p) => p.price > 0);

  const buyPrices = CITIES.map((city) => ({
    city,
    price: priceMap.get(city)?.buy_price_max ?? 0,
    date: priceMap.get(city)?.buy_price_max_date ?? "",
  })).filter((p) => p.price > 0);

  const bestSell = sellPrices.length
    ? Math.min(...sellPrices.map((p) => p.price))
    : 0;
  const bestBuy = buyPrices.length
    ? Math.max(...buyPrices.map((p) => p.price))
    : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-2 animate-fade-in">
      {/* Sell Orders */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold text-foreground">{t("sellOrders")}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="px-4 py-2.5 text-left font-medium">{t("city")}</th>
                <th className="px-4 py-2.5 text-right font-medium">{t("minPrice")}</th>
                <th className="px-4 py-2.5 text-right font-medium">{t("age")}</th>
              </tr>
            </thead>
            <tbody>
              {CITIES.map((city) => {
                const d = priceMap.get(city);
                const price = d?.sell_price_min ?? 0;
                const isBest = price > 0 && price === bestSell;
                return (
                  <tr key={city} className="border-b border-border/50 hover:bg-row-hover transition-colors">
                    <td className="px-4 py-2.5 font-medium">{city}</td>
                    <td className={`px-4 py-2.5 text-right tabular-nums ${isBest ? "text-best font-semibold" : price === 0 ? "text-muted-foreground" : ""}`}>
                      {formatSilver(price)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-muted-foreground tabular-nums">
                      {d ? formatAge(d.sell_price_min_date) : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Buy Orders */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold text-foreground">{t("buyOrders")}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="px-4 py-2.5 text-left font-medium">{t("city")}</th>
                <th className="px-4 py-2.5 text-right font-medium">{t("maxPrice")}</th>
                <th className="px-4 py-2.5 text-right font-medium">{t("age")}</th>
              </tr>
            </thead>
            <tbody>
              {CITIES.map((city) => {
                const d = priceMap.get(city);
                const price = d?.buy_price_max ?? 0;
                const isBest = price > 0 && price === bestBuy;
                return (
                  <tr key={city} className="border-b border-border/50 hover:bg-row-hover transition-colors">
                    <td className="px-4 py-2.5 font-medium">{city}</td>
                    <td className={`px-4 py-2.5 text-right tabular-nums ${isBest ? "text-best font-semibold" : price === 0 ? "text-muted-foreground" : ""}`}>
                      {formatSilver(price)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-muted-foreground tabular-nums">
                      {d ? formatAge(d.buy_price_max_date) : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
