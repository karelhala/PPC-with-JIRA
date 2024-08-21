import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const AvatarDropdown = () => {
  const [avatarEl, setAvatarEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleAvatarClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAvatarEl(e.currentTarget);
  };

  const handleAvatarClose = () => {
    setAvatarEl(null);
  };

  const open = Boolean(avatarEl);
  const id = open ? "simpe-popover" : undefined;

  const [token, setToken] = React.useState('');

  return (
    <div>
      <Button aria-describedby={id} onClick={handleAvatarClick}>
        <Avatar />
      </Button>

      <Popover
        id={id}
        open={open}
        anchorEl={avatarEl}
        onClose={handleAvatarClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
      >
        <List disablePadding>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary={token !== '' ? 'Log out' : 'Log in'} />
            </ListItemButton>
          </ListItem>
        </List>
      </Popover>
    </div>
  );
};

export default AvatarDropdown;
