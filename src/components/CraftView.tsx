import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPrices, formatSilver, formatAge, CITIES, PriceData } from "@/lib/api";
import { AlbionItem } from "@/lib/items";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";

interface Props {
  item: AlbionItem;
}

const RETURN_RATES = {
  base: 0.152,
  city: 0.153,
  focus: 0.292,
  event: 0.10,
};

export function CraftView({ item }: Props) {
  const { t, lang } = useLanguage();
  const [useFocus, setUseFocus] = useState(false);
  const [useCityBonus, setUseCityBonus] = useState(false);
  const [useEventBonus, setUseEventBonus] = useState(false);

  const recipe = item.recipe;

  const allItemIds = useMemo(() => {
    if (!recipe) return [item.id];
    const resourceIds = recipe.map((r) => r.itemId);
    return [item.id, ...resourceIds];
  }, [item, recipe]);

  const { data, isLoading } = useQuery({
    queryKey: ["craft-prices", allItemIds],
    queryFn: () => fetchPrices(allItemIds, CITIES),
    enabled: allItemIds.length > 0,
    staleTime: 60_000,
  });

  if (!recipe) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
        {t("noCraftRecipe")}
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

  const returnRate =
    RETURN_RATES.base +
    (useCityBonus ? RETURN_RATES.city : 0) +
    (useFocus ? RETURN_RATES.focus : 0) +
    (useEventBonus ? RETURN_RATES.event : 0);

  const effectiveMultiplier = 1 - returnRate;

  // Build price lookup
  const priceByItemCity = new Map<string, PriceData>();
  data?.forEach((d) => priceByItemCity.set(`${d.item_id}:${d.city}`, d));

  // Calculate costs per city
  const cityData = CITIES.map((city) => {
    // Resource cost (instant buy = sell_price_min of resource)
    let costInstantBuy = 0;
    let costBuyOrder = 0;
    let hasResourceData = true;

    recipe.forEach((r) => {
      const rd = priceByItemCity.get(`${r.itemId}:${city}`);
      if (!rd || rd.sell_price_min === 0) {
        hasResourceData = false;
        return;
      }
      costInstantBuy += r.quantity * rd.sell_price_min * effectiveMultiplier;
      costBuyOrder += r.quantity * (rd.buy_price_max || rd.sell_price_min) * effectiveMultiplier;
    });

    // Crafted item revenue
    const cd = priceByItemCity.get(`${item.id}:${city}`);
    const revenueSell = cd?.sell_price_min ?? 0;
    const revenueBuyOrder = cd?.buy_price_max ?? 0;

    return {
      city,
      costInstantBuy: Math.round(costInstantBuy),
      costBuyOrder: Math.round(costBuyOrder),
      revenueSell,
      revenueBuyOrder,
      profitInstant: hasResourceData && revenueSell ? Math.round(revenueSell - costInstantBuy) : null,
      profitOrder: hasResourceData && revenueBuyOrder ? Math.round(revenueBuyOrder - costBuyOrder) : null,
      hasResourceData,
    };
  });

  const bestProfit = Math.max(
    ...cityData.map((c) => c.profitInstant ?? -Infinity)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toggle controls */}
      <div className="flex flex-wrap gap-3">
        <Toggle label={t("useFocus")} checked={useFocus} onChange={setUseFocus} />
        <Toggle label={t("cityBonus")} checked={useCityBonus} onChange={setUseCityBonus} />
        <Toggle label={t("eventBonus")} checked={useEventBonus} onChange={setUseEventBonus} />
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-xs text-muted-foreground">
          {t("returnRate")}: <span className="text-foreground font-mono font-semibold">{(returnRate * 100).toFixed(1)}%</span>
        </div>
      </div>

      {/* Resource prices */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold text-foreground">{t("resources")}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="px-4 py-2.5 text-left font-medium">{t("resource")}</th>
                <th className="px-4 py-2.5 text-right font-medium">{t("quantity")}</th>
                {CITIES.map((city) => (
                  <th key={city} className="px-3 py-2.5 text-right font-medium whitespace-nowrap">
                    {city.replace("Fort ", "Ft. ")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recipe.map((r) => (
                <tr key={r.itemId} className="border-b border-border/50 hover:bg-row-hover transition-colors">
                  <td className="px-4 py-2.5 font-mono text-xs">{r.itemId}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{r.quantity}</td>
                  {CITIES.map((city) => {
                    const rd = priceByItemCity.get(`${r.itemId}:${city}`);
                    return (
                      <td key={city} className="px-3 py-2.5 text-right tabular-nums text-xs">
                        <div>{formatSilver(rd?.sell_price_min ?? 0)}</div>
                        <div className="text-muted-foreground">{formatSilver(rd?.buy_price_max ?? 0)}</div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Crafted item prices + profit */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold text-foreground">
            {t("craftedItem")} — {item.name[lang]}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="px-4 py-2.5 text-left font-medium">{t("city")}</th>
                <th className="px-4 py-2.5 text-right font-medium">{t("sellOrders")}</th>
                <th className="px-4 py-2.5 text-right font-medium">{t("buyOrders")}</th>
                <th className="px-4 py-2.5 text-right font-medium">{t("resourceCost")}</th>
                <th className="px-4 py-2.5 text-right font-medium">{t("profit")}</th>
              </tr>
            </thead>
            <tbody>
              {cityData.map((cd) => {
                const isBestProfit = cd.profitInstant !== null && cd.profitInstant === bestProfit && bestProfit > 0;
                return (
                  <tr key={cd.city} className="border-b border-border/50 hover:bg-row-hover transition-colors">
                    <td className="px-4 py-2.5 font-medium">{cd.city}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums">
                      {formatSilver(cd.revenueSell)}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums">
                      {formatSilver(cd.revenueBuyOrder)}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                      {formatSilver(cd.costInstantBuy)}
                    </td>
                    <td className={`px-4 py-2.5 text-right tabular-nums font-semibold ${
                      cd.profitInstant === null
                        ? "text-muted-foreground"
                        : cd.profitInstant > 0
                        ? isBestProfit
                          ? "text-best"
                          : "text-success"
                        : "text-worst"
                    }`}>
                      {cd.profitInstant !== null ? formatSilver(cd.profitInstant) : "-"}
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

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
        checked
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-secondary text-muted-foreground hover:text-foreground"
      }`}
    >
      <div
        className={`h-3 w-3 rounded-sm border transition-colors ${
          checked ? "bg-background border-background" : "border-muted-foreground"
        }`}
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="h-3 w-3 text-foreground">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        )}
      </div>
      {label}
    </button>
  );
}
