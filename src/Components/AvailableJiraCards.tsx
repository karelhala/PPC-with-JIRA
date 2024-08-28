import React from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { GameContext, TicketType } from "../utils/gameContext";
import { isWsMessage } from "../utils/websocket";

const AvailableJiraCards = () => {
  const gameContext = React.useContext(GameContext);
  if (gameContext.currGameId ) {
    gameContext.wsClient.receiveData((ev) => {
      if (isWsMessage(ev) && gameContext.user && gameContext.currGameId) {
        console.log('I received data', ev.data);
        if (ev.type === 'get-all-cards' && gameContext.user) {
          gameContext.wsClient.sendData({
            userMeta: gameContext.user,
            type: 'set-all-cards',
            gameId: gameContext.currGameId,
            data: gameContext.availableTickets
          })
        } else if (ev.type === 'set-new-card' && gameContext.user.uuid !== ev.userMeta.uuid) {
          gameContext.setAvailableTickets?.(([
            ...gameContext.availableTickets || [],
            ev.data
          ]));
        } else if (ev.type === 'set-all-cards' && gameContext.user.uuid !== ev.userMeta.uuid) {
          console.log('I received data', ev.data);
          gameContext.setAvailableTickets?.(ev.data);
        } else if (ev.type === 'vote-now' && gameContext.availableTickets) {
          gameContext.setAvailableTickets?.(gameContext.availableTickets.map((ticket) => ({
            ...ticket,
            isSelected: ev.data.id === ticket.id
          })));
        }
      }
    }, gameContext.currGameId)
  }
  return (
    <Stack
      spacing={2}
      sx={{
        paddingTop: "80px",
        margin: "1rem",
      }}
    >
      <Card
        component="form"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          const { "jira-key": jiraKey, "jira-description": jiraDescription } =
            Object.fromEntries(
              (new FormData(event.currentTarget) as any).entries(),
            );
          const uuid = crypto.randomUUID();
          if (gameContext.user && gameContext.currGameId) {
            const newCard = {
              key: jiraKey,
              description: jiraDescription,
              id: uuid,
            }

            gameContext.setAvailableTickets?.(([
              ...gameContext.availableTickets || [],
              newCard
            ]));
            gameContext.wsClient.sendData({
              userMeta: gameContext.user,
              type: 'set-new-card',
              gameId: gameContext.currGameId,
              data: newCard
            })
          }
        }}
      >
        <CardContent>
          <Stack spacing={2}>
            <TextField
              id="outlined-basic"
              name="jira-key"
              label="Issue Key"
              variant="outlined"
              sx={{ width: "100%" }}
            />
            <TextField
              id="outlined-basic-2"
              multiline
              rows={4}
              name="jira-description"
              label="Issue description"
              variant="outlined"
            />
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: "center" }}>
          <Button type="submit">Add to refinement</Button>
        </CardActions>
      </Card>
      {gameContext.availableTickets?.map((item) => (
        <Card sx={{
          ...item.isSelected && {
            backgroundColor: (theme) =>
              theme.palette.secondary.light,
          }
        }}>
          <CardHeader
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title={item.key}
          />
          <CardContent>
            <Stack spacing={2}>
              <Typography>{item.description}</Typography>
            </Stack>
          </CardContent>
          <CardActions sx={{ justifyContent: "center" }}>
            <Button onClick={() => {
              if (gameContext.user && gameContext.currGameId) {
                gameContext.wsClient.sendData({
                  userMeta: gameContext.user,
                  type: 'vote-now',
                  gameId: gameContext.currGameId,
                  data: item
                })
              }
            }}>{item.isSelected ? 'Voting': 'Vote this issue'}</Button>
          </CardActions>
        </Card>
      ))}
    </Stack>
  );
};

export default AvailableJiraCards;
