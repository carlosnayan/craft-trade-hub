import { useLanguage } from "@/contexts/LanguageContext";
import { ServerKey, SERVERS } from "@/constants/api";
import { useServer } from "@/stores/server";

export function ServerSelector() {
	const { server, setServer } = useServer();
	const { t } = useLanguage();

	console.log(server);

	return (
		<div className="flex items-center gap-1 rounded-md border border-border p-0.5 text-sm">
			{(Object.keys(SERVERS) as ServerKey[]).map((key) => (
				<button
					key={key}
					onClick={() => setServer(key)}
					className={`rounded px-2 py-1 transition-colors ${
						server === key
							? "bg-foreground text-background font-medium"
							: "text-muted-foreground hover:text-foreground"
					}`}
				>
					{t(key)}
				</button>
			))}
		</div>
	);
}
