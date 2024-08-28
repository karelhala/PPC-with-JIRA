import { createContext } from "react";
import { WsClient } from "./websocket";

export type GameContexType = {
  wsClient: WsClient;
  user?: {
    name: string;
    uuid: string;
  };
  currGameId?: string;
  activeUsers?: {
    name: string;
    uuid: string;
  }[];
  drawnCards?: unknown[];
  availableTickets?: {
    key?: string;
    description: string;
    id: string;
  }[];
  setAvailableTickets?: (
    tickets: { key?: string; description: string; id: string }[],
  ) => void;
  setUser?: (newValue: { name: string; uuid: string }) => void;
  setCurrGame?: (id: string) => void;
  setActiveUsers?: (activeUsers: { name: string; uuid: string }[]) => void;
  setDrawnCards?: (cards: unknown[]) => void;
};

export const GameContext = createContext<GameContexType>({} as GameContexType);
