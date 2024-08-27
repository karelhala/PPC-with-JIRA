import React from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { GameContext } from "./utils/gameContext";

const HomePage: React.FC<{ onSetActiveUser: () => void }> = ({
  onSetActiveUser,
}) => {
  const navigate = useNavigate();
  const gameContext = React.useContext(GameContext);
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={8} lg={12}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 240,
            }}
          >
            Here be charts!
          </Paper>
        </Grid>
        {/* Recent Orders */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <Button
              onClick={() => {
                if (!gameContext.user) {
                  onSetActiveUser();
                }
                const uuid = crypto.randomUUID();
                gameContext.setCurrGame?.(uuid);
                navigate(`/${uuid}`);
              }}
            >
              Start new game!
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;
