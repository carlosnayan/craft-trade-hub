import { Language, TranslationKey, translations } from "@/lib/translations";
import { create } from "zustand";

type LanguageStore = {
	lang: Language;
	setLang(lang: Language): void;
	t(key: TranslationKey): string;
};

export const useLanguage = create<LanguageStore>()((set, get) => ({
	lang: "pt",
	setLang: (lang) => set({ lang }),
	t: (key) => translations[get().lang][key],
}));
