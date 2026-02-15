import { useState } from "react";
import { ItemSelector } from "@/components/ItemSelector";
import { TierSelector } from "@/components/TierSelector";
import { EnchantmentSelector } from "@/components/EnchantmentSelector";
import { MarketView } from "@/components/MarketView";
import { BaseItem } from "@/lib/base-items";
import { useLanguage } from "@/contexts/LanguageContext";
import { ServerSelector } from "@/components/ServerSelector";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Index() {
  const [selectedBaseItem, setSelectedBaseItem] = useState<BaseItem | null>(
    null,
  );
  const [tier, setTier] = useState<number>(4);
  const [enchantment, setEnchantment] = useState<number>(0);
  const [customItemId, setCustomItemId] = useState("");
  const { t } = useLanguage();

  // Determine effective ID
  let activeItemId = "";
  if (customItemId) {
    activeItemId = customItemId;
  } else if (selectedBaseItem) {
    const prefix = `T${tier}_`;
    const suffix = enchantment > 0 ? `@${enchantment}` : "";
    activeItemId = `${prefix}${selectedBaseItem.id}${suffix}`;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 p-2 text-primary flex items-center justify-center">
              <img
                src="/application.svg"
                className="h-full w-full"
                alt="Craft Trade Hub"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                {t("title")}
              </h1>
              <p className="text-sm text-muted-foreground">Craft Trade Hub</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ServerSelector />
            <LanguageSelector />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6 flex-1 w-full">
        {/* Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
            <label className="text-sm font-medium text-muted-foreground">
              {t("item")}
            </label>
            <ItemSelector
              selectedItem={selectedBaseItem}
              customItemId={customItemId}
              onSelectItem={(item) => {
                setSelectedBaseItem(item);
                // Reset tier if not available
                if (item && !item.tiers.includes(tier)) {
                  setTier(item.tiers[0]);
                }
              }}
              onCustomIdChange={setCustomItemId}
            />
          </div>

          {selectedBaseItem && !customItemId && (
            <>
              <div className="flex flex-col gap-1.5 w-24">
                <label className="text-sm font-medium text-muted-foreground">
                  {t("tier")}
                </label>
                <TierSelector
                  selectedTier={tier}
                  availableTiers={selectedBaseItem.tiers}
                  onChange={setTier}
                />
              </div>

              <div className="flex flex-col gap-1.5 w-24">
                <label className="text-sm font-medium text-muted-foreground">
                  {t("enchantment")}
                </label>
                <EnchantmentSelector
                  selectedEnchantment={enchantment}
                  onChange={setEnchantment}
                />
              </div>
            </>
          )}
        </div>

        {/* Placeholder / Empty State */}
        {!activeItemId && (
          <div className="rounded-lg border border-dashed border-border p-12 text-center bg-card/50">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-secondary/50 p-3 text-muted-foreground flex items-center justify-center">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-foreground">
              {t("selectItem")}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("searchItem")}
            </p>
          </div>
        )}

        {/* Content (Market/Craft) */}
        {activeItemId && (
          <Tabs defaultValue="market" className="space-y-4">
            <TabsList>
              <TabsTrigger value="market">{t("market")}</TabsTrigger>
              <TabsTrigger value="craft">{t("craft")}</TabsTrigger>
            </TabsList>
            <TabsContent value="market" className="space-y-4">
              <MarketView itemId={activeItemId} />
            </TabsContent>
            <TabsContent value="craft">
              <div className="rounded-lg border border-border p-8 text-center text-muted-foreground bg-card">
                Craft view for {activeItemId} coming soon...
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto bg-card">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
            Data provided by{" "}
            <a
              href="https://www.albion-online-data.com/"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-primary hover:underline"
            >
              Albion Online Data Project
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
