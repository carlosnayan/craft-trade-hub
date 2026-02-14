import { useState, useMemo, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { ITEMS, AlbionItem, getCategories } from "@/lib/items";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  selectedItem: AlbionItem | null;
  customItemId: string;
  onSelectItem: (item: AlbionItem | null) => void;
  onCustomIdChange: (id: string) => void;
}

export function ItemSelector({ selectedItem, customItemId, onSelectItem, onCustomIdChange }: Props) {
  const { lang, t } = useLanguage();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const categories = useMemo(() => getCategories(lang), [lang]);

  const filtered = useMemo(() => {
    let items = ITEMS;
    if (selectedCategory) {
      items = items.filter((i) => i.category[lang] === selectedCategory);
    }
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (i) =>
          i.name[lang].toLowerCase().includes(q) ||
          i.id.toLowerCase().includes(q)
      );
    }
    return items.slice(0, 50);
  }, [search, selectedCategory, lang]);

  const displayValue = selectedItem
    ? selectedItem.name[lang]
    : customItemId || "";

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder={t("searchItem")}
          value={open ? search : displayValue}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => {
            setOpen(true);
            setSearch("");
          }}
          className="w-full rounded-lg border border-border bg-card pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
        />
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-popover shadow-xl animate-fade-in max-h-80 overflow-hidden flex flex-col">
          {/* Custom ID input */}
          <div className="border-b border-border p-2">
            <input
              type="text"
              placeholder={t("customItemId")}
              value={customItemId}
              onChange={(e) => {
                onCustomIdChange(e.target.value.toUpperCase());
                onSelectItem(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && customItemId) setOpen(false);
              }}
              className="w-full rounded bg-secondary px-3 py-1.5 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-1 p-2 border-b border-border">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`rounded px-2 py-0.5 text-xs transition-colors ${
                !selectedCategory
                  ? "bg-foreground text-background font-medium"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                className={`rounded px-2 py-0.5 text-xs transition-colors ${
                  selectedCategory === cat
                    ? "bg-foreground text-background font-medium"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Items */}
          <div className="overflow-y-auto">
            {filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectItem(item);
                  onCustomIdChange("");
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-row-hover transition-colors ${
                  selectedItem?.id === item.id ? "bg-secondary" : ""
                }`}
              >
                <span className="text-foreground">{item.name[lang]}</span>
                <span className="text-xs font-mono text-muted-foreground">{item.id}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                {t("noData")}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
