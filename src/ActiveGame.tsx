import React from "react";
import { useParams } from "react-router-dom";
import { WsClient, WsMessage, isWsMessage } from "./utils/websocket";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Coffee from "@mui/icons-material/Coffee";
import Visibility from "@mui/icons-material/Visibility";
import BackHandIcon from "@mui/icons-material/BackHand";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { GameContexType, GameContext } from "./utils/gameContext";

const cardValues = [0, 1, 2, 3, 5, 8, 13, null];

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

const wildCards = [
  {
    type: "block",
    icon: BackHandIcon,
  },
  {
    type: "reveal",
    icon: Visibility,
  },
];
const ActiveSession: React.FC<{ onSetActiveUser: () => void }> = ({
  onSetActiveUser,
}) => {
  const gameContext = React.useContext(GameContext);
  const { id } = useParams();
  const [game, setGame] = React.useState<{
    client: WsClient;
    id: string;
  } | null>(null);

  const onReceiveData = (event: WsMessage | string) => {
    if (isWsMessage(event)) {
      const mapper = eventMapper(gameContext);
      const evType = event.type as keyof typeof mapper;
      mapper[evType](event);
    }
  };
  
  React.useEffect(() => {
    console.log(game, 'this is gameId');
    if (gameContext.user?.uuid && game?.client) {
      localStorage.setItem("ppc-with-jira-user-uuid", gameContext.user?.uuid);
      localStorage.setItem("ppc-with-jira-user-name", gameContext.user?.name);
      game?.client.sendData({
        gameId: gameContext.currGameId || "",
        type: "user-seen",
        userMeta: {
          name: gameContext.user?.name,
          uuid: gameContext.user?.uuid,
        },
      });
    } else if (gameContext.currGameId !== undefined && game?.id) {
      onSetActiveUser();
    }
  }, [gameContext.user?.uuid, game?.id, gameContext.user?.name, gameContext.currGameId]);

  React.useEffect(() => {
    if (id) {
      gameContext.setCurrGame?.(id);
    }
    return () => {
      game?.client.close();
    };
  }, [id]);

  React.useEffect(() => {
    game?.client.receiveData((event) => {
      console.log(event);
      if (
        isWsMessage(event) &&
        event.type === "set-game-info" &&
        event.userMeta.uuid !== gameContext.user?.uuid
      ) {
        console.log("I am setting game info!");
      }
    }, id as string);
  }, [game?.id]);

  React.useEffect(() => {
    if (gameContext.currGameId && gameContext.user?.uuid) {
      const client = WsClient.getInstance(gameContext.currGameId, onReceiveData);
      client.sendData({
        gameId: gameContext.currGameId || "",
        type: "get-game-info",
        userMeta: {
          name: gameContext.user?.name,
          uuid: gameContext.user?.uuid,
        },
      });
      setGame(() => {
        return {
          id: gameContext.currGameId as string,
          client,
        };
      });
    }
  }, [gameContext.currGameId, gameContext.user?.uuid]);

  return (
    <Container maxWidth={false} sx={{ mt: 2, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={8} lg={12}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: "70vh",
              spacing: 0,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Card
              variant="outlined"
              sx={{
                minWidth: "20rem",
                minHeight: "10rem",
                textAlign: "center",
                alignContent: "center",
                backgroundColor: "#03DAC6",
                borderRadius: 10,
              }}
            >
              <CardContent
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: "auto",
                }}
              >
                Start by picking your cards!
              </CardContent>
            </Card>
            <Card
              variant="outlined"
              sx={{
                minWidth: "1rem",
                height: "4rem",
                textAlign: "center",
                alignContent: "center",
                backgroundColor: "#f5f5f5",
                mt: 2,
                mb: 4,
              }}
            >
              <CardContent></CardContent>
            </Card>
            <Typography sx={{ fontWeight: "bold" }}>
              {gameContext.user?.name ?? "??"}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <Container maxWidth="md" sx={{ mt: 2, mb: 4 }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            justifyContent: "center",
            maxHeight: 66,
          }}
        >
          {cardValues.map((item, key) => (
            <Card
              key={key}
              sx={{
                transition: "transform 0.15s ease-in-out",
                "&:hover": {
                  transform: "translate(0px, -20px);",
                  border: "1px solid #03a9f4",
                },
                width: "3rem",
              }}
            >
              <CardActionArea>
                <CardContent
                  sx={{
                    p: 2,
                    paddingLeft: 0,
                    paddingRight: 0,
                    display: "flex",
                    flexDirection: "column",
                    height: "auto",
                    fontSize: 30,
                    textAlign: "center",
                  }}
                >
                  {item ?? "?"}
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
          <Card
            sx={{
              transition: "transform 0.15s ease-in-out",
              "&:hover": {
                transform: "translate(0px, -20px);",
                border: "1px solid #03a9f4",
              },
            }}
          >
            <CardActionArea>
              <CardContent
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: "auto",
                  paddingRight: "8px",
                  paddingLeft: "8px",
                }}
              >
                <Coffee sx={{ fontSize: 30 }} />
              </CardContent>
            </CardActionArea>
          </Card>
          <Divider orientation="vertical" variant="middle" flexItem />
          {wildCards.map((item, key) => (
            <Card
              key={key}
              sx={{
                transition: "transform 0.15s ease-in-out",
                "&:hover": {
                  transform: "translate(0px, -20px);",
                  border: "1px solid #03a9f4",
                },
                backgroundColor: "#ff1744",
              }}
            >
              <CardActionArea>
                <CardContent
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: "auto",
                    paddingRight: "8px",
                    paddingLeft: "8px",
                  }}
                >
                  {item.icon ? <item.icon sx={{ fontSize: 30 }} /> : "?"}
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      </Container>
    </Container>
  );
};

export default ActiveSession;
