import React from "react";
import { Container, Typography } from "@mui/material";

const Chat = () => {
  return (
    <Container>
      <Typography
        variant="h4"
        textAlign="center"
        mt={5}
        sx={{ marginTop: "10rem", fontWeight: "bold" }}
      >
        Chat Page - Start Chatting!
      </Typography>
    </Container>
  );
};

export default Chat;
