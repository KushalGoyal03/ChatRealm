import React from "react";
import { Container, Typography, Box } from "@mui/material";

const Home = () => {
  return (
    <Container>
      <Box textAlign="center" mt={20}>
        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
          Welcome to ChatSphere
        </Typography>
        <Typography variant="subtitle1" mt={2}>
          Connect, Chat, and Share with your friends.
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;
