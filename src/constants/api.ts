export type ServerKey = "am" | "as" | "eu";

export const SERVERS = {
	am: { n: "Americas", e: "west" },
	as: { n: "Asia", e: "east" },
	eu: { n: "Europe", e: "europe" },
} satisfies Record<
	ServerKey,
	{ n: string /* name */; e: string /* endpoint */ }
>;
