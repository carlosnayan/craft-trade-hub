import { ITEMS } from "./items";
import { Language } from "./translations";

export interface BaseItem {
	id: string; // The part after "T{tier}_" e.g., "MAIN_SWORD"
	name: Record<Language, string>;
	categoryId: string;
	tiers: number[];
}

// Regex to capture "T{tier}_{baseId}"
const ID_REGEX = /^T(\d+)_(.+)$/;

export function getGroupedItems(): BaseItem[] {
	const map = new Map<string, BaseItem>();

	for (const item of ITEMS) {
		const match = item.id.match(ID_REGEX);
		if (!match) continue;

		const tier = parseInt(match[1], 10);
		const baseId = match[2];

		if (!map.has(baseId)) {
			// Remove "(T{tier})" from the name for the base item display
			const nameEn = item.name.en.replace(/\s*\(T\d+\)/, "");
			const namePt = item.name.pt.replace(/\s*\(T\d+\)/, "");

			map.set(baseId, {
				id: baseId,
				name: { en: nameEn, pt: namePt },
				categoryId: item.categoryId,
				tiers: [tier],
			});
		} else {
			const entry = map.get(baseId)!;
			if (!entry.tiers.includes(tier)) {
				entry.tiers.push(tier);
				entry.tiers.sort((a, b) => a - b);
			}
		}
	}

	return Array.from(map.values());
}

export const BASE_ITEMS = getGroupedItems();

export function searchBaseItems(
	query: string,
	lang: "en" | "pt",
	categoryId?: string,
): BaseItem[] {
	const q = query.toLowerCase();
	let items = BASE_ITEMS;

	if (categoryId) {
		items = items.filter((i) => i.categoryId === categoryId);
	}

	return items.filter(
		(item) =>
			item.name[lang].toLowerCase().includes(q) ||
			item.id.toLowerCase().includes(q),
	);
}
