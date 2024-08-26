import { createContext } from "react";
import { WsClient } from "./websocket";

export type GameContexType = {
  game: string;
  wsClient: WsClient;
  setGame: (sessionId: string) => void;
};

export const GameContext = createContext<GameContexType>({} as GameContexType);
