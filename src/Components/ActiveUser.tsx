import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { uniqueNamesGenerator, names } from "unique-names-generator";

const ActiveUser: React.FC<{
  isOpen: boolean;
  setIsOpen: (
    isOpen: boolean,
    data?: {
      name: string;
    },
  ) => void;
  defaultUserName?: string;
}> = ({ isOpen = false, setIsOpen, defaultUserName }) => {
  const characterName: string = uniqueNamesGenerator({
    dictionaries: [names],
  });
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          setIsOpen(
            false,
            Object.fromEntries((formData as any).entries()) as { name: string },
          );
        },
      }}
    >
      <DialogTitle>User info</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To properly use PPC with JIRA we need to know your name, please insert
          name to which your team lead will refer to you by.
        </DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          id="name"
          name="name"
          label="Name"
          type="text"
          fullWidth
          variant="standard"
          defaultValue={defaultUserName ?? characterName}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsOpen(false)}>Cancel</Button>
        <Button type="submit">Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActiveUser;
