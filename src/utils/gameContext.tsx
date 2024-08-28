import { createContext } from "react";
import { WsClient } from "./websocket";

export type TicketType = {
  key?: string;
  description: string;
  id: string;
};

export type UserType = {
  name: string;
  uuid: string;
};

export type GameContexType = {
  wsClient: WsClient;
  user?: UserType;
  currGameId?: string;
  activeUsers?: UserType[];
  drawnCards?: unknown[];
  availableTickets?: TicketType[];
  setAvailableTickets?: (tickets: TicketType[]) => void;
  setUser?: (newValue: UserType) => void;
  setCurrGame?: (id: string) => void;
  setActiveUsers?: (activeUsers: UserType) => void;
  setDrawnCards?: (cards: unknown[]) => void;
};

export const GameContext = createContext<GameContexType>({} as GameContexType);
