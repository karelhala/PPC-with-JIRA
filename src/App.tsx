import React from "react";
import Dashboard from "./Dashboard";
import { GameContexType, GameContext } from "./utils/gameContext";
import { WsClient, WsMessage, isWsMessage } from "./utils/websocket";

const eventMapper = (context: GameContexType) => ({
  "user-seen": (event: WsMessage) => {
    if (
      event.userMeta.uuid !== context.user?.uuid &&
      context.user?.uuid !== undefined
    ) {
      console.log("foo");
    }
  },
});

const App = () => {
  const [game, setGame] = React.useState<GameContexType>({
    wsClient: WsClient.getInstance()
  });

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
    }
  }, [game.user?.uuid, game.user?.name])

  const onReceiveData = (event: WsMessage | string) => {
    if (isWsMessage(event)) {
      console.log(event, 'this is event!');
      const mapper = eventMapper(game);
      const evType = event.type as keyof typeof mapper;
      mapper[evType](event);
    }
  };

  React.useEffect(() => {
    if (game.currGameId && game.wsClient) {
      game?.wsClient.receiveData((event) => {
        onReceiveData(event)
      }, game.currGameId as string);
    }
  }, [game.currGameId, game.wsClient])

  return (
    <GameContext.Provider
      value={{
        ...game,
        setAvailableTickets: (tickets) =>
          setGame((game) => ({ ...game, availableTickets: tickets })),
        setActiveUsers: (users) =>
          setGame((game) => ({ ...game, activeUsers: users })),
        setCurrGame: (id) => setGame((game) => ({ ...game, currGameId: id })),
        setUser: (newUser) => setGame((game) => ({ ...game, user: newUser })),
        setDrawnCards: (cards) =>
          setGame((game) => ({ ...game, drawnCards: cards })),
      }}
    >
      <Dashboard />
    </GameContext.Provider>
  );
};

export default App;
