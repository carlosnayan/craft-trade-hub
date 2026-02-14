import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageSelector() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-1 rounded-md border border-border p-0.5 text-sm">
      <button
        onClick={() => setLang("en")}
        className={`rounded px-2 py-1 transition-colors ${
          lang === "en"
            ? "bg-foreground text-background font-medium"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang("pt")}
        className={`rounded px-2 py-1 transition-colors ${
          lang === "pt"
            ? "bg-foreground text-background font-medium"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        PT
      </button>
    </div>
  );
}
