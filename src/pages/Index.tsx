import { useState } from "react";
import { ItemSelector } from "@/components/ItemSelector";
import { MarketView } from "@/components/MarketView";
import { CraftView } from "@/components/CraftView";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { AlbionItem } from "@/lib/items";

const Index = () => {
  const { t, lang } = useLanguage();
  const [mode, setMode] = useState<"market" | "craft">("market");
  const [selectedItem, setSelectedItem] = useState<AlbionItem | null>(null);
  const [customItemId, setCustomItemId] = useState("");

  const activeItemId = selectedItem?.id || customItemId;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-foreground tracking-tight">
              {t("title")}
            </h1>
          </div>
          <LanguageSelector />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        {/* Controls row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Mode toggle */}
          <div className="flex rounded-lg border border-border p-0.5 shrink-0">
            <button
              onClick={() => setMode("market")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                mode === "market"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("market")}
            </button>
            <button
              onClick={() => setMode("craft")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                mode === "craft"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("craft")}
            </button>
          </div>

          {/* Item selector */}
          <ItemSelector
            selectedItem={selectedItem}
            customItemId={customItemId}
            onSelectItem={setSelectedItem}
            onCustomIdChange={setCustomItemId}
          />

          {/* Item image */}
          {activeItemId && (
            <div className="shrink-0 rounded-lg border border-border bg-secondary p-1.5">
              <img
                src={`https://render.albiononline.com/v1/item/${activeItemId}.png?size=64&quality=1`}
                alt={selectedItem?.name[lang] ?? activeItemId}
                className="h-12 w-12 object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        {/* Results */}
        {mode === "market" ? (
          <MarketView itemId={activeItemId} />
        ) : selectedItem && selectedItem.recipe ? (
          <CraftView item={selectedItem} />
        ) : activeItemId ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
            {t("noCraftRecipe")}
          </div>
        ) : (
          <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
            {t("selectItem")}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-muted-foreground">
          Data from Albion Online Data Project · Prices may be delayed
        </div>
      </footer>
    </div>
  );
};

export default Index;
