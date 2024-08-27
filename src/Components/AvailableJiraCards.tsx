import React, { RefObject } from "react";
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
import MoreVertIcon from '@mui/icons-material/MoreVert';

const AvailableJiraCards = () => {
  const [jiraIssues, setJiraIssues] = React.useState<{
    key?: string;
    description: string
  }[]>([]);
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
          const { 'jira-key': jiraKey, 'jira-description': jiraDescription } = Object.fromEntries(
            (new FormData(event.currentTarget) as any).entries(),
          );
          setJiraIssues((issues) => [...issues, {
            key: jiraKey,
            description: jiraDescription
          }]);
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
      {jiraIssues.map((item) => (<Card>
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
          <Button>Vote this issue</Button>
        </CardActions>
      </Card>))}
    </Stack>
  );
};

export default AvailableJiraCards;
