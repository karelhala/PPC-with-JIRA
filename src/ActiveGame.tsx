import React from "react";
import { useParams } from "react-router-dom";
import { isWsMessage } from "./utils/websocket";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Coffee from "@mui/icons-material/Coffee";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { GameContext, UserType } from "./utils/gameContext";
import { Button } from "@mui/material";

const cardValues = [0, 1, 2, 3, 5, 8, 13, null];

const wildCards: { type: string; icon: any }[] = [
  // {
  //   type: "block",
  //   icon: BackHandIcon,
  // },
  // {
  //   type: "reveal",
  //   icon: Visibility,
  // },
];
const ActiveSession = () => {
  const gameContext = React.useContext(GameContext);
  const [activeCard, setActiveCard] = React.useState<
    undefined | number | null
  >();
  const [cardPicked, setCardPicked] = React.useState(false);
  const [revealCards, setRevealCards] = React.useState(false);
  const [usersSelection, setUsersSelection] = React.useState<
    (UserType & { selectedCard?: number })[]
  >([]);
  console.log(activeCard, "this is activeCard!");
  if (gameContext.currGameId) {
    gameContext.wsClient.receiveData((event) => {
      if (isWsMessage(event) && event.type === "card-selected") {
        setCardPicked(true);
        if (gameContext.activeUsers) {
          const usersWithCards = gameContext.activeUsers?.map((user) => ({
            ...user,
            ...(user.uuid === event.userMeta.uuid && {
              selectedCard: event.data.card,
            }),
          }));
          setUsersSelection(usersWithCards);
        }
      } else if (isWsMessage(event) && event.type === "start-new-game") {
        setCardPicked(false);
        setActiveCard(undefined);
        if (gameContext.activeUsers) {
          const usersWithCards = gameContext.activeUsers?.map((user) => ({
            ...user,
            selectedCard: undefined,
          }));
          setUsersSelection(usersWithCards);
          usersWithCards.forEach((user) => {
            gameContext.setActiveUsers?.(user);
          });
        }
      } else if (isWsMessage(event) && event.type === "reveal-cards") {
        setRevealCards(true);
      }
    }, gameContext.currGameId);
  }
  const { id } = useParams();
  React.useEffect(() => {
    if (id) {
      gameContext.setCurrGame?.(id);
    }
  }, [id]);

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
            <Stack>
              <Grid container maxWidth="sm">
                {Array(3)
                  .fill(0)
                  .map((i, index) => (
                    <Grid
                      key={index}
                      lg={12 / 3}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Card
                        variant="outlined"
                        sx={{
                          width: "2rem",
                          height: "4rem",
                          textAlign: "center",
                          alignContent: "center",
                          backgroundColor: "#f5f5f5",
                          mt: 2,
                          mb: 4,
                          ...((usersSelection.find(
                            ({ uuid, selectedCard }) =>
                              uuid === gameContext.activeUsers?.[index]?.uuid &&
                              selectedCard !== undefined,
                          ) ||
                            (activeCard &&
                              gameContext.user?.uuid ===
                                gameContext.activeUsers?.[index]?.uuid)) && {
                            border: "1px solid #03a9f4",
                          }),
                        }}
                      >
                        <CardContent
                          sx={{
                            padding: 0,
                            paddingTop: "16px",
                          }}
                        >
                          <Typography sx={{ fontWeight: "bold" }}>
                            {revealCards &&
                              (usersSelection.find(
                                ({ uuid, selectedCard }) =>
                                  uuid ===
                                    gameContext.activeUsers?.[index]?.uuid &&
                                  selectedCard !== undefined,
                              )?.selectedCard ||
                                (gameContext.user?.uuid ===
                                  gameContext.activeUsers?.[index]?.uuid &&
                                  activeCard))}
                          </Typography>
                        </CardContent>
                      </Card>
                      <Typography sx={{ fontWeight: "bold" }}>
                        {gameContext.activeUsers?.[index]?.name ?? "??"}
                      </Typography>
                    </Grid>
                  ))}
              </Grid>
              <Grid container maxWidth="md">
                <Grid lg={12}>
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
                      {cardPicked && !revealCards && (
                        <Button
                          onClick={() => {
                            setRevealCards(true);
                            if (gameContext.currGameId && gameContext.user) {
                              gameContext.wsClient.sendData({
                                gameId: gameContext.currGameId,
                                userMeta: gameContext.user,
                                type: "reveal-cards",
                              });
                            }
                          }}
                        >
                          Reveal Cards
                        </Button>
                      )}
                      {cardPicked && revealCards && (
                        <Button
                          onClick={() => {
                            setRevealCards(false);
                            setActiveCard(undefined);
                            setCardPicked(false);
                            if (gameContext.currGameId && gameContext.user) {
                              gameContext.wsClient.sendData({
                                gameId: gameContext.currGameId,
                                userMeta: gameContext.user,
                                type: "start-new-game",
                              });
                            }
                          }}
                        >
                          Start New game
                        </Button>
                      )}
                      {!cardPicked &&
                        !revealCards &&
                        "Start by picking your cards!"}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              <Grid container maxWidth="sm">
                {gameContext.activeUsers?.length &&
                  gameContext.activeUsers?.length > 3 &&
                  Array(3)
                    .fill(0)
                    .map((i, index) => (
                      <Grid
                        key={index}
                        lg={12 / 3}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Card
                          variant="outlined"
                          sx={{
                            width: "2rem",
                            height: "4rem",
                            textAlign: "center",
                            alignContent: "center",
                            backgroundColor: "#f5f5f5",
                            mt: 2,
                            mb: 4,
                            ...((usersSelection.find(
                              ({ uuid, selectedCard }) =>
                                uuid ===
                                  gameContext.activeUsers?.[index + 3]?.uuid &&
                                selectedCard !== undefined,
                            ) ||
                              (activeCard &&
                                gameContext.user?.uuid ===
                                  gameContext.activeUsers?.[index + 3]
                                    ?.uuid)) && {
                              border: "1px solid #03a9f4",
                            }),
                          }}
                        >
                          <CardContent
                            sx={{
                              padding: 0,
                              paddingTop: "16px",
                            }}
                          >
                            <Typography sx={{ fontWeight: "bold" }}>
                              {revealCards &&
                                (usersSelection.find(
                                  ({ uuid, selectedCard }) =>
                                    uuid ===
                                      gameContext.activeUsers?.[index + 3]
                                        ?.uuid && selectedCard !== undefined,
                                )?.selectedCard ||
                                  (gameContext.user?.uuid ===
                                    gameContext.activeUsers?.[index + 3]
                                      ?.uuid &&
                                    activeCard))}
                            </Typography>
                          </CardContent>
                        </Card>
                        <Typography sx={{ fontWeight: "bold" }}>
                          {gameContext.activeUsers?.[index + 3]?.name ?? "??"}
                        </Typography>
                      </Grid>
                    ))}
              </Grid>
            </Stack>
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
                ...(activeCard === item && {
                  transform: "translate(0px, -20px);",
                  border: "1px solid #03a9f4",
                }),
                width: "3rem",
              }}
            >
              <CardActionArea
                onClick={() => {
                  if (
                    gameContext.wsClient &&
                    gameContext.currGameId &&
                    gameContext.user
                  ) {
                    if (revealCards) {
                      return;
                    }
                    setActiveCard((prev) => {
                      const currCard = prev === item ? undefined : item;

                      gameContext.setDrawnCards?.(currCard);
                      setCardPicked(true);
                      if (gameContext.currGameId && gameContext.user) {
                        gameContext.wsClient.sendData({
                          gameId: gameContext.currGameId,
                          type: "card-selected",
                          userMeta: gameContext.user,
                          data: {
                            card: currCard,
                          },
                        });
                      }
                      return currCard;
                    });
                  }
                }}
              >
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
