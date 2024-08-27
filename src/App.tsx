import React from "react";
import Dashboard from "./Dashboard";
import { GameContexType, GameContext } from "./utils/gameContext";

const App = () => {
  const [game, setGame] = React.useState<GameContexType>({});

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
