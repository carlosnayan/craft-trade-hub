import { createContext, useContext, useState, ReactNode } from "react";

export const SERVERS = {
  americas: {
    name: "Americas",
    url: "https://west.albion-online-data.com/api/v2/stats/prices",
  },
  asia: {
    name: "Asia",
    url: "https://east.albion-online-data.com/api/v2/stats/prices",
  },
  europe: {
    name: "Europe",
    url: "https://europe.albion-online-data.com/api/v2/stats/prices",
  },
} as const;

export type ServerKey = keyof typeof SERVERS;

interface ServerContextType {
  server: ServerKey;
  setServer: (server: ServerKey) => void;
  serverUrl: string;
}

const ServerContext = createContext<ServerContextType | null>(null);

export function ServerProvider({ children }: { children: ReactNode }) {
  const [server, setServer] = useState<ServerKey>("americas");

  const serverUrl = SERVERS[server].url;

  return (
    <ServerContext.Provider value={{ server, setServer, serverUrl }}>
      {children}
    </ServerContext.Provider>
  );
}

export function useServer() {
  const ctx = useContext(ServerContext);
  if (!ctx) throw new Error("useServer must be used within ServerProvider");
  return ctx;
}
