import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Avatar from "./Avatar";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import ActiveSession from "./ActiveGame";
import { GameContexType, GameContext } from "./utils/gameContext";
import ActiveUser from "./Components/ActiveUser";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import AvailableJiraCards from "./Components/AvailableJiraCards";

const drawerWidth: number = 480;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Dashboard() {
  const [game, setGame] = React.useState<GameContexType>({});
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  React.useEffect(() => {
    const userUUID = localStorage.getItem("ppc-with-jira-user-uuid");
    const userName = localStorage.getItem("ppc-with-jira-user-name");
    if (userUUID && userName) {
      setGame({
        user: {
          name: userName,
          uuid: userUUID,
        },
      });
    }
  }, []);
  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute">
          <Toolbar>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Dashboard
            </Typography>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={() => setIsDrawerOpen((isOpen) => !isOpen)}
            >
              <MenuIcon />
            </IconButton>
            <Avatar onSettingsClick={() => setIsOpen(true)} />
          </Toolbar>
        </AppBar>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <GameContext.Provider
            value={{
              ...(game || {}),
            }}
          >
            <BrowserRouter>
              <Routes>
                <Route path="/:id" element={<ActiveSession />} />
                <Route
                  path="/"
                  element={<HomePage onSetActiveUser={() => setIsOpen(true)} />}
                ></Route>
              </Routes>
            </BrowserRouter>
          </GameContext.Provider>
          <ActiveUser
            isOpen={isOpen}
            defaultUserName={game.user?.name}
            setIsOpen={(isOpen, values) => {
              const uuid = crypto.randomUUID();
              setIsOpen(isOpen);
              setGame({
                user: {
                  name: values?.name || "",
                  uuid,
                },
              });
            }}
          />
        </Box>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
            },
            ...(!isDrawerOpen && { display: "none" }),
          }}
          variant="persistent"
          anchor="right"
          open={isDrawerOpen}
        >
          <AvailableJiraCards />
        </Drawer>
      </Box>
    </ThemeProvider>
  );
}
