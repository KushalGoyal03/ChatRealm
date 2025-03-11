/* eslint-disable react/prop-types */
import { useState } from "react";
import { Box, Avatar, Typography, IconButton, TextField } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";

const ChatScreen = ({ selectedChat, setSelectedChat }) => {
  const [messages, setMessages] = useState({});
  const [currentMessage, setCurrentMessage] = useState("");

  const handleSendMessage = () => {
    if (!currentMessage.trim() || !selectedChat) return;

    setMessages((prevMessages) => ({
      ...prevMessages,
      [selectedChat.id]: [
        ...(prevMessages[selectedChat.id] || []),
        { text: currentMessage, sender: "You" },
      ],
    }));

    setCurrentMessage("");
  };

  return (
    <Box flexGrow={1} display="flex" flexDirection="column">
      {selectedChat ? (
        <>
          {/* Chat Header */}
          <Box
            display="flex"
            alignItems="center"
            p={1.5}
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              borderBottom: "2px solid #ddd",
            }}
          >
            <IconButton
              onClick={() => setSelectedChat(null)}
              sx={{ color: "white", mr: 1 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Avatar sx={{ bgcolor: "secondary.main", mr: 2 }}>
              {selectedChat.name[0].toUpperCase()}
            </Avatar>
            <Typography variant="h6">
              {selectedChat.name
                .replace(/_/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase())}
            </Typography>
          </Box>

          {/* Messages Display */}
          <Box
            flexGrow={1}
            p={2}
            sx={{
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {messages[selectedChat.id]?.length > 0 ? (
              messages[selectedChat.id].map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    padding: "10px",
                    borderRadius: "10px",
                    marginBottom: "10px",
                    maxWidth: "60%",
                    alignSelf: msg.sender === "You" ? "flex-end" : "flex-start",
                    backgroundColor:
                      msg.sender === "You" ? "#dcf8c6" : "#e5e5e5", // Fixed!
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold", color: "#333" }}
                  >
                    {msg.sender}
                  </Typography>
                  <Typography variant="body2">{msg.text}</Typography>
                </Box>
              ))
            ) : (
              <Typography
                variant="body1"
                color="textSecondary"
                sx={{ textAlign: "center", mt: 3 }}
              >
                Start a conversation...
              </Typography>
            )}
          </Box>

          {/* Message Input */}
          <Box
            display="flex"
            alignItems="center"
            p={1}
            sx={{
              backgroundColor: "white",
              borderTop: "1px solid #ddd",
            }}
          >
            <TextField
              fullWidth
              placeholder="Type a message..."
              variant="outlined"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
            />
            <IconButton color="primary" onClick={handleSendMessage}>
              <SendIcon />
            </IconButton>
          </Box>
        </>
      ) : (
        <Box
          flexGrow={1}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={{ backgroundColor: "#f5f5f5" }}
        >
          <img
            src="/images/logo.png"
            alt="ChatSphere Logo"
            style={{
              width: "60px",
              height: "auto",
              marginBottom: "15px",
              borderRadius: "50%",
            }}
          />
          <Typography
            variant="h4"
            color="primary.main"
            sx={{ fontWeight: "bold", mb: 1 }}
          >
            Welcome to ChatSphere
          </Typography>
          <Typography
            variant="h6"
            color="textSecondary"
            sx={{ fontWeight: "bold" }}
          >
            Select a chat to start messaging
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ChatScreen;
