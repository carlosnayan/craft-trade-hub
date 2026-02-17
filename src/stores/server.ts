import { ServerKey } from "@/constants/api";
import { create } from "zustand";

type ServerState = {
	server: ServerKey;
	setServer: (server: ServerKey) => void;
};

export const useServer = create<ServerState>((set) => ({
	server: "am",
	setServer: (server) => set({ server }),
}));
