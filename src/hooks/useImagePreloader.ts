import { useEffect, useRef } from "react";
import { BaseItem } from "@/lib/base-items";

const PRELOADED_IMAGES = new Set<string>();

export function useImagePreloader(items: BaseItem[]) {
  const queueRef = useRef<BaseItem[]>([]);

  useEffect(() => {
    // Process items that are not yet loaded
    const newItems = items.filter((item) => {
      // We typically preload the T4 version as a representative image for the base item
      // or we could try to preload multiple tiers, but sticking to one tier per base item
      // is usually enough for the selector view.
      const idToLoad = `T${item.tiers[0]}_${item.id}`;
      return !PRELOADED_IMAGES.has(idToLoad);
    });

    if (newItems.length === 0) return;

    // Add to queue
    queueRef.current = [...queueRef.current, ...newItems];

    // Simple priority loader implementation
    // We use a small timeout to not block the main thread immediately
    const timer = setTimeout(() => {
      // Process a batch
      const BATCH_SIZE = 5;
      const batch = queueRef.current.splice(0, BATCH_SIZE);

      batch.forEach((item) => {
        const id = `T${item.tiers[0]}_${item.id}`;
        if (PRELOADED_IMAGES.has(id)) return;

        const img = new Image();
        img.src = `https://render.albiononline.com/v1/item/${id}.png`;
        img.onload = () => PRELOADED_IMAGES.add(id);
        img.onerror = () => {
          // Mark as "loaded" so we don't retry forever in this session
          PRELOADED_IMAGES.add(id);
        };
      });
    }, 200);

    return () => clearTimeout(timer);
  }, [items]);
}
