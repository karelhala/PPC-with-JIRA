import React from "react";
import Dashboard from "./Dashboard";
import {
  GameContexType,
  GameContext,
  TicketType,
  UserType,
} from "./utils/gameContext";
import { WsClient, WsMessage, isWsMessage } from "./utils/websocket";

const eventMapper = (context: GameContexType) => ({
  "user-seen": (event: WsMessage) => {
    if (
      event.userMeta.uuid !== context.user?.uuid &&
      context.user?.uuid !== undefined
    ) {
      console.log("setting active users!", event.userMeta);
      context.setActiveUsers?.(event.userMeta);
    }
  },
});

const App = () => {
  const [game, setGame] = React.useState<GameContexType>({
    wsClient: WsClient.getInstance(),
  });

  const callbacks = {
    setAvailableTickets: (tickets: TicketType[]) =>
      setGame((game) => ({ ...game, availableTickets: tickets })),
    setActiveUsers: (user: UserType) =>
      setGame((game) => {
        const foundUserIndex = game.activeUsers?.findIndex(({ uuid }) => user.uuid === uuid)
        if (foundUserIndex !== -1 && game.activeUsers?.[foundUserIndex as number]) {
          game.activeUsers[foundUserIndex as number] = user;
          return game;
        }
        return { ...game, activeUsers: [...game.activeUsers || [], user] };
      }),
    setCurrGame: (id: string) =>
      setGame((game) => ({ ...game, currGameId: id })),
    setUser: (newUser: UserType) =>
      setGame((game) => ({ ...game, user: newUser })),
    setDrawnCards: (cards: unknown[]) =>
      setGame((game) => ({ ...game, drawnCards: cards })),
  };

  React.useEffect(() => {
    const userUUID = localStorage.getItem("ppc-with-jira-user-uuid");
    const userName = localStorage.getItem("ppc-with-jira-user-name");
    if (userUUID && userName) {
      setGame((game) => ({
        ...game,
        user: {
          name: userName,
          uuid: userUUID,
        },
      }));
    }
  }, []);

  React.useEffect(() => {
    if (game.user?.uuid) {
      game.wsClient.sendData({
        gameId: game.currGameId || "",
        type: "user-seen",
        userMeta: {
          name: game.user?.name,
          uuid: game.user?.uuid,
        },
      });
      callbacks.setActiveUsers(game.user);
    }
  }, [game.user?.uuid, game.user?.name]);

  const onReceiveData = (event: WsMessage | string) => {
    if (isWsMessage(event)) {
      const mapper = eventMapper({ ...game, ...callbacks });
      const evType = event.type as keyof typeof mapper;
      mapper[evType](event);
    }
  };

  React.useEffect(() => {
    if (game.currGameId && game.wsClient) {
      game?.wsClient.receiveData((event) => {
        onReceiveData(event);
      }, game.currGameId as string);
    }
  }, [game.currGameId, game.wsClient]);

  return (
    <GameContext.Provider
      value={{
        ...game,
        ...callbacks,
      }}
    >
      <Dashboard />
    </GameContext.Provider>
  );
};

export default App;
