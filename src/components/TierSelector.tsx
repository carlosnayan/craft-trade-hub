import { useRef, useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Props {
  selectedTier: number;
  availableTiers: number[];
  onChange: (tier: number) => void;
}

export function TierSelector({
  selectedTier,
  availableTiers,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative w-24">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
      >
        <span>T{selectedTier}</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-md animate-fade-in overflow-hidden">
          {availableTiers.map((tier) => (
            <button
              key={tier}
              onClick={() => {
                onChange(tier);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors ${
                selectedTier === tier ? "bg-secondary font-medium" : ""
              }`}
            >
              T{tier}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
