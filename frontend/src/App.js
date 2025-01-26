import React from "react";
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
} from "@mui/material";
import AppRouter from "./router.js";

const App = () => {
  return (
    <div>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ChatSphere - Connect, Chat, and Share
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <AppRouter />
      </Container>
    </div>
  );
};

export default App;
