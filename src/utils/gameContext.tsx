import { createContext } from "react";

export type GameContexType = {
  user?: {
    name: string;
    uuid: string;
  };
};

export const GameContext = createContext<GameContexType>({} as GameContexType);
