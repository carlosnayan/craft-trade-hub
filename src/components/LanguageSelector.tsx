import { Language } from "@/lib/translations";
import { useLanguage } from "@/stores/language";
import { useShallow } from "zustand/shallow";

export function LanguageSelector() {
	const [lang, setLang] = useLanguage(useShallow((s) => [s.lang, s.setLang]));

	return (
		<div className="flex items-center gap-1 rounded-md border border-border p-0.5 text-sm">
			{(["en", "pt"] satisfies Language[]).map((l) => (
				<button
					onClick={() => setLang(l)}
					className={`rounded px-2 py-1 transition-colors uppercase ${
						lang === l
							? "bg-foreground text-background font-medium"
							: "text-muted-foreground hover:text-foreground"
					}`}
					children={l}
				/>
			))}
		</div>
	);
}
